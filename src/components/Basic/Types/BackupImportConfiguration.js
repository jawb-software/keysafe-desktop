
class BackupImportConfiguration {

    constructor(file, fileContent) {

        const backup = JSON.parse(fileContent);

        let passwordCount   = 0;
        let categoriesCount = 0;

        if(backup.hasOwnProperty('keys')){
            for (let categoryEnc in backup.keys){
                passwordCount += backup.keys[categoryEnc].length;
                categoriesCount++;
            }
        }

        this.created = new Date(backup.created);
        this.passwordRequired = backup.encrypted;
        this.passwords = passwordCount;
        this.categories = categoriesCount;
        this.passwordToDecrypt = null;
        this.file = file;
    }

}

export default BackupImportConfiguration;