import React from "react";
import { Image } from "react-bootstrap";
import Timeseries from "../../Images/Timeseries.png";

class AprioriLearn extends React.Component {
  render() {
    return (
      <div>
        <h1>Apriori Learn</h1>
        <h2>What is timeseries data</h2>
        <p>
          Time series data is very different from the previous pieces of data
          that we have seen before. Instead of having features and labels, time
          series data looks like this.
        </p>
        <Image src={Timeseries} />
        <p>
          You can imagine this entire table to represent the transactions of a
          singular customer. The TID column simply stands for transaction ID.
          Each row represents that customer's shopping cart on that particular
          day. For each row, you can’t have duplicate item. For example, row
          with TID 1 can’t have two instances of bread.
        </p>
        <h2>When to use FPTree vs Apriori</h2>
        <p>Info</p>
        <h2>How Apriori Works</h2>
        <p>Info</p>
        <h2>How FPTree Works</h2>
        <p>Info</p>
      </div>
    );
  }
}

export default AprioriLearn;
