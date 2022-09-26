import {CHANGE_LANGUAGE} from './apiTypes';

export const changeLanguage = dispatch => data => {
  dispatch({
    type: CHANGE_LANGUAGE,
    value: data,
  });
};
