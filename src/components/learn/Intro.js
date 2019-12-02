import React from "react";
import { Image } from "react-bootstrap";
import Labeled from "../../Images/Labeled.png";
import Unlabeled from "../../Images/Unlabeled.png";
import Unlabeled_cluster from "../../Images/Unlabeled_cluster.png";
import Labeled_cluster from "../../Images/Labeled_cluster.png";

import "../../css_files/App.css";
import { showBasicBackNavBar } from "../../Utility";

class Intro extends React.Component {
  render() {
    return (
      <div className="App">
        <div className="App-header-low">
          {showBasicBackNavBar()}
          <h2>What is Data Mining?</h2>
          <br />
          <p>
            In general, Data Mining is taking a bunch of previous data, passing
            it into a Machine Learning algorithm, creating a model from that
            algorithm, and then using that model to predict new, unseen data. It
            is being used in millions of places today, and will continue to be
            used and improved on in the future. This website aims to help people
            new to Data Mining learn some of the fundamental algorithms in an
            interactive way. For each model presented, there is an interactive
            playground for the model, and an informational page that gives a
            brief summary of how that model is built. But before you even get
            started with that, keep reading this page to learn more.
          </p>
          <h2>Supervised and Unsupervised algorithms</h2>
          <p>
            There are two general categories of Machine Learning that we will
            focus on in this website, Supervised and Unsupervised.
          </p>
          <h3>Supervised</h3>
          <p>
            Basically, supervised learning is when our data is given to us
            classified. Take the example below.
          </p>
          <Image src={Labeled} className="large-photo" />
          <Image src={Unlabeled} className="large-photo" />
          <p>
            The last column in the row is the classification given to each row
            (i.e. mammal, reptile, fish). This is usually called the label. All
            the other columns are called Features. Our goal is to create a model
            using the first four rows of each entry in the dataset and using
            that model, we can correctly classify the label for any future
            pieces of data.
          </p>
          <h3>Unsupervised</h3>
          <p>
            Unsupervised learning is when our data is given unclassified, and
            our goal is to find some classification between the existing data.
            The easiest way to visualize this is using this plot.
          </p>
          <Image src={Unlabeled_cluster} className="large-photo" />
          <p>
            There is an obvious classification between these data points, as
            they are in two distinct groups. An unsupervised learning model aims
            to label these points, like this.
          </p>
          <Image src={Labeled_cluster} className="large-photo" />
          <p>
            Note that even though this data set has only two feature types (X
            values and Y values), the same logic can be applied to
            multidimensional datasets (with more than two feature types).
          </p>
        </div>
      </div>
    );
  }
}

export default Intro;
