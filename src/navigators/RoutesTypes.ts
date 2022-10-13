import {IProductInterface, ISearchInterface} from 'screens/main/Home/types';

export type BottomTabsRoutes = {
  HomeStack: undefined & any;
  CategoriesStack: undefined;
  CategoryDetails: {title: ''; id: -1};
  StoresStack: undefined;
  Cart: undefined;
  Profile: {userId: string};
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

export type StoresRoutes = {
  Stores: undefined;
  StoresDetails?: StoreParams;
};

export type ProfileRoutes = {
  Profile: {userId: string};
};

export type AuthRoutes = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  Splash: undefined;
};

export type MainNavigator = {
  HomeFlow: undefined;
  AuthFlow: {userId: string};
};
