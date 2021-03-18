import React, { useState, useRef } from 'react'
import { connect } from "react-redux"
import { BiWebcam } from "react-icons/bi"

import Backdrop from "../../Backdrop/Backdrop"

import { drawPrimitive } from "../../../functionsTS/canvasHelper"

import classes from "./ImportFromWebcamera.module.css"
import * as actionTypes from "../../../store/actions"
import { ImageUI } from '../../../modelsTS/ImagUI'
import Button from '../../Button/Button'

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
          const image = new Image();
          image.src = props.selectedObj.src;
          image.onload = () => {
            ctx?.drawImage(image, props.selectedObj.topLeft.x, props.selectedObj.topLeft.y, props.selectedObj.size.width, props.selectedObj.size.height)
            const imgData = ctx?.getImageData(0, 0, canv.width, canv.height);
            props.saveImageData(imgData);
          }
        } else {
          drawPrimitive(ctx, props.selectedObj);
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
          {!captured ? (
            <Button callback={captureHandler}>Take photo</Button>
          ) : null}
          {captured ? (
          <div className={classes.ButtonWrapper}>
            <Button callback={reshootHandler}>New photo</Button>
            <Button callback={addToHolstHandler}>Add to holst</Button>
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
    selectedObj: state.editor.present.selectedObject,
    canvas: state.editor.present.canvas
  }
}

const mapDispatchToProps = (dispatch: Function) => {
  return {
    changeSelectedObject: (object: any) => dispatch({type: actionTypes.CHANGE_SELECTED_OBJECT, newObject: object}),
    saveImageData: (imgData: ImageData) => dispatch({type: actionTypes.SAVE_IMAGE_DATA, data: imgData})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImportFromWebcamera);