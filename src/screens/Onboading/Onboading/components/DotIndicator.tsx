import React from 'react';
import {
  Animated,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import {colors} from 'theme';
const DotIndicator: React.FC<{
  style?: ViewStyle;
  data: [];
  scrollX: Animated.Value;
  currentIndex: number;
}> = ({style, data, scrollX, currentIndex}) => {
  // TODO: Remove this constants once proper theming is introduced
  const WHITE = '#C4C4C4';
  const BLUE = colors.blue;
  const {width} = useWindowDimensions();
  return (
    <View style={[styles.container, style]}>
      {data.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [10, 30, 10],
          extrapolate: 'clamp',
        });
        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.7, 1, 0.7],
          extrapolate: 'clamp',
        });
        return (
          <Animated.View
            key={i.toString()}
            style={[
              styles.dot,
              {
                width: dotWidth,
                opacity,
                backgroundColor: i === currentIndex ? BLUE : WHITE,
              },
            ]}
          />
        );
      })}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    height: 64,
    flexDirection: 'row',
  },
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E6E6E6',
    marginHorizontal: 8,
  },
});
export default DotIndicator;
