import CryptError from "../../Basic/Types/CryptError";

const crypto = require('crypto');

'use strict';

/**
 * AES 256 CBC Verschluesselung
 */
class Crypt {

    // TODO private: #symmetricKey, sessionKey

    constructor(password) {
        if(!password){
            throw new CryptError('password may not be empty');
        }
        this.sessionKey   = Crypt.random_string();
        this.algorithm    = 'aes-256-cbc';
        this.symmetricKey = Crypt._encrypt(this.sessionKey, this.algorithm, password);
    }

    clean() {
        this.symmetricKey = '';
        this.sessionKey = '';
    }

    isReady(){
        return this.symmetricKey.length > 0;
    }

    decrypt(encryptedText) {
        const symmetricKey = Crypt._decrypt(this.sessionKey, this.algorithm, this.symmetricKey);
        return Crypt._decrypt(symmetricKey, this.algorithm, encryptedText);
    }

    encrypt(plainText) {
        const symmetricKey = Crypt._decrypt(this.sessionKey, this.algorithm, this.symmetricKey);
        return Crypt._encrypt(symmetricKey, this.algorithm, plainText);
    }

    static base64(text){
        return Buffer.from(text).toString('base64');
    }

    static base64_sha1(text){
        return crypto.createHash('sha1').update(Crypt.base64(text)).digest('base64');
    }

    static hash_sha1_lc(text){
        return crypto.createHash('sha1').update(text.toLocaleLowerCase()).digest('base64');
    }

    static random_string(){
        return crypto.randomBytes(20).toString('hex');
    }

    // https://gist.github.com/almic/7007eafe54e44839635bfb8ce0b6942e
    static random_number(min, max) {

        const range = max - min;
        if (range >= Math.pow(2, 32)){
            throw new Error('Range is too large');
        }

        let tmp         = range;
        let bitsNeeded  = 0;
        let bytesNeeded = 0;
        let mask        = 1;

        while (tmp > 0) {
            if (bitsNeeded % 8 === 0){
                bytesNeeded += 1;
            }
            bitsNeeded += 1;
            mask = mask << 1 | 1;
            tmp = tmp >>> 1;
        }
        const randomBytes = crypto.randomBytes(bytesNeeded);
        let randomValue   = 0;

        for (let i = 0; i < bytesNeeded; i++) {
            randomValue |= randomBytes[i] << 8 * i
        }

        randomValue = randomValue & mask;

        if (randomValue <= range) {
            return min + randomValue
        } else {
            return Crypt.random_number(min, max);
        }
    }

    static _decrypt(symmetricKey, algorithm, encryptedText) {

        try {

            let parts = null;

            if(encryptedText.includes('#')){ // legacy code
                parts = encryptedText.split('#');
            } else {
                parts = Array(3);
                parts[0] = encryptedText.substring(0, 44);
                parts[1] = encryptedText.substring(44, 68);
                parts[2] = encryptedText.substring(68);
            }

            const salt = Buffer.from(parts[0], 'base64'); // 32 byte
            const iv   = Buffer.from(parts[1], 'base64'); // 16 byte
            const data = Buffer.from(parts[2], 'base64'); // 16 byte

            // erstelle ein 32 byte schluessel
            const key = crypto.pbkdf2Sync(symmetricKey, salt, 1000, 32, 'sha1');

            //
            const decipher = crypto.createDecipheriv(algorithm, key, iv);

            // entschluesseln
            return decipher.update(data, 'binary', 'utf8') + decipher.final('utf8');

        } catch (e) {
            throw new CryptError(e);
        }
    }

    static _encrypt(symmetricKey, algorithm, plainText) {

        const iv   = crypto.randomBytes(16);
        const salt = crypto.randomBytes(256 / 8);
        const key  = crypto.pbkdf2Sync(symmetricKey, salt, 1000, 32, 'sha1');

        const cipher = crypto.createCipheriv(algorithm, key, iv);

        // encrypt the given text
        const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);

        return Buffer.from(salt).toString('base64')
            + Buffer.from(iv).toString('base64')
            + Buffer.from(encrypted).toString('base64');
    }


}

export default Crypt;
