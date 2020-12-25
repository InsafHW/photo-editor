import React, { useState } from 'react'

import { FiEdit } from "react-icons/fi"
import classes from "./ResizeHolst.module.css"
import { connect } from "react-redux"
import Backdrop from "../../Backdrop/Backdrop"
import * as actionTypes from "../../../store/actions"

const ResizeHolst = (props: any) => {
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [resizing, setResizing] = useState(false);
  const resizeHandler = () => {
    props.resize(width, height)
    setResizing(false);
  }

  return (
    <React.Fragment>
      <Backdrop backdrop={resizing} clicked={() => setResizing(false)}/>
      {resizing ? (
        <div>
          <div className={classes.Module}>
            <div className={classes.Inputs}>
              <div>
                <span>Ширина: </span>
                <input type="number" value={width} onChange={(e) => setWidth(+e.target.value)}/>
              </div>
              <div>
                <span>Высота: </span>
                <input type="number" value={height} onChange={(e) => setHeight(+e.target.value)}/>
              </div>
            </div>
            <div className={classes.buttons}>
              <button onClick={resizeHandler}>OK</button>
              <button onClick={() => setResizing(false)}>CANCEL</button>
            </div>
          </div>
        </div>
      ) : null}
      <FiEdit size="1.9em" color="white" className={classes.Item} onClick={() => setResizing(true)}/>
    </React.Fragment>
  )
}

const mapDispatchToProps = (dispatch: Function) => {
  return {
    resize: (width: number, height: number) => dispatch({type: actionTypes.RESIZE_CANVAS, size: {width: width, height: height}})
  }
}

export default connect(null, mapDispatchToProps)(ResizeHolst);