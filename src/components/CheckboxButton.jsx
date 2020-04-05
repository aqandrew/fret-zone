import React from 'react';
import slugify from 'slugify';

const CheckboxButton = ({ buttonTitle }) => {
  const inputId = slugify(buttonTitle, { lower: true });

  return (
    <div className="CheckboxButton">
      <input type="checkbox" id={inputId} />
      <label htmlFor={inputId}>{buttonTitle}</label>
    </div>
  );
};

export default CheckboxButton;
