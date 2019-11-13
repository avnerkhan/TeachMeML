import React from "react";
import { Image } from "react-bootstrap";
import UnlabeledCluster from "../../Images/UnlabeledCluster.png";
import LabeledFirst from "../../Images/LabeledFirst.png";
import LabeledSecond from "../../Images/LabeledSecond.png";
import BulletPoints from "../../Images/BulletPoints.png";
import Graphs from "../../Images/Graphs.png";

class ClusteringLearn extends React.Component {
  render() {
    return (
      <div>
        <h1>Clustering Learn</h1>
        <h2>What is clustering?</h2>
        <p>
          Clustering is a generalization of unsupervised algorithms. This means
          that our data comes without any labels, and it is our job to create
          labels. There are two algorithms that we will focus on for clustering,
          KMeans and DBScan.
        </p>
        <h2>How KMeans Works</h2>
        <p>
          The first step in KMeans is to determine how many clusters/labels you
          would like to make. This would be your K. If you want two labels, then
          K would be two.
        </p>
        <p>
          Let’s pick K random points from our unlabeled data to be our
          centroids. A centroid is a point in our graph that is the center of a
          cluster. The black Xs are centroids in this example
        </p>
        <Image src={UnlabeledCluster} />
        <p>
          Now, assign each point to its nearest cluster, and label it
          accordingly.
        </p>
        <Image src={LabeledFirst} />
        <p>
          Now, recalculate the centroids based on the mean of the current
          labels, and then relabel the points based on the new closest centroids
        </p>
        <Image src={LabeledSecond} />
        <p>
          We keep doing this until the positions of the centroids don’t change.
          At this point, our algorithm will have classified our labels.
        </p>
        <h2>How DBScan Works</h2>
        <p>Info</p>
        <h2>When to use KMeans and DBSCAN</h2>
        <p>
          There are certain reasons why we would choose KMeans over DBScan and
          vice versa
        </p>
        <p>
          KMeans works in most scenarios, but there are specific scenarios where
          it wouldn’t be smart to use it
        </p>
        <Image src={Graphs} />
        <p>Here are some characteristics of DBScan</p>
        <Image src={BulletPoints} />
      </div>
    );
  }
}

export default ClusteringLearn;
