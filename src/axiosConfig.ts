import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {UserContext} from 'context/UserContext';
import {showErrorMessage} from 'helpers';
import {useContext} from 'react';

export const setAxiosLanguage = (languageId: string) => {
  axios.defaults.headers.common['LanguageId'] = languageId;
};
export const setAxiosAccessToken = (accessToken: string) => {
  axios.defaults.headers.common['AccessToken'] = accessToken;
};

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status == 401) {
      (async () => {
        // const setUserData = UserContext;
        // console.log('enter to clear token');
        // axios.defaults.headers.common['AccessToken'] = '';
        // await AsyncStorage.removeItem('accessToken');
        // setUserData({});
      })();
    }
    showErrorMessage(error?.response?.data?.Message);
    throw error;
  },
);
