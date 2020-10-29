import React, { useState } from 'react';
import clsx from 'clsx';
import slugify from 'slugify';

import './Inspector.scss';

const Inspector = ({ setDocumentTitle, setDocumentArtist }) => {
  const [showSongView, setShowSongView] = useState(true);

  return (
    <div className="Inspector">
      <div className="Inspector__ViewSelect">
        <InspectorViewButton
          text="Song"
          isSongView={true}
          isActive={showSongView}
          setShowSongView={setShowSongView}
        />
        <InspectorViewButton
          text="Track"
          isSongView={false}
          isActive={!showSongView}
          setShowSongView={setShowSongView}
        />
      </div>
      {showSongView ? (
        <div className="Inspector__Body">
          <h2 className="Inspector__Heading">Information</h2>
          <InspectorTextField
            inputName="Title"
            changeHandler={setDocumentTitle}
          />
          <InspectorTextField
            inputName="Artist"
            changeHandler={setDocumentArtist}
          />
          {/* <h2 className="Inspector__Heading">Musical Notation</h2>
          <h2 className="Inspector__Heading">Sound Mastering</h2> */}
        </div>
      ) : (
        <div className="Inspector__Body">
          <h2 className="Inspector__Heading">Information</h2>
          <h2 className="Inspector__Heading">Musical Notation</h2>
          <h2 className="Inspector__Heading">Sounds</h2>
          <h2 className="Inspector__Heading">Interpretation</h2>
        </div>
      )}
    </div>
  );
};

const InspectorViewButton = ({
  text,
  isSongView,
  isActive,
  setShowSongView,
}) => {
  const baseClassName = 'Inspector__ViewButton';

  return (
    <div
      className={clsx(baseClassName, isActive && `${baseClassName}--IsActive`)}
      onClick={() => {
        setShowSongView(isSongView);
      }}
    >
      {text}
    </div>
  );
};

const InspectorTextField = ({ inputName, changeHandler }) => {
  const inputId = slugify(inputName);

  return (
    <div className="Inspector__TextField">
      <label htmlFor={inputId} className="Inspector__TextFieldLabel">
        {inputName}:
      </label>
      <input
        type="text"
        id={inputId}
        className="Inspector__TextFieldInput"
        onChange={(event) => changeHandler(event.target.value)}
      />
    </div>
  );
};

export default Inspector;
