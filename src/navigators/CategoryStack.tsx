import {useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AdidasIcon} from 'assets/icons';
import ArrowIcon from 'components/Arrow';
import React from 'react';
import {Pressable} from 'react-native';
import {CategoriesScreen} from 'screens';
import Categories from 'screens/main/Categories';
import {colors, font} from 'theme';
import {CategotyRoutes} from './RoutesTypes';

const Stack = createNativeStackNavigator<CategotyRoutes>();

const CategoriesStack = () => {
  const {goBack, reset, getParent} = useNavigation();
  return (
    <Stack.Navigator
      screenOptions={{
        // headerShown: true,
        headerStyle: {backgroundColor: colors.primary},
        headerTitleStyle: {fontFamily: font.regular, color: colors.white},
      }}>
      <Stack.Screen
        component={Categories}
        name="Categories"
        initialParams={{hasSubCategory: false, id: -1}}
      />
    </Stack.Navigator>
  );
};

export default CategoriesStack;
