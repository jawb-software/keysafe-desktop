import React from 'react';
import CategoriesDB from "./Repositories/CategoriesDB";
import ProfileDB    from "./Repositories/ProfileDB";
import PasswordsDB  from "./Repositories/PasswordsDB";
import Crypt from "./Security/Crypt";
import {logSafeObject, notEmpty} from "../Basic/utils";
import I18n from "../Basic/I18n/i18n";
import Password from "../Basic/Types/Password";
import Category from "../Basic/Types/Category";
import Profile from "../Basic/Types/Profile";
import BackupImportConfiguration from "../Basic/Types/BackupImportConfiguration";
import {CFG_LOG_DATALOADER} from "../Basic/consts";

'use strict';

class DataLoader {

    log(msg, ...params){

        if(!CFG_LOG_DATALOADER){
            return;
        }

        if(params){
            console.log(msg, params);
        } else {
            console.log(msg);
        }
    }

    constructor() {
        this.categories = new CategoriesDB();
        this.profiles   = new ProfileDB();
        this.passwords  = new PasswordsDB();

        //
        this.crypt    = null;
        this.dbsReady = false;
        this.initTimeout = null;
    }

    cleanForExit(){
        this.categories = null;
        this.profiles      = null;
        this.passwords  = null;
        this.dbsReady   = false;

        if(this.crypt){
            this.crypt.clean();
        }
        this.crypt = null;
    }

    async logout(profile){

        if(!this.dbsReady){
            await this.initDBs();
        }

        profile.lastLogin = new Date();

        const copy = profile.clone().encrypt(this.crypt).toDbDoc();

        await this.profiles.update(copy);

        this.crypt.clean();
        this.crypt = null;

        const profiles = await this.profiles.getAll();

        return profiles.map(doc => new Profile(doc));
    }

    async removeProfile(profile) {

        if(!this.dbsReady){
            await this.initDBs();
        }

        await this.profiles.remove(profile.id);
        await this.categories.removeByProfileId(profile.id);
        await this.passwords.removeByProfileId(profile.id);

        this.crypt.clean();
        this.crypt = null;
    }

    async resetDB() {
        await this.categories.removeAll();
        await this.profiles.removeAll();
        await this.passwords.removeAll();

        //
        this.crypt    = null;
        this.dbsReady = false;
    }

    async initDBs() {

        const self = this;

        if(!this.dbsReady){

            if(!this.initTimeout) {
                self.initTimeout = setTimeout(async () => {
                    // noch mal...
                    this.log("retry initDB");
                    // await self.initDBs();
                }, 5000);
            }

            await this.categories.init();
            await this.profiles.init();
            await this.passwords.init();

            this.dbsReady = true;

            clearTimeout(this.initTimeout);
        }

        const profiles = await this.profiles.getAll();

        return profiles.map(doc => {
           return new Profile(doc);
        });
    }

    async loadAllDataAsync(profileId) {

        if(!this.dbsReady){
            await this.initDBs();
        }

        const self = this;
        const categories = await this.loadCategories(profileId);
        const profile    = await this.loadProfile(profileId);

        if(!profile.categoryId && notEmpty(categories)){
            profile.categoryId = categories[0].id;
            await this.profiles.update(profile.toDbDoc());
        }

        // Alle
        const passwordsCount = await this.passwords.count(profileId);
        const rawDBItems     = await this.passwords.getByCategoryId(profile.categoryId);

        const passwords = rawDBItems.map(rawDBItem => {
            const password = new Password(rawDBItem);
            return password.decrypt(self.crypt, profile.viewConfiguration);
        });

        profile.decrypt(self.crypt);

        return {
            categories:         categories,
            passwords:          passwords,
            passwordsAllCount:  passwordsCount,
            profile:            profile
        };
    }

    //
    // PROFILE
    //

    async createProfile(profileData){
        this.log("createProfile", logSafeObject(profileData));

        if(!this.dbsReady){
            await this.initDBs();
        }

        let profileName      = profileData.name;
        const masterPassword = profileData.password;

        if(!profileName){
            let i = 1;

            while(true){
                profileName = "Profile-" + (i++);
                const exists = await this.profiles.profileExists(profileName);
                if(!exists){
                    break;
                }

            }

        } else {
            const exists = await this.profiles.profileExists(profileName);
            if(exists){
                throw new Error("Profile + '" + profileName + "' already exists");
            }
        }

        const crypter      = new Crypt(masterPassword);
        const randomString = Crypt.random_string();
        const checkTxt     = crypter.encrypt(randomString);

        if(randomString !== crypter.decrypt(checkTxt)) {
            throw new Error("Encryption error.");
        }

        const dbDoc   = Profile.create(profileName, checkTxt)
                               .encrypt(crypter)
                               .toDbDoc();

        const profile = await this.profiles.create(dbDoc);

        if(this.crypt && this.crypt.isReady()){
            throw new Error("previous session is not cleaned!");
        }

        this.crypt = crypter;

        const newCreatedProfile = new Profile(profile).decrypt(crypter);

        const profiles = await this.profiles.getAll();

        const allProfiles = profiles.map(doc => {
            return new Profile(doc);
        });

        return {
            profile : newCreatedProfile,
            allProfiles : allProfiles
        };
    }

    /**
     *
     * @param profileId
     * @param masterPassword
     * @returns {Promise<Profile>}
     */
    async login(profileId, masterPassword){
        this.log("login", [profileId, '*****']);

        if(!this.dbsReady){
            await this.initDBs();
        }

        const profile = await this.loadProfile(profileId);
        const cipher = new Crypt(masterPassword);

        // throws CryptError
        cipher.decrypt(profile.cryptCheck);

        if(this.crypt && this.crypt.isReady()){
            throw new Error("previous session is not cleaned!");
        }

        this.crypt = cipher;

        profile.lastLogin    = profile.currentLogin;
        profile.currentLogin = new Date();

        await this.profiles.update(profile.toDbDoc());

        // verschluesselte Einstellungen
        profile.decrypt(cipher);

        // console.log("login success", profile.clone());

        return profile;

    }

    /**
     *
     * @param profileId
     * @returns {Promise<Profile>}
     */
    async loadProfileViewConfiguration(profileId){
        this.log('loadProfileViewConfiguration: ', profileId);

        if(!this.dbsReady){
            await this.initDBs();
        }

        const dbDoc = await this.profiles.get(profileId);

        if(!dbDoc){
            throw new Error("Unknown name '" + profileId + "'");
        }

        return new Profile(dbDoc).viewConfiguration;
    }

    /**
     *
     * @param profileId
     * @returns {Promise<Profile>}
     */
    async loadProfile(profileId){
        this.log('loadProfile: ', profileId);

        if(!this.dbsReady){
            await this.initDBs();
        }

        const dbDoc = await this.profiles.get(profileId);

        if(!dbDoc){
            throw new Error("Unknown name '" + profileId + "'");
        }

        // console.log("loaded Profile", dbDoc);

        return new Profile(dbDoc);
    }

    /**
     *
     * @param profile
     */
    async updateProfile(profile){
        this.log('updateProfile:', profile);

        if(!this.dbsReady){
            await this.initDBs();
        }

        const encryptedCopy = profile
            .clone()
            .encrypt(this.crypt)
            .toDbDoc();

        const updatedRows = await this.profiles.update(encryptedCopy);

        if(updatedRows !== 1){
            throw new Error("Database error: could not update profile");
        }

        this.log('updateProfile done: ' + profile.id);
    }

    //
    // CATEGORY
    //


    /**
     *
     * @param profileId string
     * @param formData
     * @returns {Promise<Category>}
     */
    async createCategory(profileId, formData){
        this.log('createCategory', profileId, formData);

        if(!this.dbsReady){
            await this.initDBs();
        }

        const orderNr = await this.categories.countForProfile(profileId);

        const dbDoc = Category.create(profileId, formData.name, orderNr)
                              .encrypt(this.crypt)
                              .toDbDoc();

        const savedDoc = await this.categories.create(dbDoc);

        return new Category(savedDoc).decrypt(this.crypt);
    }

    /**
     *
     * @param category {Category}
     * @param formData
     * @returns {Promise<Category>}
     */
    async updateCategory(category, formData){
        this.log('updateCategory', category, formData);

        if(!this.dbsReady){
            await this.initDBs();
        }

        const dbDoc = category.clone()
                              .apply(formData)
                              .encrypt(this.crypt)
                              .toDbDoc();

        const updatedRows = await this.categories.update(dbDoc);

        if(updatedRows !== 1){
            throw new Error("Database error: could not update category");
        }

        return new Category(dbDoc).decrypt(this.crypt);
    }

    /**
     *
     * @returns {Promise<List<Category>>}
     */
    async loadCategories(profileId){
        this.log('loadCategories', profileId);

        const self = this;

        if(!this.dbsReady){
            await this.initDBs();
        }

        let rawDBItems = await this.categories.getAll(profileId);

        return rawDBItems.map(rawDBItem => {
            return new Category(rawDBItem).decrypt(self.crypt);
        });
    }

    async removeCategory(profileId, categoryId){
        this.log('removeCategory', profileId, categoryId);

        if(!this.dbsReady){
            await this.initDBs();
        }

        const removedCat = await this.categories.remove(categoryId);
        const removedPws = await this.passwords.removeByCategoryId(categoryId);
        const profile    = await this.loadProfile(profileId);

        // this.log('removed ' + removedCat + ' categories');
        // this.log('removed ' + removedPws + ' passwords');

        const allCategories = await this.categories.getAll(profileId);
        if(notEmpty(allCategories)){

            profile.categoryId = allCategories[0]._id;
            await this.profiles.update(profile.toDbDoc());

            for(let i = 0; i < allCategories.length; i++){
                allCategories[i].orderNr = i;
                const r = await this.categories.update(allCategories[i]);
                if(!r){
                    throw new Error("couldn't update category with id: " + allCategories[i]._id);
                }
            }

        } else {
            profile.categoryId = null;
            await this.profiles.update(profile.toDbDoc());
        }
    }

    async getCategoryByName(profileId, categoryName){
        this.log('getCategoryByName', profileId, categoryName);

        if(!this.dbsReady){
            await this.initDBs();
        }

        const dbDoc = await this.categories.getByLCHash(profileId, Crypt.hash_sha1_lc(categoryName));
        return dbDoc === null ? null : new Category(dbDoc).decrypt(this.crypt);
    }

    //
    //
    // -------------------------

    async createPassword(profileId, categoryId, formData, profileViewConfiguration){
        this.log('createPassword', profileId, categoryId);

        if(!this.dbsReady){
            await this.initDBs();
        }

        const viewConfiguration = profileViewConfiguration || await this.loadProfileViewConfiguration(profileId);
        const dbDoc   = Password.createNew(formData.name, formData.userName, formData.password, categoryId, profileId)
                                .encrypt(this.crypt)
                                .toDbDoc();

        const savedDoc = await this.passwords.create(dbDoc);

        if(!savedDoc){
            throw new Error("Database error: could not create password.");
        }

        return new Password(savedDoc).decrypt(this.crypt, viewConfiguration);
    }

    async movePassword(passwordId, newCategoryId){
        this.log('movePassword', passwordId, newCategoryId);

        if(!this.dbsReady){
            await this.initDBs();
        }
    }

    /**
     *
     * @param passwordId String
     * @param formData
     * @returns {Promise<Password>}
     */
    async updatePassword(passwordId, formData){
        this.log('updatePassword',);

        if(!this.dbsReady){
            await this.initDBs();
        }

        const passwordDoc = await this.passwords.getById(passwordId);

        const updatedDoc  = new Password(passwordDoc)
                                .decrypt(this.crypt, null)
                                .apply(formData)
                                .encrypt(this.crypt)
                                .toDbDoc();

        const updatedRows = await this.passwords.update(updatedDoc);

        if(updatedRows !== 1){
            throw new Error("Database error: could not update password");
        }

        const doc = await this.passwords.getById(passwordId);
        const pw  = new Password(doc);

        const viewConfiguration = await this.loadProfileViewConfiguration(pw.profile);

        return pw.decrypt(this.crypt, viewConfiguration);
    }

    async loadDecryptedPassword(passwordId){
        this.log('loadDecryptedPassword', passwordId);

        if(!this.dbsReady){
            await this.initDBs();
        }

        const dbDoc = await this.passwords.getById(passwordId);

        return new Password(dbDoc).decrypt(this.crypt);
    }

    /**
     *
     * @param profileId string
     * @param categoryId string
     * @returns {Promise<List<Password>>}
     */
    async loadPasswords(profileId, categoryId){
        this.log('loadPasswords', profileId, categoryId);

        const self = this;

        if(!this.dbsReady){
            await this.initDBs();
        }

        const viewConfiguration = await this.loadProfileViewConfiguration(profileId);
        const rawDBItems = await this.passwords.getByCategoryId(categoryId);

        // console.log("Found", rawDBItems);

        return rawDBItems.map(rawDBItem => {
            return new Password(rawDBItem).decrypt(self.crypt, viewConfiguration);
        });
    }

    /**
     * @param {String} categoryId
     * @returns {Promise<void>}
     */
    async removePassword(passwordId) {
        this.log('removePassword', passwordId);

        if (!this.dbsReady) {
            await this.initDBs();
        }

        const res = await this.passwords.remove(passwordId);
        if(!res){
            throw new Error("couldn't remove password with id: " + passwordId);
        }
    }

    //
    // ----------------
    //

    /**
     *
     * @param {String} file
     * @returns {Promise<BackupImportConfiguration>}
     */
    async loadImportFileInfo(file){
        this.log('loadImportFileInfo', file);

        const data = await this._readFileData(file);

        return new BackupImportConfiguration(file, data);
    }
    /**
     * @param profileId string
     * @param {BackupImportConfiguration} backupFileInfo
     */
    async importPasswords(profileId, backupFileInfo){
        this.log('importPasswords', profileId);

        if(backupFileInfo.passwordRequired && !backupFileInfo.passwordToDecrypt){
            throw new Error(I18n.backupImport_Error_NoRequiredPasswordSpecified());
        }

        const self = this;
        const data = await this._readFileData(backupFileInfo.file);

        const backup    = JSON.parse(String(data));
        const tempCrypt = new Crypt(backupFileInfo.passwordToDecrypt);

        const decrypted = new Map();
        let importedCount = 0;

        if(backup.version === 2) {

            const categories = backup.profiles[0].categories;
            const decryptedPWs = [];

            for (let i = 0; i < categories.length; i++){

                const category     = categories[i];
                const categoryName = tempCrypt.decrypt(category.name);

                for(let i = 0; i < category.keys.length; i++){
                    const pw = category.keys[i];
                    decryptedPWs.push({
                        name: tempCrypt.decrypt(pw.name),
                        password : tempCrypt.decrypt(pw.password),
                        userName: tempCrypt.decrypt(pw.userName)
                    });
                }
                decrypted.set(categoryName, decryptedPWs);
            }

        } else {

            //
            for (let categoryEnc in backup.keys){
                const categoryName = tempCrypt.decrypt(categoryEnc);
                const decryptedPWs = [];
                const passwords = backup.keys[categoryEnc];
                for(let i = 0; i < passwords.length; i++){
                    const pw = passwords[i];
                    decryptedPWs.push({
                        name: tempCrypt.decrypt(pw.name),
                        password : tempCrypt.decrypt(pw.password),
                        userName: tempCrypt.decrypt(pw.userName)
                    });
                }
                decrypted.set(categoryName, decryptedPWs);
            }

        }

        const viewCfg = await this.loadProfileViewConfiguration(profileId);

        for(const [categoryName, passwordList] of decrypted.entries()){

            // console.log(categoryName);

            let cat = await this.getCategoryByName(profileId, categoryName);
            if(!cat){
                cat = await this.createCategory(profileId, {name: categoryName});
            }
            const categoryId = cat.id;

            for (let i = 0; i < passwordList.length; i++){
                const passwordToSave = passwordList[i];

                const originalName = passwordToSave.name;
                let name    = originalName;
                let save    = false;
                let j       = 2;

                while(true){ // Namenskollision

                    const withSameName = await self.passwords.getByLCHash(profileId, categoryId, Crypt.hash_sha1_lc(name));

                    if(withSameName){

                        // pruefe ob die gleich sind
                        const existingUserName = this.crypt.decrypt(withSameName.userName);
                        const existingPassword = this.crypt.decrypt(withSameName.password);

                        if(passwordToSave.userName === existingUserName && passwordToSave.password === existingPassword){

                            // nichts tun, das password ist schon in der DB
                            save = false;
                            break;

                        } else {
                            name = originalName + "-" + (j++); // wähle neuen Namen und teste nochmal
                        }
                    } else {
                        save = true;
                        break;
                    }
                }

                if(save){
                    passwordToSave.name = name;
                    await self.createPassword(profileId, categoryId, passwordToSave, viewCfg);
                    importedCount++;
                }

            }
        }
        return importedCount;
    }

    _reEncrypt(encryptedTxt){
        if(encryptedTxt.indexOf('#') < 0){
            encryptedTxt = this.crypt.decrypt(encryptedTxt);
            encryptedTxt = this.crypt.encrypt(encryptedTxt);
        }
        return encryptedTxt;
    }

    async exportPasswords(profileId, targetFile){
        this.log('exportPasswords', profileId);

        if(!this.dbsReady){
            await this.initDBs();
        }

        const profile = await this.loadProfile(profileId);

        const backup = {
            version : 2,
            created : new Date(),
            encrypted: true,
            profiles : [
                {
                    name : this.crypt.encrypt(profile.name),
                    categories : []
                }
            ]
        };

        let categoryDocs = await this.categories.getAll(profileId);
        for(let i = 0; i < categoryDocs.length; i++){

            const category     = categoryDocs[i];
            const passwordDocs = await this.passwords.getByCategoryId(category._id);

            if(passwordDocs && passwordDocs.length){

                let keys = passwordDocs.map(doc => {
                    return {
                        name: this._reEncrypt(doc.name),
                        userName: this._reEncrypt(doc.userName),
                        password: this._reEncrypt(doc.password)
                    }
                });

                backup.profiles[0].categories.push({
                    name : this._reEncrypt(category.name),
                    keys : keys
                });

            }

        }

        const backupAsJSON = JSON.stringify(backup, null, 2);

        return new Promise(function (resolve, reject) {
            const fs = require('fs');

            fs.writeFile(targetFile, backupAsJSON, 'utf8', (err) => {
                if(err){
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

    }

    //-----------------

    async _readFileData(file){

        return new Promise(function (resolve, reject) {
            const fs = require('fs');

            fs.readFile(file, 'utf-8', (err, data) => {
                if(err){
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });

    }
}

export default DataLoader;
