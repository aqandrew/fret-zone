import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import App from '../App';
import { SAME_FRET_NUMBER_CUTOFF_TIME } from '../constants';

const createDefaultTrack = () => {
	// Assume this is one of the first actions taken
	fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Enter' });
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
			vi.useFakeTimers();

			const { container } = render(<App />);
			createDefaultTrack();
			const noteInput = screen.getByLabelText('Measure input (Selected)');

			fireEvent.keyDown(container, { key: '1' });

			vi.advanceTimersByTime(SAME_FRET_NUMBER_CUTOFF_TIME);

			fireEvent.keyDown(container, { key: '2' });
			expect(noteInput).toHaveValue('2');
		});
	});
});
