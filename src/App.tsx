import React, {useEffect, useState} from 'react';
import { connect } from "react-redux"
import * as actionTypes from "./store/actions"
import Toolbar from "./components/Toolbar/Toolbar"
import classes from "./App.module.css"
import Canvas from "./components/Canvas/canvas"
import { ActionCreators } from 'redux-undo';
import { store } from "./index"

function App(props: any) {
  const [timeActionId, setTimeActionId] = useState(0);
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'z') {
        store.dispatch(ActionCreators.undo())
        setTimeActionId(timeActionId + 1)
      } else if (e.ctrlKey && e.key === 'y') {
        store.dispatch(ActionCreators.redo())
        setTimeActionId(timeActionId + 1)
      }
    }
    window.addEventListener("keydown", listener);
    return () => {
      window.removeEventListener("keydown", listener)
    }
  })

  return (
    <div className={classes.App}>
      <Canvas timeAction={timeActionId}/>
      <Toolbar />
    </div>
  )
}

const mapStateToProps = (state: any) => {
  return {
    data: state.editor.present.canvas,
    selObj: state.editor.present.selectedObject
  }
}

export default connect(mapStateToProps, null)(App);
