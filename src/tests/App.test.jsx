import React from 'react';
import { unmountComponentAtNode } from 'react-dom';
import {
  render,
  fireEvent,
  screen,
  getByText,
  getByLabelText,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';

import store from '../store';
import App from '../App';

describe('App', () => {
  it('renders without throwing errors', () => {
    expect(() => {
      render(
        <Provider store={store}>
          <App />
        </Provider>
      );
    }).not.toThrow();
  });

  describe('functions that need to know the selected measure', () => {
    it('getCurrentBarMaximumDuration', () => {
      render(
        <Provider store={store}>
          <App />
        </Provider>
      );

      const barCurrentDuration = screen.getByTitle('Bar current duration');

      // Default to 1.0
      expect(barCurrentDuration).toHaveTextContent('0.0:1.0');

      // Create a new track with default options
      fireEvent.click(screen.getByTitle('Add Track'));
      const firstInput = getByLabelText(
        screen.getByRole('dialog'),
        'Electric Guitar - Clean',
        { exact: false }
      );
      fireEvent.keyDown(firstInput, { key: 'Enter' });

      // Default to 4.0 once a track is created
      expect(barCurrentDuration).toHaveTextContent('0.0:4.0');
    });

    it('getCurrentBarDuration', () => {
      // 0.0 initially
      // Add a note
      // Expect 1.0 (default note is quarter)
      // Add one measure
      // Expect new measure's length also to be 0.0 initially
    });

    describe('onKeyDown', () => {
      it('passes selectedMeasure to dispatchSelectNextDuration', () => {});
      it('passes selectedMeasure to dispatchSelectPreviousDuration', () => {});
      it('passes selectedMeasure to dispatchDeleteNote', () => {});
    });
  });
});
