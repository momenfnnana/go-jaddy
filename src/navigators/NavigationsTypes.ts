import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {
  AuthRoutes,
  BottomTabsRoutes,
  CategotyRoutes,
  HomeRoutes,
  MainNavigator,
  ProfileRoutes,
  StoresRoutes,
} from './RoutesTypes';

export type AuthNavigationsType = CompositeNavigationProp<
  NativeStackNavigationProp<AuthRoutes>,
  NativeStackNavigationProp<BottomTabsRoutes>
>;

export interface HomeNavigationsType
  extends NativeStackNavigationProp<HomeRoutes>,
    RouteProp<BottomTabsRoutes> {}

export interface CategoryNavigationsType
  extends NativeStackNavigationProp<CategotyRoutes & BottomTabsRoutes>,
    RouteProp<CategotyRoutes> {}

export type IHome = NativeStackScreenProps<BottomTabsRoutes, 'HomeStack'>;

export type ICategories = NativeStackScreenProps<
  BottomTabsRoutes,
  'CategoriesStack'
>;

export interface IStores
  extends NativeStackScreenProps<BottomTabsRoutes, 'StoresStack'>,
    RouteProp<StoresRoutes>,
    NativeStackNavigationProp<StoresRoutes> {}

export type ICategoryDetails = BottomTabNavigationProp<
  BottomTabsRoutes,
  'CategoryDetails'
>;

export type LoginScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<MainNavigator, 'AuthFlow'>,
  NativeStackNavigationProp<AuthRoutes, 'Login'>
>;

export type RegisterScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<MainNavigator, 'AuthFlow'>,
  NativeStackNavigationProp<AuthRoutes, 'Register'>
>;
export type ProfileScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<MainNavigator, 'HomeFlow'>,
  NativeStackNavigationProp<ProfileRoutes, 'Profile'>
>;
export type WishlistScreenNavigationProp = NativeStackNavigationProp<
  BottomTabsRoutes,
  'Profile'
>;
