import React, {
  useContext, useEffect, useState, useCallback,
} from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import SpotifyWebApi from 'spotify-web-api-node';
import axios from 'axios';
import { AuthContext } from './useAuth';
import TrackSearchResult from './TrackSearchResult';
import Player from './Player';

const spotifyWebApi = new SpotifyWebApi();

function mapTrack(track) {
  const {
    artists, name, uri, album,
  } = track;

  // get smallest album image
  const smallestAlbumImage = album.images.reduce((currentSmallest, currentAlbum) => {
    // probabaly unnecessary but just in case
    const smallestArea = currentSmallest.width * currentSmallest.height;
    const currentArea = currentAlbum.width * currentAlbum.height;
    return currentArea < smallestArea ? currentAlbum : currentSmallest;
  });

  return {
    artist: artists[0],
    title: name,
    uri,
    albumUri: smallestAlbumImage.url,
  };
}

// eslint-disable-next-line react/prop-types
function Dashboard() {
  const { accessToken, clientId } = useContext(AuthContext).tokens;
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [lyrics, setLyrics] = useState('Search for a song or artist');

  /*
    Sets current track based off of track object
    should be passed to the TrackSearchResult component
    differs from setTrackCallback because its to be used to start playback
   */
  const chooseTrackCallback = useCallback((track) => {
    setCurrentTrack(track);
    setSearch('');
    setLyrics('Loading lyrics...');
  }, []);

  /*
    Sets current track based off of track uri
    Should be passed to the player componen.
    Differes from chooseTrackCallback because its to be used to set the current track
    when the current song is changed by the player (e.g remotely)
  */
  const setTrackByUriCallback = useCallback((trackUri) => {
    spotifyWebApi.getTrack(trackUri).then((res) => {
      setCurrentTrack(mapTrack(res.body));
    });
  }, []);

  // Access Token Setup
  useEffect(() => {
    if (!accessToken) return;
    spotifyWebApi.setCredentials({ accessToken, clientId });
  }, [accessToken]);

  // Search Functionality
  useEffect(() => {
    if (!search) return setSearchResults([]);
    if (!accessToken) return undefined;
    let cancel = false;

    spotifyWebApi.searchTracks(search).then((res) => {
      if (cancel) return;
      setSearchResults(res.body.tracks.items.map((track) => mapTrack(track)));
    });

    return () => { cancel = true; };
  }, [search, accessToken]);

  // Lyrics Retrieval
  useEffect(() => {
    if (!currentTrack) return;
    axios
      .get('http://localhost:3001/lyrics', {
        params: {
          track: currentTrack.title,
          artist: currentTrack.artist.name,
          useGenius: true,
        },
      })
      .then((res) => {
        setLyrics(res.data.lyrics);
      }).catch((err) => {
        console.error(err);
        setLyrics('Error fetching lyrics');
      });
  }, [currentTrack]);

  // Debug: Log the current track when it changes
  useEffect(() => {
    if (!currentTrack) return;
    console.log(`Now Playing: ${currentTrack.title} by ${currentTrack.artist.name}`);
  }, [currentTrack]);

  return (
    <Container className="d-flex flex-column py-2" style={{ height: '100vh' }}>
      <Form.Control
        type="search"
        placeholder="Search Songs/Artists"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="flex-grow-1 my-2" style={{ overflowY: 'auto' }}>
        {searchResults.map((track) => (
          <TrackSearchResult
            track={track}
            key={track.uri}
            chooseTrack={chooseTrackCallback}
          />
        ))}
        {searchResults.length === 0 && (
          <div className="text-center" style={{ whiteSpace: 'pre' }}>
            {lyrics}
          </div>
        )}
      </div>
      <div><Player track={currentTrack} setTrackByUri={setTrackByUriCallback} /></div>
    </Container>
  );
}

export default Dashboard;
