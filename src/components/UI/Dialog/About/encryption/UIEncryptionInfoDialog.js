import React from 'react';

import '../../UIBaseDialog.css';
import './UIEncryptionInfoDialog.css';
import I18n from "../../../../Basic/I18n/i18n";
import UIDialogTitleWithClose from "../../UIDialogTitleWithClose";

import {USER_ACTION_CLOSE_ABOUT_ENCRYPTION_INFO} from "../../../../Basic/consts";
import Crypt from "../../../../DataBase/Security/Crypt";

class UIEncryptionInfoDialog extends React.Component {

    constructor(props) {
        super(props);
        this.handleCancelClick  = this.handleCancelClick.bind(this);
    }

    componentDidMount() {
    }

    handleCancelClick(){
        this.props.onUserAction(USER_ACTION_CLOSE_ABOUT_ENCRYPTION_INFO);
    }

    render() {

        const dialogTitle = I18n.aboutKeysafe_EncryptionInfo_Title();
        const subtitle    = I18n.aboutKeysafe_EncryptionInfo_CryptoInfoTitle();
        const example     = I18n.aboutKeysafe_EncryptionInfo_Example();
        const preTemplate = I18n.aboutKeysafe_EncryptionInfo_ExampleTemplate();

        const encryption2   = I18n.profile_EncryptionData();

        const masterPw  = 'DrKeySafev1.0';
        const cypher    = new Crypt(masterPw);
        const examplePw = 'trustNoOne';

        const preContent = preTemplate.replace('{mpw}', masterPw)
                                      .replace('{pw}', examplePw)
                                      .replace('{v1}', cypher.encrypt(examplePw))
                                      .replace('{v2}', cypher.encrypt(examplePw));

        return (

            <div className="UIBaseDialog-Backdrop">
                <div className="UIBaseDialog-Content UIEncryptionInfoDialog">

                    <UIDialogTitleWithClose title={dialogTitle} onCloseClick={this.handleCancelClick}/>

                    <div id={'content-container'}>

                        <span id={"encryption-title"}>{subtitle}</span>
                        <pre>
                            {encryption2[0]}<br/><br/>
                            {encryption2[1]}<br/>
                            {encryption2[2]}<br/>
                            {encryption2[3]}<br/>
                            {encryption2[4]}<br/>
                            {encryption2[5]}
                        </pre>

                        <span id={"encryption-examples-title"}>{example}</span>
                        <div id={'encryption-examples'}>

                            <pre id={'example'} dangerouslySetInnerHTML={{__html:preContent}}/>

                        </div>

                    </div>

                </div>

            </div>
        );
    }
}

export default UIEncryptionInfoDialog;
