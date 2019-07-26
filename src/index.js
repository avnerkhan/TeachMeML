import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Pick from "./algorithims/Pick";
import DTree from "./algorithims/DTree";
import KNN from "./algorithims/KNN";
import Apriori from "./algorithims/Apriori";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter, Route } from "react-router-dom";
import Clustering from "./algorithims/Clustering";

const webroutes = (
  <BrowserRouter>
    <div>
      <Route exact path="/" component={Pick} />
      <Route exact path="/DecisionTree" component={DTree} />
      <Route exact path="/KNearestNeighbors" component={KNN} />
      <Route exact path="/Clustering" component={Clustering} />
      <Route exact path="/Apriori" component={Apriori} />
    </div>
  </BrowserRouter>
);

ReactDOM.render(webroutes, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
