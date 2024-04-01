/* eslint-disable camelcase */
import React from 'react';
import Container from 'react-bootstrap/Container';

const client_id = '3cba2013d88445e998cec4dbefb580e6';
const response_type = 'code';
const redirect_uri = 'http://localhost:3000/';
const scope = 'user-read-private user-read-email user-library-read user-library-modify user-read-playback-state user-modify-playback-state user-read-playback-position';

const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const AUTH_QUERY = new URLSearchParams({
  response_type,
  client_id,
  scope,
  redirect_uri,
});

const authUrl = `${AUTH_ENDPOINT}?${AUTH_QUERY}`;

function Login() {
  return (
    <Container
      className="d-flex justify-content-center align-items-center "
      style={{ minHeight: '100vh' }}
    >
      <a
        className="btn btn-outline-success btn-lg"
        href={authUrl}
      >
        Login with spotify
      </a>
    </Container>

  );
}

export default Login;
