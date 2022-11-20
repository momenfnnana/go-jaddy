import {View, ViewStyle, Pressable, StyleSheet, TextStyle} from 'react-native';
import React, {ReactNode} from 'react';
import {colors, spacing, TypographyTypes} from 'theme';
import Text from 'components/Text';
import Loader from 'components/Loader';

interface buttomProps {
  style?: ViewStyle | ViewStyle[];
  title: string;
  onPress?: any;
  color?: string;
  isLoading?: boolean;
  variant?: 'Primary' | 'Secondary';
  icon?: ReactNode;
  disabled?: boolean;
  textVariant?: TypographyTypes;
  textStyle?: TextStyle;
}

const Button: React.FC<buttomProps> = ({
  style,
  title,
  onPress,
  color,
  isLoading,
  variant,
  icon,
  disabled = false,
  textVariant = 'largeBold',
  textStyle,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={StyleSheet.flatten([
        styles.pressable,
        {
          backgroundColor: variant !== 'Secondary' ? colors.blue : colors.white,
          borderColor: variant !== 'Secondary' ? colors.blue : colors.secondary,
          borderWidth: 1,
        },
        style,
      ])}
      disabled={isLoading || disabled}>
      {icon && icon}
      <Text
        center
        variant={textVariant}
        tx={title}
        color={
          color || (variant == 'Secondary' ? colors.secondary : colors.white)
        }
        style={[!icon && styles.textStyle, textStyle]}
      />
      {isLoading && (
        <Loader
          size="small"
          color={
            color || (variant == 'Secondary' ? colors.secondary : colors.white)
          }
        />
      )}
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
