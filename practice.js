const redux = require('redux');
const createStore = redux.createStore;

const initialState = {
  canvas: 'holst',
  selectedObject: null,
  filterColor: 'red',
};

const rootReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE_SELECTED_OBJECT':
      return {
        ...state,
        selectedObject: { ...action.newObject },
      };
    case 'CREATE_NEW_HOLST':
      return {
        canvas: 'New Holst',
        selectedObject: null,
        filterColor: null,
      };
    default:
      return state;
  }
};

const store = createStore(rootReducer, initialState);
console.log(store.getState());

const unsubscribe = store.subscribe(() => {
  console.log(['Subscribe'], store.getState());
});

store.dispatch(
  changeSelectedObject({
    topLeft: { x: 0, y: 0 },
    size: { width: 100, height: 200 },
  })
);

function changeSelectedObject(properties) {
  return {
    type: 'CHANGE_SELECTED_OBJECT',
    newObject: {
      ...properties,
    },
  };
}
