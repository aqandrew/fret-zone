import React, { useState } from 'react';

// TODO Alphabetize imports w/ESLint
import AppMenu from './components/AppMenu';
import FileList from './components/FileList';
import CheckboxButton from './components/CheckboxButton';
import EditionPalette from './components/EditionPalette';
import Document from './components/Document';
import Inspector from './components/Inspector';
import GlobalView from './components/GlobalView';
import AddTrackModal from './components/AddTrackModal';

import './App.scss';

function App() {
  // TODO Put fileList in Redux store
  const dummyFileList = [
    { id: 0, name: 'untitled' },
    { id: 1, name: 'Stairway to Heaven' },
    { id: 2, name: 'Through the Fire and Flames' }
  ];

  const [activeFileName, setActiveFileName] = useState(dummyFileList[0].name);
  // TODO What if there are no tracks?
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(0);
  const [editionPaletteShown, setEditionPaletteShown] = useState(true);
  const [globalViewShown, setGlobalViewShown] = useState(true);
  const [inspectorShown, setInspectorShown] = useState(true);
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentArtist, setDocumentArtist] = useState('');
  const [showAddTrackModal, setShowAddTrackModal] = useState(false);

  return (
    <div className="App">
      <AppMenu />
      <div className="App__ScoreControls">
        <div className="App__ActiveFileName">{activeFileName}</div>
        <div>
          <div>
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
          {/* TODO PlaybackControls */}
          {/* TODO Buttons for fretboard/keyboard/drum view */}
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
}

export default App;
