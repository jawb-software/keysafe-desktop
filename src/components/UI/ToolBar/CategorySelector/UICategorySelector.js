import React from 'react';
import './UICategorySelector.css';
import UISelectorTriangle from './UISelectorTriangle'
import UISelectorCross from './UISelectorCross'
import UIClear from '../../Basic/UIClear'
import UICategoryList from "./UICategoryList";
import {
    USER_ACTION_CLOSE_CATEGORY_LIST,
    USER_ACTION_OPEN_CATEGORY_LIST
} from "../../../Basic/consts";
import I18n from "../../../Basic/I18n/i18n";
import {getCurrentTheme} from "../../../Basic/utils";

class UICategorySelector extends React.Component {

    constructor(props) {
        super(props);
        this.toggleCategoryListState = this.toggleCategoryListState.bind(this);
        this.handleOnMouseLeave = this.handleOnMouseLeave.bind(this);
        this.handleOnMouseEnter = this.handleOnMouseEnter.bind(this);
        this.hideCategoryList = this.hideCategoryList.bind(this);
        this.onUserAction = this.onUserAction.bind(this);

        const theme = getCurrentTheme();

        this.state = {
            categoryList:       this.props.categoryList,
            currentCategoryId:  this.props.currentCategoryId,
            showCategoryList :  this.props.showCategoryList,

            bgColor :           this.props.showCategoryList ?  theme.COLOR_NAVIGATION_OPENED_BACKGROUND :  theme.COLOR_NAVIGATION_CLOSED_BACKGROUND ,
            colorCategoryName : this.props.showCategoryList ?  theme.COLOR_NAVIGATION_OPENED_CATEGORY_NAME :  theme.COLOR_NAVIGATION_CLOSED_CATEGORY_NAME,
            colorCategoryValue : this.props.showCategoryList ?  theme.COLOR_NAVIGATION_OPENED_CATEGORY_VALUE :  theme.COLOR_NAVIGATION_CLOSED_CATEGORY_VALUE,
            hoverState : false
        }
    }

    static getDerivedStateFromProps(newProps, currentState) {
        // console.log('getDerivedStateFromProps', newProps, currentState);
        const theme = getCurrentTheme();
        return {
            categoryList:       newProps.categoryList,
            currentCategoryId:  newProps.currentCategoryId,
            showCategoryList :  newProps.showCategoryList,

            bgColor :           newProps.showCategoryList ? theme.COLOR_NAVIGATION_OPENED_BACKGROUND : theme.COLOR_NAVIGATION_CLOSED_BACKGROUND ,
            colorCategoryName : newProps.showCategoryList ? theme.COLOR_NAVIGATION_OPENED_CATEGORY_NAME : theme.COLOR_NAVIGATION_CLOSED_CATEGORY_NAME,
            colorCategoryValue : newProps.showCategoryList ? theme.COLOR_NAVIGATION_OPENED_CATEGORY_VALUE : theme.COLOR_NAVIGATION_CLOSED_CATEGORY_VALUE,
            hoverState : newProps.hoverState
        };
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        // console.log('shouldComponentUpdate', nextState, this.state);
        return true;
    }

    static defaultState(showCategoryList){

        const theme = getCurrentTheme();

        if(showCategoryList){
            return {
                showCategoryList : true,
                bgColor : theme.COLOR_NAVIGATION_OPENED_BACKGROUND ,
                colorCategoryName : theme.COLOR_NAVIGATION_OPENED_CATEGORY_NAME,
                colorCategoryValue : theme.COLOR_NAVIGATION_OPENED_CATEGORY_VALUE,
                hoverState : false
            }
        }

        return {
            showCategoryList : false,
            bgColor : theme.COLOR_NAVIGATION_CLOSED_BACKGROUND,
            colorCategoryName : theme.COLOR_NAVIGATION_CLOSED_CATEGORY_NAME,
            colorCategoryValue : theme.COLOR_NAVIGATION_CLOSED_CATEGORY_VALUE,
            hoverState : false
        };
    }

    onUserAction(action, value) {

        //
        this.props.onUserAction(action, value);

        //
        this.setState(UICategorySelector.defaultState(false));
    }

    hideCategoryList(){
        this.props.onUserAction(USER_ACTION_CLOSE_CATEGORY_LIST);
    }

    handleOnMouseLeave() {
        this.setState({hoverState : false});
    }

    handleOnMouseEnter() {
        this.setState({ hoverState : true });
    }

    toggleCategoryListState(){
        if(this.state.showCategoryList){
            this.props.onUserAction(USER_ACTION_CLOSE_CATEGORY_LIST);
        } else {
            this.props.onUserAction(USER_ACTION_OPEN_CATEGORY_LIST);
        }
    }

    render() {

        const categoryId = this.state.currentCategoryId;
        const categories = this.state.categoryList;

        let currentCategoryName = '???';

        for (let i = 0; i < categories.length; i++){
            let category = categories[i];
            if(category.id === categoryId){
                currentCategoryName = category.name;
                break;
            }
        }

        const theme = getCurrentTheme();
        const backgroundColor = this.state.hoverState ? theme.COLOR_TOOLBAR_BACKGROUND : this.state.bgColor;
        const sectionStyle = {
            borderRight: '1px solid' + theme.COLOR_TOOLBAR_SECTION_BORDER
        };

        return (
            <div className="UIToolBarSection UIToolBarSection-Selectable" style={sectionStyle}>

                <div className="Category-Selector" >

                    <div className="Category-Selector-Name"
                         style={{backgroundColor: backgroundColor}}
                         onClick={this.toggleCategoryListState}
                         onMouseEnter={this.handleOnMouseEnter}
                         onMouseLeave={this.handleOnMouseLeave}>

                        <div id="category-name-container">
                            <span id="category-name-label" style={{color:this.state.colorCategoryName}}>
                                { I18n.categoryList_Title() }
                            </span>
                            <span id="category-name-value" style={{color:this.state.colorCategoryValue}}>
                                {currentCategoryName}
                            </span>
                        </div>

                        <div id="category-icon-container">
                            {this.state.showCategoryList ? <UISelectorCross/> : <UISelectorTriangle/>}
                        </div>
                        <UIClear/>
                    </div>
                    {this.state.showCategoryList && <UICategoryList categoryList={categories} currentCategoryId={categoryId} onUserAction={this.onUserAction}/>}
                </div>

            </div>
        );
    };
}

export default UICategorySelector;
