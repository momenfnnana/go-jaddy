import {IProductInterface, ISearchInterface} from 'screens/main/Home/types';
export type MainNavigator = {
  HomeFlow: BottomTabsRoutes;
  AuthFlow: AuthRoutes;
};

export type BottomTabsRoutes = {
  HomeStack: HomeRoutes;
  CategoriesStack: CategotyRoutes;
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

export interface IAddress {
  Id: number;
  Company: string;
  FirstName: string;
  LastName: string;
  Address1: string;
  Address2: string;
  CountryId: number;
  CountryName: string;
  City: string;
  Email: string;
  PhoneNumber: string;
  FaxNumber: string;
  IsDefault: boolean;
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
  PreviousTitles: {refetch?: number};
  ReturnProducts: undefined;
  CustomerPoints: undefined;
  AddAddress: {item?: IAddress} | undefined;
  ProfileDetails: undefined;
  WishlistDetails: {Id: number; title: string};
};

export type AuthRoutes = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  Splash: undefined;
};
