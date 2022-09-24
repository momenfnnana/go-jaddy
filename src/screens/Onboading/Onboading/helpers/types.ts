import {Animated, ViewStyle} from 'react-native';

export interface ISliderDataSource {
  id: string;
  title: string;
  subTitle: string;
  image: React.Component;
}

export interface ISliderListProps {
  style?: ViewStyle;
  scrollX?: Animated.Value;
  data?: ISliderDataSource[];
  currentIndex?: number;
  setCurrentIndex?: (newIndex: number) => void;
  setVisibleLangModal?: (newIndex: boolean) => void;
  flatRef?: any;
}
