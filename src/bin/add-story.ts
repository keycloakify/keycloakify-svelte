import chalk from 'chalk';
import cliSelect from 'cli-select';
import * as fs from 'fs';
import { dirname as pathDirname, join as pathJoin, relative as pathRelative } from 'path';
import { assert, Equals } from 'tsafe/assert';
import { capitalize } from 'tsafe/capitalize';
import {
  ACCOUNT_THEME_PAGE_IDS,
  type AccountThemePageId,
  type BuildContext,
  LOGIN_THEME_PAGE_IDS,
  type LoginThemePageId,
  THEME_TYPES,
} from './core';
import { getThisCodebaseRootDirPath } from './tools/getThisCodebaseRootDirPath';
import { getIsPrettierAvailable, runPrettier } from './tools/runPrettier';

export async function command(params: { buildContext: BuildContext }) {
  const { buildContext } = params;

  console.log(chalk.cyan('Theme type:'));

  const themeType = await (async () => {
    const values = THEME_TYPES.filter((themeType) => {
      switch (themeType) {
        case 'account':
          return buildContext.implementedThemeTypes.account.isImplemented;
        case 'login':
          return buildContext.implementedThemeTypes.login.isImplemented;
        case 'admin':
          return false;
      }
      assert<Equals<typeof themeType, never>>(false);
    });

    assert(values.length > 0, 'No theme is implemented in this project');

    if (values.length === 1) {
      return values[0];
    }

    const { value } = await cliSelect({
      values,
    }).catch(() => {
      process.exit(-1);
    });

    return value;
  })();

  console.log(`→ ${themeType}`);

  console.log(chalk.cyan('Select the page you want to create a Storybook for:'));

  const { value: pageId } = await cliSelect<LoginThemePageId | AccountThemePageId>({
    values: (() => {
      switch (themeType) {
        case 'login':
          return [...LOGIN_THEME_PAGE_IDS];
        case 'account':
          return [...ACCOUNT_THEME_PAGE_IDS];
        case 'admin':
          return [];
      }
      assert<Equals<typeof themeType, never>>(false);
    })(),
  }).catch(() => {
    process.exit(-1);
  });

  console.log(`→ ${pageId}`);

  const componentBasename = capitalize(pageId.replace(/ftl$/, '')) + 'stories.svelte';

  const targetFilePath = pathJoin(buildContext.themeSrcDirPath, themeType, 'pages', componentBasename);

  if (fs.existsSync(targetFilePath)) {
    console.log(`${pathRelative(process.cwd(), targetFilePath)} already exists`);

    process.exit(-1);
  }

  let sourceCode = fs
    .readFileSync(pathJoin(getThisCodebaseRootDirPath(), 'stories', themeType, 'pages', componentBasename))
    .toString('utf8');

  run_prettier: {
    if (!(await getIsPrettierAvailable())) {
      break run_prettier;
    }

    sourceCode = await runPrettier({
      filePath: targetFilePath,
      sourceCode: sourceCode,
    });
  }

  {
    const targetDirPath = pathDirname(targetFilePath);

    if (!fs.existsSync(targetDirPath)) {
      fs.mkdirSync(targetDirPath, { recursive: true });
    }
  }

  fs.writeFileSync(targetFilePath, Buffer.from(sourceCode, 'utf8'));

  console.log(
    [
      `${chalk.green('✓')} ${chalk.bold(
        pathJoin('.', pathRelative(process.cwd(), targetFilePath)),
      )} copy pasted from the Keycloakify source code into your project`,
      `You can start storybook with ${chalk.bold('yarn run storybook')}`,
    ].join('\n'),
  );
}
