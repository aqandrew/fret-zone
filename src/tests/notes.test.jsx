import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import App from '../App';
import { createDefaultTrack } from './test-utils';
import { SAME_FRET_NUMBER_CUTOFF_TIME } from '../constants';

describe('manipulating notes', () => {
  it('adds and deletes a single note or rest', () => {
    const { container } = render(<App />);
    createDefaultTrack();
    const noteInput = screen.getByLabelText('Measure input (Selected)');

    expect(noteInput).toHaveValue('-');

    fireEvent.keyDown(container, { key: '0' });
    expect(noteInput).toHaveValue('0');

    fireEvent.keyDown(container, { key: 'Backspace' });
    expect(noteInput).toHaveValue('R');

    fireEvent.keyDown(container, { key: 'Backspace' });
    expect(noteInput).toHaveValue('-');
  });

  it(`deletes a note from a chord in the document's first duration without crashing`, () => {
    const { container } = render(<App />);
    createDefaultTrack();

    fireEvent.keyDown(container, { key: '2' });
    fireEvent.keyDown(container, { key: 'ArrowDown' });
    fireEvent.keyDown(container, { key: '3' });

    expect(() => {
      fireEvent.keyDown(container, { key: 'Backspace' });
    }).not.toThrow();
  });

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
