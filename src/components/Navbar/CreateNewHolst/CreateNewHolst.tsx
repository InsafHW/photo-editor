import React, { useState } from 'react'
import { VscNewFile } from "react-icons/vsc"
import classes from "./CreateNewHolst.module.css"
import Backdrop from "../../Backdrop/Backdrop"
import * as actionTypes from "../../../store/actions"
import { connect } from "react-redux"

const CreateNewHolst = (props: any) => {
  const [creating, setCreating] = useState(false);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);

  const createHandler = () => {
    props.create(width, height);
    setCreating(false);
  }

  return (
    <React.Fragment>
      <Backdrop backdrop={creating} clicked={() => setCreating(false)}/>
      {creating ? (
        <div className={classes.Module}>
          <h2>После создания нового холста, старое содержимое удалится.</h2>
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
            <button onClick={createHandler}>OK</button>
            <button onClick={() => setCreating(false)}>CANCEL</button>
          </div>
        </div>
      ) : null}
      <VscNewFile className={classes.Item} color="white" size="2em" onClick={() => setCreating(true)}/>
    </React.Fragment>
  )
}

const mapDispatchToProps = (dispatch: Function) => {
  return {
    create: (width: number, height: number) => dispatch({type: actionTypes.CREATE_NEW_HOLST, size: {width: width, height: height}})
  }
}

export default connect(null, mapDispatchToProps)(CreateNewHolst);