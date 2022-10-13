import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import {ProfileScreen} from 'screens';
import {colors, font} from 'theme';
import {ProfileRoutes} from './RoutesTypes';

const Stack = createNativeStackNavigator<ProfileRoutes>();

const ProfileStack = () => {
  const {t} = useTranslation();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: colors.primary},
        headerTitleStyle: {fontFamily: font.regular, color: colors.white},
        headerTitle: t('screens-tabs.profile'),
      }}>
      <Stack.Screen
        component={ProfileScreen}
        name="Profile"
        initialParams={{userId: '0'}}
      />
    </Stack.Navigator>
  );
};

export default ProfileStack;
