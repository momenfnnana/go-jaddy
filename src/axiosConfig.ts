import axios from 'axios';
import {showErrorMessage} from 'helpers';
import * as RootNavigation from 'navigators/RootNavigation';
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
    if (error?.response?.status === 401) {
      return RootNavigation.navigate('AuthFlow', {screen: 'Login'} as any);
    }
    showErrorMessage(error?.response?.data?.Message);
    throw error;
  },
);
