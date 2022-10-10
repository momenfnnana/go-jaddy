import React from 'react';
import {View, Pressable, StyleSheet, ViewStyle} from 'react-native';
import {colors} from 'theme';

interface ISwitch {
  onPress: () => void;
  isActive: boolean;
  containerStyle?: ViewStyle;
}

const Switch = ({onPress, isActive, containerStyle}: ISwitch) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        {alignItems: isActive ? 'flex-end' : 'flex-start'},
        containerStyle,
      ]}>
      <View style={styles.button} />
    </Pressable>
  );
};

export default Switch;

const styles = StyleSheet.create({
  container: {
    width: 31,
    backgroundColor: colors.primary + 15,
    height: 18,
    borderRadius: 11,
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  button: {
    width: 13,
    height: 13,
    borderRadius: 13 / 2,
    backgroundColor: colors.primary,
  },
});
