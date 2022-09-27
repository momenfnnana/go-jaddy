import axios from 'axios';
import {BASE_URL} from 'utils/Axios';

export const createAccount = async(data: any) => {
  console.log('data in axios: ', data);
  let response;
  try {
    response = await axios.post(`${BASE_URL}/api/custom/account/register`, data);
  } catch (errorReq) {
    console.log({"fdfd":errorReq?.error});
  }
  return response;
};
