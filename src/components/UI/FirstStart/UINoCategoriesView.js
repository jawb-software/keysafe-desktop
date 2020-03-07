import React from 'react';
import './UINoCategoriesView.css';
import {USER_ACTION_IMPORT_PASSWORDS, USER_ACTION_NEW_CATEGORY} from "../../Basic/consts";
import I18n from "../../Basic/I18n/i18n";
import {getCurrentTheme} from "../../Basic/utils";

class UINoCategoriesView extends React.Component {

    constructor(props) {
        super(props);
        this.onCreateCategoryClick = this.onCreateCategoryClick.bind(this);
        this.onImportPasswordsClick = this.onImportPasswordsClick.bind(this);
    }

    onCreateCategoryClick(){
        this.props.onAction(USER_ACTION_NEW_CATEGORY);
    }

    onImportPasswordsClick(){
        this.props.onAction(USER_ACTION_IMPORT_PASSWORDS);
    }

    render() {

        const NO_CATEGORIES = I18n.passwordList_NoCategories();
        const NEW_CAT       = I18n.category_Title_Create();
        const IMPORT        = I18n.passwordList_Import();

        const theme        = getCurrentTheme();
        const accentClr    = theme.COLOR_ACCENT;
        const addPwCardStyle = {border : '1px dashed ' + accentClr};
        const accentClr2      = theme.COLOR_ACCENT_2;
        const addPwCardStyle2 = {border : '1px dashed ' + accentClr2};

        return (
            <div className="keysafe-Outer-Container">
                <div className="keysafe-Middle-Container">
                    <div className="keysafe-Inner-Container">

                        <span className="Info-Msg"> {NO_CATEGORIES} </span>

                        <div id={'add-buttons-container'} className="smdl-grid">
                            <div onClick={this.onCreateCategoryClick} className={"add-button"}>
                                <div className="add-password-card" style={addPwCardStyle}>
                                    <i id={'i1'} className="material-icons" style={{color:accentClr}}>playlist_add</i>
                                    <span style={{color:accentClr}}>{ NEW_CAT }</span>
                                </div>
                            </div>

                            <div onClick={this.onImportPasswordsClick} className={"add-button"}>
                                <div className="add-password-card" style={addPwCardStyle2}>
                                    <i id={'i2'} className="material-icons" style={{color:accentClr2}}>note_add</i>
                                    <span style={{color:accentClr2}}>{ IMPORT }</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default UINoCategoriesView;
