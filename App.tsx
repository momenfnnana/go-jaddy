import React from 'react';
import {useNetInfo} from '@react-native-community/netinfo';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import AppIndex from './src/App';
import 'i18n';
import {NetworkErrorScreen} from 'screens';

export default function App() {
  const {isConnected} = useNetInfo();

  if (!isConnected) {
    return (
      <SafeAreaProvider>
        <NetworkErrorScreen />
      </SafeAreaProvider>
    );
  }
  return <AppIndex />;
}
