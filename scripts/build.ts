import chalk from 'chalk';
import { join } from 'path';
import { postBuild } from './shared/postBuild';
import { run } from './shared/run';
import { getThisCodebaseRootDirPath } from './tools/getThisCodebaseRootDirPath';

console.log(chalk.cyan(`Building @keycloakify/svelte...`));

const startTime = Date.now();

run('pnpm exec svelte-kit sync && rm -rf dist', {
  cwd: getThisCodebaseRootDirPath(),
});
run('pnpm exec svelte-package --input src --output dist/keycloakify-svelte', {
  cwd: getThisCodebaseRootDirPath(),
});
run('cp package.json dist/package.json && cp LICENSE dist/LICENSE && cp README.md dist/README.md', {
  cwd: getThisCodebaseRootDirPath(),
});
run('cp -r src dist/src', {
  cwd: getThisCodebaseRootDirPath(),
});
run('cp -r stories dist/stories', {
  cwd: getThisCodebaseRootDirPath(),
});
run('pnpm exec publint --pack npm', {
  cwd: join(getThisCodebaseRootDirPath(), 'dist'),
});
run('rm -rf dist/keycloakify-svelte/bin', {
  cwd: getThisCodebaseRootDirPath(),
});

postBuild();

console.log(chalk.green(`✓ built in ${((Date.now() - startTime) / 1000).toFixed(2)}s`));
