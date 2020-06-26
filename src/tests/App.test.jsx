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
      const { container } = render(
        <Provider store={store}>
          <App />
        </Provider>
      );

      const barCurrentDuration = screen.getByTitle('Bar current duration');

      // 0.0 initially
      // TODO The store is persisting between tests,
      // so the getCurrentBarMaximumDuration test, which just executed,
      // has already inserted a new track
      // This means that the innerText will really be '0.0:4.0', not '0.0:1.0' as expected
      expect(barCurrentDuration).toHaveTextContent(/0\.0(?=:)/);

      // Add a note
      fireEvent.keyDown(container, { key: '0' });

      // Expect 1.0 (default note is quarter)
      expect(barCurrentDuration).toHaveTextContent(/1\.0(?=:)/);

      // Add one measure
      fireEvent.keyDown(container, { key: 'ArrowRight' });
      fireEvent.keyDown(container, { key: 'ArrowRight' });

      // Expect new measure's length also to be 0.0 initially
      expect(barCurrentDuration).toHaveTextContent(/0\.0(?=:)/);
    });

    describe('onKeyDown', () => {
      it('passes selectedMeasure to dispatchSelectNextDuration', () => {});
      it('passes selectedMeasure to dispatchSelectPreviousDuration', () => {});
      it('passes selectedMeasure to dispatchDeleteNote', () => {});
    });
  });
});
