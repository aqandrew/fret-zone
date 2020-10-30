import { fireEvent, screen, getByLabelText } from '@testing-library/react';

export const createDefaultTrack = () => {
  fireEvent.click(screen.getByTitle('Add Track'));
  const firstInput = getByLabelText(
    screen.getByRole('dialog'),
    'Clean Guitar',
    { exact: false }
  );
  fireEvent.keyDown(firstInput, { key: 'Enter' });
};
