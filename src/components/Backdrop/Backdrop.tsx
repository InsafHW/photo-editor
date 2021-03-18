import classes from "./Backdrop.module.css"
import React from 'react'

const backdrop = (props: any) => (
  props.backdrop ? (
    <div className={classes.Backdrop} onClick={props.clicked}></div>
  ) : null
)

export default backdrop;