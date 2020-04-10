import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { tracksSelector } from '../slices/document';

import './Document.scss';

const Document = ({ documentTitle, documentArtist, selectedTrackIndex }) => {
  const tracks = useSelector(tracksSelector);

  // TODO Put measureCount in Redux store, owned by individual track
  // TODO Put STRING_COUNT in Redux store, owned by individual track
  const [measureCount, setMeasureCount] = useState(1);
  const STRING_COUNT = 6;

  const handleKeyPress = event => {
    switch (event.key) {
      case 'ArrowRight':
        // TODO If the currently focused Measure is NOT last, focus the next row of inputs
        // Otherwise, increase the number of measures
        setMeasureCount(measureCount + 1);
        break;
      default:
        break;
    }
  };

  // TODO Add support for multitrack view
  const renderSelectedTrackNotation = () =>
    tracks.length
      ? [...Array(measureCount)].map((emptyElement, measureNum) => (
          <div className="Measure" key={measureNum}>
            {[...Array(STRING_COUNT)].map((e, stringNum) => (
              <input
                className="Measure__Input"
                type="text"
                value={stringNum}
                onChange={event => {
                  console.log('you typed a number:', event.target.value);
                }}
                onKeyDown={handleKeyPress}
                key={stringNum}
              />
            ))}
          </div>
        ))
      : null;

  return (
    <div className="Document">
      <div className="Document__Page">
        {documentTitle && <h1 className="Document__Title">{documentTitle}</h1>}
        {documentArtist && (
          <h2 className="Document__Artist">{documentArtist}</h2>
        )}
        {renderSelectedTrackNotation()}
      </div>
    </div>
  );
};

export default Document;
