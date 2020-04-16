import { combineReducers } from 'redux';

import uiReducer from './ui';
import documentReducer from './document';

const rootReducer = combineReducers({
  // TODO Maybe there should be a UI reducer, to store items from App state,
  //   e.g. selectedTrackNumber, selectedMeasureNumber
  ui: uiReducer,
  document: documentReducer
});

export default rootReducer;
