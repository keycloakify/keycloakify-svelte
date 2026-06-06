import * as fs from 'fs';
import { BIN_NAME } from '../../src/bin/core';
import { join as pathJoin, relative as pathRelative, sep as pathSep } from 'path';
import { getThisCodebaseRootDirPath } from '../tools/getThisCodebaseRootDirPath';
import { run } from './run';

const distDirPath = pathJoin(getThisCodebaseRootDirPath(), 'dist', 'keycloakify-svelte');

export function postBuild() {
  const { packageJsonBinProperty } = buildBin();

  preparePackageJson({ packageJsonBinProperty });
}

function buildBin() {
  const binDirPath = pathJoin(getThisCodebaseRootDirPath(), 'src', 'bin');
  const distDirPath_bin = pathJoin(distDirPath, 'bin');

  fs.mkdirSync(distDirPath_bin, { recursive: true });

  const entrypointFilePath = pathJoin(binDirPath, 'main.ts');
  const outFilePath = pathJoin(distDirPath_bin, 'index.js');

  // ESM bundle needs a `require` for transitive `require()` of node built-ins
  // (e.g. cli-select's `require("readline")`). esbuild's __require shim throws
  // under pure ESM, so we restore `require` via createRequire.
  const banner = "import { createRequire } from 'module'; const require = createRequire(import.meta.url);";

  // The `direct-eval` warning comes from the intentional `eval` in
  // runPrettier.ts, which loads the consumer project's prettier by absolute
  // path while hiding it from the bundler. It's deliberate, so silence it.
  run(
    `npx esbuild ${entrypointFilePath} --bundle --minify --external:prettier --platform=node --format=esm --log-override:direct-eval=silent --banner:js="${banner}" --outfile=${outFilePath}`,
  );

  fs.chmodSync(
    outFilePath,
    fs.statSync(outFilePath).mode | fs.constants.S_IXUSR | fs.constants.S_IXGRP | fs.constants.S_IXOTH,
  );

  return {
    packageJsonBinProperty: {
      [BIN_NAME]: pathRelative(pathJoin(distDirPath, '..'), outFilePath).replaceAll(pathSep, '/'),
    },
  };
}

function preparePackageJson(params: { packageJsonBinProperty: { '_keycloakify-custom-handler': string } }) {
  const { packageJsonBinProperty } = params;

  const packageJsonParsed = JSON.parse(fs.readFileSync(pathJoin(distDirPath, '..', 'package.json')).toString('utf8'));

  packageJsonParsed.bin = packageJsonBinProperty;

  fs.writeFileSync(pathJoin(distDirPath, '..', 'package.json'), JSON.stringify(packageJsonParsed, null, 2));
}
