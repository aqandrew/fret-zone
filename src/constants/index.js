// TODO Put these in their own separate files,
// once we figure out what other constants should be accessible by multiple
// components
export const maximumFretNumber = 63;

export const sameFretNumberCutoffTime = 1000;

export const durationMarkers = {
  1: 'w',
  [1 / 2]: 'h',
  [1 / 4]: 'q',
  [1 / 8]: 'e',
  [1 / 16]: 'x',
  [1 / 32]: 't',
  [1 / 64]: 's',
};

export default durationMarkers;
