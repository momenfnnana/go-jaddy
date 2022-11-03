import React, {useEffect, useLayoutEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  LoginScreen,
  OnboardingScreen,
  RegisterScreen,
  SplashScreen,
} from 'screens';
import {AuthRoutes} from './RoutesTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {navigate} from './RootNavigation';
import {Loader} from 'components';

const getInitialRoute = async () => {
  const onBoardingActive = await AsyncStorage.getItem('onBoardingActive');
  console.log({onBoardingActive});
  if (onBoardingActive == 'true') {
    return 'Login';
  } else {
    return 'Onboarding';
  }
};
const Stack = createNativeStackNavigator<AuthRoutes>();
const AuthStack = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [initialRoute, setInitialRoute] = useState<string>('Onboarding');
  useLayoutEffect(() => {
    (async () => {
      const onBoardingActive = await AsyncStorage.getItem('onBoardingActive');
      if (onBoardingActive == 'true') {
        setInitialRoute('Login');
      }
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <Loader
        size={'large'}
        containerStyle={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      />
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{headerShown: false}}>
      <Stack.Screen component={OnboardingScreen} name="Onboarding" />
      <Stack.Screen component={LoginScreen} name="Login" />
      <Stack.Screen component={RegisterScreen} name="Register" />
      {/* <Stack.Screen component={SplashScreen} name="Splash" /> */}
    </Stack.Navigator>
  );
};

export default AuthStack;
