import {IProductInterface} from 'screens/main/Home/types';

export type BottomTabsRoutes = {
  Home: undefined;
  Categories: undefined;
  Stores: undefined;
  Cart: undefined;
  Profile: {userId: string};
};

export type HomeRoutes = {
  Home: undefined;
  ProductDetails: IProductInterface;
  SearchScreen: undefined;
};

export type AuthRoutes = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
};

export type MainNavigator = {
  HomeFlow: undefined;
  LoginFlow: {userId: string};
};
