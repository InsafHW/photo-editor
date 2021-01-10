/* eslint-disable no-mixed-operators */
import React, { useState, useRef, useEffect } from 'react'
import { connect } from "react-redux"

import {redraw, drawPrimitive, drawText} from "../../functionsTS/canvasHelper"
import { Point } from '../../modelsTS/Point'
import * as actionTypes from "../../store/actions"
import {SelObj} from '../../modelsTS/SelObj'
import {Rectangle, Triangle, Ellipse, Area, Primitive} from "../../modelsTS/Primitives"
import {TextUI} from "../../modelsTS/TextUI"

import classes from "./canvas.module.css"
import { ImageUI } from '../../modelsTS/ImagUI'

const RESIZING_RADIUS = 12;
const MIN_WIDTH = 20;
const MIN_HEIGHT = 20;


const Canvas = (props: any) => {
  const [downpos, setDownpos] = useState<Point>({x: 0, y: 0});
  const [inFigure, setInFigure] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [moved, setMoved] = useState(false);
  const [resizeArea, setResizeArea] = useState(0);
  const [basicShape, setBasicShape] = useState({left: 0, top: 0, width: 0, height: 0})
  const canvasEl = useRef<HTMLCanvasElement|null>(null);
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

    setBasicShape({
      left: left,
      top: top,
      width: width,
      height: height
    })
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

  const makeFigure = (type: string) => {
    let object: any = {
      topLeft: {
        x: basicShape.left,
        y: basicShape.top
      },
      size: {
        width: basicShape.width,
        height: basicShape.height
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
    ctx?.arc(basicShape.left - RESIZING_RADIUS, basicShape.top - RESIZING_RADIUS, RESIZING_RADIUS, 0, Math.PI * 2);
    ctx?.stroke();
    ctx?.beginPath();
    ctx?.arc(basicShape.left + basicShape.width + RESIZING_RADIUS, basicShape.top - RESIZING_RADIUS, RESIZING_RADIUS, 0, Math.PI * 2);
    ctx?.stroke();
    ctx?.beginPath();
    ctx?.arc(basicShape.left - RESIZING_RADIUS, basicShape.top + basicShape.height + RESIZING_RADIUS, RESIZING_RADIUS, 0, Math.PI * 2);
    ctx?.stroke();
    ctx?.beginPath();
    ctx?.arc(basicShape.left + basicShape.width + RESIZING_RADIUS, basicShape.top + basicShape.height + RESIZING_RADIUS, RESIZING_RADIUS, 0, Math.PI * 2);
    ctx?.stroke();
    ctx?.beginPath();
    ctx?.strokeRect(basicShape.left, basicShape.top, basicShape.width, basicShape.height);
    ctx?.closePath();
  }

  const drawSelectedObject = () => {
    const ctx = canvasEl.current?.getContext('2d');
    if (ctx) {
      ctx.fillStyle = props.fillColor;
      ctx.font = `normal ${props.fontSize}px Open-sans, sans-serif`;
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
            setBasicShape({
              left: props.selectedObj.topLeft.x,
              top: props.selectedObj.topLeft.y,
              width: width,
              height: height
            })
            img.current = image;
            ctx?.drawImage(image, props.selectedObj.topLeft.x, props.selectedObj.topLeft.y, width, height)
        }
      }
    } else if (props.selectedObj.type === 'text') {
      const textObj: TextUI = {
        ...props.selectedObj,
        text: props.text,
        fontSize: props.fontSize
      }
      drawText(textObj, ctx);
      if (props.text !== props.selectedObj.text || props.fontSize !== props.selectedObj.fontSize) {
        props.changeSelectedObject(textObj);
      }
    } else {
      drawPrimitive(ctx, props.selectedObj);
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
              setResizeArea(pointInResizing);
              setResizing(true);
            } else {
              setDrawing(true);
            }
            setDownpos(loc);
          }
        }}
        onMouseMove={(e) => {
          const loc = getMousePosition(e.clientX, e.clientY);
          const ctx = canvasEl.current?.getContext('2d');
          if (drawing && loc && ctx) {
            setMoved(!!(Math.abs(e.movementX) + Math.abs(e.movementY)));
            updateShapeBorder(loc);
            redraw(ctx, props.data, props.data.width, props.data.height);
            if (props.selectedObj) {
              drawSelectedObject();
            }
            if (ctx) {
              ctx.fillStyle = props.fillColor;
            }
            const object: any = {
              topLeft: {
                x: basicShape.left,
                y: basicShape.top
              },
              size: {
                width: basicShape.width,
                height: basicShape.height
              },
              fillColor: props.fillColor,
              type: props.currentTool
            }
            if (props.currentTool === 'text') {
              object.fontSize = props.fontSize;
              object.text = props.text;
              if (ctx) {
                ctx.font = `normal ${props.fontSize}px Open-sans sans-serif`;
              }
              drawText(object as TextUI, ctx);
            } else {
              drawPrimitive(ctx, object as Primitive);
            }
            drawResizingElements();
          } else if (inFigure && loc && canvasEl.current) {
            if (ctx) {
              ctx.fillStyle = props.fillColor;
            }
            setMoved(!!(Math.abs(e.movementX) + Math.abs(e.movementY)));
            setBasicShape({
              left: basicShape.left + e.movementX,
              top: basicShape.top + e.movementY,
              width: basicShape.width,
              height: basicShape.height
            })
            const object: any = {
              topLeft: {
                x: basicShape.left,
                y: basicShape.top
              },
              size: {
                width: basicShape.width,
                height: basicShape.height
              },
              fillColor: props.fillColor,
              type: props.selectedObj.type
            }
            redraw(ctx, props.data, props.data.width, props.data.height);
            if (object.type === 'image' && img.current) {
              ctx?.drawImage(img.current, basicShape.left, basicShape.top, basicShape.width, basicShape.height)
            } else if (object.type === 'text') {
              object.text = props.text;
              object.fontSize = props.fontSize;
              drawText(object as TextUI, ctx);
            } else {
              drawPrimitive(ctx, object as Primitive);
            }
            drawResizingElements();
          } else if (resizing && loc && canvasEl.current) {
            setMoved(!!(Math.abs(e.movementX) + Math.abs(e.movementY)));
            let isWidthMin = basicShape.width < MIN_WIDTH;
            let isHeightMin = basicShape.height < MIN_HEIGHT;
            if (resizeArea === 1) {
              setBasicShape({
                left: !isWidthMin || e.movementX < 0 ? basicShape.left + e.movementX : basicShape.left,
                top: !isHeightMin || e.movementY < 0 ? basicShape.top + e.movementY : basicShape.top,
                width: !isWidthMin || e.movementX < 0 ? basicShape.width - e.movementX : basicShape.width,
                height: !isHeightMin || e.movementY < 0 ? basicShape.height - e.movementY : basicShape.height
              })
            }
            else if (resizeArea === 2) {
              setBasicShape({
                left: basicShape.left,
                top: !isHeightMin || e.movementY < 0 ? basicShape.top + e.movementY : basicShape.top,
                width: !isWidthMin || e.movementX > 0 ? basicShape.width + e.movementX : basicShape.width,
                height: !isHeightMin || e.movementY < 0 ? basicShape.height - e.movementY : basicShape.height
              })
            } else if (resizeArea === 3) {
              setBasicShape({
                left: !isWidthMin || e.movementX < 0 ? basicShape.left + e.movementX : basicShape.left,
                top: basicShape.top,
                width: !isWidthMin || e.movementX < 0 ? basicShape.width - e.movementX : basicShape.width,
                height: !isHeightMin || e.movementY > 0 ? basicShape.height + e.movementY : basicShape.height
              })
            } else if (resizeArea === 4) {
              setBasicShape({
                left: basicShape.left,
                top: basicShape.top,
                width: !isWidthMin || e.movementX > 0 ? basicShape.width + e.movementX : basicShape.width,
                height: !isHeightMin || e.movementY > 0 ? basicShape.height + e.movementY : basicShape.height
              })
            }
            const object: any = {
              topLeft: {
                x: basicShape.left,
                y: basicShape.top
              },
              size: {
                width: basicShape.width,
                height: basicShape.height
              },
              fillColor: props.fillColor,
              type: props.selectedObj.type
            }
            redraw(ctx, props.data, props.data.width, props.data.height);
            if (props.selectedObj && props.selectedObj.type === 'image' && img.current) {
              ctx?.drawImage(img.current, basicShape.left, basicShape.top, basicShape.width, basicShape.height);
            } else if (props.selectedObj.type === 'text') {
              object.text = props.text;
              object.fontSize = props.fontSize;
              drawText(object as TextUI, ctx);
            } else {
              drawPrimitive(ctx, object as Primitive);
            }
            drawResizingElements();
          }
        }}
        onMouseUp={(e) => {
          const ctx = canvasEl.current?.getContext('2d');
          if (moved) {
            if (img.current && (inFigure || resizing)) {
              const object = makeFigure('image');
              props.changeSelectedObject(object);
            }
            if (drawing) {
              redraw(ctx, props.data, props.data.width, props.data.height);
              if (img.current && props.selectedObj && props.selectedObj.type === 'image') {
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
              img.current.width = basicShape.width;
              img.current.height = basicShape.height;
              ctx?.drawImage(img.current, basicShape.left, basicShape.top, basicShape.width, basicShape.height);
            }
            else if (drawing || resizing) {
              props.changeSelectedObject(makeFigure(props.currentTool));
            } else if (inFigure) {
              props.changeSelectedObject(makeFigure(props.selectedObj.type));
            }
          }
          setResizeArea(0);
          setDrawing(false);
          setInFigure(false);
          setResizing(false);
          setMoved(false);
        }}
      ></canvas>
    </div>
  )
}

const mapStateToProps = (state: any) => {
  return {
    selectedObj: state.editor.present.selectedObject,
    data: state.editor.present.canvas,
    currentTool: state.editor.present.currentTool,
    fillColor: state.view.fillColor,
    text: state.view.text,
    fontSize: state.view.fontSize
  }
}

const mapDispatchToProps = (dispatch: Function) => {
  return {
    changeSelectedObject: (newObject: Rectangle | Triangle | Ellipse | ImageUI | TextUI) => dispatch({type: actionTypes.CHANGE_SELECTED_OBJECT, newObject: newObject}),
    saveImageData: (imgData: ImageData) => dispatch({type: actionTypes.SAVE_IMAGE_DATA, data: imgData}),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);