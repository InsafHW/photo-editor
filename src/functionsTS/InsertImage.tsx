import { Editor } from '../modelsTS/Editor';
import { ImageUI } from '../modelsTS/ImagUI';
import { drawImage } from "./DrawHelper"

function insertImage(Editor: Editor, Image: ImageUI, tempCanvas: HTMLCanvasElement): Editor {
  const newEditor = {
    ...Editor,
    selectedObject: { ...Image },
  };
  drawImage(Image, tempCanvas);
  return newEditor;
}

export default insertImage;