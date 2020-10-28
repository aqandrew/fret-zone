import React from 'react';
import Emoji from 'a11y-react-emoji';
import AppStateContext from '../../AppStateContext';
import { useContext } from 'react';
import { useDocument } from '../../hooks/useDocument';
import { roundDurationLength } from '../../utils';

const BarCurrentDuration = () => {
  const appState = useContext(AppStateContext);
  const {
    tracks,
    measures,
    currentBarDuration,
    currentBarMaximumDuration,
  } = useDocument(appState);

  let barDuration = 0;
  let barMaximumDuration = 1;

  if (tracks.length && measures.length) {
    barDuration = currentBarDuration;
    barMaximumDuration = currentBarMaximumDuration;
  }

  return (
    <button
      className="LCD__Control LCD__Control--BarCurrentDuration"
      title="Bar current duration"
    >
      <Emoji
        symbol={barDuration === barMaximumDuration ? '✅' : '⚠️'}
        className="DurationSymbol"
      />
      {roundDurationLength(barDuration) +
        ':' +
        roundDurationLength(barMaximumDuration)}
    </button>
  );
};

export default BarCurrentDuration;
