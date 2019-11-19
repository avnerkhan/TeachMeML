/* eslint-disable */
import React from "react";
import "../../css_files/App.css";
import "react-table/react-table.css";
import { connect } from "react-redux";
import { displayInfoButton } from "../../Utility";
import {
  addFeatureClass,
  addFeature,
  deleteFeatureClass,
  deleteFeature,
  addLabelClass,
  deleteLabelClass,
  changeLabelName,
  editFeatureName
} from "../../actions/DTreeActions";
import Trash from "../../Images/trash.png";
import Add from "../../Images/add.png";
import { Table, OverlayTrigger, Tooltip, Image } from "react-bootstrap";

class EditDTree extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const features = this.props.featureClasses
      .keySeq()
      .toArray()
      .sort();

    return (
      <div className="App">
        <div className="App-header-low">
          <Table size="sm">
            {displayInfoButton(
              "Table Editing Page",
              "This is the page where you can edit the configuration of your data. For example, you can add another feature, delete it, or add/delete another class label to an existing feature",
              "bottom"
            )}
            <thead>
              <tr>
                <th>Current Features And Labels</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => {
                return (
                  <tr>
                    <td>
                      <input
                        type="text"
                        value={feature}
                        onChange={e =>
                          this.props.editFeatureName(feature, e.target.value)
                        }
                      />
                    </td>
                    {this.props.featureClasses
                      .get(feature)
                      .map(featureClass => {
                        return (
                          <OverlayTrigger
                            trigger="hover"
                            placement="bottom"
                            overlay={
                              <Tooltip>{"Delete " + featureClass}</Tooltip>
                            }
                          >
                            <td
                              onClick={() =>
                                this.props.deleteFeatureClass(
                                  feature,
                                  featureClass
                                )
                              }
                            >
                              {featureClass}
                            </td>
                          </OverlayTrigger>
                        );
                      })}
                    <td>
                      <input type="text" ref={"classInput" + index} />
                    </td>
                    <td
                      onClick={() =>
                        this.props.addFeatureClass(
                          feature,
                          this.refs["classInput" + index].value
                        )
                      }
                    >
                      <Image src={Add} style={{ width: 40 }} />
                    </td>
                    <td onClick={() => this.props.deleteFeature(feature)}>
                      <Image src={Trash} style={{ width: 40 }} />
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td>Add</td>
                <td>
                  <input type="text" ref="featureInput" />
                </td>
                <tr>
                  <td
                    onClick={() =>
                      this.props.addFeature(this.refs["featureInput"].value)
                    }
                  >
                    <Image src={Add} style={{ width: 40 }} />
                  </td>
                </tr>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  featureClasses: state.DTree.featureClasses,
  label: state.DTree.label,
  labelClasses: state.DTree.labelClasses
});

const mapDispatchToProps = {
  addFeature,
  addFeatureClass,
  deleteFeature,
  deleteFeatureClass,
  addLabelClass,
  deleteLabelClass,
  changeLabelName,
  editFeatureName
};

export default connect(mapStateToProps, mapDispatchToProps)(EditDTree);
