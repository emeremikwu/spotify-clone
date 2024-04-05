/* eslint-disable no-unused-vars */
import { createContext, useEffect, useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import axios from 'axios';

function useAuth(code) {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [expiresIn, setExpiresIn] = useState(null);
  const [authUrl, setAuthUrl] = useState(null);

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
    if (!code) return;
    axios.post('http://localhost:3001/login', {
      code,
    }).then((res) => {
      setAccessToken(res.data.access_token);
      setRefreshToken(res.data.refresh_token);
      setExpiresIn(res.data.expires_in);
      // window.history.pushState({}, null, '/');
    }).catch((err) => {
      console.log(err);
      window.location = '/';
    });
  }, [code]);

  // useEffect(() => {

  // }, [refreshToken, expiresIn]);

  /* if (!authUrl) {
    // eslint-disable-next-line no-promise-executor-return

    // Simulate loading for 2 seconds
    throw new Promise((resolve) => { setTimeout(resolve, 2000); console.log('loading...'); });
  } */

  return {
    accessToken,
    refreshToken,
    expiresIn,
    authUrl,
  };
}

export const AuthContext = createContext();

export default useAuth;
