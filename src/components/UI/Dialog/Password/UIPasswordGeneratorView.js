import React from 'react';

import '../UIBaseDialog.css';
import './UIPasswordGeneratorView.css';
import UICheckbox from "../../Basic/UICheckbox";
import UISlider from "../../Basic/UISlider";
import I18n from "../../../Basic/I18n/i18n";
import PasswordGeneratorConfiguration from "../../../Basic/Types/PasswordGeneratorConfiguration";
import UIClear from "../../Basic/UIClear";

class UIPasswordGeneratorView extends React.Component {

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.onGenerateClick = this.onGenerateClick.bind(this);
        this.onCopyClick = this.onCopyClick.bind(this);
    }

    componentDidMount() {
        let input = document.querySelector('#password-input');
        if (!input.MaterialSnackbar) {
            componentHandler.upgradeElement(input);
        }
    }

    // componentDidUpdate(prevProps, prevState, snapshot) {
    //     //
    // }

    handleKeyPress(el) {

    }

    onChange(el) {
        const id = el.target.id;
        const value = 'checkbox' === el.target.type ? el.target.checked : el.target.value;
        // console.log(id + ":" + value);

        this.props.onOptionsChange({
            key : id,
            value: value
        });
    }

    onGenerateClick(){
        this.props.onButtonClick('generate');
    }

    onCopyClick(){
        this.props.onButtonClick('copy');
    }

    render() {

        const textCOPY      = I18n.passwordGenerator_Copy();
        const textGenerate  = I18n.passwordGenerator_Generate();
        const textLC        = I18n.passwordGenerator_LowerCases();
        const textUC        = I18n.passwordGenerator_UpperCases();
        const textDigits    = I18n.passwordGenerator_Digits();
        const textSymbols   = I18n.passwordGenerator_Symbols();
        const textPwLength  = I18n.passwordGenerator_PwLength();
        const textPwScore   = I18n.passwordGenerator_PwScore();

        const lcEnabled = this.props.cfg.isLCEnabled();
        const ucEnabled = this.props.cfg.isUCEnabled();
        const nrEnabled = this.props.cfg.isNrEnabled();
        const symEnabled = this.props.cfg.isSymEnabled();

        const minScore = this.props.cfg.requiredMinScore();
        const minLength = this.props.cfg.requiredLength();

        const password = this.props.password;

        // 1 : 22px
        // 10 : 22px
        // 20 : 20 px

        const inputStyle = {
          fontSize :   (22 - password.length * 0.1) + 'px'
        };

        return (

            <div className="UIPasswordGeneratorView">

                <div className={"element"}>
                    <UICheckbox id={PasswordGeneratorConfiguration.KEY_NAME_USE_LC} onChange={this.onChange} label={textLC} defaultChecked={lcEnabled}/>
                    <UIClear/>
                </div>

                <div className={"element"}>
                    <UICheckbox id={PasswordGeneratorConfiguration.KEY_NAME_USE_UC} onChange={this.onChange} label={textUC} defaultChecked={ucEnabled}/>
                    <UIClear/>
                </div>

                <div className={"element"}>
                    <UICheckbox id={PasswordGeneratorConfiguration.KEY_NAME_USE_DIGITS} onChange={this.onChange} label={textDigits} defaultChecked={nrEnabled}/>
                    <UIClear/>
                </div>

                <div className={"element"}>
                    <UICheckbox id={PasswordGeneratorConfiguration.KEY_NAME_USE_SYM} onChange={this.onChange} label={textSymbols} defaultChecked={symEnabled}/>
                    <UIClear/>
                </div>

                <div className={"slider-element"}>
                    <UISlider id={PasswordGeneratorConfiguration.KEY_NAME_PW_LENGTH} defaultValue={minLength} min={3} max={50} onChange={this.onChange} label={textPwLength}/>
                </div>

                <div className={"slider-element"}>
                    <UISlider id={PasswordGeneratorConfiguration.KEY_NAME_PW_SCORE} defaultValue={minScore} min={10} max={100} onChange={this.onChange} label={textPwScore}/>
                </div>

                <div id={"buttons"}>
                    <button id={'copy'} onClick={this.onCopyClick}> {textCOPY} </button>
                    <button id={'generate'} onClick={this.onGenerateClick} > {textGenerate} </button>
                </div>

                <div id="password-input" className="mdl-textfield mdl-js-textfield">
                    <input
                        id="inp-1"
                        className="mdl-textfield__input"
                        type="text"
                        value={this.props.password}
                        onChange={this.onChange}
                        onKeyPress={this.handleKeyPress}
                        style={inputStyle}
                    />
                </div>


            </div>

        );
    }
}

export default UIPasswordGeneratorView;
