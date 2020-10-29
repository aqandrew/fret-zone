// TODO Put these in their own separate files,
// once we figure out what other constants should be accessible by multiple
// components
export const MAXIMUM_FRET_NUMBER = 63;

export const SAME_FRET_NUMBER_CUTOFF_TIME = 1000;

export const DURATION_LENGTHS = {
  1: { name: 'Whole', abbreviation: 'w' },
  [1 / 2]: { name: 'Half', abbreviation: 'h' },
  [1 / 4]: { name: 'Quarter', abbreviation: 'q' },
  [1 / 8]: { name: 'Eighth', abbreviation: 'e' },
  [1 / 16]: { name: 'Sixteenth', abbreviation: 'x' },
  [1 / 32]: { name: 'Thirty-Second', abbreviation: 't' },
  [1 / 64]: { name: 'Sixty-Fourth', abbreviation: 's' },
};

export const ZOOM_OPTIONS = [
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

export const VIEW_MODES = {
  page: 'Page',
  screen: 'Screen',
};

export const ORIENTATIONS = {
  vertical: 'Vertical',
  horizontal: 'Horizontal',
  grid: 'Grid',
  parchment: 'Parchment',
};

export const DISPLAY_MODES = [
  { mode: VIEW_MODES.page, orientation: ORIENTATIONS.vertical },
  { mode: VIEW_MODES.page, orientation: ORIENTATIONS.horizontal },
  { mode: VIEW_MODES.page, orientation: ORIENTATIONS.grid },
  { mode: VIEW_MODES.page, orientation: ORIENTATIONS.parchment },
  { mode: VIEW_MODES.screen, orientation: ORIENTATIONS.vertical },
  { mode: VIEW_MODES.screen, orientation: ORIENTATIONS.horizontal },
];

export const NOTES_SHARP = [
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

export const NOTES_FLAT = [
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
