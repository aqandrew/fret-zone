import { combineReducers } from 'redux';

import documentReducer from './document';

const rootReducer = combineReducers({
  document: documentReducer,
});

export default rootReducer;
