import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AdidasIcon} from 'assets/icons';
import React from 'react';
import {CategoriesScreen} from 'screens';
import Categories from 'screens/main/Categories';
import {colors} from 'theme';
import {CategotyRoutes} from './RoutesTypes';

const Stack = createNativeStackNavigator<CategotyRoutes>();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        component={Categories}
        name="Categories"
        initialParams={{hasSubCategory: false, id: -1}}
      />
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
    </Stack.Navigator>
  );
};

export default HomeStack;
