import React from 'react';
import './UIRemoveProfileView.css';
import {USER_ACTION_REMOVE_PROFILE_CANCEL, USER_ACTION_REMOVE_PROFILE_EXECUTE, USER_ACTION_SHOW_TOAST} from "../../Basic/consts";
import UIClear from "../Basic/UIClear";
import I18n from "../../Basic/I18n/i18n";
import Crypt from "../../DataBase/Security/Crypt";

class UIRemoveProfileView extends React.Component {

    constructor(props) {
        super(props);
        this.handleChange   = this.handleChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.onRemoveProfileClick = this.onRemoveProfileClick.bind(this);
        this.onCancelRemoveProfileClick = this.onCancelRemoveProfileClick.bind(this);
        this.state = {
            password : '',
            badPasswordCounter : 0
        };
    }

    onCancelRemoveProfileClick(){
        this.props.onUserAction(USER_ACTION_REMOVE_PROFILE_CANCEL);
    }

    onRemoveProfileClick(){
        if(this.state.password){

            try {

                const cipher = new Crypt(this.state.password);
                const checkStr = this.props.profile.cryptCheck;

                cipher.decrypt(checkStr);

                this.state.password = '';

                this.props.onUserAction(USER_ACTION_REMOVE_PROFILE_EXECUTE);

            } catch (e) {
                this.props.onUserAction(USER_ACTION_SHOW_TOAST, {
                    message : I18n.login_Error_BadPassword(),
                    isError : true
                });

                const badLoginCount = this.state.badPasswordCounter + 1;

                this.setState({
                    badPasswordCounter: badLoginCount,
                    password : ''
                });

                if(badLoginCount > 2){
                    this.onCancelRemoveProfileClick();
                }

            }

        }
    }

    handleKeyPress(e){
        if (e.key === 'Enter') {
            this.onRemoveProfileClick();
        }
    }

    componentDidMount() {
        const input1 = document.querySelector('#master-password');
        if (!input1.MaterialSnackbar) {
            componentHandler.upgradeElement(input1);
        }
    }

    handleChange(e) {

        const password  = e.target.value;
        this.setState({password: password});
    }

    render() {

        const textPlaceholder1 = I18n.removeProfile_MasterPassword();
        const applyBtn  = I18n.removeProfile_ConfirmButton();
        const cancelBtn = I18n.removeProfile_CancelButton();

        const profileName = this.props.profile.name;
        let msg = I18n.removeProfile_WarningMsg(profileName);

        return (
            <div className="keysafe-Outer-Container keysafe-RemoveProfile-Outer-Container">
                <div className="keysafe-Middle-Container">
                    <div className="keysafe-Inner-Container keysafe-RemoveProfile-Container">

                        { /* Warnung */ }
                        <div id={"remove-profile-warning"} dangerouslySetInnerHTML={{__html : msg}}/>

                        { /*password 1*/}
                        <div id="master-password" className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                            <input value={this.state.password} onChange={this.handleChange} onKeyPress={this.handleKeyPress} type="password" className="mdl-textfield__input" id="inp-1" autoFocus/>
                            <label className="mdl-textfield__label" htmlFor="inp-1">{textPlaceholder1}</label>
                        </div>

                        <br/>

                        <button className="BasicButton RemoveProfile" onClick={this.onRemoveProfileClick} disabled={!this.state.password}>{applyBtn}</button>
                        <button className="BasicButton CancelRemoveProfile" onClick={this.onCancelRemoveProfileClick}>{cancelBtn}</button>
                        <UIClear/>
                    </div>
                </div>
            </div>
        );
    }
}

export default UIRemoveProfileView;
