import React from 'react';
import './UISearchView.css';
import I18n from "../../../Basic/I18n/i18n";
import {getCurrentTheme} from "../../../Basic/utils";

class UISearchView extends React.Component {

    constructor(props) {
        super(props);
        this.handleInput = this.handleInput.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onSearchKeyDown = this.onSearchKeyDown.bind(this);
        this.onBlur = this.onBlur.bind(this);
        const theme = getCurrentTheme();
        this.state = {
            input : '',
            background: theme.COLOR_TOOLBAR_SEARCH_INPUT_BACKGROUND
        };
    }

    componentDidMount() {
    }

    onSearchKeyDown(event){
        const self = this;
        if (event.key === 'Escape' || event.keyCode === 27) {
            self.handleReset();
        }
    }

    onFocus() {
        this.setState({ background: '#ffffff' });
    }

    onBlur() {

        if(!this.state.input){
            const theme = getCurrentTheme();
            this.setState({ background: theme.COLOR_TOOLBAR_SEARCH_INPUT_BACKGROUND });
        }
    }

    handleReset() {
        this.setState({ input: '' });
        this.props.onPasswordFilterInputChange('');
    }

    handleInput(e) {
        this.setState({input: e.target.value})
        this.props.onPasswordFilterInputChange(e.target.value.toLocaleLowerCase());
    }

    render() {

        if(!this.props.hasPasswords){
            return null;
        }

        const placeholder = I18n.searchView_Search();

        return (
            <div className="UISearchView">
                <div className="search-container" style={{backgroundColor: this.state.background}}>
                    <input onKeyDown={this.onSearchKeyDown} onFocus={this.onFocus} onBlur={this.onBlur} value={this.state.input} type="text" placeholder={placeholder} onChange={this.handleInput}/>
                    {this.state.input
                    ? <i id="reset-input" onClick={this.handleReset} className="material-icons">clear</i>
                    : <i className="material-icons">search</i>}
                </div>
            </div>
        );
    };
}

export default UISearchView;
