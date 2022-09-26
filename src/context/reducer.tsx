import {changeLanguage} from './actions';
import {CHANGE_LANGUAGE} from './apiTypes';
import createContext from './createContext';
import {languageId} from './states';

const initialStates = {
  languageId,
};
const actions = {
  changeLanguage,
};

const sharedReducer = (state = initialStates, action) => {
  switch (action.type) {
    case CHANGE_LANGUAGE:
      return {...state, languageId: action.value};
    default:
      return state;
  }
};

export const {Provider, Context} = createContext(
  sharedReducer,
  actions,
  initialStates,
);
