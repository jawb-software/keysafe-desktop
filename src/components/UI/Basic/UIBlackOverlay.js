import React from 'react';
import './UIBlackOverlay.css';
import {USER_ACTION_CLOSE_CATEGORY_LIST} from "../../Basic/consts";

class UIBlackOverlay extends React.Component {

    constructor(props){
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    componentDidMount() {
    }

    onClick(){
        this.props.onUserAction(USER_ACTION_CLOSE_CATEGORY_LIST);
    }

    render() {

        return (
            <div className={"UIBlackOverlay"} onClick={this.onClick}>

            </div>
        );
    }
}

export default UIBlackOverlay;
