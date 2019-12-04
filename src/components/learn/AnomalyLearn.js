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
        <div className="App-header">Anomaly Learn</div>
        {showBasicBackNavBar()}
      </div>
    );
  }
}

export default AnomalyLearn;
