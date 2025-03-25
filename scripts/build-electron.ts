import { build } from 'electron-builder';
import { Configuration } from 'electron-builder';
import path from 'path';
const isDevelopment = true;
// import { ElectronBuilderConfig } from './electron-builder.config';
const appDistPath = path.resolve(__dirname, '../apps/client');

const ElectronBuilderConfig: Configuration = {
    appId: 'com.electron.starter',
    asar: !isDevelopment,
    directories: {
        app: appDistPath,
        output: 'release',
    },
    publish: [
        {
            provider: 'generic',
            url: 'https://static.haokur.com/electron-app/',
        },
    ],
    mac: {
        target: !isDevelopment ? ['dir'] : ['dir', 'dmg'],
    },
    nsis: {
        oneClick: false,
        perMachine: false,
        allowToChangeInstallationDirectory: true,
        shortcutName: 'Electron App',
    },
    win: {
        target: 'nsis',
    },
    linux: {
        target: ['snap'],
    },
    files: [],
};

build({ config: ElectronBuilderConfig })
    .then(() => {
        console.log('打包成功', 'build-electron.ts::6行');
    })
    .catch((err) => {
        console.log(err, 'build-electron.ts::8行');
    });
