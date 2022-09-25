import React from 'react';
import {
  View,
  ActivityIndicator,
  ActivityIndicatorProps,
  ViewStyle,
} from 'react-native';

interface ILoader extends ActivityIndicatorProps {
  containerStyle?: ViewStyle;
}
const Loader = ({size, containerStyle, ...rest}: ILoader) => {
  return (
    <View style={containerStyle}>
      <ActivityIndicator size={size || 'large'} {...rest} />
    </View>
  );
};

export default Loader;
