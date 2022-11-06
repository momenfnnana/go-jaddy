import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {CartScreen, ContinueOrderStepsScreen} from 'screens';
import {colors, font} from 'theme';
import {CartRoutes} from './RoutesTypes';

const Stack = createNativeStackNavigator<CartRoutes>();

const CartStack = () => {
  const {t} = useTranslation();
  return (
    <Stack.Navigator
      initialRouteName="Cart"
      screenOptions={{
        headerStyle: {backgroundColor: colors.primary},
        headerTitleStyle: {fontFamily: font.regular, color: colors.white},
        headerTitle: t('screens-tabs.cart'),
        headerTitleAlign: 'center',
      }}>
      <Stack.Screen component={CartScreen} name="Cart" />
      <Stack.Screen
        options={{headerShown: false}}
        component={ContinueOrderStepsScreen}
        name="ContinueOrderSteps"
      />
    </Stack.Navigator>
  );
};

export default CartStack;
