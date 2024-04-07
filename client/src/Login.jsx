/* eslint-disable camelcase */

import React, { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import { AuthContext } from './useAuth';

function SpinnerComponent() {
  // span element is hidden from accessibility
  return (
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
}

function Login() {
  const { authUrl, error } = useContext(AuthContext);

  return (

    <Container
      className="d-flex justify-content-center align-items-center "
      style={{ minHeight: '100vh' }}
    >
      <a
        className={`btn ${error ? 'btn-outline-danger' : 'btn-outline-success'} btn-lg${authUrl ? '' : ' disabled'}`}
        href={authUrl}
      >
        {error ? 'URL Error' : ''}
        {authUrl ? 'Login With Spotify' : <SpinnerComponent />}
      </a>

    </Container>
  );
}

export default Login;
