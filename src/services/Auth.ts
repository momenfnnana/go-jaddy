import axios from 'axios';
import {BASE_URL} from 'utils/Axios';

export const getSettings = () => {
  return axios.get(`${BASE_URL}/api/custom/settings`);
};

export const getCurrencies = () => {
  return axios.get(`${BASE_URL}/api/custom/currencies`);
};

export const doLogin_service = (data: any) => {
  return axios.post(`${BASE_URL}/api/custom/account/login`, data);
};

export const reset_password = (data: any) => {
  return axios.post(`${BASE_URL}/api/custom/account/ResetPassword`, data);
};

export const postChangePassword = (data: any) => {
  return axios.post(`${BASE_URL}/api/custom/account/ResetPassword`, data);
};

export const verificationCode = (params: any) =>
  axios.get(`${BASE_URL}/api/custom/account/CreateAccountVerification`, {
    params,
  });

export const getLanguages = () => axios.get(`${BASE_URL}/api/custom/languages`);
