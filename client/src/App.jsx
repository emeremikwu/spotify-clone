import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useMemo } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import useAuth, { AuthContext } from './useAuth';

function App() {
  const code = new URLSearchParams(window.location.search).get('code');

  const {
    accessToken, refreshToken, expiresIn, authUrl,
  } = useAuth(code);

  const auth = useMemo(() => ({
    accessToken, refreshToken, expiresIn, authUrl,
  }));

  return (
    <AuthContext.Provider value={auth}>
      {code ? <Dashboard code={code} /> : <Login />}
    </AuthContext.Provider>
  );
}

export default App;
