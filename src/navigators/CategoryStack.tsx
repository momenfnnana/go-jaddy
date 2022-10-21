import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Categories from 'screens/main/Categories';
import CategoryDetails from 'screens/main/CategoryDetails';
import {colors, font} from 'theme';
import {CategotyRoutes} from './RoutesTypes';

const Stack = createNativeStackNavigator<CategotyRoutes>();

const CategoriesStack = () => {
  const {top} = useSafeAreaInsets();
  const {t} = useTranslation();
  return (
    <Stack.Navigator
      initialRouteName="Categories"
      screenOptions={{
        headerStyle: {backgroundColor: colors.primary},
        headerTitleStyle: {fontFamily: font.regular, color: colors.white},
        headerTitle: t('screens-tabs.categories'),
        headerTitleAlign: 'center',
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
