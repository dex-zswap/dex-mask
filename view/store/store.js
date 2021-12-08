import rootReducer from '@view/reducer';
import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';

export default function configureStore(initialState) {
  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunkMiddleware),
  );
}
