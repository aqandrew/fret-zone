import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import App from '../App';
import { createDefaultTrack } from './test-utils';

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

  // TODO Add addTrack test
  // TODO Add deleteTrack test

  test('selecting strings', () => {
    const { container } = render(<App />);
    createDefaultTrack();
    const durationColumn = screen.getByLabelText('Duration');

    const expectNthStringToBeSelected = (n) => {
      expect(durationColumn.childNodes[n].getAttribute('aria-label')).toMatch(
        /Selected/
      );
    };

    expectNthStringToBeSelected(0);

    fireEvent.keyDown(container, { key: 'ArrowDown' });
    fireEvent.keyDown(container, { key: 'ArrowDown' });
    fireEvent.keyDown(container, { key: 'ArrowDown' });
    fireEvent.keyDown(container, { key: 'ArrowDown' });
    fireEvent.keyDown(container, { key: 'ArrowDown' });
    expectNthStringToBeSelected(5);

    fireEvent.keyDown(container, { key: 'ArrowDown' });
    expectNthStringToBeSelected(0);

    fireEvent.keyDown(container, { key: 'ArrowUp' });
    expectNthStringToBeSelected(5);

    fireEvent.keyDown(container, { key: 'ArrowUp' });
    fireEvent.keyDown(container, { key: 'ArrowUp' });
    fireEvent.keyDown(container, { key: 'ArrowUp' });
    fireEvent.keyDown(container, { key: 'ArrowUp' });
    fireEvent.keyDown(container, { key: 'ArrowUp' });
    expectNthStringToBeSelected(0);
  });
});
