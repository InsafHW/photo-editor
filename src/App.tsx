import React, {useState, useRef, useEffect} from 'react';
import { connect } from "react-redux"
import * as actionTypes from "./store/actions"
import Navbar from "./components/Navbar/Navbar"
// import Holst from "./components/Holst/Holst"
import Toolbar from "./components/Toolbar/Toolbar"
import classes from "./App.module.css"
import { Tool } from './modelsTS/Editor';
import Canvas from "./components/Canvas/canvas"
import NewCanvas from "./components/Canvas/canvasNewEdi"

function App(props: any) {
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'z') {
        console.log('[history]', props.history)
        alert("CTRL Z")
        props.saveImageData(props.history[props.currentId - 1]);
      } else if (e.ctrlKey && e.key === 'y') {
        // redo
        console.log('[history]', props.history)
        alert("CTRL Y")
      }
    }
    window.addEventListener("keydown", listener);
    return () => {
      window.removeEventListener("keydown", listener)
    }
  })

  return (
    <React.Fragment>
      <div className={classes.App}>
        <Navbar/>
        <NewCanvas/>
        {/* <Cnvs /> */}
        <Toolbar/>
      </div>
    </React.Fragment>
    
  )
}

const mapStateToProps = (state: any) => {
  return {
    history: state.history.history,
    currentId: state.editor.currentId
  }
}

const mapDispatchToProps = (dispatch: Function) => {
  return {
    saveImageData: (imgData: ImageData) => dispatch({type: actionTypes.SAVE_IMAGE_DATA, data: imgData})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
