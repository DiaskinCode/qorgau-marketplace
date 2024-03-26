// reducers/index.js

import { combineReducers } from 'redux';
import authReducer from './authReducer';
import { api } from '../api';

const rootReducer = combineReducers({
  auth: authReducer,
  [api.reducerPath]: api.reducer,
});


export default rootReducer;