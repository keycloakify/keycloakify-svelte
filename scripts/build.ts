import chalk from 'chalk';
import { run } from './shared/run';
import { getThisCodebaseRootDirPath } from './tools/getThisCodebaseRootDirPath';

console.log(chalk.cyan(`Building @keycloakify/svelte...`));

const startTime = Date.now();

run('npx svelte-kit sync && rm -rf dist && npx svelte-package && npx publint', { cwd: getThisCodebaseRootDirPath() });

console.log(chalk.green(`✓ built in ${((Date.now() - startTime) / 1000).toFixed(2)}s`));
