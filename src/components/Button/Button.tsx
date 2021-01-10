import React from 'react'
import classes from "./Button.module.css"

const Button = (props: any) => {
  return (
    <button className={classes.Button} 
      onClick={props.callback}
      >
    {props.children}</button>
  )
}

export default Button;