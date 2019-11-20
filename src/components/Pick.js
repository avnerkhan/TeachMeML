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
  showOverallNavBar() {
    return (
      <Navbar fixed="top" bg="dark" variant="dark">
        <Nav.Link>
          <Link to="/Intro">What is Machine Learning/Data Mining?</Link>
        </Nav.Link>
        <Nav.Link>{this.showDropdown("Play")}</Nav.Link>
        <Nav.Link>{this.showDropdown("Edit")}</Nav.Link>
        <Nav.Link>{this.showDropdown("Learn")}</Nav.Link>
      </Navbar>
    );
  }

  showDropdown(type) {
    return (
      <Dropdown>
        <Dropdown.Toggle>{type}</Dropdown.Toggle>
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

  render() {
    return (
      <div className="App">
        <header className="App-header-low background-image">
          {this.showOverallNavBar()}
          <h1>Teach Me ML</h1>
          <p>
            Teach Me ML is a webiste that dedicates itself to teaching people
            machine learning in the easiest, most fun way possible
          </p>
        </header>
      </div>
    );
  }
}

export default Pick;
