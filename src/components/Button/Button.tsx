import {View, ViewStyle, Pressable, StyleSheet} from 'react-native';
import React from 'react';
import {colors, spacing} from 'theme';
import Text from 'components/Text';

interface buttomProps {
  style?: ViewStyle;
  title: string;
  onPress?: any;
  color?: string;
}

const Button: React.FC<buttomProps> = ({style, title, onPress, color}) => {
  return (
    <Pressable onPress={onPress} style={[styles.pressable, style]}>
      <Text
        center
        variant="largeBold"
        tx={title}
        color={color || colors.white}
      />
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  pressable: {
    borderRadius: spacing.xxLarge + 2,
    backgroundColor: colors.blue,
    paddingHorizontal: spacing.large,
    paddingVertical: spacing.small + 2,
  },
});
