import React from 'react';
import {getCurrentTheme} from "../../../Basic/utils";

class UISelectorTriangle extends React.Component {

    render() {

        const color = getCurrentTheme().COLOR_TOOLBAR_SELECTOR_TRIANGLE;

        return (
          <svg width="10" height="7" viewBox="-0.019531 -52.792969 30.039062 25.195312">
              <path fill={color} d="M29.941406 -52.500000C29.785156 -52.656250 29.589844 -52.753906 29.355469 -52.792969L0.644531 -52.792969C0.410156 -52.753906 0.214844 -52.656250 0.058594 -52.500000C-0.019531 -52.265625 0.000000 -52.050781 0.117188 -51.855469L14.472656 -27.890625C14.628906 -27.734375 14.804688 -27.636719 15.000000 -27.597656C15.234375 -27.636719 15.410156 -27.734375 15.527344 -27.890625L29.882812 -51.855469C30.000000 -52.089844 30.019531 -52.304688 29.941406 -52.500000ZM29.941406 -52.500000"></path>
          </svg>
      );
  }
}
export default UISelectorTriangle;
