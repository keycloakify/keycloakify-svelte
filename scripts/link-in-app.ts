import { execSync } from 'child_process';
import * as fs from 'fs';
import { join as pathJoin, relative as pathRelative, sep as pathSep } from 'path';
import { getThisCodebaseRootDirPath } from './tools/getThisCodebaseRootDirPath';

const singletonDependencies: string[] = ['keycloakify', 'typescript', '@sveltejs/vite-plugin-svelte', 'svelte'];

// For example [ "@emotion" ] it's more convenient than
// having to list every sub emotion packages (@emotion/css @emotion/utils ...)
// in singletonDependencies
const namespaceSingletonDependencies: string[] = [];

const rootDirPath = getThisCodebaseRootDirPath();

const commonThirdPartyDeps = [
  ...namespaceSingletonDependencies
    .map((namespaceModuleName) =>
      fs
        .readdirSync(pathJoin(rootDirPath, 'node_modules', namespaceModuleName))
        .map((submoduleName) => `${namespaceModuleName}/${submoduleName}`),
    )
    .reduce((prev, curr) => [...prev, ...curr], []),
  ...singletonDependencies,
];

const thisPackageName = (
  JSON.parse(fs.readFileSync(pathJoin(rootDirPath, 'package.json')).toString('utf8')) as { name: string }
).name;

// We link through pnpm `overrides` (written in the test app's pnpm-workspace.yaml)
// rather than `pnpm link`: overrides apply to transitive dependencies too
// (e.g. the svelte required by @sveltejs/vite-plugin-svelte), so the singletons are
// truly shared, and the test app's package.json is left untouched.
const linkDependencies = (params: { testAppPath: string }) => {
  const { testAppPath } = params;

  const toLinkSpecifier = (targetDirPath: string) =>
    `link:${pathRelative(testAppPath, targetDirPath).split(pathSep).join('/')}`;

  const linkOverrides: Record<string, string> = {
    ...Object.fromEntries(
      commonThirdPartyDeps.map((dep) => [
        dep,
        toLinkSpecifier(pathJoin(rootDirPath, 'node_modules', ...dep.split('/'))),
      ]),
    ),
    [thisPackageName]: toLinkSpecifier(pathJoin(rootDirPath, 'dist')),
  };

  const runInTestApp = (cmd: string) => {
    console.log(`$ cd ${pathRelative(rootDirPath, testAppPath)} && ${cmd}`);

    return execSync(cmd, { cwd: testAppPath }).toString('utf8');
  };

  const existingOverrides = (JSON.parse(runInTestApp('pnpm config get --location project overrides --json')) ??
    {}) as Record<string, string>;

  const overrides = { ...existingOverrides, ...linkOverrides };

  runInTestApp(`pnpm config set --location project overrides ${JSON.stringify(JSON.stringify(overrides))} --json`);

  console.log(`$ cd ${pathRelative(rootDirPath, testAppPath)} && pnpm install`);

  execSync('pnpm install --no-frozen-lockfile', { cwd: testAppPath, stdio: 'inherit' });
};

const testAppPaths = (() => {
  const [, , ...testAppNames] = process.argv;

  return testAppNames
    .map((testAppName) => {
      const testAppPath = pathJoin(rootDirPath, '..', testAppName);

      if (fs.existsSync(testAppPath)) {
        return testAppPath;
      }

      console.warn(`Skipping ${testAppName} since it cant be found here: ${testAppPath}`);

      return undefined;
    })
    .filter((path): path is string => path !== undefined);
})();

if (testAppPaths.length === 0) {
  console.error('No test app to link into!');
  process.exit(-1);
}

testAppPaths.forEach((testAppPath) => {
  const packageJsonFilePath = pathJoin(testAppPath, 'package.json');

  const packageJsonContent = fs.readFileSync(packageJsonFilePath);

  const parsedPackageJson = JSON.parse(packageJsonContent.toString('utf8')) as {
    scripts?: Record<string, string>;
  };

  let hasPostInstallOrPrepareScript = false;

  if (parsedPackageJson.scripts !== undefined) {
    for (const scriptName of ['postinstall', 'prepare']) {
      if (parsedPackageJson.scripts[scriptName] === undefined) {
        continue;
      }

      hasPostInstallOrPrepareScript = true;

      delete parsedPackageJson.scripts[scriptName];
    }
  }

  if (hasPostInstallOrPrepareScript) {
    fs.writeFileSync(packageJsonFilePath, Buffer.from(JSON.stringify(parsedPackageJson, null, 2), 'utf8'));
  }

  const restorePackageJson = () => {
    if (!hasPostInstallOrPrepareScript) {
      return;
    }

    fs.writeFileSync(packageJsonFilePath, packageJsonContent);
  };

  try {
    linkDependencies({ testAppPath });
  } finally {
    restorePackageJson();
  }
});

testAppPaths.forEach((testAppPath) => {
  const { scripts = {} } = JSON.parse(fs.readFileSync(pathJoin(testAppPath, 'package.json')).toString('utf8')) as {
    scripts?: Record<string, string>;
  };

  for (const scriptName of ['postinstall', 'prepare']) {
    if (scripts[scriptName] === undefined) {
      continue;
    }

    execSync(`pnpm run ${scriptName}`, { cwd: testAppPath });
  }
});

testAppPaths.forEach((testAppPath) =>
  console.log(
    [
      `\nNOTE: ${pathRelative(rootDirPath, testAppPath)}/pnpm-workspace.yaml and pnpm-lock.yaml`,
      'now contain `link:` overrides, do not commit them.',
      'To unlink: revert those two files and run `pnpm install`.',
    ].join('\n'),
  ),
);

export {};
