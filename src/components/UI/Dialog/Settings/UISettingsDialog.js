import React from 'react';

import '../UIBaseDialog.css';
import './UISettingsDialog.css';
import {USER_ACTION_CANCEL_SETTINGS, USER_ACTION_REMOVE_PROFILE_CONFIRM, USER_ACTION_SAVE_SETTINGS} from "../../../Basic/consts";
import I18n from "../../../Basic/I18n/i18n";
import UISettingsPasswordGeneratorView from "./UISettingsPasswordGeneratorView";
import UISettingsViewConfigurationSection from "./UISettingsViewConfigurationSection";
import UISettingsViewProfileSection from "./UISettingsViewProfileSection";
import UIDialogTitleWithClose from "../UIDialogTitleWithClose";

class UISettingsDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            profile: this.props.profile
        };
        this.handleCancelClick = this.handleCancelClick.bind(this);
        this.onPropertyChange = this.onPropertyChange.bind(this);
    }

    onPropertyChange(key, data){

        if('removeProfile' === key){
            this.props.onUserAction(USER_ACTION_REMOVE_PROFILE_CONFIRM);
            return;
        }

        const changedData = {};
        changedData[key] = data;

        this.props.onUserAction(USER_ACTION_SAVE_SETTINGS, changedData);
    }

    handleCancelClick() {
       this.props.onUserAction(USER_ACTION_CANCEL_SETTINGS);
    }

    render() {

        // main section
        const textTitle           = I18n.settings_Title();
        const textMainSection     = I18n.settings_SectionMain();

        // password
        const textPasswordSection = I18n.settings_SectionPwGen();

        // profile / session
        const textProfileSection  = I18n.settings_SectionProfile();

        return (

            <div className="UIBaseDialog-Backdrop">
                <div className="UIBaseDialog-Content UISettingsDialog">

                    <UIDialogTitleWithClose title={textTitle} onCloseClick={this.handleCancelClick}/>

                    <div id="settings-container">

                        <div className="mdl-tabs mdl-js-tabs mdl-js-ripple-effect">
                            <div className="mdl-tabs__tab-bar">
                                <a href="#main-section" className="mdl-tabs__tab is-active">{textMainSection}</a>
                                <a href="#password-generator-section" className="mdl-tabs__tab"> {textPasswordSection} </a>
                                <a href="#profile-section" className="mdl-tabs__tab">{textProfileSection}</a>
                            </div>

                            <div className="mdl-tabs__panel is-active" id="main-section">

                                <br/>
                                <UISettingsViewConfigurationSection onPropertyChange={this.onPropertyChange} profile={this.props.profile}/>

                            </div>

                            <div className="mdl-tabs__panel" id="password-generator-section">

                                <br/>
                                <UISettingsPasswordGeneratorView onPropertyChange={this.onPropertyChange} profile={this.props.profile}/>

                            </div>

                            <div className="mdl-tabs__panel" id="profile-section">

                                <br/>
                               <UISettingsViewProfileSection onPropertyChange={this.onPropertyChange} profileList={this.props.profileList} profile={this.props.profile}/>

                            </div>
                        </div>


                    </div>

                </div>

            </div>
        );
    }
}

export default UISettingsDialog;
