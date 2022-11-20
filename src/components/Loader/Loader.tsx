import React, {useMemo} from 'react';
import {
  View,
  ActivityIndicator,
  ActivityIndicatorProps,
  ViewStyle,
} from 'react-native';
import {colors} from 'theme';

interface ILoader extends ActivityIndicatorProps {
  containerStyle?: ViewStyle | ViewStyle[];
  isPageLoading?: boolean;
  variant?: 'screenContent';
}
const Loader = ({
  size,
  containerStyle,
  isPageLoading = false,
  variant,
  ...rest
}: ILoader) => {
  const customStyleContainer: ViewStyle | ViewStyle[] | undefined =
    useMemo(() => {
      if (variant === 'screenContent') {
        return {
          backgroundColor: colors.black + 40,
          justifyContent: 'center',
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          zIndex: 1,
        };
      } else {
        return containerStyle;
      }
    }, [variant]);
  return (
    <View
      style={
        isPageLoading
          ? {flex: 1, justifyContent: 'center', alignItems: 'center'}
          : customStyleContainer
      }>
      <ActivityIndicator
        color={colors.secondary}
        size={size || 'large'}
        {...rest}
      />
    </View>
  );
};

export default Loader;
