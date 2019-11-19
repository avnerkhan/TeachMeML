/* eslint-disable */

// Random transaction generator for state
export function generateRandomTransaction(
  transactionItems,
  lengthPerTransaction = 5
) {
  let randomTransactions = [];

  for (let i = 0; i < lengthPerTransaction; i++) {
    let transaction = [];
    const transactionLength =
      Math.floor(Math.random() * transactionItems.size) + 1;

    for (let c = 0; c < transactionLength; c++) {
      const item = Math.round(Math.random() * transaction.length);
      const pushedItem = transactionItems.get(item);
      if (!transaction.includes(pushedItem)) transaction.push(pushedItem);
    }

    randomTransactions.push(transaction);
  }

  return randomTransactions;
}

export function generateOneItemsets(transactions, transactionItems, minSup) {
  let oneItemSet = {};

  for (let transaction of transactions) {
    for (let item of transactionItems) {
      if (transaction.includes(item)) {
        const currCount = oneItemSet[item] == undefined ? 0 : oneItemSet[item];
        oneItemSet[item] = currCount + 1;
      }
    }
  }

  for (let item in oneItemSet) {
    if (oneItemSet[item] < minSup) delete oneItemSet[item];
  }

  return [oneItemSet];
}

function isSuperset(compareSet, checkSet) {
  for (let elem of checkSet) {
    if (!compareSet.has(elem)) {
      return false;
    }
  }
  return true;
}

export function reorderDB(sortedArr, currTransactions) {
  const order = sortedArr.map(entry => {
    return entry[0];
  });
  let orderedDB = currTransactions;

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

export function buildTree(reorderedDB) {
  let currTree = {
    name: "R",
    children: []
  };

  for (let transaction of reorderedDB) {
    currTree = addBranch(transaction, currTree);
  }

  return currTree;
}

function addBranch(transaction, currTree) {
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

export function findAllPaths(allPaths, currentPath, curr, toFind) {
  const split = curr.name.split(":");
  const transaction = split[0];
  const count = split[1];

  if (transaction === toFind) {
    return [currentPath, count];
  }

  currentPath += transaction;
  for (let child of curr.children) {
    const elem = findAllPaths(allPaths, currentPath, child, toFind);
    allPaths.push(elem);
  }
}

// Prune by counting transacitons here (Apriori principle later?)
export function filterFreqSets(newFrequentSet, transactions, minsup) {
  let frequentSetCopy = newFrequentSet;

  for (let transaction of transactions) {
    const compareSet = new Set(transaction);

    for (let frequentSetCandidate in newFrequentSet) {
      const checkSet = new Set(frequentSetCandidate);

      if (isSuperset(compareSet, checkSet))
        frequentSetCopy[frequentSetCandidate] += 1;
    }
  }

  for (let frequentSet in frequentSetCopy) {
    if (frequentSetCopy[frequentSet] < minsup)
      delete frequentSetCopy[frequentSet];
  }

  return frequentSetCopy;
}

export function getFrequentItemsets(currentPaths, minsup) {
  let frequentItemsets = {};

  for (let pathKey in currentPaths) {
    let mappingForKey = {};
    const currentPathsForKey = currentPaths[pathKey];
    for (let pair of currentPathsForKey) {
      if (pair != undefined) {
        const actualPath = pair[0];
        const count = parseInt(pair[1]);
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
      if (mappingForKey[key] >= minsup)
        frequentItemsets[key] = mappingForKey[key];
    }
  }

  return frequentItemsets;
}

export function mineFreqItemsets(treeState, sortedList, minsup) {
  sortedList.reverse();
  let currentPaths = {};

  for (let entry of sortedList) {
    let allPathsForTransactions = [];
    let root = treeState;
    const transaction = entry[0];
    findAllPaths(allPathsForTransactions, "", root, transaction);
    currentPaths[transaction] = allPathsForTransactions;
  }

  return getFrequentItemsets(currentPaths, minsup);
}

export function formatSets(freqItemsets, oneItemSet) {
  let newFrequentSets = [oneItemSet, {}, {}, {}, {}];

  for (const key in freqItemsets) {
    newFrequentSets[key.length - 1][key] = freqItemsets[key];
  }

  return newFrequentSets;
}
