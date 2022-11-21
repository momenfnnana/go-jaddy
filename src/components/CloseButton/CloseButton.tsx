import React from 'react';
import {Keyboard, Pressable, PressableProps, StyleSheet} from 'react-native';
import {CloseIcon} from 'assets/icons';
import {colors, spacing} from 'theme';
import {useNavigation} from '@react-navigation/native';

interface ICloseButton extends PressableProps {
  color?: string;
  size?: number;
}

const CloseButton = ({color, size = spacing.large, ...rest}: ICloseButton) => {
  const {goBack} = useNavigation();
  return (
    <Pressable
      onPress={() => {
        Keyboard.dismiss();
        setTimeout(() => {
          goBack();
        }, 50);
      }}
      style={styles.container}
      {...rest}>
      <CloseIcon color={colors.white} style={{transform: [{scale: 1.5}]}} />
    </Pressable>
  );
};

export default CloseButton;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white + 18,
    padding: spacing.medium,
    borderRadius: spacing.small + 2,
  },
});
