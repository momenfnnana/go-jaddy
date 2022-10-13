import React from 'react';
import {
  View,
  ActivityIndicator,
  ActivityIndicatorProps,
  ViewStyle,
} from 'react-native';
import {colors} from 'theme';

interface ILoader extends ActivityIndicatorProps {
  containerStyle?: ViewStyle;
  isPageLoading?: boolean;
}
const Loader = ({
  size,
  containerStyle,
  isPageLoading = false,
  ...rest
}: ILoader) => {
  return (
    <View
      style={
        isPageLoading
          ? {flex: 1, justifyContent: 'center', alignItems: 'center'}
          : containerStyle
      }>
      <ActivityIndicator
        color={colors.primary}
        size={size || 'large'}
        {...rest}
      />
    </View>
  );
};

export default Loader;
