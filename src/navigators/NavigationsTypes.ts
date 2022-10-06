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
  StoresRoutes,
} from './RoutesTypes';

export interface AuthNavigationsType
  extends NativeStackNavigationProp<AuthRoutes> {}

export interface HomeNavigationsType
  extends NativeStackNavigationProp<HomeRoutes>,
    RouteProp<BottomTabsRoutes> {}

export interface CategoryNavigationsType
  extends NativeStackNavigationProp<CategotyRoutes>,
    RouteProp<CategotyRoutes> {}

export interface IHome
  extends NativeStackScreenProps<BottomTabsRoutes, 'Home'> {}

export interface ICategories
  extends NativeStackScreenProps<BottomTabsRoutes, 'Categories'> {}

export interface IStores
  extends NativeStackScreenProps<BottomTabsRoutes, 'Stores'>,
    RouteProp<StoresRoutes>,
    NativeStackNavigationProp<StoresRoutes> {}

export interface ICategoryDetails
  extends NativeStackScreenProps<BottomTabsRoutes, 'CategoryDetails'> {}
