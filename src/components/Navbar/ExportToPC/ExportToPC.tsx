import React, { useEffect } from 'react'
import { FiDownload } from "react-icons/fi"
import {downloadToPC} from "../../../functionsTS/ExportToPC"
import classes from './ExportToPC.module.css'
import { drawEllipse, drawRectangle, drawTriangle } from '../../../functionsTS/DrawElements'
import {Rectangle, Triangle, Ellipse} from "../../../modelsTS/Primitives"
import { TextUI } from '../../../modelsTS/TextUI'
import { connect } from 'react-redux'

const ExportToPC = (props: any) => {
  return (
    <FiDownload
      color="white"
      className={classes.Icon}
      onClick={() => {
      console.log('[EXPORT]', props)
      const canv = document.createElement('canvas');
      canv.width = props.data.width;
      canv.height = props.data.height;
      canv.style.display = 'none';
      canv.id = 'tempCanv'
      const root = document.querySelector('#root');
      if (root) {
        let toCont = true;
        root.appendChild(canv);
        const ctx = canv.getContext('2d');
        ctx?.putImageData(props.data, 0, 0);
        if (props.selectedObj) {
          switch (props.selectedObj.type) {
            case 'rectangle':
              drawRectangle(props.selectedObj as Rectangle, ctx);
              break;
            case 'triangle':
              drawTriangle(props.selectedObj as Triangle, ctx);
              break;
            case 'ellipse':
              drawEllipse(props.selectedObj as Ellipse, ctx);
              break;
            case 'image':
              toCont = false;
              // ctx?.drawImage(props.selectedObj)
              // drawImage(props.selectedObj as ImageUI, ctx);
              const img = new Image();
              img.src = props.selectedObj.src;
              img.onload = () => {
                img.width = props.selectedObj.width;
                img.height = props.selectedObj.height;
                ctx?.drawImage(img, props.selectedObj.topLeft.x, props.selectedObj.topLeft.y);
                if (ctx) {
                  const imgData = ctx.getImageData(0, 0, canv.width, canv.height);
                  root.removeChild(canv);
                  downloadToPC(imgData as ImageData);
                }
                return;
              }
              break;
            case 'text':
              drawText({...props.selectedObj, text: props.text, fontSize: props.fontSize, fillColor: props.fillColor} as TextUI, ctx);
              break;
            default:
              break;
          }
        }
        if (ctx && toCont) {
          const imgData = ctx.getImageData(0, 0, canv.width, canv.height);
          root.removeChild(canv)
          downloadToPC(imgData as ImageData);
        }
      }
      
    }}
    size="2.2em"></FiDownload> 
  )
}

function drawText(textObj: TextUI, ctx: CanvasRenderingContext2D | null): void {
  if (!ctx) return;
  ctx.font = `normal ${textObj.fontSize}px Open-sans, sans-serif`;
  ctx.fillStyle = textObj.fillColor;
  ctx.fillText(textObj.text, textObj.topLeft.x, textObj.topLeft.y);
}

const mapStateToProps = (state: any) => {
  return {
    selectedObj: state.editor.selectedObject,
    data: state.editor.canvas,
    text: state.view.text,
    fontSize: state.view.fontSize,
    fillColor: state.view.fillColor
  }
}

export default connect(mapStateToProps, null)(ExportToPC);