import classes from "./Backdrop.module.css"
import React from 'react'

const backdrop = (props: any) => (
  props.backdrop ? (
    <div className={classes.Backdrop}></div>
  ) : null
)

export default backdrop;