import {IProductInterface, ISearchInterface} from 'screens/main/Home/types';
export type MainNavigator = {
  HomeFlow: BottomTabsRoutes;
  AuthFlow: AuthRoutes;
};

export type BottomTabsRoutes = {
  HomeStack: HomeRoutes;
  CategoriesStack: undefined;
  CategoryDetails: {title: ''; id: -1};
  StoresStack: undefined;
  Cart: undefined;
  Profile: ProfileRoutes;
};

export type HomeRoutes = {
  Home: undefined;
  ProductDetails: IProductInterface;
  SearchScreen: ISearchInterface;
};

interface CategoryParams {
  title: string;
  id: number;
}
interface StoreParams {
  storeId: number;
}

export type CategotyRoutes = {
  Categories: undefined;
  CategoryDetails: CategoryParams;
};

export type CartRoutes = {
  Cart: undefined;
};

export type StoresRoutes = {
  Stores: undefined;
  StoresDetails?: StoreParams;
};

export type ProfileRoutes = {
  Profile: undefined;
  WishList: undefined;
  PreviousTitles: undefined;
  ReturnProducts: undefined;
  CustomerPoints: undefined;
  AddAddress: undefined;
  ProfileDetails: undefined;
};

export type AuthRoutes = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  Splash: undefined;
};
