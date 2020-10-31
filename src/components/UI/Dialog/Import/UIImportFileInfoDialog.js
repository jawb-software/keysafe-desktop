import React from 'react';

import '../../Loading/UILoadingView.css';
import '../UIBaseDialog.css';
import './UIImportFileInfoDialog.css';

import UIClear from "../../Basic/UIClear";
import {
    USER_ACTION_CANCEL_IMPORT_PASSWORDS,
    USER_ACTION_EXECUTE_IMPORT_PASSWORDS
} from "../../../Basic/consts";

import I18n from "../../../Basic/I18n/i18n";
import UIDialogTitleWithoutCross from "../UIDialogTitleWithoutCross";

const PROGRESS_STATE_BAD_PW  = -1;
const PROGRESS_STATE_NONE    = 0;
const PROGRESS_STATE_LOADING = 1;
const PROGRESS_STATE_DONE    = 2;

class UIImportFileInfoDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            backupPasswordInput : '',
            inputOk : false,
            progressState: PROGRESS_STATE_NONE
        };
        this.backupFileInfo = this.props.backupFileInfo;

        this.handleOKClick      = this.handleOKClick.bind(this);
        this.handleCancelClick  = this.handleCancelClick.bind(this);
        this.handleChange       = this.handleChange.bind(this);
        this.handleKeyPress     = this.handleKeyPress.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        let progress = document.querySelector('#backup-progress');
        if (progress && !progress.MaterialSnackbar) {
            componentHandler.upgradeElement(progress);
        }
        componentHandler.upgradeDom();
    }

    componentDidMount() {
        let input = document.querySelector('#backup-password');
        if (input && !input.MaterialSnackbar) {
            componentHandler.upgradeElement(input);
        }

        let progress = document.querySelector('#backup-progress');
        if (progress && !progress.MaterialSnackbar) {
            componentHandler.upgradeElement(progress);
        }
        componentHandler.upgradeDom();
    }

    handleChange(e) {
        const input = e.target.value;

        if(input){
            const label = document.querySelector('#backup-password .mdl-textfield__label');
            const error = document.querySelector('#backup-password .mdl-textfield__error');
            label.classList.remove("UIBaseDialog-Input-Error");
            error.style.visibility = 'hidden';
        } else {
            const label = document.querySelector('#backup-password .mdl-textfield__label');
            const error = document.querySelector('#backup-password .mdl-textfield__error');
            label.classList.add("UIBaseDialog-Input-Error");
            error.style.visibility = 'visible';
            error.innerHTML = I18n.backupImport_InputError_EmptyPassword();
        }

        this.setState({
            backupPasswordInput: input,
            inputOk: Boolean(input),
        });
    }

    setProgressState(progressState){

        if(progressState === PROGRESS_STATE_LOADING){

            this.setState({ progressState: PROGRESS_STATE_LOADING });

            let progress = document.querySelector('#backup-progress');
            if (progress && !progress.MaterialSnackbar) {
                componentHandler.upgradeElement(progress);
            }

        } else if (progressState === PROGRESS_STATE_BAD_PW){

            this.setState({ progressState: PROGRESS_STATE_NONE });

            const label = document.querySelector('#backup-password .mdl-textfield__label');
            const error = document.querySelector('#backup-password .mdl-textfield__error');
            label.classList.add("UIBaseDialog-Input-Error");
            error.style.visibility = 'visible';
            error.innerHTML = I18n.backupImport_Error_BadPassword();

        } else if (progressState === PROGRESS_STATE_DONE){

            this.refs.progressMsg.innerHTML = I18n.backupImport_Info_Completed() ;

        }

    }

    handleKeyPress(e){
        if (e.key === 'Enter') {
            this.handleOKClick();
        }
    }

    handleOKClick(){
        //
        this.backupFileInfo.passwordToDecrypt = this.state.backupPasswordInput;

        //
        this.props.onUserAction(USER_ACTION_EXECUTE_IMPORT_PASSWORDS, this.backupFileInfo);
    }

    handleCancelClick(){
        this.props.onUserAction(USER_ACTION_CANCEL_IMPORT_PASSWORDS);
    }

    render() {

        const backupFileInfo = this.props.backupFileInfo;
        const textTitle      = I18n.backupImport_Title();
        const textCancel     = I18n.basic_Cancel();
        const textImport     = I18n.backupImport_ImportBtn();

        const textFileName   = I18n.backupImport_Summary_FileName();
        const textCountCats  = I18n.backupImport_Summary_CountCategories();
        const textCountPass  = I18n.backupImport_Summary_CountPasswords();
        const textCreated    = I18n.backupImport_Summary_CreatedDate();

        return (

            <div className="UIBaseDialog-Backdrop">
                <div className="UIBaseDialog-Content UIImportFileInfoDialog">

                    <UIDialogTitleWithoutCross title={textTitle}/>

                    <div className="import-container">

                        <table id="backup-info-table" className="mdl-data-table mdl-js-data-table">
                            <tbody>
                            <tr>
                                <td width="150px"> {textFileName} </td>
                                <td>{backupFileInfo.file}</td>
                            </tr>
                            <tr>
                                <td> {textCountCats} </td>
                                <td>{backupFileInfo.categories}</td>
                            </tr>
                            <tr>
                                <td> {textCountPass} </td>
                                <td>{backupFileInfo.passwords}</td>
                            </tr>
                            <tr>
                                <td> {textCreated} </td>
                                <td>{backupFileInfo.created}</td>
                            </tr>
                            </tbody>
                        </table>

                        {backupFileInfo.passwordRequired && this.state.progressState === 0 ?
                            <div id="backup-password-container">
                                <span className="message"> { I18n.backupImport_Info_PleaseInputPassword() } </span>

                                <div id="backup-password" className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                                    <input
                                        id="inp-backup-password"
                                        className="mdl-textfield__input"
                                        type="password"
                                        value={this.state.backupPasswordInput}
                                        onChange={this.handleChange}
                                        onKeyPress={this.handleKeyPress}
                                        autoFocus/>
                                    <label className="mdl-textfield__label" htmlFor="inp-1"> { I18n.backupImport_InputLabel_Password() } </label>
                                    <span className="mdl-textfield__error" >  </span>
                                </div>
                            </div>
                            :
                            null
                        }

                        {this.state.progressState === PROGRESS_STATE_LOADING ?
                            <div id="backup-password-container">
                                <div id="backup-progress-rr">
                                    <div id="backup-progress" className="mdl-progress-row">
                                        <div className="mdl-progress mdl-js-progress mdl-progress__indeterminate"/>
                                    </div>
                                    <span ref="progressMsg" className="UILoading-Message"> { I18n.backupImport_Info_InProgress() } </span>
                                </div>
                            </div>
                            :
                            null
                        }

                        <UIClear/>
                    </div>

                    <div className="footer">
                        <button onClick={this.handleCancelClick}> {textCancel} </button>
                        <button onClick={this.handleOKClick} disabled={!this.state.inputOk || this.state.progressState === PROGRESS_STATE_LOADING}> {textImport} </button>
                        <UIClear/>
                    </div>
                </div>
            </div>
        );
    }
}

export default UIImportFileInfoDialog;
