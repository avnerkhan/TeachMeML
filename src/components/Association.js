/* eslint-disable */

import React from "react";
import Table from "react-bootstrap/Table";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Forward from "../Images/forward.png";
import Image from "react-bootstrap/Image";
import Tree from "react-tree-graph";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import SomeTree from "../Images/SomeTree.png";
import { arrayRange } from "../Utility";
import { showBackToAlgorithimPage, displayInfoButton } from "../Utility";
import {
  generateRandomTransaction,
  changeTransactionState,
  deleteTransaction,
  addNewTransaction,
  runFPTreeAlgorithim,
  changeItemInTransaction,
  runAprioriAlgorithim
} from "../algorithims/AssociationAlgo";
import Add from "../Images/add.png";
import Trash from "../Images/trash.png";
import Shuffle from "../Images/shuffle.png";
import "../css_files/App.css";
import "react-table/react-table.css";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { connect } from "react-redux";

class Association extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      treeState: {},
      renderTree: false,
      isApriori: false,
      isDoneApriori: false,
      isFPTree: false,
      minSup: 2,
      minConf: 40,
      frequentItemSet: [],
      minSupPruned: new Set(),
      aprioriPruned: new Set(),
      strongRules: [],
      reorderedDB: [],
      transactions: generateRandomTransaction(this.props.transactionItems)
    };
  }

  showMinSupSelection() {
    return this.state.frequentItemSet.length === 0 ? (
      <Form>
        <Form.Group>
          <Form.Label>Select MinSup value</Form.Label>
          <Form.Control
            as="select"
            onChange={e => this.setState({ minSup: e.target.value })}
          >
            {arrayRange(2, 10).map(num => {
              return <option value={num}>{num}</option>;
            })}
          </Form.Control>
        </Form.Group>
      </Form>
    ) : null;
  }

  // Displays the JSX for transaction table
  displayTransactionTable() {
    let transactions = this.state.transactions;

    return (
      <Table responsive="sm">
        {displayInfoButton(
          "TimeSeries data",
          "Represents the list of transactions. To modify a row, press the letter inside to change its value. To add a column to the row, press plus. To delete a column from a row, press minus. If you want to run Apriori, press the right arrow to run a single iteration, until it cannot generate frequent itemsets anymore. If you want to run FP tree, press the button that does so.",
          "left"
        )}
        <tbody>
          {transactions.map((transaction, index) => {
            return (
              <tr>
                <td>{index + 1}</td>
                {transaction.map((item, index) => {
                  return (
                    <td
                      onClick={() =>
                        this.setState({
                          transactions: changeItemInTransaction(
                            transaction,
                            item,
                            index,
                            this.state.transactions,
                            this.props.transactionItems
                          )
                        })
                      }
                    >
                      {item}
                    </td>
                  );
                })}
                <td
                  onClick={() =>
                    this.setState({
                      transaction: changeTransactionState(
                        index,
                        true,
                        this.state.transactions,
                        this.props.transactionItems
                      )
                    })
                  }
                >
                  +
                </td>
                <td
                  onClick={() =>
                    this.setState({
                      transaction: changeTransactionState(
                        index,
                        false,
                        this.state.transactions,
                        this.props.transactionItems
                      )
                    })
                  }
                >
                  -
                </td>
                <td
                  onClick={() =>
                    this.setState({
                      transactions: deleteTransaction(
                        index,
                        this.state.transactions
                      )
                    })
                  }
                >
                  <Image src={Trash} style={{ width: 40 }} />
                </td>
              </tr>
            );
          })}
          <tr>
            <td
              onClick={() =>
                this.setState({
                  transactions: addNewTransaction(
                    this.state.transactions,
                    this.props.transactionItems
                  )
                })
              }
            >
              <Image src={Add} style={{ width: 40 }} />
            </td>
          </tr>
        </tbody>
      </Table>
    );
  }

  // Displays JSX of N frequent itemsets
  displayFrequentItemsets() {
    const frequentSets = this.state.frequentItemSet;

    return (
      <Row>
        {frequentSets.map((frequentKSet, index) => {
          const frequentSetKeys = Object.keys(frequentKSet);
          if (frequentSetKeys.length > 0) {
            return (
              <Col>
                <div>{index + 1} itemsets</div>
                {frequentSetKeys.map(set => {
                  const isMinSupPruned = this.state.minSupPruned.has(set);
                  const isAprioriPruned = this.state.aprioriPruned.has(set);
                  if (!isMinSupPruned && !isAprioriPruned) {
                    return (
                      <div>
                        {set} : {frequentKSet[set]}
                      </div>
                    );
                  } else {
                    return (
                      <div style={{ color: "red" }}>
                        {set} : {frequentKSet[set]} -{" "}
                        {isAprioriPruned ? "Apriori" : "Minsup"}
                      </div>
                    );
                  }
                })}
              </Col>
            );
          }
        })}
      </Row>
    );
  }

  showStartAlgorithimBar() {
    return !this.state.isApriori && !this.state.renderTree ? (
      <OverlayTrigger
        trigger="hover"
        placement="bottom"
        overlay={<Tooltip>Run FP Tree Algorithim</Tooltip>}
      >
        <Nav.Link
          onClick={() => {
            const [treeState, formattedSets, strongRules] = runFPTreeAlgorithim(
              this.state.transactions,
              this.props.transactionItems,
              this.state.minSup,
              this.state.minConf
            );
            this.setState({
              isFPTree: true,
              treeState: treeState,
              renderTree: true,
              frequentItemSet: formattedSets,
              strongRules: strongRules
            });
          }}
        >
          <Image src={SomeTree} style={{ width: 40 }} />
        </Nav.Link>
      </OverlayTrigger>
    ) : null;
  }

  showRunNextIterationBar() {
    return !this.state.isFPTree && !this.state.isDoneApriori ? (
      <OverlayTrigger
        trigger="hover"
        placement="bottom"
        overlay={<Tooltip>Run next Apriori iteration</Tooltip>}
      >
        <Nav.Link
          onClick={() => {
            const [
              frequentItemSet,
              isApriori,
              isDoneApriori,
              currentMinSupPruned,
              currentAprioriPruned,
              strongRules
            ] = runAprioriAlgorithim(
              this.state.frequentItemSet,
              this.props.transactionItems,
              this.state.transactions,
              this.state.minSup,
              this.state.minSupPruned,
              this.state.aprioriPruned
            );
            this.setState({
              frequentItemSet: frequentItemSet,
              isApriori: isApriori,
              isDoneApriori: isDoneApriori,
              minSupPruned: currentMinSupPruned,
              aprioriPruned: currentAprioriPruned,
              strongRules: strongRules
            });
          }}
        >
          <Image src={Forward} style={{ width: 40 }} />
        </Nav.Link>
      </OverlayTrigger>
    ) : null;
  }

  showShuffleDataBar() {
    return !this.state.isFPTree && !this.state.isApriori ? (
      <OverlayTrigger
        trigger="hover"
        placement="bottom"
        overlay={<Tooltip>Shuffle Transaction Data</Tooltip>}
      >
        <Nav.Link
          onClick={() =>
            this.setState({
              transactions: generateRandomTransaction(
                this.props.transactionItems,
                this.state.transactions.length
              )
            })
          }
        >
          <Image src={Shuffle} style={{ width: 40 }} />
        </Nav.Link>
      </OverlayTrigger>
    ) : null;
  }

  showMinConfSelection() {
    return this.state.frequentItemSet.length === 0 ? (
      <Form>
        <Form.Group>
          <Form.Label>Select MinConf value</Form.Label>
          <Form.Control
            as="select"
            onChange={e => this.setState({ minConf: e.target.value })}
          >
            {arrayRange(0, 100).map(num => {
              return <option value={num}>{num}</option>;
            })}
          </Form.Control>
        </Form.Group>
      </Form>
    ) : null;
  }

  showAprioriNavBar() {
    return (
      <Navbar fixed="top" bg="dark" variant="dark">
        {showBackToAlgorithimPage()}
        {this.showStartAlgorithimBar()}
        {this.showRunNextIterationBar()}
        {this.showShuffleDataBar()}
        {this.showMinSupSelection()}
        {this.showMinConfSelection()}
      </Navbar>
    );
  }

  showTree() {
    return this.state.renderTree ? (
      <div>
        <h1>Generated Tree</h1>
        <Tree
          height={400}
          width={800}
          data={this.state.treeState}
          svgProps={{ className: "custom" }}
        />
      </div>
    ) : null;
  }

  showDataTable() {
    return this.state != undefined ? this.displayTransactionTable() : null;
  }

  displayStrongRules() {
    const strongRules = this.state.strongRules;

    return strongRules.map(strongRule => {
      const precedent = strongRule[0].toString();
      const antecedent = strongRule[1].toString();
      const conf = strongRule[2];
      return <Row>{precedent + " -> " + antecedent + " : " + conf}</Row>;
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          {this.showAprioriNavBar()}
          {this.showDataTable()}
          {this.displayFrequentItemsets()}
          {this.state.strongRules.length > 0 ? <h1>Strong Rules</h1> : null}
          {this.displayStrongRules()}
          {this.showTree()}
        </header>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  transactionItems: state.Association.transactionItems
});

export default connect(mapStateToProps)(Association);
