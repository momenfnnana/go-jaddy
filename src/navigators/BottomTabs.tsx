import React, {useCallback} from 'react';
import {CartScreen} from 'screens';
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
import StoresStack from './StoresStack';
import ProfileStack from './ProfileStack';
import CartStack from './CartStack';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';

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
      screenOptions={({route}) => ({
        tabBarActiveTintColor: colors.danger,
        tabBarInactiveTintColor: colors.gray[800],
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: {fontFamily: font.regular},
        headerShown: false,
        tabBarStyle: (route => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? '';
          if (routeName === 'FiltersScreen') {
            return {display: 'none'};
          }
          return;
        })(route),
      })}>
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          tabBarIcon: ({focused}) => (
            <HomeIcon stroke={getColor(focused)} fill={getColor(focused)} />
          ),
          title: t('screens-tabs.home'),
        }}
      />
      <Tab.Screen
        component={CategoriesStack}
        name="CategoriesStack"
        options={{
          tabBarIcon: ({focused}) => (
            <CategoriesIcon stroke={getColor(focused)} />
          ),
          title: t('screens-tabs.categories'),
        }}
      />
      <Tab.Screen
        component={StoresStack}
        name="StoresStack"
        options={{
          tabBarIcon: ({focused}) => <StoresIcon stroke={getColor(focused)} />,
          title: t('screens-tabs.stores'),
        }}
      />
      <Tab.Screen
        component={CartStack}
        name="Cart"
        options={{
          tabBarIcon: ({focused}) => <CartIcon stroke={getColor(focused)} />,
          title: t('screens-tabs.cart'),
        }}
      />
      <Tab.Screen
        component={ProfileStack}
        name="Profile"
        options={{
          tabBarIcon: ({focused}) => <ProfileIcon stroke={getColor(focused)} />,
          title: t('screens-tabs.profile'),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;
