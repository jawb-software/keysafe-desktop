import I18n from "../Basic/I18n/i18n";
import Crypt from "./Security/Crypt";

class BackupFileReader {

    /**
     *
     * @param {BackupImportConfiguration} backupCfg
d     */
    static async readBackupFile(backupCfg){
        console.log('readBackupFile');

        if(backupCfg.passwordRequired && !backupCfg.passwordToDecrypt){
            throw new Error(I18n.backupImport_Error_NoRequiredPasswordSpecified());
        }

        const data = await BackupFileReader.readFileData(backupCfg.file);

        const backup    = JSON.parse(String(data));
        const tempCrypt = new Crypt(backupCfg.passwordToDecrypt);

        const decrypted = new Map();

        if(backup.hasOwnProperty('keys')) {

            //
            for (let categoryEnc in backup['keys']) {
                const categoryName = tempCrypt.decrypt(categoryEnc);
                const decryptedPWs = [];
                const passwords = backup.keys[categoryEnc];
                for (let i = 0; i < passwords.length; i++) {
                    const pw = passwords[i];
                    decryptedPWs.push({
                        name: tempCrypt.decrypt(pw.name),
                        password: tempCrypt.decrypt(pw.password),
                        userName: tempCrypt.decrypt(pw.userName)
                    });
                }
                decrypted.set(categoryName, decryptedPWs);
            }
        }

        return decrypted;
    }

    static async readFileData(file){

        return new Promise(function (resolve, reject) {
            const fs = require('fs');

            fs.readFile(file, 'utf-8', (err, data) => {
                if(err){
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });

    }

}

export default BackupFileReader;
