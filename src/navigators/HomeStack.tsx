import React, {useCallback, useMemo} from 'react';
import {HomeScreen, ProfileScreen} from 'screens';
import {HomeRoutes} from './RoutesTypes';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {CartIcon, HomeIcon} from 'assets/icons';
import {useNavigationOptions} from './NavigationOptions';
import {colors, typography} from 'theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface IUser {
  id: string;
}
const HomeStack = () => {
  const Tab = createBottomTabNavigator<HomeRoutes>();
  const {headerOptions} = useNavigationOptions();
  const {bottom} = useSafeAreaInsets();

  const user: IUser = {
    id: '1',
  };

  const getColor = useCallback((focused: boolean) => {
    return focused ? colors.danger : colors.tabsColor;
  }, []);

  return (
    <>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarActiveTintColor: colors.danger,
          tabBarInactiveTintColor: colors.gray[800],
        })}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({focused}) => (
              <HomeIcon stroke={getColor(focused)} fill={getColor(focused)} />
            ),
          }}
        />
        <Tab.Screen
          component={ProfileScreen}
          name="Profile"
          options={{
            tabBarIcon: ({focused}) => <CartIcon stroke={getColor(focused)} />,
          }}
          initialParams={{userId: user.id}}
        />
      </Tab.Navigator>
    </>
  );
};

export default HomeStack;
