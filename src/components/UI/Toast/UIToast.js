import React from 'react';
import './UIToast.css';

class UIToast extends React.Component {

    constructor(props) {
        super(props);
    }

    showToastInfo(msg, isError){

        let toastContainer = document.querySelector('#toast-info');

        if(!toastContainer.MaterialSnackbar){
            componentHandler.upgradeElement(toastContainer);

            if(!toastContainer.MaterialSnackbar){
                return;
            }
        }

        let actionBtn = document.querySelector('#toast-action-btn');
        if(actionBtn){
            actionBtn.style.display = "none";
        }

        if(isError){
            toastContainer.style.backgroundColor = '#ff2a14';
        } else {
            toastContainer.style.backgroundColor = '#1b7122';
        }

        let data = {
            message: msg,
            timeout: isError ? 3500 : 2000
        };
        toastContainer.MaterialSnackbar.showSnackbar(data);

    }

    render() {

        return (
            <div>
                <div id="toast-info" className="mdl-js-snackbar mdl-snackbar">
                    <div className="mdl-snackbar__text"/>
                    <button id="toast-action-btn" className="mdl-snackbar__action" type="button"/>
                </div>
            </div>
        );
    }
}

export default UIToast;
