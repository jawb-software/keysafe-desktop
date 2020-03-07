import {
    CHARS_LC,
    CHARS_NR,
    CHARS_SPECIAL, CHARS_UP,
    PW_GENERATOR_DEFAULT_PW_LENGTH,
    PW_GENERATOR_DEFAULT_PW_SCORE
} from "../consts";

class PasswordGeneratorConfiguration {

    static get KEY_NAME_USE_UC() { return 'useUpperCases'; }
    static get KEY_NAME_UC() { return 'upperCases'; }
    static get KEY_NAME_USE_LC() { return 'useLowerCases'; }
    static get KEY_NAME_LC() { return 'lowerCases'; }
    static get KEY_NAME_USE_DIGITS() { return 'useDigits'; }
    static get KEY_NAME_DIGITS() { return 'digits'; }
    static get KEY_NAME_USE_SYM() { return 'useSymbols'; }

    static get KEY_NAME_PW_LENGTH() { return 'passwordLength'; }
    static get KEY_NAME_PW_SCORE() { return 'minPasswordScore'; }

    constructor(src) {

        if(src){

            this.useUpperCases    = src.useUpperCases;
            this.upperCases       = src.upperCases;

            this.useLowerCases    = src.useLowerCases;
            this.lowerCases       = src.lowerCases;

            this.useDigits        = src.useDigits;
            this.digits           = src.digits;

            this.useSymbols       = src.useSymbols;
            this.symbols          = src.symbols;

            this.passwordLength   = src.passwordLength;
            this.minPasswordScore = src.minPasswordScore;

        } else {

            this.useUpperCases    = 'true';
            this.upperCases       = CHARS_UP;

            this.useLowerCases    = 'true';
            this.lowerCases       = CHARS_LC;

            this.useDigits        = 'true';
            this.digits           = CHARS_NR;

            this.useSymbols       = 'true';
            this.symbols          = CHARS_SPECIAL;

            this.passwordLength   = String(PW_GENERATOR_DEFAULT_PW_LENGTH);
            this.minPasswordScore = String(PW_GENERATOR_DEFAULT_PW_SCORE);

        }

    }

    isLCEnabled(){
        return this.useLowerCases === 'true';
    }

    isUCEnabled(){
        return this.useUpperCases === 'true';
    }

    isNrEnabled(){
        return this.useDigits === 'true';
    }

    isSymEnabled(){
        return this.useSymbols === 'true';
    }

    requiredMinScore(){
        return Number(this.minPasswordScore);
    }

    requiredLength(){
        return Number(this.passwordLength);
    }

    chars(){
        let chars = '';

        if(this.useUpperCases === 'true'){  chars += this.upperCases; }
        if(this.useLowerCases === 'true'){  chars += this.lowerCases; }
        if(this.useDigits     === 'true'){  chars += this.digits; }
        if(this.useSymbols    === 'true'){  chars += this.symbols; }

        if(chars.length === 0){
            throw new Error("Bad configuration. all properties are off.");
        }

        return chars;
    }

    apply(src){

        if(src){
            for(const key in src) {
                if (!this.hasOwnProperty(key)) {
                    throw new Error("unknown key '" + key + "' in class PasswordGeneratorConfiguration");
                }

                this[key] = String(src[key]);
            }
        }

    }

    encrypt(cipher){
        this.useUpperCases  = cipher.encrypt(this.useUpperCases);
        this.upperCases     = cipher.encrypt(this.upperCases);

        this.useLowerCases  = cipher.encrypt(this.useLowerCases);
        this.lowerCases     = cipher.encrypt(this.lowerCases);

        this.useDigits      = cipher.encrypt(this.useDigits);
        this.digits         = cipher.encrypt(this.digits);

        this.useSymbols     = cipher.encrypt(this.useSymbols);
        this.symbols        = cipher.encrypt(this.symbols);

        this.passwordLength   = cipher.encrypt(this.passwordLength);
        this.minPasswordScore = cipher.encrypt(this.minPasswordScore);

        return this;
    }

    decrypt(cipher){

        if('true' === this.useUpperCases || 'false' === this.useUpperCases){
            console.log("ERROR: useUpperCases already decrypted!!!!");
            throw new Error("already descrypted");
        }

        this.useUpperCases = cipher.decrypt(this.useUpperCases);

        this.upperCases    = cipher.decrypt(this.upperCases);

        this.useLowerCases = cipher.decrypt(this.useLowerCases);
        this.lowerCases    = cipher.decrypt(this.lowerCases);

        this.useDigits     = cipher.decrypt(this.useDigits);
        this.digits        = cipher.decrypt(this.digits);

        this.useSymbols    = cipher.decrypt(this.useSymbols);
        this.symbols       = cipher.decrypt(this.symbols);

        this.passwordLength   = cipher.decrypt(this.passwordLength);
        this.minPasswordScore = cipher.decrypt(this.minPasswordScore);

        return this;
    }

}

export default PasswordGeneratorConfiguration;
