/* eslint-disable */

import React from "react";
import { showBackToAlgorithimPage } from "../Utility";
import { Navbar } from "react-bootstrap";
import "../css_files/App.css";

class Anomaly extends React.Component {
  constructor(props) {
    super(props);
  }

  showAnomalyNavBar() {
    return (
      <Navbar fixed="top" bg="dark" variant="dark">
        {showBackToAlgorithimPage()}
      </Navbar>
    );
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          {this.showAnomalyNavBar()}
          Anomaly
        </div>
      </div>
    );
  }
}

export default Anomaly;
