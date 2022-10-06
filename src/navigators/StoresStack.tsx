import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {StoresScreen} from 'screens';
import Categories from 'screens/main/Categories';
import CategoryDetails from 'screens/main/CategoryDetails';
import {colors, font, spacing} from 'theme';
import {StoresRoutes} from './RoutesTypes';

const Stack = createNativeStackNavigator<StoresRoutes>();

const StoresStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: colors.primary},
        headerTitleStyle: {fontFamily: font.regular, color: colors.white},
      }}>
      <Stack.Screen component={StoresScreen} name="Stores" />
    </Stack.Navigator>
  );
};

export default StoresStack;
