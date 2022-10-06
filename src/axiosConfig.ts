import axios from 'axios';
import {readAccessToken} from 'constants';

readAccessToken().then(res => {
  if (res) {
    axios.defaults.headers.common['AccessToken'] = `${res}`;
  }
});
