import React, { useContext } from 'react';
import SpotifyPlayer from 'react-spotify-web-playback';
import { AuthContext } from './useAuth';

// eslint-disable-next-line react/prop-types
function Player({ track, setTrackByUri }) {
  const { accessToken } = useContext(AuthContext).tokens;

  // eslint-disable-next-line react/prop-types
  const uri = track?.uri;

  return (
    <SpotifyPlayer
      token={accessToken}
      showSaveIcon
      callback={(state) => {
        if (!state.isPlaying) return;
        if (state.track.uri === uri) return;
        // console.log('Playing:', state.track.name);
        setTrackByUri(state.track.uri);
        // eslint-disable-next-line no-console
        // console.log('Playing:', state);
      }}
      play={!!uri}
      uris={uri ? [uri] : []}
    />
  );
}

export default React.memo(Player);
