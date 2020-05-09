import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import { selectedMeasureNumberSelector } from '../slices/ui';
import { addTrack, tracksSelector } from '../slices/document';

import Modal from './Modal';

const AddTrackModal = ({ show, onClose }) => {
  const dispatch = useDispatch();
  const selectedMeasureNumber = useSelector(selectedMeasureNumberSelector);
  const tracks = useSelector(tracksSelector);
  // TODO Move this object to document.js
  const defaultTrackOptions = {
    fullName: 'Electric Guitar - Clean',
    abbreviatedName: 'el.guit.',
    tuning: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'],
  };

  const [trackToAdd, setTrackToAdd] = useState(defaultTrackOptions);

  const confirmAddTrack = () => {
    let newTrackId = uuidv4();
    // TODO Turn ID array generation into a function
    let measureIds =
      tracks.length === 0
        ? [uuidv4()]
        : tracks[0].measures.map((measure) => uuidv4());
    let durationIds =
      tracks.length === 0
        ? [uuidv4()]
        : tracks[0].measures.map((measure) => uuidv4());

    dispatch(
      addTrack({
        id: newTrackId,
        measures: measureIds,
        durationIds: durationIds,
        ...trackToAdd,
      })
    );

    return {
      newTrackId: newTrackId,
      durationIdToSelect: durationIds[selectedMeasureNumber],
    };
  };

  return (
    <Modal
      modalTitle="Add Track"
      show={show}
      onClose={onClose}
      onConfirm={confirmAddTrack}
    >
      {/* TODO Change this to a list-select input */}
      <input
        type="radio"
        id="AddTrack__Guitar--Electric--Clean"
        value={defaultTrackOptions.fullName}
        checked={trackToAdd.fullName === defaultTrackOptions.fullName}
        onChange={(event) => {
          setTrackToAdd(event.target.value);
        }}
      />
      <label htmlFor="AddTrack__Guitar--Electric--Clean">
        {defaultTrackOptions.fullName}
        <br />
        Tuning:
        <ol>
          {defaultTrackOptions.tuning
            .reverse()
            .map((stringTuning, stringNumber) => (
              <li key={stringNumber}>{stringTuning}</li>
            ))}
        </ol>
      </label>
    </Modal>
  );
};

export default AddTrackModal;
