import BaseDB from "./BaseDB";
import {CFG_LOG_REPOSITORIES} from "../../Basic/consts";

'use strict';

// {
//     id: 3,
//     name: 'Facebook',
//     category: 'sRfpc3gG3nd',
//     userName: 'dit@gmx.net',
//     password: '1s2345',
//     profile: '31adsE',
//     updatedAt: new Date()
// }
class PasswordsDB extends BaseDB {

    constructor() {
        super({table: 'passwords'});
    }

    async create(doc) {

        if(!doc.profile){
            throw new Error("missing profileid");
        }

        const DB = this.db;

        return new Promise(function (resolve, reject) {
            DB.insert(doc, function (err, newDoc) {
                // console.log('saved: ' + JSON.stringify(newDoc));
                if (err) {
                    reject(err);
                } else {
                    resolve(newDoc);
                }
            });
        });
    }

    async update(passwordDoc) {

        if(CFG_LOG_REPOSITORIES){
            console.log("update: ", passwordDoc._id);
        }
        const DB = this.db;

        return new Promise(function (resolve, reject) {
            DB.update({_id : passwordDoc._id}, passwordDoc, {}, function (err, numReplaced) {
                // console.log('updated: ' + numReplaced);
                if (err) {
                    reject(err);
                } else {
                    resolve(numReplaced);
                }
            });
        });
    }

    async removeByCategoryId(categoryId) {

        const DB = this.db;

        return new Promise(function (resolve, reject) {
            DB.remove({ category: categoryId }, { multi: true }, function (err, rows) {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    async getById(passwordId){
        const DB = this.db;

        return new Promise(function (resolve, reject) {
            DB.findOne({_id: passwordId}, {},function (err, doc) {
                if (err) {
                    reject(err);
                } else {
                    resolve(doc);
                }
            });
        });
    }

    async getByCategoryId(categoryId) {

        const DB = this.db;

        return new Promise(function (resolve, reject) {
            DB.find({category: categoryId}, function (err, docs) {
                if (err) {
                    reject(err);
                } else {
                    resolve(docs);
                }
            });
        });
    }

    async getByLCHash(profileId, categoryId, hashedLCName){
        const DB = this.db;

        return new Promise(function (resolve, reject) {
            DB.findOne({lchash: hashedLCName, profile: profileId, category: categoryId}, {}).exec(function (err, doc) {
                if (err) {
                    reject(err);
                } else {
                    resolve(doc);
                }
            });
        });
    }

    async removeByProfileId(profileId){
        const DB = this.db;

        return new Promise(function (resolve, reject) {
            DB.remove({profile: profileId}, {multi: true}, function (err, numRemoved) {
                if (err) {
                    reject(err);
                } else {
                    resolve(numRemoved);
                }
            });
        });
    }

    async getAll() {

        const DB = this.db;

        return new Promise(function (resolve, reject) {
            DB.find({}, {}).sort({updatedAt : 1}).exec( function (err, docs) {
                if (err) {
                    reject(err);
                } else {
                    resolve(docs);
                }
            });
        });
    }

}

export default PasswordsDB;
