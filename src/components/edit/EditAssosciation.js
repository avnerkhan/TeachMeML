import React from "react";
import {
  addTransactionType,
  deleteTransactionType,
  editTransactionType
} from "../../actions/AssociationActions";
import { Table, Image } from "react-bootstrap";
import Trash from "../../Images/trash.png";
import Add from "../../Images/add.png";
import { connect } from "react-redux";
import { showBasicBackNavBar } from "../../Utility";

class EditAssociation extends React.Component {
  render() {
    return (
      <div className="App">
        <div className="App-header-low">
          {showBasicBackNavBar()}
          <Table size="sm">
            <thead>
              <tr>
                <th>Current Transactions</th>
              </tr>
            </thead>
            <tbody>
              {this.props.transactionItems.map((transaction, index) => {
                return (
                  <tr>
                    <td>
                      <input
                        type="text"
                        value={this.props.transactionItems.get(index)}
                        onChange={e =>
                          this.props.editTransactionType(e.target.value, index)
                        }
                      />
                    </td>
                    <td
                      onClick={() =>
                        this.props.deleteTransactionType(transaction)
                      }
                    >
                      <Image src={Trash} style={{ width: 40 }} />
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td>Add</td>
                <td>
                  <input type="text" ref="input" />
                </td>
                <tr>
                  <td
                    onClick={() =>
                      this.props.addTransactionType(this.refs["input"].value)
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
  transactionItems: state.Association.transactionItems
});

const mapDispatchToProps = {
  addTransactionType,
  deleteTransactionType,
  editTransactionType
};

export default connect(mapStateToProps, mapDispatchToProps)(EditAssociation);
