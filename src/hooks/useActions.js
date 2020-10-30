import { useDocument } from './useDocument';
import * as actionTypes from '../actionTypes';

// Similar to Redux's bound action creators,
// so that state-dependent dispatch logic can exist outside of components
export const useActions = (state, dispatch) => {
  const { selectedDuration } = useDocument(state);

  const dispatchShortenDuration = (durationId) => {
    dispatch({
      type: actionTypes.SET_DURATION_LENGTH,
      durationId: durationId,
      newLength: selectedDuration?.length / 2,
    });
  };

  const dispatchLengthenDuration = (durationId) => {
    dispatch({
      type: actionTypes.SET_DURATION_LENGTH,
      durationId: durationId,
      newLength: selectedDuration?.length * 2,
    });
  };

  return { dispatchShortenDuration, dispatchLengthenDuration };
};
