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

  // Only change the next selected duration's dotting if it's empty
  if (
    !nextSelectedDuration.notes.length &&
    !nextSelectedDuration.isRest &&
    nextSelectedDuration.isDotted !== selectedDuration.isDotted
  ) {
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

// Given a decimal number n, return a string representing n as a percentage
// formatPercentage(0.25) => '25%'
// formatPercentage(2) => '200%'
export const formatPercentage = (n) => {
  n *= 100;

  // Assume we only want to see integer percentages if they're 100% or above
  // Prevents funny-looking results like 1.1 * 100 => 110.00000000000001
  if (n >= 1) {
    n = Math.trunc(n);
  }

  return n + '%';
};

// Best-fit curve for strictly increasing exponential curve through the following points:
// (0, 0.1)
// (0.5, 1)
// (1, 8)
export const getZoomLevelFromSlider = (sliderValue) => {
  const a = 18997 / 500;
  const b = 302469 / 5000;
  const c = -32031 / 125000;
  const d = -327869 / 100000;

  return Math.round(a * Math.pow(b, sliderValue + c) + d) / 100;
};

export const getSliderLevelFromZoom = (zoomValue) => {
  // TODO
};
