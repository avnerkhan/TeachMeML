import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import RegressionLearn from "./components/learn/RegressionLearn";
import DTreeLearn from "./components/learn/DTreeLearn";
import KNNLearn from "./components/learn/KNNLearn";
import ClusteringLearn from "./components/learn/ClusteringLearn";
import AssociationLearn from "./components/learn/AssociationLearn";
import DTreeEdit from "./components/edit/EditDTree";
import KNNEdit from "./components/edit/EditKNN";
import AssociationEdit from "./components/edit/EditAssosciation";
import Pick from "./components/Pick";
import DTree from "./components/DTree";
import KNN from "./components/KNN";
import Association from "./components/Association";
import Regression from "./components/Regression";
import Intro from "./components/learn/Intro";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter, Route } from "react-router-dom";
import Clustering from "./components/Clustering";
import { Provider } from "react-redux";
import { createStore, combineReducers } from "redux";
import { DTreeReducer } from "./reducers/DTreeReducer";
import { KNNReducer } from "./reducers/KNNReducer";
import { AssociationReducer } from "./reducers/AssociationReducer";

const store = createStore(
  combineReducers({
    DTree: DTreeReducer,
    KNN: KNNReducer,
    Association: AssociationReducer
  })
);

const webroutes = (
  <Provider store={store}>
    <BrowserRouter>
      <div>
        <Route exact path="/" component={Pick} />
        <Route exact path="/Intro" component={Intro} />
        <Route exact path="/RegressionPlay" component={Regression} />
        <Route exact path="/DecisionTreePlay" component={DTree} />
        <Route exact path="/K-NearestNeighborsPlay" component={KNN} />
        <Route exact path="/ClusteringPlay" component={Clustering} />
        <Route exact path="/AssociationPlay" component={Association} />
        <Route exact path="/DecisionTreeEdit" component={DTreeEdit} />
        <Route exact path="/K-NearestNeighborsEdit" component={KNNEdit} />
        <Route exact path="/AssociationEdit" component={AssociationEdit} />
        <Route exact path="/RegressionLearn" component={RegressionLearn} />
        <Route exact path="/DecisionTreeLearn" component={DTreeLearn} />
        <Route exact path="/K-NearestNeighborsLearn" component={KNNLearn} />
        <Route exact path="/ClusteringLearn" component={ClusteringLearn} />
        <Route exact path="/AssociationLearn" component={AssociationLearn} />
      </div>
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(webroutes, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
