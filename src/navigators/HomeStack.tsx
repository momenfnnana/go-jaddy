import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AdidasIcon} from 'assets/images';
import CartButton from 'components/CartButton';
import CloseButton from 'components/CloseButton';
import {CartProvider} from 'context/CartContext';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {
  FiltersScreen,
  HomeScreen,
  ProductDetailsScreen,
  SearchScreen,
} from 'screens';
import {colors, font} from 'theme';
import {HomeRoutes} from './RoutesTypes';

const Stack = createNativeStackNavigator<HomeRoutes>();

const HomeStack = () => {
  const {t} = useTranslation();
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
        <Stack.Screen
          options={{
            headerShown: true,
            headerStyle: {backgroundColor: colors.primary},
            headerTitleStyle: {fontFamily: font.regular, color: colors.white},
            headerBackTitleVisible: false,
            headerTitleAlign: 'center',
            headerLeft: () => <CartButton />,
            headerRight: () => <CloseButton />,
          }}
          component={FiltersScreen}
          name="FiltersScreen"
        />
      </Stack.Navigator>
    </CartProvider>
  );
};

export default HomeStack;
