import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {useNetInfo} from '@react-native-community/netinfo';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider as LanguageProvider} from 'context/reducer';
import AppIndex from 'App';
import {NetworkErrorScreen} from 'screens';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {AuthProvider} from 'context/AuthProvider';
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from 'i18n/locales/en.json';
import ar from 'i18n/locales/ar.json';
import {readLanguage} from 'constants';
import {UserProvider} from 'context/UserContext';
import 'axiosConfig';

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
  const queryClient = new QueryClient();
  const [isAr, setIsAr] = useState<boolean>(false);
  useEffect(() => {
    readLanguage().then((res: string | null) => {
      setIsAr(res === 'ar' ? true : false);
      i18n.use(initReactI18next).init({
        lng: res || 'ar',
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
  if (!isConnected) {
    return (
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <NetworkErrorScreen />
        </SafeAreaProvider>
      </QueryClientProvider>
    );
  }

  if (isConnected)
    return (
      <View style={[styles.container, {direction: isAr ? 'rtl' : 'ltr'}]}>
        <UserProvider>
          <LanguageProvider>
            <AuthProvider>
              <QueryClientProvider client={queryClient}>
                <AppIndex />
              </QueryClientProvider>
            </AuthProvider>
          </LanguageProvider>
        </UserProvider>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
