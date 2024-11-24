#!/usr/bin/env node
/* eslint-disable @typescript-eslint/ban-ts-comment */

import chalk from 'chalk';
import cliSelect from 'cli-select';
import * as fs from 'fs';
import {
  basename as pathBase,
  dirname as pathDirname,
  join as pathJoin,
  posix as pathPosix,
  relative as pathRelative,
  sep as pathSep,
} from 'path';
import { assert, Equals } from 'tsafe/assert';
import { capitalize } from 'tsafe/capitalize';
import {
  ACCOUNT_THEME_PAGE_IDS,
  type AccountThemePageId,
  type BuildContext,
  LOGIN_THEME_PAGE_IDS,
  type LoginThemePageId,
  THEME_TYPES,
  type ThemeType,
} from './core';
import { getThisCodebaseRootDirPath } from './tools/getThisCodebaseRootDirPath';
import { getIsPrettierAvailable, runPrettier } from './tools/runPrettier';
import { replaceAll } from './tools/String.prototype.replaceAll';
import { transformCodebase } from './tools/transformCodebase_async';

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
      }
      // @ts-ignore
      assert<Equals<typeof themeType, never>>(false);
    });

    assert(values.length > 0, 'No theme is implemented in this project');

    if (values.length === 1) {
      return values[0];
    }

    const { value } = await cliSelect<ThemeType>({
      values,
    }).catch(() => {
      process.exit(-1);
    });

    return value;
  })();

  console.log(`→ ${themeType}`);

  console.log(chalk.cyan('Select the page you want to customize:'));

  const templateValue = 'template.ftl (Layout common to every page)';
  const userProfileFormFieldsValue =
    'user-profile-commons.ftl (Renders the form of the register.ftl, login-update-profile.ftl, update-email.ftl and idp-review-user-profile.ftl)';

  const { value: pageIdOrComponent } = await cliSelect<
    LoginThemePageId | AccountThemePageId | typeof templateValue | typeof userProfileFormFieldsValue
  >({
    values: (() => {
      switch (themeType) {
        case 'login':
          return [templateValue, userProfileFormFieldsValue, ...LOGIN_THEME_PAGE_IDS];
        case 'account':
          return [templateValue, ...ACCOUNT_THEME_PAGE_IDS];
      }
      // @ts-ignore
      assert<Equals<typeof themeType, never>>(false);
    })(),
  }).catch(() => {
    process.exit(-1);
  });

  console.log(`→ ${pageIdOrComponent}`);

  const componentRelativeDirPath_posix_to_componentRelativeFilePath_posix = (params: {
    componentRelativeDirPath_posix: string;
  }) => {
    const { componentRelativeDirPath_posix } = params;
    return `${componentRelativeDirPath_posix}/${pathPosix.basename(componentRelativeDirPath_posix)}.component`;
  };

  const componentDirRelativeToThemeTypePath = (() => {
    if (pageIdOrComponent === templateValue) {
      return pathJoin('Template');
    }

    if (pageIdOrComponent === userProfileFormFieldsValue) {
      return pathJoin('components', 'UserProfileFormFields');
    }

    return pathJoin('pages', capitalize(pageIdOrComponent.replace(/\.ftl$/, '')));
  })();

  {
    const componentDirRelativeToThemeTypePaths = [componentDirRelativeToThemeTypePath];

    while (componentDirRelativeToThemeTypePaths.length !== 0) {
      const componentDirRelativeToThemeTypePath_i = componentDirRelativeToThemeTypePaths.pop();

      assert(componentDirRelativeToThemeTypePath_i !== undefined);

      const destDirPath = pathJoin(buildContext.themeSrcDirPath, themeType, componentDirRelativeToThemeTypePath_i);

      const dirName = pathBase(destDirPath);
      const tsFilePath = pathJoin(destDirPath, `${dirName}.svelte`);
      if (fs.existsSync(destDirPath) && fs.readdirSync(destDirPath).length !== 0) {
        // Check if the directory contains a .ts file with the same name as the directory
        if (fs.existsSync(tsFilePath)) {
          if (componentDirRelativeToThemeTypePath_i === componentDirRelativeToThemeTypePath) {
            console.log(
              `${pageIdOrComponent.split('.ftl')[0]} is already ejected, ${pathRelative(
                process.cwd(),
                destDirPath,
              )} already exists and contains ${dirName}.svelte`,
            );
            process.exit(-1);
          }
          continue;
        }
      }

      const localThemeTypeDirPath = pathJoin(getThisCodebaseRootDirPath(), 'src', themeType);

      await transformCodebase({
        srcDirPath: pathJoin(localThemeTypeDirPath, componentDirRelativeToThemeTypePath_i),
        destDirPath,
        transformSourceCode: async ({ filePath, fileRelativePath, sourceCode }) => {
          if (filePath.endsWith('index.ts')) {
            return undefined;
          }
          if (filePath.endsWith('.ts')) {
            let modifiedSourceCode_str = sourceCode.toString('utf8');

            run_prettier: {
              if (!(await getIsPrettierAvailable())) {
                break run_prettier;
              }

              modifiedSourceCode_str = await runPrettier({
                filePath: pathJoin(destDirPath, fileRelativePath),
                sourceCode: modifiedSourceCode_str,
              });
            }

            return {
              modifiedSourceCode: Buffer.from(modifiedSourceCode_str, 'utf8'),
            };
          }
          const fileRelativeToThemeTypePath = pathRelative(localThemeTypeDirPath, filePath);

          let modifiedSourceCode_str = sourceCode.toString();

          const getPosixPathRelativeToFile = (params: { pathRelativeToThemeType: string }) => {
            const { pathRelativeToThemeType } = params;

            const path = pathRelative(pathDirname(fileRelativeToThemeTypePath), pathRelativeToThemeType)
              .split(pathSep)
              .join('/');

            return path.startsWith('.') ? path : `./${path}`;
          };

          modifiedSourceCode_str = replaceAll(
            modifiedSourceCode_str,
            `@keycloakify/svelte/${themeType}/i18n`,
            getPosixPathRelativeToFile({
              pathRelativeToThemeType: 'i18n',
            }),
          );

          modifiedSourceCode_str = replaceAll(
            modifiedSourceCode_str,
            `@keycloakify/svelte/${themeType}/KcContext`,
            getPosixPathRelativeToFile({
              pathRelativeToThemeType: 'KcContext',
            }),
          );

          modifiedSourceCode_str = modifiedSourceCode_str.replace(
            new RegExp(`@keycloakify/svelte/${themeType}/components/([^'"]+)`, 'g'),
            (...[, componentDirRelativeToComponentsPath]) => {
              const componentDirRelativeToThemeTypePath = pathJoin('components', componentDirRelativeToComponentsPath);

              componentDirRelativeToThemeTypePaths.push(componentDirRelativeToThemeTypePath);

              return componentRelativeDirPath_posix_to_componentRelativeFilePath_posix({
                componentRelativeDirPath_posix: getPosixPathRelativeToFile({
                  pathRelativeToThemeType: componentDirRelativeToThemeTypePath,
                }),
              });
            },
          );

          run_prettier: {
            if (!(await getIsPrettierAvailable())) {
              break run_prettier;
            }

            modifiedSourceCode_str = await runPrettier({
              filePath: pathJoin(destDirPath, fileRelativePath),
              sourceCode: modifiedSourceCode_str,
            });
          }

          return {
            modifiedSourceCode: Buffer.from(modifiedSourceCode_str, 'utf8'),
          };
        },
      });

      console.log(
        `${chalk.green('✓')} ${chalk.bold(
          `.${pathSep}` + pathRelative(process.cwd(), destDirPath),
        )} moved from the @keycloakify/svelte to your project`,
      );
    }
  }

  edit_KcPage: {
    if (pageIdOrComponent !== templateValue && pageIdOrComponent !== userProfileFormFieldsValue) {
      break edit_KcPage;
    }

    const kcAppTsFilePath = pathJoin(buildContext.themeSrcDirPath, themeType, 'KcPage.svelte');

    const kcAppTsCode = fs.readFileSync(kcAppTsFilePath).toString('utf8');

    const modifiedKcAppTsCode = await (async () => {
      const componentRelativeDirPath_posix = componentDirRelativeToThemeTypePath.split(pathSep).join('/');

      let sourceCode = kcAppTsCode.replace(
        `@keycloakify/svelte/${themeType}/${componentRelativeDirPath_posix}`,
        componentRelativeDirPath_posix_to_componentRelativeFilePath_posix({
          componentRelativeDirPath_posix: `./${componentRelativeDirPath_posix}`,
        }),
      );

      run_prettier: {
        if (!(await getIsPrettierAvailable())) {
          break run_prettier;
        }

        sourceCode = await runPrettier({
          filePath: kcAppTsFilePath,
          sourceCode,
        });
      }

      return sourceCode;
    })();

    if (modifiedKcAppTsCode === kcAppTsCode) {
      console.log(chalk.red('Unable to automatically update KcPage.svelte, please update it manually'));
      return;
    }

    fs.writeFileSync(kcAppTsFilePath, Buffer.from(modifiedKcAppTsCode, 'utf8'));

    console.log(
      `${chalk.green('✓')} ${chalk.bold(`.${pathSep}` + pathRelative(process.cwd(), kcAppTsFilePath))} Updated`,
    );

    return;
  }

  const pageId = pageIdOrComponent;

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
          `    case '${pageId}':`,
          `      return import('${componentRelativeDirPath_posix_to_componentRelativeFilePath_posix({
            componentRelativeDirPath_posix: `./${componentDirRelativeToThemeTypePath.split(pathSep).join('/')}`,
          })}');`,
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
