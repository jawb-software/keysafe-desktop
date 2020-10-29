import Crypt from "../../DataBase/Security/Crypt";
import {calculateScore} from "../PasswordGenerator/pwanalyse";
import {deepCopy} from "../utils";

class Password {

    constructor(src) {
        this.id         = src._id || src.id;
        this.name       = src.name;
        this.lchash     = src.lchash;
        this.userName   = src.userName;
        this.password   = src.password;
        this.category   = src.category;
        this.profile    = src.profile;
        this.updatedAt  = src.updatedAt;
        this.score      = src.score; // als string
    }

    static createNew(name, userName, password, category, profileId){
        return new Password({
            name : name,
            userName : userName && userName.length > 0 ? userName : null,
            password : password,
            category : category,
            profile  : profileId,
            lchash   : Crypt.hash_sha1_lc(name),
            score : calculateScore(password).score().toString()
        });
    }

    clone() {
        return new Password(deepCopy(this));
    }

    apply(obj){
        for(const key in obj){
            if(!this.hasOwnProperty(key)){
                throw new Error("unknown key '" + key + "' in class Password");
            }

            const value = obj[key];

            if (key === 'password'){
                this[key] = value;
                this['score'] = calculateScore(value).score().toString();
            } else if (key === 'name'){
                this[key] = value;
                this['lchash'] = Crypt.hash_sha1_lc(value);
            }  else {
                this[key] = value;
            }
        }
        return this;
    }

    encrypt(cipher){
        this.lchash   = Crypt.hash_sha1_lc(this.name);
        this.name     = cipher.encrypt(this.name);
        this.userName = cipher.encrypt(this.userName);
        this.password = cipher.encrypt(this.password);
        this.score    = cipher.encrypt(this.score);
        return this;
    }

    /**
     *
     * @param cipher
     * @param viewConfiguration Profile
     */
    decrypt(cipher, viewConfiguration){
        this.name = cipher.decrypt(this.name);

        if(viewConfiguration){

            if(this.userName){ // kann leer sein
                this.userName = viewConfiguration && viewConfiguration.showUserName ? cipher.decrypt(this.userName) : '**********';
            }

            this.password = viewConfiguration && viewConfiguration.showPassword ? cipher.decrypt(this.password) : '**********';
            this.score    = viewConfiguration && viewConfiguration.showPasswordScore ? cipher.decrypt(this.score) : '';

        } else {
            this.userName = cipher.decrypt(this.userName);
            this.password = cipher.decrypt(this.password);
            this.score    = cipher.decrypt(this.score);
        }

        return this;
    }

    toDbDoc(){

        const obj = {};
        for(const key in this){

            if(key === 'updatedAt' || key === 'createdAt'){
                continue;
            }

            const value = this[key];
            if(key === 'id'){
                obj['_id'] = value;
            } else {
                obj[key] = value;
                if(key !== 'userName' && (value == null || typeof value === 'undefined')){
                    throw new Error("key '" + key + "' may not be empty");
                }
            }
        }
        return obj;
    }
}

export default Password;
