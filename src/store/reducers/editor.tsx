import { Editor, Tool } from '../../modelsTS/Editor';
import { Filter } from '../../modelsTS/Filter';

import * as actionTypes from "../actions"

const initialState: Editor = {
  canvas: new ImageData(800, 600),
  selectedObject: null,
  filterColor: Filter.red,
  currentTool: Tool.rectangle,
  currentId: 1
}

const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case actionTypes.CHANGE_SELECTED_OBJECT:
      return {
        ...state,
        selectedObject: { ...action.newObject }
      }
    case actionTypes.CHANGE_CURRENT_TOOL:
      return {
        ...state,
        currentTool: action.tool,
        currentId: state.currentId + 1
      }
    case actionTypes.SAVE_IMAGE_DATA:
      return {
        ...state,
        canvas: action.data
      }
    case actionTypes.DELETE_SELECTED_AREA:
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      let newData;
      const data = {...state.canvas}
      if (state.selectedObject) {
        for (let i = state.selectedObject.topLeft.x; i < state.selectedObject.topLeft.x + state.selectedObject.size.width; i++) {
          data.data[i] = 255;
          data.data[i + 1] = 255;
          data.data[i + 2] = 255;
        }
        for (let i = state.selectedObject.topLeft.y; i < state.selectedObject.topLeft.y + state.selectedObject.size.height; i++) {
          data.data[i] = 255;
          data.data[i + 1] = 255;
          data.data[i + 2] = 255;
        }
      }
      return {
        ...state,
        canvas: data
      }
    case actionTypes.APPLY_FILTER:
      console.log(action)
      const newImageData: ImageData = {...state.canvas};
      switch (action.color) {
        case Filter.blue:
          for (let i = 0; i < newImageData.data.length; i += 4) {
            newImageData.data[i] = 0; // red
            newImageData.data[i + 2] = 0; //green
          }
          break
        case Filter.green:
          for (let i = 0; i < newImageData.data.length; i += 4) {
            newImageData.data[i] = 0; // red
            newImageData.data[i + 1] = 0; // blue
          }
          break;
        case Filter.grey:
          for (let i = 0; i < newImageData.data.length; i += 4) {
            let ttl = newImageData.data[i] + newImageData.data[i + 1] + newImageData.data[i + 2];
            let avg = Math.floor(ttl / 3);
            newImageData.data[i] = avg; //red
            newImageData.data[i + 1] = avg; //blue
            newImageData.data[i + 2] = avg; //gren
          }
          break;
        case Filter.red:
          for (let i = 0; i < newImageData.data.length; i += 4) {
            newImageData.data[i + 1] = 0; //blue
            newImageData.data[i + 2] = 0; //green
          }
          break;
        default:
          break;
      }
      return {
        ...state,
        canvas: newImageData
      }
    default:
      return state;
  }
}

export default reducer;