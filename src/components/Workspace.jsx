import React, { useContext } from 'react';

import { SELECT_MEASURE, SELECT_DURATION, SELECT_STRING } from '../actionTypes';
import AppStateContext from '../AppStateContext';
import DispatchContext from '../DispatchContext';
import { useDocument } from '../hooks/useDocument';
import { durationLengths } from '../constants';

import './Workspace.scss';

const Workspace = ({
  documentTitle,
  documentArtist,
  selectedTrackNumber,
  selectedMeasureNumber,
  selectedStringNumber,
  selectedDurationId,
}) => {
  const dispatchApp = useContext(DispatchContext);
  const appState = useContext(AppStateContext);
  const { tracks, measures, durations, notes } = useDocument(appState);

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
                dispatchApp({ type: SELECT_MEASURE, measureNumber });
                dispatchApp({ type: SELECT_STRING, stringNumber });
                dispatchApp({ type: SELECT_DURATION, durationId: duration.id });
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
    {/* TODO Account for triplet length */}
    {durationLengths[duration.length].abbreviation}
    {duration.isDotted && '.'}
  </span>
);

export default Workspace;
