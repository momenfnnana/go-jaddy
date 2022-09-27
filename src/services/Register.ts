import axios from 'axios';
import {BASE_URL} from 'utils/Axios';

export const createAccount = async (data: any) => {
  return await axios.post(`${BASE_URL}/api/custom/account/register`, data, {
    headers: {
      'Content-Type': 'multipart/form-data; ',
    },
  });
};
