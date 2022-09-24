import {ReactNode} from 'react';
import {ImageBackgroundProps, ImageSourcePropType} from 'react-native';

export interface ICategories {
  imageUrl: ImageSourcePropType;
  Name: string;
}
export interface IProductInterface {
  id: number;
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
}
