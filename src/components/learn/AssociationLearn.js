import React from "react";
import { Image } from "react-bootstrap";
import Timeseries from "../../Images/Timeseries.png";
import OneSet from "../../Images/1-set.png";
import TwoSet from "../../Images/2-set.png";
import ThreeSet from "../../Images/3-set.png";
import Conditonal from "../../Images/Conditional.png";
import FPTree from "../../Images/FPTree.png";
import Sorted from "../../Images/Sorted.png";

class AprioriLearn extends React.Component {
  render() {
    return (
      <div className="App">
        <div className="App-header-low">
          <h1>Apriori Learn</h1>
          <h2>What is timeseries data</h2>
          <p>
            Time series data is very different from the previous pieces of data
            that we have seen before. Instead of having features and labels,
            time series data looks like this.
          </p>
          <Image src={Timeseries} />
          <p>
            You can imagine this entire table to represent the transactions of a
            singular customer. The TID column simply stands for transaction ID.
            Each row represents that customer's shopping cart on that particular
            day. For each row, you can’t have duplicate item. For example, row
            with TID 1 can’t have two instances of bread.
          </p>
          <p>
            The goal of the two algorithms presented, Apriori and FPTree, is to
            determine the frequent itemsets of the time series data. A frequent
            itemset is an itemset whose support is greater than a given value
            called minsup. Support simply means the amount of transactions that
            have a specific set of transactions.
          </p>
          <h2>How Apriori Works</h2>
          <p>
            Treat every item in your dataset as it’s own set, and then get the
            supports for these 1-itemsets. Discard anything that is below minsup
          </p>
          <Image src={OneSet} />
          <p>
            Now, we generate the 2-itemsets by generating all combos from these.
            Once again, we count and discard anything below minsup.
          </p>
          <Image src={TwoSet} />
          <p>
            Now we generate the k-itemset, but we pay attention to these sets
            particularly. Before we count the support of these itemsets, we can
            get rid of some of these sets already by using the apriori rule. The
            apriori rule basically states that if a subset of an itemset is not
            frequent, then that entire set is not frequent. Take the following
            example.
          </p>
          <Image src={ThreeSet} />
          <p>
            We removed the Bread, Diaper, Beer itemset via apriori because the
            Bread, Beer set was not present in the Frequent 2-itemsets.
          </p>
          <h2>How FPTree Works</h2>
          <p>
            The main idea behind FPTree is to basically generate a tree that we
            use to find the frequent itemsets.{" "}
          </p>
          <p>
            Each node in our tree would contain the count of a certain item down
            the “path”, and we can find the frequent itemsets by running DFS
            through the tree
          </p>
          <p>
            To be more specific, we make an initial scan of the database and get
            the support count for each individual item.
          </p>
          <p>
            Remove the items that are below minsup, and sort the items in
            decreasing order
          </p>
          <p>
            Now we look at our transactions again, and update them so that each
            transaction is sorted by it’s most frequent item, and infrequent
            items are removed
          </p>
          <Image src={Conditonal} />
          <p>
            From here, we build our FP Tree by iterating through all the
            transactions in our sorted data
          </p>
          <Image src={FPTree} />
          <p>
            From here, we find what is called the conditional pattern bases and
            conditional FP Trees, and from there we can create our frequent
            itemsets.
          </p>
          <p>
            Conditional pattern base is basically finding all the paths for each
            item, and keeping a count of those, and then counting them to find
            the frequent itemsets. Example is shown below
          </p>
          <Image src={Sorted} />
          <h2>When to use FPTree vs Apriori</h2>
          <p>
            Although FPTree and Apriori come out to the same result, the one
            issue with Apriori is that it must make multiple calls to the
            database to obtain the transactions and process them. FPTree growth
            only requires two total calls to the database, and after that, our
            FPTree is used to determine the frequent itemsets.
          </p>
        </div>
      </div>
    );
  }
}

export default AprioriLearn;
