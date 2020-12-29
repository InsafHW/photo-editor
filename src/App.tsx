import React, {useEffect} from 'react';
import { connect } from "react-redux"
import * as actionTypes from "./store/actions"
import Toolbar from "./components/Toolbar/Toolbar"
import classes from "./App.module.css"
import NewCanvas from "./components/Canvas/canvas"
import { ActionCreators } from 'redux-undo';
import { store } from "./index"

function App(props: any) {
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'z') {
        store.dispatch(ActionCreators.undo())
      } else if (e.ctrlKey && e.key === 'y') {
        // redo
        store.dispatch(ActionCreators.redo())
      }
    }
    window.addEventListener("keydown", listener);
    return () => {
      window.removeEventListener("keydown", listener)
    }
  })

  console.log('ALL STATE', props.state)

  return (
    <div className={classes.App}>
      <NewCanvas/>
      <Toolbar/>
    </div>
  )
}

const mapStateToProps = (state: any) => {
  return {
    state: state
  }
}

// const mapDispatchToProps = (dispatch: Function) => {
//   return {
//     saveImageData: (imgData: ImageData) => dispatch({type: actionTypes.SAVE_IMAGE_DATA, data: imgData})
//   }
// }

export default connect(mapStateToProps, null)(App);
