import * as fs from 'fs';
import { BIN_NAME } from 'keycloakify/bin/shared/customHandler';
import { dirname as pathDirname, join as pathJoin, relative as pathRelative, sep as pathSep } from 'path';
import { transformCodebase } from '../../src/bin/tools/transformCodebase';
import { getThisCodebaseRootDirPath } from '../tools/getThisCodebaseRootDirPath';
import { run } from './run';

const distDirPath = pathJoin(getThisCodebaseRootDirPath(), 'dist');

export function postBuild() {
  buildBin();
}

function buildBin() {
  const binDirPath = pathJoin(getThisCodebaseRootDirPath(), 'src', 'bin');
  const distDirPath_bin = pathJoin(distDirPath, 'bin');

  run(`npx tsc -p ${binDirPath} --outDir ${distDirPath_bin}`);

  const nccOutDirPath = pathJoin(distDirPath_bin, 'ncc_out');

  const entrypointFilePath = pathJoin(distDirPath_bin, 'main.js');

  run(`npx ncc build ${entrypointFilePath} --external prettier -o ${nccOutDirPath}`);

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

  fs.readdirSync(nccOutDirPath).forEach((basename) => {
    const destFilePath =
      basename === 'index.js' ? entrypointFilePath : pathJoin(pathDirname(entrypointFilePath), basename);
    const srcFilePath = pathJoin(nccOutDirPath, basename);

    fs.cpSync(srcFilePath, destFilePath);
  });

  fs.rmSync(nccOutDirPath, { recursive: true });

  fs.chmodSync(
    entrypointFilePath,
    fs.statSync(entrypointFilePath).mode | fs.constants.S_IXUSR | fs.constants.S_IXGRP | fs.constants.S_IXOTH,
  );

  return {
    packageJsonBinProperty: {
      [BIN_NAME]: pathRelative(distDirPath, entrypointFilePath).replaceAll(pathSep, '/'),
    },
  };
}
