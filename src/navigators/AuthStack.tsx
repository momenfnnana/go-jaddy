import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {LoginScreen, OnboardingScreen} from 'screens';
import {AuthRoutes} from './RoutesTypes';

const Stack = createNativeStackNavigator<AuthRoutes>();
const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName="Onboarding">
      <Stack.Screen component={OnboardingScreen} name="Onboarding" />
      <Stack.Screen component={LoginScreen} name="Login" />
    </Stack.Navigator>
  );
};

export default AuthStack;
