import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {StoresScreen, StoreDetailsScreen} from 'screens';
import {colors, font} from 'theme';
import {StoresRoutes} from './RoutesTypes';

const Stack = createNativeStackNavigator<StoresRoutes>();

const StoresStack = () => {
  const {t} = useTranslation();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: colors.primary},
        headerTitleStyle: {fontFamily: font.regular, color: colors.white},
        headerTitle: t('screens-tabs.stores'),
        headerTitleAlign: 'center',
      }}>
      <Stack.Screen component={StoresScreen} name="Stores" />
      <Stack.Screen
        options={{headerShown: false}}
        component={StoreDetailsScreen}
        name="StoresDetails"
      />
    </Stack.Navigator>
  );
};

export default StoresStack;
