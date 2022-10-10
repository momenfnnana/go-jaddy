import axios from 'axios';

export const setAxiosLanguage = (languageId: string) => {
  axios.defaults.headers.common['LanguageId'] = languageId;
};
export const setAxiosAccessToken = (accessToken: string) => {
  axios.defaults.headers.common['AccessToken'] = accessToken;
};
