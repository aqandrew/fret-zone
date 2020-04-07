import React from 'react';

import './Document.scss';

const Document = ({ documentTitle, documentArtist }) => (
  <div className="Document">
    <div className="Document__Page">
      {documentTitle && <h1 className="Document__Title">{documentTitle}</h1>}
      {documentArtist && <h2 className="Document__Artist">{documentArtist}</h2>}
      I'm the Document! Tabs and standard notation should go here.
    </div>
  </div>
);

export default Document;
