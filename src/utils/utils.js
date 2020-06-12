import store from '../store';
import { setDurationLength } from '../slices/document';

// TODO Maybe this can become an actions file, that doesn't depend on App state
// App can just pass in the relevant parts of its state, once things like getSelectedDuration refactored out like so:
// https://stackoverflow.com/questions/59172453/should-i-pass-useselector-to-usestate

export const dispatchChangeNextSelectedDurationLengthIfNecessary = (
  nextSelectedDuration,
  selectedDurationLength
) => {
  if (
    !nextSelectedDuration.notes.length &&
    !nextSelectedDuration.isRest &&
    nextSelectedDuration.length !== selectedDurationLength
  ) {
    store.dispatch(
      setDurationLength({
        durationId: nextSelectedDuration.id,
        newLength: selectedDurationLength,
      })
    );
  }
};
