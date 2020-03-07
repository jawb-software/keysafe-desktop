import React from 'react';
import './UIPasswordListIsEmpty.css';
import I18n from "../../Basic/I18n/i18n";

class UIPasswordListIsEmptyFiltered extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const info = I18n.passwordList_NoPasswordsFiltered(this.props.filter);
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

export default UIPasswordListIsEmptyFiltered;
