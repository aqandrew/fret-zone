import { initialState as initialDocumentState } from '../slices/document';
import { initialState as initialUiState } from '../slices/ui';
import rootReducer from '../slices';

describe('reducers', () => {
  it('initializes document state correctly', () => {
    expect(rootReducer(undefined, {}).document).toEqual(initialDocumentState);
  });

  it('initializes UI state correctly', () => {
    expect(rootReducer(undefined, {}).ui).toEqual(initialUiState);
  });
});
