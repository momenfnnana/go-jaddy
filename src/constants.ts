import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const FLOATING_ACTIONS_MENU_PORTAL = 'FLOATING_ACTIONS_MENU_PORTAL';

export const BOOKING_STATUS_COMPLETE = 3;

export const readLanguage = async () => {
  const languageId = await AsyncStorage.getItem('languageId');
  return languageId;
};

export const readAccessToken = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  return token;
};

export const changeLocalCurrencies = async (currency: any) => {
  await AsyncStorage.setItem('currency', JSON.stringify(currency));
  axios.defaults.headers.common['CurrencyId'] = (currency as any).Id;
};

export const readLocalCurrencies = async () => {
  const currencySelected = await AsyncStorage.getItem('currency');
  return JSON.parse(currencySelected as any).Id;
};
