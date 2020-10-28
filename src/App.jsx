import React, { useState, useCallback, useEffect, useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Emoji from 'a11y-react-emoji';

import { appReducer, initialAppState } from './reducers';
import * as actionTypes from './actionTypes';
import DispatchContext from './DispatchContext';
import AppStateContext from './AppStateContext';
import { roundDurationLength } from './utils';
import {
  maximumFretNumber,
  sameFretNumberCutoffTime,
  durationLengths,
  notesSharp,
} from './constants';
import { useDocument } from './hooks/useDocument';
// import AppMenu from './components/AppMenu';
import TabBar from './components/TabBar';
import CheckboxButton from './components/CheckboxButton';
import Zoom from './components/ToolBar/Zoom';
import DisplayModes from './components/ToolBar/DisplayModes';
import EditionPalette from './components/EditionPalette';
import Workspace from './components/Workspace';
import Inspector from './components/Inspector';
import GlobalView from './components/GlobalView';
import AddTrackModal from './components/AddTrackModal';
import DeleteTrackModal from './components/DeleteTrackModal';
import Pitch from './components/Pitch';

import './App.scss';

const App = () => {
  const [appState, dispatchApp] = useReducer(appReducer, initialAppState);
  const {
    selectedTrackNumber,
    selectedMeasureNumber,
    selectedDurationId,
    selectedStringNumber,
  } = appState;
  const { tracks, measures, durations, notes } = useDocument(appState);
  const [isEditionPaletteShown, setIsEditionPaletteShown] = useState(true);
  const [isGlobalViewShown, setIsGlobalViewShown] = useState(true);
  const [isInspectorShown, setIsInspectorShown] = useState(true);

  const dummyFileList = [
    { id: 0, name: '' },
    // { id: 1, name: 'Stairway to Heaven' },
    // { id: 2, name: 'Through the Fire and Flames' }
  ];

  // TODO Determine active file via id, not name
  const [activeFileName, setActiveFileName] = useState(dummyFileList[0].name);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [displayModeIndex, setDisplayModeIndex] = useState(0);
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentArtist, setDocumentArtist] = useState('');
  const [showAddTrackModal, setShowAddTrackModal] = useState(false);
  const [showDeleteTrackModal, setShowDeleteTrackModal] = useState(false);
  const [lastFretInputTime, setLastFretInputTime] = useState(Date.now());
  const [selectedTrack, setSelectedTrack] = useState(undefined);
  const [selectedMeasure, setSelectedMeasure] = useState(undefined);
  const [selectedDuration, setSelectedDuration] = useState(undefined);

  const PitchAtCursor = () => {
    // TODO Pitch evaluation should probably be moved to utility function,
    // for when ability to draw staff notation is added

    // If on an open string, or if there are no notes, return that string's pitch
    const openStringPitch = selectedTrack?.tuning[selectedStringNumber];
    let pitch = { ...openStringPitch };
    const isNotePresent = isThereANoteAtSelectedPosition();

    if (isNotePresent) {
      let noteIndex = notesSharp.indexOf(pitch.note);
      // TODO Remove duplicated code between this and Workspace.jsx:DurationColumn
      const noteAtString = selectedDuration.notes
        .map((noteId) => notes.find((note) => note.id === noteId))
        .find((note) => note.string === selectedStringNumber);

      // Add appropriate number of semitones on top of string's tuning
      noteIndex = (noteIndex + noteAtString.fret) % notesSharp.length;
      pitch.note = notesSharp[noteIndex];

      // And increase octave as necessary
      const openStringSemitonesToNextOctave =
        notesSharp.length - notesSharp.indexOf(openStringPitch.note);

      pitch.octave +=
        Math.floor(
          (noteAtString.fret - openStringSemitonesToNextOctave) /
            notesSharp.length
        ) + 1;
    }

    return <Pitch {...{ ...pitch, isNotePresent }} />;
  };

  useEffect(() => {
    setSelectedTrack(tracks[selectedTrackNumber]);
  }, [tracks, selectedTrackNumber]);

  useEffect(() => {
    setSelectedMeasure(
      measures.find(
        (measure) =>
          measure.id ===
          tracks[selectedTrackNumber].measures[selectedMeasureNumber]
      )
    );
  }, [tracks, measures, selectedTrackNumber, selectedMeasureNumber]);

  useEffect(() => {
    setSelectedDuration(
      durations.find((duration) => duration.id === selectedDurationId)
    );
  }, [durations, selectedDurationId]);

  const getCurrentBarMaximumDuration = useCallback(
    () =>
      (selectedMeasure?.timeSignature.beatUnit / 4) *
      selectedMeasure?.timeSignature.beatsPerMeasure,
    [selectedMeasure]
  );

  const getCurrentBarDuration = useCallback(() => {
    const currentBarMaximumDuration = getCurrentBarMaximumDuration();

    return (
      selectedMeasure?.durations.reduce((totalDuration, durationId) => {
        let durationInMeasure = durations.find(
          (duration) => duration.id === durationId
        );

        if (durationInMeasure?.notes.length || durationInMeasure?.isRest) {
          return (
            totalDuration +
            (durationInMeasure.isDotted
              ? durationInMeasure.length * 1.5
              : durationInMeasure.length)
          );
        }

        return totalDuration;
      }, 0) * currentBarMaximumDuration
    );
  }, [durations, selectedMeasure, getCurrentBarMaximumDuration]);

  const isThereANoteAtSelectedPosition = useCallback(
    () =>
      selectedDuration?.notes
        .map((noteId) => notes.find((note) => note.id === noteId)?.string)
        .includes(selectedStringNumber),
    [notes, selectedDuration, selectedStringNumber]
  );

  const dispatchDeleteTrack = () => {
    // If a track that's not last is being deleted,
    if (selectedTrackNumber < tracks.length - 1) {
      const nextTracksFirstDurationAtSelectedMeasureNumber = durations.find(
        (duration) =>
          duration.id ===
          measures.find(
            (measure) =>
              measure.id ===
              tracks[selectedTrackNumber + 1].measures[selectedMeasureNumber]
          ).durations[0]
      );

      // Select first duration of next track's measure at selectedMeasureNumber
      dispatchApp({
        type: actionTypes.SELECT_DURATION,
        durationId: nextTracksFirstDurationAtSelectedMeasureNumber.id,
      });
    }
    // Otherwise, select first duration of previous track's measure at selectedMeasureNumber
    else if (selectedTrackNumber !== 0) {
      const previousTracksFirstDurationAtSelectedMeasureNumber = durations.find(
        (duration) =>
          duration.id ===
          measures.find(
            (measure) =>
              measure.id ===
              tracks[selectedTrackNumber - 1].measures[selectedMeasureNumber]
          ).durations[0]
      );

      dispatchApp({
        type: actionTypes.SELECT_TRACK,
        trackNumber: selectedTrackNumber - 1,
      });
      dispatchApp({
        type: actionTypes.SELECT_DURATION,
        durationId: previousTracksFirstDurationAtSelectedMeasureNumber.id,
      });
    }

    dispatchApp({
      type: actionTypes.DELETE_TRACK,
      trackId: tracks[selectedTrackNumber].id,
    });
  };

  const dispatchAddTrack = useCallback(
    (trackToAdd) => {
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

      dispatchApp({
        type: actionTypes.ADD_TRACK,
        id: newTrackId,
        measures: measureIds,
        durationIds: durationIds,
        durationLength: selectedDuration?.length,
        ...trackToAdd,
      });

      return {
        newTrackId: newTrackId,
        durationIdToSelect: durationIds[selectedMeasureNumber],
      };
    },
    [selectedMeasureNumber, selectedDuration, tracks]
  );

  const dispatchShortenDuration = useCallback(
    (durationId) => {
      dispatchApp({
        type: actionTypes.SET_DURATION_LENGTH,
        durationId: durationId,
        newLength: selectedDuration?.length / 2,
      });
    },
    [selectedDuration]
  );

  const dispatchLengthenDuration = useCallback(
    (durationId) => {
      dispatchApp({
        type: actionTypes.SET_DURATION_LENGTH,
        durationId: durationId,
        newLength: selectedDuration?.length * 2,
      });
    },
    [selectedDuration]
  );

  const dispatchSelectPreviousString = useCallback(() => {
    dispatchApp({
      type: actionTypes.SELECT_STRING,
      stringNumber:
        selectedStringNumber === 0
          ? selectedTrack?.tuning.length - 1
          : selectedStringNumber - 1,
    });
  }, [selectedTrack, selectedStringNumber]);

  const dispatchSelectNextString = useCallback(() => {
    dispatchApp({
      type: actionTypes.SELECT_STRING,
      stringNumber: (selectedStringNumber + 1) % selectedTrack?.tuning.length,
    });
  }, [selectedTrack, selectedStringNumber]);

  const dispatchSelectPreviousDuration = useCallback(() => {
    // If currently selected duration is NOT first in the measure,
    if (selectedDurationId !== selectedMeasure?.durations[0]) {
      // Select the previous duration
      dispatchApp({
        type: actionTypes.SELECT_DURATION,
        durationId:
          selectedMeasure?.durations[
            selectedMeasure?.durations.findIndex(
              (durationId) => durationId === selectedDurationId
            ) - 1
          ],
      });
    } else if (selectedMeasureNumber > 0) {
      const previousMeasure = measures.find(
        (measure) =>
          measure.id === selectedTrack?.measures[selectedMeasureNumber - 1]
      );
      const durationIdToSelect = previousMeasure.durations.slice(-1)[0];

      // Select the last duration of the previous measure
      dispatchApp({
        type: actionTypes.SELECT_MEASURE,
        measureNumber: selectedMeasureNumber - 1,
      });
      dispatchApp({
        type: actionTypes.SELECT_DURATION,
        durationId: durationIdToSelect,
      });
    }
  }, [
    measures,
    selectedTrack,
    selectedMeasureNumber,
    selectedMeasure,
    selectedDurationId,
  ]);

  const dispatchSelectNextDuration = useCallback(() => {
    let shouldCheckIfMeasureIsLast = false;

    // If there's a note at this duration,
    // Or if this duration is a rest,
    if (selectedDuration?.notes.length || selectedDuration?.isRest) {
      // If this is the last duration,
      if (selectedDurationId === selectedMeasure?.durations.slice(-1)[0]) {
        // If the measure's total length === maximum,
        if (getCurrentBarDuration() === getCurrentBarMaximumDuration()) {
          shouldCheckIfMeasureIsLast = true;
        }
        // Add a new duration to this measure
        else {
          let newDurationId = uuidv4();

          dispatchApp({
            type: actionTypes.ADD_DURATION,
            measureId: selectedMeasure?.id,
            newDurationId: newDurationId,
            length: selectedDuration?.length,
            isDotted: selectedDuration?.isDotted,
          });
          dispatchApp({
            type: actionTypes.SELECT_DURATION,
            durationId: newDurationId,
          });
        }
      }
      // Select the next duration in this measure
      else {
        const nextDuration = durations.find(
          (duration) =>
            duration.id ===
            selectedMeasure?.durations[
              selectedMeasure?.durations.findIndex(
                (durationId) => durationId === selectedDurationId
              ) + 1
            ]
        );

        dispatchApp({
          type: actionTypes.SELECT_DURATION,
          durationId: nextDuration.id,
        });
      }
    } else {
      shouldCheckIfMeasureIsLast = true;
    }

    if (shouldCheckIfMeasureIsLast) {
      // If selectedMeasure is last,
      // Add a new measure
      if (selectedMeasureNumber === selectedTrack?.measures.length - 1) {
        // TODO Use parallel arrays like in dispatchAddTrack instead
        // Create a mapping from track IDs to new measure IDs
        let trackMeasureIds = tracks.reduce((map, track) => {
          map[track.id] = {
            measureId: uuidv4(),
            durationId: uuidv4(),
          };
          return map;
        }, {});

        // TODO Pass in current measure's time signature
        dispatchApp({
          type: actionTypes.ADD_MEASURE,
          trackMeasureIds: trackMeasureIds,
          durationLength: selectedDuration?.length,
        });
        dispatchApp({
          type: actionTypes.SELECT_MEASURE,
          measureNumber: selectedMeasureNumber + 1,
        });
        dispatchApp({
          type: actionTypes.SELECT_DURATION,
          durationId: trackMeasureIds[selectedTrack?.id].durationId,
        });
      }
      // Select the next measure
      else {
        const nextMeasure = measures.find(
          (measure) =>
            measure.id === selectedTrack?.measures[selectedMeasureNumber + 1]
        );
        const durationIdToSelect = nextMeasure.durations[0];

        dispatchApp({
          type: actionTypes.SELECT_MEASURE,
          measureNumber: selectedMeasureNumber + 1,
        });
        dispatchApp({
          type: actionTypes.SELECT_DURATION,
          durationId: durationIdToSelect,
        });
      }
    }
  }, [
    getCurrentBarDuration,
    getCurrentBarMaximumDuration,
    tracks,
    measures,
    durations,
    selectedTrack,
    selectedMeasureNumber,
    selectedMeasure,
    selectedDurationId,
    selectedDuration,
  ]);

  const dispatchDeleteMeasure = useCallback(() => {
    if (selectedTrack?.measures.length > 1) {
      let newSelectedMeasureNumber;

      if (selectedMeasureNumber > 0) {
        newSelectedMeasureNumber = selectedMeasureNumber - 1;
        dispatchApp({
          type: actionTypes.SELECT_MEASURE,
          measureNumber: newSelectedMeasureNumber,
        });
      } else {
        newSelectedMeasureNumber = selectedMeasureNumber + 1;
      }

      const durationToSelect = durations.find(
        (duration) =>
          duration.id ===
          measures.find(
            (measure) =>
              measure.id === selectedTrack?.measures[newSelectedMeasureNumber]
          ).durations[0]
      );

      dispatchApp({
        type: actionTypes.SELECT_DURATION,
        durationId: durationToSelect.id,
      });

      // Even though dispatch runs synchronously, selectedMeasureNumber does not change within this closure,
      // so this still deletes the correct measure after SELECT_MEASURE has executed
      dispatchApp({
        type: actionTypes.DELETE_MEASURE,
        measureNumber: selectedMeasureNumber,
      });
    }
  }, [measures, durations, selectedTrack, selectedMeasureNumber]);

  const dispatchDeleteNote = useCallback(() => {
    let needToSelectNewDuration = false;

    // If there is a note at this selected duration/string,
    if (isThereANoteAtSelectedPosition()) {
      // Delete that note
      // TODO These lines are horribly inefficient
      const selectedNoteId = selectedDuration?.notes.find(
        (noteId) =>
          notes.find((note) => note.id === noteId).string ===
          selectedStringNumber
      );

      dispatchApp({ type: actionTypes.DELETE_NOTE, noteId: selectedNoteId });

      // If the deleted note was the last one in the selected duration,
      if (selectedDuration?.notes.length === 1) {
        // Turn the duration into a rest
        dispatchApp({
          type: actionTypes.ADD_REST,
          durationId: selectedDurationId,
        });
      } else {
        needToSelectNewDuration = true;
      }
    } else {
      // If the selected duration is a rest,
      if (selectedDuration?.isRest) {
        // If this is the only duration in the measure,
        if (selectedMeasure?.durations.length === 1) {
          // Change the duration to NOT a rest
          dispatchApp({
            type: actionTypes.MARK_DURATION_AS_NOT_REST,
            durationId: selectedDurationId,
          });
        } else {
          // Delete that duration
          dispatchApp({
            type: actionTypes.DELETE_DURATION,
            durationId: selectedDurationId,
          });

          needToSelectNewDuration = true;
        }
      }
    }

    if (needToSelectNewDuration) {
      let durationIdToSelect;

      // If the selected duration is first in the measure,
      if (selectedDurationId === selectedMeasure?.durations[0]) {
        // If the first measure of the document is selected,
        if (selectedMeasureNumber === 0) {
          // Select the next duration of this measure
          durationIdToSelect =
            selectedMeasure?.durations[
              selectedMeasure?.durations.findIndex(
                (durationId) => durationId === selectedDurationId
              ) + 1
            ];
        } else {
          // Select the previous measure's last duration
          durationIdToSelect = measures[
            selectedMeasureNumber - 1
          ].durations.slice(-1)[0];

          dispatchApp({
            type: actionTypes.SELECT_MEASURE,
            measureNumber: selectedMeasureNumber - 1,
          });
        }
      } else {
        // Select this measure's previous duration
        durationIdToSelect =
          selectedMeasure?.durations[
            selectedMeasure?.durations.findIndex(
              (durationId) => durationId === selectedDurationId
            ) - 1
          ];
      }

      dispatchApp({
        type: actionTypes.SELECT_DURATION,
        durationId: durationIdToSelect,
      });
    }
  }, [
    measures,
    notes,
    selectedMeasureNumber,
    selectedMeasure,
    selectedDurationId,
    selectedDuration,
    selectedStringNumber,
    isThereANoteAtSelectedPosition,
  ]);

  const dispatchAddNote = useCallback(
    (fretNumber) => {
      const fretInputTime = Date.now();
      setLastFretInputTime(fretInputTime);

      // TODO See other comment about "horribly inefficient"
      // TODO selectedNote is probably a good variable to have
      const currentFretNumber =
        notes.find(
          (note) =>
            note.string === selectedStringNumber &&
            selectedDuration?.notes.includes(note.id)
        )?.fret || 0;
      const enteredFretNumber = parseInt(fretNumber);
      const newFretNumber = currentFretNumber * 10 + enteredFretNumber;

      dispatchApp({
        type: actionTypes.ADD_NOTE,
        durationId: selectedDurationId,
        id: uuidv4(),
        string: selectedStringNumber,
        fret:
          fretInputTime - lastFretInputTime < sameFretNumberCutoffTime &&
          newFretNumber <= maximumFretNumber
            ? newFretNumber
            : enteredFretNumber,
      });
    },
    [
      notes,
      selectedDurationId,
      selectedDuration,
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
        switch (event.key) {
          case 'ArrowUp':
            event.preventDefault();
            dispatchSelectPreviousString();

            break;
          case 'ArrowDown':
            event.preventDefault();
            dispatchSelectNextString();

            break;
          // Advance duration/measure
          case 'ArrowRight':
            event.preventDefault();

            // TODO If Cmd was held, select the first duration of the next measure

            dispatchSelectNextDuration();

            break;
          // Previous duration/measure
          case 'ArrowLeft':
            event.preventDefault();

            // TODO Select the FIRST duration of the previous measure if Cmd was held

            dispatchSelectPreviousDuration();

            break;
          case '+':
            // TODO Insert measure
            if (event.ctrlKey) {
            }
            // Shorten selected duration
            else {
              if (
                selectedDuration?.length >
                Math.min(...Object.keys(durationLengths))
              ) {
                dispatchShortenDuration(selectedDurationId);
              }
            }

            break;
          case '-':
            // Delete measure
            if (event.ctrlKey) {
              dispatchDeleteMeasure();
            }
            // Lengthen selected duration
            else {
              if (
                selectedDuration?.length <
                Math.max(...Object.keys(durationLengths))
              ) {
                dispatchLengthenDuration(selectedDurationId);
              }
            }

            break;
          case '=':
            // Shorten selected duration
            if (
              selectedDuration?.length >
              Math.min(...Object.keys(durationLengths))
            ) {
              dispatchShortenDuration(selectedDurationId);
            }

            break;
          case '.':
            // Toggle whether selected duration is dotted
            dispatchApp({
              type: actionTypes.SET_DURATION_DOTTED,
              durationId: selectedDurationId,
              isDotted: !selectedDuration.isDotted,
            });

            break;
          case 'r':
            // Turn selected duration into rest
            dispatchApp({
              type: actionTypes.ADD_REST,
              durationId: selectedDurationId,
            });

            break;
          case 'Backspace':
            // Delete selected note
            dispatchDeleteNote();

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
              dispatchAddNote(event.key);

              break;
            }
        }
      }
    },
    [
      dispatchShortenDuration,
      dispatchLengthenDuration,
      tracks,
      measures,
      selectedDurationId,
      selectedDuration,
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

    // TODO Click to toggle incomplete duration vs. remaining duration
    return (
      <>
        <Emoji
          symbol={barDuration === barMaximumDuration ? '✅' : '⚠️'}
          className="DurationSymbol"
        />
        {roundDurationLength(barDuration) +
          ':' +
          roundDurationLength(barMaximumDuration)}
      </>
    );
  };

  return (
    <AppStateContext.Provider value={appState}>
      <DispatchContext.Provider value={dispatchApp}>
        <div className="App" onKeyDown={onKeyDown} role="application">
          {/* <AppMenu /> */}
          <div className="TopBar">
            <div className="TopBarText">
              <span className="TopBarText__ActiveFileName">
                {activeFileName || 'untitled'}
              </span>
              <span className="TopBarText__Attribution">
                <a
                  href="https://github.com/dawneraq/fret-zone"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="TopBarText__Link"
                >
                  Source
                </a>{' '}
                • Made with <Emoji symbol="🤘🏽" /> by{' '}
                <a
                  href="https://twitter.com/aqandrew"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="TopBarText__Link"
                >
                  Andrew
                </a>
              </span>
            </div>
            <div className="ToolBar">
              <div className="ToolBar__Group ToolBar__Group--Left">
                <div className="ToolBar__ButtonContainer ToolBar__ButtonContainer--Panels">
                  <CheckboxButton
                    buttonText="["
                    buttonTitle="Show/Hide Edition Palette"
                    isChecked={isEditionPaletteShown}
                    setChecked={setIsEditionPaletteShown}
                  />
                  <CheckboxButton
                    buttonText="_"
                    buttonTitle="Show/Hide Global View"
                    isChecked={isGlobalViewShown}
                    setChecked={setIsGlobalViewShown}
                  />
                  <CheckboxButton
                    buttonText="]"
                    buttonTitle="Show/Hide Inspector"
                    isChecked={isInspectorShown}
                    setChecked={setIsInspectorShown}
                  />
                </div>
                <div className="ToolBar__ButtonContainer ToolBar__ButtonContainer--Workspace">
                  <Zoom zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} />
                  <DisplayModes
                    displayModeIndex={displayModeIndex}
                    setDisplayModeIndex={setDisplayModeIndex}
                  />
                </div>
                <div className="ToolBar__ButtonContainer ToolBar__ButtonContainer--History">
                  <button title="Undo">
                    <Emoji symbol="↩️" />
                  </button>
                  <button title="Redo">
                    <Emoji symbol="↪️" />
                  </button>
                </div>
                <button title="Print...">
                  <Emoji symbol="🖨" />
                </button>
              </div>
              <div className="ToolBar__Group ToolBar__Group--Center">
                <div className="NavigationAndPlayback">
                  <button
                    className="NavigationAndPlayback__Button NavigationAndPlayback__Button--FirstBar"
                    title="Go to first bar"
                  >
                    <Emoji symbol="⏮" />
                  </button>
                  <button
                    className="NavigationAndPlayback__Button NavigationAndPlayback__Button--PreviousBar"
                    title="Go to previous bar"
                  >
                    <Emoji symbol="⏪" />
                  </button>
                  <button
                    className="NavigationAndPlayback__Button NavigationAndPlayback__Button--PlayPause"
                    title="Play"
                  >
                    <Emoji symbol="▶️" />
                  </button>
                  <button
                    className="NavigationAndPlayback__Button NavigationAndPlayback__Button--NextBar"
                    title="Go to next bar"
                  >
                    <Emoji symbol="⏩" />
                  </button>
                  <button
                    className="NavigationAndPlayback__Button NavigationAndPlayback__Button--LastBar"
                    title="Go to last bar"
                  >
                    <Emoji symbol="⏭" />
                  </button>
                </div>
                <div className="LCD">
                  <select
                    className="LCD__Control LCD__Control--CurrentTrack"
                    title="Current track (Click to change)"
                    value={selectedTrackNumber}
                    onChange={(event) => {
                      let trackNumberToSelect = +event.target.value;

                      // TODO Remove duplicated code between this and TrackControl.onClick
                      // Select first duration of track's measure at selectedMeasureNumber
                      const durationIdToSelect = measures.find(
                        (measure) =>
                          measure.id ===
                          tracks[trackNumberToSelect].measures[
                            selectedMeasureNumber
                          ]
                      ).durations[0];

                      dispatchApp({
                        type: actionTypes.SELECT_TRACK,
                        trackNumber: trackNumberToSelect,
                      });
                      dispatchApp({
                        type: actionTypes.SELECT_DURATION,
                        durationId: durationIdToSelect,
                      });
                    }}
                  >
                    {tracks.map((track, trackNumber) => (
                      <option value={trackNumber} key={trackNumber}>{`${
                        trackNumber + 1
                      }. ${track.fullName}`}</option>
                    ))}
                  </select>
                  <button
                    className="LCD__Control LCD__Control--CountIn"
                    title="Activate/Deactivate count-in"
                  >
                    <Emoji symbol="⌛️" />
                  </button>
                  <button
                    className="LCD__Control LCD__Control--Metronome"
                    title="Activate/Deactivate metronome"
                  >
                    <Emoji symbol="⏲" />
                  </button>
                  <button
                    className="LCD__Control LCD__Control--MetronomeSettings"
                    title="Metronome & Count-in settings"
                  >
                    <Emoji symbol="🍡" />
                  </button>
                  <div
                    className="LCD__Control LCD__Control--PitchAtCursor LCD__Control--NoHover"
                    title="Note on the cursor"
                  >
                    <PitchAtCursor />
                  </div>
                  {/* TODO Click to open "Go to" modal */}
                  <button
                    className="LCD__Control LCD__Control--BarPosition"
                    title="Bar position"
                  >
                    {selectedMeasureNumber + 1}/
                    {tracks.length
                      ? tracks[selectedTrackNumber].measures.length
                      : 0}
                  </button>
                  <button
                    className="LCD__Control LCD__Control--BarCurrentDuration"
                    title="Bar current duration"
                  >
                    {renderBarCurrentDuration()}
                  </button>
                  <div
                    className="LCD__Control LCD__Control--Time LCD__Control--NoHover"
                    title="Time"
                  >
                    00:00 / 00:00
                  </div>
                  <button
                    className="LCD__Control LCD__Control--TripletFeel"
                    title="No triplet feel"
                  >
                    <Emoji symbol="🎶" />
                  </button>
                  <button
                    className="LCD__Control LCD__Control--Tempo"
                    title="Current tempo"
                  >
                    d = 120
                  </button>
                  <button
                    className="LCD__Control LCD__Control--TimeSignature"
                    title="Time signature"
                  >
                    4/4
                  </button>
                  <input
                    type="range"
                    name="time"
                    id="time"
                    className="LCD__Control LCD__Control--TimeScrubber"
                  />
                </div>
                <div className="ToolBar__ButtonContainer ToolBar__ButtonContainer--LoopAndPlaybackSettings">
                  <button title="Enable loop">
                    <Emoji symbol="🔁" />
                  </button>
                  <button title="Relative speed">
                    <Emoji symbol="🎵" /> 100%
                  </button>
                </div>
                <div className="ToolBar__ButtonContainer ToolBar__ButtonContainer--GlobalTonality">
                  <button title="Enable/Disable relative tonality">
                    <Emoji symbol="🍴" /> 0
                  </button>
                </div>
              </div>
              <div className="ToolBar__Group ToolBar__Group--Right">
                <div className="ToolBar__ButtonContainer ToolBar__ButtonContainer--InstrumentViews">
                  <button title="Show/Hide Fretboard View">
                    <Emoji symbol="🎸" />
                  </button>
                  <button title="Show/Hide Keyboard View">
                    <Emoji symbol="🎹" />
                  </button>
                  <button title="Show/Hide Virtual Drum Kit">
                    <Emoji symbol="🥁" />
                  </button>
                </div>
                <div className="ToolBar__ButtonContainer ToolBar__ButtonContainer--Listeners">
                  <button title="Tuner">
                    <Emoji symbol="🔔" />
                  </button>
                  <button title="Line-in">
                    <Emoji symbol="🔌" />
                  </button>
                </div>
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
              {isEditionPaletteShown && (
                <EditionPalette selectedDuration={selectedDuration} />
              )}
              <Workspace
                documentTitle={documentTitle}
                documentArtist={documentArtist}
                selectedTrackNumber={selectedTrackNumber}
                selectedMeasureNumber={selectedMeasureNumber}
                selectedDurationId={selectedDurationId}
                selectedStringNumber={selectedStringNumber}
              />
              {isInspectorShown && (
                <Inspector
                  setDocumentTitle={setDocumentTitle}
                  setDocumentArtist={setDocumentArtist}
                />
              )}
            </div>
            {isGlobalViewShown && (
              <GlobalView
                selectedTrackNumber={selectedTrackNumber}
                selectedMeasureNumber={selectedMeasureNumber}
                selectedDurationId={selectedDurationId}
                openAddTrackModal={() => setShowAddTrackModal(true)}
              />
            )}
          </div>
          <AddTrackModal
            show={showAddTrackModal}
            onClose={(modalResult) => {
              setShowAddTrackModal(false);

              if (modalResult) {
                const { durationIdToSelect } = dispatchAddTrack(modalResult);

                dispatchApp({
                  type: actionTypes.SELECT_TRACK,
                  trackNumber: tracks.length,
                });
                dispatchApp({
                  type: actionTypes.SELECT_DURATION,
                  durationId: durationIdToSelect,
                });
              }
            }}
          />
          <DeleteTrackModal
            show={showDeleteTrackModal}
            nameOfTrackToDelete={selectedTrack?.fullName}
            onClose={(modalResult) => {
              setShowDeleteTrackModal(false);

              if (modalResult) {
                dispatchDeleteTrack();
              }
            }}
          />
        </div>
      </DispatchContext.Provider>
    </AppStateContext.Provider>
  );
};

export default App;
