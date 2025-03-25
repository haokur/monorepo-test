import { Configuration } from 'electron-builder';
import path from 'path';
const isDevelopment = true;

const appDistPath = path.resolve(__dirname, '../apps/client/dist');

export const ElectronBuilderConfig: Configuration = {
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
