import React, {useRef} from 'react'
import * as actionTypes from "../../../store/actions"
import { connect } from 'react-redux'
import classes from './ImportPhotoFromPC.module.css'
import changeSelectedObject from "../../../functionsTS/ChangeSelectedObject"
import {ImageUI} from "../../../modelsTS/ImagUI"

const importPhotoFromPC = (props: any) => {
  const importHandler = (e: any) => {
    if (e.target && e.target.files) {
      const file = e.target.files[0]
      const reader = new FileReader()
      if (!reader) return;
      reader.readAsDataURL(file)
      reader.addEventListener("load", () => {
        let url = ''
        if (reader.result) {
          url = reader.result.toString()
        }
        const image = new Image();
        image.src = url;
        const canv = document.querySelector('#canvas') as HTMLCanvasElement;
        const ctx = canv.getContext('2d');
        if (props.selectedObj) {
          if (ctx) {
            ctx.fillStyle = props.selectedObj.fillColor;
          }
          const object = {
            topLeft: {
              x: props.selectedObj.topLeft.x,
              y: props.selectedObj.topLeft.y
            },
            size: {
              width: props.selectedObj.size.width,
              height: props.selectedObj.size.height
            }
          }
          switch (props.selectedObj.type) {
            case 'rectangle':
              drawRectangle(object, ctx);
              break;
            case 'triangle':
              drawTriangle(object, ctx);
              break;
            case 'ellipse':
              drawEllipse(object, ctx);
              break;
            default:
              break;
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
        <i className="material-icons">attach_file</i>
        <span className={classes.title}>Добавить файл</span>
        <input type="file" onChange={importHandler}/>
      </label>
    </div>
  )
}

function drawRectangle(object: any, ctx: CanvasRenderingContext2D | undefined | null) {
  console.log('[DRAWING RECT]', object)
  ctx?.fillRect(object.topLeft.x, object.topLeft.y, object.size.width, object.size.height);
}

function drawEllipse(object: any, ctx: CanvasRenderingContext2D | undefined | null) {
  let radiusX = object.size.width / 2;
  let radiusY = object.size.height / 2;
  let centerX = object.topLeft.x + radiusX;
  let centerY = object.topLeft.y + radiusY;
  ctx?.beginPath();
  ctx?.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
  ctx?.fill();
}

function drawTriangle(object: any, ctx: CanvasRenderingContext2D | undefined | null) {
  ctx?.beginPath();
  ctx?.moveTo(object.topLeft.x, object.topLeft.y + object.size.height);
  ctx?.lineTo(object.topLeft.x + object.size.width / 2, object.topLeft.y);
  ctx?.lineTo(object.topLeft.x + object.size.width, object.topLeft.y + object.size.height);
  ctx?.lineTo(object.topLeft.x, object.topLeft.y + object.size.height);
  ctx?.fill();
}

function drawImage(object: any, ctx: CanvasRenderingContext2D | undefined | null) {
  console.log('[DRAWIMAGE]', object)
}

const mapStateToProps = (state: any) => {
  return {
    selectedObj: state.editor.selectedObject
  }
}

const mapDispatchToProps = (dispatch: Function) => {
  return {
    changeSelectedObject: (object: any) => dispatch({type: actionTypes.CHANGE_SELECTED_OBJECT, newObject: object}),
    saveImageData: (imgData: ImageData) => dispatch({type: actionTypes.SAVE_IMAGE_DATA, data: imgData})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(importPhotoFromPC);