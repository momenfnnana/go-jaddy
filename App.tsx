import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthStack, HomeStack} from 'navigators';
import {AuthRoutes, HomeRoutes} from 'navigators/RoutesTypes';
import 'i18n';

type MainNavigator = HomeRoutes & AuthRoutes;
const Stack = createNativeStackNavigator<MainNavigator>();

export default function App() {
  const token = true;
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={token ? 'Home' : 'Login'}
        screenOptions={{headerShown: false}}>
        <Stack.Screen component={HomeStack} name="Home" />
        <Stack.Screen component={AuthStack} name="Login" />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
