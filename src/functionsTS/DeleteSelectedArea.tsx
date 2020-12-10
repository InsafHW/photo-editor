import {Editor} from "../modelsTS/Editor"
import {redrawCanvas} from "./CanvasHelper"

function deleteSelectedArea(Editor: Editor, canvas: HTMLCanvasElement): Editor {
  const ctx = canvas.getContext('2d');
  if (Editor.selectedObject && ctx) {
    if (Editor.selectedObject.type === 'area') {
      const newImageData = ctx.getImageData(
        Editor.selectedObject.topLeft.x,
        Editor.selectedObject.topLeft.y,
        Editor.selectedObject.size.width,
        Editor.selectedObject.size.height
      );
      const data = newImageData.data;
      for (let i = 0; i < data.length; i += 4) {
        // Белый цвет
        newImageData.data[i] = 255;
        newImageData.data[i + 1] = 255;
        newImageData.data[i + 2] = 255;
      }
      const newEditor = {
        ...Editor,
        canvas: newImageData,
      };
      redrawCanvas(Editor, canvas);
      return newEditor;
    }
  }
  return Editor
}

export default deleteSelectedArea;