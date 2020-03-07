import BaseDB from "./BaseDB";

'use strict';

class CategoriesDB extends BaseDB {

    constructor() {
        super({table: 'categories'});
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

    async create(doc) {

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

    async update(category) {
        // console.log("update: ", category);
        const DB = this.db;

        return new Promise(function (resolve, reject) {
            DB.update({_id : category._id}, category, {}, function (err, numReplaced) {
                // console.log('updated: ', numReplaced, err);
                if (err) {
                    reject(err);
                } else {
                    resolve(numReplaced);
                }
            });
        });
    }

    async getByLCHash(profileId, hash){
        const DB = this.db;

        return new Promise(function (resolve, reject) {
            DB.findOne({lchash: hash, profile: profileId}, {}).exec(function (err, doc) {
                if (err) {
                    reject(err);
                } else {
                    resolve(doc);
                }
            });
        });
    }

    async countForProfile(profileId) {

        const DB = this.db;

        return new Promise(function (resolve, reject) {
            DB.count({profile: profileId}, function (err, count) {
                if (err) {
                    reject(err);
                } else {
                    resolve(count);
                }
            });
        });
    }

    async getAll(profileId) {

        const DB = this.db;

        const query = profileId ? {profile: profileId} : {};

        return new Promise(function (resolve, reject) {
            DB.find(query, {}).sort({orderNr : 1}).exec( function (err, docs) {
                if (err) {
                    reject(err);
                } else {
                    resolve(docs);
                }
            });
        });
    }

}

export default CategoriesDB;
