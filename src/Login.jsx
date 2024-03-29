import React from 'react';

import Container from 'react-bootstrap/Container';
// import Button from 'react-bootstrap/Button';

/* const client_id = '3cba2013d88445e998cec4dbefb580e6';
const client_secret = 'ef08cd27f81744e7ba7cfc5130654625'; */

const AUTH_ENDPOINT = 'https://accounts.spotify.com/api/token';

const msg = 'Login with spotify';

function Login() {
  return (
    <Container className="d-flex justify-content-center align-items-center ">
      <a className="btn btn-outline-success btn-lg" href={AUTH_ENDPOINT}>{msg}</a>
    </Container>
  );
}

export default Login;
