import React from 'react';

import './FileList.scss';

// TODO Add active style with NavLink
const FileList = ({ files, activeFileName, setActiveFileName }) => {
  const renderFiles = () =>
    files.map(file => {
      let tabClassName = 'FileList__Tab';

      // TODO Refactor using classnames utility
      if (file.name === activeFileName) {
        tabClassName += ` ${tabClassName}--IsActive`;
      }

      return (
        <li
          key={file.id}
          className={tabClassName}
          onClick={() => setActiveFileName(file.name)}
        >
          {file.name}
          <button className="FileList__CloseButton">Close</button>
        </li>
      );
    });

  return <ol className="FileList">{renderFiles()}</ol>;
};

export default FileList;
