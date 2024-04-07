import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useMemo } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import useAuth, { AuthContext } from './useAuth';

function App() {
  const queryCode = new URLSearchParams(window.location.search).get('code');

  const {
    tokens, expiresIn, authUrl, code, error,
  } = useAuth(queryCode);

  const auth = useMemo(() => ({
    tokens, expiresIn, authUrl, code, error,
  }));

  return (
    <AuthContext.Provider value={auth}>
      {code ? <Dashboard code={code} /> : <Login />}
    </AuthContext.Provider>
  );
}

export default App;
