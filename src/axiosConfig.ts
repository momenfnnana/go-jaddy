import axios from 'axios';
import {readAccessToken} from 'constants';

readAccessToken().then(res => {
  // axios.defaults.headers.common['Authorization'] = `Bearer ${res}`;
  console.log({token: res});
  axios.defaults.headers.common['AccessToken'] = `${res}`;
});
