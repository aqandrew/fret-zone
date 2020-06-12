import store from '../store';
import { setDurationLength } from '../slices/document';

// TODO Maybe this can live in an actions file, that doesn't depend on App state
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

// Display minimum 1 decimal place, rounded, not truncated
// Up to 3 decimal places, unless there's a leading 0;
// in which case up to 4 decimal places
export const roundDurationLength = (durationLength) => {
  let [integerString, decimalString] = durationLength.toString().split('.');

  // Don't display 'undefined'
  if (!decimalString) decimalString = '0';

  if (decimalString.length > 3) {
    return decimalString[0] === '0'
      ? durationLength.toFixed(4)
      : durationLength.toFixed(3);
  }

  return integerString + '.' + decimalString;
};
