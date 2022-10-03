import axios from 'axios';
import {BASE_URL} from 'utils/Axios';

export const createAccount =  (data: any) => {
  return  axios.post(`${BASE_URL}/api/custom/account/register`, data);
};
