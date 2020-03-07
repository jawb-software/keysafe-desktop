import React from 'react';
import './UISelect.css';

class UISelect extends React.Component {

    constructor(props){
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        // console.log('componentDidUpdate');
        let el = document.querySelector('#' + this.props.id);
        if(!el.MaterialSnackbar){
            componentHandler.upgradeElement(el);
        }
        componentHandler.upgradeDom();
    }

    onChange(e){
        console.log(e.target.value);
        this.props.onChange(e);
    }

    render() {

        const options = this.props.items.map(item =>{
            return (<option key={item.value} value={item.value}>{item.key}</option>);
        });

        return (
            <div className={"UISelect"}>
                <div id={this.props.id} className="mdl-selectfield mdl-js-selectfield  mdl-selectfield--floating-label">
                    <select value={this.props.initValue} onChange={this.onChange} id={this.props.id} className="mdl-selectfield__select">
                        {options}
                    </select>
                    <label className="mdl-selectfield__label mdl-textfield__label" htmlFor={this.props.id}>{this.props.label}</label>
                </div>
            </div>
        );
    }
}

export default UISelect;
