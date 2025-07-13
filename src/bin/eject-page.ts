#!/usr/bin/env node

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
import { kebabCaseToCamelCase } from './tools/kebabCaseToSnakeCase';
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
          return buildContext.implementedThemeTypes.admin.isImplemented;
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

  console.log(chalk.cyan('Select the page you want to customize:'));

  const templateValue = 'Template.svelte (Layout common to every page)';
  const userProfileFormFieldsValue =
    'UserProfileFormFields.svelte (Renders the form of the register.ftl, login-update-profile.ftl, update-email.ftl and idp-review-user-profile.ftl)';
  const otherPageValue = "The page you're looking for isn't listed here";

  const { value: pageIdOrComponent } = await cliSelect<
    | LoginThemePageId
    | AccountThemePageId
    | typeof templateValue
    | typeof userProfileFormFieldsValue
    | typeof otherPageValue
  >({
    values: (() => {
      switch (themeType) {
        case 'login':
          return [templateValue, userProfileFormFieldsValue, ...LOGIN_THEME_PAGE_IDS, otherPageValue];
        case 'account':
          return [templateValue, ...ACCOUNT_THEME_PAGE_IDS, otherPageValue];
        case 'admin':
          return [];
      }
      assert<Equals<typeof themeType, never>>(false);
    })(),
  }).catch(() => {
    process.exit(-1);
  });

  if (pageIdOrComponent === otherPageValue) {
    console.log(
      [
        'To style a page not included in the base Keycloak, such as one added by a third-party Keycloak extension,',
        'refer to the documentation: https://docs.keycloakify.dev/features/styling-a-custom-page-not-included-in-base-keycloak',
      ].join(' '),
    );

    process.exit(0);
  }

  console.log(`→ ${pageIdOrComponent}`);

  const componentBasenames = (() => {
    if (pageIdOrComponent === templateValue) {
      return ['Template.svelte'];
    }

    if (pageIdOrComponent === userProfileFormFieldsValue) {
      return [
        'UserProfileFormFields.svelte',
        'InputFieldByType.svelte',
        'LogoutOtherSessions.svelte',
        'PasswordWrapper.svelte',
        'AddRemoveButtonsMultiValuedAttribute.svelte',
        'SelectTag.svelte',
        'FieldErrors.svelte',
        'InputTag.svelte',
        'TermsAcceptance.svelte',
        'GroupLabel.svelte',
        'InputTagSelects.svelte',
        'TextareaTag.svelte',
        'InputFieldByTypeProps.ts',
        'UserProfileFormFieldsProps.ts',
      ];
    }

    return [capitalize(kebabCaseToCamelCase(pageIdOrComponent)).replace(/ftl$/, 'svelte')];
  })();

  const pagesOrDot = (() => {
    if (pageIdOrComponent === templateValue) {
      return '.';
    } else if (pageIdOrComponent === userProfileFormFieldsValue) {
      return 'components';
    }

    return 'pages';
  })();

  for (const componentBasename of componentBasenames) {
    const targetFilePath = pathJoin(buildContext.themeSrcDirPath, themeType, pagesOrDot, componentBasename);

    if (fs.existsSync(targetFilePath)) {
      console.log(
        `${pageIdOrComponent} is already ejected, ${pathRelative(process.cwd(), targetFilePath)} already exists`,
      );

      process.exit(-1);
    }

    let componentCode = fs
      .readFileSync(pathJoin(getThisCodebaseRootDirPath(), 'src', themeType, pagesOrDot, componentBasename))
      .toString('utf8');
    if (userProfileFormFieldsValue) {
      componentCode = componentCode.replace(
        new RegExp(
          `from '@keycloakify/svelte/login/components/(${componentBasenames.join('|').replace(/\.ts/g, '')})`,
          'g',
        ),
        `from './$1`,
      );
    }

    run_prettier: {
      if (!(await getIsPrettierAvailable())) {
        break run_prettier;
      }

      componentCode = await runPrettier({
        filePath: targetFilePath,
        sourceCode: componentCode,
      });
    }

    {
      const targetDirPath = pathDirname(targetFilePath);

      if (!fs.existsSync(targetDirPath)) {
        fs.mkdirSync(targetDirPath, { recursive: true });
      }
    }

    fs.writeFileSync(targetFilePath, Buffer.from(componentCode, 'utf8'));

    console.log(
      `${chalk.green('✓')} ${chalk.bold(
        pathJoin('.', pathRelative(process.cwd(), targetFilePath)),
      )} copy pasted from the Keycloakify source code into your project`,
    );
  }

  edit_KcPage: {
    if (pageIdOrComponent !== templateValue && pageIdOrComponent !== userProfileFormFieldsValue) {
      break edit_KcPage;
    }

    const kcAppSveltePath = pathJoin(buildContext.themeSrcDirPath, themeType, 'KcPage.svelte');

    const kcAppSvelteCode = fs.readFileSync(kcAppSveltePath).toString('utf8');

    const modifiedKcAppSvelteCode = (() => {
      switch (pageIdOrComponent) {
        case templateValue:
          return kcAppSvelteCode.replace(`@keycloakify/svelte/${themeType}/Template`, './Template');
        case userProfileFormFieldsValue:
          return kcAppSvelteCode.replace(
            `@keycloakify/svelte/login/components/UserProfileFormFields`,
            './components/UserProfileFormFields',
          );
      }
      assert<Equals<typeof pageIdOrComponent, never>>(false);
    })();

    if (kcAppSvelteCode === modifiedKcAppSvelteCode) {
      console.log(chalk.red('Unable to automatically update KcPage.svelte, please update it manually'));
      return;
    }

    fs.writeFileSync(kcAppSveltePath, Buffer.from(modifiedKcAppSvelteCode, 'utf8'));

    console.log(
      `${chalk.green('✓')} ${chalk.bold(pathJoin('.', pathRelative(process.cwd(), kcAppSveltePath)))} Updated`,
    );

    return;
  }

  console.log(
    [
      ``,
      `You now need to update your page router:`,
      ``,
      `${chalk.bold(
        pathJoin('.', pathRelative(process.cwd(), buildContext.themeSrcDirPath), themeType, 'KcPage.svelte'),
      )}:`,
      chalk.grey('```'),
      `// ...`,
      ``,
      ...(() => {
        let inGreenBlock = false;
        return [
          ` const page = async () => {`,
          `   switch (kcContext.pageId) {`,
          `+`,
          `    case '${pageIdOrComponent}':`,
          `      return import('./pages/${componentBasenames[0]}');`,
          `+`,
          `     //...`,
          `     default:`,
          `       return import('@keycloakify/svelte/login/DefaultPage.svelte');`,
          `   }`,
          ` }`,
        ].map((line) => {
          if (line === `+`) {
            inGreenBlock = !inGreenBlock;
          }
          if (inGreenBlock || line.startsWith('+')) {
            return chalk.green(line);
          }
          if (line.startsWith('-')) {
            return chalk.red(line);
          }
          return chalk.grey(line);
        });
      })(),
      chalk.grey('```'),
    ].join('\n'),
  );
}
