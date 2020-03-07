import {THEME} from "./consts";

const dateFormat = require('date-format');
const {remote} = require('electron');


export function getCurrentTheme() {
    try {
        const name = remote.getGlobal('defaults').theme || 'dark';
        return THEME[name];
    } catch (e) {
        console.error(e);
        return THEME['dark'];
    }
}

export function openDownload() {
    try {
        require('electron').shell.openExternal('https://keysafe-app.com/#download');
    } catch (e) {
        console.error(e);
    }
}


export function openGithub() {
    try {
        require('electron').shell.openExternal('https://github.com/jawb-software/keysafe-desktop');
    } catch (e) {
        console.error(e);
    }
}

export function openKeysafeWebsite() {
    try {
        require('electron').shell.openExternal('https://www.keysafe-app.com');
    } catch (e) {
        console.error(e);
    }
}

export function openJawbWebsite() {
    try {
        require('electron').shell.openExternal('https://www.jawb.de');
    } catch (e) {
        console.error(e);
    }
}


export function notEmpty(array) {
    if(!array) return false;
    return array.length > 0;
}

export function arrayIsEmpty(array) {
    if(!array) return true;
    return array.length === 0;
}

export function dateToString(date) {
    return dateFormat.asString("dd.MM.yyyy - hh:mm", date);
}

export function deepCopy(obj) {
    const dateKeys = [];
    for (const key in obj) {
        if(obj[key] instanceof Date){
            dateKeys.push(key);
        }
    }

    const copy = JSON.parse(JSON.stringify(obj));
    dateKeys.forEach((key) => {
        copy[key] = new Date(copy[key]);
    });

    return copy;
}

export function logSafeObject(obj) {

    if(!obj){
        return '';
    }

    const fields = ['password', 'Password'];

    const dateKeys = [];
    for (const key in obj) {
        if(obj[key] instanceof Date){
            dateKeys.push(key);
        }
    }


    const copy = JSON.parse(JSON.stringify(obj));
    dateKeys.forEach((key) => {
        copy[key] = new Date(copy[key]);
    });

    for(let i = 0; i < fields.length; i++){
        for (const key in copy) {
            if(key.indexOf(fields[i]) >= 0){
                copy[key] = '*****';
            }
        }
    }

    return copy;

}

export function toReadableString(o) {
    const type = typeof o;

    let s = o;

    if(type === 'object'){
        s = JSON.stringify(o, null, 2);
    }

    return s;
}
