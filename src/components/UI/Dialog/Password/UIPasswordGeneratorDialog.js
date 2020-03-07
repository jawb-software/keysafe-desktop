import React from 'react';

import '../UIBaseDialog.css';
import './UIPasswordGeneratorDialog.css';

const { clipboard } = require('electron');

import {
    USER_ACTION_CANCEL_PASSWORD_GENERATOR_DIALOG, USER_ACTION_RESET_SESSION_TIMER,
} from "../../../Basic/consts";

import UIPasswordScoreView from "./UIPasswordScoreView";
import UIPasswordGeneratorView from "./UIPasswordGeneratorView";
import {generatePassword} from "../../../Basic/PasswordGenerator/pwgen";
import {calculateScore} from "../../../Basic/PasswordGenerator/pwanalyse";
import I18n from "../../../Basic/I18n/i18n";
import UIDialogTitleWithClose from "../UIDialogTitleWithClose";

class UIPasswordGeneratorDialog extends React.Component {

    constructor(props) {
        super(props);
        this.handleCancelClick = this.handleCancelClick.bind(this);
        this.handleOptionsChange = this.handleOptionsChange.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.resetSessionTimer = this.resetSessionTimer.bind(this);

        const pw = generatePassword(props.passwordGeneratorCfg);

        this.state = {
            cfg: props.passwordGeneratorCfg,
            password : pw,
            score : calculateScore(pw)
        };

    }

    componentDidMount() {
        //
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
       //
    }

    handleCancelClick() {
        this.props.onUserAction(USER_ACTION_CANCEL_PASSWORD_GENERATOR_DIALOG);
    }

    resetSessionTimer() {

        if(this.timer) {
            window.clearTimeout(this.timer);
            this.timer = null;
        }

        const self = this;
        this.timer = window.setTimeout(() => {
            self.props.onUserAction(USER_ACTION_RESET_SESSION_TIMER);
        }, 500);

    }

    handleOptionsChange(change){
        const cfg = this.state.cfg;

        cfg[change.key] = String(change.value);

        if(cfg.useUpperCases === 'false'
            && cfg.useDigits === 'false'
            && cfg.useLowerCases === 'false'
            && cfg.useSymbols === 'false'){
            cfg.useLowerCases = 'true';
        }

        this.setState({cfg : cfg});

        this.resetSessionTimer();
    }

    handleButtonClick(cmd){
        // console.log(cmd);

        if('generate' === cmd){

            const password = generatePassword(this.state.cfg);

            this.setState({
                password: password,
                score : calculateScore(password)
            });

        } else if ('copy' === cmd){
            //
            clipboard.writeText(this.state.password);

            const span = document.querySelector('#copied-hint');
            span.style.visibility = "visible";

            setTimeout(() => {
                span.style.visibility = "hidden";
            }, 3000);
        }

        this.resetSessionTimer();
    }

    render() {

        const textTitle     = I18n.passwordGenerator_Title();
        const textPwCopied  = I18n.passwordGenerator_Copied();

        return (
            <div className="UIBaseDialog-Backdrop">
                <div className="UIBaseDialog-Content UIPasswordGeneratorDialog">

                    <UIDialogTitleWithClose title={textTitle} onCloseClick={this.handleCancelClick}/>

                    <table>
                        <tbody>
                            <tr>
                                <td id={"generator-view"}>
                                    <UIPasswordGeneratorView cfg={this.state.cfg} password={this.state.password} onOptionsChange={this.handleOptionsChange} onButtonClick={this.handleButtonClick}/>
                                    <span id={"copied-hint"}>{textPwCopied}</span>
                                </td>
                                <td id={"score-view"}>
                                    <UIPasswordScoreView score={this.state.score}/>
                                </td>
                            </tr>
                        </tbody>
                    </table>


                </div>

            </div>
        );
    }
}

export default UIPasswordGeneratorDialog;
