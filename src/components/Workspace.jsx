import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  selectedTrackNumberSelector,
  // selectTrack,
  selectedMeasureNumberSelector,
  selectMeasure,
  selectedStringNumberSelector,
  selectString,
  selectDuration,
  selectedDurationIdSelector,
} from '../slices/ui';
import {
  measuresSelector,
  tracksSelector,
  durationsSelector,
  notesSelector,
} from '../slices/document';
import { durationLengths } from '../constants';

import './Workspace.scss';

const Workspace = ({ documentTitle, documentArtist }) => {
  const dispatch = useDispatch();
  const tracks = useSelector(tracksSelector);
  const measures = useSelector(measuresSelector);
  const durations = useSelector(durationsSelector);
  const notes = useSelector(notesSelector);
  const selectedTrackNumber = useSelector(selectedTrackNumberSelector);
  const selectedMeasureNumber = useSelector(selectedMeasureNumberSelector);
  const selectedStringNumber = useSelector(selectedStringNumberSelector);
  const selectedDurationId = useSelector(selectedDurationIdSelector);

  const renderDurationColumn = (measureNumber, duration) => {
    const selectedTrack = tracks[selectedTrackNumber];

    return (
      <div
        className="Measure__DurationColumn"
        key={duration ? duration.id : selectedTrack.measures[measureNumber].id}
      >
        {selectedTrack.tuning.map((stringTuning, stringNumber) => {
          let inputClassname = 'Measure__Input';

          // TODO Refactor using classnames utility
          if (
            measureNumber === selectedMeasureNumber &&
            stringNumber === selectedStringNumber &&
            duration.id === selectedDurationId
          ) {
            inputClassname += ` ${inputClassname}--IsActive`;
          }

          let noteAtString = duration.notes
            .map((noteId) => notes.find((note) => note.id === noteId))
            .find((note) => note.string === stringNumber);

          return (
            <input
              className={inputClassname}
              type="text"
              readOnly
              value={
                duration
                  ? duration.isRest
                    ? 'R'
                    : noteAtString
                    ? // TODO noteAtString.fret should probably be returned by a function that includes symbols for slides/vibrato/etc
                      noteAtString.fret
                    : '-'
                  : '-'
              }
              onClick={() => {
                dispatch(selectMeasure(measureNumber));
                dispatch(selectString(stringNumber));
                dispatch(selectDuration(duration.id));
              }}
              key={stringNumber}
            />
          );
        })}
        <DurationMarker duration={duration} />
      </div>
    );
  };

  const renderSelectedTrackNotation = () => {
    const selectedTrack = tracks[selectedTrackNumber];

    if (tracks.length && measures.length) {
      const measuresInSelectedTrack = selectedTrack.measures.map((measureId) =>
        measures.find((measure) => measure.id === measureId)
      );

      return (
        <div className="TrackNotation">
          <span className="TrackNotation__TrackName--Abbreviated">
            {selectedTrack.abbreviatedName}
          </span>
          {measuresInSelectedTrack.map((measure, measureNumber) => {
            const durationsInMeasure = measure.durations.map((durationId) =>
              durations.find((duration) => duration.id === durationId)
            );

            return (
              <div className="Measure" key={measureNumber}>
                {durationsInMeasure.map((duration) =>
                  renderDurationColumn(measureNumber, duration)
                )}
                {/* TODO Add (OR bar duration !== maximum) to ternary condition */}
                {durationsInMeasure.length === 0
                  ? renderDurationColumn(measureNumber, null)
                  : null}
              </div>
            );
          })}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="Workspace">
      <div className="Document__Page">
        {documentTitle && <h1 className="Document__Title">{documentTitle}</h1>}
        {documentArtist && (
          <h2 className="Document__Artist">{documentArtist}</h2>
        )}
        {renderSelectedTrackNotation()}
      </div>
    </div>
  );
};

const DurationMarker = ({ duration }) => (
  <span className="Measure__DurationMarker">
    {/* TODO Account for dotted/triplet length */}
    {durationLengths[duration.length].abbreviation}
  </span>
);

export default Workspace;
