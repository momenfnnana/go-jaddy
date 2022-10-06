import React, {useCallback} from 'react';
import {CartScreen, ProfileScreen, StoresScreen} from 'screens';
import {BottomTabsRoutes} from './RoutesTypes';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  CartIcon,
  CategoriesIcon,
  HomeIcon,
  ProfileIcon,
  StoresIcon,
} from 'assets/icons';
import {useTranslation} from 'react-i18next';
import {colors, font} from 'theme';
import HomeStack from './HomeStack';
import CategoriesStack from './CategoryStack';

interface IUser {
  id: string;
}
const Tab = createBottomTabNavigator<BottomTabsRoutes>();
const BottomTabs = () => {
  const {t} = useTranslation();
  const user: IUser = {
    id: '1',
  };

  const getColor = useCallback((focused: boolean) => {
    return focused ? colors.danger : colors.tabsColor;
  }, []);

  return (
    <Tab.Navigator
      screenOptions={() => ({
        tabBarActiveTintColor: colors.danger,
        tabBarInactiveTintColor: colors.gray[800],
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: {fontFamily: font.regular},
      })}>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({focused}) => (
            <HomeIcon stroke={getColor(focused)} fill={getColor(focused)} />
          ),
          headerShown: false,
          title: t('screens-tabs.home'),
        }}
      />
      <Tab.Screen
        component={CategoriesStack}
        name="Categories"
        options={{
          tabBarIcon: ({focused}) => (
            <CategoriesIcon stroke={getColor(focused)} />
          ),
          headerShown: false,
          title: t('screens-tabs.categories'),
        }}
      />
      <Tab.Screen
        component={StoresScreen}
        name="Stores"
        options={{
          tabBarIcon: ({focused}) => <StoresIcon stroke={getColor(focused)} />,
          title: t('screens-tabs.stores'),
        }}
      />
      <Tab.Screen
        component={CartScreen}
        name="Cart"
        options={{
          tabBarIcon: ({focused}) => <CartIcon stroke={getColor(focused)} />,
          title: t('screens-tabs.cart'),
        }}
      />
      <Tab.Screen
        component={ProfileScreen}
        name="Profile"
        options={{
          tabBarIcon: ({focused}) => <ProfileIcon stroke={getColor(focused)} />,
          title: t('screens-tabs.profile'),
        }}
        initialParams={{userId: user.id}}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;
