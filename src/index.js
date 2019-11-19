import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Pick from "./components/Pick";
import DTree from "./components/DTree";
import KNN from "./components/KNN";
import Association from "./components/Association";
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
        <Route exact path="/DecisionTree" component={DTree} />
        <Route exact path="/KNearestNeighbors" component={KNN} />
        <Route exact path="/Clustering" component={Clustering} />
        <Route exact path="/Association" component={Association} />
        <Route exact path="/Intro" component={Intro} />
      </div>
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(webroutes, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
