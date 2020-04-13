import React, { useState } from 'react';
import { useSelector } from 'react-redux';

// TODO Alphabetize imports w/ESLint
import { tracksSelector } from './slices/document';
import { measuresSelector } from './slices/document';
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
  const tracks = useSelector(tracksSelector);
  const measures = useSelector(measuresSelector);

  // TODO Put fileList in Redux store
  const dummyFileList = [
    { id: 0, name: '' }
    // { id: 1, name: 'Stairway to Heaven' },
    // { id: 2, name: 'Through the Fire and Flames' }
  ];

  // TODO Determine active file via id, not name
  const [activeFileName, setActiveFileName] = useState(dummyFileList[0].name);
  const [selectedMeasureNumber, setSelectedMeasureNumber] = useState(1);
  // TODO What if there are no tracks?
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(0);
  const [editionPaletteShown, setEditionPaletteShown] = useState(true);
  const [globalViewShown, setGlobalViewShown] = useState(true);
  const [inspectorShown, setInspectorShown] = useState(true);
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentArtist, setDocumentArtist] = useState('');
  const [showAddTrackModal, setShowAddTrackModal] = useState(false);

  const renderBarCurrentDuration = () => {
    if (tracks.length && measures.length) {
      const selectedMeasure = measures.find(
        measure =>
          measure.id ===
          tracks[selectedTrackIndex].measures[selectedMeasureNumber - 1]
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

  return (
    <div className="App">
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
            <div className="PlaybackControls__Display--CurrentTrack">
              TODO Show current track
            </div>
            {/* TODO Click to open "Go to" modal */}
            <div
              className="PlaybackControls__Display PlaybackControls__Display--BarPosition"
              title="Bar position"
            >
              {selectedMeasureNumber}/{measures.length}
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
            selectedTrackIndex={selectedTrackIndex}
          />
          {inspectorShown && (
            <Inspector
              setDocumentTitle={setDocumentTitle}
              setDocumentArtist={setDocumentArtist}
            />
          )}
        </div>
        {globalViewShown && (
          <GlobalView
            selectedTrackIndex={selectedTrackIndex}
            setSelectedTrackIndex={setSelectedTrackIndex}
            openAddTrackModal={() => setShowAddTrackModal(true)}
          />
        )}
      </div>
      <AddTrackModal
        show={showAddTrackModal}
        onClose={() => setShowAddTrackModal(false)}
      />
    </div>
  );
};

export default App;
