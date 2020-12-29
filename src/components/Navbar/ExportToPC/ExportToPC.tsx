import React from 'react'
import { connect } from 'react-redux'
import { FiDownload } from "react-icons/fi"

import { drawPrimitive } from '../../../functionsTS/canvasHelper'
import {downloadToPC} from "../../../functionsTS/exportToPC"
import classes from './ExportToPC.module.css'
import { TextUI } from '../../../modelsTS/TextUI'

const ExportToPC = (props: any) => {
  const exportHandler = () => {
    const canv = document.createElement('canvas');
    canv.width = props.data.width;
    canv.height = props.data.height;
    canv.style.display = 'none';
    canv.id = 'tempCanv'
    console.log('[EXPORT]', props.selectedObj)
    const root = document.querySelector('#root');
    if (root) {
      let toCont = true;
      root.appendChild(canv);
      const ctx = canv.getContext('2d');
      ctx?.putImageData(props.data, 0, 0);
      if (props.selectedObj) {
        if (props.selectedObj.type === 'image') {
          toCont = false;
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
        } else if (props.selectedObj.type === 'text') {
          drawText({...props.selectedObj, text: props.text, fontSize: props.fontSize, fillColor: props.fillColor} as TextUI, ctx);
        } else {
          if (ctx) {
            ctx.fillStyle = props.fillColor
          }
          drawPrimitive(ctx, props.selectedObj.type, props.selectedObj);
        }
      }
      if (ctx && toCont) {
        const imgData = ctx.getImageData(0, 0, canv.width, canv.height);
        root.removeChild(canv)
        downloadToPC(imgData as ImageData);
      }
    }
  }
  return (
    <FiDownload
      color="white"
      className={classes.Icon}
      onClick={exportHandler}
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
    selectedObj: state.present.editor.selectedObject,
    data: state.present.editor.canvas,
    text: state.present.view.text,
    fontSize: state.present.view.fontSize,
    fillColor: state.present.view.fillColor
  }
}

export default connect(mapStateToProps, null)(ExportToPC);