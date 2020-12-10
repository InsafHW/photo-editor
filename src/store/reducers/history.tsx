import { Editor, Tool } from '../../modelsTS/Editor';
import { Filter } from '../..//modelsTS/Filter';

import * as actionTypes from "../actions"

const initialState = {
  history: []
}

const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case actionTypes.PUT_IN_HISTORY:
      console.log('[PUT IN HOSTORY]', state)
      return {
        history: state.history.concat(action.data)
      }
    default:
      return state;
  }
}

export default reducer;