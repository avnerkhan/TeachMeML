/* eslint-disable */

import React from "react";
import Table from "react-bootstrap/Table";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Forward from "../Images/forward.png";
import AssociationLearn from "./learn/AssociationLearn";
import Image from "react-bootstrap/Image";
import Tree from "react-tree-graph";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import SomeTree from "../Images/SomeTree.png";
import { arrayRange, showLearnModeIcon } from "../Utility";
import { showBackToAlgorithimPage, displayInfoButton } from "../Utility";
import {
  generateRandomTransaction,
  generateOneItemsets,
  reorderDB,
  buildTree,
  filterFreqSets,
  mineFreqItemsets,
  formatSets
} from "./algorithims/AssociationAlgo";
import Add from "../Images/add.png";
import Trash from "../Images/trash.png";
import Shuffle from "../Images/shuffle.png";
import "../css_files/App.css";
import "react-table/react-table.css";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

class Association extends React.Component {
  constructor(props) {
    super(props);

    this.defaultTransactionSelection = ["A", "B", "C", "D", "E"];

    this.state = {
      treeState: {},
      renderTree: false,
      isApriori: false,
      isFPTree: false,
      showLearnMode: false,
      minSup: 2,
      frequentItemSet: [],
      transactionItems: this.defaultTransactionSelection,
      transactions: generateRandomTransaction(this.defaultTransactionSelection)
    };
  }

  showMinSupSelection() {
    return !this.state.showLearnMode &&
      this.state.frequentItemSet.length === 0 ? (
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

  // Either adds or subtracts an element from a transaction
  changeTransactionState(currentTransactionIndex, isAdd) {
    let currentTransactionState = this.state.transactions;
    const transactionItems = this.state.transactionItems;

    if (isAdd) {
      let index = 0;
      while (
        currentTransactionState[currentTransactionIndex].includes(
          transactionItems[index]
        ) ||
        index === transactionItems.length
      ) {
        index++;
      }
      currentTransactionState[currentTransactionIndex].push(
        transactionItems[index]
      );
    } else {
      currentTransactionState[currentTransactionIndex].pop();
    }

    this.setState({ transaction: currentTransactionState });
  }

  // Changes an item in a transaction without adding or subtracting from transaction
  changeItemInTransaction(transaction, item, itemIndexInTransaction) {
    let currentTransactionState = this.state.transactions;
    const transactionItems = this.state.transactionItems;
    const currentTransactionIndex = currentTransactionState.indexOf(
      transaction
    );
    const currentItemIndex = transactionItems.indexOf(item);
    let nextItemIndex = (currentItemIndex + 1) % transactionItems.length;
    while (
      currentTransactionState[currentTransactionIndex].includes(
        transactionItems[nextItemIndex]
      ) ||
      nextItemIndex === currentItemIndex
    ) {
      nextItemIndex = (nextItemIndex + 1) % transactionItems.length;
    }
    currentTransactionState[currentTransactionIndex][itemIndexInTransaction] =
      transactionItems[nextItemIndex];

    this.setState({ transactions: currentTransactionState });
  }

  // Runs apriori by generating next itemset
  runAprioriAlgorithim() {
    const frequentItemSet = this.state.frequentItemSet;
    const transactionItems = this.state.transactionItems;
    const transactions = this.state.transactions;
    const minSup = this.state.minSup;

    if (frequentItemSet.length === 0) {
      this.setState({
        frequentItemSet: generateOneItemsets(
          transactions,
          transactionItems,
          minSup
        ),
        isApriori: true
      });
    } else {
      let oneItemSet = Object.keys(frequentItemSet[0]);
      const lastFrequentSet = frequentItemSet[frequentItemSet.length - 1];
      oneItemSet.sort();
      let newFrequentSet = {};

      for (let frequentSet in lastFrequentSet) {
        const lastLetter = frequentSet.substring(frequentSet.length - 1);
        let index = oneItemSet.indexOf(lastLetter) + 1;

        while (index < oneItemSet.length) {
          let newFrequentPattern = frequentSet;
          newFrequentPattern += oneItemSet[index];
          newFrequentSet[newFrequentPattern] = 0;
          index++;
        }
      }

      newFrequentSet = filterFreqSets(
        newFrequentSet,
        this.state.transactions,
        this.state.minSup
      );

      frequentItemSet.push(newFrequentSet);

      this.setState({ frequentItemSet: frequentItemSet, isApriori: true });
    }
  }

  addNewTransaction() {
    let currentTransactions = this.state.transactions;
    currentTransactions.push(["A"]);
    this.setState({
      transactions: currentTransactions
    });
  }

  deleteTransaction(index) {
    let currentTransactions = this.state.transactions;
    currentTransactions.splice(index, 1);
    this.setState({
      transactions: currentTransactions
    });
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
                        this.changeItemInTransaction(transaction, item, index)
                      }
                    >
                      {item}
                    </td>
                  );
                })}
                <td onClick={() => this.changeTransactionState(index, true)}>
                  +
                </td>
                <td onClick={() => this.changeTransactionState(index, false)}>
                  -
                </td>
                <td onClick={() => this.deleteTransaction(index)}>
                  <Image src={Trash} style={{ width: 40 }} />
                </td>
              </tr>
            );
          })}
          <tr>
            <td onClick={() => this.addNewTransaction()}>
              <Image src={Add} style={{ width: 40 }} />
            </td>
          </tr>
        </tbody>
      </Table>
    );
  }

  // Displays JSX of N frequent itemsets
  displayFrequentItemsets() {
    let frequentSets = this.state.frequentItemSet;

    return (
      <Row>
        {frequentSets.map((frequentKSet, index) => {
          const frequentSetKeys = Object.keys(frequentKSet);
          if (frequentSetKeys.length > 0) {
            return (
              <Col>
                <div>Frequent {index + 1} itemsets</div>
                {frequentSetKeys.map(set => {
                  return (
                    <div>
                      {set} : {frequentKSet[set]}
                    </div>
                  );
                })}
              </Col>
            );
          }
        })}
      </Row>
    );
  }

  runFPTreeAlgorithim() {
    let oneItemSet = generateOneItemsets(
      this.state.transactions,
      this.state.transactionItems,
      this.state.minSup
    )[0];

    let sortable = Object.keys(oneItemSet).map(key => {
      return [key, oneItemSet[key]];
    });

    sortable.sort((firstPair, secondPair) => {
      if (firstPair[0] != secondPair[0]) {
        return secondPair[1] - firstPair[1];
      }

      return secondPair[0] - firstPair[0];
    });

    const reorderedDB = reorderDB(sortable, this.state.transactions);
    const treeState = buildTree(reorderedDB);
    const freqItemsets = mineFreqItemsets(
      treeState,
      sortable,
      this.state.minSup
    );

    this.setState({
      isFPTree: true,
      transactions: reorderedDB,
      treeState: treeState,
      renderTree: true,
      frequentItemSet: formatSets(freqItemsets, oneItemSet)
    });
  }

  showStartAlgorithimBar() {
    return !this.state.showLearnMode &&
      !this.state.isApriori &&
      !this.state.renderTree ? (
      <OverlayTrigger
        trigger="hover"
        placement="bottom"
        overlay={<Tooltip>Run FP Tree Algorithim</Tooltip>}
      >
        <Nav.Link onClick={() => this.runFPTreeAlgorithim()}>
          <Image src={SomeTree} style={{ width: 40 }} />
        </Nav.Link>
      </OverlayTrigger>
    ) : null;
  }

  showRunNextIterationBar() {
    return !this.state.isFPTree && !this.state.showLearnMode ? (
      <OverlayTrigger
        trigger="hover"
        placement="bottom"
        overlay={<Tooltip>Run next Apriori iteration</Tooltip>}
      >
        <Nav.Link onClick={() => this.runAprioriAlgorithim()}>
          <Image src={Forward} style={{ width: 40 }} />
        </Nav.Link>
      </OverlayTrigger>
    ) : null;
  }

  showShuffleDataBar() {
    return !this.state.isFPTree &&
      !this.state.isApriori &&
      !this.state.showLearnMode ? (
      <OverlayTrigger
        trigger="hover"
        placement="bottom"
        overlay={<Tooltip>Shuffle Transaction Data</Tooltip>}
      >
        <Nav.Link
          onClick={() =>
            this.setState({
              transactions: generateRandomTransaction(
                this.state.transactionItems,
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

  showAprioriNavBar() {
    return (
      <Navbar fixed="top" bg="dark" variant="dark">
        {showBackToAlgorithimPage()}
        {this.showStartAlgorithimBar()}
        {this.showRunNextIterationBar()}
        {this.showShuffleDataBar()}
        {this.showMinSupSelection()}
        {showLearnModeIcon(this)}
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
    return this.state != undefined && !this.state.showLearnMode
      ? this.displayTransactionTable()
      : null;
  }

  displayLearnModeApriori() {
    return this.state.showLearnMode ? <AssociationLearn /> : null;
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          {this.showAprioriNavBar()}
          {this.showDataTable()}
          {this.displayLearnModeApriori()}
          {this.displayFrequentItemsets()}
          {this.showTree()}
        </header>
      </div>
    );
  }
}

export default Association;