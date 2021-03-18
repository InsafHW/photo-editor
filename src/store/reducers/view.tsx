import { Tool } from '../../modelsTS/Tool'
import * as actionTypes from "../actions"

const initialState = {
  fillColor: '#000',
  text: '',
  fontSize: 24,
  currentTool: Tool.rectangle,
}

const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case actionTypes.CHANGE_FILL_COLOR:
      return {
        ...state,
        fillColor: action.value
      }
    case actionTypes.CHANGE_FONT_SIZE:
      return {
        ...state,
        fontSize: action.value
      }
    case actionTypes.CHANGE_TEXT:
      return {
        ...state,
        text: action.value
      }
    default:
      return state
  }
}

export default reducer;