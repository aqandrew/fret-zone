// TODO Put these in their own separate files,
// once we figure out what other constants should be accessible by multiple
// components
export const maximumFretNumber = 63;

export const sameFretNumberCutoffTime = 1000;

export const durationLengths = {
  1: { name: 'Whole', abbreviation: 'w' },
  [1 / 2]: { name: 'Half', abbreviation: 'h' },
  [1 / 4]: { name: 'Quarter', abbreviation: 'q' },
  [1 / 8]: { name: 'Eighth', abbreviation: 'e' },
  [1 / 16]: { name: 'Sixteenth', abbreviation: 'x' },
  [1 / 32]: { name: 'Thirty-Second', abbreviation: 't' },
  [1 / 64]: { name: 'Sixty-Fourth', abbreviation: 's' },
};

export const zoomOptions = [
  'Fit to Width',
  'Fit to Page',
  0.25,
  0.5,
  0.75,
  0.9,
  1,
  1.1,
  1.25,
  1.5,
  2,
  3,
  4,
  8,
  'Custom...',
];

export const modes = {
  page: 'Page',
  screen: 'Screen',
};

export const orientations = {
  vertical: 'Vertical',
  horizontal: 'Horizontal',
  grid: 'Grid',
  parchment: 'Parchment',
};

export const displayModes = [
  { mode: modes.page, orientation: orientations.vertical },
  { mode: modes.page, orientation: orientations.horizontal },
  { mode: modes.page, orientation: orientations.grid },
  { mode: modes.page, orientation: orientations.parchment },
  { mode: modes.screen, orientation: orientations.vertical },
  { mode: modes.screen, orientation: orientations.horizontal },
];

export const notesSharp = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
];

export const notesFlat = [
  'C',
  'Db',
  'D',
  'Eb',
  'E',
  'F',
  'Gb',
  'G',
  'Ab',
  'A',
  'Bb',
  'B',
];
