import {Editor} from '../modelsTS/Editor'
import { Primitive, Ellipse, Rectangle, Triangle } from '../modelsTS/Primitives';
import {drawEllipse, drawTriangle, drawRectangle} from "./DrawHelper"

function insertPrimitive(Editor: Editor, Primitive: Primitive, tempCanvas: HTMLCanvasElement): Editor {
  const newEditor: Editor = {
    ...Editor,
    selectedObject: { ...Primitive }
  }
  if (newEditor.selectedObject) {
    switch (newEditor.selectedObject.type) {
      case 'ellipse':
        drawEllipse(newEditor.selectedObject as Ellipse, tempCanvas);
        break;
      case 'triangle':
        drawTriangle(newEditor.selectedObject as Triangle, tempCanvas);
        break;
      case 'rectangle':
        drawRectangle(newEditor.selectedObject as Rectangle, tempCanvas);
        break;
      default:
        break;
    }
  }
  return newEditor;
}

export default insertPrimitive;