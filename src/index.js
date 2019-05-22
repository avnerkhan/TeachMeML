import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Pick from './js_files/Pick';
import DTree from './js_files/DTree'
import KNN from './js_files/KNN'
import * as serviceWorker from './serviceWorker';
import {BrowserRouter, Route} from 'react-router-dom'

const webroutes = (
    <BrowserRouter>
        <div>
            <Route exact path="/" component={Pick} />
            <Route exact path="/DecisionTree" component={DTree} />
            <Route exact path='/KNearestNeighbors' component={KNN} />
        </div>
    </BrowserRouter>
)

ReactDOM.render(webroutes, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
