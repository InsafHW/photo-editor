import { Editor } from '../modelsTS/Editor';
import { TextUI } from '../modelsTS/TextUI';
import { drawText } from "./DrawHelper"

function insertText(Editor: Editor, Text: TextUI, tempCanvas: HTMLCanvasElement): Editor {
  const newEditor = {
    ...Editor,
    selectedObject: { ...Text },
  };
  drawText(Text, tempCanvas);
  return newEditor;
}

export default insertText;