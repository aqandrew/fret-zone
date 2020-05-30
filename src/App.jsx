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
  addRest,
  deleteDuration,
  deleteNote,
  defaultMeasureOptions,
  measuresSelector,
  tracksSelector,
  durationsSelector,
  notesSelector,
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
  const notes = useSelector(notesSelector);
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

  const getSelectedMeasure = useCallback(
    () =>
      measures.find(
        (measure) =>
          measure.id ===
          tracks[selectedTrackNumber].measures[selectedMeasureNumber]
      ),
    [tracks, measures, selectedTrackNumber, selectedMeasureNumber]
  );

  const getCurrentBarMaximumDuration = useCallback(() => {
    const selectedMeasure = getSelectedMeasure();

    return (
      (selectedMeasure.timeSignature.beatUnit / 4) *
      selectedMeasure.timeSignature.beatsPerMeasure
    );
  }, [getSelectedMeasure]);

  const getCurrentBarDuration = useCallback(() => {
    const selectedMeasure = getSelectedMeasure();
    const currentBarMaximumDuration = getCurrentBarMaximumDuration();

    return (
      selectedMeasure.durations.reduce((totalDuration, durationId) => {
        let durationInMeasure = durations.find(
          (duration) => duration.id === durationId
        );

        if (durationInMeasure.notes.length || durationInMeasure.isRest) {
          return totalDuration + durationInMeasure.length;
        }

        return totalDuration;
      }, 0) * currentBarMaximumDuration
    );
  }, [durations, getSelectedMeasure, getCurrentBarMaximumDuration]);

  const onKeyDown = useCallback(
    (event) => {
      if (
        event.currentTarget === document &&
        (event.target.tagName !== 'INPUT' ||
          event.target.classList.contains('Measure__Input'))
      ) {
        const selectedTrack = tracks[selectedTrackNumber];
        const selectedMeasure = getSelectedMeasure();
        console.log(event);

        switch (event.key) {
          case 'ArrowUp':
            event.preventDefault();

            dispatch(
              selectString(
                selectedStringNumber === 0
                  ? selectedTrack.tuning.length - 1
                  : selectedStringNumber - 1
              )
            );

            break;
          case 'ArrowDown':
            event.preventDefault();

            dispatch(
              selectString(
                (selectedStringNumber + 1) % selectedTrack.tuning.length
              )
            );

            break;
          // Advance duration/measure
          case 'ArrowRight':
            event.preventDefault();

            // TODO If Cmd was held, select the first duration of the next measure

            let shouldCheckIfMeasureIsLast = false;

            // If there's a note at this duration,
            // Or if this duration is a rest,
            if (
              durations.find((duration) => duration.id === selectedDurationId)
                .notes.length ||
              durations.find((duration) => duration.id === selectedDurationId)
                .isRest
            ) {
              // If this is the last duration,
              if (
                selectedDurationId === selectedMeasure.durations.slice(-1)[0]
              ) {
                // If the measure's total length === maximum,
                if (
                  getCurrentBarDuration() === getCurrentBarMaximumDuration()
                ) {
                  shouldCheckIfMeasureIsLast = true;
                }
                // Add a new duration to this measure
                else {
                  let newDurationId = uuidv4();

                  dispatch(
                    addDuration({
                      measureId: selectedMeasure.id,
                      newDurationId: newDurationId,
                    })
                  );
                  dispatch(selectDuration(newDurationId));
                }
              }
              // Select the next duration in this measure
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
            } else {
              shouldCheckIfMeasureIsLast = true;
            }

            if (shouldCheckIfMeasureIsLast) {
              // If selectedMeasure is last,
              // Add a new measure
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
              }
              // Select the next measure
              else {
                dispatch(selectMeasure(selectedMeasureNumber + 1));
                dispatch(
                  selectDuration(
                    measures.find(
                      (measure) =>
                        measure.id ===
                        selectedTrack.measures[selectedMeasureNumber + 1]
                    ).durations[0]
                  )
                );
              }
            }

            break;
          // Previous duration/measure
          case 'ArrowLeft':
            event.preventDefault();

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
            } else if (selectedMeasureNumber > 0) {
              dispatch(selectMeasure(selectedMeasureNumber - 1));

              // Select the last duration of the previous measure
              dispatch(
                selectDuration(
                  measures
                    .find(
                      (measure) =>
                        measure.id ===
                        selectedTrack.measures[selectedMeasureNumber - 1]
                    )
                    .durations.slice(-1)[0]
                )
              );
              // TODO Select the FIRST duration of the previous measure if Cmd was held
            }

            break;
          case '+':
            // TODO Insert measure
            if (event.ctrlKey) {
            }
            // TODO Shorten selected duration
            else {
            }

            break;
          case '-':
            // Delete measure
            if (event.ctrlKey) {
              if (selectedTrack.measures.length > 1) {
                let newSelectedMeasureNumber;

                if (selectedMeasureNumber > 0) {
                  newSelectedMeasureNumber = selectedMeasureNumber - 1;
                  dispatch(selectMeasure(newSelectedMeasureNumber));
                } else {
                  newSelectedMeasureNumber = selectedMeasureNumber + 1;
                }

                dispatch(
                  selectDuration(
                    measures.find(
                      (measure) =>
                        measure.id ===
                        selectedTrack.measures[newSelectedMeasureNumber]
                    ).durations[0]
                  )
                );

                // Even though dispatch runs synchronously, selectedMeasureNumber does not change within this closure,
                // so this still deletes the correct measure after selectMeasure has executed
                dispatch(deleteMeasure(selectedMeasureNumber));
              }
            }
            // TODO Lengthen selected duration
            else {
            }

            break;
          case 'r':
            // Turn selected duration into rest
            dispatch(addRest(selectedDurationId));

            break;
          case 'Backspace':
            // Delete selected note
            let needToSelectNewDuration = true;

            // If there is a note at this selected duration/string,
            if (true) {
              // TODO Delete that note

              // If the deleted note was the last one in the selected duration,
              if (true) {
                // TODO Turn the duration into a rest
              }
            }
            else {
              // If the selected duration is a rest,
              if (true) {
                // TODO Delete that duration
              }
              else {
                needToSelectNewDuration = false;
              }
            }

            if (needToSelectNewDuration) {
              // If the selected duration is NOT first in the document,
              if (true) {
                // If the first duration of the selected measure is selected,
                if (true) {
                  // TODO Select the previous measure's last duration
                }
                else {
                  // TODO Otherwise, select this measure's previous duration
                }
              }
            }
            

            let noteOrDurationWasDeleted = false;

            // If there is a note at this selected duration/string,
            if (
              durations
                .find((duration) => duration.id === selectedDurationId)
                .notes.map(
                  (noteId) => notes.find((note) => note.id === noteId).string
                )
                .includes(selectedStringNumber)
            ) {
              // Delete it
              // TODO These lines are horribly inefficient
              const selectedDuration = durations.find(
                (duration) => duration.id === selectedDurationId
              );
              const selectedNoteId = selectedDuration.notes.find(
                (noteId) =>
                  notes.find((note) => note.id === noteId).string ===
                  selectedStringNumber
              );

              dispatch(deleteNote(selectedNoteId));

              // If this was the last note at this duration,
              if (selectedDuration.notes.length === 1) {
                // Turn this duration into a rest
                dispatch(addRest(selectedDurationId));
              }

              noteOrDurationWasDeleted = true;
            }
            // If there is a rest at the selected duration,
            else if (
              durations.find((duration) => duration.id === selectedDurationId)
                .isRest
            ) {
              // Delete the duration
              dispatch(deleteDuration(selectedDurationId));
              noteOrDurationWasDeleted = true;
            }

            if (noteOrDurationWasDeleted) {
              debugger;
              // If the currently selected duration in NOT first in the measure,
              if (selectedDurationId !== selectedMeasure.durations[0]) {
                // Select the previous duration
                const previousDurationId =
                  selectedMeasure.durations[
                    selectedMeasure.durations.findIndex(
                      (durationId) => durationId === selectedDurationId
                    ) - 1
                  ];

                dispatch(selectDuration(previousDurationId));
              } else if (selectedMeasureNumber === 0) {
                // If there's a duration following the deleted one in this measure,
                if (selectedMeasure.durations.length > 1) {
                  const nextDurationId =
                    selectedMeasure.durations[
                      selectedMeasure.durations.findIndex(
                        (durationId) => durationId === selectedDurationId
                      ) + 1
                    ];

                  // Select it
                  dispatch(selectDuration(nextDurationId));
                } else {
                  dispatch(selectDuration(null));
                }
              }
              // If the currently selected duration is first in the measure,
              // And there is a duration preceding this one,
              else if (
                selectedMeasureNumber > 0 &&
                measures[selectedMeasureNumber - 1].durations.slice(-1).length
              ) {
                // Select the last duration of the previous measure
                dispatch(
                  selectDuration(
                    measures[selectedMeasureNumber - 1].durations.slice(-1)[0]
                  )
                );
                dispatch(selectMeasure(selectedMeasureNumber - 1));
              }
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

              // If a track that's not last is being deleted,
              if (selectedTrackNumber < tracks.length - 1) {
                // Select first duration of next track's measure at selectedMeasureNumber
                dispatch(
                  selectDuration(
                    measures.find(
                      (measure) =>
                        measure.id ===
                        tracks[selectedTrackNumber + 1].measures[
                          selectedMeasureNumber
                        ]
                    ).durations[0]
                  )
                );
              }
              // Otherwise, select first duration of previous track's measure at selectedMeasureNumber
              else if (selectedTrackNumber !== 0) {
                dispatch(
                  selectDuration(
                    measures.find(
                      (measure) =>
                        measure.id ===
                        tracks[selectedTrackNumber - 1].measures[
                          selectedMeasureNumber
                        ]
                    ).durations[0]
                  )
                );
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
      getSelectedMeasure,
      getCurrentBarDuration,
      getCurrentBarMaximumDuration,
      tracks,
      measures,
      durations,
      notes,
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
    let barDuration = 0;
    let barMaximumDuration = 1;

    if (tracks.length && measures.length) {
      barDuration = getCurrentBarDuration();
      barMaximumDuration = getCurrentBarMaximumDuration();
    }

    // TODO Display minimum 1 decimal place, and up to 4 decimal places,
    //   rounded, not truncated
    //     e.g. 0.0, 0.5, 0.25, 0.125, 0.0625 (duplets)
    //          0.667, 0.333, 0.167, 0.0833, 0.0417 (triplets)
    return barDuration.toFixed(1) + ':' + barMaximumDuration.toFixed(1);
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
