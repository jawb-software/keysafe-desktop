import React from 'react';
import './UIPasswordListIsEmpty.css';
import {USER_ACTION_NEW_PASSWORD} from "../../Basic/consts";
import I18n from "../../Basic/I18n/i18n";

class UIPasswordListIsEmpty extends React.Component {

    constructor(props) {
        super(props);
        this.onButtonClick = this.onButtonClick.bind(this);
    }

    onButtonClick(){
        this.props.onUserAction(USER_ACTION_NEW_PASSWORD);
    }

    render() {

        const info = I18n.passwordList_NoPasswords();

        return (
            <div className="keysafe-Outer-Container">
                <div className="keysafe-Middle-Container">
                    <div className="keysafe-Inner-Container">
                        <span className="Info-Msg"> {info} </span>
                    </div>
                </div>
            </div>
        );
    }
}

export default UIPasswordListIsEmpty;
