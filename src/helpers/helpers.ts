import i18next from 'i18next';
import {Linking, Platform} from 'react-native';
import Snackbar from 'react-native-snackbar';
import {colors} from 'theme';
import * as RootNavigation from 'navigators/RootNavigation';

export const getFullName = (...names: (string | null | undefined)[]) => {
  return names.filter(Boolean).join(' ');
};

export const getDisplayName = (
  firstName: string | undefined,
  lastName: string | undefined,
) => {
  return getFullName(
    firstName,
    lastName?.length ? `${lastName?.[0].toUpperCase()}.` : undefined,
  );
};

export const localizedHeader = (route: string) =>
  i18next.t(`header.${route.toLowerCase()}`);

export const localizedName = (
  object: {nameEn: string; nameEs: string} | undefined | null,
) => {
  return i18next.language === 'es' ? object?.nameEs : object?.nameEn;
};

export const getObjectFromKeyPairArray = (
  array: [{key: string; value: string}],
) => {
  const result: any = {};
  array?.forEach?.(({key, value}) => (result[key] = value));
  return result;
};

export const openMap = (lat: number, lng: number, label: string) => {
  const scheme = Platform.select({ios: 'maps:0,0?q=', android: 'geo:0,0?q='});
  const latLng = `${lat},${lng}`;
  const url = Platform.select({
    ios: `${scheme}${label}@${latLng}`,
    android: `${scheme}${latLng}(${label})`,
  });
  if (url) {
    Linking.openURL(url);
  }
};

export const toastOnError = (error: Error | any) => {
  __DEV__ && console.log('toastOnError: ', error);
  console.log({
    type: 'error',
    text1: error?.message,
    text2: error?.details?.message,
  });
};

export const showErrorMessage = (errorMessage: string) => {
  Snackbar.show({
    text: errorMessage,
    duration: Snackbar.LENGTH_SHORT,
    backgroundColor: colors.red,
  });
};

export const goToLogin = () => {
  RootNavigation.navigate('AuthFlow', {screen: 'Login'} as any);
};
