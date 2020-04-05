import React from 'react';
import slugify from 'slugify';

const CheckboxButton = ({ buttonTitle, isChecked, setChecked }) => {
  const inputId = slugify(buttonTitle, { lower: true });

  return (
    <div className="CheckboxButton">
      <input
        type="checkbox"
        id={inputId}
        checked={isChecked}
        onChange={() => {
          setChecked(!isChecked);
        }}
      />
      <label htmlFor={inputId}>{buttonTitle}</label>
    </div>
  );
};

export default CheckboxButton;
