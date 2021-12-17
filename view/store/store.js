import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '@view/reducer';
export default function configureStore(initialState) {
  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunkMiddleware),
  );
}
