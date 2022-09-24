import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthStack, HomeStack} from 'navigators';
import {MainNavigator} from 'navigators/RoutesTypes';
import {StatusBar} from 'react-native';

const Stack = createNativeStackNavigator<MainNavigator>();
const App = () => {
  const token = true;
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" />
      <Stack.Navigator
        initialRouteName={token ? 'HomeFlow' : 'LoginFlow'}
        screenOptions={{headerShown: false}}>
        <Stack.Screen component={HomeStack} name="HomeFlow" />
        <Stack.Screen component={AuthStack} name="LoginFlow" />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
