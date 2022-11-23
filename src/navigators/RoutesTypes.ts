import {IProductInterface, ISearchInterface} from 'screens/main/Home/types';
import {IAddress} from 'types';
export type MainNavigator = {
  HomeFlow: BottomTabsRoutes;
  AuthFlow: AuthRoutes;
};

export type BottomTabsRoutes = {
  HomeStack: HomeRoutes;
  CategoriesStack: CategotyRoutes;
  CategoryDetails: {title: ''; id: -1};
  StoresStack: StoresRoutes;
  Cart: CartRoutes;
  Profile: ProfileRoutes;
};

export type HomeRoutes = {
  Home: undefined;
  ProductDetails: IProductInterface;
  SearchScreen: ISearchInterface;
  FiltersScreen: undefined;
};

export interface IContinueOrderSteps {
  skip: {
    SkipAddressesStep: boolean;
    SkipPaymentStep: boolean;
    SkipShippingStep: boolean;
  };
}

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
  ContinueOrderSteps: IContinueOrderSteps;
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
  OrdersList: {isOrederRequest?: boolean};
  OrdersDetails: {Id: string};
  ContactUsScreen: undefined;
};

export type AuthRoutes = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  Splash: undefined;
};
