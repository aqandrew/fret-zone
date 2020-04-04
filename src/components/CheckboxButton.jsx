import React from 'react';

const CheckboxButton = ({ buttonTitle }) => (
  <div>
    {/* TODO Slugify buttonTitle for id */}
    <input type="checkbox" id={buttonTitle} />
    <label htmlFor={buttonTitle}>{buttonTitle}</label>
  </div>
);

export default CheckboxButton;
