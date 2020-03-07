import React from 'react';
import './UIStatusBar.css';
import I18n from "../../Basic/I18n/i18n";
import {dateToString, toReadableString} from "../../Basic/utils";

class UIStatusBar extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // console.log('componentDidMount');
        // let el = document.querySelector('#profile-info');
        // if(!el.MaterialSnackbar){
        //     componentHandler.upgradeElement(el);
        // }
        // componentHandler.upgradeDom();
    }

    render() {

        const textLastLogin  = I18n.status_LastLogin();
        const textAutoLogout = I18n.status_AutoLogout();
        const textEncryption = I18n.status_Encryption();

        const currentPasswords  = this.props.passwordsCurrent | 0;
        // const allPasswords      = this.props.passwordsAll | 0;
        const profileName       = this.props.profile.name;

        const lastLogin          = this.props.profile.lastLogin || this.props.profile.currentLogin;
        const lastLoginFormatted = dateToString(lastLogin);

        const sessionTimeout = this.props.profile.sessionConfiguration.sessionTimeout;
        let timeoutText      = I18n.status_AutoLogout_Off();

        if(sessionTimeout > 0){
            timeoutText = this._timeConversion(sessionTimeout);
        }

        const profileToString = toReadableString(this.props.profile);

        return (
            <div className="keysafe-StatusBar-Container">

                <div className="StatusBar-Item">
                    <span> {currentPasswords} </span>
                </div>
                <div className="StatusBar-Item">
                    <span title={ profileToString } id="profile-info">{profileName + ' - ' + textLastLogin + ' ' + lastLoginFormatted}</span>
                </div>
                <div className="StatusBar-Item">
                    <span> {textEncryption} </span>
                </div>
                <div className="StatusBar-Item">
                    <span>{textAutoLogout + timeoutText}</span>
                </div>

            </div>
        );
    }

    _timeConversion(ms) {

        const seconds = (ms / 1000).toFixed(0);
        const minutes = (ms / (1000 * 60)).toFixed(0);
        const hours   = (ms / (1000 * 60 * 60)).toFixed(1);
        const days    = (ms / (1000 * 60 * 60 * 24)).toFixed(1);

        if (seconds < 60) {
            return seconds + I18n.status_Time_Seconds();
        } else if (minutes < 60) {
            return minutes + I18n.status_Time_Minutes();
        } else if (hours < 24) {
            return hours + I18n.status_Time_Hours();
        }
        return days + I18n.status_Time_Days();
    }
}

export default UIStatusBar;
