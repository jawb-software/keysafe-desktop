import React from 'react';
import './UIToolBar.css';
import {USER_ACTION_PASSWORD_FILTER} from "../../Basic/consts";
import UICategorySelector from "./CategorySelector/UICategorySelector";
import UISearchView from "./SearchInput/UISearchView";
import UIClear from "../Basic/UIClear";
import {getCurrentTheme} from "../../Basic/utils";

class UIToolBar extends React.Component {

    constructor(props) {
        super(props);
        this.onPasswordFilterInputChange = this.onPasswordFilterInputChange.bind(this);
        this.onUserAction = this.onUserAction.bind(this);
        this.state = {
            showCategoryList: props.showCategoryList,
            categoryList: props.categoryList,
            currentCategoryId: props.currentCategoryId
        };
    }

    componentWillReceiveProps(nextProps, nextContext) {
        // console.log('componentWillReceiveProps', nextProps);
        this.setState(nextProps);
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        // console.log('shouldComponentUpdate', nextProps, this.state);
        // return nextProps.showCategoryList !== this.state.showCategoryList;
        return true;
    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        // console.log('componentWillUpdate', nextProps);
    }

    onPasswordFilterInputChange(filterText) {
        this.props.onUserAction(USER_ACTION_PASSWORD_FILTER, filterText);
    }

    onUserAction(action, value){
        this.props.onUserAction(action, value);
    }

    render() {

        const theme = getCurrentTheme();

        const categories = this.state.categoryList;
        const categoryId = this.state.currentCategoryId;
        const showCategoryList = this.state.showCategoryList;

        const style = {
            borderBottom: '1px solid ' + theme.COLOR_TOOLBAR_SECTION_BORDER,
            backgroundColor : theme.COLOR_TOOLBAR_BACKGROUND
        };
        return (
            <div className="UIToolBar" style={style} >

                <UICategorySelector
                    categoryList={categories}
                    currentCategoryId={categoryId}
                    showCategoryList={showCategoryList}
                    onUserAction={this.onUserAction}/>

                <div className="UIToolBarSection">
                    <UISearchView hasPasswords={this.props.hasPasswords} onPasswordFilterInputChange={this.onPasswordFilterInputChange}/>
                    <UIClear/>
                </div>
            </div>
        );
    }
}

export default UIToolBar;
