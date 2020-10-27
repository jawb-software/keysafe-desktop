import React from 'react';
import './UICreateProfileView.css';
import {MIN_MASTER_PW_LENGTH, MIN_MASTER_PW_SCORE, USER_ACTION_OPEN_LOGIN_VIEW, USER_ACTION_SAVE_NEW_PROFILE} from "../../Basic/consts";
import I18n from "../../Basic/I18n/i18n";
import {calculateScore} from "../../Basic/PasswordGenerator/pwanalyse";

class UICreateProfileView extends React.Component {

    constructor(props) {
        super(props);
        this.onCreateProfileClick  = this.onCreateProfileClick.bind(this);
        this.onGoToLoginClick  = this.onGoToLoginClick.bind(this);
        this.handleChange   = this.handleChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.state = {
            profileName: '',
            password1: '',
            password2: '',
            canSave: false,
            profiles: props.profiles
        };
        // console.log(props.profiles);
    }

    onGoToLoginClick() {
        this.props.onUserAction(USER_ACTION_OPEN_LOGIN_VIEW);
    }

    onCreateProfileClick(){
        const profile   = this.state.profileName;
        const password1 = this.state.password1;

        if(this.state.canSave){
            this.props.onUserAction(USER_ACTION_SAVE_NEW_PROFILE, {name: profile, password: password1});
        } else {
            console.log('Error: invalid create profile form.');
        }
    }

    _nameIsNew(profileName){
        const profiles = this.state.profiles;
        // console.log('_nameIsNew', profiles, profileName);

        if(profiles){
            const input = profileName.toLocaleLowerCase();
            for(let i = 0; i < profiles.length; i++){
                if(profiles[i].name.toLocaleLowerCase() === input){
                    return false;
                }
            }
        }
        return true;
    }

    componentDidMount() {
        const pwScoreLabel = document.querySelector('#password-score-progress');
        const input1 = document.querySelector('#profile-name');
        const input2 = document.querySelector('#password-1');
        const input3 = document.querySelector('#password-2');

        if (!input1.MaterialSnackbar) {
            componentHandler.upgradeElement(input1);
        }
        if (!input2.MaterialSnackbar) {
            componentHandler.upgradeElement(input2);
        }
        if (!input3.MaterialSnackbar) {
            componentHandler.upgradeElement(input3);
        }

        if (!pwScoreLabel.MaterialProgress) {
            componentHandler.upgradeElement(pwScoreLabel);
        }
        this.updatePasswordScore(-1);
    }

    handleKeyPress(e){
        if (e.key === 'Enter') {
            if(e.target.id === 'inp-3'){
                this.onCreateProfileClick();
            } else {
                e.preventDefault();
            }
        }
    }

    handleChange(e) {

        const id    = e.target.id;
        const value = e.target.value;
        let profileName, password1, password2, passwordsAreEqual, profileNameOK, passwordIsStrong;
        let passwordScorePoints = 0;

        if (id === 'inp-1') {

            profileName = value;
            password1   = this.state.password1;
            password2   = this.state.password2;
            passwordsAreEqual = password2 === password1;
            profileNameOK     = (!profileName || profileName.length === 0) || this._nameIsNew(profileName);
            passwordIsStrong  = passwordScorePoints >= MIN_MASTER_PW_SCORE && password1.length >= MIN_MASTER_PW_LENGTH;

            this.setState({
                profileName: value,
                canSave: profileNameOK && passwordIsStrong && passwordsAreEqual
            });

        } else if (id === 'inp-2') {

            profileName = this.state.profileName;
            password1   = value;
            password2   = this.state.password2;
            passwordsAreEqual = password2 === password1;
            profileNameOK     = (!profileName || profileName.length === 0) || this._nameIsNew(profileName);
            passwordScorePoints = calculateScore(password1).score();
            passwordIsStrong = passwordScorePoints >= MIN_MASTER_PW_SCORE && password1.length >= MIN_MASTER_PW_LENGTH;

            this.setState({
                password1: password1,
                canSave: profileNameOK && passwordIsStrong && passwordsAreEqual
            });

        } else if (id === 'inp-3') {

            profileName       = this.state.profileName;
            password1         = this.state.password1;
            password2         = value;
            passwordsAreEqual = password2 === password1;
            profileNameOK     = (!profileName || profileName.length === 0) || this._nameIsNew(profileName);
            passwordScorePoints = calculateScore(password1).score();
            passwordIsStrong = passwordScorePoints >= MIN_MASTER_PW_SCORE && password1.length >= MIN_MASTER_PW_LENGTH;

            this.setState({
                password2: password2,
                canSave: profileNameOK && passwordIsStrong && passwordsAreEqual
            });
        }

        const label1 = document.querySelector('#password-1 .mdl-textfield__label');
        const label2 = document.querySelector('#password-2 .mdl-textfield__label');

        if(!password1){
            label1.classList.remove("UIBaseDialog-Input-Error");
            label2.classList.remove("UIBaseDialog-Input-Error");
        } else {

            if(passwordsAreEqual){
                if(passwordIsStrong){
                    label1.classList.remove("UIBaseDialog-Input-Error");
                    label2.classList.remove("UIBaseDialog-Input-Error");
                } else {
                    label1.classList.add("UIBaseDialog-Input-Error");
                }
            } else {
                if(password2){
                    label2.classList.add("UIBaseDialog-Input-Error");
                }
            }

        }

        if(profileNameOK){
            const label = document.querySelector('#profile-name .mdl-textfield__label');
            const error = document.querySelector('#profile-name .mdl-textfield__error');
            label.classList.remove("UIBaseDialog-Input-Error");
            error.style.visibility = 'hidden';
        } else {
            const label = document.querySelector('#profile-name .mdl-textfield__label');
            const error = document.querySelector('#profile-name .mdl-textfield__error');
            label.classList.add("UIBaseDialog-Input-Error");
            error.style.visibility = 'visible';
        }

        const self = this;

        //
        if(password1 || password2){

            setTimeout(() => {
                self.updatePasswordScore(passwordScorePoints);
            }, 100);

        }

    }

    updatePasswordScore(scorePoints){

        if(!this.scoreDIV){
            this.scoreDIV = document.querySelector('#password-score');
        }

        if(scorePoints < 0){
            this.scoreDIV.style.visibility = 'hidden';
            return;
        } else {
            this.scoreDIV.style.visibility = 'visible';
        }

        if(!this.scoreEL){
            this.scoreEL = document.querySelector('#password-score-progress');
        }

        this.scoreEL.MaterialProgress.setProgress(scorePoints);

        if(!this.progress){
            this.progress = document.querySelector('.mdl-progress > .progressbar');
        }

        if(!this.progressLabel){
            this.progressLabel = document.querySelector('#password-score-label');
        }

        if(scorePoints < 30){
            this.progress.style.backgroundColor = '#F44336';
        } else if (scorePoints < 60) {
            this.progress.style.backgroundColor = '#FB8C00';
        } else {
            this.progress.style.backgroundColor = '#43c242';
        }

        this.progressLabel.innerHTML = I18n.basic_PasswordStrength(scorePoints);

    }

    render() {

        // console.log(this.state.password1);

        const title            = I18n.profile_Title();
        const slogan           = I18n.profile_Slogan();
        const encryption1      = I18n.profile_Encryption();
        const encryption2      = I18n.profile_EncryptionData();

        const info             = I18n.profile_MasterPwInfo();
        const warning          = I18n.profile_MasterPwWarning();
        const textPlaceholder1 = I18n.profile_Placeholder_ProfileName();
        const textPlaceholder2 = I18n.profile_Placeholder_MasterPw(MIN_MASTER_PW_LENGTH);
        const textPlaceholder3 = I18n.profile_Placeholder_MasterPw_Confirm();
        const applyBtn         = I18n.profile_CreateProfileButton();
        const goTologinBtn     = I18n.profile_LoginUsingOtherProfile();
        const nameExists       = I18n.profile_Msg_ProfileAllreadyExists();

        const canLogin         = this.props.profiles && this.props.profiles.length > 0;

        const left = (
            <div className="UIRegistrationView-Section">
                <h2 className="UIRegistrationView">{ title }</h2>
                <h4 className="UIRegistrationView">{ slogan }</h4>
                <br/>
                <span className="UIRegistrationView" dangerouslySetInnerHTML={{__html : info}} />
                <span className="PreTitle"> { encryption1 } </span>
                <pre className="UIRegistrationView">
                    {encryption2[0]}<br/>
                    {encryption2[1]}<br/>
                    {encryption2[2]}<br/>
                    {encryption2[3]}<br/>
                    {encryption2[4]}<br/>
                    {encryption2[5]}
                </pre>
            </div>
        );
        const right = (
            <div className="UIRegistrationView-Section UIRegistrationView-Section2">
                <span className="UIRegistrationView"> {warning} </span>

                { /*password 1*/}
                <div id="profile-name" className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input onChange={this.handleChange} className="mdl-textfield__input" id="inp-1" autoFocus/>
                    <label className="mdl-textfield__label" htmlFor="inp-1">{textPlaceholder1}</label>
                    <span className="mdl-textfield__error" > {nameExists} </span>
                </div>
                <br/>

                { /*password 1*/}
                <div id="password-1" className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input onChange={this.handleChange} type="password" className="mdl-textfield__input" id="inp-2"/>
                    <label className="mdl-textfield__label" htmlFor="inp-2">{textPlaceholder2}</label>
                </div>

                { /*password 2*/}
                <div id="password-2" className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input onKeyPress={this.handleKeyPress} onChange={this.handleChange} type="password" className="mdl-textfield__input" id="inp-3"/>
                    <label className="mdl-textfield__label" htmlFor="inp-3">{textPlaceholder3}</label>
                </div>

                <div id="password-score">
                    <div id="password-score-progress" className="mdl-progress mdl-js-progress"></div>
                    <label id="password-score-label" htmlFor="password-score-progress"></label>
                </div>

                <br/>
                <br/>

                <button disabled={!this.state.canSave} className="BasicButton UIRegistrationView" onClick={this.onCreateProfileClick}>{applyBtn}</button>

                {canLogin &&
                    <div>
                        <br/>
                        <hr/>
                        <br/>
                        <button onKeyPress={this.handleKeyPress} id={"go-to-login"} className="BasicButton UIRegistrationView" onClick={this.onGoToLoginClick}>{goTologinBtn}</button>
                    </div>
                }
            </div>
        );

        return (
            <div className="keysafe-Outer-Container">
                <div className="keysafe-Middle-Container">
                    <div className="UIRegistrationView">
                        <table>
                            <tbody>
                            <tr>
                                <td> {left} </td>
                                <td> {right} </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default UICreateProfileView;
