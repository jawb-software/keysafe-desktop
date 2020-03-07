import React from 'react';

import '../UIBaseDialog.css';
import './UICategoryDialog.css';

import {
    USER_ACTION_CANCEL_CATEGORY_SETUP, USER_ACTION_SAVE_EDIT_CATEGORY, USER_ACTION_SAVE_NEW_CATEGORY
} from "../../../Basic/consts";
import I18n from "../../../Basic/I18n/i18n";
import UIDialogTitleWithoutCross from "../UIDialogTitleWithoutCross";

const ERR_INPUT_IS_EMPTY            = -30;
const ERR_INPUT_NO_CHANGE           = -20;
const ERR_INPUT_NAME_ALREADY_EXISTS = -10;
const OK_INPUT_CAN_BE_SAVED         = 1;

class UICategoryDialog extends React.Component {

    constructor(props) {
        super(props);
        const categoryName = this.props['categoryName'];

        this.state = {
            input: categoryName,
            canSave: false
        };

        if(categoryName && categoryName.length > 0){
            this.createMode = false;
            this.initName = categoryName;
        } else {
            this.createMode = true;
        }

        this.availableNames  = this.props.availableNames;
        this.handleSaveClick = this.handleSaveClick.bind(this);
        this.handleChange    = this.handleChange.bind(this);
        this.handleKeyPress  = this.handleKeyPress.bind(this);
        this.handleCancelClick  = this.handleCancelClick.bind(this);
    }

    componentDidMount() {
        let input = document.querySelector('#category-name');
        if (!input.MaterialSnackbar) {
            componentHandler.upgradeElement(input);
        }
    }

    canBeSaved(input){

        if(!input){
            return ERR_INPUT_IS_EMPTY;
        }

        if(input === this.initName){
            return ERR_INPUT_NO_CHANGE;
        }

        if(this.availableNames.indexOf(input) >= 0){
            return ERR_INPUT_NAME_ALREADY_EXISTS;
        }

        return OK_INPUT_CAN_BE_SAVED;
    }

    handleChange(e) {

        const input = e.target.value;

        const inputState = this.canBeSaved(input.trim().toLocaleLowerCase());

        if(inputState === ERR_INPUT_NAME_ALREADY_EXISTS){
            const label = document.querySelector('#category-name .mdl-textfield__label');
            const error = document.querySelector('#category-name .mdl-textfield__error');
            label.classList.add("UIBaseDialog-Input-Error");
            error.style.visibility = 'visible';
        } else {
            const label = document.querySelector('#category-name .mdl-textfield__label');
            const error = document.querySelector('#category-name .mdl-textfield__error');
            label.classList.remove("UIBaseDialog-Input-Error");
            error.style.visibility = 'hidden';
        }

        this.setState({
            input: input,
            inputState: inputState,
        });
    }

    handleSaveClick(){
        const input = this.state.input.trim();
        const inputState = this.canBeSaved(input);
        if(inputState === OK_INPUT_CAN_BE_SAVED){
            const action = this.createMode ? USER_ACTION_SAVE_NEW_CATEGORY : USER_ACTION_SAVE_EDIT_CATEGORY;
            this.props.onUserAction(action, {
                name: input
            });
        }
    }

    handleCancelClick(){
        this.props.onUserAction(USER_ACTION_CANCEL_CATEGORY_SETUP);
    }

    handleKeyPress(e){
        if (e.key === 'Enter') {
            this.handleSaveClick();
        }
    }

    render() {

        const categoryName    = this.props['categoryName'];
        const editMode        =  categoryName &&  categoryName.length > 0;

        const textPlaceholder = I18n.category_PlaceholderName();
        const textTitle       = editMode ? I18n.category_Title_Change() : I18n.category_Title_Create();
        const textCancel      = I18n.basic_Cancel();
        const textSave        = I18n.basic_Save();
        const nameExists      = I18n.category_Msg_CategoryExists();

        return (

            <div className="UIBaseDialog-Backdrop">
                <div className="UIBaseDialog-Content UICategoryDialog">

                    <UIDialogTitleWithoutCross title={textTitle}/>

                    <div className="input-container">

                        <div id="category-name" className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                            <input
                                id="inp-1"
                                className="mdl-textfield__input"
                                type="text"
                                value={this.state.input}
                                onChange={this.handleChange}
                                onKeyPress={this.handleKeyPress}
                                autoFocus/>
                            <label className="mdl-textfield__label" htmlFor="inp-1">{textPlaceholder}</label>
                            <span className="mdl-textfield__error" > {nameExists} </span>
                        </div>

                    </div>

                    <div className="footer">
                        <button onClick={this.handleCancelClick}> {textCancel} </button>
                        <button onClick={this.handleSaveClick} disabled={this.state.inputState !== 1}> {textSave} </button>
                    </div>

                </div>

            </div>
        );
    }
}

export default UICategoryDialog;
