import React from 'react';

import '../UIBaseDialog.css';
import './UIPasswordDialog.css';

import UIClear from "../../Basic/UIClear";

import {
    USER_ACTION_CANCEL_PASSWORD_DIALOG,
    USER_ACTION_SAVE_EDIT_PASSWORD,
    USER_ACTION_SAVE_NEW_PASSWORD
} from "../../../Basic/consts";

import {calculateScore} from "../../../Basic/PasswordGenerator/pwanalyse";
import {generatePassword} from "../../../Basic/PasswordGenerator/pwgen";
import I18n from "../../../Basic/I18n/i18n";
import UIDialogTitleWithoutCross from "../UIDialogTitleWithoutCross";

const ERR_INPUT_IS_EMPTY            = -20;
const ERR_INPUT_NAME_ALREADY_EXISTS = -10;

const ERR_INPUT_NO_CHANGE           = 0;
const OK_INPUT_CAN_BE_SAVED         = 1;

const FIELD_PASSWORD_NAME           = 1;
const FIELD_LOGIN_NAME              = 2;
const FIELD_PASSWORD                = 3;

class UIPasswordDialog extends React.Component {

    constructor(props) {
        super(props);
        this.handleSaveClick = this.handleSaveClick.bind(this);
        this.handleKeyPress  = this.handleKeyPress.bind(this);
        this.handleChange    = this.handleChange.bind(this);
        this.handleCancelClick = this.handleCancelClick.bind(this);
        this.handleGeneratePasswordClick = this.handleGeneratePasswordClick.bind(this);
        this.state = {
            passwordId:   props.passwordToChange ? props.passwordToChange.id        : null,
            passwordName: props.passwordToChange ? props.passwordToChange.name      : '',
            userName:     props.passwordToChange ? props.passwordToChange.userName  : '',
            password:     props.passwordToChange ? props.passwordToChange.password  : '',
            canSave: false,
            cfg: props.passwordGeneratorCfg
        };
        this.availableNames   = this.props.availableNames;
        this.initPasswordName = this.state.passwordName.toLocaleLowerCase();
        this.initUserName     = this.state.userName;
        this.initPassword     = this.state.password;

    }

    componentDidMount() {
        let input1 = document.querySelector('#password-name');
        let input2 = document.querySelector('#login-name');
        let input3 = document.querySelector('#password-chars');
        let pwScoreLabel = document.querySelector('#password-score-progress');

        if (!input1.MaterialTextfield) {
            componentHandler.upgradeElement(input1);
        }
        if (!input2.MaterialTextfield) {
            componentHandler.upgradeElement(input2);
        }
        if (!input3.MaterialTextfield) {
            componentHandler.upgradeElement(input3);
        }
        if (!pwScoreLabel.MaterialProgress) {
            componentHandler.upgradeElement(pwScoreLabel);
        }

        this.updatePasswordScore();

        const genBtn = document.getElementById("password-gen-button");

        if(genBtn){
            genBtn.removeAttribute("tabIndex");
        }
    }

    canBeSaved(input, src){

        if(!input && src !== FIELD_LOGIN_NAME){ // Login Name darf leer sein
            return ERR_INPUT_IS_EMPTY;
        }

        if(src === FIELD_PASSWORD_NAME){
            if(input === this.initPasswordName){
                return ERR_INPUT_NO_CHANGE;
            }

            // Name muss eindeutig sein
            if(this.availableNames.indexOf(input) >= 0){
                return ERR_INPUT_NAME_ALREADY_EXISTS;
            }

        } else if (src === FIELD_LOGIN_NAME){
            if(input === this.initUserName){
                return ERR_INPUT_NO_CHANGE;
            }
        } else if (src === FIELD_PASSWORD){
            if(input === this.initPassword){
                return ERR_INPUT_NO_CHANGE;
            }
        }

        return OK_INPUT_CAN_BE_SAVED;
    }

    handleChange(e) {

        const id    = e.target.id;
        const value = e.target.value;

        let name, userName, password;

        if (id === 'inp-1') {

            name      = value;
            userName  = this.state.userName;
            password  = this.state.password;

        } else if (id === 'inp-2') {

            name      = this.state.passwordName;
            userName  = value;
            password  = this.state.password;

        } else if (id === 'inp-3') {

            name      = this.state.passwordName;
            userName  = this.state.userName;
            password  = value;

        } else {
            //
            return;
        }

        const nameValue  = this.canBeSaved(name.trim().toLocaleLowerCase(), FIELD_PASSWORD_NAME);
        const loginValue = this.canBeSaved(userName.trim(), FIELD_LOGIN_NAME);
        const passValue  = this.canBeSaved(password.trim(), FIELD_PASSWORD);

        if(nameValue === ERR_INPUT_NAME_ALREADY_EXISTS){
            const label = document.querySelector('#password-name .mdl-textfield__label');
            const error = document.querySelector('#password-name .mdl-textfield__error');
            label.classList.add("UIBaseDialog-Input-Error");
            error.style.visibility = 'visible';
        } else {
            const label = document.querySelector('#password-name .mdl-textfield__label');
            const error = document.querySelector('#password-name .mdl-textfield__error');
            label.classList.remove("UIBaseDialog-Input-Error");
            error.style.visibility = 'hidden';
        }

        const checkSum = nameValue + loginValue + passValue;

        this.setState({
            passwordName: name,
            userName: userName,
            password: password,
            canSave: checkSum > 0
        });

        //this.updatePasswordScore();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.updatePasswordScore();
    }

    updatePasswordScore(){

        let password = this.state.password;
        let scoreDIV = document.querySelector('#password-score');

        if(!password || !password.length){
            scoreDIV.style.visibility = 'hidden';
            return;
        } else {
            scoreDIV.style.visibility = 'visible';
        }

        const scorePoints = calculateScore(password).score();

        const score = document.querySelector('#password-score-progress');
        score.MaterialProgress.setProgress(scorePoints);

        const progress = document.querySelector('.mdl-progress > .progressbar');
        const progressLabel = document.querySelector('#password-score-label');

        if(scorePoints < 30){
            progress.style.backgroundColor = '#F44336';
        } else if (scorePoints < 60) {
            progress.style.backgroundColor = '#FB8C00';
        } else {
            progress.style.backgroundColor = '#43c242';
        }
        progressLabel.innerHTML = I18n.basic_PasswordStrength(scorePoints);

    }

    handleCancelClick(){
        this.props.onUserAction(USER_ACTION_CANCEL_PASSWORD_DIALOG);
    }

    handleGeneratePasswordClick(){
        const pw = generatePassword(this.state.cfg);

        const input = document.querySelector('#password-chars');

        if(input.MaterialTextfield){
            input.MaterialTextfield.change(pw);
        } else {
            input.value = pw;
        }

        input.focus();
        this.handleChange({
            target : {
                id : 'inp-3',
                value: pw
            }
        });
    }

    handleSaveClick() {

        const name     = this.state.passwordName.trim();
        const userName = this.state.userName.trim();
        const password = this.state.password.trim();

        const checkSum = this.canBeSaved(name,     FIELD_PASSWORD_NAME)
                       + this.canBeSaved(userName, FIELD_LOGIN_NAME)
                       + this.canBeSaved(password, FIELD_PASSWORD);

        if (checkSum > 0) {

            const action = this.state.passwordId ? USER_ACTION_SAVE_EDIT_PASSWORD : USER_ACTION_SAVE_NEW_PASSWORD;

            this.props.onUserAction(action, {
                name: name,
                userName: userName,
                password: password,
            });
        }
    }

    handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.handleSaveClick();
        }
    }


    render() {

        // // Render nothing if the "show" prop is false
        // if(!this.props.show) {
        //     return null;
        // }

        const editMode = this.state.passwordId != null;

        const categoryName     = this.props.currentCategoryName;

        const textPlaceholder1 = I18n.setupPwDialog_KeyName();
        const textPlaceholder2 = I18n.setupPwDialog_UserName();
        const textPlaceholder3 = I18n.setupPwDialog_Password();
        const textTitle        = editMode ? I18n.setupPwDialog_Edit() : I18n.setupPwDialog_Create();
        const textSubTitle     = editMode || !categoryName ? null : I18n.setupPwDialog_Subtitle_Category(categoryName);
        const textCancel       = I18n.setupPwDialog_Cancel();
        const textSave         = I18n.setupPwDialog_Save();
        const nameExists       = I18n.setupPwDialog_PasswordNameExists();
        const textGenerate     = I18n.setupPwDialog_Generate();

        return (
            <div className="UIBaseDialog-Backdrop">
                <div className="UIBaseDialog-Content UIPasswordDialog">

                    <UIDialogTitleWithoutCross title={textTitle} subtitle={textSubTitle}/>

                    <div className="input-container">

                        { /*password name*/ }
                        <div id="password-name" className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                            <input value={this.state.passwordName} onChange={this.handleChange} className="mdl-textfield__input" type="text" id="inp-1" autoFocus/>
                            <label className="mdl-textfield__label" htmlFor="inp-1">{textPlaceholder1}</label>
                            <span className="mdl-textfield__error" > {nameExists} </span>
                        </div>

                        { /*login name*/ }
                        <div id="login-name" className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                            <input value={this.state.userName} onChange={this.handleChange} className="mdl-textfield__input" type="text" id="inp-2"/>
                            <label className="mdl-textfield__label" htmlFor="inp-2">{textPlaceholder2}</label>
                        </div>

                       <table>
                           <tbody>
                           <tr>
                               <td>
                                   { /*password*/ }
                                   <div id="password-chars" className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                                       <input value={this.state.password} onChange={this.handleChange} onKeyPress={this.handleKeyPress} type="text" className="mdl-textfield__input" id="inp-3"/>
                                       <label className="mdl-textfield__label" htmlFor="inp-3">{textPlaceholder3}</label>
                                   </div>
                               </td>
                               <td id={"password-gen"}>
                                   <button id={"password-gen-button"} onClick={this.handleGeneratePasswordClick}>{textGenerate}</button>
                               </td>
                           </tr>
                           </tbody>
                       </table>

                        <div id="password-score">
                            <div id="password-score-progress" className="mdl-progress mdl-js-progress"></div>
                            <label id="password-score-label" htmlFor="password-score-progress"></label>
                        </div>

                    </div>

                    <div className="footer">
                        <button onClick={this.handleCancelClick}> {textCancel} </button>
                        <button onClick={this.handleSaveClick} disabled={!this.state.canSave}> {textSave} </button>
                        <UIClear/>
                    </div>

                </div>

            </div>
        );
    }
}

export default UIPasswordDialog;
