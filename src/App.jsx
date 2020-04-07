import React, { useState, useEffect } from 'react';

// TODO Alphabetize imports w/ESLint
import AppMenu from './components/AppMenu';
import FileList from './components/FileList';
import CheckboxButton from './components/CheckboxButton';
import EditionPalette from './components/EditionPalette';
import Document from './components/Document';
import Inspector from './components/Inspector';
import GlobalView from './components/GlobalView';
import './App.scss';

function App() {
  const [activeFileName, setActiveFileName] = useState('');
  const [editionPaletteShown, setEditionPaletteShown] = useState(true);
  const [globalViewShown, setGlobalViewShown] = useState(true);
  const [inspectorShown, setInspectorShown] = useState(true);
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentArtist, setDocumentArtist] = useState('');

  // TODO Put fileList in Redux store
  const dummyFileList = [
    { id: 0, name: 'untitled' },
    { id: 1, name: 'Stairway to Heaven' },
    { id: 2, name: 'Through the Fire and Flames' }
  ];
  // TODO This useEffect may be preventing active file from changing when clicking a FileListTab
  useEffect(() => {
    setActiveFileName(dummyFileList[0].name);
  }, [dummyFileList]);

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
        {globalViewShown && <GlobalView />}
      </div>
    </div>
  );
}

export default App;
