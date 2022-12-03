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

type HomeNavigationsType = CompositeNavigationProp<
  NativeStackNavigationProp<HomeRoutes>,
  NativeStackNavigationProp<BottomTabsRoutes>
>;

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

type IStoresNavigation = CompositeNavigationProp<
  NativeStackNavigationProp<MainNavigator, 'HomeFlow'>,
  NativeStackNavigationProp<BottomTabsRoutes, 'StoresStack'>
>;

type IStoresProps = RouteProp<StoresRoutes, 'StoresDetails'>;

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
type checkoutNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<MainNavigator, 'HomeFlow'>,
  NativeStackNavigationProp<CartRoutes, 'ContinueOrderSteps'>
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

type AboutTheAppNavigationProp = NativeStackNavigationProp<
  ProfileRoutes,
  'AboutTheAppScreen'
>;

type StoresDetailsNavigationProp = NativeStackNavigationProp<
  StoresRoutes,
  'StoresDetails'
>;

type AddAddressNavigationProp = NativeStackNavigationProp<
  ProfileRoutes,
  'AddAddress'
>;
type AddAddressRouteProp = RouteProp<ProfileRoutes, 'AddAddress'>;
type AboutTheAppRouteProp = RouteProp<ProfileRoutes, 'AboutTheAppDetails'>;
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
  IStoresNavigation,
  IStoresProps,
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
  StoresDetailsNavigationProp,
  checkoutNavigationProp,
  AboutTheAppNavigationProp,
  AboutTheAppRouteProp,
};
