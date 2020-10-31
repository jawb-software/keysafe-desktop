
class BackupImportConfiguration {

    constructor(file, fileContent) {

        const backup = JSON.parse(fileContent);

        let passwordCount   = 0;
        let categoriesCount = 0;
        const version       = backup['version'];

        if(version === 2){

            const categories = backup.profiles[0].categories;
            for (let i = 0; i < categories.length; i++){
                passwordCount += categories[i].keys.length;
            }
            categoriesCount = categories.length;
            this.version = 2;
            this.passwordRequired = true;

        } else {

            if(backup.hasOwnProperty('keys')){
                for (let categoryEnc in backup.keys){
                    passwordCount += backup.keys[categoryEnc].length;
                    categoriesCount++;
                }
            }

            this.version = 1;
            this.passwordRequired = backup.encrypted;
        }

        this.created    = backup.created;
        this.passwords  = passwordCount;
        this.categories = categoriesCount;
        this.passwordToDecrypt = null;
        this.file = file;
    }

}

export default BackupImportConfiguration;
