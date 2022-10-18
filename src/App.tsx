import React, {useContext, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthStack, HomeStack} from 'navigators';
import {MainNavigator} from 'navigators/RoutesTypes';
import {StatusBar, StyleSheet, useWindowDimensions} from 'react-native';
import {Loader} from 'components';
import {UserContext} from 'context/UserContext';
import {useQuery} from '@tanstack/react-query';
import {getCurrencies, getSettings} from 'services/Auth';
import {changeLocalCurrencies, readAccessToken} from 'constants';
import {setAxiosCurrencyId} from 'axiosConfig';

const Stack = createNativeStackNavigator<MainNavigator>();
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const {accessToken, setSettings, setCurrencies} = useContext(UserContext);
  const {height, width} = useWindowDimensions();
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
  useEffect(() => {
    readAccessToken().then(res => {
      res ? setIsLoggedIn(true) : setIsLoggedIn(false);
      setLoading(false);
    });
  }, [accessToken]);

  useEffect(() => {
    if (isSuccessLoadingCurrencies === true) {
      setCurrencies(currenciesData?.data?.Currencies);
      setAxiosCurrencyId(currenciesData?.data?.Currencies[0]?.Id);
      changeLocalCurrencies(currenciesData?.data?.Currencies[0]);
    }
  }, [isSuccessLoadingCurrencies]);

  useEffect(() => {
    isSuccess && setSettings(data.data);
  }, [isSuccess]);

  if (loading || isLoadingCurrencies || isLoadingSettings) {
    return (
      <Loader
        size={'large'}
        containerStyle={[styles.loader, {height, width}]}
      />
    );
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" />
      <Stack.Navigator
        initialRouteName={isLoggedIn ? 'HomeFlow' : 'AuthFlow'}
        screenOptions={{headerShown: false}}>
        {isLoggedIn ? (
          <Stack.Screen component={HomeStack} name="HomeFlow" />
        ) : (
          <Stack.Screen component={AuthStack} name="AuthFlow" />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  loader: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
