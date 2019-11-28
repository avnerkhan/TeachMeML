import React from "react";
import { Image } from "react-bootstrap";
import UnlabeledCluster from "../../Images/UnlabeledCluster.png";
import LabeledFirst from "../../Images/LabeledFirst.png";
import LabeledSecond from "../../Images/LabeledSecond.png";
import BulletPoints from "../../Images/BulletPoints.png";
import Graphs from "../../Images/Graphs.png";
import { showBasicBackNavBar } from "../../Utility";

class ClusteringLearn extends React.Component {
  render() {
    return (
      <div className="App">
        <div className="App-header-low">
          {showBasicBackNavBar()}
          <h1>Clustering Learn</h1>
          <h2>What is clustering?</h2>
          <p>
            Clustering is a generalization of unsupervised algorithms. This
            means that our data comes without any labels, and it is our job to
            create labels. There are two algorithms that we will focus on for
            clustering, KMeans and DBScan.
          </p>
          <h2>How KMeans Works</h2>
          <p>
            The first step in KMeans is to determine how many clusters/labels
            you would like to make. This would be your K. If you want two
            labels, then K would be two.
          </p>
          <p>
            Let’s pick K random points from our unlabeled data to be our
            centroids. A centroid is a point in our graph that is the center of
            a cluster. The black Xs are centroids in this example
          </p>
          <Image src={UnlabeledCluster} className="large-photo" />
          <p>
            Now, assign each point to its nearest cluster, and label it
            accordingly.
          </p>
          <Image src={LabeledFirst} className="large-photo" />
          <p>
            Now, recalculate the centroids based on the mean of the current
            labels, and then relabel the points based on the new closest
            centroids
          </p>
          <Image src={LabeledSecond} className="large-photo" />
          <p>
            We keep doing this until the positions of the centroids don’t
            change. At this point, our algorithm will have classified our
            labels.
          </p>
          <h2>How DBScan Works</h2>
          <p>
            DBScan is another clustering algorithm, but it works better for more
            oddly shaped clusters. It clusters based on the density of a region.
          </p>
          <p>
            At each point in the dataset, we calculate the density of the point
            by counting the number of other points within that points “eps”,
            which is basically a parameter radius. Once we have the density of
            that point, we can categorize it in three ways.
          </p>
          <p>
            Core Points are basically points in the interior of a dense region.
            If the number of points in it’s eps meets minPts, which is the
            minimum number of points to satisfy the condition, then it is a core
            point.
          </p>
          <p>
            Border points are points that are not core points, but fall in the
            eps of a core point
          </p>
          <p>Noise points are neither core or border</p>
          <p>
            Once DBscan labels all points, we eliminate noise points, and label
            points in the same eps as the same cluster, as are border points
          </p>
          <h2>When to use KMeans and DBSCAN</h2>
          <p>
            There are certain reasons why we would choose KMeans over DBScan and
            vice versa
          </p>
          <p>
            KMeans works in most scenarios, but there are specific scenarios
            where it wouldn’t be smart to use it
          </p>
          <Image src={Graphs} className="large-photo" />
          <p>Here are some characteristics of DBScan</p>
          <Image src={BulletPoints} className="large-photo" />
        </div>
      </div>
    );
  }
}

export default ClusteringLearn;
