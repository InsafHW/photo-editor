import React, {useEffect, useRef, useState} from 'react'
// // import {editor, changeSelectedObject, saveImageData} from "../../stateManager"
// import {Primitive} from "../../modelsTS/Primitives"
// import {Tool} from "../../modelsTS/Editor"
// import { Point } from "../../modelsTS/Point"
// import classes from "./Holst.module.css"
// import {drawEllipse, drawRectangle, drawText, drawTriangle } from "../../functionsTS/DrawHelper"
// import {clearCanvas} from "../../functionsTS/CanvasHelper"
// import { clear } from 'console'
// import { ImageUI } from '../../modelsTS/ImagUI'
// import { TextUI } from '../../modelsTS/TextUI'

// const Holst = (props: any) => {
//   const [tempObject, setTempObject] = useState<Primitive|TextUI|null>(null);
//   const [resizing, setResizing] = useState(false);
//   const shapeboundingbox = useRef({left: 0, top: 0, width: 0, height: 0})
//   const canvEl = useRef<HTMLCanvasElement|null>(null);
//   const movedelta = useRef<number>(0);
//   const isInFigure = useRef<boolean>(false);
//   const imageData = useRef<ImageData|null>(null);
//   const downpos = useRef<Point>({x: 0, y: 0})
  

//   // useEffect(() => {
//   //   setTempObject(editor.selectedObject)
//   // }, [])

//   const getMousePosition = (x: number, y: number) => {
//     if (canvEl.current) {
//       const ctx = canvEl.current.getContext('2d');
//       const canvasSizeData = canvEl.current.getBoundingClientRect();
//       return {
//         x: (x - canvasSizeData.left) * (canvEl.current.width / canvasSizeData.width),
//         y: (y - canvasSizeData.top) * (canvEl.current.height / canvasSizeData.height)
//       }
//     }
//   }

//   const updateRubberbandSizeData = (loc: Point) => {
//     const width = Math.abs(loc.x - downpos.current.x);
//     const height = Math.abs(loc.y - downpos.current.y);
//     let left, top;

//     if (loc.x > downpos.current.x) {
//       left = downpos.current.x;
//     } else {
//       left = loc.x;
//     }

//     if (loc.y > downpos.current.y) {
//       top = downpos.current.y;
//     } else {
//       top = loc.y;
//     }

//     shapeboundingbox.current = {
//       left: left,
//       top: top,
//       width: width,
//       height: height
//     }
//   }

//   return (
//     <div className={classes.Holst}>
//       <canvas 
//         ref={canvEl} 
//         id="canvas" 
//         width={editor.canvas.width} 
//         height={editor.canvas.height}
//         onMouseDown={(e) => {
//           const el = document.querySelectorAll('input')[1];
//           if (el) {
//             document.body.removeChild(el);
//           }
//           setResizing(true);
//           const loc = getMousePosition(e.clientX, e.clientY);
//           if (loc) {
//             downpos.current = {x: loc.x, y: loc.y}
//             if (editor.selectedObject && canvEl.current) {
//               if (loc.x < editor.selectedObject.topLeft.x
//                 || loc.x > editor.selectedObject.topLeft.x + editor.selectedObject.size.width
//                 || loc.x > editor.selectedObject.topLeft.x + editor.selectedObject.size.width
//                 || loc.y < editor.selectedObject.topLeft.y
//                 || loc.y > editor.selectedObject.topLeft.y + editor.selectedObject.size.height) {
//                 isInFigure.current = false;
//                 const ctx = canvEl.current.getContext('2d');
//                 if (ctx) {
//                   const imgData = ctx.getImageData(0, 0, canvEl.current.width, canvEl.current.height);
//                   // saveImageData(editor, ctx);
//                   imageData.current = imgData;
//                 }
//                 // Внести текущий темп объект в канвас навсегда (putImageData)
//               }
//               else {
//                 isInFigure.current = true;
//                 console.log('Point в фигуре')
//               }
//             }
//           }
//         }}
//         onMouseMove={(e) => {
//           if (isInFigure.current && editor.selectedObject && canvEl.current) {
//             const ctx = canvEl.current.getContext('2d');
//             let object: Primitive;
//             if (ctx)
//             switch (editor.selectedObject.type) {
//               case Tool.rectangle:
//                 object = {
//                   ...editor.selectedObject, 
//                   topLeft: {
//                     x: editor.selectedObject.topLeft.x + e.movementX,
//                     y: editor.selectedObject.topLeft.y + e.movementY
//                   }
//                 }
//                 clearCanvas(canvEl.current);
//                 drawRectangle(object, canvEl.current);
//                 ctx.strokeRect(object.topLeft.x, object.topLeft.y, object.size.width, object.size.height);
//                 changeSelectedObject(editor, object);
//                 break;
//               case Tool.triangle:
//                 object = {
//                   ...editor.selectedObject, 
//                   topLeft: {
//                     x: editor.selectedObject.topLeft.x + e.movementX,
//                     y: editor.selectedObject.topLeft.y + e.movementY
//                   }
//                 }
//                 clearCanvas(canvEl.current);
//                 drawTriangle(object, canvEl.current);
//                 ctx.strokeRect(object.topLeft.x, object.topLeft.y, object.size.width, object.size.height);
//                 changeSelectedObject(editor, object);
//                 break;
//               case Tool.ellipse:
//                 object = {
//                   ...editor.selectedObject,
//                   topLeft: {
//                    x: editor.selectedObject.topLeft.x + e.movementX,
//                    y: editor.selectedObject.topLeft.y + e.movementY
//                   }
//                 }
//                 clearCanvas(canvEl.current);
//                 drawEllipse(object, canvEl.current);
//                 ctx.strokeRect(object.topLeft.x, object.topLeft.y, object.size.width, object.size.height);
//                 changeSelectedObject(editor, object); 
//                 break;
//               default:
//                 break;
//             }
//           }
//           else if (resizing && canvEl.current) {
//             movedelta.current = e.movementX + e.movementY;
//             const ctx = canvEl.current.getContext('2d');
//             const loc = getMousePosition(e.clientX, e.clientY);
//             let object: Primitive;
//             switch (props.currentTool) {
//               case Tool.rectangle:
//                 if (ctx && loc) {
//                   updateRubberbandSizeData(loc);
//                   clearCanvas(canvEl.current);
//                   if (imageData.current) {
//                     ctx.putImageData(imageData.current, imageData.current.width, imageData.current.height)
//                   }
//                   ctx.fillStyle = 'red';
//                   ctx.fillRect(downpos.current.x, downpos.current.y, loc.x - downpos.current.x, loc.y - downpos.current.y)
//                   ctx.strokeRect(downpos.current.x, downpos.current.y, loc.x - downpos.current.x, loc.y - downpos.current.y)
//                 }
//                 break;
//               case Tool.triangle:
//                 if (ctx && loc) {
//                   updateRubberbandSizeData(loc);
//                   clearCanvas(canvEl.current);
//                   ctx.beginPath();
//                   ctx.moveTo(shapeboundingbox.current.left, shapeboundingbox.current.top + shapeboundingbox.current.height);
//                   ctx.lineTo(shapeboundingbox.current.left + shapeboundingbox.current.width / 2, shapeboundingbox.current.top);
//                   ctx.lineTo(shapeboundingbox.current.left + shapeboundingbox.current.width, shapeboundingbox.current.top + shapeboundingbox.current.height);
//                   ctx.lineTo(shapeboundingbox.current.left, shapeboundingbox.current.top + shapeboundingbox.current.height);
//                   ctx.fill();
//                   ctx.strokeRect(downpos.current.x, downpos.current.y, loc.x - downpos.current.x, loc.y- downpos.current.y)
//                 }  
//                 break;
//                 case Tool.ellipse:
//                   if (ctx && loc) {
//                     updateRubberbandSizeData(loc);
//                     let radiusX = shapeboundingbox.current.width / 2;
//                     let radiusY = shapeboundingbox.current.height / 2;
//                     let left, top; // center x, center y

//                     if (loc.x <= downpos.current.x && loc.y <= downpos.current.y) {
//                       left = downpos.current.x - radiusX;
//                       top = downpos.current.y - radiusY;
//                     } else if (loc.x < downpos.current.x && loc.y > downpos.current.y) {
//                       left = downpos.current.x - radiusX;
//                       top = downpos.current.y + radiusY;
//                     } else if (loc.x > downpos.current.x && loc.y < downpos.current.y) {
//                       left = downpos.current.x + radiusX;
//                       top = downpos.current.y - radiusY;
//                     } else if (loc.x > downpos.current.x && loc.y > downpos.current.y) {
//                       left = downpos.current.x + radiusX;
//                       top = downpos.current.y + radiusY;
//                     }
//                     if (top && left) {
//                       clearCanvas(canvEl.current);
//                       ctx.beginPath();
//                       ctx.ellipse(left, top, radiusX, radiusY, 0, 0, Math.PI * 2);
//                       ctx.fill();
//                       ctx.strokeRect(downpos.current.x, downpos.current.y, (loc.x - downpos.current.x), (loc.y- downpos.current.y))
//                     }
//                   }
//                   break;
//                 case Tool.text:
//                   if (ctx && loc) {
//                     updateRubberbandSizeData(loc);
//                     clearCanvas(canvEl.current);
//                     ctx.beginPath();
//                     ctx.strokeRect(downpos.current.x, downpos.current.y, loc.x - downpos.current.x, loc.y - downpos.current.y)

//                   }
//                 break;
//               default:
//                 break;
//             }
//           }
//         }}
//         onMouseUp={(e) => {
//           setResizing(false);
//           isInFigure.current = false;
//           const loc = getMousePosition(e.clientX, e.clientY);
//           if (movedelta.current !== 0) {
//             let tempObject: Primitive | ImageUI | TextUI;
//             let x = 0, y = 0;
//             if (loc) {
//               if (loc.x < downpos.current.x) {
//                 x = loc.x;
//               } else {
//                 x = downpos.current.x
//               }
//               if (loc.y < downpos.current.y) {
//                 y = loc.y
//               } else {
//                 y = downpos.current.y
//               }
//             }
//             switch (props.currentTool) {
//               case Tool.triangle:
//                 tempObject = {
//                   topLeft: {
//                     x: x,
//                     y: y
//                   },
//                   size: {
//                     width: shapeboundingbox.current.width,
//                     height: shapeboundingbox.current.height
//                   },
//                   type: 'triangle',
//                   fillColor: 'red' 
//                 }
//                 setTempObject(tempObject)
//                 changeSelectedObject(editor, tempObject);
//                 break;
//               case Tool.rectangle:
//                 console.log(shapeboundingbox)
//                 tempObject = {
//                   topLeft: {
//                     x: x,
//                     y: y
//                   },
//                   size: {
//                     width: shapeboundingbox.current.width,
//                     height: shapeboundingbox.current.height
//                   },
//                   type: 'rectangle',
//                   fillColor: 'red'
//                 }
//                 setTempObject(tempObject);
//                 changeSelectedObject(editor, tempObject);
//                 break;
//               case Tool.ellipse: {
//                 console.log(shapeboundingbox)
//                 tempObject = {
//                   topLeft: {
//                     x: x,
//                     y: y
//                   },
//                   size: {
//                     width: shapeboundingbox.current.width,
//                     height: shapeboundingbox.current.height
//                   },
//                   type: 'ellipse',
//                   fillColor: 'red'
//                 }
//                 setTempObject(tempObject);
//                 changeSelectedObject(editor, tempObject)
//                 break;
//               }
//               case Tool.text:
//               tempObject = {
//                 topLeft: {
//                   x: x,
//                   y: y
//                 },
//                 size: {
//                   width: shapeboundingbox.current.width,
//                   height: shapeboundingbox.current.height
//                 },
//                 style: {
//                   fillColor: 'red',
//                   fontSize: 24,
//                   fontFamily: 'Arial'
//                 },
//                 text: 'Hello',
//                 type: 'text'
//               }
//               const inpElement = document.createElement('input');
//               inpElement.type = 'text';
//               inpElement.style.position = 'absolute';
//               inpElement.style.display = 'block';
//               inpElement.style.width = '100px';
//               // inpElement.style.backgroundColor = 'red';
//               inpElement.style.zIndex = '1000';
//               if (canvEl.current) {
//                 const canvSize = canvEl.current.getBoundingClientRect()
//                 inpElement.style.top = `${canvSize.top + tempObject.topLeft.y + tempObject.size.height / 2 }px`
//                 inpElement.style.left = `${canvSize.left + tempObject.topLeft.x + tempObject.size.width / 2}px`
//                 inpElement.style.transform = `translateX(-50px)`
//                 console.log(inpElement.style.width)
//                 document.body.appendChild(inpElement)
//                 inpElement.focus();
//                 drawText(tempObject, canvEl.current);
//                 setTempObject(tempObject);
//                 changeSelectedObject(editor, tempObject)
//               }
//               break;
//               default:
//                 break;
//               } 
//           }
//           movedelta.current = 0;
//         }}
//       ></canvas>
//     </div>
//   )
// }

// export default Holst