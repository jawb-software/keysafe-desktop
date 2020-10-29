import React from 'react';
import './UIPasswordListItem.css';
import I18n from "../../Basic/I18n/i18n";
import Highlighter from "react-highlight-words";

import {
    USER_ACTION_COPY_PASSWORD,
    USER_ACTION_COPY_USER_NAME,
    USER_ACTION_EDIT_PASSWORD, USER_ACTION_MOVE_PASSWORD,
    USER_ACTION_REMOVE_PASSWORD,
    USER_ACTION_SHOW_PASSWORD_STRENGTH_DIALOG
} from "../../Basic/consts";
import {dateToString, getCurrentTheme} from "../../Basic/utils";

class UIPasswordListItem extends React.Component {

    constructor(props) {
        super(props);
        this.onEditClicked          = this.onEditClicked.bind(this);
        this.onDeleteClicked        = this.onDeleteClicked.bind(this);
        this.onPWStrengthClicked    = this.onPWStrengthClicked.bind(this);
        this.onMoveClicked          = this.onMoveClicked.bind(this);
        this.onCopyUserNameClicked  = this.onCopyUserNameClicked.bind(this);
        this.onCopyPasswordClicked  = this.onCopyPasswordClicked.bind(this);
        this.state = {
            passwordItem: this.props.passwordItem,
            profile: this.props.profile,
            filter: this.props.filter
        }
    }

    static getDerivedStateFromProps(props, state){
        return props;
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if(nextProps.filter === this.state.filter
            && nextProps.passwordItem.updatedAt.getTime() === this.state.passwordItem.updatedAt.getTime()
            && nextProps.profile.updatedAt.getTime() === this.state.profile.updatedAt.getTime()){
            return false;
        }
        return true;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // console.log('did update');
        const card = document.getElementById(this.state.passwordItem.id);
        if(card){
            componentHandler.upgradeElement(card);
        }
        componentHandler.upgradeDom();
    }

    componentDidMount() {
    }

    onEditClicked(){ this.props.onUserAction(USER_ACTION_EDIT_PASSWORD, this.state.passwordItem.id); }
    onDeleteClicked(){ this.props.onUserAction(USER_ACTION_REMOVE_PASSWORD, this.state.passwordItem.id); }
    onMoveClicked(){ this.props.onUserAction(USER_ACTION_MOVE_PASSWORD, this.state.passwordItem.id); }
    onPWStrengthClicked(){ this.props.onUserAction(USER_ACTION_SHOW_PASSWORD_STRENGTH_DIALOG, this.state.passwordItem.id); }

    onCopyUserNameClicked(){ this.props.onUserAction(USER_ACTION_COPY_USER_NAME, this.state.passwordItem.id); }
    onCopyPasswordClicked(){ this.props.onUserAction(USER_ACTION_COPY_PASSWORD, this.state.passwordItem.id); }

    render() {

        const self = this;
        const item = this.state.passwordItem;
        const filterWords    = this.state.filter;
        const showLastChange    = this.state.profile.viewConfiguration.showLastChange;
        const showPasswordScore = this.state.profile.viewConfiguration.showPasswordScore;

        const ttPwStrength   = I18n.basic_PasswordStrength(item.score);
        const ttPwChangeDate = I18n.basic_Changed();
        let title;

        const theme = getCurrentTheme();

        const style = {
          color : theme.COLOR_PASSWORD_ITEM_TITLE
        };

        if(filterWords){
            title = (
                <h2 className="mdl-card__title-text password-title" style={style}>
                    <Highlighter
                        highlightClassName="Filter-Highlight"
                        searchWords={[filterWords]}
                        autoEscape={true}
                        textToHighlight={item.name}
                    />
                </h2>
            );
        } else {
            title = <h2 className="mdl-card__title-text password-title" style={style}>{item.name}</h2>;
        }

        let scoreCss = null;
        // let scoreTt  = null;
        // let changedTt = showLastChange ? "Datum der letzten Änderung" : null;
        //
        if(showPasswordScore) {
            const scoreAsDigit = Number(item.score);

            if(scoreAsDigit < 30) {
                scoreCss = 'score scoreErr';
                // scoreTt = "Passwortstärke: " + scoreAsDigit + " Punkte (sehr unsicher!)";
            } else if (scoreAsDigit < 60){
                scoreCss = 'score scoreWarn';
                // scoreTt = "Passwortstärke: " + scoreAsDigit + " Punkte (unsicher)";
            } else {
                scoreCss = 'score scoreOk';
                // scoreTt = "Passwortstärke: " + scoreAsDigit + " Punkte (sicher)";
            }
        }

        const dateString = dateToString(item.updatedAt);

        return (
            <div key={item.id} id={item.id} className={"keysafe-cards mdl-cell mdl-grid mdl-grid--no-spacing"}>
                <div className="mdl-card mdl-shadow--2dp">
                    <div className="mdl-card__title">
                        {title}
                    </div>
                    <div className="mdl-card__actions mdl-card--border">

                        {item.userName &&
                            <ul className="keysafe-list-no-dots">
                                <li onClick={self.onCopyUserNameClicked}>
                                    <a className="mdl-button mdl-js-button">{item.userName}</a>
                                </li>
                                <li onClick={self.onCopyPasswordClicked}>
                                    <a className="mdl-button mdl-js-button">{item.password}</a>
                                </li>
                            </ul>
                        }

                        {!item.userName &&
                            <ul className="keysafe-list-no-dots">
                                <li onClick={self.onCopyPasswordClicked} className={'no-username'}>
                                    <a className="mdl-button mdl-js-button">{item.password}</a>
                                </li>
                            </ul>
                        }

                        { showPasswordScore &&
                        <div>
                            <span title={ttPwStrength} id={"score-tt-" + item.id } className={scoreCss}> { item.score } </span>
                        </div>
                        }
                        { showLastChange &&
                        <div>
                            <span title={ttPwChangeDate} id={"changed-tt-" + item.id }  className={"lastChange"}> { dateString } </span>
                        </div>
                        }

                    </div>
                    <div className="mdl-card__menu">

                        <button id={"keysafe-password-" + item.id} className="mdl-button mdl-js-button mdl-button--icon">
                            <i className="material-icons">more_vert</i>
                        </button>

                        <ul className="mdl-menu mdl-menu--bottom-right mdl-js-menu" htmlFor={"keysafe-password-" + item.id}>
                            <li className="mdl-menu__item" onClick={self.onEditClicked}>
                                {I18n.passwordCard_Menu_Edit()}
                            </li>
                            <li className="mdl-menu__item" onClick={self.onMoveClicked}>
                                {I18n.passwordCard_Menu_Move()}
                            </li>
                            <li className="mdl-menu__item mdl-menu__item--full-bleed-divider mdl-menu__item_red" onClick={self.onDeleteClicked}>
                                {I18n.passwordCard_Menu_Remove()}
                            </li>
                            <li className="mdl-menu__item" onClick={self.onPWStrengthClicked}>
                                {I18n.passwordCard_Menu_PwStrength()}
                            </li>
                        </ul>

                    </div>
                </div>
            </div>
        );
    }
}

export default UIPasswordListItem;
