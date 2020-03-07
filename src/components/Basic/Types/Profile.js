import PropTypes from 'prop-types';
import PasswordGeneratorConfiguration from "./PasswordGeneratorConfiguration";
import ViewConfiguration from "./ViewConfiguration";
import {deepCopy} from "../utils";
import SessionConfiguration from "./SessionConfiguration";

const propTypes = {
    id:             PropTypes.string,
    name:           PropTypes.string,
    categoryId:     PropTypes.string,
    cryptCheck:     PropTypes.string,
    sessionConfiguration: PropTypes.instanceOf(SessionConfiguration),
    viewConfiguration: PropTypes.instanceOf(ViewConfiguration),
    passwordGeneratorConfiguration : PropTypes.instanceOf(PasswordGeneratorConfiguration),
    lastLogin:      PropTypes.instanceOf(Date),
    currentLogin:   PropTypes.instanceOf(Date),
    updatedAt:   PropTypes.instanceOf(Date),
};

class Profile {

    static get KEY_NAME_VIEW_CFG() { return 'viewConfiguration'; }
    static get KEY_NAME_PW_CFG() { return 'passwordGeneratorConfiguration'; }
    static get KEY_NAME_SESSION_CFG() { return 'sessionConfiguration'; }

    constructor(src) {

        this.id             = src._id || src.id;
        this.name           = src.name;
        this.categoryId     = src.categoryId;
        this.cryptCheck     = src.cryptCheck;
        this.sessionConfiguration = new SessionConfiguration(src.sessionConfiguration);
        this.passwordGeneratorConfiguration = new PasswordGeneratorConfiguration(src.passwordGeneratorConfiguration);
        this.viewConfiguration = new ViewConfiguration(src.viewConfiguration);
        this.lastLogin      = src.lastLogin;
        this.currentLogin   = src.currentLogin;
        this.updatedAt      = src.updatedAt;
    }

    static create(profileName, cryptCheck){
        return new Profile({
            name: profileName,
            categoryId: '',
            cryptCheck: cryptCheck,
            lastLogin: null,
            currentLogin: new Date(),
            sessionConfiguration: new SessionConfiguration(),
            viewConfiguration : new ViewConfiguration(),
            passwordGeneratorConfiguration: new PasswordGeneratorConfiguration()
        });
    }

    encrypt(cipher){
        this.passwordGeneratorConfiguration = this.passwordGeneratorConfiguration.encrypt(cipher);
        return this;
    }

    decrypt(cipher){
        this.passwordGeneratorConfiguration = this.passwordGeneratorConfiguration.decrypt(cipher);
        return this;
    }

    apply(obj){
        for(const key in obj){
            if(!this.hasOwnProperty(key)){
                throw new Error("unknown key '" + key + "' in class Profile");
            }

            if(key === 'viewConfiguration'){

                this.viewConfiguration.apply(obj[key]);

            } else if(key === 'passwordGeneratorConfiguration'){

                this.passwordGeneratorConfiguration.apply(obj[key]);

            } else if(key === 'sessionConfiguration'){

                this.sessionConfiguration.apply(obj[key]);

            } else {
                this[key] = obj[key];
            }
        }
        return this;
    }

    clone() {
        return new Profile(deepCopy(this));
    }

    toDbDoc(){

        const uc = this.passwordGeneratorConfiguration.useUpperCases;
        if(uc === 'true' || uc === 'false'){
            throw new Error("Not encrypted!");
        }

        const copyObj = JSON.parse(JSON.stringify(this));
        const id = copyObj.id;

        delete copyObj['id'];
        delete copyObj['updatedAt'];
        delete copyObj['createdAt'];

        copyObj["_id"] = id;

        const dates = ['lastLogin', 'currentLogin', 'updatedAt'];

        dates.forEach((item) => {
            if(copyObj[item]){
                copyObj[item] = new Date(copyObj[item]);
            }
        });

        return copyObj;
    }

}

Profile.propTypes = propTypes;

export default Profile;
