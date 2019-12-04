/* eslint-disable */

import React from "react";
import { showBasicBackNavBar } from "../../Utility";
import "../../css_files/App.css";

class AnomalyLearn extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          {showBasicBackNavBar()}
          Anomaly Learn
        </div>
      </div>
    );
  }
}

export default AnomalyLearn;
