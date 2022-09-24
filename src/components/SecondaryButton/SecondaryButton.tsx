import {Pressable, ViewStyle} from 'react-native';
import React from 'react';
import Text from 'components/Text';
import {colors} from 'theme';

interface buttomProps {
  style?: ViewStyle;
  title: string;
  onPress?: any;
}
const SecondaryButton: React.FC<buttomProps> = ({style, title, onPress}) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          borderRadius: 30,
          borderWidth: 1,
          borderColor: colors.secondary,
          paddingHorizontal: 20,
          paddingVertical: 10,
        },
        style,
      ]}>
      <Text center variant="largeBold" tx={title} color={colors.secondary} />
    </Pressable>
  );
};

export default SecondaryButton;
