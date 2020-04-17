import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

// TODO Alphabetize imports w/ESLint
import {
  selectTrack,
  selectedTrackNumberSelector,
  selectedMeasureNumberSelector
} from './slices/ui';
import {
  addMeasure,
  defaultMeasureOptions,
  measuresSelector,
  tracksSelector
} from './slices/document';
import AppMenu from './components/AppMenu';
import FileList from './components/FileList';
import CheckboxButton from './components/CheckboxButton';
import EditionPalette from './components/EditionPalette';
import Document from './components/Document';
import Inspector from './components/Inspector';
import GlobalView from './components/GlobalView';
import AddTrackModal from './components/AddTrackModal';

import './App.scss';

const App = () => {
  const dispatch = useDispatch();
  const tracks = useSelector(tracksSelector);
  const measures = useSelector(measuresSelector);
  const selectedTrackNumber = useSelector(selectedTrackNumberSelector);
  const selectedMeasureNumber = useSelector(selectedMeasureNumberSelector);

  // TODO Put fileList in Redux store
  const dummyFileList = [
    { id: 0, name: '' }
    // { id: 1, name: 'Stairway to Heaven' },
    // { id: 2, name: 'Through the Fire and Flames' }
  ];

  // TODO Determine active file via id, not name
  const [activeFileName, setActiveFileName] = useState(dummyFileList[0].name);
  const [editionPaletteShown, setEditionPaletteShown] = useState(true);
  const [globalViewShown, setGlobalViewShown] = useState(true);
  const [inspectorShown, setInspectorShown] = useState(true);
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentArtist, setDocumentArtist] = useState('');
  const [showAddTrackModal, setShowAddTrackModal] = useState(false);

  const onKeyDown = useCallback(
    event => {
      if (
        event.target.tagName !== 'INPUT' ||
        event.target.classList.contains('Measure__Input')
      ) {
        const selectedTrack = tracks[selectedTrackNumber];

        switch (event.key) {
          case 'ArrowRight':
            // TODO If the currently focused measure is NOT last,
            // TODO   If currently selected note is NOT last,
            // TODO     Select the next note
            // TODO   Otherwise, select the next measure
            // Otherwise, add a measure to selectedTrack
            dispatch(
              addMeasure({
                trackId: selectedTrack.id,
                id: uuidv4(),
                ...defaultMeasureOptions
              })
            );
            // TODO Add measures to all other tracks too
            break;
          default:
            break;
        }
      }
    },
    [dispatch, tracks, selectedTrackNumber]
  );

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onKeyDown]);

  const renderBarCurrentDuration = () => {
    if (tracks.length && measures.length) {
      const selectedMeasure = measures.find(
        measure =>
          measure.id ===
          tracks[selectedTrackNumber].measures[selectedMeasureNumber]
      );

      // TODO Calculate currentBarDuration based on notes in bar
      let currentBarDuration = 0;
      let currentBarMaximumDuration =
        (selectedMeasure.timeSignature.beatUnit / 4) *
        selectedMeasure.timeSignature.beatsPerMeasure;

      // TODO Display minimum 1 decimal place, and up to 4 decimal places,
      //   rounded, not truncated
      //     e.g. 0.0, 0.5, 0.25, 0.125, 0.0625 (duplets)
      //          0.667, 0.333, 0.167, 0.0833, 0.0417 (triplets)
      return (
        currentBarDuration.toFixed(1) +
        ':' +
        currentBarMaximumDuration.toFixed(1)
      );
    }

    return null;
  };

  if (tracks.length) {
    const selectedTrack = tracks[selectedTrackNumber];

    return (
      <div className="App" onKeyDown={onKeyDown}>
        <AppMenu />
        <div className="TopBar">
          <div className="TopBar__ActiveFileName">
            {activeFileName || 'untitled'}
          </div>
          <div className="ScoreControls">
            <div className="ScoreControls__ButtonContainer">
              <CheckboxButton
                buttonTitle="Show/Hide Edition Palette"
                isChecked={editionPaletteShown}
                setChecked={setEditionPaletteShown}
              />
              <CheckboxButton
                buttonTitle="Show/Hide Global View"
                isChecked={globalViewShown}
                setChecked={setGlobalViewShown}
              />
              <CheckboxButton
                buttonTitle="Show/Hide Inspector"
                isChecked={inspectorShown}
                setChecked={setInspectorShown}
              />
            </div>
            {/* TODO Zoom control */}
            {/* TODO Document view select */}
            {/* TODO Undo/redo */}
            {/* TODO Print */}
            <div className="PlaybackControls">
              <div
                className="PlaybackControls__Display PlaybackControls__Display--CurrentTrack"
                title="Current track (Click to change)"
              >
                {selectedTrackNumber + 1}. {selectedTrack.fullName}
              </div>
              {/* TODO Click to open "Go to" modal */}
              <div
                className="PlaybackControls__Display PlaybackControls__Display--BarPosition"
                title="Bar position"
              >
                {selectedMeasureNumber + 1}/{selectedTrack.measures.length}
              </div>
              {/* TODO Click to toggle incomplete duration vs. remaining duration */}
              <div
                className="PlaybackControls__Display PlaybackControls__Display--BarCurrentDuration"
                title="Bar current duration"
              >
                {renderBarCurrentDuration()}
              </div>
            </div>
            <div className="ScoreControls__ButtonContainer">
              {/* TODO Buttons for fretboard/keyboard/drum view */}
            </div>
          </div>
        </div>
        <FileList
          files={dummyFileList}
          activeFileName={activeFileName}
          setActiveFileName={setActiveFileName}
        />
        <div className="App__Content--Main">
          <div className="App__Content--Center">
            {editionPaletteShown && <EditionPalette />}
            <Document
              documentTitle={documentTitle}
              documentArtist={documentArtist}
              selectedTrackNumber={selectedTrackNumber}
            />
            {inspectorShown && (
              <Inspector
                setDocumentTitle={setDocumentTitle}
                setDocumentArtist={setDocumentArtist}
              />
            )}
          </div>
          {globalViewShown && (
            <GlobalView openAddTrackModal={() => setShowAddTrackModal(true)} />
          )}
        </div>
        <AddTrackModal
          show={showAddTrackModal}
          onClose={newTrackId => {
            setShowAddTrackModal(false);

            if (newTrackId) {
              dispatch(selectTrack(tracks.length));
            }
          }}
        />
      </div>
    );
  }

  return null;
};

export default App;
