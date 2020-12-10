import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import editorReducer from "./store/reducers/editor"
import historyReducer from "./store/reducers/history"
import viewReducer from "./store/reducers/view"

const rootReducer = combineReducers({
  editor: editorReducer,
  history: historyReducer,
  view: viewReducer
})
const store = createStore(rootReducer);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
