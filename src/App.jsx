import React from 'react';

// TODO Alphabetize imports w/ESLint
import AppMenu from './components/AppMenu';
import FileList from './components/FileList';
import ScoreControls from './components/ScoreControls';
import EditionPalette from './components/EditionPalette';
import Document from './components/Document';
import Inspector from './components/Inspector';
import GlobalView from './components/GlobalView';
import './App.scss';

function App() {
  // TODO Put fileList in Redux store
  const dummyFileList = [{ id: 0, name: 'Stairway to Heaven' }];

  return (
    <div className="App">
      <AppMenu />
      <ScoreControls activeFile={dummyFileList[0]} />
      <FileList files={dummyFileList} />
      <div id="main-content">
        <div id="center-content">
          <EditionPalette />
          <Document />
          <Inspector />
        </div>
        <GlobalView />
      </div>
    </div>
  );
}

export default App;
