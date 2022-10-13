import React, {useContext, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthStack, HomeStack} from 'navigators';
import {MainNavigator} from 'navigators/RoutesTypes';
import {StatusBar, StyleSheet, useWindowDimensions} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Loader} from 'components';
import {UserContext} from 'context/UserContext';
import {useQuery} from '@tanstack/react-query';
import {getCurrencies, getSettings} from 'services/Auth';

const Stack = createNativeStackNavigator<MainNavigator>();
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const {accessToken, setSettings} = useContext(UserContext);
  const {height, width} = useWindowDimensions();
  const {
    data,
    isSuccess,
    isLoading: isLoadingSettings,
  } = useQuery(['settings'], getSettings);
  const {data: currenciesData, isLoading: isLoadingCurrencies} = useQuery(
    ['currencies'],
    getCurrencies,
  );
  useEffect(() => {
    (async () => {
      const accessToken = await AsyncStorage.getItem('accessToken');
      accessToken ? setIsLoggedIn(true) : setIsLoggedIn(false);
      setLoading(false);
    })();
  }, [accessToken]);
  useEffect(() => {
    if (currenciesData?.data?.Currencies?.length) {
      AsyncStorage.setItem(
        'currency',
        JSON.stringify(currenciesData?.data?.Currencies[0]),
      );
    }
  }, [currenciesData]);

  useEffect(() => {
    isSuccess && setSettings(data.data);
  }, [isSuccess]);

  useEffect(() => {
    if (currenciesData?.data?.Currencies?.length && data?.data) {
      AsyncStorage.setItem(
        'currency',
        JSON.stringify(currenciesData?.data?.Currencies[0]),
      );
    }
  }, [currenciesData, data?.data]);

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
