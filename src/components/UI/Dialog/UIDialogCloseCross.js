import React from 'react';

class UIDialogCloseCross extends React.Component {

    render() {
        return (
            <svg width="12" height="12" viewport="0 0 12 12" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <line x1="1" y1="11"
                      x2="11" y2="1"
                      stroke="white"
                      strokeWidth="1"/>
                <line x1="1" y1="1"
                      x2="11" y2="11"
                      stroke="white"
                      strokeWidth="1"/>
            </svg>
        );
    }
}

export default UIDialogCloseCross;
