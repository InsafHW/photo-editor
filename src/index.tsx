import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import editorReducer from "./store/reducers/editor"
import viewReducer from "./store/reducers/view"
import undoable from 'redux-undo';
import { ignoreActions } from 'redux-ignore'
import * as actionTypes from "./store/actions"

const rootReducer = combineReducers({
  editor: undoable(editorReducer),
  view: viewReducer
})
export const store = createStore(rootReducer);

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
