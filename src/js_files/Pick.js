import React from 'react';
import '../css_files/App.css';
import Button from 'react-bootstrap/Button'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import  {Link} from 'react-router-dom'



class Pick extends React.Component {

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Pick an algorithim
          </p>
          <ButtonToolbar>
            <Link to="/DecisionTree"><Button variant="primary">Decision Tree</Button></Link>
            <Link to="/KNearestNeighbors"><Button variant="primary">K-Nearest-Neighbors</Button></Link>
            <Link to="/Clustering"><Button variant="primary">Clustering</Button></Link>
          </ButtonToolbar>
        </header>
      </div>
    );
  }
}


export default Pick;
