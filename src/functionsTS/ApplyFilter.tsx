import { Editor } from '../modelsTS/Editor';
import { Filter } from '../modelsTS/Filter';
import { redrawCanvas } from "./CanvasHelper"

function applyFilter(Editor: Editor, Filter: Filter, canvas: HTMLCanvasElement): Editor {
  const newImageData: ImageData = Editor.canvas;
  switch (Filter) {
    case 'grey':
      for (let i = 0; i < newImageData.data.length; i += 4) {
        let ttl = newImageData.data[i] + newImageData.data[i + 1] + newImageData.data[i + 2];
        let avg = Math.floor(ttl / 3);
        newImageData.data[i] = avg; //red
        newImageData.data[i + 1] = avg; //blue
        newImageData.data[i + 2] = avg; //gren
      }
      break;
    case 'red':
      for (let i = 0; i < newImageData.data.length; i += 4) {
        newImageData.data[i + 1] = 0; //blue
        newImageData.data[i + 2] = 0; //green
      }
      break;
    case 'blue':
      for (let i = 0; i < newImageData.data.length; i += 4) {
        newImageData.data[i] = 0; // red
        newImageData.data[i + 2] = 0; //green
      }
      break;
    case 'green':
      for (let i = 0; i < newImageData.data.length; i += 4) {
        newImageData.data[i] = 0; // red
        newImageData.data[i + 1] = 0; // blue
      }
      break;
    default:
      break;
  }

  const newEditor: Editor = {
    ...Editor,
    canvas: newImageData,
    filterColor: Filter,
  };
  
  redrawCanvas(newEditor, canvas)
  return newEditor
}

export default applyFilter;