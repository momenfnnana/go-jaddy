import React, {useEffect} from 'react';
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
  useEffect(() => {
    readLanguage().then((res: string | null) => {
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
  return (
    <UserProvider>
      <LanguageProvider>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <AppIndex />
          </QueryClientProvider>
        </AuthProvider>
      </LanguageProvider>
    </UserProvider>
  );
}
