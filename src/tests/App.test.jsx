import React from 'react';
import {
  render,
  fireEvent,
  screen,
  getByLabelText,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import App from '../App';
import { SAME_FRET_NUMBER_CUTOFF_TIME } from '../constants';

const createDefaultTrack = () => {
  fireEvent.click(screen.getByTitle('Add Track'));
  const firstInput = getByLabelText(
    screen.getByRole('dialog'),
    'Clean Guitar',
    { exact: false }
  );
  fireEvent.keyDown(firstInput, { key: 'Enter' });
};

describe('App', () => {
  it('renders without throwing errors', () => {
    expect(() => {
      render(<App />);
    }).not.toThrow();
  });

  describe('EditionPalette', () => {
    it('toggles visibility via ToolBar button', () => {
      render(<App />);

      const editionPaletteToggle = screen.getByTitle(
        'Show/Hide Edition Palette'
      );

      expect(screen.getByLabelText('Edition Palette')).toBeInTheDocument();

      fireEvent.click(editionPaletteToggle);

      expect(
        screen.queryByLabelText('Edition Palette')
      ).not.toBeInTheDocument();

      fireEvent.click(editionPaletteToggle);

      expect(screen.getByLabelText('Edition Palette')).toBeInTheDocument();
    });
  });

  test('bar current duration', () => {
    const { container } = render(<App />);
    const barCurrentDuration = screen.getByTitle('Bar current duration');

    expect(barCurrentDuration).toHaveTextContent('0.0:1.0');

    createDefaultTrack();

    // Default time signature is 4/4
    expect(barCurrentDuration).toHaveTextContent('0.0:4.0');

    fireEvent.keyDown(container, { key: '0' });

    // Default note is a quarter note
    expect(barCurrentDuration).toHaveTextContent('1.0:4.0');

    // Add one measure
    fireEvent.keyDown(container, { key: 'ArrowRight' });
    fireEvent.keyDown(container, { key: 'ArrowRight' });

    // Expect additional measure's length also to be 0.0 initially
    expect(barCurrentDuration).toHaveTextContent('0.0:4.0');
  });

  describe('manipulating notes', () => {
    it('adds a note with fret >= 10 if numbers are pressed rapidly', () => {
      const { container } = render(<App />);
      createDefaultTrack();

      fireEvent.keyDown(container, { key: '1' });
      fireEvent.keyDown(container, { key: '2' });

      const noteInput = screen.getByLabelText('Measure input (Selected)');
      expect(noteInput).toHaveValue('12');
    });

    it(`overwrites notes if there's >= 1s delay between number presses`, () => {
      // 'modern' will be default in Jest 27
      jest.useFakeTimers('modern');

      const { container } = render(<App />);
      createDefaultTrack();
      const noteInput = screen.getByLabelText('Measure input (Selected)');

      fireEvent.keyDown(container, { key: '1' });

      jest.advanceTimersByTime(SAME_FRET_NUMBER_CUTOFF_TIME);

      fireEvent.keyDown(container, { key: '2' });
      expect(noteInput).toHaveValue('2');
    });
  });
});
