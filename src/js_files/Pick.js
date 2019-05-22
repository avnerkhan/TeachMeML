import React from 'react';
import '../css_files/Pick.css';
import Button from 'react-bootstrap/Button'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import DTree from './DTree'



class Pick extends React.Component {


  constructor(props) {
    super(props)
    this.PageEnums = {
      DTREE: 0
    }

  }

  goToAlgorithimPage(id) {
    console.log(id)
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Pick an algorithim
          </p>
          <ButtonToolbar>
            <Button onClick={(e) => this.goToAlgorithimPage(this.PageEnums.DTREE, e)} variant="primary">Decision Tree</Button>
          </ButtonToolbar>
        </header>
      </div>
    );
  }
}


export default Pick;
