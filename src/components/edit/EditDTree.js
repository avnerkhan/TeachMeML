/* eslint-disable */
import React from "react";
import "../../css_files/App.css";
import "react-table/react-table.css";
import { connect } from "react-redux";
import { displayInfoButton, showBasicBackNavBar } from "../../Utility";
import {
  addFeatureClass,
  addFeature,
  deleteFeatureClass,
  deleteFeature,
  addLabelClass,
  deleteLabelClass,
  changeLabelName,
  editFeatureName,
  toggleContinousAttribute,
  setContinousAttributeRange
} from "../../actions/DTreeActions";
import Trash from "../../Images/trash.png";
import Add from "../../Images/add.png";
import { Table, OverlayTrigger, Tooltip, Image } from "react-bootstrap";

class EditDTree extends React.Component {
  constructor(props) {
    super(props);
  }

  canToggle(featureToCheck) {
    debugger;
    let isToggledCount = 0;
    for (const feature of this.props.continousClasses.keySeq().toArray()) {
      isToggledCount += this.props.continousClasses.get(feature).get(0) ? 1 : 0;
    }
    return (
      isToggledCount === 0 ||
      this.props.continousClasses.get(featureToCheck).get(0)
    );
  }

  render() {
    const features = this.props.featureClasses
      .keySeq()
      .toArray()
      .sort();

    return (
      <div className="App">
        <div className="App-header-low">
          {showBasicBackNavBar()}
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
                const isCategorical = !this.props.continousClasses
                  .get(feature)
                  .get(0);
                const bottomRange = this.props.continousClasses
                  .get(feature)
                  .get(1);
                const topRange = this.props.continousClasses
                  .get(feature)
                  .get(2);
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
                    {isCategorical ? (
                      this.props.featureClasses
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
                        })
                    ) : (
                      <div>
                        <input
                          value={bottomRange}
                          onChange={e =>
                            this.props.setContinousAttributeRange(
                              feature,
                              e.target.value,
                              topRange
                            )
                          }
                        />
                        <input
                          value={topRange}
                          onChange={e =>
                            this.props.setContinousAttributeRange(
                              feature,
                              bottomRange,
                              e.target.value
                            )
                          }
                        />
                      </div>
                    )}
                    {isCategorical ? (
                      <td>
                        <input type="text" ref={"classInput" + index} />
                      </td>
                    ) : null}
                    {isCategorical ? (
                      <td
                        onClick={() =>
                          this.props.addFeatureClass(
                            feature,
                            this.refs["classInput" + index].value
                          )
                        }
                      >
                        <Image src={Add} className="small-photo" />
                      </td>
                    ) : null}
                    <td
                      onClick={() => {
                        if (this.canToggle(feature)) {
                          this.props.toggleContinousAttribute(feature);
                        } else {
                          alert(
                            "There cannot be more than one continous attribute at a time"
                          );
                        }
                      }}
                    >
                      {isCategorical ? "Set continous" : "Set categorical"}
                    </td>
                    <td onClick={() => this.props.deleteFeature(feature)}>
                      <Image src={Trash} className="small-photo" />
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td>
                  <input
                    value={this.props.label}
                    onChange={e => this.props.changeLabelName(e.target.value)}
                  />
                </td>
                {this.props.labelClasses.map(labelClass => {
                  return (
                    <td onClick={() => this.props.deleteLabelClass(labelClass)}>
                      <tr>{labelClass}</tr>
                    </td>
                  );
                })}
                <td>
                  <input type="text" ref="labelClass" />
                </td>
                <td
                  onClick={() =>
                    this.props.addLabelClass(this.refs["labelClass"].value)
                  }
                >
                  <Image src={Add} className="small-photo" />
                </td>
              </tr>
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
                    <Image src={Add} className="small-photo" />
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
  continousClasses: state.DTree.continousClasses,
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
  editFeatureName,
  toggleContinousAttribute,
  setContinousAttributeRange
};

export default connect(mapStateToProps, mapDispatchToProps)(EditDTree);
