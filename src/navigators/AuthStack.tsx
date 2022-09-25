import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  LoginScreen,
  OnboardingScreen,
  RegisterScreen,
  SplashScreen,
} from 'screens';
import {AuthRoutes} from './RoutesTypes';

const Stack = createNativeStackNavigator<AuthRoutes>();
const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="Register">
      <Stack.Screen component={OnboardingScreen} name="Onboarding" />
      <Stack.Screen component={LoginScreen} name="Login" />
      <Stack.Screen component={RegisterScreen} name="Register" />
      <Stack.Screen component={SplashScreen} name="Splash" />
    </Stack.Navigator>
  );
};

export default AuthStack;
