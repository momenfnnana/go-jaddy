import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthStack, HomeStack} from 'navigators';
import {MainNavigator} from 'navigators/RoutesTypes';
import {StatusBar, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Loader} from 'components';

const Stack = createNativeStackNavigator<MainNavigator>();
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    (async () => {
      const accessToken = await AsyncStorage.getItem('accessToken');
      accessToken ? setIsLoggedIn(true) : setIsLoggedIn(false);
      setLoading(false);
    })();
  }, []);
  if (loading) {
    return <Loader style={styles.loader} />;
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" />
      <Stack.Navigator
        initialRouteName={isLoggedIn ? 'HomeFlow' : 'AuthFlow'}
        screenOptions={{headerShown: false}}>
        <Stack.Screen component={HomeStack} name="HomeFlow" />
        <Stack.Screen component={AuthStack} name="AuthFlow" />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
