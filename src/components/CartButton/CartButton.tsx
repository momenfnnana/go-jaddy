import React from 'react';
import {Pressable, PressableProps, StyleSheet} from 'react-native';
import {CartIcon} from 'assets/icons';
import {colors, spacing} from 'theme';

interface ICartButton extends PressableProps {
  color?: string;
  size?: number;
}

const CartButton = ({color, size = spacing.large, ...rest}: ICartButton) => {
  const onPress = () => {};
  return (
    <Pressable onPress={onPress} style={styles.container} {...rest}>
      <CartIcon
        stroke={colors.white}
        style={{transform: [{scaleY: 0.7}, {scaleX: 0.8}]}}
      />
    </Pressable>
  );
};

export default CartButton;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white + 18,
    padding: spacing.smaller,
    borderRadius: spacing.small + 2,
  },
});
