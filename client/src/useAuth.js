/* eslint-disable no-unused-vars */
import { createContext, useEffect, useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import axios from 'axios';

/* const tokenProto = {
  accessToken: null,
  refreshToken: null,
  clientId: null,
};
 */
function useAuth(queryCode) {
  const [tokens, setTokens] = useState({});
  const [expiresIn, setExpiresIn] = useState(null);
  const [authUrl, setAuthUrl] = useState(null);
  const [error, setError] = useState(null);
  // so that code isn't dependent on whats in the query string
  const [code, setCode] = useState(null);

  /*
    - set code the code from query if present
    we need this because we use pushState to remove the code from the url.
    when its removed from the url, the code from the query string is no longer accessible
    this causes app.jsx to rerender <Login /> instead of <Dashboard />
  */
  useEffect(() => {
    if (!queryCode || queryCode.length === 0) return;
    setCode(queryCode);
  }, [queryCode]);

  // retrieve spotify auth url from server
  useEffect(() => {
    // check if code is already present or expired
    async function getAuthUrl() {
      if (tokens.accessToken) return;
      await axios
        .get('http://localhost:3001/login').then((res) => {
          const { redirectUrl } = res.data;

          console.log(`retrieved spotify authorize url ${redirectUrl}`);
          setAuthUrl(redirectUrl);
        }).catch((err) => {
          setError(err);
          console.error(err);
        });
    }
    getAuthUrl();
  }, [tokens]);

  // exchange code for access token
  useEffect(() => {
    // if code is not present or access token is already present, return
    // might cause issues down the line but I'll figure it out
    if (!code || tokens.accessToken) return;
    axios
      .post('http://localhost:3001/login', {
        code,
      })
      .then((res) => {
        setTokens({
          accessToken: res.data.access_token,
          refreshToken: res.data.refresh_token,
          clientId: res.data.client_id,
        });
        setExpiresIn(res.data.expires_in);
        window.history.pushState({}, null, '/');
      }).catch((err) => {
        console.error(err);
        window.location = '/';
      });
  }, [code]);

  useEffect(() => {
    if (!tokens.refreshToken || !expiresIn) return undefined;
    const refreshInterval = setInterval(() => {
      console.log('refreshing token: ', tokens.refreshToken);
      axios
        .post('http://localhost:3001/refresh', {
          refresh_token: tokens.refreshToken,
        }).then((res) => {
          setTokens((prevTokens) => ({
            ...prevTokens, accessToken: res.data.access_tokenoken,
          }));
          setExpiresIn(res.data.expires_in);
        }).catch((err) => {
          console.err(err);
          setError(err);
        });
    }, (expiresIn - 60) * 1000); // refresh token 60 seconds before it expires

    // cleanup function
    return () => clearInterval(refreshInterval);
  }, [tokens, expiresIn]);

  function clearError() {
    setError(null);
  }

  return {
    tokens,
    expiresIn,
    authUrl,
    code,
    error,
    clearError,
  };
}

export const AuthContext = createContext();

export default useAuth;
