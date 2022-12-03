import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import {
  AddAddressScreen,
  CustomerPointsScreen,
  PreviousTitlesScreen,
  ProfileDetailsScreen,
  ProfileScreen,
  ReturnProductsScreen,
  WishListScreen,
  WishlistDetails,
  OrdersListScreen,
  OrdersDetailsScreen,
  ContactUsScreen,
  AboutTheAppScreen,
  AboutTheAppDetails,
  NotificationsScreen,
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
        }}
        initialRouteName="Profile">
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
        <Stack.Screen
          component={AddAddressScreen}
          name="AddAddress"
          options={{
            headerTitle: t('addAddress.titleHeader'),
          }}
        />
        <Stack.Screen
          component={ProfileDetailsScreen}
          name="ProfileDetails"
          options={{
            headerTitle: t('profileDetails.titleHeader'),
          }}
        />
        <Stack.Screen component={WishlistDetails} name="WishlistDetails" />
        <Stack.Screen component={OrdersListScreen} name="OrdersList" />
        <Stack.Screen component={OrdersDetailsScreen} name="OrdersDetails" />
        <Stack.Screen
          options={{headerShown: false}}
          component={ContactUsScreen}
          name="ContactUsScreen"
        />
        <Stack.Screen
          options={{headerShown: false}}
          component={AboutTheAppScreen}
          name="AboutTheAppScreen"
        />
        <Stack.Screen
          options={{headerShown: false}}
          component={AboutTheAppDetails}
          name="AboutTheAppDetails"
        />
        <Stack.Screen
          component={NotificationsScreen}
          name="NotificationsScreen"
          options={{
            headerStyle: {backgroundColor: colors.primary},
            headerTitleStyle: {fontFamily: font.regular, color: colors.white},
            headerBackTitleVisible: false,
            headerTitleAlign: 'center',
            headerShown: true,
            headerTitle: t('profile.notifications'),
          }}
        />
      </Stack.Navigator>
    </DropDownProvider>
  );
};

export default ProfileStack;
