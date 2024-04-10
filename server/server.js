/* eslint-disable no-console */
/* eslint-disable camelcase */
import 'dotenv/config';
import e from 'express';
import SpotifyWebApi from 'spotify-web-api-node';
import cors from 'cors';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';
import lyricsFinder from 'lyrics-finder';
import { getLyrics } from 'genius-lyrics-api';

const app = e();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* const clientId = '3cba2013d88445e998cec4dbefb580e6';
const clientSecret = '266dcbf007b84b5ab118baf6120643bc';
const redirectUri = 'http://localhost:3000/'; */

const scopes = ['user-read-private', 'user-read-email', 'user-library-read', 'user-library-modify', 'user-read-playback-state', 'user-modify-playback-state', 'user-read-playback-position', 'streaming'];

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

const geniusAvailable = process.env.GENIUS_API_KEY !== undefined;

app.get('/login', (req, res) => {
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes, uuidv4().toString());
  if (authorizeURL === 'undefined' || !authorizeURL) res.sendStatus(400); else res.json({ redirectUrl: authorizeURL });
});

app.post('/login', (req, res) => {
  const { code } = req.body;
  if (code === 'undefined' || !code) {
    console.error('no code provided');
    return res.status(400).send('code is required');
  }

  spotifyApi.authorizationCodeGrant(code)
    .then(
      (data) => {
        console.log('code good');
        spotifyApi.setAccessToken(data.body.access_token);
        spotifyApi.setRefreshToken(data.body.refresh_token);

        res.json({
          access_token: data.body.access_token,
          refresh_token: data.body.refresh_token,
          expires_in: data.body.expires_in,
          clientId: spotifyApi.getClientId(),
        });
      },
      (err) => {
        const errormsg = `${err.body.error}: ${err.body.error_description}`;
        console.error(errormsg);
        return res.status(400).send(errormsg);
      },
    );

  return undefined;
});

app.post('/refresh', (req, res) => {
  const { refresh_token } = req.body;
  spotifyApi.setRefreshToken(refresh_token);

  spotifyApi.refreshAccessToken().then(
    (data) => {
      console.log('The access token has been refreshed!');
      const { access_token, expires_in } = data.body;
      // do we even need this if it will change per request?
      spotifyApi.setAccessToken(access_token);

      res.json({
        access_token,
        expires_in,
        clientId: spotifyApi.getClientId(),
      });
    },
    (err) => {
      const errormsg = `${err.body.error}: ${err.body.error_description}`;
      console.error(errormsg);
      return res.status(400).send(errormsg);
    },
  );
});

app.get('/lyrics', async (req, res) => {
  const { track, artist, useGenius = false } = req.query;
  console.log('Retrieving lyrics for', track, 'by', artist, 'using Genius:', useGenius);

  const fallBack = (await lyricsFinder(artist, track)) || 'No Lyrics Found';

  let lyrics = '';
  if (geniusAvailable && useGenius) {
    const options = {
      apiKey: process.env.GENIUS_API_KEY,
      title: track,
      artist,
      optimizeQuery: true,
    };
    try {
      lyrics = (await getLyrics(options)) || 'No Lyrics Found';
    } catch (err) {
      console.error('Genius Lyrics Retrival Error, could be bad key:', err.message);
      console.error('Falling back to lyrics-finder');
      lyrics = fallBack;
    }
  } else {
    lyrics = fallBack;
  }

  res.json({ lyrics });
});

app.listen(3001);
console.log('Server running on localhost:3001'); // eslint-disable-line no-console
