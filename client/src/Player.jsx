import React, { useContext, useState } from 'react';
import SpotifyPlayer from 'react-spotify-web-playback';
import { AuthContext } from './useAuth';

// eslint-disable-next-line react/prop-types, no-unused-vars
function Player({ track, setTrackByUri }) {
  const { accessToken } = useContext(AuthContext).tokens;

  const [playing, setPlaying] = useState(false);

  // eslint-disable-next-line react/prop-types
  const uri = track?.uri;

  return (
    <SpotifyPlayer
      token={accessToken}
      showSaveIcon
      callback={(state) => {
        console.log(uri, state.track.uri);
        if (!state.isPlaying) return;

        /* if (state.track.uri === uri) return */
        setTrackByUri(state.track.uri.split(':')[2]);
        setPlaying(state.isPlaying);
        // eslint-disable-next-line no-console
        // console.log('Playing:', state);
      }}
      play={!playing}
      uris={uri ? [uri] : []}
    />
  );
}

export default React.memo(Player);
