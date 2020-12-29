import React from 'react'
import { connect } from 'react-redux'
import { IoAttachOutline } from "react-icons/io5"

import {drawPrimitive, redraw} from "../../../functionsTS/canvasHelper"

import * as actionTypes from "../../../store/actions"
import classes from './ImportPhotoFromPC.module.css'
import {ImageUI} from "../../../modelsTS/ImagUI"

const importPhotoFromPC = (props: any) => {
  const importHandler = (e: any) => {
    if (e.target && e.target.files) {
      const file = e.target.files[0]
      const reader = new FileReader()
      if (!reader) return;
      reader.readAsDataURL(file)
      reader.addEventListener("load", () => {
        if (!reader.result) {
          return;
        }
        let url = reader.result?.toString()
        const image = new Image();
        image.src = url;
        const canv = document.querySelector('#canvas') as HTMLCanvasElement;
        const ctx = canv.getContext('2d');
        redraw(ctx, props.canvas, canv.width, canv.height);
        if (props.selectedObj) {
          if (ctx) {
            ctx.fillStyle = props.selectedObj.fillColor;
          }
          if (props.selectedObj.type === 'image') {
            console.log('[OLD IMAGE]', props.selectedObj)
            const image = new Image();
            image.src = props.selectedObj.src;
            image.onload = () => {
              ctx?.drawImage(image, props.selectedObj.topLeft.x, props.selectedObj.topLeft.y, props.selectedObj.size.width, props.selectedObj.size.height)
              const imgData = ctx?.getImageData(0, 0, canv.width, canv.height);
              props.saveImageData(imgData);
            }
          } else if (props.selectedObj.type === 'text') {
            console.log('[TEXT]', props.selectedObj)
            // ctx?.fillText('PRIVE', 10, 200)
            ctx?.fillText(props.selectedObj.text, props.selectedObj.topLeft.x, props.selectedObj.topLeft.y)
          } else {
            drawPrimitive(ctx, props.selectedObj.type, props.selectedObj);
          }
          const imgData = ctx?.getImageData(0, 0, canv.width, canv.height);
          props.saveImageData(imgData);
        }
        image.onload = () => {
          const width = image.width > canv.width ? canv.width : image.width;
          const height = image.height > canv.height ? canv.height : image.height;
          ctx?.drawImage(image, 0, 0, width, height)
          const img: ImageUI = {
            topLeft: {
              x: 0,
              y: 0
            },
            size: {
              width: width,
              height: height
            },
            src: url,
            type: 'image'
          }
          props.changeSelectedObject(img);
        }
      })
    }
  }
  return (
    <div className={classes.example}>
      <label className={classes.label}>
        <IoAttachOutline color="white" className={classes.Icon} size="2.7em"/>
        <input type="file" onChange={importHandler}/>
      </label>
    </div>
  )
}

const mapStateToProps = (state: any) => {
  return {
    selectedObj: state.present.editor.selectedObject,
    canvas: state.present.editor.canvas
  }
}

const mapDispatchToProps = (dispatch: Function) => {
  return {
    changeSelectedObject: (object: any) => dispatch({type: actionTypes.CHANGE_SELECTED_OBJECT, newObject: object}),
    saveImageData: (imgData: ImageData) => dispatch({type: actionTypes.SAVE_IMAGE_DATA, data: imgData})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(importPhotoFromPC);