import React from 'react';
import Datastore from 'nedb'
import {CFG_LOG_REPOSITORIES} from "../../Basic/consts";

const {app, remote} = require('electron');
const path = require('path');

'use strict';

//
// NEDB: https://github.com/louischatriot/nedb
//
class BaseDB {

    constructor(props) {
        // console.log(JSON.stringify(props));
        const userDataPath = (app || remote.app).getPath('userData');
        this.table = props.table;
        this.dbFile = path.join(userDataPath, props.table + '.db');
        this.db = new Datastore({
            filename: this.dbFile,
            timestampData: true // createdAt, updatedAt ...
        });
    }

    async init() {
        const DB = this.db;

        if(CFG_LOG_REPOSITORIES){
            console.log("Init Table '" + this.table + "' under: " + this.dbFile);
        }

        return new Promise(function (resolve, reject) {
            DB.loadDatabase(function (err) {
                if (err) {
                    console.error("Error", err);
                    reject(err);
                } else {

                    // console.log("Success");
                    //
                    resolve();
                }
                // console.log("Done");
            });
        });
    }

    async exists(id){
        const DB = this.db;

        return new Promise(function(resolve, reject){

            DB.findOne({_id : id}, {}, function (err, val) {
                if(err){
                    reject(err );
                } else {
                    resolve(val != null);
                }
            });
        });
    }

    async count() {

        const DB = this.db;

        return new Promise(function (resolve, reject) {
            DB.count({}, function (err, count) {
                if (err) {
                    reject(err);
                } else {
                    resolve(count);
                }
            });
        });
    }

    async remove(id) {
        const DB = this.db;
        return new Promise(function (resolve, reject) {
            DB.remove({_id:id}, {}, function (err, numRemoved) {
                if (err) {
                    reject(err);
                } else {
                    resolve(numRemoved === 1);
                }
            });
        });
    }

    async removeAll() {
        const DB = this.db;
        return new Promise(function (resolve, reject) {
            DB.remove({}, {multi: true}, function (err, numRemoved) {
                if (err) {
                    reject(err);
                } else {
                    resolve(numRemoved);
                }
            });
        });
    }
}

export default BaseDB;
