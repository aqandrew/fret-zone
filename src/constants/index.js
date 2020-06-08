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

export default durationLengths;
