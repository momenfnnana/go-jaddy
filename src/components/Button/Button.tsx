import {View, ViewStyle, Pressable} from 'react-native';
import React from 'react';
import {colors} from 'theme';
import Text from 'components/Text';

interface buttomProps {
  style?: ViewStyle;
  title: string;
  onPress?: any;
}

const Button: React.FC<buttomProps> = ({style, title, onPress}) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          borderRadius: 30,
          backgroundColor: colors.blue,
          paddingHorizontal: 20,
          paddingVertical: 10,
        },
        style,
      ]}>
      <Text center variant="largeBold" tx={title} color={colors.white} />
    </Pressable>
  );
};

export default Button;
