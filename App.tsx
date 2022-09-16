import * as React from 'react';
import {Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Button} from 'components';
import {OnboardingScreen, LoginScreen} from 'screens';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthStack, HomeStack} from 'navigators';
import {AuthRoutes, HomeRoutes} from 'navigators/RoutesTypes';

function HomeScreen() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Home!</Text>
      <Button />
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Settings!</Text>
    </View>
  );
}
type MainNavigator = HomeRoutes & AuthRoutes;
const Tab = createBottomTabNavigator();
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
