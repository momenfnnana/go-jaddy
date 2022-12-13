import React from 'react';
import {Keyboard, Pressable, PressableProps, StyleSheet} from 'react-native';
import {colors, spacing} from 'theme';
import ArrowIcon from 'components/Arrow';
import {useNavigation} from '@react-navigation/native';

interface IBackButton extends PressableProps {
  color?: string;
  size?: number;
  route?: string;
}

const BackButton = ({
  color,
  size = spacing.large,
  route = '',
  ...rest
}: IBackButton) => {
  const {goBack, navigate} = useNavigation<any>();
  return (
    <Pressable
      onPress={() => {
        Keyboard.dismiss();
        setTimeout(() => {
          if (route.length > 0) {
            navigate(route);
          } else {
            goBack();
          }
        }, 50);
      }}
      style={styles.container}
      {...rest}>
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
