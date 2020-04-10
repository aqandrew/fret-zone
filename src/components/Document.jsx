import React from 'react';
import { useSelector } from 'react-redux';

import { tracksSelector } from '../slices/document';

import './Document.scss';

const Document = ({ documentTitle, documentArtist, selectedTrackIndex }) => {
  const tracks = useSelector(tracksSelector);

  // TODO Add support for multitrack view
  const renderSelectedTrackNotation = () =>
    tracks.length ? (
      <div>
        TODO write notation for selected track: #{selectedTrackIndex},{' '}
        {tracks[selectedTrackIndex].name}
      </div>
    ) : null;

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
