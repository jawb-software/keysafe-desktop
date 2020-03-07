import React from 'react';

import '../../UIBaseDialog.css';
import './UIHowToDialog.css';
import I18n from "../../../../Basic/I18n/i18n";
import UIDialogTitleWithClose from "../../UIDialogTitleWithClose";

import {
    USER_ACTION_CLOSE_HOWTO
} from "../../../../Basic/consts";
import {getCurrentTheme} from "../../../../Basic/utils";

class UIHowToDialog extends React.Component {

    constructor(props) {
        super(props);
        this.handleCancelClick  = this.handleCancelClick.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
        this.selectCategory = this.selectCategory.bind(this);
        this.state = {
            selectedIndex : 0
        }
    }

    componentDidMount() {
    }

    handleCancelClick(){
        this.props.onUserAction(USER_ACTION_CLOSE_HOWTO);
    }

    onMouseOver(e){
        const el = document.getElementById(e.target.id);
        el.style.backgroundColor = getCurrentTheme().COLOR_NAVIGATION_LIST_ITEM_HOVER_BACKGROUND;
    }

    onMouseOut(e){
        const el = document.getElementById(e.target.id);
        el.style.backgroundColor = 'transparent';
    }

    selectCategory(e){
        const id = e.target.id;
        this.setState({selectedIndex: Number(id.replace('faq-li-', ''))})
    }

    render() {

        const dialogTitle = I18n.aboutKeysafe_HowTo_Title();
        const data = I18n.aboutKeysafe_HowTo_Data();

        const theme = getCurrentTheme();

        const ulStyle = {
            backgroundColor : theme.COLOR_NAVIGATION_OPENED_BACKGROUND,
            borderTop: '1px solid ' + theme.COLOR_TITLEBAR_BORDER
        };
        const selectedStyle = {
            backgroundColor: theme.COLOR_NAVIGATION_LIST_SELECTED_ITEM_BACKGROUND,
            borderLeft : '4px solid ' + theme.COLOR_NAVIGATION_LIST_SELECTED_ITEM_BORDER,
            color : theme.COLOR_NAVIGATION_LIST_SELECTED_ITEM_TEXT

        };

        const liDfltStyle = {
            color: theme.COLOR_NAVIGATION_LIST_CATEGORY_ITEM_NAME,
            borderLeft : '4px solid transparent',
        };

        const self = this;

        const lis = data.map((item, i) => {

            if(i === this.state.selectedIndex){

                return (
                    <li key={'faq-li-' + i} id={'faq-li-' + i} style={ selectedStyle }>
                        {item.title}
                    </li>
                );

            } else {

                return (
                    <li key={'faq-li-' + i} id={'faq-li-' + i} onMouseOut={self.onMouseOut} onMouseOver={self.onMouseOver} onClick={self.selectCategory} style={ liDfltStyle }>
                        {item.title}
                    </li>
                );
            }


        });


        return (

            <div className="UIBaseDialog-Backdrop">
                <div className="UIBaseDialog-Content UIHowToDialog">

                    <UIDialogTitleWithClose title={dialogTitle} onCloseClick={this.handleCancelClick}/>

                    <div id={'content-container'}>
                        <ul style={ulStyle}>
                            {lis}
                        </ul>
                        <div id={'item-text'} >
                            <span className={'entry-title'}>{ data[this.state.selectedIndex].title }</span>
                            <p dangerouslySetInnerHTML={{__html:data[this.state.selectedIndex].text}}/>
                        </div>
                    </div>

                </div>

            </div>
        );
    }
}

export default UIHowToDialog;
