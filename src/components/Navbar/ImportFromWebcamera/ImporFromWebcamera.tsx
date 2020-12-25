import React, { useState, useRef, useEffect } from 'react'
import { connect } from "react-redux"
import { BiWebcam } from "react-icons/bi"
import classes from "./ImportFromWebcamera.module.css"
import Backdrop from "../../Backdrop/Backdrop"
import * as actionTypes from "../../../store/actions"
import { drawEllipse, drawRectangle, drawTriangle } from "../../../functionsTS/DrawElements"
import canvas from '../../Canvas/canvas'
import { ImageUI } from '../../../modelsTS/ImagUI'

const ImportFromWebcamera = (props: any) => {
  const [cameraOn, setCameraOn] = useState(false);
  const source = useRef<null | MediaStreamTrack>(null);
  const videoRef = useRef<null | HTMLVideoElement>(null);
  const canvasEl = useRef<null | HTMLCanvasElement>(null);
  const [width, setWidth] = useState<number | undefined>(800);
  const [height, setHeight] = useState<number | undefined>(600);
  const [captured, setCaptured] = useState(false);

  const startHandler = () => {
    setCameraOn(true);
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          source.current = stream.getTracks()[0];
          setWidth(stream.getTracks()[0].getSettings().width)
          setHeight(stream.getTracks()[0].getSettings().height)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const closeBackdrop = () => {
    setCameraOn(false);
    setCaptured(false);
    if (source.current) {
      source.current.stop();
    }
  }

  const captureHandler = () => {
    if (canvasEl.current && videoRef.current) {
      const ctx = canvasEl.current.getContext('2d');
      canvasEl.current.width = width || 600;
      canvasEl.current.height = height || 600;
      canvasEl.current.style.width = canvasEl.current.width + 'px';
      canvasEl.current.style.height = ''+canvasEl.current.height + 'px';
      canvasEl.current.style.display = 'block';
      videoRef.current.style.display = 'none'
      ctx?.drawImage(videoRef.current, 0, 0, canvasEl.current.width, canvasEl.current.height)
      setCaptured(true);
    }
  }

  const reshootHandler = () => {
    setCaptured(false);
    if (videoRef.current && canvasEl.current) {
      videoRef.current.style.display = 'block';
      canvasEl.current.style.display = 'none'
    }
  }

  const addToHolstHandler = () => {
    if (canvasEl.current) {
      const canv = document.querySelector('#canvas') as HTMLCanvasElement;
      const ctx = canv.getContext('2d');
      ctx?.clearRect(0, 0, canv.width, canv.height);
      ctx?.putImageData(props.canvas, 0, 0);
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
        } else {
          switch (props.selectedObj.type) {
            case 'rectangle':
              drawRectangle(props.selectedObj, ctx);
              break;
            case 'triangle':
              drawTriangle(props.selectedObj, ctx);
              break;
            case 'ellipse':
              drawEllipse(props.selectedObj, ctx);
              break;
            default:
              break;
          }
        }
      }
      const imgData = ctx?.getImageData(0, 0, canv.width, canv.height);
      props.saveImageData(imgData);
      const img = new Image();
      img.src = canvasEl.current.toDataURL();
      img.onload = () => {
        ctx?.drawImage(img, 0, 0, img.width, img.height);
        const imgObj: ImageUI = {
          topLeft: {
            x: 0,
            y: 0
          },
          size: {
            width: img.width,
            height: img.height
          },
          src: img.src,
          type: 'image'
        }
        props.changeSelectedObject(imgObj);
      }
    }
    setCameraOn(false);
    setCaptured(false);
    if (source.current) {
      source.current.stop();
    }
  }

  return (
    <React.Fragment>
      <Backdrop backdrop={cameraOn} clicked={closeBackdrop}/>
      {cameraOn ? (
        <div className={classes.Module}>
          <video ref={videoRef} id="webcamera">Something went wrong...</video>
          <canvas ref={canvasEl}></canvas>
          <button id="startbutton" onClick={captureHandler}>Take photo</button>
          {captured ? (
          <div>
            <button onClick={reshootHandler}>New photo</button>
            <button onClick={addToHolstHandler}>Add to holst</button>
          </div>
      ) : null}
        </div>
      ): null}
      <BiWebcam color="white" className={classes.Icon} size="2.3em" onClick={startHandler}/>
    </React.Fragment>
  )
}

const mapStateToProps = (state: any) => {
  return {
    selectedObj: state.editor.selectedObject,
    canvas: state.editor.canvas
  }
}

const mapDispatchToProps = (dispatch: Function) => {
  return {
    changeSelectedObject: (object: any) => dispatch({type: actionTypes.CHANGE_SELECTED_OBJECT, newObject: object}),
    saveImageData: (imgData: ImageData) => dispatch({type: actionTypes.SAVE_IMAGE_DATA, data: imgData})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImportFromWebcamera);