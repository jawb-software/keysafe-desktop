import React from 'react';
import TitleBar from 'frameless-titlebar';
import KeysafeIcon from './logo.png';
import './UITitleBar.css';
import I18n from "../../Basic/I18n/i18n";

import {
    DEV_USER_ACTION_SHOW_DB,
    USER_ACTION_DO_EXIT,
    USER_ACTION_DO_LOGOUT,
    USER_ACTION_EDIT_CATEGORY,
    USER_ACTION_EXPORT_PASSWORDS,
    USER_ACTION_IMPORT_PASSWORDS,
    USER_ACTION_NEW_CATEGORY,
    USER_ACTION_NEW_PASSWORD,
    USER_ACTION_OPEN_ABOUT,
    USER_ACTION_OPEN_ABOUT_ENCRYPTION_INFO,
    USER_ACTION_OPEN_HOWTO,
    USER_ACTION_OPEN_NEW_PROFILE_VIEW,
    USER_ACTION_OPEN_SETTINGS,
    USER_ACTION_REMOVE_CATEGORY,
    USER_ACTION_SHOW_PASSWORD_GENERATOR_DIALOG,
} from "../../Basic/consts";

import {getCurrentTheme} from "../../Basic/utils";

class UITitleBar extends React.Component {

    constructor(props) {
        super(props);
        this.onMenuClick = this.onMenuClick.bind(this);
    }

    onMenuClick(menuId) {
        this.props.onUserAction(menuId);
    }

    render() {
        const platform = process.platform;

        const KeysafeMenu = [
            {
                label: I18n.appMenu_Profile(),
                submenu: [
                    {
                        id: USER_ACTION_OPEN_NEW_PROFILE_VIEW,
                        label:  I18n.appMenu_Profile_New(),
                        click: (menuItem) => {
                            this.onMenuClick(menuItem.id);
                        }
                    },
                    { type: 'separator' },
                    {
                        id: USER_ACTION_EXPORT_PASSWORDS,
                        label:  I18n.appMenu_Profile_Export(),
                        enabled: this.props.canExport,
                        click: (menuItem) => {
                            this.onMenuClick(menuItem.id);
                        }
                    },
                    {
                        id: USER_ACTION_IMPORT_PASSWORDS,
                        label:  I18n.appMenu_Profile_Import(),
                        click: (menuItem) => {
                            this.onMenuClick(menuItem.id);
                        }
                    },
                    { type: 'separator' },
                    {
                        id: USER_ACTION_OPEN_SETTINGS,
                        label:  I18n.appMenu_Profile_Settings(),
                        click: (menuItem) => {
                            this.onMenuClick(menuItem.id);
                        }
                    },
                    { type: 'separator' },
                    {
                        id: USER_ACTION_DO_LOGOUT,
                        label:  I18n.appMenu_Profile_Logout(),
                        click: (menuItem) => {
                            this.onMenuClick(menuItem.id);
                        }
                    },
                    {
                        id: USER_ACTION_DO_EXIT,
                        label:  I18n.appMenu_Profile_Exit(),
                        click: (menuItem) => {
                            this.onMenuClick(menuItem.id);
                        }
                    },
                ]
            },
            {
                label: I18n.appMenu_Category(),
                submenu: [
                    {
                        id: USER_ACTION_NEW_CATEGORY,
                        label: I18n.appMenu_Category_New(),
                        click: (menuItem) => {
                            this.onMenuClick(menuItem.id);
                        }
                    },
                    { type: 'separator' },
                    {
                        id: USER_ACTION_EDIT_CATEGORY,
                        enabled : this.props['canChangeCategory'],
                        label: I18n.appMenu_Category_Rename(),
                        click: (menuItem) => {
                            this.onMenuClick(menuItem.id);
                        }
                    },
                    {
                        id: USER_ACTION_REMOVE_CATEGORY,
                        label: I18n.appMenu_Category_Remove(),
                        enabled : this.props['canChangeCategory'],
                        click: (menuItem) => {
                            this.onMenuClick(menuItem.id);
                        }
                    }
                ]
            },
            {
                label:  I18n.appMenu_Password(),
                submenu: [
                    {
                        id: USER_ACTION_NEW_PASSWORD,
                        label: I18n.appMenu_Password_New(),
                        enabled : this.props['canCreatePassword'],
                        click: (menuItem) => {
                            this.onMenuClick(menuItem.id);
                        }
                    },
                    { type: 'separator' },
                    {
                        id: USER_ACTION_SHOW_PASSWORD_GENERATOR_DIALOG,
                        label: I18n.appMenu_Password_Generator(),
                        click: (menuItem) => {
                            this.onMenuClick(menuItem.id);
                        }
                    }
                ]
            },
            {
                label: I18n.appMenu_Help(),
                submenu: [
                    {
                        id: USER_ACTION_OPEN_HOWTO,
                        label: I18n.appMenu_Help_About_HowTo(),
                        click: (menuItem) => {
                            this.onMenuClick(menuItem.id);
                        }
                    },
                    {
                        id: USER_ACTION_OPEN_ABOUT_ENCRYPTION_INFO,
                        label: I18n.appMenu_Help_About_CryptoInfo(),
                        click: (menuItem) => {
                            this.onMenuClick(menuItem.id);
                        }
                    },
                    { type: 'separator' },
                    {
                        id: DEV_USER_ACTION_SHOW_DB,
                        label: I18n.appMenu_Help_ShowDb(),
                        click: (menuItem) => {
                            this.onMenuClick(menuItem.id);
                        }
                    },
                    { type: 'separator' },
                    {
                        id: USER_ACTION_OPEN_ABOUT,
                        label: I18n.appMenu_Help_About(),
                        click: (menuItem) => {
                            this.onMenuClick(menuItem.id);
                        }
                    }

                ]
            }
        ];

        if(platform === 'darwin'){
            const Menu = require('electron').remote.Menu;
            Menu.setApplicationMenu(Menu.buildFromTemplate(KeysafeMenu));
            return null;
        }

        if(platform !== 'win32'){
            const Menu = require('electron').remote.Menu;
            Menu.setApplicationMenu(Menu.buildFromTemplate(KeysafeMenu));
            return null;
        }

        const theme = getCurrentTheme();

        return (

            <div>
                <TitleBar
                    icon={KeysafeIcon}
                    menu={KeysafeMenu}
                    theme={{
                        barTheme: 'dark',
                        barShowBorder: true,
                        menuDimItems: false,
                        showIconDarLin: true,
                        menuItemHoverBackground: theme.COLOR_TITLEBAR_MENU_HOVER_BACKGROUND,
                        menuTextHighlightColor: theme.COLOR_TITLEBAR_MENU_ITEM_HOVER_TEXT,
                        menuItemTextColor: theme.COLOR_TITLEBAR_MENU_TEXT,
                        menuHighlightColor: theme.COLOR_TITLEBAR_MENU_ITEM_HOVER_BACKGROUND,
                        barBackgroundColor: theme.COLOR_TITLEBAR_BACKGROUND,
                        barBorderBottom: '1px solid ' + theme.COLOR_TITLEBAR_BORDER,
                    }}
                    platform={platform}
                />
            </div>
        );
    }
}

export default UITitleBar;
