import {IProductInterface} from 'screens/main/Home/types';

export type BottomTabsRoutes = {
  Home: undefined;
  Categories: undefined;
  CategoryDetails: {title: ''; id: -1};
  Stores: undefined;
  Cart: undefined;
  Profile: {userId: string};
};

export type HomeRoutes = {
  Home: undefined;
  ProductDetails: IProductInterface;
  SearchScreen: undefined;
};

interface CategoryParams {
  title: string;
  id: number;
}

export type CategotyRoutes = {
  Categories: undefined;
  CategoryDetails: CategoryParams;
};

export type StoresRoutes = {
  Stores: undefined;
  Storess?: undefined;
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
