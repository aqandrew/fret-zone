import { combineReducers } from 'redux';

import uiReducer from './ui';
import documentReducer from './document';

const rootReducer = combineReducers({
  ui: uiReducer,
  document: documentReducer
});

export default rootReducer;
