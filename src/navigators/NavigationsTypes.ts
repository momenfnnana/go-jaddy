import {RouteProp} from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {
  AuthRoutes,
  BottomTabsRoutes,
  CategotyRoutes,
  HomeRoutes,
} from './RoutesTypes';

export interface AuthNavigationsType
  extends NativeStackNavigationProp<AuthRoutes> {}

export interface HomeNavigationsType
  extends NativeStackNavigationProp<HomeRoutes>,
    RouteProp<BottomTabsRoutes> {}

export interface CategoryNavigationsType
  extends NativeStackNavigationProp<HomeRoutes>,
    RouteProp<CategotyRoutes> {}

export interface IHome
  extends NativeStackScreenProps<BottomTabsRoutes, 'Home'> {}

export interface ICategories
  extends NativeStackScreenProps<BottomTabsRoutes, 'Categories'> {}
