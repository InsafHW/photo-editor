import React, {useRef} from 'react'

import classes from "./Navbar.module.css"
import ImportPhotoFromPC from "./ImportPhotoFromPC/ImportPhotoFromPC"
import ImportPhotoFromPixels from "./ImportPhotoFromPixels/ImportPhotoFromPixels"
import ExportToPC from "./ExportToPC/ExportToPC"

const Navbar = (props: any) => {
  return (
    <nav className={classes.Navbar}>
      <ImportPhotoFromPC/>
      <ImportPhotoFromPixels/>
      <ExportToPC />
    </nav>
  )
}

export default Navbar