import React from 'react';

import { zoomOptions } from '../../constants';
import { formatPercentage } from '../../utils';

import './Zoom.scss';

const Zoom = ({ zoomLevel, setZoomLevel }) => {
  const handleZoomChange = (event) => {
    const zoomOption = event.target.value;

    if (isNaN(zoomOption)) {
      alert('TODO Set zoom to ' + zoomOption);
    } else {
      setZoomLevel(zoomOption);
    }
  };

  return (
    <div className="Zoom" title={'Zoom: ' + formatPercentage(zoomLevel)}>
      {/* TODO Set select's display text when range input changes */}
      <select
        name="zoom-dropdown"
        id="zoom-dropdown"
        className="Zoom__Dropdown"
        value={zoomLevel}
        onChange={handleZoomChange}
      >
        {zoomOptions.map((zoomOption, i) => (
          <option value={zoomOption} key={i}>
            {isNaN(zoomOption) ? zoomOption : formatPercentage(zoomOption)}
          </option>
        ))}
      </select>
      {/* TODO Set nonlinear steps, so that 100% is in the middle */}
      <input
        type="range"
        name="zoom-slider"
        id="zoom-slider"
        className="Zoom__Slider"
        min={0.1}
        max={8}
        value={zoomLevel}
        onChange={handleZoomChange}
      />
    </div>
  );
};

export default Zoom;
