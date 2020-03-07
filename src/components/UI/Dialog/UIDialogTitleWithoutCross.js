import React from 'react';
import {getCurrentTheme} from "../../Basic/utils";
import UIClear from "../Basic/UIClear";

class UIDialogTitleWithoutCross extends React.Component {

    render() {

        const theme = getCurrentTheme();

        const style = {
            backgroundColor : theme.COLOR_DIALOG_TITLE_BACKGROUND,
            color : theme.COLOR_DIALOG_TITLE_TEXT,
        };

        const title     = this.props.title;
        const subtitle  = this.props.subtitle;

        if(subtitle){
            return (
                <div>
                    <div className="title-subtitle" style={style}>
                        <span className={'dialog-title'}> {title} </span>
                        <span className={'dialog-subtitle'}> {subtitle} </span>
                    </div>
                    <UIClear/>
                </div>
            );
        }

        return (
            <div>
                <div className="title" style={style}>
                    <span className={'dialog-title'}> {title} </span>
                </div>
                <UIClear/>
            </div>
        );
    }
}

export default UIDialogTitleWithoutCross;
