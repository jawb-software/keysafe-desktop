import React from 'react';
import './UIPasswordList.css';
import {
    USER_ACTION_CLOSE_CATEGORY_LIST,
    USER_ACTION_NEW_PASSWORD,
    VIEW_STATE_LOADING_PASSWORDS,
    VIEW_STATE_LOADING_PASSWORDS_ERROR
} from "../../Basic/consts";
import UILoadingView from "../Loading/UILoadingView";
import UIPasswordListIsEmpty from "./UIPasswordListIsEmpty";
import UIPasswordListIsEmptyFiltered from "./UIPasswordListIsEmptyFiltered";
import UIPasswordListItem from "./UIPasswordListItem";
import I18n from "../../Basic/I18n/i18n";
import {getCurrentTheme} from "../../Basic/utils";

class UIPasswordList extends React.Component {

    constructor(props) {
        super(props);
        this.onUserAction = this.onUserAction.bind(this);
        this.onOverlayClick = this.onOverlayClick.bind(this);
        this.onAddPasswordCardClick = this.onAddPasswordCardClick.bind(this);
        this.state = {
            loadingState: this.props.loadingState,
            filter: this.props.filter,
            passwords: this.props.passwords,
            profile: this.props.profile
        }
    }

    // is invoked after a component is instantiated as well as before it is re-rendered.
    // It can return an object to update state, or null to indicate
    // that the new props do not require any state updates.
    static getDerivedStateFromProps(props, state) {
        return props;
    }
    //
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return true;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        componentHandler.upgradeDom();
    }

    componentDidMount() {
        const cards = document.querySelector('.mdl-menu');
        if(cards){
            for(let i = 0; i < cards.length; i++){
                console.log(cards[i].id);
                componentHandler.upgradeElement(cards[i]);
            }
        }
        componentHandler.upgradeDom();
    }

    onOverlayClick(){
        this.props.onUserAction(USER_ACTION_CLOSE_CATEGORY_LIST);
    }

    onAddPasswordCardClick(){
        this.props.onUserAction(USER_ACTION_NEW_PASSWORD);
    }

    onUserAction(action, id){
        this.props.onUserAction(action, id);
    }

    render() {

        const items        = this.state.passwords;
        const loadingState = this.state.loadingState;

        const theme        = getCurrentTheme();
        const accentClr    = theme.COLOR_ACCENT;

        const self     = this;
        const profile  = this.state.profile;
        const filter   = this.state.filter;

        const addPwCardStyle    = {border : '1px dashed ' + accentClr};
        const addCard           = filter ? null :
            (
                <div onClick={this.onAddPasswordCardClick} className={"keysafe-cards mdl-cell mdl-grid mdl-grid--no-spacing"}>
                    <div className="add-password-card mdl-card" style={addPwCardStyle}>
                        <i className="material-icons" style={{color:accentClr}}>add</i>
                        <span style={{color:accentClr}}>{ I18n.passwordList_NewPasswordItem() }</span>
                    </div>
                </div>
            );

        if (loadingState === VIEW_STATE_LOADING_PASSWORDS) {
            return (<UILoadingView/>);
        } else if (loadingState === VIEW_STATE_LOADING_PASSWORDS_ERROR) {
            return (<div>Error while loading passwords</div>); // TODO: Gescheite FehlerView
        } else if (!items || items.length === 0) {

            return (
                <main className="UIPasswordList">
                    <div className="mdl-grid keysafe-content">
                        <UIPasswordListIsEmpty onUserAction={this.props.onUserAction}/>
                        {addCard}
                    </div>
                </main>
            );

        }

        const filtered = this.filter(filter, items);

        if (!filtered || filtered.length === 0) {
            return (<UIPasswordListIsEmptyFiltered filter={filter}/>);
        }


        let divs = filtered.map(item => {
            return <UIPasswordListItem key={item.id} filter={filter} passwordItem={item} profile={profile} onUserAction={self.onUserAction}/>;
        });

        return (
            <main className="UIPasswordList">
                <div className="mdl-grid keysafe-content">
                    {divs}
                    {addCard}
                </div>
            </main>
        );
    }

    filter(filter, items){

        if(filter){
            const filtered = items.filter(item => item.name.toLocaleLowerCase().indexOf(filter) >= 0);
            filtered.sort((a, b) => {
                if(a.name.toLocaleLowerCase().indexOf(filter) === 0) {
                    if(b.name.toLocaleLowerCase().indexOf(filter) === 0){
                        return  a > b;
                    }
                    return -1;
                }
                return  1;
            });
            return filtered;
        }

        return items;

    }

}

export default UIPasswordList;
