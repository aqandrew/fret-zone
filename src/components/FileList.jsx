import React from 'react';

const FileList = ({ files }) => {
  const renderFiles = () =>
    files.map(file => (
      <li key={file.id}>
        {file.name}
        <button>Close</button>
      </li>
    ));

  return <ol>{renderFiles()}</ol>;
};

export default FileList;
