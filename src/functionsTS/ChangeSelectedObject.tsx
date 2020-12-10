import { Editor } from '../modelsTS/Editor';
import { ImageUI } from '../modelsTS/ImagUI';
import { Primitive } from '../modelsTS/Primitives';
import { TextUI } from '../modelsTS/TextUI';
import drawSelectedObject from "./DrawSelectedObject"

// function changeSelectedObject(Editor: Editor, 
//     newSelObj: Primitive | ImageUI | TextUI, 
//     canvas: HTMLCanvasElement): Editor {
      
//       // сохранить в историю
//       // темп объект добавить в imageData и перерисовать canvas
//   const newEditor = drawSelectedObject(Editor, canvas);
//   newEditor.selectedObject = { ...newSelObj };
//   return newEditor;
// }

function changeSelectedObject(editor: Editor, newSelObj: Primitive | ImageUI | TextUI): Editor {
  const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');
  const imgData = ctx?.getImageData(0, 0, canvas.width, canvas.height) as ImageData;
  const newEditor: Editor = {
    ...editor,
    canvas: imgData,
    selectedObject: { ...newSelObj }
  }
  console.log('Changed');
  return newEditor;
}

export default changeSelectedObject;