import React from 'react';
import './UILoginView.css';
import {MIN_MASTER_PW_LENGTH, USER_ACTION_OPEN_NEW_PROFILE_VIEW, USER_ACTION_DO_LOGIN} from "../../Basic/consts";
import UIClear from "../Basic/UIClear";
import I18n from "../../Basic/I18n/i18n";
import {openJawbWebsite, openKeysafeWebsite} from "../../Basic/utils";

class UILoginView extends React.Component {

    constructor(props) {
        super(props);
        this.handleChange   = this.handleChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
        this.onLoginClick = this.onLoginClick.bind(this);
        this.onCreateProfileClick  = this.onCreateProfileClick.bind(this);

        let lastId = null;
        let last = 0;

        try {
            for(let i = 0; i < this.props.profiles.length; i++){
                const profile = this.props.profiles[i];

                const time1 = profile.lastLogin ? profile.lastLogin.getTime() : -1;
                const time2 = profile.currentLogin ? profile.currentLogin.getTime() : -1;

                const time = time1 > time2 ? time1 : time2;

                if(time > last){
                    last   = time;
                    lastId = profile.id;
                }
            }
        } catch (e) {
            console.error(e);
        }

        this.state = {
            canSave: true,
            password: '',
            profileId: lastId
        };
    }

    onLoginClick(){
        const profileId = this.state.profileId;
        const password  = this.state.password;

        if(password && password.length > 0 && profileId.length){
            this.props.onUserAction(USER_ACTION_DO_LOGIN, {
                profileId: profileId,
                password: password
            });
        }
    }

    onCreateProfileClick(){
        this.props.onUserAction(USER_ACTION_OPEN_NEW_PROFILE_VIEW);
    }

    onSelectChange(el){

        const profileId = el.target.value;
        const password  = this.state.password;

        this.setState({profileId: profileId, canSave: profileId.length && password.length > 0});
    }

    handleKeyPress(e){
        if (e.key === 'Enter') {
            this.onLoginClick();
        }
    }

    componentDidMount() {
        const input1 = document.querySelector('#master-password');
        if (!input1.MaterialTextfield) {
            componentHandler.upgradeElement(input1);
        }

        const profile_selector = document.querySelector('#profile-select-container');
        if(window.MaterialSelectfield){
            componentHandler.upgradeElement(profile_selector);
        }
    }

    handleChange(e) {
        const profileId = this.state.profileId;
        const password  = e.target.value;
        this.setState({ password: password, canSave: profileId.length && password.length > 0 });
    }

    render() {

        const textPlaceholder1 = I18n.login_Placeholder_MasterPassword();
        const selectLabel      = I18n.login_Placeholder_ProfileName();
        const applyBtn         = I18n.login_DoLogin();
        const createProfileBtn = I18n.login_CreateNewProfile();

        const options = this.props.profiles.map(p => {
            return (<option key={p.id} value={p.id}>{p.name}</option>);
        });

        if(options.length > 1){
            options.unshift(<option key='-1' value="">--</option>);
        }

        const dfltValue = this.state.profileId;

        return (
            <div className="keysafe-Outer-Container keysafe-Outer-Container-Login">

                <div id={'website-links'}>
                    <span className={'www'} onClick={openKeysafeWebsite}>www.keysafe-app.com</span>
                    <span className={'www'} onClick={openJawbWebsite}>www.jawb.de</span>
                </div>
                <div className="keysafe-Middle-Container">
                    <div className="keysafe-Inner-Container keysafe-Login-Container">

                        <div id="profile-select-container" className="mdl-selectfield mdl-js-selectfield  mdl-selectfield--floating-label">
                            <select value={dfltValue} onChange={this.onSelectChange} id="profile-select" name="myselect" className="mdl-selectfield__select">
                                {options}
                            </select>
                            <label className="mdl-selectfield__label mdl-textfield__label" htmlFor="profile-select">{selectLabel}</label>
                        </div>

                        { /*password 1*/}
                        <div id="master-password" className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                            <input value={this.state.password} onChange={this.handleChange} onKeyPress={this.handleKeyPress} type="password" className="mdl-textfield__input" id="inp-1" autoFocus/>
                            <label className="mdl-textfield__label" htmlFor="inp-1">{textPlaceholder1}</label>
                        </div>

                        <br/>

                        <button className="UILoginView BasicButton LoginButton" onClick={this.onLoginClick} disabled={!this.state.canSave}>{applyBtn}</button>
                        <button className="UILoginView BasicButton CreateProfileButton" onClick={this.onCreateProfileClick}>{createProfileBtn}</button>
                        <UIClear/>

                    </div>
                </div>
            </div>
        );
    }
}

export default UILoginView;
