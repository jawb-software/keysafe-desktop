import React from 'react';
import { openLicense} from "../../../Basic/utils";

class UILicenseView extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div>

                <pre>
                    keysafe - the password manager<br/>
                    Copyright (C) since 2019  jawb software<br/><br/>

                    This program is free software: you can redistribute it and/or modify
                    it under the terms of the GNU General Public License as published by
                    the Free Software Foundation, either version 3 of the License, or
                    (at your option) any later version.<br/><br/>

                    This program is distributed in the hope that it will be useful,
                    but WITHOUT ANY WARRANTY; without even the implied warranty of
                    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
                    GNU General Public License for more details.<br/><br/>

                    You should have received a copy of the GNU General Public License
                    along with this program.  If not, see https://www.gnu.org/licenses.
                </pre>

                <button style={{float:'left'}} className="BasicButton" onClick={openLicense}>{'GNU GPLv3 Full Version'}</button>

                <br/>
                <br/>
                <br/>

            </div>
        );
    }
}

export default UILicenseView;
