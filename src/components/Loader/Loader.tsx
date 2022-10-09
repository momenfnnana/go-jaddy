import React from 'react';
import {
  View,
  ActivityIndicator,
  ActivityIndicatorProps,
  ViewStyle,
} from 'react-native';

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
      <ActivityIndicator size={size || 'large'} {...rest} />
    </View>
  );
};

export default Loader;
