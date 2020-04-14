import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import {
  addMeasure,
  addTrack,
  defaultMeasureOptions,
  tracksSelector
} from '../slices/document';

import Modal from './Modal';

const AddTrackModal = ({ show, onClose }) => {
  const dispatch = useDispatch();
  const tracks = useSelector(tracksSelector);
  const defaultTrackOptions = {
    fullName: 'Electric Guitar - Clean',
    abbreviatedName: 'el.guit.',
    tuning: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'],
    measures: []
  };

  const [trackToAdd, setTrackToAdd] = useState(defaultTrackOptions);

  const confirmAddTrack = () => {
    let newTrackId = uuidv4();

    dispatch(addTrack({ id: newTrackId, ...trackToAdd }));

    // If this is the first track being added, add one new measure to this track
    // Otherwise, if there are other tracks, add a new measure to this track for each measure that already exists
    let numMeasuresToAdd = tracks.length === 0 ? 1 : tracks[0].measures.length;

    // TODO This for-loop may not be the best approach if we want the ability to undo adding a track
    for (let i = 0; i < numMeasuresToAdd; i++) {
      dispatch(
        addMeasure({
          trackId: newTrackId,
          id: uuidv4(),
          ...defaultMeasureOptions
        })
      );
    }

    // TODO Once the new track is added, set this as the currently selected track
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
        onChange={event => {
          setTrackToAdd(event.target.value);
        }}
      />
      <label htmlFor="AddTrack__Guitar--Electric--Clean">
        {defaultTrackOptions.fullName}
        <br />
        Tuning:
        <ol>
          {defaultTrackOptions.tuning.reverse().map((string, stringIndex) => (
            <li key={stringIndex}>{string}</li>
          ))}
        </ol>
      </label>
    </Modal>
  );
};

export default AddTrackModal;
