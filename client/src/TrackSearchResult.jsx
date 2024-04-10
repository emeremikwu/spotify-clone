/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/prop-types */
import React from 'react';

function TrackSearchResult({ track, chooseTrack }) {
  function handlePlay() {
    // eslint-disable-next-line no-console
    chooseTrack(track);
  }

  return (
    <div
      className="d-flex m-2 align-items-center"
      style={{ cursor: 'pointer' }}
      onClick={handlePlay}
      role="button"
    >
      <img src={track.albumUri} style={{ height: '64px', width: '64px' }} alt="album" />
      <div className="m-3">
        <div>{track.title}</div>
        <div className="text-muted">{track.artist.name}</div>
      </div>
    </div>
  );
}

export default TrackSearchResult;
