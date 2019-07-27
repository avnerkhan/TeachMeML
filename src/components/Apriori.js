/* eslint-disable */

import React from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Tree from "react-tree-graph";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { arrayRange } from "../Utility";
import "../css_files/App.css";
import "react-table/react-table.css";

class Apriori extends React.Component {
  constructor(props) {
    super(props);

    this.defaultTransactionSelection = ["A", "B", "C", "D", "E"];

    this.state = {
      treeState: {},
      renderTree: false,
      isFPTree: false,
      minSup: 2,
      frequentItemSet: [],
      transactionItems: this.defaultTransactionSelection,
      transactions: this.generateRandomTransaction()
    };
  }

  showMinSupSelection() {
    return (
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
    );
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

    return [oneItemSet];
  }

  // Runs apriori by generating next itemset
  runAprioriAlgorithim() {
    const frequentItemSet = this.state.frequentItemSet;
    const transactionItems = this.state.transactionItems;
    const transactions = this.state.transactions;
    const minSup = this.state.minSup;

    if (frequentItemSet.length === 0) {
      this.setState({
        frequentItemSet: this.generateOneItemsets(
          transactions,
          transactionItems,
          minSup
        )
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

  // Displays JSX of N frequent itemsets
  displayFrequentItemsets() {
    let frequentSets = this.state.frequentItemSet;

    console.log(frequentSets);
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

  reorderDB(sortedArr) {
    const order = sortedArr.map(entry => {
      return entry[0];
    });
    let orderedDB = this.state.transactions;

    return orderedDB.map(transaction => {
      transaction.sort((firstEntry, secondEntry) => {
        return order.indexOf(firstEntry) - order.indexOf(secondEntry);
      });

      transaction = transaction.filter(entry => {
        return order.includes(entry);
      });
      return transaction;
    });
  }

  buildTree(reorderedDB) {
    let currTree = {
      name: "R",
      children: []
    };

    for (let transaction of reorderedDB) {
      currTree = this.addBranch(transaction, currTree);
    }

    return currTree;
  }

  addBranch(transaction, currTree) {
    let root = currTree;
    let curr = root;

    for (let letter of transaction) {
      if (curr != undefined) {
        const names = curr.children.map(children => {
          return children.name.split(":")[0];
        });

        if (names.includes(letter)) {
          const index = names.indexOf(letter);
          curr = curr.children[index];
          const newCount = parseInt(curr.name.split(":")[1]) + 1;
          curr.name = letter + ":" + newCount.toString();
        } else {
          const newEntry = {
            name: letter + ":1",
            children: []
          };
          curr.children.push(newEntry);
          curr = newEntry;
        }
      }
    }

    return root;
  }

  findAllPaths(allPaths, currentPath, curr, toFind) {
    const split = curr.name.split(":");
    const transaction = split[0];
    const count = split[1];

    if (transaction === toFind) {
      return [currentPath, count];
    }

    currentPath += transaction;
    for (let child of curr.children) {
      const elem = this.findAllPaths(allPaths, currentPath, child, toFind);
      allPaths.push(elem);
    }
  }

  getFrequentItemsets(currentPaths) {
    let frequentItemsets = {};

    for (let pathKey in currentPaths) {
      let mappingForKey = {};
      const currentPathsForKey = currentPaths[pathKey];
      for (let pair of currentPathsForKey) {
        if (pair != undefined) {
          const actualPath = pair[0];
          const count = pair[1];
          let startString = pathKey;
          for (let c of actualPath) {
            if (c !== "R") {
              startString = c + startString;
              mappingForKey[startString] =
                mappingForKey[startString] == undefined
                  ? count
                  : mappingForKey[startString] + count;
            }
          }
        }
      }
      for (let key in mappingForKey) {
        if (mappingForKey[key] >= this.state.minSup)
          frequentItemsets[key] = mappingForKey[key];
      }
    }

    return frequentItemsets;
  }

  mineFreqItemsets(treeState, sortedList) {
    sortedList.reverse();
    let currentPaths = {};

    for (let entry of sortedList) {
      let allPathsForTransactions = [];
      let root = treeState;
      const transaction = entry[0];
      this.findAllPaths(allPathsForTransactions, "", root, transaction);
      currentPaths[transaction] = allPathsForTransactions;
    }

    return this.getFrequentItemsets(currentPaths);
  }

  formatSets(freqItemsets, oneItemSet) {
    let newFrequentSets = [oneItemSet, {}, {}, {}, {}];

    for (const key in freqItemsets) {
      newFrequentSets[key.length - 1][key] = freqItemsets[key];
    }

    return newFrequentSets;
  }

  runFPTreeAlgorithim() {
    let oneItemSet = this.generateOneItemsets(
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

    const reorderedDB = this.reorderDB(sortable);
    const treeState = this.buildTree(reorderedDB);
    const freqItemsets = this.mineFreqItemsets(treeState, sortable);

    this.setState({
      isFPTree: true,
      transactions: reorderedDB,
      treeState: treeState,
      renderTree: true,
      frequentItemSet: this.formatSets(freqItemsets, oneItemSet)
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          {this.state.renderTree ? (
            <Tree
              height={400}
              width={800}
              data={this.state.treeState}
              svgProps={{ className: "custom" }}
            />
          ) : null}
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
          {this.showMinSupSelection()}
          {this.displayFrequentItemsets()}
        </header>
      </div>
    );
  }
}

export default Apriori;
