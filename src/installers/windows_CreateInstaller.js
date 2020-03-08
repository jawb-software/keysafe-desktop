const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller;
const path = require('path');

getInstallerConfig()
    .then(createWindowsInstaller)
    .catch((error) => {
        console.error(error.message || error);
        process.exit(1);
    });

function getInstallerConfig () {
    console.log('creating windows installer');

    const rootPath = path.join('./');
    const outPath  = path.join(rootPath, 'dist', 'package');

    return Promise.resolve({
        appDirectory: path.join(outPath, 'keysafe-win32-x64'),
        authors: 'jawb software',
        noMsi: true,
        outputDirectory: path.join(outPath, 'windows-installer'),
        exe: 'keysafe-win32-x64.exe',
        setupExe: 'keysafe-win32-x64-AppInstaller.exe',
        setupIcon: path.join(rootPath, 'src', 'assets', 'win', 'logo.ico')
    })
}
