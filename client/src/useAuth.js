/* eslint-disable no-unused-vars */
import { createContext, useEffect, useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import axios from 'axios';

function useAuth(queryCode) {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [expiresIn, setExpiresIn] = useState(null);
  const [authUrl, setAuthUrl] = useState(null);
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
      await axios.get('http://localhost:3001/login').then((res) => {
        const { redirectUrl } = res.data;

        // Simulate loading for 2 seconds
        // setTimeout(() => {
        // }, 2000);

        console.log(`retrieved spotify authorize url ${redirectUrl}`);
        setAuthUrl(redirectUrl);
      });
    }
    getAuthUrl();
  }, []);

  // exchange code for access token
  useEffect(() => {
    // if code is not present or access token is already present, return
    // might cause issues down the line but I'll figure it out
    if (!code || accessToken) return;
    axios
      .post('http://localhost:3001/login', {
        code,
      })
      .then((res) => {
        setAccessToken(res.data.access_token);
        setRefreshToken(res.data.refresh_token);
        setExpiresIn(res.data.expires_in);
        window.history.pushState({}, null, '/');
      }).catch((err) => {
        console.log(err);
        window.location = '/';
      });
  }, [code]);

  useEffect(() => {
    if (!refreshToken || !expiresIn) return undefined;
    const refreshInterval = setInterval(() => {
      console.log('refreshing token: ', refreshToken);
      axios
        .post('http://localhost:3001/refresh', {
          refresh_token: refreshToken,
        }).then((res) => {
          setAccessToken(res.data.access_token);
          setExpiresIn(res.data.expires_in);
        });
    }, (expiresIn - 60) * 1000); // refresh token 60 seconds before it expires

    // cleanup function
    return () => clearInterval(refreshInterval);
  }, [refreshToken, expiresIn]);

  return {
    accessToken,
    refreshToken,
    expiresIn,
    authUrl,
    code,
  };
}

export const AuthContext = createContext();

export default useAuth;
