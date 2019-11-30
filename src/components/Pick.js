/*
  This is the page that is presented on the startup of the application, and has links to pretty much all other pages
*/

import React from "react";
import "../css_files/App.css";
import { Navbar, Nav, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

class Pick extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      algorithims: [
        "Decision Tree",
        "K-Nearest Neighbors",
        "Clustering",
        "Association"
      ]
    };
  }

  // Shows top nav bar with links to "What is" page, and other dropdowns
  showOverallNavBar() {
    return (
      <Navbar fixed="top" bg="dark" variant="dark">
        <Nav.Link>
          <Link to="/Intro" style={{ color: "white", fontSize: "20px" }}>
            What is Machine Learning/Data Mining?
          </Link>
        </Nav.Link>
        <Nav.Link>{this.showDropdown("Play")}</Nav.Link>
        <Nav.Link>{this.showDropdown("Edit")}</Nav.Link>
        <Nav.Link>{this.showDropdown("Learn")}</Nav.Link>
      </Navbar>
    );
  }

  // Shows each dropdown component, with link to corresponding page
  showDropdown(type) {
    return (
      <Dropdown>
        <Dropdown.Toggle variant="secondary">{type}</Dropdown.Toggle>
        <Dropdown.Menu>
          {this.state.algorithims.map(algo => {
            return !(algo === "Clustering" && type === "Edit") ? (
              <Dropdown.Item
                onClick={() =>
                  this.props.history.push("/" + algo.replace(/\s+/g, "") + type)
                }
              >
                {algo}
              </Dropdown.Item>
            ) : null;
          })}
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  // Top level of page
  render() {
    return (
      <div className="App">
        <header className="App-header-low background-image">
          {this.showOverallNavBar()}
          <h1 className="line-1 anim-typewriter-2">Teach Me ML</h1>
          <p className="line-2 anim-typewriter">
            {" "}
            Teach Me ML is a webiste that dedicates itself to teaching{" "}
          </p>
          <p className="line-2 anim-typewriter">
            {" "}
            people machine learning in the easiest, most fun way possible{" "}
          </p>
        </header>
      </div>
    );
  }
}

export default Pick;
