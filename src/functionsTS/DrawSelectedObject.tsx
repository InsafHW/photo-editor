import { Editor } from '../modelsTS/Editor';
import { drawEllipse, drawRectangle, drawTriangle, drawText, drawImage } from "./DrawHelper"

function drawSelectedObject(Editor:Editor, canvas: HTMLCanvasElement): Editor {
  const ctx = canvas.getContext('2d');
  if (Editor.selectedObject && ctx) {
    switch (Editor.selectedObject.type) {
      case 'ellipse':
        drawEllipse(Editor.selectedObject, canvas);
        break;
      case 'rectangle':
        drawRectangle(Editor.selectedObject, canvas);
        break;
      case 'triangle':
        drawTriangle(Editor.selectedObject, canvas);
        break;
      case 'text':
        drawText(Editor.selectedObject, canvas);
        break;
      case 'image':
        drawImage(Editor.selectedObject, canvas);
        break;
      default:
        break;
    }
    const newImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newEditor = {
      ...Editor,
      canvas: newImageData,
    };
    return newEditor;
  }
  return Editor
}

export default drawSelectedObject;