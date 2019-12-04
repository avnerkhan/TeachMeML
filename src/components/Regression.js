/* eslint-disable */

import React from "react";
import { showBackToAlgorithimPage } from "../Utility";
import { Navbar } from "react-bootstrap";
import "../css_files/App.css";

class Regression extends React.Component {
  constructor(props) {
    super(props);
  }

  showRegressionNavBar() {
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
          {this.showRegressionNavBar()}
          Regression
        </div>
      </div>
    );
  }
}

export default Regression;
