import axios from 'axios';
import queryString from 'query-string';

const STACK_OVERFLOW_APP_KEY = 'sD7FFarm5h8zdip5AAbfxg((';

export const loginWithStackOverflow = (redirectUrl) => {
  window.open(`https://stackoverflow.com/oauth/dialog?client_id=21428&scope=&redirect_uri=${redirectUrl}`, "_self");
}

export const getAccessToken = (hash) => {
  const parsedHash = queryString.parse(hash);

  return {
    accessToken: parsedHash.access_token,
    expiration: parsedHash.expires,
    timeOfRequest: new Date().getTime(),
  }
}

export const fetchUserInfo = (accessToken) => {
  return axios(`https://api.stackexchange.com/2.3/me?site=stackoverflow&access_token=${accessToken}&key=${STACK_OVERFLOW_APP_KEY}`);
}
