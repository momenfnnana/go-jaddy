import React from 'react';
import {useNetInfo} from '@react-native-community/netinfo';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import AppIndex from './src/App';
import 'i18n';
import {NetworkErrorScreen} from 'screens';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

export default function App() {
  const {isConnected} = useNetInfo();
  const queryClient = new QueryClient();

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
    <QueryClientProvider client={queryClient}>
      <AppIndex />
    </QueryClientProvider>
  );
}
