import React from 'react';

import UITitleBar from './UI/TitleBar/UITitleBar';
import UIToolBar from './UI/ToolBar/UIToolBar';
import UIPasswordList from './UI/PasswordList/UIPasswordList';
import UILoadingView from "./UI/Loading/UILoadingView";
import '../assets/css/main.css';
import '../assets/css/custom.css';
import '../assets/css/main.js';
import '../assets/css/select.css';
import '../assets/css/select.js';

import {
    CFG_LOG_APP,
    DEV_USER_ACTION_HIDE_DB,
    DEV_USER_ACTION_RESET_DB,
    DEV_USER_ACTION_SHOW_DB,
    USER_ACTION_CANCEL_CATEGORY_SETUP,
    USER_ACTION_CANCEL_IMPORT_PASSWORDS,
    USER_ACTION_CANCEL_MOVE_PASSWORD,
    USER_ACTION_CANCEL_PASSWORD_DIALOG,
    USER_ACTION_CANCEL_PASSWORD_GENERATOR_DIALOG,
    USER_ACTION_CANCEL_PASSWORD_STRENGTH_DIALOG,
    USER_ACTION_CANCEL_REMOVE_CATEGORY,
    USER_ACTION_CANCEL_REMOVE_PASSWORD,
    USER_ACTION_CANCEL_SETTINGS,
    USER_ACTION_CATEGORY_SELECTED,
    USER_ACTION_CLOSE_ABOUT,
    USER_ACTION_CLOSE_ABOUT_ENCRYPTION_INFO,
    USER_ACTION_CLOSE_CATEGORY_LIST,
    USER_ACTION_CLOSE_HOWTO,
    USER_ACTION_COPY_PASSWORD,
    USER_ACTION_COPY_USER_NAME,
    USER_ACTION_DO_EXIT,
    USER_ACTION_DO_LOGIN,
    USER_ACTION_DO_LOGOUT,
    USER_ACTION_EDIT_CATEGORY,
    USER_ACTION_EDIT_PASSWORD,
    USER_ACTION_EXECUTE_IMPORT_PASSWORDS,
    USER_ACTION_EXECUTE_MOVE_PASSWORD,
    USER_ACTION_EXECUTE_REMOVE_CATEGORY,
    USER_ACTION_EXECUTE_REMOVE_PASSWORD,
    USER_ACTION_EXPORT_PASSWORDS,
    USER_ACTION_IMPORT_PASSWORDS,
    USER_ACTION_MOVE_PASSWORD,
    USER_ACTION_NEW_CATEGORY,
    USER_ACTION_NEW_PASSWORD,
    USER_ACTION_OPEN_ABOUT,
    USER_ACTION_OPEN_ABOUT_ENCRYPTION_INFO,
    USER_ACTION_OPEN_CATEGORY_LIST,
    USER_ACTION_OPEN_HOWTO,
    USER_ACTION_OPEN_LOGIN_VIEW,
    USER_ACTION_OPEN_NEW_PROFILE_VIEW,
    USER_ACTION_OPEN_SETTINGS,
    USER_ACTION_PASSWORD_FILTER,
    USER_ACTION_REMOVE_CATEGORY,
    USER_ACTION_REMOVE_PASSWORD,
    USER_ACTION_REMOVE_PROFILE_CANCEL,
    USER_ACTION_REMOVE_PROFILE_CONFIRM,
    USER_ACTION_REMOVE_PROFILE_EXECUTE,
    USER_ACTION_RESET_SESSION_TIMER,
    USER_ACTION_SAVE_EDIT_CATEGORY,
    USER_ACTION_SAVE_EDIT_PASSWORD,
    USER_ACTION_SAVE_NEW_CATEGORY,
    USER_ACTION_SAVE_NEW_PASSWORD,
    USER_ACTION_SAVE_NEW_PROFILE,
    USER_ACTION_SAVE_SETTINGS,
    USER_ACTION_SHOW_PASSWORD_GENERATOR_DIALOG,
    USER_ACTION_SHOW_PASSWORD_STRENGTH_DIALOG,
    USER_ACTION_SHOW_TOAST,
    VIEW_STATE_CLEANING_DATA,
    VIEW_STATE_CONFIRM_REMOVE_PROFILE,
    VIEW_STATE_CREATE_PROFILE,
    VIEW_STATE_EXPORTING_DATA,
    VIEW_STATE_LOADING_ALL,
    VIEW_STATE_LOADING_ALL_ERROR,
    VIEW_STATE_LOADING_PASSWORDS,
    VIEW_STATE_LOGIN_REQUIRED,
    VIEW_STATE_READY
} from "./Basic/consts";

import UICategoryDialog from "./UI/Dialog/Category/UICategoryDialog";
import UIToast from "./UI/Toast/UIToast";
import UICreateProfileView from "./UI/FirstStart/UICreateProfileView";
import UIPasswordDialog from "./UI/Dialog/Password/UIPasswordDialog";
import UINoCategoriesView from "./UI/FirstStart/UINoCategoriesView";
import UILoginView from "./UI/FirstStart/UILoginView";
import UICloseOnlyTitleBar from "./UI/TitleBar/UICloseOnlyTitleBar";
import {arrayIsEmpty, logSafeObject, notEmpty} from "./Basic/utils";
import UIQuestionDialog from "./UI/Dialog/Question/UIQuestionDialog";
import UIDEVDbViewDialog from "./UI/Dialog/DbView/UIDEVDbViewDialog";
import UIImportFileInfoDialog from "./UI/Dialog/Import/UIImportFileInfoDialog";
import I18n from "./Basic/I18n/i18n";
import UIStatusBar from "./UI/StatusBar/UIStatusBar";
import UISettingsDialog from "./UI/Dialog/Settings/UISettingsDialog";
import DataLoader from "./DataBase/DataLoader";
import Profile from "./Basic/Types/Profile";
import UIBlackOverlay from "./UI/Basic/UIBlackOverlay";
import CryptError from "./Basic/Types/CryptError";
import Crypt from "./DataBase/Security/Crypt";
import UIPasswordScoreDialog from "./UI/Dialog/Password/UIPasswordScoreDialog";
import UIPasswordGeneratorDialog from "./UI/Dialog/Password/UIPasswordGeneratorDialog";
import UIRemoveProfileView from "./UI/RemoveProfile/UIRemoveProfileView";
import UIAboutDialog from "./UI/Dialog/About/UIAboutDialog";
import UIEncryptionInfoDialog from "./UI/Dialog/About/encryption/UIEncryptionInfoDialog";
import UIHowToDialog from "./UI/Dialog/About/howto/UIHowToDialog";
import UICategoryListDialog from "./UI/Dialog/Category/UICategoryListDialog";

const { clipboard } = require('electron');

class App extends React.Component {

    constructor(props) {
        super(props);
        this.onUserAction = this.onUserAction.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this._handleError = this._handleError.bind(this);
        this.state        = App.defaultState(VIEW_STATE_LOADING_ALL, []);
        this.dataLoader   = new DataLoader();
        this.toast        = React.createRef();
        this.importDialog = React.createRef();

        this.sessionTimeOutId    = null;
        this.clipboardCopiedHash = null;
        this.clipboardTimeOutId  = null;
    }

    static defaultState(viewState, profiles){

        return {
            badLoginCounter : 0,
            profile: null,
            profileList: profiles,
            categories: [],
            passwords: [],
            passwordsAllCount: 0,
            viewState: viewState,

            showCategorySetupDialog: false,
            showCategoryConfirmRemoveDialog: false,
            categoryToChange: null,
            showCategoryList: false,

            showPasswordSetupDialog: false,
            showPasswordSetupDialogAfterCategoryCreated: false,
            showPasswordConfirmRemoveDialog: false,
            showPasswordMoveDialog: false,
            showPasswordScoreDialog: false,
            showPasswordGeneratorDialog: false,
            showSettingsDialog: false,
            devShowDBDialog: false,

            passwordToChange : null,

            showBackupFileInfoDialog: false,
            backupFileInfo: null,
            backupImportBadPasswordCounter : 0,

            passwordFilter: null,

            showAboutDialog : false,
            showAboutEncryptionInfoDialog : false,
            showHowToDialog : false,
        };

    }

    onKeyDown(event){
        if (event.key === 'Escape' || event.keyCode === 27) {

            this.setState({
                showCategorySetupDialog: false,
                showCategoryConfirmRemoveDialog: false,
                categoryToChange: null,
                showPasswordSetupDialog: false,
                showPasswordConfirmRemoveDialog: false,
                passwordToChange : null,
                showPasswordScoreDialog: false,
                showPasswordGeneratorDialog: false,
                showSettingsDialog: false,
                showBackupFileInfoDialog: false,
                showAboutDialog : false,
                showAboutEncryptionInfoDialog : false,
                showHowToDialog : false
            });

        } else if (event.key === 'F1'){

            try {
                require('electron').remote.BrowserWindow.getFocusedWindow().webContents.openDevTools()
            } catch (e) {
                console.error(e);
            }

        }
    }

    registerListeners(){
        document.addEventListener('keydown', this.onKeyDown);
    }

    unregisterListeners(){
        document.addEventListener('keydown', this.onKeyDown);
    }

    componentDidMount() {

        this.registerListeners();

        const self = this;
        setTimeout(() => {
            self._reloadViewState();
        }, 200);

    }

    componentWillUnmount() {
        this.unregisterListeners();
    }

    onUserAction(action, value){

        if(CFG_LOG_APP){
            this.log('App#onUserAction: ', action, logSafeObject(value));
        }

        this._setSessionTimeOut(action);

        //
        // CATEGORY
        //
        if(action === USER_ACTION_NEW_CATEGORY){ // Dialog zeigen

            this._handleOpenNewCategoryDialog();

        } else if(action === USER_ACTION_SAVE_NEW_CATEGORY){ // speichern

            this._handleCreateCategory(value);

        } else if(action === USER_ACTION_EDIT_CATEGORY){

            this._handleOpenEditCategoryDialog();

        } else if(action === USER_ACTION_SAVE_EDIT_CATEGORY){ // speichern

            this._handleUpdateCategory(value);

        }  else if(action === USER_ACTION_CATEGORY_SELECTED){

            this._handleCategorySelection(value);

        } else if(action === USER_ACTION_CANCEL_CATEGORY_SETUP){ // abbrechen

            this._handleCancelCategoryDialog();

        } else if(action === USER_ACTION_REMOVE_CATEGORY){

            this._handleRemoveCategoryRequest();

        } else if(action === USER_ACTION_CANCEL_REMOVE_CATEGORY){

            this._handleCancelRemoveCategoryDialog();

        } else if(action === USER_ACTION_EXECUTE_REMOVE_CATEGORY){

            this._handleRemoveCategory(value);

        } else if(action === USER_ACTION_OPEN_CATEGORY_LIST){

            //
            this._handleOpenCategoryList();

        } else if(action === USER_ACTION_CLOSE_CATEGORY_LIST){

            //
            this._handleCloseCategoryList();

        }
        //
        // PASSWORD
        //
        else if(action === USER_ACTION_PASSWORD_FILTER){

            this.setState({ passwordFilter: value});

        } else if(action === USER_ACTION_NEW_PASSWORD){

            this._handleOpenCreatePasswordDialog();

        } else if(action === USER_ACTION_SAVE_NEW_PASSWORD){

            this._handleCreatePassword(value);

        } else if(action === USER_ACTION_EDIT_PASSWORD){

            this._handleOpenPasswordEditDialog(value);

        } else if(action === USER_ACTION_SAVE_EDIT_PASSWORD){

            this._handleUpdatePassword(value);

        } else if(action === USER_ACTION_CANCEL_PASSWORD_DIALOG){

            this._handleCancelPasswordInputDialog();

        } else if(action === USER_ACTION_REMOVE_PASSWORD){

            this._handleRemovePasswordRequest(value);

        } else if(action === USER_ACTION_CANCEL_MOVE_PASSWORD){

            this._handleCancelMovePasswordToOtherCategoryRequest();

        } else if(action === USER_ACTION_EXECUTE_MOVE_PASSWORD){

            this._handleExecuteMovePasswordToOtherCategory(value);

        } else if(action === USER_ACTION_MOVE_PASSWORD){

            this._handleMovePasswordToOtherCategoryRequest(value);

        } else if(action === USER_ACTION_CANCEL_REMOVE_PASSWORD){

            this._handleCancelRemovePassword();

        } else if(action === USER_ACTION_EXECUTE_REMOVE_PASSWORD){

            this._handleRemovePassword(value.id);

        } else if(action === USER_ACTION_COPY_USER_NAME){

            this._handleCopyUserName(value);

        } else if(action === USER_ACTION_COPY_PASSWORD){

            this._handleCopyPassword(value);

        } else if(action === USER_ACTION_SHOW_PASSWORD_GENERATOR_DIALOG){

            this._handleOpenPasswordGeneratorDialog(value);

        } else if(action === USER_ACTION_CANCEL_PASSWORD_GENERATOR_DIALOG){

            this._handleCancelPasswordGeneratorDialog(value);

        } else if(action === USER_ACTION_SHOW_PASSWORD_STRENGTH_DIALOG){

            this._handleOpenPasswordScoreDialog(value);

        } else if(action === USER_ACTION_CANCEL_PASSWORD_STRENGTH_DIALOG){

            this._handleCancelPasswordScoreDialog();

        }

        //
        // HELP, ABOUT
        //
        else if(action === DEV_USER_ACTION_RESET_DB){

            const self = this;

            self.setState({viewState: VIEW_STATE_LOADING_ALL});

            this.dataLoader.resetDB()
                .then(() => {
                    this.componentDidMount();
                })
                .catch(err => {
                    console.error(err);
                });

        } else if (action === DEV_USER_ACTION_SHOW_DB){

            this.setState({ devShowDBDialog: true });

        } else if (action === DEV_USER_ACTION_HIDE_DB){

            this.setState({ devShowDBDialog: false });

        } else if(action === USER_ACTION_OPEN_ABOUT){

            this.setState({ showAboutDialog: true });

        } else if(action === USER_ACTION_CLOSE_ABOUT){

            this.setState({ showAboutDialog: false });

        } else if(action === USER_ACTION_OPEN_ABOUT_ENCRYPTION_INFO){

            this.setState({ showAboutEncryptionInfoDialog: true });

        } else if(action === USER_ACTION_CLOSE_ABOUT_ENCRYPTION_INFO){

            this.setState({ showAboutEncryptionInfoDialog: false });

        } else if(action === USER_ACTION_OPEN_HOWTO){

            this.setState({ showHowToDialog: true });

        } else if(action === USER_ACTION_CLOSE_HOWTO){

            this.setState({ showHowToDialog: false });

        }
        //
        // IMPORT,EXPORT
        //
        else if (action === USER_ACTION_IMPORT_PASSWORDS){

            //
            this._letUserSelectBackupFile();

        } else if (action === USER_ACTION_CANCEL_IMPORT_PASSWORDS){

            //
            this.setState({
                backupImportBadPasswordCounter: 0,
                showBackupFileInfoDialog: false,
                backupFileInfo: null
            });

        } else if (action === USER_ACTION_EXECUTE_IMPORT_PASSWORDS){

            //
            this._executeBackupFileImport(value);

        } else if (action === USER_ACTION_EXPORT_PASSWORDS){

            //
            this._letUserSelectExportFile();

        }
        //
        // SETTINGS
        //
        else if (action === USER_ACTION_OPEN_SETTINGS){

            //
            this._handleOpenSettings();

        } else if (action === USER_ACTION_CANCEL_SETTINGS){

            //
            this._handleCancelSettings();

        } else if (action === USER_ACTION_SAVE_SETTINGS){

            //
            this._handleSaveSettings(value);

        }

        //
        // PROFILE, LOGIN, CREATE
        //
        else if(action === USER_ACTION_OPEN_LOGIN_VIEW){
//
            this.setState({ viewState: VIEW_STATE_LOGIN_REQUIRED });

        }  else if(action === USER_ACTION_DO_LOGIN){

            this._handleLogin(value);

        }
        else if (action === USER_ACTION_OPEN_NEW_PROFILE_VIEW){

            //
            this._handleOpenCreateProfileView();

        } else if(action === USER_ACTION_SAVE_NEW_PROFILE){

            this._handleCreateProfile(value);

        } else if(action === USER_ACTION_DO_LOGOUT){

            this._handleLogout();

        } else if(action === USER_ACTION_DO_EXIT){

            this._handleExit();

        } else if(action === USER_ACTION_REMOVE_PROFILE_CONFIRM){

            this._handleConfirmRemoveProfile();

        } else if(action === USER_ACTION_REMOVE_PROFILE_CANCEL){

            this._handleCancelRemoveProfile();

        } else if(action === USER_ACTION_REMOVE_PROFILE_EXECUTE){

            this._handleExecuteRemoveProfile();

        }

        // OTHER

        else if(action === USER_ACTION_SHOW_TOAST){

            this._showToast(value.message, value.isError);

        } else if(action === USER_ACTION_RESET_SESSION_TIMER){

            // NOP

        }  else {
            this.log("ERROR: unknown action: " + action);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this._setSessionTimeOut();

        // const menuTemplate  = this.getMacMenuTemplate();
        // const menu          = require('electron').Menu.buildFromTemplate(menuTemplate);
        //
        // require('electron').Menu.setApplicationMenu(menu);
    }

    render() {
        this.log('render', this.state.viewState);

        const viewState = this.state.viewState;

        if (viewState === VIEW_STATE_LOADING_ALL) {

            return (
                <div>
                    <UICloseOnlyTitleBar onUserAction={ this.onUserAction }/>
                    <UILoadingView/>
                    <UIToast ref={this.toast}/>
                </div>
            );

        } else if (viewState === VIEW_STATE_CLEANING_DATA) {

            return (
                <div>
                    <UICloseOnlyTitleBar onUserAction={ this.onUserAction }/>
                    <UILoadingView label={I18n.session_CleaningData()}/>
                    <UIToast ref={this.toast}/>
                </div>
            );

        } else if (viewState === VIEW_STATE_EXPORTING_DATA) {

            return (
                <div>
                    <UICloseOnlyTitleBar onUserAction={ this.onUserAction }/>
                    <UILoadingView label={I18n.export_ExportingData()}/>
                    <UIToast ref={this.toast}/>
                </div>
            );

        } else if (viewState === VIEW_STATE_LOADING_ALL_ERROR) {

            return (
                <div>
                    <UICloseOnlyTitleBar onUserAction={ this.onUserAction }/>
                    LOADING_ALL_ERROR
                    <UIToast ref={this.toast}/>
                </div>
            );

        } else if (viewState === VIEW_STATE_CREATE_PROFILE) {

            return (
                <div>
                    <UICloseOnlyTitleBar onUserAction={ this.onUserAction }/>
                    <UICreateProfileView onUserAction={ this.onUserAction } profiles={this.state.profileList}/>
                    <UIToast ref={this.toast}/>
                </div>
            );

        } else if (viewState === VIEW_STATE_LOGIN_REQUIRED) {

            return (
                <div>
                    <UICloseOnlyTitleBar onUserAction={ this.onUserAction }/>
                    <UILoginView onUserAction={ this.onUserAction } profiles={this.state.profileList}/>
                    <UIToast ref={this.toast}/>
                </div>
            );
        } else if (viewState === VIEW_STATE_CONFIRM_REMOVE_PROFILE) {

            return (
                <div>
                    <UICloseOnlyTitleBar onUserAction={ this.onUserAction }/>
                    <UIRemoveProfileView onUserAction={ this.onUserAction } profile={this.state.profile}/>
                    <UIToast ref={this.toast}/>
                </div>
            );
        }

        // this.log("render");
        // this.log(this.state.profile);

        //
        // Keine Kategorie vorhanden
        //
        const currentCategoryId   = this.state.profile.categoryId;
        const hasCategories     = this.state.categories && this.state.categories.length > 0;
        const canChangeCategory = hasCategories && currentCategoryId != null;

        let currentCategoryName = '';
        if(hasCategories && currentCategoryId){
            let currentCategory = this._getCategoryById(currentCategoryId);
            if(currentCategory){
                currentCategoryName = currentCategory.name;
            }
        }

        let availableCatNames = null;
        if(this.state.showCategorySetupDialog){
            availableCatNames = this.state.categoryToChange ? this._getAvailableCategoryNames(this.state.categoryToChange.id) : this._getAvailableCategoryNames();
        }

        let availablePwNames  = null;
        if(this.state.showPasswordSetupDialog){
            availablePwNames  = this.state.passwordToChange ? this._getAvailablePasswordNames(this.state.passwordToChange.id) : this._getAvailablePasswordNames();
        }

        let catQuestionDate = null;
        if(this.state.showCategoryConfirmRemoveDialog){
            catQuestionDate = {
                title: I18n.basic_RemoveCategory_Title(),
                question: I18n.basic_RemoveCategory_ConfirmQuestion()
            };
        }

        let passwQuestionData = null;
        if(this.state.showPasswordConfirmRemoveDialog){
            passwQuestionData = {
                title: I18n.basic_RemovePassword_Title(),
                question: I18n.basic_RemovePassword_ConfirmQuestion()
            };
        }

        const showCategoryList = this.state.showCategoryList;

        return (
            <div>

                <UITitleBar
                    canExport={hasCategories}
                    canChangeCategory={canChangeCategory}
                    canCreatePassword={hasCategories}
                    onUserAction={ this.onUserAction }/>

                {hasCategories
                    ?
                    <div>

                        <UIToolBar
                            hasPasswords={this.state.passwords && this.state.passwords.length > 2}
                            categoryList={this.state.categories}
                            showCategoryList={showCategoryList}
                            currentCategoryId={currentCategoryId}
                            onUserAction={this.onUserAction}/>

                        <UIPasswordList
                            loadingState={viewState}
                            filter={this.state.passwordFilter}
                            passwords={this.state.passwords}
                            profile={this.state.profile}
                            onUserAction={this.onUserAction}/>

                        {showCategoryList && <UIBlackOverlay onUserAction={this.onUserAction}/>}

                     </div>
                    :
                    <UINoCategoriesView onAction={ this.onUserAction }/>
                }

                {this.state.showCategoryConfirmRemoveDialog
                    ? <UIQuestionDialog
                        title={catQuestionDate.title}
                        question={catQuestionDate.question}
                        okEvent={{action: USER_ACTION_EXECUTE_REMOVE_CATEGORY, value: currentCategoryId}}
                        cancelEvent={{action: USER_ACTION_CANCEL_REMOVE_CATEGORY, value: currentCategoryId}}
                        onUserAction={this.onUserAction}/>
                    : null
                }

                {this.state.showPasswordConfirmRemoveDialog
                    && <UIQuestionDialog
                        title={passwQuestionData.title}
                        question={passwQuestionData.question}
                        okEvent={{action: USER_ACTION_EXECUTE_REMOVE_PASSWORD, value: this.state.passwordToChange}}
                        cancelEvent={{action: USER_ACTION_CANCEL_REMOVE_PASSWORD, value: this.state.passwordToChange}}
                        onUserAction={this.onUserAction} />
                }

                {this.state.showCategorySetupDialog
                    && <UICategoryDialog categoryName={this.state.categoryToChange ? this.state.categoryToChange.name : ''}
                        availableNames={availableCatNames}
                        onUserAction={this.onUserAction}/>
                }
                {this.state.showPasswordMoveDialog
                    && <UICategoryListDialog
                        categoryList={this.state.categories}
                        password={this.state.passwordToChange}
                        onUserAction={this.onUserAction}/>
                }

                {this.state.showPasswordScoreDialog
                && <UIPasswordScoreDialog
                    password={this.state.passwordToChange}
                    onUserAction={this.onUserAction}/>
                }

                {this.state.showPasswordGeneratorDialog && <UIPasswordGeneratorDialog passwordGeneratorCfg={this.state.profile.passwordGeneratorConfiguration} onUserAction={this.onUserAction}/> }

                {this.state.showPasswordSetupDialog
                    && <UIPasswordDialog
                        currentCategoryName={currentCategoryName}
                        passwordToChange={this.state.passwordToChange}
                        passwordGeneratorCfg={this.state.profile.passwordGeneratorConfiguration}
                        availableNames={availablePwNames}
                        onUserAction={this.onUserAction}/>
                }

                {this.state.showBackupFileInfoDialog
                    && <UIImportFileInfoDialog
                        ref={this.importDialog}
                        backupFileInfo={this.state.backupFileInfo}
                        onUserAction={this.onUserAction}/>
                }

                {this.state.showAboutDialog && <UIAboutDialog onUserAction={this.onUserAction}/> }
                {this.state.showAboutEncryptionInfoDialog && <UIEncryptionInfoDialog onUserAction={this.onUserAction}/> }
                {this.state.showHowToDialog && <UIHowToDialog onUserAction={this.onUserAction}/> }

                {this.state.devShowDBDialog && <UIDEVDbViewDialog onUserAction={this.onUserAction}/> }
                {this.state.showSettingsDialog && <UISettingsDialog onUserAction={this.onUserAction} profileList={this.state.profileList} profile={this.state.profile}/> }

                <UIStatusBar
                    viewState={this.state.viewState}
                    profile={this.state.profile}
                    passwordsCurrent={this.state.passwords && this.state.passwords.length}
                    passwordsAll={this.state.passwordsAllCount}/>

                <UIToast ref={this.toast}/>
            </div>
        );
    }

    //
    // - private
    //

    _reloadViewState(){
        const self = this;

        // self.setState({viewState: VIEW_STATE_LOADING_ALL});

        this.dataLoader.initDBs()
            .then(profiles => {
                // this.log('Loaded Profiles', profiles);

                if(arrayIsEmpty(profiles)){

                    self.setState({
                        viewState: VIEW_STATE_CREATE_PROFILE,
                        profileList: []
                    });

                } else {

                    self.setState({
                        viewState: VIEW_STATE_LOGIN_REQUIRED,
                        profileList: profiles
                    });

                }

            })
            .catch(err => {
                console.error("Error: " + err);
                self.setState({ viewState: VIEW_STATE_LOADING_ALL_ERROR });
            });
    }

    _reloadAllViews(){
        // this.log('_reloadAllViews');

        const self      = this;
        const profile   = this.state.profile;

        if(!profile){
            this._reloadViewState();
            return;
        }

        // self.setState({viewState: VIEW_STATE_LOADING_ALL});

        this.dataLoader.loadAllDataAsync(profile.id)
            .then(function (data) {

                // this.log(data);

                self.setState({
                    categories: data.categories,
                    passwords: data.passwords,
                    passwordsAllCount: data.passwordsAllCount,
                    viewState: VIEW_STATE_READY,
                    profile: data.profile
                });

                self._setSessionTimeOut();

            })
            .catch(function (err) {
                    console.error("Error", err);
                    self.setState({
                        viewState: VIEW_STATE_LOADING_ALL_ERROR
                    });
                }
            );

    }

    //
    // Session / Profile
    //

    _handleExit() {

        this.setState(App.defaultState(VIEW_STATE_CLEANING_DATA, []));
        this._clearSessionTimeout();
        this._clearClipboard();
        this.dataLoader.cleanForExit();

        setTimeout(function () {

            require('electron').remote.app.quit();

        }, 500);

    }

    _handleLogout(isSessionTimedOut) {

        this._clearSessionTimeout();

        const self = this;

        this.setState({viewState: VIEW_STATE_CLEANING_DATA});
        this._clearClipboard();

        this.dataLoader.logout(self.state.profile)
            .then(profiles => {

                if(isSessionTimedOut){
                    self._showToast(I18n.session_Expired(), true);
                }

                setTimeout(function () {
                    self.setState(App.defaultState(VIEW_STATE_LOGIN_REQUIRED, profiles));
                }, 500);

            })
            .catch(self._handleError);
    }

    _handleLogin(loginData){
        // this.log('_handleLogin: ' + JSON.stringify(loginData));

        const self = this;

        self.setState({viewState: VIEW_STATE_LOADING_ALL});

        this.dataLoader.login(loginData.profileId, loginData.password)
            .then(profile => {

                // this.log("login success!");

                self.setState({
                    badLoginCounter : 0,
                    profile: profile
                });

                setTimeout(() => {
                    self._reloadAllViews();
                }, 300);

            })
            .catch(err => {

                const badLogin = self.state.badLoginCounter + 1;

                setTimeout(() => {

                    self.setState({
                        badLoginCounter : badLogin,
                        viewState: VIEW_STATE_LOGIN_REQUIRED,
                        profile: null
                    });

                    if(err instanceof CryptError){
                        console.error(err);
                        self._showToast(I18n.login_Error_BadPassword(), true);
                    } else {
                        self._handleError(err);
                    }

                }, 650 * badLogin);

            });

    }

    _handleCreateProfile(profileData){
        this.log('_handleCreateProfile', logSafeObject(profileData));

        const self = this;

        self.setState({viewState: VIEW_STATE_LOADING_ALL});

        this.dataLoader.createProfile(profileData)
            .then(result => {

                self.setState({
                    profile: result.profile,
                    profileList : result.allProfiles
                });

                self._reloadAllViews();
            })
            .catch(err => {
                console.log(err);
                self.setState({ viewState: VIEW_STATE_LOADING_ALL_ERROR });
            });

    }

    _clearSessionTimeout(){
        if(this.sessionTimeOutId){
            clearTimeout(this.sessionTimeOutId);
            this.sessionTimeOutId = null;
            // this.log('_clearSessionTimeout: OK');
        } else {
            // this.log('_clearSessionTimeout: NOT SET');
        }
    }

    _setSessionTimeOut(){

        this._clearSessionTimeout();

        const self = this;

        if(this.state.profile && this.state.viewState === VIEW_STATE_READY){

            const sessionTimeout = this.state.profile.sessionConfiguration.sessionTimeout;
            if(sessionTimeout > 0){

                const ignore = this.state.showBackupFileInfoDialog;

                // einige Aktionen wie bsp. Import oder Neues Password
                // koennen zu lange dauern, deswegen kein Timeout an dieser Stelle
                if(ignore){
                    // this.log('_setSessionTimeOut: IGNORE');
                    return;
                }

                this.sessionTimeOutId = setTimeout(() =>{
                    self._handleLogout(true);
                }, sessionTimeout);

                // this.log('_setSessionTimeOut: SET to ' + sessionTimeout);
            } else {
                // this.log('_setSessionTimeOut: ABORT. DEACTIVATED');
            }

        } else {
            // this.log('_setSessionTimeOut: ABORT. NO PROFILE or INVALID VIEWSTATE');
        }

    }

    _handleOpenCreateProfileView() {

        this._clearSessionTimeout();
        this._clearClipboard();

        if(this.state.profile){

            const self = this;

            self.setState({viewState: VIEW_STATE_CLEANING_DATA});

            this.dataLoader.logout(self.state.profile)
                .then(profiles => {

                    this.setState(App.defaultState(VIEW_STATE_CLEANING_DATA, []));

                    setTimeout(function () {

                        self.setState({
                            viewState: VIEW_STATE_CREATE_PROFILE,
                            profileList : profiles
                        });

                    }, 500);

                })
                .catch(self._handleError);
        } else {

            this.setState({viewState: VIEW_STATE_CREATE_PROFILE});
        }

    }

    _handleConfirmRemoveProfile(){


        const Menu = require('electron').remote.Menu;
        Menu.setApplicationMenu(Menu.buildFromTemplate([]));
        // const Menu = require('electron').remote.Menu;
        // Menu.setApplicationMenu(null);

        this.setState({
            viewState: VIEW_STATE_CONFIRM_REMOVE_PROFILE,
            showSettingsDialog : false
        });
    }

    _handleCancelRemoveProfile(){
        this._reloadAllViews();
    }

    _handleExecuteRemoveProfile(){

        this.setState({viewState: VIEW_STATE_CLEANING_DATA});

        const self = this;
        this._clearSessionTimeout();
        this._clearClipboard();

        this.dataLoader.removeProfile(this.state.profile)
            .then(() => {

                self.setState(App.defaultState(VIEW_STATE_CLEANING_DATA, []));

                setTimeout(() => {
                    self._reloadViewState();
                }, 500);

            })
            .catch(self._handleError);
    }

    //
    // Category
    //

    _handleCloseCategoryList() {
        this.setState({showCategoryList: false});
    }

    _handleOpenCategoryList() {
        this.setState({showCategoryList: true});
    }

    _handleOpenNewCategoryDialog(){
        this.setState({
            showCategoryList: false,
            showCategorySetupDialog: true,
            categoryToChange: null
        });
    }

    _handleOpenEditCategoryDialog(){
        const categoryToChange = this._getCurrentSelectedCategory();
        this.setState({
            showCategorySetupDialog: categoryToChange !== null,
            categoryToChange: categoryToChange
        });
    }

    _handleUpdateCategory(formData){

        if(!this.state.categoryToChange){
            return;
        }

        const self = this;
        const allCategories    = this.state.categories;
        const categoryToChange = this.state.categoryToChange;

        this.log("change " + categoryToChange.name + " -> " + formData.name);

        self.dataLoader.updateCategory(categoryToChange, formData)
            .then(category => {

                if(category && notEmpty(allCategories)){

                    for (let i = 0; i < allCategories.length; i++){
                        if(allCategories[i].id === category.id){
                            allCategories[i] = category;
                            break;
                        }
                    }

                    self.setState({
                        categories: allCategories,
                        showCategorySetupDialog: false,
                        categoryToChange: null
                    });

                    self._showToast(I18n.category_Name_Changed());
                } else {
                    self._showToast(I18n.category_Error_Name_NotChanged(), true);
                }

            })
            .catch(self._handleError);

    }

    _handleCreateCategory(formData){

        const self = this;
        const profile = self.state.profile;

        this.dataLoader.createCategory(profile.id, formData)
            .then(function (newCategory) {

                self.state.categories.push(newCategory);
                self.state.profile.categoryId = newCategory.id;

                self.setState({
                    showCategorySetupDialog: false,
                    categoryToChange: null
                });

                // zu der neuen Kategorie wechseln
                self._handleCategorySelection(newCategory.id);

                self._showToast(I18n.category_Created());
            })
            .catch(self._handleError);
    }

    _handleCancelCategoryDialog(){
        this.setState({
            showCategorySetupDialog: false,
            categoryToChange: null
        });
    }

    _handleRemoveCategoryRequest(){
        const categoryToChange = this._getCurrentSelectedCategory();
        const passwords = this.state.passwords;

        if(notEmpty(passwords)){
            this.setState( {
                showCategoryConfirmRemoveDialog: categoryToChange !== null,
                categoryToChange: categoryToChange
            });
        } else {

            // Keine Passwoerter? Dann entferne ohne Fragen.
            this._handleRemoveCategory(categoryToChange.id);
        }
    }

    _handleCancelRemoveCategoryDialog(){
        this.setState( {
            showCategoryConfirmRemoveDialog: false,
            categoryToChange: null
        });
    }

    _handleRemoveCategory(categoryId){
        this.log('_handleRemoveCategory: ' + categoryId);

        const self      = this;
        const profileId = this.state.profile.id;

        this.dataLoader.removeCategory(profileId, categoryId)
            .then(() => {

                self._showToast(I18n.category_Removed());

                self.setState( { showCategoryConfirmRemoveDialog: false, categoryToChange: null });

                self._reloadAllViews();

            })
            .catch(self._handleError);
    }

    _handleCategorySelection(categoryId) {

        const self      = this;
        const profileId = this.state.profile.id;

        this.setState({
            viewState: VIEW_STATE_LOADING_PASSWORDS,
            showCategoryList: false
        });

        this.state.profile.categoryId = categoryId;

        this.dataLoader.updateProfile(this.state.profile)
            .then(() => {

                self._loadPasswordsForCategory(profileId, categoryId);

            })
            .catch(self._handleError);

    };

    _getCurrentSelectedCategory(){

        const allCategories     = this.state.categories;
        const selectedCategory  = this.state.profile.categoryId;

        if(allCategories){
            for (let i = 0; i < allCategories.length; i++){
                let category = allCategories[i];
                if(category.id === selectedCategory){
                    return category;
                }
            }
        }

        return null;
    }

    _getAvailableCategoryNames(exceptId){
        const allCategories = this.state.categories;
        let names = [];
        if(notEmpty(allCategories)){
            for (let i = 0; i < allCategories.length; i++){
                const name = allCategories[i].name.toLocaleLowerCase();
                if(exceptId){
                    if(allCategories[i].id !== exceptId){
                        names.push(name);
                    }
                } else {
                    names.push(name);
                }
            }
        }
        return names;
    }

    //
    // Password
    //

    _loadPasswordsForCategory(profileId, categoryId) {
        // this.log("_loadPasswordsForCategory start");

        this.setState({viewState: VIEW_STATE_LOADING_PASSWORDS });

        const self = this;

        this.dataLoader.loadPasswords(profileId, categoryId)
            .then(passwords => {

                if((!passwords || passwords.length === 0) && self.state.showPasswordSetupDialogAfterCategoryCreated){
                    self.setState({
                        viewState: VIEW_STATE_READY,
                        showPasswordSetupDialog : true,
                        showPasswordSetupDialogAfterCategoryCreated : false,
                        passwords: passwords
                    });
                } else {
                    self.setState({
                        viewState: VIEW_STATE_READY,
                        passwords: passwords
                    });
                }
            })
            .catch( self._handleError);
    }

    _handleOpenPasswordEditDialog(passwordId){

        const self = this;
        this.dataLoader.loadDecryptedPassword(passwordId)
            .then(password => {
                this.setState({showPasswordSetupDialog: true, passwordToChange: password});
            })
            .catch(self._handleError);
    }

    _handleOpenPasswordScoreDialog(passwordId){

        const self = this;
        this.dataLoader.loadDecryptedPassword(passwordId)
            .then(password => {
                this.setState({showPasswordScoreDialog: true, passwordToChange: password.password});
            })
            .catch(self._handleError);
    }

    _handleOpenPasswordGeneratorDialog(){
        this.setState({
            showPasswordGeneratorDialog: true,
            showPasswordSetupDialogAfterCategoryCreated : false
        });
    }

    _handleUpdatePassword(formData){

        const self      = this;
        const passwords = this.state.passwords;
        const pw        = this.state.passwordToChange;

        this.dataLoader.updatePassword(pw.id, formData)
            .then((changedPassword) => {

                for(let i = 0; i < passwords.length; i++){
                    if(passwords[i].id === changedPassword.id){
                        passwords[i] = changedPassword;
                        break;
                    }
                }

                self.setState({
                   passwords: passwords
                });

                //
                self._showToast(I18n.setupPwDialog_Changed());
            })
            .catch(self._handleError)
            .finally(() => {
                //
                self.setState({ showPasswordSetupDialog: false, passwordToChange: null });
            });
    }

    _handleOpenCreatePasswordDialog(){
        // this.log('_handleOpenCreatePasswordDialog: ', this.state.categories);
        if(this.state.categories && this.state.categories.length){
            this.setState({ showPasswordSetupDialog: true});
        } else {

            this.setState({
                showCategoryList: false,
                showCategorySetupDialog: true,
                showPasswordSetupDialogAfterCategoryCreated: true,
                categoryToChange: null
            });
        }

    }

    _handleCreatePassword(formData){

        const self       = this;
        const passwords  = this.state.passwords;
        const profileId  = this.state.profile.id;
        const categoryId = this.state.profile.categoryId;

        this.dataLoader.createPassword(profileId, categoryId, formData)
            .then(savedPassword => {

                //
                passwords.push(savedPassword);

                //
                this.toast.current.showToastInfo(I18n.setupPwDialog_Created());
            })
            .catch(self._handleError)
            .finally(() => {
                //
                this.setState({
                    passwordsAllCount: passwords.length,
                    showPasswordSetupDialog: false,
                    passwordToChange: null
                });
            });
    }

    _handleRemovePassword(passwordId){
        this.log('_handleRemovePassword: ' + passwordId);

        const self = this;

        this.dataLoader.removePassword(passwordId)
            .then(() => {

                self._showToast(I18n.setupPwDialog_Removed());

                self._reloadAllViews();

            })
            .catch(self._handleError)
            .finally(() => {
                self.setState( { showPasswordConfirmRemoveDialog: false, passwordToChange: null });
            });
    }

    _handleCancelRemovePassword() {
        this.setState({showPasswordConfirmRemoveDialog: false, passwordToChange: null});
    }

    _handleRemovePasswordRequest(value) {
        const passwordToChange = this._getPasswordById(value);
        this.setState({
            showPasswordConfirmRemoveDialog: passwordToChange != null,
            passwordToChange: passwordToChange
        });
    }

    _handleMovePasswordToOtherCategoryRequest(value) {
        const passwordToChange = this._getPasswordById(value);
        this.setState({
            showPasswordMoveDialog: passwordToChange != null,
            passwordToChange: passwordToChange
        });
    }

    _handleCancelMovePasswordToOtherCategoryRequest() {
        this.setState({
            showPasswordMoveDialog: false,
            passwordToChange: null
        });
    }

    _handleExecuteMovePasswordToOtherCategory(value) {

        const passwordToChange = this._getPasswordById(value.passwordId);

        if(passwordToChange){

            this.setState({
                viewState: VIEW_STATE_LOADING_PASSWORDS,
                showPasswordMoveDialog: false,
                passwordToChange: null
            });

            const self = this;

            // const passwords = this.state.passwords;

            this.dataLoader.updatePassword(passwordToChange.id, {category: value.categoryId})
                .then((changedPassword) => {

                    //
                    self._showToast(I18n.movePasswordToast_Success());

                    self._reloadAllViews();

                })
                .catch(self._handleError)
                .finally(() => {
                    //
                    this.setState({ showPasswordMoveDialog: false, passwordToChange: null });
                });
        }

    }

    _handleCancelPasswordInputDialog() {
        this.setState({showPasswordSetupDialog: false, passwordToChange: null});
    }

    _handleCancelPasswordScoreDialog(){
        this.setState({showPasswordScoreDialog: false, passwordToChange: null});
    }

    _handleCancelPasswordGeneratorDialog(){
        this.setState({showPasswordGeneratorDialog: false});
    }

    _getCategoryById(categoryId){

        const list = this.state.categories;
        if(list) {
            for(let i = 0; i < list.length; i++){
                if(list[i].id === categoryId){
                    return list[i];
                }
            }
        }

        return null;
    }

    _getPasswordById(passwordId){

        const passwords = this.state.passwords;
        for(let i = 0; i < passwords.length; i++){
            if(passwords[i].id === passwordId){
                return passwords[i];
            }
        }

        return null;
    }

    _getAvailablePasswordNames(exceptId){
        const passwords     = this.state.passwords;
        let names = [];
        if(notEmpty(passwords)){
            for (let i = 0; i < passwords.length; i++){
                const name = passwords[i].name.toLocaleLowerCase();
                if(exceptId){
                    if(passwords[i].id !== exceptId){
                        names.push(name);
                    }
                } else {
                    names.push(name);
                }
            }
        }
        return names;
    }

    _handleCopyUserName(passwordId){

        const self = this;
        this.dataLoader.loadDecryptedPassword(passwordId)
            .then((pw => {
                if(pw){
                    const seconds = 15;
                    this._copyToClipBoard(pw.userName, seconds);
                    self._showToast(I18n.basic_UserNameCopied(seconds));
                }
            }))
            .catch(this._handleError);
    }

    _handleCopyPassword(passwordId){

        const self = this;
        this.dataLoader.loadDecryptedPassword(passwordId)
            .then((pw) => {
                if(pw){
                    const seconds = 15;
                    self._copyToClipBoard(pw.password, seconds);
                    self._showToast(I18n.basic_PasswordCopied(seconds));
                }
            })
            .catch(this._handleError);
    }

    _copyToClipBoard(text, clearTimeoutInSecs){

        if(this.clipboardTimeOutId){
            clearTimeout(this.clipboardTimeOutId);
        }

        clipboard.writeText(text);

        // merke den kopierten String um nicht was
        // Falsches aus dem Clipboard zu entfernen
        this.clipboardCopiedHash = Crypt.base64_sha1(text);

        const self = this;
        this.clipboardTimeOutId = setTimeout(() => {
            self._clearClipboard();
        }, 1000 * clearTimeoutInSecs);

    }

    _clearClipboard(){
        const text = clipboard.readText();
        if(text){
            const hash = Crypt.base64_sha1(text);
            if(this.clipboardCopiedHash === hash){
                this.log('cleared');
                clipboard.clear();
                clipboard.writeText('-');
            }
        }
    }

    //
    // import
    //

    _letUserSelectBackupFile(){

        const self = this;
        const {dialog} = require('electron').remote;

        dialog.showOpenDialog({
            filters: [
                { name: I18n.backupImport_FileFilterName(), extensions: ['txt', 'ks', 'keysafe'] }
            ],
            properties: ['openFile']
        }, (files) =>{

            if(files && files.length === 1){

                const backupFile = files[0];

                // this.log(backupFile);

                self.dataLoader.loadImportFileInfo(backupFile)
                    .then((backupFileInfo) => {
                        self.setState({
                            showBackupFileInfoDialog: true,
                            backupFileInfo: backupFileInfo
                        })
                    })
                    .catch(err => {
                        this.log(err);
                        self._showToast(I18n.backupImport_Error_ReadingFile(backupFile), true);
                    });
            } else {
                this.log('No backup selected');
            }
        });

    }

    /**
     * @param {BackupImportConfiguration} backupFileInfo
     */
    _executeBackupFileImport(backupFileInfo){

        const self = this;

        const profileId  = this.state.profile.id;
        self.importDialog.current.setProgressState(1);

        this.dataLoader.importPasswords(profileId, backupFileInfo)
            .then((count) => {

                // aktualisiere die Hauptview
                self._reloadAllViews();

                // zeige im ImportDialog dass wir fertig sind
                self.importDialog.current.setProgressState(2);

                // warte kurz und schliesse dann das Dialog
                setTimeout(() => {

                    self.setState({
                        backupImportBadPasswordCounter: 0,
                        showBackupFileInfoDialog: false,
                        backupFileInfo: null
                    });

                    if(count === 0){
                        self._showToast(I18n.backupImport_Info_NoNewPasswordsImported());
                    } else {
                        self._showToast(I18n.backupImport_Info_Done(count));
                    }

                }, 750);

            })
            .catch(err => {

                const badLoginCounter = self.state.backupImportBadPasswordCounter + 1;

                setTimeout(() => {

                    self.state.backupImportBadPasswordCounter = badLoginCounter;

                    self.importDialog.current.setProgressState(-1);

                    self._handleError(err);

                }, 500 * badLoginCounter);
            });

    }

    //
    // export
    //

    _letUserSelectExportFile(){

        const self     = this;
        const {dialog} = require('electron').remote;
        const profile  = this.state.profile;

        const options = {
            title: I18n.export_SelectFileNameTitle(),
            defaultPath: '~/' + I18n.export_DefaultFileName(),
            properties: ["openFile"]
        };

        dialog.showSaveDialog(options,(fileName) => {

            if (!fileName){
                return;
            }

            self.setState({viewState: VIEW_STATE_EXPORTING_DATA});

            self.dataLoader.exportPasswords(profile.id, fileName)
            .then(() => {

                setTimeout(() => {
                    self.setState({viewState: VIEW_STATE_READY});
                    self._showToast(I18n.export_SuccessfullyExported(fileName));
                }, 500);

            })
            .catch( err => {
                console.error(err);
                self._showToast(I18n.export_Error(err), true);
            });
        });
    }


    //
    // Profile
    //

    _handleOpenSettings(){

        this.setState({
            showSettingsDialog : true
        });

    }

    _handleCancelSettings(){

        this.setState({
            showSettingsDialog : false
        });

    }

    _handleSaveSettings(change){
        this.log('_handleSaveSettings', change);

        const self    = this;
        const profile = this.state.profile;

        profile.apply(change);

        this.dataLoader.updateProfile(profile)
            .then(() => {

                if(change.hasOwnProperty(Profile.KEY_NAME_VIEW_CFG)){
                    self._reloadAllViews();
                } else if (change.hasOwnProperty(Profile.KEY_NAME_SESSION_CFG)){
                    self._setSessionTimeOut();
                }

            }).catch(self._handleError);
    }

    //

    _showToast(text, isError){
        // this.log(isError);
        this.toast.current.showToastInfo(text, isError);
    }

    _handleError(err){
        // TODO: ViewState ändern
        // TODO: Button zum ändern des States zu READY oder sowas...

        console.error(err);

        if(!this.toast){
            return;
        }

        this.toast.current.showToastInfo(I18n.basic_UnknownError(err), true);
    }


    log(msg, ...params){

        if(!CFG_LOG_APP){
            return;
        }

        if(params){
            console.log(msg, params);
        } else {
            console.log(msg);
        }
    }
}

export default App;
