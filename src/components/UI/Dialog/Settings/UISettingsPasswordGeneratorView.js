import React from 'react';

import '../UIBaseDialog.css';
import './UISettingsPasswordGeneratorView.css';
import UICheckbox from "../../Basic/UICheckbox";
import UISlider from "../../Basic/UISlider";
import I18n from "../../../Basic/I18n/i18n";
import UIClear from "../../Basic/UIClear";
import {CHARS_LC, CHARS_NR, CHARS_SPECIAL, CHARS_UP} from "../../../Basic/consts";
import PasswordGeneratorConfiguration from "../../../Basic/Types/PasswordGeneratorConfiguration";
import Profile from "../../../Basic/Types/Profile";

class UISettingsPasswordGeneratorView extends React.Component {

    constructor(props) {
        super(props);
        this.onChange       = this.onChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.onResetUC      = this.onResetUC.bind(this);
        this.onResetLC      = this.onResetLC.bind(this);
        this.onResetDigits  = this.onResetDigits.bind(this);
        this.onResetSymbols = this.onResetSymbols.bind(this);
        this.state = {
            cfg : props.profile.passwordGeneratorConfiguration
        };
    }

    componentDidMount() {
        let input = document.querySelector('#symbols-input-div');

        if(!input){
            console.log("ERROR: Element not found!");
            return;
        }

        if (!input.MaterialSnackbar) {
            componentHandler.upgradeElement(input);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    handleKeyPress(el) {
    }

    onResetUC(){ this.reset('upperCases', CHARS_UP); }
    onResetLC(){ this.reset('lowerCases', CHARS_LC); }
    onResetDigits(){ this.reset('digits', CHARS_NR); }
    onResetSymbols(){ this.reset('symbols', CHARS_SPECIAL); }

    reset(key, value){
        let input = document.querySelector('#' + key);
        if(input){
            input.value = value;
        } else {
            console.log("ERROR: Element " + key + " not found!");
        }

        this.onChange({
           target : {
               id : key,
               value : value
           }
        });
    }

    onChange(el) {

        const id    = el.target.id;
        const value = 'checkbox' === el.target.type ? el.target.checked : el.target.value;

        const data = this.state.cfg;

        if(PasswordGeneratorConfiguration.KEY_NAME_DIGITS === id){
            data[id] = value.replace(/\D/g, '');
        } else if(PasswordGeneratorConfiguration.KEY_NAME_UC === id){
            data[id] = value.replace( /[^A-Z]/g, '');
        }  else if(PasswordGeneratorConfiguration.KEY_NAME_LC === id){
            data[id] = value.replace( /[^a-z]/g, '');
        } else {
            data[id] = String(value);
        }

        // min 1 muss gesetzt sein
        if(data[PasswordGeneratorConfiguration.KEY_NAME_USE_DIGITS] !== 'true'
            && data[PasswordGeneratorConfiguration.KEY_NAME_USE_LC] !== 'true'
            && data[PasswordGeneratorConfiguration.KEY_NAME_USE_UC] !== 'true'){
            data[PasswordGeneratorConfiguration.KEY_NAME_USE_LC] = 'true';
        }

        this.props.onPropertyChange(Profile.KEY_NAME_PW_CFG, data);

        this.setState({
            cfg : data
        });
    }

    classForState(unchanged, enabled){
        if(!enabled){
            return 'chars-input-disabled';
        }
        return unchanged ? 'chars-input-unchanged' : 'chars-input-changed';
    }

    render() {

        const useLC = this.state.cfg.useLowerCases === 'true';
        const lcs   = this.state.cfg.lowerCases;
        const lcsClass = this.classForState(lcs === CHARS_LC, useLC);
        const lcsBtn   = lcs === CHARS_LC ? 'disabled' : '';
        const lcsInput = useLC ? '' : 'disabled';

        const useUC = this.state.cfg.useUpperCases === 'true';
        const ucs   = this.state.cfg.upperCases;
        const ucsClass = this.classForState(ucs === CHARS_UP, useUC);
        const ucsBtn   = ucs === CHARS_UP ? 'disabled' : '';
        const ucsInput = useUC ? '' : 'disabled';

        const useDigits = this.state.cfg.useDigits === 'true';
        const digits    = this.state.cfg.digits;
        const digitsClass = this.classForState(digits === CHARS_NR, useDigits);
        const digitsBtn   = digits === CHARS_NR ? 'disabled' : '';
        const digitsInput = useDigits ? '' : 'disabled';

        const useSyms = this.state.cfg.useSymbols === 'true';
        const symbols = this.state.cfg.symbols;
        const symbolsClass = this.classForState(symbols === CHARS_SPECIAL, useSyms);
        const symBtn   = symbols === CHARS_SPECIAL ? 'disabled' : '';
        const symsInput = useSyms ? '' : 'disabled';

        const requiredLength = this.state.cfg.requiredLength();
        const requiredScore  = this.state.cfg.requiredMinScore();

        const textUC        = I18n.passwordGenerator_UpperCases();
        const textLC        = I18n.passwordGenerator_LowerCases();
        const textDigits    = I18n.passwordGenerator_Digits();
        const textSymbols   = I18n.passwordGenerator_Symbols();
        const textPwLength  = I18n.passwordGenerator_PwLength();
        const textPwScore   = I18n.passwordGenerator_PwScore();
        const textReset   = "Zurücksetzen";

        return (

            <div className="UISettingsPasswordGeneratorView">

                <div className={"elementOneLine"}>

                    <div className={"elementOneLine-Left"}>
                        <UICheckbox id={"useLowerCases"} onChange={this.onChange} label={textLC} defaultChecked={useLC}/>
                    </div>

                    <div className={"elementOneLine-Right"}>
                        <div id="lowerCases-input-div" className={"chars-input mdl-textfield mdl-js-textfield " + lcsClass}>
                            <input
                                id="lowerCases"
                                className="mdl-textfield__input"
                                type="text"
                                value={lcs}
                                onChange={this.onChange}
                                onKeyPress={this.handleKeyPress}
                                disabled={lcsInput}
                            />
                        </div>
                    </div>

                    <div className={"elementOneLine-Right"}>
                        <button className={"reset-btn"} id={"reset-lowerCases"} onClick={this.onResetLC} disabled={lcsBtn}> {textReset} </button>
                    </div>

                </div>

                <div className={"elementOneLine"}>

                    <div className={"elementOneLine-Left"}>
                        <UICheckbox id={"useUpperCases"} onChange={this.onChange} label={textUC} defaultChecked={useUC}/>
                    </div>

                    <div className={"elementOneLine-Right"}>
                        <div id="upperCases-input-div" className={"chars-input mdl-textfield mdl-js-textfield " + ucsClass}>
                            <input
                                id="upperCases"
                                className="mdl-textfield__input"
                                type="text"
                                value={ucs}
                                onChange={this.onChange}
                                onKeyPress={this.handleKeyPress}
                                disabled={ucsInput}
                            />
                        </div>
                    </div>

                    <div className={"elementOneLine-Right"}>
                        <button className={"reset-btn"} id={"reset-upperCases"} onClick={this.onResetUC} disabled={ucsBtn}> {textReset} </button>
                    </div>

                </div>

                <div className={"elementOneLine"}>

                    <div className={"elementOneLine-Left"}>
                        <UICheckbox id={"useDigits"} onChange={this.onChange} label={textDigits} defaultChecked={useDigits}/>
                    </div>

                    <div className={"elementOneLine-Right"}>
                        <div id="digits-input-div" className={"chars-input mdl-textfield mdl-js-textfield " + digitsClass}>
                            <input
                                id="digits"
                                className="mdl-textfield__input"
                                type="text"
                                value={digits}
                                onChange={this.onChange}
                                onKeyPress={this.handleKeyPress}
                                disabled={digitsInput}
                            />
                        </div>
                    </div>

                    <div className={"elementOneLine-Right"}>
                        <button className={"reset-btn"} id={"reset-digits"} onClick={this.onResetDigits} disabled={digitsBtn}> {textReset} </button>
                    </div>

                </div>

                <div className={"elementOneLine"}>

                    <div className={"elementOneLine-Left"}>
                        <UICheckbox id={"useSymbols"} onChange={this.onChange} label={textSymbols} defaultChecked={useSyms}/>
                    </div>

                    <div className={"elementOneLine-Right"}>
                        <div id="symbols-input-div" className={"chars-input mdl-textfield mdl-js-textfield " + symbolsClass}>
                            <input
                                id="symbols"
                                className="mdl-textfield__input"
                                type="text"
                                value={symbols}
                                onChange={this.onChange}
                                onKeyPress={this.handleKeyPress}
                                disabled={symsInput}
                            />
                        </div>
                    </div>

                    <div className={"elementOneLine-Right"}>
                        <button className={"reset-btn"} id={"reset-symbols"} onClick={this.onResetSymbols} disabled={symBtn}> {textReset} </button>
                    </div>

                </div>

                <UIClear/>

                <div className={"slider-element"}>
                    <UISlider id={"passwordLength"} defaultValue={requiredLength} min={3} max={50} onChange={this.onChange} label={textPwLength}/>
                </div>


                <div className={"slider-element"}>
                    <UISlider id={"minPasswordScore"} defaultValue={requiredScore} min={10} max={100} onChange={this.onChange} label={textPwScore}/>
                </div>

            </div>

        );
    }
}

export default UISettingsPasswordGeneratorView;
