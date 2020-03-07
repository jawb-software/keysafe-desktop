import BaseDB from "./BaseDB";

'use strict';

class ProfileDB extends BaseDB{

    constructor() {
        super({table : 'profiles'});
    }

    async get(profileId) {
        const DB = this.db;

        return new Promise(function(resolve, reject){
            DB.findOne({_id : profileId}, function (err, doc) {
                // console.log('Found: for id=' + profileId,  doc);
                if(err){
                    reject(err );
                } else {
                    resolve(doc ? doc : null);
                }
            });
        });
    }

    async profileExists(profileName) {
        const DB = this.db;

        return new Promise(function(resolve, reject){
            DB.findOne({name : profileName}, function (err, doc) {
                // console.log('Found: for name=' + name,  doc);
                if(err){
                    reject(err );
                } else {
                    resolve(!!doc);
                }
            });
        });
    }

    async create(doc){

        const DB = this.db;

        return new Promise(function (resolve, reject) {
            DB.insert(doc, function (err, newDoc) {
                // console.log('inserted', newDoc);
                if (err) {
                    reject(err);
                } else {
                    resolve(newDoc);
                }
            });
        });
    }

    async update(doc){
        // console.log("update: ", doc);

        const DB = this.db;

        return new Promise(function (resolve, reject) {

            DB.update({ _id : doc._id }, doc, {}, function (err, rows) {
                // console.log('updated: ' + rows);
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    async getAll(){
        const DB = this.db;
        return new Promise(function (resolve, reject) {
            DB.find({}, {}).exec( function (err, docs) {
                if (err) {
                    reject(err);
                } else {
                    resolve(docs);
                }
            });
        });
    }

}

export default ProfileDB;
