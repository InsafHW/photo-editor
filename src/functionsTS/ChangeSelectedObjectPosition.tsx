import { Editor } from '../modelsTS/Editor';
import { Point } from '../modelsTS/Point';
import { drawEllipse, drawTriangle, drawRectangle, drawText, drawImage } from "./DrawHelper"
import { Ellipse, Rectangle, Triangle } from "../modelsTS/Primitives"
import {clearCanvas} from "./CanvasHelper"
import { TextUI } from '../modelsTS/TextUI';
import { ImageUI } from '../modelsTS/ImagUI';

function changeSelectedObjectPosition(Editor: Editor, newTopLeft: Point, tempCanvas: HTMLCanvasElement): Editor {
  let newEditor;
  if (Editor.selectedObject) {
    switch (Editor.selectedObject.type) {
      case 'text':
        newEditor = changeTextPosition(Editor, newTopLeft, tempCanvas);
        break;
      case 'image':
        newEditor = changeImagePosition(Editor, newTopLeft, tempCanvas);
        break;
      case 'triangle':
        newEditor = changeTrianglePosition(Editor, newTopLeft, tempCanvas);
        break;
      case 'ellipse':
        newEditor = changeEllipsePosition(Editor, newTopLeft, tempCanvas);
        break;
      case 'rectangle':
        newEditor = changeRectanglePosition(Editor, newTopLeft, tempCanvas);
        break;
      default:
        break;
    }
    if (newEditor) {
      return newEditor;
    }
  }
  return Editor;
}

function changeEllipsePosition(Editor: Editor, newTopLeft: Point, tempCanvas: HTMLCanvasElement): Editor {
  if (Editor.selectedObject) {
    const newEditor: Editor = {
      ...Editor,
      selectedObject: {
        ...Editor.selectedObject,
        topLeft: { ...newTopLeft },
      },
    };
    clearCanvas(tempCanvas);
    drawEllipse(newEditor.selectedObject as Ellipse, tempCanvas);
    return newEditor; 
  }
  return Editor
}

function changeTrianglePosition(Editor: Editor, newTopLeft: Point, tempCanvas: HTMLCanvasElement): Editor {
  if (Editor.selectedObject) {
    const newEditor: Editor = {
      ...Editor,
      selectedObject: {
        ...Editor.selectedObject,
        topLeft: { ...newTopLeft }
      }
    }
    clearCanvas(tempCanvas);
    drawTriangle(newEditor.selectedObject as Triangle, tempCanvas);
    return newEditor;
  }
  return Editor
}

function changeRectanglePosition(Editor: Editor, newTopLeft: Point, tempCanvas: HTMLCanvasElement): Editor {
  if (Editor.selectedObject) {
    const newEditor: Editor = {
      ...Editor,
      selectedObject: {
        ...Editor.selectedObject,
        topLeft: { ...newTopLeft }
      }
    }
    clearCanvas(tempCanvas);
    drawRectangle(newEditor.selectedObject as Rectangle, tempCanvas);
    return newEditor;
  }
  return Editor
}

function changeTextPosition(Editor: Editor, newTopLeft: Point, tempCanvas: HTMLCanvasElement): Editor {
  if (Editor.selectedObject) {
    const newEditor: Editor = {
      ...Editor,
      selectedObject: {
        ...Editor.selectedObject,
        topLeft: { ...newTopLeft }
      }
    };
    clearCanvas(tempCanvas);
    drawText(Editor.selectedObject as TextUI, tempCanvas);
    return newEditor;
  }
  return Editor
}

function changeImagePosition(Editor: Editor, newTopLeft: Point, tempCanvas: HTMLCanvasElement): Editor {
  if (Editor.selectedObject) {
    const newEditor: Editor = {
      ...Editor,
      selectedObject: {
        ...Editor.selectedObject,
        topLeft: { ...newTopLeft }
      }
    }
    clearCanvas(tempCanvas);
    drawImage(newEditor.selectedObject as ImageUI, tempCanvas);
    return newEditor;
  }
  return Editor
}

export default changeSelectedObjectPosition;