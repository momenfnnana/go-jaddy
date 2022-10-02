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

interface CategoryParams {
  hasSubCategory: boolean;
  id: number;
}

export type CategotyRoutes = {
  Categories: CategoryParams;
  CategoryDetails: CategoryParams;
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
