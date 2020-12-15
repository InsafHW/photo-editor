import React, { useState, useRef, useEffect } from 'react'
import { connect } from "react-redux"
import { Tool } from '../../modelsTS/Editor'
import { ImageUI } from '../../modelsTS/ImagUI'
import { Point } from '../../modelsTS/Point'
import { Ellipse, Primitive, Rectangle, Triangle } from '../../modelsTS/Primitives'
import * as actionTypes from "../../store/actions"

import classes from "./canvas.module.css"

const RESIZING_RADIUS = 8;
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

  const makeFigure = (type: any) => {
    return {
      topLeft: {
        x: shapeBorder.current.left,
        y: shapeBorder.current.top
      },
      size: {
        width: shapeBorder.current.width,
        height: shapeBorder.current.height
      },
      type: type,
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

  const drawSelectedObject = () => {
    const ctx = canvasEl.current?.getContext('2d');
    if (ctx) {
      ctx.fillStyle = props.fillColor;
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
      case 'ellipse':
        drawEllipse(object, ctx);
        break;
      case 'triangle':
        drawTriangle(object, ctx);
        break;
      case 'text':
        if (ctx) {
          ctx.font = `normal ${props.fontSize}px ${props.fontFamily}`;
        }
        let width = props.selectedObj.size.width;
        if (props.fontSize * (props.text.length - 2.5) > width) {
          width = props.fontSize * (props.text.length - 2.5)
          console.log('[NE LEZET]')
        }
        ctx?.beginPath();
        ctx?.fillText(props.text, props.selectedObj.topLeft.x , props.selectedObj.topLeft.y + (+props.fontSize));
        break;
      case 'area':
        if (ctx) {
          ctx.strokeStyle = 'violet';
        }
        ctx?.strokeRect(props.selectedObj.topLeft.x, props.selectedObj.topLeft.y, props.selectedObj.size.width, props.selectedObj.size.height);
        break;
      case 'image':
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
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    console.log('[PROPS]', props)
    const ctx = canvasEl.current?.getContext('2d');
    ctx?.clearRect(0, 0, props.width, props.height);
    ctx?.putImageData(props.data, 0, 0);
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
  }, [props.selectedObj, props.text, props.fontSize, props.fillColor]) //LAST CHANGES [filterClor]

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
            } else {
              const ctx = canvasEl.current?.getContext('2d');
              ctx?.clearRect(0, 0, props.width, props.height);
              ctx?.putImageData(props.data, 0, 0);
              const imgData = ctx?.getImageData(0, 0, props.data.width, props.data.height);
              props.saveImageData(imgData);
              if (props.selectedObj) {
                drawSelectedObject();
              }
              setDrawing(true);
            }
            setDownpos(loc);
          }
        }}
        onMouseMove={(e) => {
          const loc = getMousePosition(e.clientX, e.clientY);
          const ctx = canvasEl.current?.getContext('2d');
          if (drawing && loc && ctx) {
            console.log('[DRAWING]', props.currentTool)
            movedelta.current = Math.abs(e.movementX) + Math.abs(e.movementY);
            updateShapeBorder(loc);
            ctx.clearRect(0, 0, props.width, props.height);
            ctx.putImageData(props.data, 0, 0);
            if (props.selectedObj) {
              drawSelectedObject();
            }
            if (ctx) {
              ctx.fillStyle = props.fillColor;
            }
            const object = {
              topLeft: {
                x: shapeBorder.current.left,
                y: shapeBorder.current.top
              },
              size: {
                width: shapeBorder.current.width,
                height: shapeBorder.current.height
              }
            }
            switch (props.currentTool) {
              case Tool.rectangle:
                drawRectangle(object, ctx);
                break;
              case Tool.ellipse:
                drawEllipse(object, ctx);
                break;
              case Tool.triangle:
                drawTriangle(object, ctx);
                break;
              case Tool.text:
                if (ctx) {
                  ctx.font = `normal ${props.fontSize}px Arial`;
                }
                ctx.beginPath();
                ctx.fillText(props.text, shapeBorder.current.left, shapeBorder.current.top + (+props.fontSize));
                break;
              default:
                break;
            }
            drawResizingElements();
          } else if (inFigure && loc && canvasEl.current) {
            console.log('[MOVING]')
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
              }
            }
            ctx?.clearRect(0, 0, props.width, props.height);
            ctx?.putImageData(props.data, 0, 0);
            if (props.selectedObj.type === 'image' && img.current) {
              ctx?.drawImage(img.current, shapeBorder.current.left, shapeBorder.current.top, shapeBorder.current.width, shapeBorder.current.height)
            }
            switch (props.selectedObj.type) {
              case Tool.rectangle:
                drawRectangle(object, ctx);
                break;
              case Tool.ellipse:
                drawEllipse(object, ctx);
                break;
              case Tool.triangle:
                drawTriangle(object, ctx);
                break;
              default:
                break;
            }
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
            const object = {
              topLeft: {
                x: shapeBorder.current.left,
                y: shapeBorder.current.top
              },
              size: {
                width: shapeBorder.current.width,
                height: shapeBorder.current.height
              }
            }
            ctx?.clearRect(0, 0, props.width, props.height);
            ctx?.putImageData(props.data, 0, 0);
            if (props.selectedObj && props.selectedObj.type === 'image' && img.current) {
              console.log('[RESIZING]', props.selectedObj.type)
              ctx?.drawImage(img.current, shapeBorder.current.left, shapeBorder.current.top, shapeBorder.current.width, shapeBorder.current.height);
            } else {
              switch (props.selectedObj.type) {
                case Tool.rectangle:
                  drawRectangle(object, ctx);
                  break;
                case Tool.ellipse:
                  drawEllipse(object, ctx);
                  break;
                case Tool.triangle:
                  drawTriangle(object, ctx);
                  break;
                default:
                  break;
              }
            }
            drawResizingElements();
          }
        }}
        onMouseUp={(e) => {
          const loc = getMousePosition(e.pageX, e.pageY);
          const ctx = canvasEl.current?.getContext('2d');
          if (movedelta.current === 0 && drawing && props.selectedObj) {
            drawSelectedObject();
          }
          if (movedelta.current !== 0) {
            if (img.current && inFigure) {
              const object = {
                topLeft: {
                  x: shapeBorder.current.left,
                  y: shapeBorder.current.top
                },
                size: {
                  width: img.current.width,
                  height: img.current.height
                },
                src: img.current.src,
                type: 'image'
              }
              props.changeSelectedObject(object);
            }
            if (drawing) {
              ctx?.clearRect(0, 0, props.width, props.height);
              ctx?.putImageData(props.data, 0, 0);
              if (img.current) {
                ctx?.drawImage(img.current, props.selectedObj.topLeft.x, props.selectedObj.topLeft.y, img.current.width, img.current.height);
                img.current = null;
              }
              if (props.selectedObj) {
                drawSelectedObject();
              }
              const imgData = ctx?.getImageData(0, 0, props.data.width, props.data.height);
              props.putInHistory(props.data);
              props.saveImageData(imgData);
            }
            if (resizing && props.selectedObj && props.selectedObj.type === 'image' && img.current && loc) {
              console.log('[IMAGE UP]', shapeBorder.current)
              img.current.width = shapeBorder.current.width;
              img.current.height = shapeBorder.current.height;
              ctx?.drawImage(img.current, shapeBorder.current.left, shapeBorder.current.top, shapeBorder.current.width, shapeBorder.current.height);
            }
            else if (loc && (drawing || resizing)) {
              console.log('[CHANGED_OBJECT]')
              const object = makeFigure(props.currentTool);
              props.changeSelectedObject(object);
            } else if (movedelta.current !== 0 && loc && inFigure) {
              console.log('[CHANGED_OBJECT]')
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

function drawRectangle(object: any, ctx: CanvasRenderingContext2D | undefined | null) {
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

function drawText(object: any, ctx: CanvasRenderingContext2D | undefined | null) {

}

const mapStateToProps = (state: any) => {
  return {
    selectedObj: state.editor.selectedObject,
    data: state.editor.canvas,
    currentTool: state.editor.currentTool,
    width: state.editor.canvas.width,
    height: state.editor.canvas.height,
    fillColor: state.view.fillColor,
    text: state.view.text,
    fontSize: state.view.fontSize
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    changeSelectedObject: (newObject: any) => dispatch({type: actionTypes.CHANGE_SELECTED_OBJECT, newObject: newObject}),
    saveImageData: (imgData: ImageData) => dispatch({type: actionTypes.SAVE_IMAGE_DATA, data: imgData}),
    putInHistory: (imgData: ImageData) => dispatch({type: actionTypes.PUT_IN_HISTORY, data: imgData})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);