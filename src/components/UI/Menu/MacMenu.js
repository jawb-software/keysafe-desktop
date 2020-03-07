'use strict';

import I18n from "../../Basic/I18n/i18n";

import {
    DEV_USER_ACTION_RESET_DB,
    DEV_USER_ACTION_SHOW_DB, USER_ACTION_CANCEL_REMOVE_CATEGORY,
    USER_ACTION_DO_EXIT,
    USER_ACTION_DO_LOGOUT,
    USER_ACTION_EDIT_CATEGORY, USER_ACTION_EXECUTE_REMOVE_CATEGORY, USER_ACTION_EXPORT_PASSWORDS,
    USER_ACTION_IMPORT_PASSWORDS,
    USER_ACTION_NEW_CATEGORY,
    USER_ACTION_NEW_PASSWORD, USER_ACTION_OPEN_NEW_PROFILE_VIEW, USER_ACTION_OPEN_SETTINGS,
    USER_ACTION_REMOVE_CATEGORY
} from "../../Basic/consts";

const ipc = require('electron').ipcRenderer;

export const MAC_MENU_TEMPLATE = {
    label: I18n.appMenu_Profile(),
    submenu: [
        {
            label:  I18n.appMenu_Profile_New(),
            click() {
                ipc.send(USER_ACTION_OPEN_NEW_PROFILE_VIEW)
            }
        },
        { type: 'separator' },
        {
            id: USER_ACTION_EXPORT_PASSWORDS,
            label:  I18n.appMenu_Profile_Export(),
            enabled: false,
            click: () => {
                ipc.send(USER_ACTION_EXPORT_PASSWORDS);
            }
        }
    ]
};
