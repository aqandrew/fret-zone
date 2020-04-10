import React from 'react';

import './FileList.scss';

// TODO Should this be a series of NavLinks?
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
          onClick={event => {
            if (!(event.target instanceof HTMLButtonElement)) {
              setActiveFileName(file.name);
            }
          }}
        >
          {file.name || 'untitled'}
          <button className="FileList__Button--Close">Close</button>
        </li>
      );
    });

  return (
    <ol className="FileList">
      {renderFiles()}
      {/* TODO On click, open context menu for selecting New/Open */}
      <li className="FileList__Button--AddTab">+</li>
    </ol>
  );
};

export default FileList;
