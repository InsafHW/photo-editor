import React, {useRef} from 'react'

import classes from "./Navbar.module.css"
import ImportPhotoFromPC from "./ImportPhotoFromPC/ImportPhotoFromPC"
import ImportPhotoFromPixels from "./ImportPhotoFromPixels/ImportPhotoFromPixels"
import ImportFromWebcamera from "./ImportFromWebcamera/ImporFromWebcamera"
import ExportToPC from "./ExportToPC/ExportToPC"

const Navbar = (props: any) => {
  return (
    <nav className={classes.Navbar}>
      <ImportPhotoFromPC/>
      <ImportPhotoFromPixels/>
      <ImportFromWebcamera />
      <ExportToPC />
    </nav>
  )
}

export default Navbar