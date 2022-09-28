import axios from 'axios';
import {BASE_URL} from 'utils/Axios';

export const doLogin_service = (data: any) => {
  return axios.post(`${BASE_URL}/api/custom/account/login`, data);
};

export const reset_password = (data: any) => {
  return axios.post(`${BASE_URL}/api/custom/account/ResetPassword`, data);
};

export const postChangePassword = (data: any) => {
  return axios.post(`${BASE_URL}/api/custom/account/ResetPassword`, data);
};
