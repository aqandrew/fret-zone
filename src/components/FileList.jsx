import React from 'react';

import './FileList.css';

// TODO Add active style with NavLink
const FileList = ({ files }) => {
  const renderFiles = () =>
    files.map(file => (
      <li key={file.id} className="file-tab">
        {file.name}
        <button>Close</button>
      </li>
    ));

  return <ol id="file-list">{renderFiles()}</ol>;
};

export default FileList;
