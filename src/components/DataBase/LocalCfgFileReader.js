const os = require('os');

class LocalCfgFileReader {

    static async readFileData(){

        const fs       = require('fs');
        const path     = require('path');
        const userHome = os.homedir();
        const file     = path.join(userHome, '.keysafe.cfg');

        if (!fs.existsSync(file)) {
            console.info(file + " not found");
            return null;
        }

        return new Promise(function (resolve, reject) {

            fs.readFile(file, 'utf-8', (err, data) => {
                if(err){
                    reject(err);
                } else {
                    resolve(JSON.parse(data));
                }
            });
        });

    }

}

export default LocalCfgFileReader;
