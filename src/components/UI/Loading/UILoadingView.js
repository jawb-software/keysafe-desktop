import React from 'react';
import './UILoadingView.css';
import I18n from "../../Basic/I18n/i18n";

class UILoadingView extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // Initialisiere Progress Bar manuell. (Bug?)
        componentHandler.upgradeDom();
    }

    render() {

        const label = this.props.label ? this.props.label : I18n.session_LoadingData();

        return (

            <div className="UILoading-Outer-Container">
                <div className="UILoading-Middle-Container">
                    <div className="UILoading-Inner-Container">
                        <div className="mdl-progress-row">
                            <div className="mdl-progress mdl-js-progress mdl-progress__indeterminate"/>
                        </div>
                        <span className="UILoading-Message"> {label} </span>
                    </div>
                </div>
            </div>
        );
    }
}

export default UILoadingView;
