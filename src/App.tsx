import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthStack, HomeStack} from 'navigators';
import {MainNavigator} from 'navigators/RoutesTypes';

const Stack = createNativeStackNavigator<MainNavigator>();
const App = () => {
  const token = false;
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={token ? 'HomeFlow' : 'AuthFlow'}
        screenOptions={{headerShown: false}}>
        <Stack.Screen component={HomeStack} name="HomeFlow" />
        <Stack.Screen component={AuthStack} name="AuthFlow" />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
