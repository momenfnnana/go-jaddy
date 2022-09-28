import {View, ViewStyle, Pressable, StyleSheet} from 'react-native';
import React from 'react';
import {colors, spacing} from 'theme';
import Text from 'components/Text';
import Loader from 'components/Loader';

interface buttomProps {
  style?: ViewStyle;
  title: string;
  onPress?: any;
  color?: string;
  isLoading?: boolean;
  variant?: 'Primary' | 'Secondary';
}

const Button: React.FC<buttomProps> = ({
  style,
  title,
  onPress,
  color,
  isLoading,
  variant,
}) => {

  return (
    <Pressable
      onPress={onPress}
      style={StyleSheet.flatten([
        styles.pressable,
        style,
        {
          backgroundColor: variant !== 'Secondary' ? colors.blue : colors.white,
          borderColor: variant !== 'Secondary' ? colors.blue : colors.secondary,
          borderWidth: 1,
        },
      ])}
      disabled={isLoading}>
      <Text
        center
        variant="largeBold"
        tx={title}
        color={color || colors.white}
        style={styles.textStyle}
      />
      {isLoading && <Loader size="small" />}
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  pressable: {
    flexDirection: 'row',
    borderRadius: spacing.xxLarge + 2,
    paddingHorizontal: spacing.large,
    paddingVertical: spacing.small + 2,
    alignItems: 'center',
  },
  textStyle: {
    flex: 1,
  },
});
