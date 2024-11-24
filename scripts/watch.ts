import chalk from 'chalk';
import * as child_process from 'child_process';
import chokidar from 'chokidar';
import { EventEmitter } from 'events';
import * as fs from 'fs';
import { join as pathJoin } from 'path';
import { getThisCodebaseRootDirPath } from './tools/getThisCodebaseRootDirPath';
import { createWaitForThrottle } from './tools/waitForThrottle';

(async () => {
  const postBuild = () => {
    {
      const packageJsonFilePath = pathJoin(getThisCodebaseRootDirPath(), 'package.json');

      const parsedPackageJson = JSON.parse(fs.readFileSync(packageJsonFilePath).toString('utf8')) as {
        version: string;
      };

      parsedPackageJson.version = `0.0.0-rc.${Date.now()}`;

      fs.writeFileSync(packageJsonFilePath, Buffer.from(JSON.stringify(parsedPackageJson, null, 2), 'utf8'));
    }

    console.log('@keycloakify/svelte Build complete');
    console.log(chalk.cyan(`@keycloakify/svelte Watching for file changes...`));
  };

  const eeBuildComplete = new EventEmitter();

  {
    const child = child_process.spawn('npx', ['svelte-package', '--watch'], {
      shell: true,
      cwd: getThisCodebaseRootDirPath(),
    });

    child.stdout.on('data', (data) => {
      if (data.toString('utf8').includes('Watching for file changes')) {
        eeBuildComplete.emit('');
        return;
      }

      process.stdout.write(data);
    });

    child.stderr.on('data', (data) => process.stderr.write(data));

    child.on('exit', (code) => process.exit(code ?? 0));
  }

  eeBuildComplete.on('', () => postBuild());

  await new Promise((resolve) => eeBuildComplete.once('', resolve));

  const { waitForThrottle } = createWaitForThrottle({ delay: 400 });

  chokidar
    .watch(
      ['bin', 'stories'].map((relativePath) => pathJoin(getThisCodebaseRootDirPath(), 'src', relativePath)),
      { ignoreInitial: true },
    )
    .on('all', async (event, path) => {
      console.log(chalk.bold(`${event}: ${path}`));

      await waitForThrottle();

      postBuild();
    });
})();
