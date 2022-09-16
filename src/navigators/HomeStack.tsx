import React from 'react';
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
  return (
    <>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName;
            if (route.name === 'Home') {
              // console.log({name: route.name, focused, iconName});
              // change validation on colors
              return <HomeIcon color={colors.danger} />;
            } else if (route.name === 'Profile') {
              return <CartIcon color={colors.danger} />;
            }
          },
          tabBarActiveTintColor: colors.danger,
          tabBarInactiveTintColor: colors.gray[800],
        })}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          // options={{tabBarIcon: HomeIcon}}
        />
        <Tab.Screen
          component={ProfileScreen}
          name="Profile"
          // options={{tabBarIcon: CartIcon}}
          initialParams={{userId: user.id}}
        />
      </Tab.Navigator>
    </>
  );
};

export default HomeStack;
