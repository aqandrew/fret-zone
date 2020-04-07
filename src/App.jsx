import React, { useState } from 'react';

// TODO Alphabetize imports w/ESLint
import AppMenu from './components/AppMenu';
import FileList from './components/FileList';
import CheckboxButton from './components/CheckboxButton';
import EditionPalette from './components/EditionPalette';
import Document from './components/Document';
import Inspector from './components/Inspector';
import GlobalView from './components/GlobalView';
import Modal from './components/Modal';
import './App.scss';

function App() {
  // TODO Put fileList in Redux store
  const dummyFileList = [
    { id: 0, name: 'untitled' },
    { id: 1, name: 'Stairway to Heaven' },
    { id: 2, name: 'Through the Fire and Flames' }
  ];

  const [activeFileName, setActiveFileName] = useState(dummyFileList[0].name);
  const [editionPaletteShown, setEditionPaletteShown] = useState(true);
  const [globalViewShown, setGlobalViewShown] = useState(true);
  const [inspectorShown, setInspectorShown] = useState(true);
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentArtist, setDocumentArtist] = useState('');
  const [showAddTrackModal, setShowAddTrackModal] = useState(false);

  const closeAddTrackModal = () => setShowAddTrackModal(false);

  return (
    <div className="App">
      <AppMenu />
      <div className="App__ScoreControls">
        <div className="App__ActiveFileName">{dummyFileList[0].name}</div>
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
          <GlobalView openAddTrackModal={() => setShowAddTrackModal(true)} />
        )}
      </div>
      {/* TODO Move this modal to separate file/component */}
      <Modal
        modalTitle="Add Track"
        show={showAddTrackModal}
        onCancel={closeAddTrackModal}
        onConfirm={() => {
          console.log('TODO Add clean guitar track');
          closeAddTrackModal();
        }}
      >
        {/* TODO Change this to a list-select input */}
        <input
          type="radio"
          id="AddTrack__Guitar--Electric--Clean"
          defaultChecked
        />
        <label htmlFor="AddTrack__Guitar--Electric--Clean">
          Electric Guitar - Clean
        </label>
      </Modal>
    </div>
  );
}

export default App;
