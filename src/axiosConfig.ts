import axios from 'axios';
import {showErrorMessage} from 'helpers';
import * as RootNavigation from 'navigators/RootNavigation';
// import Snackbar from 'react-native-snackbar';
import {colors} from 'theme';

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
  response => {
    if (response.status == 200 && response.data.Message) {
      // Snackbar.show({
      //   text: response.data.Message,
      //   duration: Snackbar.LENGTH_SHORT,
      //   backgroundColor: colors.success,
      // });
    }
    return response;
  },
  error => {
    if (error?.response?.status === 401) {
      // return RootNavigation.navigate('AuthFlow', {screen: 'Login'} as any);
    }
    showErrorMessage(error?.response?.data?.Message);
    throw error;
  },
);
