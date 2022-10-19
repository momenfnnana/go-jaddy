import axios from 'axios';
import {showErrorMessage} from 'helpers';

export const setAxiosLanguage = (languageId: string) => {
  axios.defaults.headers.common['LanguageId'] = languageId;
};
export const setAxiosAccessToken = (accessToken: string) => {
  axios.defaults.headers.common['AccessToken'] = accessToken;
};
export const setAxiosCurrencyId = (CurrencyId: number) => {
  axios.defaults.headers.common['CurrencyId'] = CurrencyId;
};

axios.interceptors.response.use(
  response => response,
  error => {
    showErrorMessage(error?.response?.data?.Message);
    throw error;
  },
);
