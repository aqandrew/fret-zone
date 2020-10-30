import React from 'react';
import slugify from 'slugify';

const RadioButton = ({ name, buttonTitle, disabled, isChecked, onChange }) => {
  const inputId = slugify(buttonTitle, { lower: true });

  return (
    <div className="RadioButton">
      <label title={buttonTitle}>
        <input
          type="radio"
          id={inputId}
          disabled={disabled}
          name={name}
          checked={isChecked}
          onChange={onChange}
        />
        {buttonTitle}
      </label>
    </div>
  );
};

export default RadioButton;
