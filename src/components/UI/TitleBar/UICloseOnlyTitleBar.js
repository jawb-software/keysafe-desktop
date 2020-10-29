import React from 'react';
import TitleBar from 'frameless-titlebar';
import KeysafeIcon from './logo.png';
import I18n from "../../Basic/I18n/i18n";
import {
    DEV_USER_ACTION_SHOW_DB,
    USER_ACTION_DO_EXIT,
    USER_ACTION_DO_LOGOUT, USER_ACTION_EDIT_CATEGORY,
    USER_ACTION_EXPORT_PASSWORDS,
    USER_ACTION_IMPORT_PASSWORDS,
    USER_ACTION_NEW_CATEGORY, USER_ACTION_NEW_PASSWORD, USER_ACTION_OPEN_ABOUT, USER_ACTION_OPEN_ABOUT_ENCRYPTION_INFO, USER_ACTION_OPEN_HOWTO,
    USER_ACTION_OPEN_NEW_PROFILE_VIEW,
    USER_ACTION_OPEN_SETTINGS, USER_ACTION_REMOVE_CATEGORY, USER_ACTION_SHOW_PASSWORD_GENERATOR_DIALOG
} from "../../Basic/consts";

class UICloseOnlyTitleBar extends React.Component {

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
                        id: USER_ACTION_DO_EXIT,
                        label:  I18n.appMenu_Profile_Exit(),
                        click: (menuItem) => {
                            this.onMenuClick(menuItem.id);
                        }
                    },
                ]
            }
        ];

        if(platform !== 'win32'){
            const Menu = require('electron').remote.Menu;
            Menu.setApplicationMenu(Menu.buildFromTemplate(KeysafeMenu));
            return null;
        }

        return (
            <div>
                <TitleBar
                    icon={KeysafeIcon}
                    app={'keysafe'}
                    menu={KeysafeMenu}
                    theme={{
                        barTitleColor : '#c2c2c2',
                        barTheme: 'dark',
                        barShowBorder: true,
                        barBackgroundColor: '#efefef',
                        barBorderBottom: '1px solid #e3e3e3',
                        windowControlsColor: '#000'
                    }}
                    platform={platform}
                />
            </div>
        );
    }
}

export default UICloseOnlyTitleBar;
