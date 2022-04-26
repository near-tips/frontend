import axios from 'axios';
import queryString from 'query-string';

export const loginWithStackOverflow = (redirectUrl) => {
  window.open(`https://stackoverflow.com/oauth/dialog?client_id=${process.env.REACT_APP_STACKOVERFLOW_CLIENT_ID}&scope=&redirect_uri=${redirectUrl}`, "_self");
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
  return axios(`https://api.stackexchange.com/2.3/me?site=stackoverflow&access_token=${accessToken}&key=${process.env.REACT_APP_STACKOVERFLOW_API_KEY}`);
}
