import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {useNetInfo} from '@react-native-community/netinfo';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider as LanguageProvider} from 'context/reducer';
import AppIndex from 'App';
import {NetworkErrorScreen} from 'screens';
import {QueryClientProvider} from '@tanstack/react-query';
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from 'i18n/locales/en.json';
import ar from 'i18n/locales/ar.json';
import {readLanguage, readAccessToken, readLocalCurrencies} from 'constants';
import {UserProvider} from 'context/UserContext';
import {
  setAxiosAccessToken,
  setAxiosCurrencyId,
  setAxiosLanguage,
} from 'axiosConfig';
import {ScreenProvider} from 'context/ScreenContext';
import {WishlistProvider} from 'context/WishlistContext';
import queryClient from 'queryClient';

const resources = {
  en: {
    translation: en,
  },
  ar: {
    translation: ar,
  },
};

export default function App() {
  const {isConnected} = useNetInfo();
  const [isAr, setIsAr] = useState<boolean>(false);
  useEffect(() => {
    readAccessToken().then(accessToken => {
      if (accessToken) {
        setAxiosAccessToken(accessToken);
      }
    });
    readLocalCurrencies().then((currencyId: any) => {
      if (currencyId) {
        setAxiosCurrencyId(currencyId);
      }
    });
    readLanguage().then((res: string | null) => {
      setAxiosLanguage(res || '2');
      setIsAr(res === '2' ? true : false);
      i18n.use(initReactI18next).init({
        lng: res === '2' ? 'ar' : 'en',
        resources,
        fallbackLng: 'en', // use en if detected lng is not available
        interpolation: {
          escapeValue: false, // react already safes from xss
        },
        supportedLngs: Object.keys(resources),
        compatibilityJSON: 'v3',
        react: {
          useSuspense: false,
        },
      });
    });
  }, []);

  console.log({isConnected});
  if (!isConnected) {
    return (
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <NetworkErrorScreen />
        </SafeAreaProvider>
      </QueryClientProvider>
    );
  }

  return (
    <View style={[styles.container, {direction: isAr ? 'rtl' : 'ltr'}]}>
      <ScreenProvider>
        {/* remove user provider */}
        <UserProvider>
          <WishlistProvider>
            {/* check language provider  */}
            <LanguageProvider>
              <QueryClientProvider client={queryClient}>
                <AppIndex />
              </QueryClientProvider>
            </LanguageProvider>
          </WishlistProvider>
        </UserProvider>
      </ScreenProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
