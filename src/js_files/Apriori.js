import React from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Tree from "react-d3-tree";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import "../css_files/App.css";
import "react-table/react-table.css";

class Apriori extends React.Component {
  constructor(props) {
    super(props);

    this.defaultTransactionSelection = ["A", "B", "C", "D", "E"];

    this.state = {
      treeState: {},
      isFPTree: false,
      minSup: 2,
      frequentItemSet: [],
      transactionItems: this.defaultTransactionSelection,
      transactions: this.generateRandomTransaction()
    };
  }

  // Random transaction generator for state
  generateRandomTransaction() {
    let randomTransactions = [];
    const transactionItems =
      this.state == undefined
        ? this.defaultTransactionSelection
        : this.state.transaction;

    for (let i = 0; i < 5; i++) {
      let transaction = [];
      const transactionLength =
        Math.floor(Math.random() * transactionItems.length) + 1;

      for (let c = 0; c < transactionLength; c++) {
        const item = Math.round(Math.random() * transaction.length);
        const pushedItem = transactionItems[item];
        if (!transaction.includes(pushedItem)) transaction.push(pushedItem);
      }

      randomTransactions.push(transaction);
    }

    return randomTransactions;
  }

  // Either adds or subtracts an element from a transaction
  changeTransactionState(currentTransactionIndex, isAdd) {
    let currentTransactionState = this.state.transactions;
    const transactionItems = this.state.transactionItems;

    if (isAdd) {
      currentTransactionState[currentTransactionIndex].push(
        transactionItems[0]
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
    const nextItemIndex = (currentItemIndex + 1) % transactionItems.length;
    currentTransactionState[currentTransactionIndex][itemIndexInTransaction] =
      transactionItems[nextItemIndex];

    this.setState({ transactions: currentTransactionState });
  }

  generateOneItemsets(transactions, transactionItems, minSup) {
    let oneItemSet = {};

    for (let transaction of transactions) {
      for (let item of transactionItems) {
        if (transaction.includes(item)) {
          const currCount =
            oneItemSet[item] == undefined ? 0 : oneItemSet[item];
          oneItemSet[item] = currCount + 1;
        }
      }
    }

    for (let item in oneItemSet) {
      if (oneItemSet[item] < minSup) delete oneItemSet[item];
    }

    this.setState({
      frequentItemSet: [oneItemSet]
    });
  }

  // Runs apriori by generating next itemset
  runAprioriAlgorithim() {
    const frequentItemSet = this.state.frequentItemSet;
    const transactionItems = this.state.transactionItems;
    const transactions = this.state.transactions;
    const minSup = this.state.minSup;

    if (frequentItemSet.length === 0) {
      this.generateOneItemsets(transactions, transactionItems, minSup);
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

      newFrequentSet = this.filterFreqSets(newFrequentSet);

      frequentItemSet.push(newFrequentSet);

      this.setState({ frequentItemSet: frequentItemSet });
    }
  }

  // Prune by counting transacitons here (Apriori principle later?)
  filterFreqSets(newFrequentSet) {
    const transactions = this.state.transactions;
    const minsup = this.state.minSup;
    let frequentSetCopy = newFrequentSet;

    for (let transaction of transactions) {
      const compareSet = new Set(transaction);

      for (let frequentSetCandidate in newFrequentSet) {
        const checkSet = new Set(frequentSetCandidate);

        if (this.isSuperset(compareSet, checkSet))
          frequentSetCopy[frequentSetCandidate] += 1;
      }
    }

    for (let frequentSet in frequentSetCopy) {
      if (frequentSetCopy[frequentSet] < minsup)
        delete frequentSetCopy[frequentSet];
    }

    return frequentSetCopy;
  }

  isSuperset(compareSet, checkSet) {
    for (let elem of checkSet) {
      if (!compareSet.has(elem)) {
        return false;
      }
    }
    return true;
  }

  // Displays the JSX for transaction table
  displayTransactionTable() {
    let transactions = this.state.transactions;

    return (
      <Table responsive="sm">
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
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  }

  displayMinsupSelection() {}

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
    this.generateOneItemsets(
      this.state.transactions,
      this.state.transactionItems,
      this.state.minSup
    );
    this.setState({
      isFPTree: true
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          {this.state != undefined ? this.displayTransactionTable() : null}
          <Row>
            <Button onClick={() => this.runFPTreeAlgorithim()}>
              Run FP Tree Algorithim
            </Button>
            {!this.state.isFPTree ? (
              <Button onClick={() => this.runAprioriAlgorithim()}>
                Generate Next Apriori Itemset
              </Button>
            ) : null}
          </Row>
          {this.displayMinsupSelection()}
          {!this.state.isFPTree ? this.displayFrequentItemsets() : null}
        </header>
      </div>
    );
  }
}

export default Apriori;
