import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AdidasIcon} from 'assets/icons';
import {CartProvider} from 'context/CartContext';
import React from 'react';
import {HomeScreen, ProductDetailsScreen, SearchScreen} from 'screens';
import {colors} from 'theme';
import {HomeRoutes} from './RoutesTypes';

const Stack = createNativeStackNavigator<HomeRoutes>();

const HomeStack = () => {
  return (
    <CartProvider>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{headerShown: false}}>
        <Stack.Screen component={HomeScreen} name="Home" />
        <Stack.Screen
          component={ProductDetailsScreen}
          name="ProductDetails"
          initialParams={{
            title: '',
            imageUrl: AdidasIcon,
            isHaveDiscount: false,
            discountValue: '',
            acttualPrice: '',
            prevPrice: '',
            currency: '',
            rate: 0,
            productColors: [colors.orange],
            isNews: false,
            isFav: false,
          }}
        />
        <Stack.Screen component={SearchScreen} name="SearchScreen" />
      </Stack.Navigator>
    </CartProvider>
  );
};

export default HomeStack;
