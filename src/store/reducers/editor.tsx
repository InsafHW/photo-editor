import { stat } from 'fs';
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
      console.log(action.newObject)
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
      const canvas: HTMLCanvasElement | null = document.querySelector('#canvas');
      if (canvas && state.selectedObject) {
        const ctx = canvas.getContext('2d')
        ctx?.clearRect(state.selectedObject.topLeft.x, state.selectedObject.topLeft.y, state.selectedObject.size.width, state.selectedObject.size.height)
        const newData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        return {
          ...state,
          canvas: newData
        }
      }
      return state;
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