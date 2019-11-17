import React from "react";
import {
  addLabelClass,
  deleteLabelClass,
  changeLabelColor
} from "../../actions/KNNActions";
import { connect } from "react-redux";

class EditKNN extends React.Component {
  render() {
    return (
      <div>
        <h1>Current Labels</h1>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  labels: state.KNN.labels
});

const mapDispatchToProps = {
  addLabelClass,
  deleteLabelClass,
  changeLabelColor
};

export default connect(mapStateToProps, mapDispatchToProps)(EditKNN);
