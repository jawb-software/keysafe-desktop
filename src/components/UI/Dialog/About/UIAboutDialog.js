import React from 'react';

import '../UIBaseDialog.css';
import './UIAboutDialog.css';

import UIClear from "../../Basic/UIClear";
import UIDialogTitleWithClose from "../UIDialogTitleWithClose";
import {USER_ACTION_CLOSE_ABOUT} from "../../../Basic/consts";
import I18n from "../../../Basic/I18n/i18n";
import {openDownload, openGithub, openJawbWebsite} from "../../../Basic/utils";
import UILicenseView from "./UILicenseView";

class UIAboutDialog extends React.Component {

    constructor(props) {
        super(props);
        this.handleCancelClick  = this.handleCancelClick.bind(this);
    }

    componentDidMount() {
        componentHandler.upgradeElement(document.getElementById('tabs'));
    }

    handleCancelClick(){
        this.props.onUserAction(USER_ACTION_CLOSE_ABOUT);
    }

    render() {

        const dialogTitle = I18n.aboutKeysafe_Title();

        const title         = I18n.profile_Title();
        const slogan        = I18n.profile_Slogan();
        const appVersion    = require('electron').remote.app.getVersion();
        const year          = new Date().getFullYear();

        const mainAboutTitle    = I18n.aboutKeysafe_Tabs_About();
        const osListTitle       = I18n.aboutKeysafe_Tabs_OSList();
        const sourceCodeTitle   = I18n.aboutKeysafe_Tabs_SourceCode();

        const sourceCodeText   = I18n.aboutKeysafe_About_SourceCode();
        const sourceCodeButton = I18n.aboutKeysafe_About_SourceCode_Button();

        const frameworksTitle = I18n.aboutKeysafe_About_Frameworks_Title();
        const licenseTitle = I18n.aboutKeysafe_About_License_Title();

        return (

            <div className="UIBaseDialog-Backdrop">
                <div className="UIBaseDialog-Content UIAboutDialog">

                    <UIDialogTitleWithClose title={dialogTitle} onCloseClick={this.handleCancelClick}/>

                    <div id="about-container">

                        <div id={'tabs'} className="mdl-tabs mdl-js-tabs mdl-js-ripple-effect">

                            <div className="mdl-tabs__tab-bar">
                                <a href="#main-about-tab" className="mdl-tabs__tab is-active">{mainAboutTitle}</a>
                                <a href="#os-list-tab" className="mdl-tabs__tab"> {osListTitle} </a>
                                <a href="#source-code-tab" className="mdl-tabs__tab">{sourceCodeTitle}</a>
                            </div>

                            <div className="mdl-tabs__panel is-active" id="main-about-tab">

                                <div id={'logo-container'}>
                                    <img id={'keysafe-icon'} src={ require('../../../../assets/logo.png') } />
                                    <div id={'version-info'}>
                                        <span id={'app-name'}>{title}</span>
                                        <span id={'app-slogan'}>{slogan}</span>
                                        <span id={'app-version'}> Version: {appVersion} </span>
                                    </div>
                                    <UIClear/>
                                </div>

                                <UIClear/>
                            </div>

                            <div className="mdl-tabs__panel" id="os-list-tab">

                                <div id={'os-list'}>
                                    <table>
                                        <tbody>
                                        <tr>
                                            <td>
                                                <img id={'windows-icon'} src={require('./windows-10-logo.png')} />
                                            </td>
                                            <td>
                                                <img id={'linux-icon'} src={require('./linux-logo.png')} />
                                            </td>
                                            <td>
                                                <img id={'macos-icon'} src={require('./mac-logo.jpg')} />
                                            </td>
                                            <td>
                                                <img id={'ios-icon'} src={require('./ios-logo.png')} />
                                            </td>
                                            <td>
                                                <img id={'android-icon'} src={require('./android-logo.png')} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <span onClick={openDownload} className={'www'}>Download</span>
                                            </td>
                                            <td>
                                                <span onClick={openDownload} className={'www'}>Download</span>
                                            </td>
                                            <td>
                                                <span onClick={openDownload} className={'www'}>Download</span>
                                            </td>
                                            <td>
                                                <span onClick={openDownload} className={'www'}>Download</span>
                                            </td>
                                            <td>
                                                <span onClick={openDownload} className={'www'}>Download</span>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="mdl-tabs__panel" id={'source-code-tab'}>

                                <div id={'github-container'}>
                                    <h5>Open Source</h5>
                                    <p>
                                        {sourceCodeText}<br/>
                                    </p>
                                    <button className="BasicButton" onClick={openGithub}>{sourceCodeButton}</button>
                                    <UIClear/>
                                </div>

                                <div id={'framework-list-container'}>
                                    <h5>{frameworksTitle}</h5>
                                    <ul>
                                        <li><span className={'www'}>Electron: https://www.electronjs.org</span></li>
                                        <li><span className={'www'}>React: https://reactjs.org</span></li>
                                        <li><span className={'www'}>Node.js: https://nodejs.org</span></li>
                                        <li><span className={'www'}>Material Design Lite: https://getmdl.io</span></li>
                                    </ul>
                                </div>

                                <div id={'license-container'}>
                                    <h5> {licenseTitle} </h5>
                                    <UILicenseView/>
                                </div>

                            </div>

                        </div>


                        <div id={'copyr'}>

                            <div id={'footer-version-copyr-container'}>
                                <span id={'www'} onClick={openJawbWebsite}>www.jawb.de</span>
                                <span>contact@jawb.de</span>
                                Copyright &copy; 2019-{year} - jawb software
                            </div>

                            <div id={'footer-jawb-container'}>
                                <img id={'jawb-icon'} src={require('./jawb_logo.svg')} />
                            </div>
                        </div>
                        <UIClear/>
                    </div>

                </div>

            </div>
        );
    }
}

export default UIAboutDialog;
