import React from "react";
import { Image } from "react-bootstrap";
import Tree from "../../Images/Tree.png";
import Data from "../../Images/Data.png";

class DTreeLearn extends React.Component {
  render() {
    return (
      <div>
        <h1>Decision Trees</h1>
        <h2>What is a Decision Tree?</h2>
        <p>
          A decision tree is a supervised learning model that predicts the label
          of an unclassified data row by traversing through a tree-like
          structure. Each non-leaf node of the tree represents a feature that
          the tree can traverse on, and a leaf node is the classification. It is
          one of the most ubiquitously used algorithms, and has many variations.
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
          Node in our dataset. From there, we would then traverse to the Python
          Node, and then from the Python Node, we would travel to the Yes Node.
          By this, we would classify this piece of Data to be of class 0.
        </p>
        <h2>How to build a Decision Tree</h2>
        <p>Info</p>
      </div>
    );
  }
}

export default DTreeLearn;
