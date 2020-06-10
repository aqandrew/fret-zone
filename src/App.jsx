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
  addTrack,
  deleteTrack,
  addMeasure,
  deleteMeasure,
  addDuration,
  addNote,
  addRest,
  deleteDuration,
  markDurationAsNotRest,
  deleteNote,
  setDurationLength,
  defaultMeasureOptions,
  measuresSelector,
  tracksSelector,
  durationsSelector,
  notesSelector,
} from './slices/document';
import {
  maximumFretNumber,
  sameFretNumberCutoffTime,
  durationLengths,
} from './constants';
import AppMenu from './components/AppMenu';
import TabBar from './components/TabBar';
import CheckboxButton from './components/CheckboxButton';
import EditionPalette from './components/EditionPalette';
import Workspace from './components/Workspace';
import Inspector from './components/Inspector';
import GlobalView from './components/GlobalView';
import AddTrackModal from './components/AddTrackModal';
import DeleteTrackModal from './components/DeleteTrackModal';

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
  const [showDeleteTrackModal, setShowDeleteTrackModal] = useState(false);
  const [lastFretInputTime, setLastFretInputTime] = useState(Date.now());

  const getSelectedMeasure = useCallback(
    () =>
      measures.find(
        (measure) =>
          measure.id ===
          tracks[selectedTrackNumber].measures[selectedMeasureNumber]
      ),
    [tracks, measures, selectedTrackNumber, selectedMeasureNumber]
  );

  const getSelectedDuration = useCallback(
    () => durations.find((duration) => duration.id === selectedDurationId),
    [durations, selectedDurationId]
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

  const dispatchDeleteTrack = () => {
    // If a track that's not last is being deleted,
    if (selectedTrackNumber < tracks.length - 1) {
      // Select first duration of next track's measure at selectedMeasureNumber
      dispatch(
        selectDuration(
          measures.find(
            (measure) =>
              measure.id ===
              tracks[selectedTrackNumber + 1].measures[selectedMeasureNumber]
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
              tracks[selectedTrackNumber - 1].measures[selectedMeasureNumber]
          ).durations[0]
        )
      );
      dispatch(selectTrack(selectedTrackNumber - 1));
    }

    dispatch(deleteTrack(tracks[selectedTrackNumber].id));
  };

  const dispatchAddTrack = (trackToAdd) => {
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

  const dispatchShortenDuration = useCallback(
    (durationId) => {
      dispatch(
        setDurationLength({
          durationId: durationId,
          newLength: getSelectedDuration().length / 2,
        })
      );
    },
    [dispatch, getSelectedDuration]
  );

  const dispatchLengthenDuration = useCallback(
    (durationId) => {
      dispatch(
        setDurationLength({
          durationId: durationId,
          newLength: getSelectedDuration().length * 2,
        })
      );
    },
    [dispatch, getSelectedDuration]
  );

  const dispatchSelectPreviousString = useCallback(
    (track) => {
      dispatch(
        selectString(
          selectedStringNumber === 0
            ? track.tuning.length - 1
            : selectedStringNumber - 1
        )
      );
    },
    [dispatch, selectedStringNumber]
  );

  const dispatchSelectNextString = useCallback(
    (track) => {
      dispatch(selectString((selectedStringNumber + 1) % track.tuning.length));
    },
    [dispatch, selectedStringNumber]
  );

  const dispatchSelectPreviousDuration = useCallback(
    (selectedTrack, selectedMeasure, selectedDuration) => {
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

        const durationIdToSelect = measures
          .find(
            (measure) =>
              measure.id === selectedTrack.measures[selectedMeasureNumber - 1]
          )
          .durations.slice(-1)[0];

        // Select the last duration of the previous measure
        dispatch(selectDuration(durationIdToSelect));

        if (
          selectedDuration.length !==
          durations.find((duration) => duration.id === durationIdToSelect)
            .length
        ) {
          console.log(`TODO Change this empty non-rest duration's length`);
        }
      }
    },
    [dispatch, measures, durations, selectedMeasureNumber, selectedDurationId]
  );

  const dispatchSelectNextDuration = useCallback(
    (selectedTrack, selectedMeasure, selectedDuration) => {
      let shouldCheckIfMeasureIsLast = false;

      // If there's a note at this duration,
      // Or if this duration is a rest,
      if (selectedDuration.notes.length || selectedDuration.isRest) {
        // If this is the last duration,
        if (selectedDurationId === selectedMeasure.durations.slice(-1)[0]) {
          // If the measure's total length === maximum,
          if (getCurrentBarDuration() === getCurrentBarMaximumDuration()) {
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
          // TODO Use parallel arrays like in dispatchAddTrack instead
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
    },
    [
      dispatch,
      getCurrentBarDuration,
      getCurrentBarMaximumDuration,
      tracks,
      measures,
      selectedDurationId,
      selectedMeasureNumber,
    ]
  );

  const dispatchDeleteMeasure = useCallback(
    (selectedTrack) => {
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
                measure.id === selectedTrack.measures[newSelectedMeasureNumber]
            ).durations[0]
          )
        );

        // Even though dispatch runs synchronously, selectedMeasureNumber does not change within this closure,
        // so this still deletes the correct measure after selectMeasure has executed
        dispatch(deleteMeasure(selectedMeasureNumber));
      }
    },
    [dispatch, measures, selectedMeasureNumber]
  );

  const dispatchDeleteNote = useCallback(
    (selectedMeasure, selectedDuration) => {
      let needToSelectNewDuration = false;

      // If there is a note at this selected duration/string,
      if (
        selectedDuration.notes
          .map((noteId) => notes.find((note) => note.id === noteId).string)
          .includes(selectedStringNumber)
      ) {
        // Delete that note
        // TODO These lines are horribly inefficient
        const selectedNoteId = selectedDuration.notes.find(
          (noteId) =>
            notes.find((note) => note.id === noteId).string ===
            selectedStringNumber
        );

        dispatch(deleteNote(selectedNoteId));

        // If the deleted note was the last one in the selected duration,
        if (selectedDuration.notes.length === 1) {
          // Turn the duration into a rest
          dispatch(addRest(selectedDurationId));
        } else {
          needToSelectNewDuration = true;
        }
      } else {
        // If the selected duration is a rest,
        if (selectedDuration.isRest) {
          // If this is the only duration in the measure,
          if (selectedMeasure.durations.length === 1) {
            // Change the duration to NOT a rest
            dispatch(markDurationAsNotRest(selectedDurationId));
          } else {
            // Delete that duration
            dispatch(deleteDuration(selectedDurationId));

            needToSelectNewDuration = true;
          }
        }
      }

      if (needToSelectNewDuration) {
        let durationIdToSelect;

        // If the selected duration is first in the measure,
        if (selectedDurationId === selectedMeasure.durations[0]) {
          // If the first measure of the document is selected,
          if (selectedMeasureNumber === 0) {
            // Select the next duration of this measure
            durationIdToSelect =
              selectedMeasure.durations[
                selectedMeasure.durations.findIndex(
                  (durationId) => durationId === selectedDurationId
                ) + 1
              ];
          } else {
            // Select the previous measure's last duration
            durationIdToSelect = measures[
              selectedMeasureNumber - 1
            ].durations.slice(-1)[0];

            dispatch(selectMeasure(selectedMeasureNumber - 1));
          }
        } else {
          // Select this measure's previous duration
          durationIdToSelect =
            selectedMeasure.durations[
              selectedMeasure.durations.findIndex(
                (durationId) => durationId === selectedDurationId
              ) - 1
            ];
        }

        dispatch(selectDuration(durationIdToSelect));
      }
    },
    [
      dispatch,
      measures,
      notes,
      selectedMeasureNumber,
      selectedDurationId,
      selectedStringNumber,
    ]
  );

  const dispatchAddNote = useCallback(
    (selectedDuration, fretNumber) => {
      const fretInputTime = Date.now();
      setLastFretInputTime(fretInputTime);

      // TODO See other comment about "horribly inefficient"
      // TODO selectedNote is probably a good variable to have
      const currentFretNumber =
        notes.find(
          (note) =>
            note.string === selectedStringNumber &&
            selectedDuration.notes.includes(note.id)
        )?.fret || 0;
      const enteredFretNumber = parseInt(fretNumber);
      const newFretNumber = currentFretNumber * 10 + enteredFretNumber;

      dispatch(
        addNote({
          durationId: selectedDurationId,
          id: uuidv4(),
          string: selectedStringNumber,
          fret:
            fretInputTime - lastFretInputTime < sameFretNumberCutoffTime &&
            newFretNumber <= maximumFretNumber
              ? newFretNumber
              : enteredFretNumber,
        })
      );
    },
    [
      dispatch,
      notes,
      selectedDurationId,
      selectedStringNumber,
      lastFretInputTime,
    ]
  );

  const onKeyDown = useCallback(
    (event) => {
      if (
        event.currentTarget === document &&
        (event.target.tagName !== 'INPUT' ||
          event.target.classList.contains('Measure__Input'))
      ) {
        const selectedTrack = tracks[selectedTrackNumber];
        const selectedMeasure = getSelectedMeasure();
        const selectedDuration = getSelectedDuration();
        console.log(event);

        switch (event.key) {
          case 'ArrowUp':
            event.preventDefault();
            dispatchSelectPreviousString(selectedTrack);

            break;
          case 'ArrowDown':
            event.preventDefault();
            dispatchSelectNextString(selectedTrack);

            break;
          // Advance duration/measure
          case 'ArrowRight':
            event.preventDefault();

            // TODO If Cmd was held, select the first duration of the next measure

            dispatchSelectNextDuration(
              selectedTrack,
              selectedMeasure,
              selectedDuration
            );

            break;
          // Previous duration/measure
          case 'ArrowLeft':
            event.preventDefault();

            // TODO Select the FIRST duration of the previous measure if Cmd was held

            dispatchSelectPreviousDuration(
              selectedTrack,
              selectedMeasure,
              selectedDuration
            );

            break;
          case '+':
            // TODO Insert measure
            if (event.ctrlKey) {
            }
            // Shorten selected duration
            else {
              if (
                selectedDuration.length >
                Math.min(...Object.keys(durationLengths))
              ) {
                dispatchShortenDuration(selectedDurationId);
              }
            }

            break;
          case '-':
            // Delete measure
            if (event.ctrlKey) {
              dispatchDeleteMeasure(selectedTrack);
            }
            // Lengthen selected duration
            else {
              if (
                selectedDuration.length <
                Math.max(...Object.keys(durationLengths))
              ) {
                dispatchLengthenDuration(selectedDurationId);
              }
            }

            break;
          case '=':
            // Shorten selected duration
            if (
              selectedDuration.length >
              Math.min(...Object.keys(durationLengths))
            ) {
              dispatchShortenDuration(selectedDurationId);
            }

            break;
          case 'r':
            // Turn selected duration into rest
            dispatch(addRest(selectedDurationId));

            break;
          case 'Backspace':
            // Delete selected note
            dispatchDeleteNote(selectedMeasure, selectedDuration);

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
              setShowDeleteTrackModal(true);
            }

            break;
          default:
            // Set note at cursor
            if (
              !isNaN(event.key) &&
              tracks.length !== 0 &&
              measures.length !== 0
            ) {
              dispatchAddNote(selectedDuration, event.key);

              break;
            }
        }
      }
    },
    [
      dispatch,
      getSelectedMeasure,
      getSelectedDuration,
      dispatchShortenDuration,
      dispatchLengthenDuration,
      tracks,
      measures,
      selectedTrackNumber,
      selectedDurationId,
      dispatchSelectPreviousString,
      dispatchSelectNextString,
      dispatchSelectPreviousDuration,
      dispatchSelectNextDuration,
      dispatchDeleteMeasure,
      dispatchDeleteNote,
      dispatchAddNote,
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
      <div className="ToolBar">
        <div className="ToolBar__ActiveFileName">
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
          {/* TODO Display modes select */}
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
      <TabBar
        files={dummyFileList}
        activeFileName={activeFileName}
        setActiveFileName={setActiveFileName}
      />
      <div className="App__Content--Main">
        <div className="App__Content--Center">
          {/* TODO This prop-drilling approach should be rethought */}
          {/* Won't scale nicely--there will be a ton of setter functions to drill into the whole Edition Palette */}
          {editionPaletteShown && (
            <EditionPalette selectedDuration={getSelectedDuration()} />
          )}
          <Workspace
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
            const { durationIdToSelect } = dispatchAddTrack(modalResult);

            dispatch(selectTrack(tracks.length));
            dispatch(selectDuration(durationIdToSelect));
          }
        }}
      />
      <DeleteTrackModal
        show={showDeleteTrackModal}
        onClose={(modalResult) => {
          setShowDeleteTrackModal(false);

          if (modalResult) {
            dispatchDeleteTrack();
          }
        }}
      />
    </div>
  );
};

export default App;
