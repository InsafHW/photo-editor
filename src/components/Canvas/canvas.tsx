/* eslint-disable no-mixed-operators */
import React, { useState, useRef, useEffect } from 'react'
import { connect } from "react-redux"

import {redraw, drawPrimitive} from "../../functionsTS/canvasHelper"
import { Point } from '../../modelsTS/Point'
import * as actionTypes from "../../store/actions"
import {SelObj} from '../../modelsTS/SelObj'
import {Rectangle, Triangle, Ellipse, Area} from "../../modelsTS/Primitives"
import {TextUI} from "../../modelsTS/TextUI"

import classes from "./canvas.module.css"
import { ImageUI } from '../../modelsTS/ImagUI'

const RESIZING_RADIUS = 10;
const MIN_WIDTH = 20;
const MIN_HEIGHT = 20;


const Canvas = (props: any) => {
  const [downpos, setDownpos] = useState<Point>({x: 0, y: 0});
  const canvasEl = useRef<HTMLCanvasElement|null>(null);
  const [inFigure, setInFigure] = useState<Boolean>(false);
  const shapeBorder = useRef({left: 0, top: 0, width: 0, height: 0});
  const [drawing, setDrawing] = useState(false);
  const [resizing, setResizing] = useState(false);
  const movedelta = useRef(0);
  const resizePos = useRef(0);
  const img = useRef<HTMLImageElement|null>(null);

  const updateShapeBorder = (loc: Point) => {
    const width = Math.abs(loc.x - downpos.x);
    const height = Math.abs(loc.y - downpos.y);
    let left: number, top: number;

    if (loc.x > downpos.x) {
      left = downpos.x;
    } else {
      left = loc.x;
    }

    if (loc.y > downpos.y) {
      top = downpos.y;
    } else {
      top = loc.y;
    }

    shapeBorder.current = {
      left: left,
      top: top,
      width: width,
      height: height
    }
  }

  const getMousePosition = (x: number, y: number) => {
    if (canvasEl.current) {
      const canvasSizeData = canvasEl.current.getBoundingClientRect();
      return {
        x: (x - canvasSizeData.left) * (canvasEl.current.width / canvasSizeData.width),
        y: (y - canvasSizeData.top) * (canvasEl.current.height / canvasSizeData.height)
      }
    }
  }

  const makeFigure = (type: any) => {
    let object: any = {
      topLeft: {
        x: shapeBorder.current.left,
        y: shapeBorder.current.top
      },
      size: {
        width: shapeBorder.current.width,
        height: shapeBorder.current.height
      },
      fillColor: props.fillColor,
      type: type
    }
    switch (type) {
      case SelObj.rectangle:
        return object as Rectangle;
      case SelObj.triangle:
        return object as Triangle;
      case SelObj.ellipse:
        return object as Ellipse;
      case SelObj.area:
        return object as Area;
      case SelObj.image:
        object.src = props.selectedObj ? props.selectedObj.src : null;
        return object as ImageUI;
      case SelObj.text:
        object.text = props.text || null;
        object.fontSize = props.fontSize;
        return object as TextUI;
      default:
        break;
    }
  }

  const isInFigure = (loc: Point) => {
    if (props.selectedObj && loc && canvasEl.current) {
      if (props.selectedObj.type === 'area') return false;
      if (loc.x < props.selectedObj.topLeft.x
        || loc.x > props.selectedObj.topLeft.x + props.selectedObj.size.width
        || loc.x > props.selectedObj.topLeft.x + props.selectedObj.size.width
        || loc.y < props.selectedObj.topLeft.y
        || loc.y > props.selectedObj.topLeft.y + props.selectedObj.size.height) {
          return false;
      } else {
        return true;
      }
    }
    return false;
  }

  const isInResizingZone = (loc: Point) => {
    if (props.selectedObj && loc && canvasEl.current) {
      const obj = {...props.selectedObj};
      const resizingZone = {
        start: {
          leftTop: {
            x: obj.topLeft.x,
            y: obj.topLeft.y
          },
          rightTop: {
            x: obj.topLeft.x + obj.size.width,
            y: obj.topLeft.y
          },
          leftBottom: {
            x: obj.topLeft.x,
            y: obj.topLeft.y + obj.size.height
          },
          rightBottom: {
            x: obj.topLeft.x + obj.size.width,
            y: obj.topLeft.y + obj.size.height
          }
        },
        end: {
          leftTop: {
            x: obj.topLeft.x - RESIZING_RADIUS * 2,
            y: obj.topLeft.y - RESIZING_RADIUS * 2
          },
          rightTop: {
            x: obj.topLeft.x + obj.size.width + RESIZING_RADIUS * 2,
            y: obj.topLeft.y - RESIZING_RADIUS * 2
          },
          leftBottom: {
            x: obj.topLeft.x - RESIZING_RADIUS * 2,
            y: obj.topLeft.y + obj.size.height + RESIZING_RADIUS * 2
          },
          rightBottom: {
            x: obj.topLeft.x + obj.size.width + RESIZING_RADIUS * 2,
            y: obj.topLeft.y + obj.size.height + RESIZING_RADIUS * 2
          }
        }
      }
      if (loc.x < resizingZone.start.leftTop.x && loc.x > resizingZone.end.leftTop.x && loc.y < resizingZone.start.leftTop.y && loc.y > resizingZone.end.leftTop.y) {
        return 1;
      } else if (loc.x > resizingZone.start.rightTop.x && loc.x < resizingZone.end.rightTop.x && loc.y < resizingZone.start.rightTop.y && loc.y > resizingZone.end.rightTop.y) {
        return 2;
      } else if (loc.x < resizingZone.start.leftBottom.x && loc.x > resizingZone.end.leftBottom.x && loc.y > resizingZone.start.leftBottom.y && loc.y <resizingZone.end.leftBottom.y) {
        return 3;
      } else if (loc.x > resizingZone.start.rightBottom.x && loc.x < resizingZone.end.rightBottom.x && loc.y > resizingZone.start.rightBottom.y && loc.y < resizingZone.end.rightBottom.y) {
        return 4;
      }
      return false;
    }
    return false;
  }

  const drawResizingElements = () => {
    const ctx = canvasEl.current?.getContext('2d');
    ctx?.beginPath();
    ctx?.arc(shapeBorder.current.left - RESIZING_RADIUS, shapeBorder.current.top - RESIZING_RADIUS, RESIZING_RADIUS, 0, Math.PI * 2);
    ctx?.stroke();
    ctx?.beginPath();
    ctx?.arc(shapeBorder.current.left + shapeBorder.current.width + RESIZING_RADIUS, shapeBorder.current.top - RESIZING_RADIUS, RESIZING_RADIUS, 0, Math.PI * 2);
    ctx?.stroke();
    ctx?.beginPath();
    ctx?.arc(shapeBorder.current.left - RESIZING_RADIUS, shapeBorder.current.top + shapeBorder.current.height + RESIZING_RADIUS, RESIZING_RADIUS, 0, Math.PI * 2);
    ctx?.stroke();
    ctx?.beginPath();
    ctx?.arc(shapeBorder.current.left + shapeBorder.current.width + RESIZING_RADIUS, shapeBorder.current.top + shapeBorder.current.height + RESIZING_RADIUS, RESIZING_RADIUS, 0, Math.PI * 2);
    ctx?.stroke();
    ctx?.beginPath();
    ctx?.strokeRect(shapeBorder.current.left, shapeBorder.current.top, shapeBorder.current.width, shapeBorder.current.height);
    ctx?.closePath();
  }

  const drawSelectedObject = () => {
    const ctx = canvasEl.current?.getContext('2d');
    if (ctx) {
      ctx.fillStyle = props.fillColor;
    }
    if (props.selectedObj.type === 'image') {
      if (img.current && img.current.src === props.selectedObj.src || img.current && !props.selectedObj.src) {
        ctx?.drawImage(img.current, props.selectedObj.topLeft.x, props.selectedObj.topLeft.y, img.current.width, img.current.height)
      } else {
          const image = new Image();
          image.src = props.selectedObj.src;
          image.onload = () => {
          const width = image.width;
          const height = image.height;
          shapeBorder.current.left = props.selectedObj.topLeft.x;
          shapeBorder.current.top = props.selectedObj.topLeft.y;
          shapeBorder.current.width = width;
          shapeBorder.current.height = height;
          img.current = image;
          ctx?.drawImage(image, shapeBorder.current.left, shapeBorder.current.top, width, height)
        }
      }
    } else if (props.selectedObj.type === 'text') {
      console.log('TEXT')
        if (ctx) {
          ctx.font = `normal ${props.fontSize}px ${props.fontFamily}`;
          ctx.fillStyle = props.fillColor;
        }
        ctx?.strokeRect(shapeBorder.current.left - props.fontSize, shapeBorder.current.top, props.fontSize * (props.text.length) / 1.75, props.fontSize);
        ctx?.fillText(props.text, props.selectedObj.topLeft.x , props.selectedObj.topLeft.y + (+props.fontSize));
    } else {
      drawPrimitive(ctx, props.selectedObj.type, props.selectedObj);
    }
  }

  useEffect(() => {
    const ctx = canvasEl.current?.getContext('2d');
    redraw(ctx, props.data, props.data.width, props.data.height);
    if (props.selectedObj) {
      drawSelectedObject();
      ctx?.beginPath();
      ctx?.arc(props.selectedObj.topLeft.x - RESIZING_RADIUS, props.selectedObj.topLeft.y - RESIZING_RADIUS, RESIZING_RADIUS, 0, Math.PI * 2);
      ctx?.stroke();
      ctx?.beginPath();
      ctx?.arc(props.selectedObj.topLeft.x + props.selectedObj.size.width +  RESIZING_RADIUS, props.selectedObj.topLeft.y - RESIZING_RADIUS, RESIZING_RADIUS, 0, Math.PI * 2);
      ctx?.stroke();
      ctx?.beginPath();
      ctx?.arc(props.selectedObj.topLeft.x - RESIZING_RADIUS, props.selectedObj.topLeft.y + props.selectedObj.size.height + RESIZING_RADIUS, RESIZING_RADIUS, 0, Math.PI * 2);
      ctx?.stroke();
      ctx?.beginPath();
      ctx?.arc(props.selectedObj.topLeft.x + props.selectedObj.size.width + RESIZING_RADIUS, props.selectedObj.topLeft.y + props.selectedObj.size.height + RESIZING_RADIUS, RESIZING_RADIUS, 0, Math.PI * 2);
      ctx?.stroke();
      ctx?.strokeRect(props.selectedObj.topLeft.x, props.selectedObj.topLeft.y, props.selectedObj.size.width, props.selectedObj.size.height);
      ctx?.closePath();
    }
  }, [props.selectedObj, props.text, props.fontSize, props.fillColor])

  return (
    <div className={classes.Canvas}>
      <canvas id="canvas" 
        width={props.data.width} 
        height={props.data.height} 
        ref={canvasEl}
        onMouseDown={(e) => {
          const loc = getMousePosition(e.clientX, e.clientY);
          if (loc) {
            let pointInFigure = isInFigure(loc);
            let pointInResizing = isInResizingZone(loc);
            if (pointInFigure) {
              setInFigure(true);
              drawResizingElements();
            } else if (pointInResizing) {
              resizePos.current = pointInResizing;
              setResizing(true);
            } else {
              setDrawing(true);
            }
            // if (props.currentTool === 'text') {
            //   const ctx = canvasEl.current?.getContext('2d');
            //   if (!ctx) return;
            //   ctx.font = `normal ${props.fontSize}px Open-sans, sans-serif`;
            //   ctx.fillStyle = props.fillColor;
            //   ctx?.strokeRect(loc.x - props.fontSize, loc.y, props.fontSize * (props.text.length) / 1.75, props.fontSize);
            //   ctx?.fillText(props.text, loc.x - props.fontSize, loc.y + props.fontSize / 1.3)
            // }
            setDownpos(loc);
          }
        }}
        onMouseMove={(e) => {
          const loc = getMousePosition(e.clientX, e.clientY);
          const ctx = canvasEl.current?.getContext('2d');
          if (drawing && loc && ctx && props.currentTool !== 'text') {
            movedelta.current = Math.abs(e.movementX) + Math.abs(e.movementY);
            updateShapeBorder(loc);
            redraw(ctx, props.data, props.data.width, props.data.height);
            if (props.selectedObj) {
              drawSelectedObject();
            }
            if (ctx) {
              ctx.fillStyle = props.fillColor;
            }
            const object: Rectangle | Triangle | Ellipse = {
              topLeft: {
                x: shapeBorder.current.left,
                y: shapeBorder.current.top
              },
              size: {
                width: shapeBorder.current.width,
                height: shapeBorder.current.height
              },
              fillColor: props.fillColor,
              type: props.currentTool
            }
            if (props.currentTool === 'text') {
              if (ctx) {
                ctx.font = `normal ${props.fontSize}px Arial`;
              }
              ctx.beginPath();
              ctx.fillText(props.text, shapeBorder.current.left, shapeBorder.current.top + (+props.fontSize));
            } else {
              drawPrimitive(ctx, props.currentTool, object);
            }
            drawResizingElements();
          } else if (inFigure && loc && canvasEl.current) {
            if (ctx) {
              ctx.fillStyle = props.fillColor;
            }
            movedelta.current = Math.abs(e.movementX) + Math.abs(e.movementY);
            shapeBorder.current.left += e.movementX;
            shapeBorder.current.top += e.movementY;
            const object = {
              topLeft: {
                x: shapeBorder.current.left,
                y: shapeBorder.current.top
              },
              size: {
                width: shapeBorder.current.width,
                height: shapeBorder.current.height
              },
              fillColor: props.fillColor,
              type: props.selectedObj.type
            }
            redraw(ctx, props.data, props.data.width, props.data.height);
            if (object.type === 'image' && img.current) {
              ctx?.drawImage(img.current, shapeBorder.current.left, shapeBorder.current.top, shapeBorder.current.width, shapeBorder.current.height)
            }
            drawPrimitive(ctx, props.selectedObj.type, object);
            drawResizingElements();
          } else if (resizing && loc && canvasEl.current) {
            movedelta.current = Math.abs(e.movementX) + Math.abs(e.movementY);
            let isWidthMin = shapeBorder.current.width < MIN_WIDTH;
            let isHeightMin = shapeBorder.current.height < MIN_HEIGHT;
            if (resizePos.current === 1) {
              if (!isWidthMin || e.movementX < 0) {
                shapeBorder.current.left += e.movementX;
                shapeBorder.current.width += (-e.movementX);
              }
              if (!isHeightMin || e.movementY < 0) {
                shapeBorder.current.top += e.movementY;
                shapeBorder.current.height += (-e.movementY);
              }
            }
            else if (resizePos.current === 2) {
              if (!isWidthMin || e.movementX > 0) {
                shapeBorder.current.width += (e.movementX);
              }
              if (!isHeightMin || e.movementY < 0) {
                shapeBorder.current.top += e.movementY;
                shapeBorder.current.height += (-e.movementY);
              }
            } else if (resizePos.current === 3) {
              if (!isWidthMin || e.movementX < 0) {
                shapeBorder.current.left += e.movementX;
                shapeBorder.current.width += (-e.movementX);
              }
              if (!isHeightMin || e.movementY > 0) {
                shapeBorder.current.height += (e.movementY);
              }
              
            } else if (resizePos.current === 4) {
              if (!isWidthMin || e.movementX > 0) {
                shapeBorder.current.width += e.movementX;
              }
              if (!isHeightMin || e.movementY > 0) {
                shapeBorder.current.height += e.movementY;
              }
            }
            const object: Rectangle | Triangle | Ellipse | ImageUI | TextUI = {
              topLeft: {
                x: shapeBorder.current.left,
                y: shapeBorder.current.top
              },
              size: {
                width: shapeBorder.current.width,
                height: shapeBorder.current.height
              },
              fillColor: props.fillColor,
              type: props.selectedObj.type
            }
            redraw(ctx, props.data, props.data.width, props.data.height);
            if (props.selectedObj && props.selectedObj.type === 'image' && img.current) {
              ctx?.drawImage(img.current, shapeBorder.current.left, shapeBorder.current.top, shapeBorder.current.width, shapeBorder.current.height);
            } else {
              drawPrimitive(ctx, props.selectedObj.type, object);
            }
            drawResizingElements();
          }
        }}
        onMouseUp={(e) => {
          const ctx = canvasEl.current?.getContext('2d');
          if (movedelta.current !== 0) {
            if (img.current && (inFigure || resizing)) {
              const object = makeFigure('image');
              props.changeSelectedObject(object);
            }
            if (drawing) {
              redraw(ctx, props.data, props.data.width, props.data.height);
              if (img.current && props.selectedObj) {
                ctx?.drawImage(img.current, props.selectedObj.topLeft.x, props.selectedObj.topLeft.y, img.current.width, img.current.height);
                img.current = null;
              }
              else if (props.selectedObj) {
                drawSelectedObject();
              }
              const imgData = ctx?.getImageData(0, 0, props.data.width, props.data.height);
              props.saveImageData(imgData);
            }
            if (props.selectedObj && props.selectedObj.type === 'image' && resizing && img.current) {
              img.current.width = shapeBorder.current.width;
              img.current.height = shapeBorder.current.height;
              ctx?.drawImage(img.current, shapeBorder.current.left, shapeBorder.current.top, shapeBorder.current.width, shapeBorder.current.height);
            }
            else if (drawing || resizing) {
              const object = makeFigure(props.currentTool);
              props.changeSelectedObject(object);
            } else if (movedelta.current !== 0  && inFigure) {
              const object = makeFigure(props.selectedObj.type);
              props.changeSelectedObject(object);
            }
          }
          movedelta.current = 0;
          resizePos.current = 0;
          setDrawing(false);
          setInFigure(false);
          setResizing(false);
        }}
        ></canvas>
    </div>
  )
}

const mapStateToProps = (state: any) => {
  return {
    selectedObj: state.present.editor.selectedObject,
    data: state.present.editor.canvas,
    currentTool: state.present.editor.currentTool,
    fillColor: state.present.view.fillColor,
    text: state.present.view.text,
    fontSize: state.present.view.fontSize
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    changeSelectedObject: (newObject: any) => dispatch({type: actionTypes.CHANGE_SELECTED_OBJECT, newObject: newObject}),
    saveImageData: (imgData: ImageData) => dispatch({type: actionTypes.SAVE_IMAGE_DATA, data: imgData}),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);