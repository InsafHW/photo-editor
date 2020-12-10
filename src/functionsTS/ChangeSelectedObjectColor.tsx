import { Editor } from '../modelsTS/Editor';
import { clearCanvas } from "./CanvasHelper";
import { Ellipse, Rectangle, Triangle } from "../modelsTS/Primitives";
import { TextUI } from '../modelsTS/TextUI';
import { drawRectangle, drawEllipse, drawText, drawTriangle } from './DrawHelper';

function changeSelectedObjectColor(Editor: Editor, newColor: string, tempCanvas: HTMLCanvasElement): Editor {
  let newEditor;
  if (Editor.selectedObject){
    switch (Editor.selectedObject.type) {
      case 'ellipse':
        newEditor = changeEllipseColor(Editor, newColor, tempCanvas);
        break;
      case 'text':
        newEditor = changeTextColor(Editor, newColor, tempCanvas);
        break;
      case 'rectangle':
        newEditor = changeRectangleColor(Editor, newColor, tempCanvas);
        break;
      case 'triangle':
        newEditor = changeTriangleColor(Editor, newColor, tempCanvas);
        break;
      default:
        break;
    }
    return newEditor as Editor;
  }
  return Editor;
}

function changeEllipseColor(Editor: Editor, newColor: string, tempCanvas: HTMLCanvasElement): Editor {
  if (Editor.selectedObject && Editor.selectedObject.type === 'ellipse') {
    const newEditor: Editor = {
      ...Editor,
      selectedObject: {
        ...Editor.selectedObject,
        fillColor: newColor
      }
    }
    clearCanvas(tempCanvas);
    drawEllipse(newEditor.selectedObject as Ellipse, tempCanvas);
    return newEditor;
  }
  return Editor;
}

function changeTextColor(Editor: Editor, newColor: string, tempCanvas: HTMLCanvasElement): Editor {
  if (Editor.selectedObject) {
    if (Editor.selectedObject.type === 'text') {
      const newEditor: Editor = {
        ...Editor,
        selectedObject: {
          ...Editor.selectedObject,
          fillColor: newColor
        }
      }
      clearCanvas(tempCanvas);
      drawText(newEditor.selectedObject as TextUI, tempCanvas);
      return newEditor;
    }
  }
  return Editor
}

function changeRectangleColor(Editor: Editor, newColor: string, tempCanvas: HTMLCanvasElement): Editor {
  if (Editor.selectedObject) {
    if (Editor.selectedObject.type === 'rectangle') {
      const newEditor: Editor = {
        ...Editor,
        selectedObject: {
          ...Editor.selectedObject,
          fillColor: newColor
        }
      }
      clearCanvas(tempCanvas);
      drawRectangle(newEditor.selectedObject as Rectangle, tempCanvas);
      return newEditor;
    }
  }
  return Editor
}

function changeTriangleColor(Editor: Editor, newColor: string, tempCanvas: HTMLCanvasElement): Editor {
  if (Editor.selectedObject) {
    if (Editor.selectedObject.type === 'triangle') {
      const newEditor: Editor = {
        ...Editor,
        selectedObject: {
          ...Editor.selectedObject,
          fillColor: newColor
        }
      }
      clearCanvas(tempCanvas);
      drawTriangle(newEditor.selectedObject as Triangle, tempCanvas);
      return newEditor;
    }
  }
  return Editor
}

export default changeSelectedObjectColor;