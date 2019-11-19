import React from "react";
import { Image } from "react-bootstrap";
import Tree from "../../Images/Tree.png";
import Data from "../../Images/Data.png";
import Gini from "../../Images/Gini.png";
import Impurities from "../../Images/Impurities.png";
import Entropy from "../../Images/Entropy.png";
import Split from "../../Images/Split.png";
import SplitInfo from "../../Images/SplitInfo.png";
import GainRatio from "../../Images/GainRatio.png";
import { showBasicBackNavBar } from "../../Utility";

class DTreeLearn extends React.Component {
  render() {
    return (
      <div className="App">
        <div className="App-header-low">
          {showBasicBackNavBar()}
          <h1>Decision Trees</h1>
          <h2>What is a Decision Tree?</h2>
          <p>
            A decision tree is a supervised learning model that predicts the
            label of an unclassified data row by traversing through a tree-like
            structure. Each non-leaf node of the tree represents a feature that
            the tree can traverse on, and a leaf node is the classification. It
            is one of the most ubiquitously used algorithms, and has many
            variations.
          </p>
          <h2>How to use a Decision Tree to classify?</h2>
          <p>
            Let’s say we are given the following decision tree and we would like
            to classify the following piece of data.
          </p>
          <Image src={Tree} />
          <Image src={Data} />
          <p>
            From the start, we would traverse to the 4.0 Node, since that is the
            Node in our dataset. From there, we would then traverse to the
            Python Node, and then from the Python Node, we would travel to the
            Yes Node. By this, we would classify this piece of Data to be of
            class 0.
          </p>
          <h2>How to build a Decision Tree</h2>
          <p>
            We need to build a decision tree node by node, so how do we
            determine which feature becomes which node?
          </p>
          <p>
            At each Node, we want to have the highest “gain ratio”, which is
            basically the amount of distinctness that we can have by splitting
            at that feature. To calculate gain, we have to calculate the
            “impurity” of the current overall dataset and the “impurity” of each
            of the feature in the dataset. Impurity is basically a measure of
            how pure the dataset is by the class label
          </p>
          <p>
            To calculate impurity of the overall dataset, we basically take the
            fractions of each class label in the dataset and plug into the given
            function, called Gini or Entropy.
          </p>
          <Image src={Entropy} />
          <Image src={Gini} />
          <Image src={Impurities} />
          <p>
            To calculate the impurity of each feature in the dataset, we still
            look at the class label, but only look at the pieces of the dataset
            that correspond to the class label that we currently referring to,
            and calculate entropy like that
          </p>
          <p>
            Now that we have this, we can calculate the “Gain split ” for each
            feature, which is shown in the formula below
          </p>
          <Image src={Split} />
          <p>
            We also need what is called the “split info” which is a measure of
            how many “branches” can be split on that feature, or how many
            distinct values the feature has. This can be calculated like this.
          </p>
          <Image src={SplitInfo} />
          <p>
            Now that we have these two calculations, we can calculate gain ratio
            for this dataset, and then we pick whatever value has the best gain
            ratio
          </p>
          <Image src={GainRatio} />
          <p>
            Once we pick the feature, we split our dataset by the feature we
            splitted on, and do the calculations again multiple times, until are
            nodes are pure.
          </p>
        </div>
      </div>
    );
  }
}

export default DTreeLearn;
