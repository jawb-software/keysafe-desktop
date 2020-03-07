import React from 'react';

import '../UIBaseDialog.css';
import './UIDEVDbViewDialog.css';

const {app, remote} = require('electron');

import UIClear from "../../Basic/UIClear";
import UIDialogCloseCross from "../UIDialogCloseCross";
import {DEV_USER_ACTION_HIDE_DB} from "../../../Basic/consts";
import {arrayIsEmpty, getCurrentTheme} from "../../../Basic/utils";
import CategoriesDB from "../../../DataBase/Repositories/CategoriesDB";
import ProfileDB from "../../../DataBase/Repositories/ProfileDB";
import PasswordsDB from "../../../DataBase/Repositories/PasswordsDB";

const dateFormat = require('date-format');

class UIDEVDbViewDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            items: [],
            database: ''
        };
        this.categories = new CategoriesDB();
        this.prefs = new ProfileDB();
        this.passwords = new PasswordsDB();
        this.dataBases = ['profiles', 'categories', 'passwords'];
        this.handleCloseClick = this.handleCloseClick.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
    }

    async initDBs() {

        if (this.dbsReady) {
            return this.loginState;
        }

        await this.categories.init();
        await this.prefs.init();
        await this.passwords.init();

        this.dbsReady = true;
    }

    componentDidMount() {
        const database = this.state.database;
        this._loadData(database);
    }

    handleCloseClick() {
        this.props.onUserAction(DEV_USER_ACTION_HIDE_DB);
    }

    handleSelect(e){
        const database = e.target.value;
        this._loadData(database);
    }

    _loadData(databaseName){
        if(databaseName === 'categories'){
            this._handleLoadCategories();
        } else if(databaseName === 'passwords'){
            this._handleLoadPasswords();
        } else if(databaseName === 'profiles'){
            this._handleLoadPrefs();
        } else {
            //alert("Unknown DB: " + databaseName);
            this.setState({
                items: null,
                database: '-1'
            })
        }
    }

    _handleLoadPasswords(){

        const self = this;

        this.loadPasswords()
            .then(items => {
                self.setState({
                    items: items,
                    database: 'passwords'
                });
            })
            .catch(err => {
                alert(err);
            });
    }

    _handleLoadPrefs(){

        const self = this;

        this.loadPrefs()
            .then(items => {
                self.setState({
                    items: items,
                    database: 'profiles'
                });
            })
            .catch(err => {
                alert(err);
            });
    }

    _handleLoadCategories(){

        const self = this;

        this.loadCategories()
            .then(items => {
                self.setState({
                    items: items,
                    database: 'categories'
                });
            })
            .catch(err => {
                alert(err);
            });
    }

    async loadCategories() {
        if (!this.dbsReady) {
            await this.initDBs();
        }
        return await this.categories.getAll();
    }

    async loadPrefs() {
        if (!this.dbsReady) {
            await this.initDBs();
        }
        return await this.prefs.getAll();
    }

    async loadPasswords() {
        if (!this.dbsReady) {
            await this.initDBs();
        }
        return await this.passwords.getAll();
    }

    _getOrderForColumnName(name){
        const orderMap = {
            _id : 1,
            name: 2,
            username: 3,
            password: 4
        };

        let order = orderMap[name.toLowerCase()];
        if(!order){
           return 100;
        }
        return order;
    }

    createJsonRow(item){
        return <tr key={item._id}><td><pre className={'table-row'}>{JSON.stringify(item,null,2)}</pre></td></tr>;
    }

    createTable() {

        if(this.state.database === '-1'){
            const userDataPath = (app || remote.app).getPath('userData');
            return (
                <div className="keysafe-Outer-Container">
                    <div className="keysafe-Middle-Container">
                        <pre className={'Db-Info'}>
                            NEDB:           https://github.com/louischatriot/nedb<br />
                            Database path:  {userDataPath}
                        </pre>
                    </div>
                </div>
            );
        }

        const items = this.state.items;
        const self  = this;

        if (arrayIsEmpty(items)) {
            return (
                <div className="keysafe-Outer-Container">
                    <div className="keysafe-Middle-Container">
                        <pre className={'Db-Info'}>
                           No Data
                        </pre>
                    </div>
                </div>
            );
        }

        let set = new Set();

        items.forEach(item => {
            const props = Object.getOwnPropertyNames(item);
            props.forEach(p => set.add(p));
        });

        const props = Array.from(set);
        props.sort((a, b) => {
            const orderA = self._getOrderForColumnName(a);
            const orderB = self._getOrderForColumnName(b);
            return orderA - orderB;
        });

        const rows = items.map(item => {
            return self.createJsonRow(item);
        });

        return (
            <table className="mdl-data-table mdl-js-data-table mdl-shadow--2dp">

                <tbody>
                    {rows}
                </tbody>
            </table>
        )

    }

    render() {

        const dom = this.createTable();

        const select = this.dataBases.map(item =>{
            return <option key={item}>{item}</option>
        });
        const theme = getCurrentTheme();
        const style = {
            backgroundColor : theme.COLOR_DIALOG_TITLE_BACKGROUND,
            color : theme.COLOR_DIALOG_TITLE_TEXT,
        };

        return (

            <div className="UIBaseDialog-Backdrop">
                <div className="UIBaseDialog-Content UIDEVDbViewDialog">

                    <div className="title" style={style}>
                        <select onChange={this.handleSelect}>
                            <option key={"-1"}>-- Select DB --</option>
                            {select}
                        </select>

                        <div className="Close-Cross" onClick={this.handleCloseClick}>
                            <UIDialogCloseCross/>
                        </div>
                        <UIClear/>
                    </div>
                    <UIClear/>

                    <div className="database-container">
                        {dom}
                    </div>
                </div>

            </div>
        );
    }
}

export default UIDEVDbViewDialog;
