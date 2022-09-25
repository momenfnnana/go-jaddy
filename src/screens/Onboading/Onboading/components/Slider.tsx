import React, {useRef, useState} from 'react';
import {
  Animated,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import data from '../data/data';
import {ISliderDataSource} from '../helpers/types';

interface ISliderListProps {
  style?: ViewStyle;
  scrollX?: Animated.Value;
  data?: ISliderDataSource[];
  currentIndex?: number;
  q?: (newIndex: number) => void;
}
type ChildT = React.ReactElement<ISliderListProps>;
type ChildrenT = ChildT[] | ChildT;

const Slider: React.FC<{style?: ViewStyle; children?: React.ReactNode}> = ({
  style,
  children,
}) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatRef = useRef(null);
  const {width} = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [language, setLanguage] = useState('ar');
  const [visibleLangModal, setVisibleLangModal] = useState(false);

  const childrenWithProps = React.Children.map(
    children as ChildrenT,
    (child: ChildT) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          data,
          scrollX,
          currentIndex,
          setCurrentIndex,
          flatRef,
          language,
          setLanguage,
          visibleLangModal,
          setVisibleLangModal,
          ...child.props, // override with directly passed props
        });
      }
      return child;
    },
  );
  return (
    <View style={[styles.container, {width}, style]}>{childrenWithProps}</View>
  );
};
export default Slider;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
});
