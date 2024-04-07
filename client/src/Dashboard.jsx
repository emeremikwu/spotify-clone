/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import SpotifyWebApi from 'spotify-web-api-node';
import { AuthContext } from './useAuth';
import TrackSearchResult from './TrackSearchResult';

const spotifyWebApi = new SpotifyWebApi();

// eslint-disable-next-line react/prop-types
function Dashboard() {
  const { accessToken, clientId } = useContext(AuthContext).tokens;
  // console.log('d-access:', accessToken);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  console.log(searchResults);

  useEffect(() => {
    if (!accessToken) return;
    spotifyWebApi.setCredentials({ accessToken, clientId });
  }, [accessToken]);

  useEffect(() => () => {
    if (!search) return setSearchResults([]);
    if (!accessToken) return undefined;
    let cancel = false;

    spotifyWebApi.searchTracks(search).then((res) => {
      if (cancel) return;
      setSearchResults(res.body.tracks.items.map((track) => {
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
      }));
    });

    return () => { cancel = true; };
  }, [search, accessToken]);

  return (
    <Container className="d-flex flex-column">
      <Form.Control
        type="search"
        placeholder="Search Songs/Artists"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="flex-grow-1 my-2" style={{ overflowY: 'auto' }}>
        {searchResults.map((track) => (
          <TrackSearchResult track={track} key={track.uri} />
        ))}
      </div>
      <div>Bottom</div>
    </Container>
  );
}

export default Dashboard;
