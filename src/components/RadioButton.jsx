import React from 'react';
import slugify from 'slugify';

const RadioButton = ({ name, buttonTitle, isChecked, setIsChecked }) => {
  const inputId = slugify(buttonTitle, { lower: true });

  return (
    <div className="RadioButton">
      <input
        type="radio"
        id={inputId}
        name={name}
        // checked={isChecked}
        // onChange={() => {
        //   setChecked(!isChecked);
        // }}
      />
      <label htmlFor={inputId}>{buttonTitle}</label>
    </div>
  );
};

export default RadioButton;
