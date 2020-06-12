const { roundDurationLength } = require('../utils');

describe('roundDurationLength', () => {
  it('rounds 0', () => {
    expect(roundDurationLength(0)).toBe('0.0');
  });

  describe('duplets', () => {
    it('rounds a quarter note', () => {
      // A quarter note has a value of 1 because it's a quarter of 4 beats
      expect(roundDurationLength((1 / 4) * 4)).toBe('1.0');
    });

    it('rounds an eighth note', () => {
      expect(roundDurationLength((1 / 8) * 4)).toBe('0.5');
    });

    it('rounds a sixteenth note', () => {
      expect(roundDurationLength((1 / 16) * 4)).toBe('0.25');
    });

    it('rounds a thirty-second note', () => {
      expect(roundDurationLength((1 / 32) * 4)).toBe('0.125');
    });

    it('rounds a sixty-fourth note', () => {
      expect(roundDurationLength((1 / 64) * 4)).toBe('0.0625');
    });
  });

  describe('triplets', () => {
    // Multiply by 2/3 because 3 triplets have the same length as 2 duplets
    it('rounds a triplet quarter note', () => {
      expect(roundDurationLength(((1 / 4) * 4 * 2) / 3)).toBe('0.667');
    });

    it('rounds a triplet eighth note', () => {
      expect(roundDurationLength(((1 / 8) * 4 * 2) / 3)).toBe('0.333');
    });

    it('rounds a triplet sixteenth note', () => {
      expect(roundDurationLength(((1 / 16) * 4 * 2) / 3)).toBe('0.167');
    });

    it('rounds a triplet thirty-second note', () => {
      expect(roundDurationLength(((1 / 32) * 4 * 2) / 3)).toBe('0.0833');
    });

    it('rounds a triplet sixty-fourth note', () => {
      expect(roundDurationLength(((1 / 64) * 4 * 2) / 3)).toBe('0.0417');
    });
  });
});
