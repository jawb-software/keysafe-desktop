import PropTypes from "prop-types";
import Crypt from "../../DataBase/Security/Crypt";
import {deepCopy} from "../utils";

const propTypes = {
    id: PropTypes.string,
    profile: PropTypes.string,
    name: PropTypes.string,
    lchash: PropTypes.string,
    orderNr: PropTypes.number
};

class Category {

    constructor(src) {
        this.id         = src._id || src.id;
        this.profile    = src.profile;
        this.name       = src.name;
        this.lchash     = src.lchash;
        this.orderNr    = src.orderNr;
        this.updatedAt  = src.updatedAt;
    }

    static create(profileId, name, order){
        return new Category({
            profile : profileId,
            name: name,
            lchash : Crypt.hash_sha1_lc(name),
            orderNr: order
        });
    }

    apply(src){
        for(const key in src){
            if(!this.hasOwnProperty(key)){
                throw new Error("unknown key '" + key + "' in class Category");
            }

            this[key] = src[key];

            if(key === 'name'){
                this.lchash = Crypt.hash_sha1_lc(src[key]);
            }

        }
        return this;
    }

    clone() {
        return new Category(deepCopy(this));
    }

    encrypt(crypt){
        this.name = crypt.encrypt(this.name);
        return this;
    }

    /**
     *
     * @param cipher
     */
    decrypt(cipher){
        this.name = cipher.decrypt(this.name);
        return this;
    }

    toDbDoc(){
        const copyObj = JSON.parse(JSON.stringify(this));
        const id = copyObj.id;

        delete copyObj['id'];
        delete copyObj['updatedAt'];
        delete copyObj['createdAt'];

        copyObj["_id"] = id;

        return copyObj;
    }


}

Category.propTypes = propTypes;

export default Category;
