import React from 'react';
import TitleBar from 'frameless-titlebar';
import KeysafeIcon from './logo.png';

class UICloseOnlyTitleBar extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const platform = process.platform;

        if(platform !== 'win32'){
            const Menu = require('electron').remote.Menu;
            Menu.setApplicationMenu(null);
            return null;
        }

        return (
            <div>
                <TitleBar
                    icon={KeysafeIcon}
                    app={'keysafe'}
                    menu={null}
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
