import React, {useCallback} from 'react';
import {CartScreen, ProfileScreen} from 'screens';
import {BottomTabsRoutes} from './RoutesTypes';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  CartIcon,
  CategoriesIcon,
  HomeIcon,
  ProfileIcon,
  StoresIcon,
} from 'assets/icons';
import {useNavigationOptions} from './NavigationOptions';
import {colors} from 'theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import HomeStack from './HomeStack';
import CategoriesStack from './CategoryStack';
import StoresStack from './StoresStack';

interface IUser {
  id: string;
}
const Tab = createBottomTabNavigator<BottomTabsRoutes>();
const BottomTabs = () => {
  const {headerOptions} = useNavigationOptions();
  const {bottom} = useSafeAreaInsets();

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
      })}>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({focused}) => (
            <HomeIcon stroke={getColor(focused)} fill={getColor(focused)} />
          ),
          headerShown: false,
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
        }}
      />
      <Tab.Screen
        component={StoresStack}
        name="Stores"
        options={{
          tabBarIcon: ({focused}) => <StoresIcon stroke={getColor(focused)} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        component={CartScreen}
        name="Cart"
        options={{
          tabBarIcon: ({focused}) => <CartIcon stroke={getColor(focused)} />,
        }}
      />
      <Tab.Screen
        component={ProfileScreen}
        name="Profile"
        options={{
          tabBarIcon: ({focused}) => <ProfileIcon stroke={getColor(focused)} />,
        }}
        initialParams={{userId: user.id}}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;
