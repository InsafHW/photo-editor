import React, { useState, useRef, useEffect } from 'react'
import { connect } from "react-redux"
import { drawEllipse, drawImage, drawRectangle, drawTriangle } from '../../functionsTS/DrawHelper'
import { Tool } from '../../modelsTS/Editor'
import { ImageUI } from '../../modelsTS/ImagUI'
import { Point } from '../../modelsTS/Point'
import { Ellipse, Primitive, Rectangle, Triangle } from '../../modelsTS/Primitives'
import * as actionTypes from "../../store/actions"

import classes from "./canvas.module.css"

const RESIZING_RADIUS = 8;

const Canvas = (props: any) => {
  const [downpos, setDownpos] = useState<Point>({x: 0, y: 0});
  const canvasEl = useRef<HTMLCanvasElement|null>(null);
  const [inFigure, setInFigure] = useState<Boolean>(false);
  const shapeBorder = useRef({left: 0, top: 0, width: 0, height: 0});
  const [drawing, setDrawing] = useState(false);
  const [resizing, setResizing] = useState(false);
  const movedelta = useRef(0);
  const resizePos = useRef(0);

  const updateShapeBorder = (loc: Point) => {
    const width = Math.abs(loc.x - downpos.x);
    const height = Math.abs(loc.y - downpos.y);
    let left, top;

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
      const ctx = canvasEl.current.getContext('2d');
      const canvasSizeData = canvasEl.current.getBoundingClientRect();
      return {
        x: (x - canvasSizeData.left) * (canvasEl.current.width / canvasSizeData.width),
        y: (y - canvasSizeData.top) * (canvasEl.current.height / canvasSizeData.height)
      }
    }
  }

  const makeFigure = () => {
    return {
      topLeft: {
        x: shapeBorder.current.left,
        y: shapeBorder.current.top
      },
      size: {
        width: shapeBorder.current.width,
        height: shapeBorder.current.height
      },
      type: props.currentTool,
      fillColor: props.fillColor
    }
  }

  const isInFigure = (loc: Point) => {
    if (props.selectedObj && loc && canvasEl.current) {
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

  useEffect(() => {
    console.log('[RENDER]', props.selectedObj); 
    const ctx = canvasEl.current?.getContext('2d');
    ctx?.clearRect(0, 0, props.width, props.height);
    ctx?.putImageData(props.data, 0, 0);
    if (props.selectedObj) {
      switch (props.selectedObj.type) {
        case 'rectangle':
          ctx?.fillRect(props.selectedObj.topLeft.x, props.selectedObj.topLeft.y, props.selectedObj.size.width, props.selectedObj.size.height);
          break;
        case 'ellipse':
          let radiusX = props.selectedObj.size.width / 2;
          let radiusY = props.selectedObj.size.height / 2;
          let centerX = props.selectedObj.topLeft.x + radiusX;
          let centerY = props.selectedObj.topLeft.y + radiusY;
          ctx?.beginPath();
          ctx?.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
          ctx?.fill();
          break;
        case 'triangle':
          ctx?.beginPath();
          ctx?.moveTo(props.selectedObj.topLeft.x, props.selectedObj.topLeft.y + props.selectedObj.size.height);
          ctx?.lineTo(props.selectedObj.topLeft.x + props.selectedObj.size.width / 2, props.selectedObj.topLeft.y);
          ctx?.lineTo(props.selectedObj.topLeft.x + props.selectedObj.size.width, props.selectedObj.topLeft.y + props.selectedObj.size.height);
          ctx?.lineTo(props.selectedObj.topLeft.x, props.selectedObj.topLeft.y + props.selectedObj.size.height);
          ctx?.fill();
          break;
        default:
          break;
      }
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
  }, [props.selectedObj])

  return (
    <div className={classes.Canvas}>
      <canvas id="canvas" width={props.width} height={props.height} ref={canvasEl}
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
              console.log('[RESIZING]', pointInResizing)
            } else {
              const ctx = canvasEl.current?.getContext('2d');
              ctx?.clearRect(0, 0, props.width, props.height);
              ctx?.putImageData(props.data, 0, 0);
              const imgData = ctx?.getImageData(0, 0, props.data.width, props.data.height);
              props.saveImageData(imgData);
              if (props.selectedObj) {
                switch (props.selectedObj.type) {
                  case 'rectangle':
                    ctx?.fillRect(props.selectedObj.topLeft.x, props.selectedObj.topLeft.y, props.selectedObj.size.width, props.selectedObj.size.height);
                    break;
                  case 'triangle':
                    ctx?.beginPath();
                    ctx?.moveTo(props.selectedObj.topLeft.x, props.selectedObj.topLeft.y + props.selectedObj.size.height);
                    ctx?.lineTo(props.selectedObj.topLeft.x + props.selectedObj.size.width / 2, props.selectedObj.topLeft.y);
                    ctx?.lineTo(props.selectedObj.topLeft.x + props.selectedObj.size.width, props.selectedObj.topLeft.y + props.selectedObj.size.height);
                    ctx?.lineTo(props.selectedObj.topLeft.x, props.selectedObj.topLeft.y + props.selectedObj.size.height);
                    ctx?.fill();
                    break;
                  case 'ellipse':
                    let radiusX = props.selectedObj.size.width / 2;
                    let radiusY = props.selectedObj.size.height / 2;
                    let centerX = props.selectedObj.topLeft.x + radiusX;
                    let centerY = props.selectedObj.topLeft.y + radiusY;
                    ctx?.beginPath();
                    ctx?.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
                    ctx?.fill();
                    break;
                  default:
                    break;
                }
              }
              // Проблема с перерисовкой here
              setDrawing(true);
            }
            setDownpos(loc);
          }
        }}
        onMouseMove={(e) => {
          const loc = getMousePosition(e.clientX, e.clientY);
          const ctx = canvasEl.current?.getContext('2d');
          if (drawing && loc && ctx) {
            console.log('[DRAWING]')
            movedelta.current = Math.abs(e.movementX) + Math.abs(e.movementY);
            updateShapeBorder(loc);
            ctx.clearRect(0, 0, props.width, props.height);
            ctx.putImageData(props.data, 0, 0);
            if (props.selectedObj) {
              switch (props.selectedObj.type) {
                case 'rectangle':
                  ctx?.fillRect(props.selectedObj.topLeft.x, props.selectedObj.topLeft.y, props.selectedObj.size.width, props.selectedObj.size.height);
                  break;
                case 'triangle':
                  ctx?.beginPath();
                  ctx?.moveTo(props.selectedObj.topLeft.x, props.selectedObj.topLeft.y + props.selectedObj.size.height);
                  ctx?.lineTo(props.selectedObj.topLeft.x + props.selectedObj.size.width / 2, props.selectedObj.topLeft.y);
                  ctx?.lineTo(props.selectedObj.topLeft.x + props.selectedObj.size.width, props.selectedObj.topLeft.y + props.selectedObj.size.height);
                  ctx?.lineTo(props.selectedObj.topLeft.x, props.selectedObj.topLeft.y + props.selectedObj.size.height);
                  ctx?.fill();
                  break;
                case 'ellipse':
                  let radiusX = props.selectedObj.size.width / 2;
                  let radiusY = props.selectedObj.size.height / 2;
                  let centerX = props.selectedObj.topLeft.x + radiusX;
                  let centerY = props.selectedObj.topLeft.y + radiusY;
                  ctx?.beginPath();
                  ctx?.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
                  ctx?.fill();
                  break;
                default:
                  break;
              }
            }
            switch (props.currentTool) {
              case Tool.rectangle:
                ctx.fillRect(shapeBorder.current.left, shapeBorder.current.top, shapeBorder.current.width, shapeBorder.current.height)
                break;
              case Tool.ellipse:
                let radiusX = shapeBorder.current.width / 2;
                let radiusY = shapeBorder.current.height / 2;
                let centerX = shapeBorder.current.left + radiusX;
                let centerY = shapeBorder.current.top + radiusY;
                ctx.beginPath();
                ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
                ctx.fill();
                break;
              case Tool.triangle:
                ctx.beginPath();
                ctx.moveTo(shapeBorder.current.left, shapeBorder.current.top + shapeBorder.current.height);
                ctx.lineTo(shapeBorder.current.left + shapeBorder.current.width / 2, shapeBorder.current.top);
                ctx.lineTo(shapeBorder.current.left + shapeBorder.current.width, shapeBorder.current.top + shapeBorder.current.height);
                ctx.lineTo(shapeBorder.current.left, shapeBorder.current.top + shapeBorder.current.height);
                ctx.fill();
                break;
              default:
                break;
            }
            drawResizingElements();
          } else if (inFigure && loc && canvasEl.current) {
            console.log('[MOVING]')
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
              type: props.currentTool
            }
            ctx?.clearRect(0, 0, props.width, props.height);
            ctx?.putImageData(props.data, 0, 0);
            switch (props.selectedObj.type) {
              case Tool.rectangle:
                ctx?.fillRect(object.topLeft.x, object.topLeft.y, object.size.width, object.size.height);
                break;
              case Tool.ellipse:
                let radiusX = object.size.width / 2;
                let radiusY = object.size.height / 2;
                let centerX = object.topLeft.x + radiusX;
                let centerY = object.topLeft.y + radiusY;
                ctx?.beginPath();
                ctx?.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
                ctx?.fill();
                break;
              case Tool.triangle:
                ctx?.beginPath();
                ctx?.moveTo(object.topLeft.x, object.topLeft.y + object.size.height);
                ctx?.lineTo(object.topLeft.x + object.size.width / 2, object.topLeft.y);
                ctx?.lineTo(object.topLeft.x + object.size.width, object.topLeft.y + object.size.height);
                ctx?.lineTo(object.topLeft.x, object.topLeft.y + object.size.height);
                ctx?.fill();
                break;
              default:
                break;
            }
            drawResizingElements();
          } else if (resizing && loc && canvasEl.current) {
            console.log('[RESIZING]')
            movedelta.current = Math.abs(e.movementX) + Math.abs(e.movementY);
            if (resizePos.current === 1) {
              shapeBorder.current.top += e.movementY;
              shapeBorder.current.left += e.movementX; 
              shapeBorder.current.width += (-e.movementX);
              shapeBorder.current.height += (-e.movementY);
            }
            else if (resizePos.current === 2) {
              shapeBorder.current.top += e.movementY;
              shapeBorder.current.width += (e.movementX);
              shapeBorder.current.height += (-e.movementY);
            } else if (resizePos.current === 3) {
              shapeBorder.current.left += e.movementX;
              shapeBorder.current.width += (-e.movementX);
              shapeBorder.current.height += (e.movementY);

            } else if (resizePos.current === 4) {
              shapeBorder.current.width += e.movementX;
              shapeBorder.current.height += e.movementY;
            }
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
              type: props.currentTool
            }
            ctx?.clearRect(0, 0, props.width, props.height);
            ctx?.putImageData(props.data, 0, 0);
            switch (props.selectedObj.type) {
              case Tool.rectangle:
                ctx?.fillRect(object.topLeft.x, object.topLeft.y, object.size.width, object.size.height);
                break;
              case Tool.ellipse:
                let radiusX = object.size.width / 2;
                let radiusY = object.size.height / 2;
                let centerX = object.topLeft.x + radiusX;
                let centerY = object.topLeft.y + radiusY;
                ctx?.beginPath();
                ctx?.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
                ctx?.fill();
                break;
              case Tool.triangle:
                ctx?.beginPath();
                ctx?.moveTo(object.topLeft.x, object.topLeft.y + object.size.height);
                ctx?.lineTo(object.topLeft.x + object.size.width / 2, object.topLeft.y);
                ctx?.lineTo(object.topLeft.x + object.size.width, object.topLeft.y + object.size.height);
                ctx?.lineTo(object.topLeft.x, object.topLeft.y + object.size.height);
                ctx?.fill();
                break;
              default:
                break;
            }
            drawResizingElements();
          }
        }}
        onMouseUp={(e) => {
          const loc = getMousePosition(e.pageX, e.pageY);
          if (movedelta.current !== 0 && inFigure && loc) {
            // updateShapeBorder(loc);
          }
          if (movedelta.current === 0 && drawing) {
            const ctx = canvasEl.current?.getContext('2d');
              if (props.selectedObj) {
                switch (props.selectedObj.type) {
                  case 'rectangle':
                    ctx?.fillRect(props.selectedObj.topLeft.x, props.selectedObj.topLeft.y, props.selectedObj.size.width, props.selectedObj.size.height);
                    break;
                  case 'triangle':
                    ctx?.beginPath();
                    ctx?.moveTo(props.selectedObj.topLeft.x, props.selectedObj.topLeft.y + props.selectedObj.size.height);
                    ctx?.lineTo(props.selectedObj.topLeft.x + props.selectedObj.size.width / 2, props.selectedObj.topLeft.y);
                    ctx?.lineTo(props.selectedObj.topLeft.x + props.selectedObj.size.width, props.selectedObj.topLeft.y + props.selectedObj.size.height);
                    ctx?.lineTo(props.selectedObj.topLeft.x, props.selectedObj.topLeft.y + props.selectedObj.size.height);
                    ctx?.fill();
                    break;
                  case 'ellipse':
                    let radiusX = props.selectedObj.size.width / 2;
                    let radiusY = props.selectedObj.size.height / 2;
                    let centerX = props.selectedObj.topLeft.x + radiusX;
                    let centerY = props.selectedObj.topLeft.y + radiusY;
                    ctx?.beginPath();
                    ctx?.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
                    ctx?.fill();
                    break;
                  default:
                    break;
                }
              }
          }
          if (movedelta.current !== 0 && drawing) {
            const ctx = canvasEl.current?.getContext('2d');
              ctx?.clearRect(0, 0, props.width, props.height);
              ctx?.putImageData(props.data, 0, 0);
              if (props.selectedObj) {
                switch (props.selectedObj.type) {
                  case 'rectangle':
                    ctx?.fillRect(props.selectedObj.topLeft.x, props.selectedObj.topLeft.y, props.selectedObj.size.width, props.selectedObj.size.height);
                    break;
                  case 'triangle':
                    ctx?.beginPath();
                    ctx?.moveTo(props.selectedObj.topLeft.x, props.selectedObj.topLeft.y + props.selectedObj.size.height);
                    ctx?.lineTo(props.selectedObj.topLeft.x + props.selectedObj.size.width / 2, props.selectedObj.topLeft.y);
                    ctx?.lineTo(props.selectedObj.topLeft.x + props.selectedObj.size.width, props.selectedObj.topLeft.y + props.selectedObj.size.height);
                    ctx?.lineTo(props.selectedObj.topLeft.x, props.selectedObj.topLeft.y + props.selectedObj.size.height);
                    ctx?.fill();
                    break;
                  case 'ellipse':
                    let radiusX = props.selectedObj.size.width / 2;
                    let radiusY = props.selectedObj.size.height / 2;
                    let centerX = props.selectedObj.topLeft.x + radiusX;
                    let centerY = props.selectedObj.topLeft.y + radiusY;
                    ctx?.beginPath();
                    ctx?.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
                    ctx?.fill();
                    break;
                  default:
                    break;
                }
              }
              const imgData = ctx?.getImageData(0, 0, props.data.width, props.data.height);
              // props.putInHistory(props.data, props.selectedObj);
              props.saveImageData(imgData);
          }
          if (movedelta.current !== 0 && loc) {
            console.log('[CHANGED_OBJECT]')
            const object = makeFigure();
            props.changeSelectedObject(object);
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
    selectedObj: state.editor.selectedObject,
    data: state.editor.canvas,
    currentTool: state.editor.currentTool,
    width: state.editor.canvas.width,
    height: state.editor.canvas.height,
    fillColor: state.editor.fillColor
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    changeSelectedObject: (newObject: any) => dispatch({type: actionTypes.CHANGE_SELECTED_OBJECT, newObject: newObject}),
    saveImageData: (imgData: ImageData) => dispatch({type: actionTypes.SAVE_IMAGE_DATA, data: imgData}),
    putInHistory: (imgData: ImageData, selectedObj: any) => dispatch({type: actionTypes.PUT_IN_HISTORY, imgData: imgData, selectedObj: selectedObj})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);