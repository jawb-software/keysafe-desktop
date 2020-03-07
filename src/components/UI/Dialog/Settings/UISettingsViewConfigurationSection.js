import React from 'react';

import '../UIBaseDialog.css';
import './UISettingsViewConfigurationSection.css';
import UICheckbox from "../../Basic/UICheckbox";
import I18n from "../../../Basic/I18n/i18n";

class UISettingsViewConfigurationSection extends React.Component {

    constructor(props) {
        super(props);
        this.onChange       = this.onChange.bind(this);
        this.state = {
            cfg : props.profile.viewConfiguration
        };
    }

    componentDidMount() {
        let input = document.querySelector('#symbols-input-div');

        if(!input){
            console.log("ERROR: Element not found!");
            return;
        }

        if (!input.MaterialSnackbar) {
            componentHandler.upgradeElement(input);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // console.log("componentDidUpdate");
    }

    onChange(el) {

        const id    = el.target.id;
        const value = 'checkbox' === el.target.type ? el.target.checked : el.target.value;

        const data = this.state.cfg;

        if('digits' === id){
            data[id] = value.replace(/\D/g, '');
        } else if('upperCases' === id){
            data[id] = value.replace( /[^A-Z]/g, '');
        }  else if('lowerCases' === id){
            data[id] = value.replace( /[^a-z]/g, '');
        } else {
            data[id] = value;
        }

        this.props.onPropertyChange('viewConfiguration', data);

        this.setState({
            cfg : data
        });
    }

    render() {

        const textHideUserName      = I18n.settings_SectionMainShowUserName();
        const textHidePassword      = I18n.settings_SectionMainShowPassword();
        const textShowLastChange    = I18n.settings_SectionMainShowLastChange();
        const textShowPasswordScore = I18n.settings_SectionMainShowPasswordScore();

        const showUserName          = this.state.cfg.showUserName;
        const showPassword          = this.state.cfg.showPassword;
        const showLastChange        = this.state.cfg.showLastChange;
        const showPasswordScore     = this.state.cfg.showPasswordScore;

        return (

            <div>

                <div className={"element"}>
                    <UICheckbox id={"showUserName"} onChange={this.onChange} label={textHideUserName} defaultChecked={showUserName}/>
                </div>

                <div className={"element"}>
                    <UICheckbox id={"showPassword"} onChange={this.onChange} label={textHidePassword} defaultChecked={showPassword}/>
                </div>

                <div className="space"></div>

                <div className={"element"}>
                    <UICheckbox id={"showLastChange"} onChange={this.onChange} label={textShowLastChange} defaultChecked={showLastChange}/>
                </div>

                <div className={"element"}>
                    <UICheckbox id={"showPasswordScore"} onChange={this.onChange} label={textShowPasswordScore} defaultChecked={showPasswordScore}/>
                </div>

            </div>

        );
    }
}

export default UISettingsViewConfigurationSection;
