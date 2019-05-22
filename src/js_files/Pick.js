import React from 'react';
import '../css_files/Pick.css';
import Button from 'react-bootstrap/Button'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'



class Pick extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Pick an algorithim
          </p>
          <ButtonToolbar>
            <Button variant="primary">Decision Tree</Button>
          </ButtonToolbar>
        </header>
      </div>
    );
  }
}


export default Pick;
