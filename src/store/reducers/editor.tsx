import { Editor, Tool } from '../../modelsTS/Editor';
import { Filter } from '../../modelsTS/Filter';

import * as actionTypes from "../actions"

const initialState: Editor = {
  canvas: new ImageData(800, 600),
  selectedObject: null,
  filterColor: Filter.red,
  currentTool: Tool.rectangle,
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
        ctx?.clearRect(0, 0, state.canvas.width, state.canvas.height);
        ctx?.putImageData(state.canvas, 0, 0);
        ctx?.clearRect(state.selectedObject.topLeft.x, state.selectedObject.topLeft.y, state.selectedObject.size.width, state.selectedObject.size.height)
        const newData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        return {
          ...state,
          canvas: newData
        }
      }
      return state;
    case actionTypes.APPLY_FILTER:
      const imgData: ImageData = new ImageData(state.canvas.width, state.canvas.height);
      imgData.data.set(state.canvas.data)
      // imgData['width'] = state.canvas.width;
      // console.log(state.canvas)
      console.log(imgData)
      // console.log(state.filterColor)
      switch (action.color) {
        case Filter.blue:
          for (let i = 0 ; i < imgData.data.length; i+=4) {
            imgData.data[i] = 0;
            imgData.data[i + 1] = 0;
          }
          break;
        case Filter.green:
          for (let i = 0 ; i < imgData.data.length; i+=4) {
            imgData.data[i] = 0;
            imgData.data[i + 2] = 0;
          }
        break;
        case Filter.red:
          for (let i = 0 ; i < imgData.data.length; i+=4) {
            imgData.data[i + 1] = 0;
            imgData.data[i + 2] = 0;
          }
        break;
      }
      console.log(imgData)
      return {
        ...state,
        canvas: imgData,
        filterColor: action.color
      }
    case actionTypes.CREATE_NEW_HOLST:
      const newCanvas = new ImageData(action.size.width, action.size.height);
      newCanvas.data.fill(255);
      return {
        ...state,
        canvas: newCanvas,
        selectedObject: null
      }
    default:
      return state;
  }
}

export default reducer;