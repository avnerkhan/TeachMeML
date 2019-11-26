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
  let minSupPrune = new Set();

  for (let transaction of transactions) {
    for (let item of transactionItems) {
      if (transaction.includes(item)) {
        const currCount = oneItemSet[item] == undefined ? 0 : oneItemSet[item];
        oneItemSet[item] = currCount + 1;
      }
    }
  }

  for (let item in oneItemSet) {
    if (oneItemSet[item] < minSup) {
      minSupPrune.add(item);
    }
  }

  return [oneItemSet, minSupPrune];
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

  for (let item of transaction) {
    if (curr != undefined) {
      const names = curr.children.map(children => {
        return children.name.split(":")[0];
      });

      if (names.includes(item)) {
        const index = names.indexOf(item);
        curr = curr.children[index];
        const newCount = parseInt(curr.name.split(":")[1]) + 1;
        curr.name = item + ":" + newCount.toString();
      } else {
        const newEntry = {
          name: item + ":1",
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

  currentPath += "," + transaction;
  for (let child of curr.children) {
    const elem = findAllPaths(allPaths, currentPath, child, toFind);
    allPaths.push(elem);
  }
}

function getAllCombos(list) {
  let toReturn = [];

  for (let i = 0; i < list.length; i++) {
    toReturn.push(
      list.filter((entry, index) => {
        return index !== i;
      })
    );
  }

  return toReturn;
}

export function filterApriori(
  newFrequentSet,
  minSupPruned,
  aprioriPrunedBefore
) {
  let aprioriPruned = new Set([]);

  for (const newFreq in newFrequentSet) {
    const split = newFreq.split(",");
    const perms = getAllCombos(split);
    let filter = false;
    for (const perm of perms) {
      const previousSplit = perm.toString();
      if (
        minSupPruned.has(previousSplit) ||
        aprioriPrunedBefore.has(previousSplit)
      ) {
        filter = true;
        break;
      }
    }
    if (filter) {
      aprioriPruned.add(newFreq);
    }
  }

  return aprioriPruned;
}

export function filterFreqSets(
  newFrequentSet,
  aprioriPruned,
  transactions,
  minsup
) {
  let frequentSetCopy = newFrequentSet;
  let minSupPruned = new Set();

  for (let transaction of transactions) {
    const compareSet = new Set(transaction);

    for (let frequentSetCandidate in newFrequentSet) {
      const checkSet = new Set(frequentSetCandidate.split(","));

      if (isSuperset(compareSet, checkSet))
        frequentSetCopy[frequentSetCandidate] += 1;
    }
  }

  debugger;

  for (let frequentSet in frequentSetCopy) {
    if (
      frequentSetCopy[frequentSet] < minsup &&
      !aprioriPruned.has(frequentSet)
    ) {
      minSupPruned.add(frequentSet);
    }
  }

  return [frequentSetCopy, minSupPruned];
}

export function getFrequentItemsets(currentPaths, minsup) {
  let frequentItemsets = {};

  for (let pathKey in currentPaths) {
    let mappingForKey = {};
    const currentPathsForKey = currentPaths[pathKey];
    for (let pair of currentPathsForKey) {
      if (pair != undefined) {
        const actualPath = pair[0].split(",");
        const count = parseInt(pair[1]);
        let startString = pathKey;
        for (let c of actualPath) {
          if (c !== "R" && c !== "") {
            startString = c + "," + startString;
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
    const keyLength = key.split(",").length;
    newFrequentSets[keyLength - 1][key] = freqItemsets[key];
  }

  return newFrequentSets;
}

function findSupportInFrequentItemsets(frequentItemsets, currentSet) {
  for (const set of frequentItemsets) {
    if (set[currentSet] != undefined) {
      return set[currentSet];
    }
  }
}

function getOneConfs(frequentItemsets, items, overallSupportCount, minConf) {
  let oneConfs = [];

  for (let i = 0; i < items.length; i++) {
    const currentSet = items
      .filter((item, index) => {
        return i !== index;
      })
      .toString();
    const currConf =
      overallSupportCount /
      findSupportInFrequentItemsets(frequentItemsets, currentSet);
    if (currConf >= minConf / 100) {
      oneConfs.push([currentSet.split(","), [items[i]], currConf]);
    }
  }

  return oneConfs;
}

function generateConfs(
  frequentItemsets,
  transaction,
  overallSupportCount,
  minConf
) {
  let generatedConfs = [];

  const items = transaction.split(",");

  let currentConfs = getOneConfs(
    frequentItemsets,
    items,
    overallSupportCount,
    minConf
  );

  while (currentConfs.length > 0) {
    generatedConfs = generatedConfs.concat(currentConfs);
    let newConfList = [];
    for (let i = 0; i < currentConfs.length; i++) {
      const consequence = currentConfs[i];
      const antecedents = consequence[1];
      for (let c = i + 1; c < currentConfs.length; c++) {
        const otherConsequnce = currentConfs[c];
        const otherAntecedents = otherConsequnce[1];
        const combined = new Set(antecedents.concat(otherAntecedents));
        const checkList = items.filter(item => {
          return !combined.has(item);
        });
        if (checkList.length === 0) break;
        const confAmount =
          overallSupportCount /
          findSupportInFrequentItemsets(frequentItemsets, checkList.toString());
        const confOnThisRound = [checkList, [...combined], confAmount];
        // will probably have to override comparator
        if (
          !newConfList.includes(confOnThisRound) &&
          confAmount >= minConf / 100
        ) {
          newConfList.push(confOnThisRound);
        }
      }
    }
    currentConfs = newConfList;
  }

  return generatedConfs;
}

export function getStrongRules(
  frequentItemsets,
  minConf,
  aprioriPruned = new Set(),
  minSupPruned = new Set()
) {
  let strongRules = [];

  for (let i = 1; i < frequentItemsets.length; i++) {
    const kThItemset = frequentItemsets[i];
    for (const frequentItemset in kThItemset) {
      if (
        !aprioriPruned.has(frequentItemset) &&
        !minSupPruned.has(frequentItemset)
      ) {
        const generatedConfs = generateConfs(
          frequentItemsets,
          frequentItemset,
          kThItemset[frequentItemset],
          minConf
        );
        strongRules = strongRules.concat(generatedConfs);
      }
    }
  }

  return strongRules;
}

// Either adds or subtracts an element from a transaction
export function changeTransactionState(
  currentTransactionIndex,
  isAdd,
  currentTransactionState,
  transactionItems
) {
  if (isAdd) {
    let index = 0;
    while (
      currentTransactionState[currentTransactionIndex].includes(
        transactionItems.get(index)
      ) ||
      index === transactionItems.size
    ) {
      index++;
    }
    currentTransactionState[currentTransactionIndex].push(
      transactionItems.get(index)
    );
  } else {
    currentTransactionState[currentTransactionIndex].pop();
  }
  return currentTransactionState;
}

export function deleteTransaction(index, currentTransactions) {
  currentTransactions.splice(index, 1);
  return currentTransactions;
}

export function addNewTransaction(currentTransactions, transactionsItems) {
  currentTransactions.push([transactionsItems.get(0)]);
  return currentTransactions;
}

export function runFPTreeAlgorithim(
  transactions,
  transactionItems,
  minSup,
  minConf
) {
  let oneItemSet = generateOneItemsets(
    transactions,
    transactionItems,
    minSup
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

  const reorderedDB = reorderDB(sortable, transactions);
  const treeState = buildTree(reorderedDB);

  const freqItemsets = mineFreqItemsets(treeState, sortable, minSup);
  const formattedSets = formatSets(freqItemsets, oneItemSet);
  const strongRules = getStrongRules(formattedSets, minConf);

  return [treeState, formattedSets, strongRules];
}

// Changes an item in a transaction without adding or subtracting from transaction
export function changeItemInTransaction(
  transaction,
  item,
  itemIndexInTransaction,
  currentTransactionState,
  transactionItems
) {
  const currentTransactionIndex = currentTransactionState.indexOf(transaction);
  const currentItemIndex = transactionItems.indexOf(item);
  let nextItemIndex = (currentItemIndex + 1) % transactionItems.size;
  while (
    currentTransactionState[currentTransactionIndex].includes(
      transactionItems.get(nextItemIndex)
    ) ||
    nextItemIndex === currentItemIndex
  ) {
    nextItemIndex = (nextItemIndex + 1) % transactionItems.size;
  }
  currentTransactionState[currentTransactionIndex][
    itemIndexInTransaction
  ] = transactionItems.get(nextItemIndex);
  return currentTransactionState;
}

// Runs apriori by generating next itemset
export function runAprioriAlgorithim(
  frequentItemSet,
  transactionItems,
  transactions,
  minSup,
  currentMinSupPruned,
  currentAprioriPruned
) {
  if (frequentItemSet.length === 0) {
    const oneItemSetPair = generateOneItemsets(
      transactions,
      transactionItems,
      minSup
    );
    return [[oneItemSetPair[0]], true, false, oneItemSetPair[1], [], []];
  } else {
    let oneItemSet = Object.keys(frequentItemSet[0]);
    const lastFrequentSet = frequentItemSet[frequentItemSet.length - 1];
    oneItemSet.sort();
    let newFrequentSet = {};
    let currentLength = 0;

    for (let frequentSet in lastFrequentSet) {
      if (
        !currentMinSupPruned.has(frequentSet) &&
        !currentAprioriPruned.has(frequentSet)
      ) {
        const splitString = frequentSet.split(",");
        currentLength = splitString.length;
        const lastItem = splitString[currentLength - 1];
        let index = oneItemSet.indexOf(lastItem) + 1;

        while (index < oneItemSet.length) {
          let newFrequentPattern = frequentSet;
          newFrequentPattern += "," + oneItemSet[index];
          newFrequentSet[newFrequentPattern] = 0;
          index++;
        }
      }
    }

    let aprioriPruned = new Set();

    if (currentLength >= 3) {
      aprioriPruned = filterApriori(
        newFrequentSet,
        currentMinSupPruned,
        currentAprioriPruned
      );
    }

    const minSupPair = filterFreqSets(
      newFrequentSet,
      aprioriPruned,
      transactions,
      minSup
    );

    newFrequentSet = minSupPair[0];
    let minSupPruned = minSupPair[1];
    currentMinSupPruned = new Set([...currentMinSupPruned, ...minSupPruned]);
    currentAprioriPruned = new Set([...currentAprioriPruned, ...aprioriPruned]);

    frequentItemSet.push(newFrequentSet);

    const isDoneApriori = Object.keys(newFrequentSet).length === 0;

    const strongRules = isDoneApriori
      ? getStrongRules(frequentItemSet, minConf, aprioriPruned, minSupPruned)
      : [];

    return [
      frequentItemSet,
      true,
      isDoneApriori,
      currentMinSupPruned,
      currentAprioriPruned,
      strongRules
    ];
  }
}
