import React from 'react';
import './UICheckbox.css';

class UICheckbox extends React.Component {

    render() {

        const { label, onChange, defaultChecked  } = this.props;

        return (
           <div className={"UICheckbox"}>
               <label htmlFor={this.props.id}>
                   <input type="checkbox" id={this.props.id} onChange={onChange} checked={defaultChecked}/>
                   {label && <span>{label}</span>}
               </label>
           </div>
        );
    }
}

export default UICheckbox;
