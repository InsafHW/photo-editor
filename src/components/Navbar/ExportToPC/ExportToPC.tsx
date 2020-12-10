import React, { useEffect } from 'react'
import {downloadToPC} from "../../../functionsTS/ExportToPC"
import classes from './ExportToPC.module.css'
import { drawEllipse, drawImage, drawRectangle, drawText, drawTriangle } from '../../../functionsTS/DrawHelper'
import {Rectangle, Triangle, Ellipse} from "../../../modelsTS/Primitives"
import { ImageUI } from '../../../modelsTS/ImagUI'
import { TextUI } from '../../../modelsTS/TextUI'
import { connect } from 'react-redux'
import { stat } from 'fs'

const ExportToPC = (props: any) => {
  return (
    <button className={classes.Element} 
      onClick={() => {
        console.log('[EXPORT]', props)
        const canv = document.createElement('canvas');
        canv.width = props.data.width;
        canv.height = props.data.height;
        canv.style.display = 'none';
        canv.id = 'tempCanv'
        const root = document.querySelector('#root');
        if (root) {
          root.appendChild(canv);
          const ctx = canv.getContext('2d');
          ctx?.putImageData(props.data, 0, 0);
          if (props.selectedObj) {
            switch (props.selectedObj.type) {
              case 'rectangle':
                drawRectangle(props.selectedObj as Rectangle, canv);
                break;
              case 'triangle':
                drawTriangle(props.selectedObj as Triangle, canv);
                break;
              case 'ellipse':
                drawEllipse(props.selectedObj as Ellipse, canv);
                break;
              case 'image':
                // ctx?.drawImage(props.selectedObj)
                drawImage(props.selectedObj as ImageUI, canv);
                break;
              case 'text':
                drawText({...props.selectedObj, text: props.text, fontSize: props.fontSize} as TextUI, canv);
                break;
              default:
                break;
            }
          }
          if (ctx) {
            const imgData = ctx.getImageData(0, 0, canv.width, canv.height);
            root.removeChild(canv)
            downloadToPC(imgData as ImageData);
          }
        }
        
      }}
    >Export</button>
  )
}

const mapStateToProps = (state: any) => {
  return {
    selectedObj: state.editor.selectedObject,
    data: state.editor.canvas,
    text: state.view.text,
    fontSize: state.view.fontSize
  }
}

export default connect(mapStateToProps, null)(ExportToPC);