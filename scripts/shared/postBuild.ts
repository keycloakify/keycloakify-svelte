import * as fs from 'fs';
import { BIN_NAME } from 'keycloakify/bin/shared/customHandler';
import { dirname as pathDirname, join as pathJoin, relative as pathRelative, sep as pathSep } from 'path';
import { transformCodebase } from '../../src/bin/tools/transformCodebase';
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

  fs.cpSync(binDirPath, distDirPath_bin, { recursive: true });

  const nccOutDirPath = pathJoin(distDirPath_bin, 'ncc_out');

  const entrypointFilePath = pathJoin(distDirPath_bin, 'main.ts');

  run(`npx ncc build ${entrypointFilePath} --external prettier -t -o ${nccOutDirPath}`);

  transformCodebase({
    srcDirPath: distDirPath_bin,
    destDirPath: distDirPath_bin,
    transformSourceCode: ({ filePath, sourceCode }) => {
      if (filePath.startsWith(nccOutDirPath)) {
        return { modifiedSourceCode: sourceCode };
      }

      return undefined;
    },
  });

  const newEntrypointFilePath = entrypointFilePath.replace('main.ts', 'index.js');

  fs.readdirSync(nccOutDirPath).forEach((basename) => {
    const destFilePath =
      basename === 'index.js' ? newEntrypointFilePath : pathJoin(pathDirname(newEntrypointFilePath), basename);
    const srcFilePath = pathJoin(nccOutDirPath, basename);

    fs.cpSync(srcFilePath, destFilePath);
  });

  fs.rmSync(nccOutDirPath, { recursive: true });

  fs.chmodSync(
    newEntrypointFilePath,
    fs.statSync(newEntrypointFilePath).mode | fs.constants.S_IXUSR | fs.constants.S_IXGRP | fs.constants.S_IXOTH,
  );

  return {
    packageJsonBinProperty: {
      [BIN_NAME]: pathRelative(pathJoin(distDirPath, '..'), newEntrypointFilePath).replaceAll(pathSep, '/'),
    },
  };
}

function preparePackageJson(params: { packageJsonBinProperty: { '_keycloakify-custom-handler': string } }) {
  const { packageJsonBinProperty } = params;

  const packageJsonParsed = JSON.parse(fs.readFileSync(pathJoin(distDirPath, '..', 'package.json')).toString('utf8'));

  packageJsonParsed.bin = packageJsonBinProperty;

  fs.writeFileSync(pathJoin(distDirPath, '..', 'package.json'), JSON.stringify(packageJsonParsed, null, 2));
}
