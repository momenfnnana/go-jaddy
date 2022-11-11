import React from 'react';
import {Pressable, PressableProps, StyleSheet} from 'react-native';
import {colors, spacing} from 'theme';
import ArrowIcon from 'components/Arrow';
import {useNavigation} from '@react-navigation/native';

interface IBackButton extends PressableProps {
  color?: string;
  size?: number;
}

const BackButton = ({color, size = spacing.large, ...rest}: IBackButton) => {
  const {goBack} = useNavigation();
  return (
    <Pressable onPress={goBack} style={styles.container} {...rest}>
      <ArrowIcon size={size} color={color} />
    </Pressable>
  );
};

export default BackButton;
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white + 18,
    padding: spacing.small,
    borderRadius: spacing.small + 2,
  },
});
