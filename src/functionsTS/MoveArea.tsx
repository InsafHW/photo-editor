import { Editor } from '../modelsTS/Editor';
import { Point } from '../modelsTS/Point';

function moveArea(editor: Editor, newTopLeft: Point): Editor {
  if (editor.selectedObject) {
    if (editor.selectedObject.type === 'area') {
      const newEditor: Editor = {
        ...editor,
        selectedObject: {
          ...editor.selectedObject,
          topLeft: { ...newTopLeft }
        }
      }
      return newEditor;
    }
  }
  return editor;
}

export default moveArea;