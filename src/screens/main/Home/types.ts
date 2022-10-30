import {ImageSourcePropType, ViewStyle} from 'react-native';
import {ImageData} from 'types';

export interface ICategories {
  imageUrl: ImageSourcePropType;
  name: string;
  Id: number;
  Image: ImageData;
  Name: string;
}
export interface IProductInterface {
  Id: number;
  isFav: boolean;
  title: string;
  acttualPrice: string;
  prevPrice: string;
  currency: string;
  rate: number;
  productColors: string[];
  isNews: boolean;
  isHaveDiscount: boolean;
  discountValue: string;
  imageUrl: ImageSourcePropType;
  Image: any;
  Price: any;
  Badges: any[];
  AddedToCart: any;
  Name: string;
  RatingSum: any;
  CategoryName: string;
  SupportMultiWishlists: string;
  WishlistEnabled: boolean;
  styleContainer: ViewStyle;
  ColorAttributes: any[];
}

export interface ISearchInterface {
  categoryId?: number;
  title?: string;
  paramsType?: string;
}

export interface ISearchInterface {
  categoryId?: number;
  title?: string;
  paramsType?: string;
}
