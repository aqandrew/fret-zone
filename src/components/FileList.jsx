import React from 'react';

import './FileList.scss';

// TODO Add active style with NavLink
const FileList = ({ files }) => {
  const renderFiles = () =>
    files.map(file => (
      <li key={file.id} className="FileList__Tab">
        {file.name}
        <button>Close</button>
      </li>
    ));

  return <ol className="FileList">{renderFiles()}</ol>;
};

export default FileList;
