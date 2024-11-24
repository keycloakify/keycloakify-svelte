import chalk from 'chalk';
import { postBuild } from './shared/postBuild';
import { run } from './shared/run';
import { getThisCodebaseRootDirPath } from './tools/getThisCodebaseRootDirPath';

console.log(chalk.cyan(`Building @keycloakify/svelte...`));

const startTime = Date.now();

run('npx svelte-kit sync && rm -rf dist && npx svelte-package --input src && npx publint', {
  cwd: getThisCodebaseRootDirPath(),
});
run('rm -rf dist/bin', {
  cwd: getThisCodebaseRootDirPath(),
});

postBuild();

console.log(chalk.green(`✓ built in ${((Date.now() - startTime) / 1000).toFixed(2)}s`));
