import React from 'react';

import '../UIBaseDialog.css';
import './UIQuestionDialog.css';

import UIClear from "../../Basic/UIClear";
import I18n from "../../../Basic/I18n/i18n";
import {getCurrentTheme} from "../../../Basic/utils";

class UIQuestionDialog extends React.Component {

    constructor(props) {
        super(props);
        this.handleOKClick = this.handleOKClick.bind(this);
        this.handleCancelClick  = this.handleCancelClick.bind(this);
    }

    componentDidMount() {
    }

    handleOKClick(){
        this.props.onUserAction(this.props.okEvent.action, this.props.okEvent.value);
    }

    handleCancelClick(){
        this.props.onUserAction(this.props.cancelEvent.action, this.props.cancelEvent.value);
    }

    _createTextDOM(){
        const parts = this.props.question.split('\n');

        return parts.map((part, i)=> {
            return <span key={ 'question-part-'  + i }>{part}</span>;
        });
    }

    render() {

        const textTitle    = this.props.title;
        const textQuestion = this._createTextDOM();
        const textCancel   = I18n.basic_Cancel();
        const textSave     = I18n.basic_Yes();

        const theme = getCurrentTheme();
        const style = {
            backgroundColor : theme.COLOR_DIALOG_WARNING_TITLE_BACKGROUND,
            color : theme.COLOR_DIALOG_WARNING_TITLE_TEXT,
        };
        return (

            <div className="UIBaseDialog-Backdrop">
                <div className="UIBaseDialog-Content UIQuestionDialog">

                    <div className="title UIQuestionDialog-Critical" style={style}>
                        <span className={'dialog-title-icon'}>&#9888;</span>
                        <span className={'dialog-title'}> { textTitle } </span>
                    </div>
                    <UIClear/>

                    <div className="question-container">
                        {textQuestion}
                        <UIClear/>
                    </div>

                    <div className="footer">
                        <button onClick={this.handleCancelClick}> {textCancel} </button>
                        <button onClick={this.handleOKClick}> {textSave} </button>
                        <UIClear/>
                    </div>

                </div>

            </div>
        );
    }
}

export default UIQuestionDialog;
