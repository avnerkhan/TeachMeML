/* eslint-disable */

import React from "react";
import { showBasicBackNavBar } from "../../Utility";
import "../../css_files/App.css";

class RegressionLearn extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">Regression Learn</div>
        {showBasicBackNavBar()}
      </div>
    );
  }
}

export default RegressionLearn;
