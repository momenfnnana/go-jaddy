import {
  BottomTabNavigationProp,
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';
import {
  CompositeNavigationProp,
  CompositeScreenProps,
  RouteProp,
} from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {
  AuthRoutes,
  BottomTabsRoutes,
  CartRoutes,
  CategotyRoutes,
  HomeRoutes,
  MainNavigator,
  ProfileRoutes,
  StoresRoutes,
} from './RoutesTypes';

type AuthNavigationsType = CompositeNavigationProp<
  NativeStackNavigationProp<AuthRoutes>,
  NativeStackNavigationProp<BottomTabsRoutes>
>;

interface HomeNavigationsType
  extends NativeStackNavigationProp<HomeRoutes>,
    RouteProp<BottomTabsRoutes> {}
// type HomeNavigationsType = CompositeNavigationProp<
//   NativeStackNavigationProp<MainNavigator, 'HomeFlow'>,
//   NativeStackNavigationProp<BottomTabsRoutes, 'StoresStack'>
// >;

interface CategoryNavigationsType
  extends NativeStackNavigationProp<CategotyRoutes & BottomTabsRoutes>,
    RouteProp<CategotyRoutes> {}

type IHome = NativeStackScreenProps<BottomTabsRoutes, 'HomeStack'>;

type ICategories = NativeStackScreenProps<BottomTabsRoutes, 'CategoriesStack'>;

type ICart = NativeStackScreenProps<BottomTabsRoutes, 'Cart'>;

type CartScreenNavigationProp = NativeStackNavigationProp<CartRoutes, 'Cart'>;
// interface IStores
//   extends NativeStackScreenProps<BottomTabsRoutes, 'StoresStack'>,
//     RouteProp<StoresRoutes>,
//     NativeStackNavigationProp<StoresRoutes> {}

type IStores = CompositeNavigationProp<
  NativeStackNavigationProp<MainNavigator, 'HomeFlow'>,
  NativeStackNavigationProp<BottomTabsRoutes, 'StoresStack'>
>;

type ICategoryDetails = BottomTabNavigationProp<
  BottomTabsRoutes,
  'CategoryDetails'
>;

type LoginScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<MainNavigator, 'AuthFlow'>,
  NativeStackNavigationProp<AuthRoutes, 'Login'>
>;

type RegisterScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<MainNavigator, 'AuthFlow'>,
  NativeStackNavigationProp<AuthRoutes, 'Register'>
>;
type ProfileScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<MainNavigator, 'HomeFlow'>,
  NativeStackNavigationProp<ProfileRoutes, 'Profile'>
>;

type SearchScreenNavigationProp = NativeStackNavigationProp<
  HomeRoutes,
  'SearchScreen'
>;

type WishlistScreenNavigationProp = NativeStackNavigationProp<
  ProfileRoutes,
  'WishList'
>;

type PreviousAddressNavigationProp = NativeStackNavigationProp<
  ProfileRoutes,
  'PreviousTitles'
>;

type AddAddressNavigationProp = NativeStackNavigationProp<
  ProfileRoutes,
  'AddAddress'
>;
type AddAddressRouteProp = RouteProp<ProfileRoutes, 'AddAddress'>;
type ContinueStepsRouteProp = RouteProp<CartRoutes, 'ContinueOrderSteps'>;

type OrdersNavigationProp = NativeStackNavigationProp<
  ProfileRoutes,
  'OrdersList'
>;
type OrdersRouteProp = RouteProp<ProfileRoutes, 'OrdersList'>;
type OrdersDetailsRouteProp = RouteProp<ProfileRoutes, 'OrdersDetails'>;

type WishlistDetailsScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<ProfileRoutes, 'WishlistDetails'>,
  NativeStackNavigationProp<HomeRoutes, 'Home'>
>;

// type WishlistDetailsScreenNavigationProp = CompositeNavigationProp<
//   NativeStackNavigationProp<ProfileRoutes, 'WishlistDetails'>,
//   NativeStackNavigationProp<BottomTabsRoutes, 'Profile'>
// >;

interface IProductNavigation
  extends NativeStackNavigationProp<HomeRoutes, 'ProductDetails'>,
    RouteProp<HomeRoutes, 'ProductDetails'> {}

interface ProfileStackProps
  extends NativeStackNavigationProp<ProfileRoutes>,
    RouteProp<ProfileRoutes> {}

export type {
  AuthNavigationsType,
  HomeNavigationsType,
  CategoryNavigationsType,
  IHome,
  ICategories,
  ICart,
  IStores,
  ICategoryDetails,
  LoginScreenNavigationProp,
  RegisterScreenNavigationProp,
  ProfileScreenNavigationProp,
  WishlistScreenNavigationProp,
  WishlistDetailsScreenNavigationProp,
  ProfileStackProps,
  IProductNavigation,
  PreviousAddressNavigationProp,
  AddAddressNavigationProp,
  AddAddressRouteProp,
  CartScreenNavigationProp,
  OrdersRouteProp,
  OrdersDetailsRouteProp,
  OrdersNavigationProp,
  SearchScreenNavigationProp,
  ContinueStepsRouteProp,
};
