import { Editor } from '../modelsTS/Editor';
import { Rectangle } from '../modelsTS/Primitives';

function selectArea(editor: Editor, area: Rectangle): Editor {
  const newEditor: Editor = {
    ...editor,
    selectedObject: { ...area }
  }
  return newEditor;
}

export default selectArea;