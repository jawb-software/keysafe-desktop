import React from 'react';
import {getCurrentTheme} from "../../Basic/utils";
import UIClear from "../Basic/UIClear";
import UIDialogCloseCross from "./UIDialogCloseCross";

class UIDialogTitleWithClose extends React.Component {

    render() {
        const theme = getCurrentTheme();
        const style = {
            backgroundColor : theme.COLOR_DIALOG_TITLE_BACKGROUND,
            color : theme.COLOR_DIALOG_TITLE_TEXT,
        };

        return (
            <div>
                <div className="title" style={style}>
                    <span className={'dialog-title'}> {this.props.title} </span>

                    <div className="Close-Cross" onClick={this.props.onCloseClick}>
                        <UIDialogCloseCross/>
                    </div>
                </div>
                <UIClear/>
            </div>
        );
    }
}

export default UIDialogTitleWithClose;
