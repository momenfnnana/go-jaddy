import React from 'react';
import {Pressable, PressableProps, StyleSheet} from 'react-native';
import {colors, spacing} from 'theme';
import ArrowIcon from 'components/Arrow';
import {useNavigation} from '@react-navigation/native';

const BackButton = ({...rest}: PressableProps) => {
  const {goBack} = useNavigation();
  return (
    <Pressable onPress={goBack} style={styles.container} {...rest}>
      <ArrowIcon size={20} />
    </Pressable>
  );
};

export default BackButton;
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white + 18,
    padding: 8,
    borderRadius: spacing.small + 2,
  },
});
