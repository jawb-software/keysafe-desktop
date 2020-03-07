import React from 'react';

import '../UIBaseDialog.css';
import './UISettingsViewProfileSection.css';
import UIClear from "../../Basic/UIClear";
import UISelect from "../../Basic/UISelect";
import I18n from "../../../Basic/I18n/i18n";

class UISettingsViewProfileSection extends React.Component {

    constructor(props) {
        super(props);
        this.onChange       = this.onChange.bind(this);
        this.onRemoveProfileClicked = this.onRemoveProfileClicked.bind(this);
        this.state = {
            profile : props.profile,
            profileName: props.profile.name,
            profileList : props.profileList
        };
    }

    componentDidMount() {

    }

    onRemoveProfileClicked() {
        this.props.onPropertyChange('removeProfile');
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    _nameIsNew(profileName){
        const profiles = this.state.profileList;
        // console.log('_nameIsNew', profiles, profileName);

        if(profiles){
            const input = profileName.toLocaleLowerCase();
            for(let i = 0; i < profiles.length; i++){
                if(profiles[i].name.toLocaleLowerCase() === input){
                    if(profiles[i].id !== this.state.profile.id){
                        return false;
                    }
                }
            }
        }
        return true;
    }


    onChange(el) {

        const id    = el.target.id;
        const value = 'checkbox' === el.target.type ? el.target.checked : el.target.value;

        this.handleChange(id, value);
    }

    handleChange(id, value) {

        if(id === 'profile-name'){

            this.setState({
                profileName : value
            });

            if(!value || value.length === 0){
                return;
            }

            const self = this;

            value = value.trim();

            if(this._nameIsNew(value)){

                const label = document.querySelector('#profile-name-cont .mdl-textfield__label');
                const error = document.querySelector('#profile-name-cont .mdl-textfield__error');
                label.classList.remove("UIBaseDialog-Input-Error");
                error.style.visibility = 'hidden';

                if(this.timeout){
                    window.clearTimeout(this.timeout);
                    this.timeout = null;
                }
                this.timeout = window.setTimeout(() => {

                    // save
                    self.props.onPropertyChange('name', value);

                }, 350);

            } else {

                const label = document.querySelector('#profile-name-cont .mdl-textfield__label');
                const error = document.querySelector('#profile-name-cont .mdl-textfield__error');
                label.classList.add("UIBaseDialog-Input-Error");
                error.style.visibility = 'visible';

            }

        } else {
            const data = {};
            data[id] = value;

            this.props.onPropertyChange('sessionConfiguration', data);
        }
    }

    render() {

        const sessionTimeout = this.state.profile.sessionConfiguration.sessionTimeout;
        const textAutoLogout = I18n.settings_SectionMainShowLogout();
        const textPlaceholder1 = I18n.profile_Placeholder_ProfileName();
        const nameExists       = I18n.profile_Msg_ProfileAllreadyExists();

        const items = [
            {key: I18n.settings_SectionSessionTimeout_Off(),   value: -1},
            {key: I18n.settings_SectionSessionTimeout_Sec(20), value: 1000 * 20},
            {key: I18n.settings_SectionSessionTimeout_Sec(45), value: 1000 * 45},
            {key: I18n.settings_SectionSessionTimeout_Min(2),  value: 1000 * 60 * 2},
            {key: I18n.settings_SectionSessionTimeout_Min(5),  value: 1000 * 60 * 5},
            {key: I18n.settings_SectionSessionTimeout_Min(10), value: 1000 * 60 * 10},
            {key: I18n.settings_SectionSessionTimeout_Min(15), value: 1000 * 60 * 15}
        ];
       return (
        <div className={'UISettingsViewProfileSection'}>

            <div className={'element'}>
                { /*password 1*/}
                <div id="profile-name-cont" className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input value={this.state.profileName} onChange={this.onChange} className="mdl-textfield__input" id="profile-name" autoFocus/>
                    <label className="mdl-textfield__label" htmlFor="inp-1">{textPlaceholder1}</label>
                    <span className="mdl-textfield__error" > {nameExists} </span>
                </div>
                <br/>
            </div>

            <div className={"element"}>
                <UISelect id={"sessionTimeout"} onChange={this.onChange} initValue={sessionTimeout} items={items} label={textAutoLogout}/>
            </div>

           <div id={'remove-profile'}>
               <button className="BasicButton RemoveProfile-Button" onClick={this.onRemoveProfileClicked} >{I18n.settings_SectionProfileRemove()}</button>
           </div>

           <UIClear/>
       </div>
       );
    }
}

export default UISettingsViewProfileSection;
