import { Editor } from '../../modelsTS/Editor';
import { Filter } from '../../modelsTS/Filter';
import { Tool } from '../../modelsTS/Tool'
import {drawPrimitive} from "../../functionsTS/canvasHelper"

import * as actionTypes from "../actions"

const initialState: Editor = {
  canvas: new ImageData(800, 600),
  selectedObject: null,
  currentTool: Tool.rectangle
}

const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case actionTypes.CHANGE_CURRENT_TOOL:
      return {
        ...state,
        currentTool: action.tool,
      }
    case actionTypes.CHANGE_SELECTED_OBJECT:
      return {
        ...state,
        selectedObject: { ...action.newObject }
      }
    case actionTypes.SAVE_IMAGE_DATA:
      return {
        ...state,
        canvas: action.data
      }
    case actionTypes.DELETE_SELECTED_AREA:
      const canvas = document.getElementById('canvas') as HTMLCanvasElement;
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
      const canvasEL = document.getElementById('canvas') as HTMLCanvasElement;
      const ctx = canvasEL.getContext('2d');
      ctx?.clearRect(0, 0, state.canvas.width, state.canvas.height);
      ctx?.putImageData(state.canvas, 0, 0);
      if (state.selectedObject) {
        if (state.selectedObject.type === 'image') {
          const image = new Image();
          image.src = state.selectedObject.src;
          const width = state.selectedObject.size.width;
          const height = state.selectedObject.size.height;
          ctx?.drawImage(image, state.selectedObject.topLeft.x, state.selectedObject.topLeft.y, width, height)
        } else if (state.selectedObject.type === 'text') {
          if (ctx) {
            ctx.fillStyle = state.selectedObject.fillColor;
          }
          if (state.selectedObject.text) {
            ctx?.fillText(state.selectedObject.text, state.selectedObject.topLeft.x, state.selectedObject.topLeft.y + (+state.selectedObject.fontSize));
          }
        } else {
          if (ctx) {
            ctx.fillStyle = state.selectedObject.fillColor;
          }
          drawPrimitive(ctx, state.selectedObject);
        }
      }
      const imgData = ctx?.getImageData(0, 0, state.canvas.width, state.canvas.height);
      if (!imgData) return state;
      switch (action.color) {
        case Filter.blue:
          for (let i = 0 ; i < imgData.data.length; i+=4) {
            imgData.data[i] = 0;
            imgData.data[i + 1] = 0;
            if (imgData.data[i + 2] === 0) {
              imgData.data[i + 2] = 255;
            }
          }
          break;
        case Filter.green:
          for (let i = 0 ; i < imgData.data.length; i+=4) {
            imgData.data[i] = 0;
            if (imgData.data[i + 1] === 0) {
              imgData.data[i + 1] = 255;
            }
            imgData.data[i + 2] = 0;
          }
        break;
        case Filter.red:
          for (let i = 0 ; i < imgData.data.length; i+=4) {
            if (imgData.data[i] === 0) {
              imgData.data[i] = 255;
            }
            imgData.data[i + 1] = 0;
            imgData.data[i + 2] = 0;
          }
        break;
        case Filter.grey:
          for (let i = 0; i < imgData.data.length; i+=4) {
            let ave = (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3;
            imgData.data[i] = ave;
            imgData.data[i + 1] = ave;
            imgData.data[i + 2] = ave;
          }
      }
      return {
        ...state,
        canvas: imgData,
        selectedObject: null
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