import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

// TODO Alphabetize imports w/ESLint
import {
  selectTrack,
  selectedTrackNumberSelector,
  selectMeasure,
  selectedMeasureNumberSelector,
  selectDuration,
  selectedDurationIdSelector,
  selectString,
  selectedStringNumberSelector,
} from './slices/ui';
import {
  deleteTrack,
  addMeasure,
  deleteMeasure,
  addDuration,
  addNote,
  defaultMeasureOptions,
  measuresSelector,
  tracksSelector,
  durationsSelector,
} from './slices/document';
import AppMenu from './components/AppMenu';
import FileList from './components/FileList';
import CheckboxButton from './components/CheckboxButton';
import EditionPalette from './components/EditionPalette';
import Document from './components/Document';
import Inspector from './components/Inspector';
import GlobalView from './components/GlobalView';
import AddTrackModal from './components/AddTrackModal';

import './App.scss';

const App = () => {
  const dispatch = useDispatch();
  const tracks = useSelector(tracksSelector);
  const measures = useSelector(measuresSelector);
  const durations = useSelector(durationsSelector);
  const selectedTrackNumber = useSelector(selectedTrackNumberSelector);
  const selectedMeasureNumber = useSelector(selectedMeasureNumberSelector);
  const selectedDurationId = useSelector(selectedDurationIdSelector);
  const selectedStringNumber = useSelector(selectedStringNumberSelector);

  // TODO Put fileList in Redux store
  const dummyFileList = [
    { id: 0, name: '' },
    // { id: 1, name: 'Stairway to Heaven' },
    // { id: 2, name: 'Through the Fire and Flames' }
  ];

  // TODO Determine active file via id, not name
  const [activeFileName, setActiveFileName] = useState(dummyFileList[0].name);
  const [editionPaletteShown, setEditionPaletteShown] = useState(true);
  const [globalViewShown, setGlobalViewShown] = useState(true);
  const [inspectorShown, setInspectorShown] = useState(true);
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentArtist, setDocumentArtist] = useState('');
  const [showAddTrackModal, setShowAddTrackModal] = useState(false);

  const onKeyDown = useCallback(
    (event) => {
      if (
        event.currentTarget === document &&
        (event.target.tagName !== 'INPUT' ||
          event.target.classList.contains('Measure__Input'))
      ) {
        const selectedTrack = tracks[selectedTrackNumber];
        const selectedMeasure = measures.find(
          (measure) =>
            measure.id ===
            tracks[selectedTrackNumber].measures[selectedMeasureNumber]
        );
        console.log(event);

        switch (event.key) {
          case 'ArrowUp':
            dispatch(
              selectString(
                selectedStringNumber === 0
                  ? selectedTrack.tuning.length - 1
                  : selectedStringNumber - 1
              )
            );

            break;
          case 'ArrowDown':
            dispatch(
              selectString(
                (selectedStringNumber + 1) % selectedTrack.tuning.length
              )
            );

            break;
          // Advance note/measure
          case 'ArrowRight':
            if (selectedMeasureNumber === selectedTrack.measures.length - 1) {
              // TODO Use parallel arrays like in AddTrackModal.confirmAddTrack instead
              // Create a mapping from track IDs to new measure IDs
              let trackMeasureIds = tracks.reduce((map, track) => {
                map[track.id] = {
                  measureId: uuidv4(),
                  durationId: uuidv4(),
                };
                return map;
              }, {});

              dispatch(
                addMeasure({
                  trackMeasureIds: trackMeasureIds,
                  ...defaultMeasureOptions,
                })
              );
              dispatch(selectMeasure(selectedMeasureNumber + 1));
              dispatch(
                selectDuration(trackMeasureIds[selectedTrack.id].durationId)
              );
            } else {
              // If currently selected duration is NOT last,
              if (
                selectedDurationId !== selectedMeasure.durations.slice(-1)[0]
              ) {
                // If there is a note at the selected duration,
                if (!durations[selectedDurationId].notes.length) {
                  // TODO Only create a new duration on ArrowRight if the measure's total length !== maximum AND last duration isn't empty
                  // Create a new duration
                  dispatch(
                    addDuration({
                      measureId: selectedMeasure.id,
                      newDurationId: uuidv4(),
                    })
                  );
                }
                // Otherwise, select the next duration
                else {
                  dispatch(
                    selectDuration(
                      selectedMeasure.durations[
                        selectedMeasure.durations.findIndex(
                          (durationId) => durationId === selectedDurationId
                        ) + 1
                      ]
                    )
                  );
                }
              }
              // Otherwise, select the next measure
              else {
                dispatch(selectMeasure(selectedMeasureNumber + 1));
                dispatch(
                  selectDuration(
                    measures[selectedMeasureNumber + 1].durations[0]
                  )
                );
              }
            }

            break;
          // Previous note/measure
          case 'ArrowLeft':
            if (selectedMeasureNumber > 0) {
              dispatch(selectMeasure(selectedMeasureNumber - 1));

              // Select the last duration of the previous measure
              dispatch(
                selectDuration(
                  measures[selectedMeasureNumber - 1].durations.slice(-1)[0]
                )
              );

              // TODO Select the FIRST duration of the previous measure if Cmd was held
            } else {
              // If currently selected duration is NOT first in the measure,
              if (selectedDurationId !== selectedMeasure.durations[0]) {
                // Select the previous duration
                dispatch(
                  selectDuration(
                    selectedMeasure.durations[
                      selectedMeasure.durations.findIndex(
                        (durationId) => durationId === selectedDurationId
                      ) - 1
                    ]
                  )
                );
              }
            }

            break;
          // Delete measure
          case '-':
            if (event.ctrlKey && selectedTrack.measures.length > 1) {
              if (selectedMeasureNumber > 0) {
                dispatch(selectMeasure(selectedMeasureNumber - 1));
              }

              // Even though dispatch runs synchronously, selectedMeasureNumber does not change within this closure,
              // so this still deletes the correct measure
              dispatch(deleteMeasure(selectedMeasureNumber));
            }

            break;
          // Add track
          // TODO Account for non-macOS devices
          case 'Dead':
            if (event.code === 'KeyN' && event.altKey && event.metaKey) {
              setShowAddTrackModal(true);
            }

            break;
          // Delete track
          // TODO Account for non-macOS devices
          case '®':
            if (event.altKey && event.metaKey) {
              // TODO Open confirmation dialog

              if (
                selectedTrackNumber === tracks.length - 1 &&
                tracks.length > 1
              ) {
                dispatch(selectTrack(selectedTrackNumber - 1));
              }

              dispatch(deleteTrack(selectedTrack.id));
            }

            break;
          default:
            // TODO Is there a way to move this logic to Document?
            // Set note at cursor
            if (
              !isNaN(event.key) &&
              tracks.length !== 0 &&
              measures.length !== 0
            ) {
              dispatch(
                addNote({
                  durationId: selectedDurationId,
                  id: uuidv4(),
                  string: selectedStringNumber,
                  fret: parseInt(event.key),
                })
              );
            }

            break;
        }
      }
    },
    [
      dispatch,
      tracks,
      measures,
      durations,
      selectedTrackNumber,
      selectedMeasureNumber,
      selectedStringNumber,
      selectedDurationId,
    ]
  );

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onKeyDown]);

  const renderBarCurrentDuration = () => {
    if (tracks.length && measures.length) {
      const selectedMeasure = measures.find(
        (measure) =>
          measure.id ===
          tracks[selectedTrackNumber].measures[selectedMeasureNumber]
      );

      let currentBarMaximumDuration =
        (selectedMeasure.timeSignature.beatUnit / 4) *
        selectedMeasure.timeSignature.beatsPerMeasure;
      let currentBarDuration =
        selectedMeasure.durations.reduce((totalDuration, durationId) => {
          let durationInMeasure = durations.find(
            (duration) => duration.id === durationId
          );

          if (durationInMeasure.notes.length || durationInMeasure.isRest) {
            return totalDuration + durationInMeasure.length;
          }

          return totalDuration;
        }, 0) * currentBarMaximumDuration;

      // TODO Display minimum 1 decimal place, and up to 4 decimal places,
      //   rounded, not truncated
      //     e.g. 0.0, 0.5, 0.25, 0.125, 0.0625 (duplets)
      //          0.667, 0.333, 0.167, 0.0833, 0.0417 (triplets)
      return (
        currentBarDuration.toFixed(1) +
        ':' +
        currentBarMaximumDuration.toFixed(1)
      );
    }

    return '0.0:1.0';
  };

  return (
    <div className="App" onKeyDown={onKeyDown}>
      <AppMenu />
      <div className="TopBar">
        <div className="TopBar__ActiveFileName">
          {activeFileName || 'untitled'}
        </div>
        <div className="ScoreControls">
          <div className="ScoreControls__ButtonContainer">
            <CheckboxButton
              buttonTitle="Show/Hide Edition Palette"
              isChecked={editionPaletteShown}
              setChecked={setEditionPaletteShown}
            />
            <CheckboxButton
              buttonTitle="Show/Hide Global View"
              isChecked={globalViewShown}
              setChecked={setGlobalViewShown}
            />
            <CheckboxButton
              buttonTitle="Show/Hide Inspector"
              isChecked={inspectorShown}
              setChecked={setInspectorShown}
            />
          </div>
          {/* TODO Zoom control */}
          {/* TODO Document view select */}
          {/* TODO Undo/redo */}
          {/* TODO Print */}
          <div className="PlaybackControls">
            <div
              className="PlaybackControls__Display PlaybackControls__Display--CurrentTrack"
              title="Current track (Click to change)"
            >
              {tracks.length
                ? `${selectedTrackNumber + 1}. ${
                    tracks[selectedTrackNumber].fullName
                  }`
                : ''}
            </div>
            {/* TODO Click to open "Go to" modal */}
            <div
              className="PlaybackControls__Display PlaybackControls__Display--BarPosition"
              title="Bar position"
            >
              {selectedMeasureNumber + 1}/
              {tracks.length ? tracks[selectedTrackNumber].measures.length : 0}
            </div>
            {/* TODO Click to toggle incomplete duration vs. remaining duration */}
            <div
              className="PlaybackControls__Display PlaybackControls__Display--BarCurrentDuration"
              title="Bar current duration"
            >
              {renderBarCurrentDuration()}
            </div>
          </div>
          <div className="ScoreControls__ButtonContainer">
            {/* TODO Buttons for fretboard/keyboard/drum view */}
          </div>
        </div>
      </div>
      <FileList
        files={dummyFileList}
        activeFileName={activeFileName}
        setActiveFileName={setActiveFileName}
      />
      <div className="App__Content--Main">
        <div className="App__Content--Center">
          {editionPaletteShown && <EditionPalette />}
          <Document
            documentTitle={documentTitle}
            documentArtist={documentArtist}
          />
          {inspectorShown && (
            <Inspector
              setDocumentTitle={setDocumentTitle}
              setDocumentArtist={setDocumentArtist}
            />
          )}
        </div>
        {globalViewShown && (
          <GlobalView openAddTrackModal={() => setShowAddTrackModal(true)} />
        )}
      </div>
      <AddTrackModal
        show={showAddTrackModal}
        onClose={(modalResult) => {
          setShowAddTrackModal(false);

          if (modalResult) {
            dispatch(selectTrack(tracks.length));
            dispatch(selectDuration(modalResult.durationIdToSelect));
          }
        }}
      />
    </div>
  );
};

export default App;
