import React, {useContext, useEffect} from 'react';
import {NavigationContainer, useTheme} from '@react-navigation/native';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from 'react-native';
import {Loader, ToastMessage} from 'components';
import {UserContext} from 'context/UserContext';
import {useQuery} from '@tanstack/react-query';
import {getCurrencies, getSettings} from 'services/Auth';
import {changeLocalCurrencies} from './constants';
import {navigationRef} from 'navigators/RootNavigation';
import RootStack from 'navigators/RootStack';
import {ToastProvider} from 'react-native-toast-notifications';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {Settings} from 'react-native-fbsdk-next';
import RNBootSplash from 'react-native-bootsplash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getUserData} from 'services/Profile';

const App = () => {
  const {setSettings, setCurrencies, setUserData} = useContext(UserContext);
  const {height, width} = useWindowDimensions();
  const {colors, dark} = useTheme();
  const {
    data,
    isSuccess,
    isLoading: isLoadingSettings,
  } = useQuery(['settings'], getSettings);
  const {
    data: currenciesData,
    isLoading: isLoadingCurrencies,
    isSuccess: isSuccessLoadingCurrencies,
  } = useQuery(['currencies'], getCurrencies);
  const {isLoading: isLoadingUserData} = useQuery(
    ['getUserData'],
    getUserData,
    {
      onSuccess: data => {
        setUserData(data.data);
        return data;
      },
    },
  );
  useEffect(() => {
    if (isSuccessLoadingCurrencies === true) {
      setCurrencies(currenciesData?.data?.Currencies);
      AsyncStorage.getItem('currency').then((currency: any) => {
        if (currency) {
          const selectedCurrency = JSON.parse(currency);
          changeLocalCurrencies(selectedCurrency);
        } else {
          changeLocalCurrencies(currenciesData?.data?.Currencies[0]);
        }
      });
    }
  }, [isSuccessLoadingCurrencies]);

  useEffect(() => {
    isSuccess && setSettings(data.data);
  }, [isSuccess]);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '891150166102-6a5eh10b4b9i40hco8imbknesocp7k1h.apps.googleusercontent.com',
    });
    Settings.setAppID('535934555056398');
    Settings.initializeSDK();
  }, []);

  if (isLoadingCurrencies || isLoadingSettings || isLoadingUserData) {
    return (
      <Loader
        size={'large'}
        containerStyle={[styles.loader, {height, width}]}
      />
    );
  }

  return (
    <TouchableWithoutFeedback
      style={{flex: 1}}
      onPress={() => Keyboard.dismiss()}>
      <NavigationContainer
        theme={{colors: {...colors, background: '#F5F5F5'}, dark}}
        ref={navigationRef}
        onReady={() => RNBootSplash.hide({fade: true})}>
        <ToastProvider
          placement="top"
          renderToast={toast => <ToastMessage {...toast} />}>
          <StatusBar barStyle="light-content" />
          <KeyboardAvoidingView
            style={{flex: 1}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <RootStack />
          </KeyboardAvoidingView>
        </ToastProvider>
      </NavigationContainer>
    </TouchableWithoutFeedback>
  );
};

export default App;

const styles = StyleSheet.create({
  loader: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
