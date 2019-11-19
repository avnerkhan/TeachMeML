import React from "react";
import { Image } from "react-bootstrap";
import Euclid from "../../Images/Euclid.png";

class KNNLearn extends React.Component {
  render() {
    return (
      <div className="App">
        <div className="App-header-low">
          <h1>KNNLearn Learn</h1>
          <h2>What is KNN</h2>
          <p>
            KNN is a supervised algorithm that stands for “K Nearest Neighbors”.
            It is exactly what it sounds like. Imagine you only have two
            features, X coordinates and Y coordinates. When our KNN receives a
            new data point, it compares the classes of it’s K-closest neighbors,
            K being the user specified number. Whichever label is most out of
            these K neighbors, the new point is classified as that label.
          </p>
          <h2>How KNN Classifies</h2>
          <p>
            KNN determines how “close” a datapoint is by using a comparator
            function. Usually, a comparator function is euclidean distance,
            which is given below
          </p>
          <Image src={Euclid} />
          <p>
            Basically, for all of the labeled datapoint in our dataset,
            calculate the distance of that point from our unlabeled point using
            this function, and select the label from the K nearest points. For
            two points that we are comparing, we subtract their respective
            feature value and square that, and sum that for all the features,
            and calculate the square root of that.
          </p>
        </div>
      </div>
    );
  }
}

export default KNNLearn;
