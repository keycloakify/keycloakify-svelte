import chalk from 'chalk';
import * as child_process from 'child_process';

export function run(command: string, options?: { cwd: string }) {
  console.log(chalk.grey(`$ ${command}`));

  child_process.execSync(command, { stdio: 'inherit', ...options });
}
