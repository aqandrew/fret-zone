import React from 'react';
import slugify from 'slugify';

const CheckboxButton = ({
  buttonText,
  buttonTitle,
  disabled,
  isChecked,
  setChecked,
}) => {
  const inputId = slugify(buttonTitle, { lower: true });

  return (
    <div className="CheckboxButton" title={buttonTitle}>
      <input
        type="checkbox"
        id={inputId}
        disabled={disabled}
        checked={isChecked}
        onChange={() => {
          setChecked(!isChecked);
        }}
      />
      <label htmlFor={inputId}>{buttonText || buttonTitle}</label>
    </div>
  );
};

export default CheckboxButton;
