import React from 'react';

import '../UIBaseDialog.css';
import './UIPasswordScoreDialog.css';

import {
    USER_ACTION_CANCEL_PASSWORD_STRENGTH_DIALOG,
} from "../../../Basic/consts";

import {calculateScore} from "../../../Basic/PasswordGenerator/pwanalyse";
import UIPasswordScoreView from "./UIPasswordScoreView";
import I18n from "../../../Basic/I18n/i18n";
import UIDialogTitleWithClose from "../UIDialogTitleWithClose";

class UIPasswordScoreDialog extends React.Component {

    constructor(props) {
        super(props);
        this.handleCancelClick = this.handleCancelClick.bind(this);
        let score = calculateScore(props.password);
        this.state = {
            password: props.password,
            score: score
        };
    }

    handleCancelClick() {
        this.props.onUserAction(USER_ACTION_CANCEL_PASSWORD_STRENGTH_DIALOG);
    }

    render() {

        const textTitle = I18n.passwordScore_Title();

        const result = this.state.score;
        const containsBlackListedChars = result.blackListedStrings.length > 0;

        const textBlackListed = containsBlackListedChars ? I18n.passwordScore_RemovedBlackListed(result.blackListedStrings.join(', ')) : null;

        return (
            <div className="UIBaseDialog-Backdrop">
                <div className="UIBaseDialog-Content UIPasswordScoreDialog">

                    <UIDialogTitleWithClose title={textTitle} onCloseClick={this.handleCancelClick}/>

                    <div className="password">
                        <span className={"original"}>
                            {this.state.password}
                        </span>
                        {containsBlackListedChars &&
                        <span className={"cleaned"}>
                            {textBlackListed}
                        </span>
                        }
                    </div>

                    <UIPasswordScoreView score={this.state.score}/>

                </div>

            </div>
        );
    }
}

export default UIPasswordScoreDialog;
