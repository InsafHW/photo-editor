import { stat } from 'fs';
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
      const canvas1: HTMLCanvasElement | null = document.querySelector("#canvas");
      const ctx = canvas1?.getContext('2d');
      if (!ctx) return state;
      const imgData: ImageData = ctx.createImageData(state.canvas.width, state.canvas.height);
      imgData.data.set(state.canvas.data);
      console.log('STATE', state)
      console.log(imgData)
      switch (action.color) {
        case Filter.grey:
          console.log('GREY')
          for (let i = 0; i < imgData.height; i++) {
            for (let j = 0; j < imgData.width; j++) {
              let dataIndex = (i * imgData.width + j) * 4;
              let ave = (imgData.data[dataIndex] + imgData.data[dataIndex + 1] + imgData.data[dataIndex + 2]) / 3;
              for (var k = 0; k < 3; k++) {
                imgData.data[dataIndex + k] = ave;
              }
            }
          }
        break;
        case Filter.blue:
          addFilter(imgData, [0, 0, 1, 1]);
          break;
        case 'green':
          addFilter(imgData, [0, 1, 0, 1]);
        break;
        case 'red':
          addFilter(imgData, [1, 0, 0, 1]);
        break;
      }
      return {
        ...state,
        canvas: imgData
      }
    default:
      return state;
  }
}

function addFilter(imgData: ImageData, filterArray: Array<number>) {
  for (let i = 0; i < imgData.height; i++) {
    for (let j = 0; j < imgData.width; j++) {
      let dataIndex = (i * imgData.width + j) * 4;
      for (let k = 0; k < 4; k++) {
        imgData.data[dataIndex + k] *= filterArray[k];
      }
    }
  }
}

export default reducer;