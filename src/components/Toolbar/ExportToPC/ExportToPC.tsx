import React, {useState} from 'react'
import { connect } from 'react-redux'
import { FiDownload } from "react-icons/fi"

import { drawPrimitive, drawText } from '../../../functionsTS/canvasHelper'
import {downloadToPC} from "../../../functionsTS/exportToPC"
import classes from './ExportToPC.module.css'
import Backdrop from "../../Backdrop/Backdrop"
import Button from "../../Button/Button"

const ExportToPC = (props: any) => {
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const exportHandler = (ext: string) => {
    const canv = document.createElement('canvas');
    canv.width = props.data.width;
    canv.height = props.data.height;
    canv.style.display = 'none';
    canv.id = 'tempCanv';
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
            img.width = props.selectedObj.size.width;
            img.height = props.selectedObj.size.height;
            ctx?.drawImage(img, props.selectedObj.topLeft.x, props.selectedObj.topLeft.y, img.width, img.height);
            if (ctx) {
              const imgData = ctx.getImageData(0, 0, canv.width, canv.height);
              root.removeChild(canv);
              downloadToPC(imgData as ImageData, ext);
            }
            return;
          }
        } else if (props.selectedObj.type === 'text') {
          if (ctx) {
            ctx.font = `normal ${props.fontSize}px Open-sans, sans-serif`;
            ctx.fillStyle = props.fillColor;
          }
          drawText(props.selectedObj, ctx);
        } else {
          drawPrimitive(ctx, props.selectedObj);
        }
      }
      if (ctx && toCont) {
        const imgData = ctx.getImageData(0, 0, canv.width, canv.height);
        root.removeChild(canv)
        downloadToPC(imgData as ImageData, ext);
      }
    }
  }

  return (
    <React.Fragment>
      <Backdrop backdrop={showDownloadModal} clicked={() => setShowDownloadModal(false)}/>
      {showDownloadModal ? (
        <div className={classes.DownloadModal}>
          <h2>Выберите расширение</h2>
          <div className={classes.Buttons}>
            <Button callback={() => exportHandler('jpeg')}>JPG</Button>
            <Button callback={() => exportHandler('png')}>PNG</Button>
          </div>
        </div>
      ) : null}
      <FiDownload
      color="white"
      className={classes.Icon}
      onClick={() => setShowDownloadModal(true)}
      size="2.2em"></FiDownload> 
    </React.Fragment>
  )
}

const mapStateToProps = (state: any) => {
  return {
    selectedObj: state.editor.present.selectedObject,
    data: state.editor.present.canvas,
    text: state.view.text,
    fontSize: state.view.fontSize,
    fillColor: state.view.fillColor
  }
}

export default connect(mapStateToProps, null)(ExportToPC);