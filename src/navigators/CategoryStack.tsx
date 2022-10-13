import {useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AdidasIcon} from 'assets/icons';
import {Text} from 'components';
import ArrowIcon from 'components/Arrow';
import React from 'react';
import {Pressable, useWindowDimensions, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {CategoriesScreen} from 'screens';
import Categories from 'screens/main/Categories';
import CategoryDetails from 'screens/main/CategoryDetails';
import {colors, font, spacing} from 'theme';
import {CategotyRoutes} from './RoutesTypes';

const Stack = createNativeStackNavigator<CategotyRoutes>();

const CategoriesStack = () => {
  const {top} = useSafeAreaInsets();
  return (
    <Stack.Navigator
      initialRouteName="Categories"
      screenOptions={{
        headerStyle: {backgroundColor: colors.primary},
        headerTitleStyle: {fontFamily: font.regular, color: colors.white},
      }}>
      <Stack.Screen component={Categories} name="Categories" />
      <Stack.Screen
        component={CategoryDetails}
        name="CategoryDetails"
        initialParams={{title: '', id: -1}}
      />
    </Stack.Navigator>
  );
};

export default CategoriesStack;
