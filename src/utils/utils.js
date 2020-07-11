import store from '../store';
import { setDurationLength, setDurationDotted } from '../slices/document';

// TODO Maybe this can live in an actions file, that doesn't depend on App state
// App can just pass in the relevant parts of its state
export const dispatchChangeNextSelectedDurationLengthIfNecessary = (
  nextSelectedDuration,
  selectedDuration
) => {
  if (
    !nextSelectedDuration.notes.length &&
    !nextSelectedDuration.isRest &&
    nextSelectedDuration.length !== selectedDuration.length
  ) {
    store.dispatch(
      setDurationLength({
        durationId: nextSelectedDuration.id,
        newLength: selectedDuration.length,
      })
    );
  }

  if (nextSelectedDuration.isDotted !== selectedDuration.isDotted) {
    store.dispatch(
      setDurationDotted({
        durationId: nextSelectedDuration.id,
        isDotted: selectedDuration.isDotted,
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

// Given
export const formatPercentage = (n) => {
  n *= 100;

  // Assume we only want to see integer percentages
  // Prevents funny-looking results like 1.1 * 100 === 110.00000000000001
  if (n >= 1) {
    n = n.toFixed(0);
  }

  return n + '%';
};
