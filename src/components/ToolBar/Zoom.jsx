import React from 'react';
import { useState } from 'react';

import { ZOOM_OPTIONS } from '../../constants';
import { formatPercentage, getZoomLevelFromSlider } from '../../utils';

import './Zoom.scss';

const Zoom = ({ zoomLevel, setZoomLevel }) => {
	const [sliderValue, setSliderValue] = useState(0.5);

	const handleDropdownChange = (event) => {
		const newDropdownValue = event.target.value;

		if (isNaN(newDropdownValue)) {
			alert('TODO Set zoom to ' + newDropdownValue);
		} else {
			// TODO setSliderValue using inverse function of getZoomLevelFromSlider
			setZoomLevel(+newDropdownValue);
		}
	};

	const handleSliderChange = (event) => {
		const newSliderValue = +event.target.value;

		setSliderValue(newSliderValue);
		setZoomLevel(getZoomLevelFromSlider(newSliderValue));
	};

	return (
		<div className="Zoom" title={'Zoom: ' + formatPercentage(zoomLevel)}>
			{/* TODO Set select's display text when range input changes */}
			<select
				name="zoom-dropdown"
				id="zoom-dropdown"
				className="Zoom__Dropdown"
				value={zoomLevel}
				onChange={handleDropdownChange}
			>
				{ZOOM_OPTIONS.map((zoomOption, i) => (
					<option value={zoomOption} key={i}>
						{isNaN(zoomOption) ? zoomOption : formatPercentage(zoomOption)}
					</option>
				))}
			</select>
			<input
				type="range"
				name="zoom-slider"
				id="zoom-slider"
				className="Zoom__Slider"
				min={0}
				max={1}
				step="any"
				value={sliderValue}
				onChange={handleSliderChange}
			/>
		</div>
	);
};

export default Zoom;
