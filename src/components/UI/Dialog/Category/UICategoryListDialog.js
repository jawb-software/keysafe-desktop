import React from 'react';

import '../UIBaseDialog.css';
import './UICategoryListDialog.css';

import {
    USER_ACTION_CANCEL_MOVE_PASSWORD,
    USER_ACTION_EXECUTE_MOVE_PASSWORD
} from "../../../Basic/consts";
import I18n from "../../../Basic/I18n/i18n";
import UIDialogTitleWithoutCross from "../UIDialogTitleWithoutCross";

class UICategoryListDialog extends React.Component {

    constructor(props) {
        super(props);

        const cats = props['categoryList'].map(cat => {
            return {
                id : cat.id,
                name : cat.name
            };
        });

        cats.sort( (a, b) => {
            if(a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase()) return 1;

            return -1;
        });

        this.state = {
            categoryList : cats,
            password : props['password'],
            selectedCategory : props['password'].category,
        };

        this.handleSaveClick = this.handleSaveClick.bind(this);
        this.handleChange    = this.handleChange.bind(this);
        this.handleCancelClick  = this.handleCancelClick.bind(this);
    }

    componentDidMount() {
        const element = document.querySelector('#category-select-container');
        if(window.MaterialSelectfield){
            componentHandler.upgradeElement(element);
        }
    }

    handleChange(e) {
        this.setState({
            selectedCategory: e.target.value
        });
    }

    handleSaveClick(){
        const categoryId = this.state.selectedCategory;

        if(this.state.password.category !== categoryId){

            this.props.onUserAction(USER_ACTION_EXECUTE_MOVE_PASSWORD, {
                passwordId: this.state.password.id,
                categoryId : categoryId
            });
        }
    }

    handleCancelClick(){
        this.props.onUserAction(USER_ACTION_CANCEL_MOVE_PASSWORD);
    }

    render() {

        const textTitle   = I18n.movePasswordDialog_Title();
        const selectLabel = I18n.movePasswordDialog_CategorySelectLabel();
        const textCancel  = I18n.basic_Cancel();
        const textSave    = I18n.basic_Save();

        const dfltValue = this.state.selectedCategory;

        const options = this.state.categoryList.map(cat => {
            return (
                <option key={cat.id} value={cat.id}>
                    {cat.name}
                </option>
            );
        });

        return (

            <div className="UIBaseDialog-Backdrop">
                <div className="UIBaseDialog-Content UICategoryListDialog">

                    <UIDialogTitleWithoutCross title={textTitle}/>

                    <div className="input-container">

                        <div id="category-select-container" className="mdl-selectfield mdl-js-selectfield  mdl-selectfield--floating-label">
                            <select value={dfltValue} onChange={this.handleChange} id="profile-select" name="myselect" className="mdl-selectfield__select">
                                {options}
                            </select>
                            <label className="mdl-selectfield__label mdl-textfield__label" htmlFor="profile-select">{selectLabel}</label>
                        </div>

                    </div>

                    <div className="footer">
                        <button onClick={this.handleCancelClick}> {textCancel} </button>
                        <button onClick={this.handleSaveClick} disabled={this.state.password.category === dfltValue}> {textSave} </button>
                    </div>

                </div>

            </div>
        );
    }
}

export default UICategoryListDialog;
