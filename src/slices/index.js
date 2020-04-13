import { combineReducers } from 'redux';

import documentReducer from './document';

const rootReducer = combineReducers({
  // TODO Maybe there should be a UI reducer, to store items from App state,
  //   e.g. selectedTrackIndex, selectedMeasureNumber
  document: documentReducer
});

export default rootReducer;
