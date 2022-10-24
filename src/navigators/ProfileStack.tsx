import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import {
  CustomerPointsScreen,
  PreviousTitlesScreen,
  ProfileScreen,
  ReturnProductsScreen,
  WishListScreen,
} from 'screens';
import {colors, font} from 'theme';
import {ProfileRoutes} from './RoutesTypes';
import {DropDownProvider} from 'context/dropdownContext';

const Stack = createNativeStackNavigator<ProfileRoutes>();

const ProfileStack = () => {
  const {t} = useTranslation();
  return (
    <DropDownProvider>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {backgroundColor: colors.primary},
          headerTitleStyle: {fontFamily: font.regular, color: colors.white},
          headerBackTitleVisible: false,
          headerTitleAlign: 'center',
        }}>
        <Stack.Screen
          component={ProfileScreen}
          name="Profile"
          options={{
            headerTitle: t('screens-tabs.profile'),
          }}
        />
        <Stack.Screen
          component={WishListScreen}
          name="WishList"
          options={{
            headerTitle: t('wishlist.title'),
          }}
        />
        <Stack.Screen
          component={PreviousTitlesScreen}
          name="PreviousTitles"
          options={{
            headerTitle: t('previousTitles.titleHeader'),
          }}
        />
        <Stack.Screen
          component={ReturnProductsScreen}
          name="ReturnProducts"
          options={{
            headerTitle: t('returnProducts.titleHeader'),
          }}
        />
        <Stack.Screen
          component={CustomerPointsScreen}
          name="CustomerPoints"
          options={{
            headerTitle: t('customerPoints.titleHeader'),
          }}
        />
      </Stack.Navigator>
    </DropDownProvider>
  );
};

export default ProfileStack;
