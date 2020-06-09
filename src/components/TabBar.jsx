import React from 'react';

import './TabBar.scss';

// TODO Should this be a series of NavLinks?
const TabBar = ({ files, activeFileName, setActiveFileName }) => {
  const renderFiles = () =>
    files.map((file) => {
      let tabClassName = 'TabBar__Tab';

      // TODO Refactor using classnames utility
      if (file.name === activeFileName) {
        tabClassName += ` ${tabClassName}--IsActive`;
      }

      return (
        <li
          key={file.id}
          className={tabClassName}
          onClick={(event) => {
            if (!(event.target instanceof HTMLButtonElement)) {
              setActiveFileName(file.name);
            }
          }}
        >
          {file.name || 'untitled'}
          <button className="TabBar__Button--Close">Close</button>
        </li>
      );
    });

  return (
    <ol className="TabBar">
      {renderFiles()}
      {/* TODO On click, open context menu for selecting New/Open */}
      <li className="TabBar__Button--AddTab">+</li>
    </ol>
  );
};

export default TabBar;
