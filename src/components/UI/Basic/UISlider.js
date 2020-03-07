import React from 'react';
import './UISlider.css';
import UIClear from "./UIClear";

class UISlider extends React.Component {

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        // console.log('componentDidMount');
        let el = document.querySelector('#' + this.props.id);
        if(!el.MaterialSlider){
            componentHandler.upgradeElement(el);
        }
        componentHandler.upgradeDom();

        el.MaterialSlider.change(this.props.defaultValue);

        let span = document.querySelector('#value-' + this.props.id);
        span.innerHTML = this.props.defaultValue;
    }

    onChange(e){

        let value = e.target.value;

        let span = document.querySelector('#value-' + this.props.id);
        span.innerHTML = value;

        this.props.onChange(e);
    }

    render() {

        const { label  } = this.props;

        return (
            <div className="UISlider">

                <span className={"label"}>{label}</span>
                <span className={"value"} id={"value-" + this.props.id}>{label}</span>

                <div className={"clear"}></div>

                <input onChange={this.onChange} id={this.props.id} className="mdl-slider mdl-js-slider" type="range" min={this.props.min} max={this.props.max}/>
            </div>
        );
    }
}

export default UISlider;
