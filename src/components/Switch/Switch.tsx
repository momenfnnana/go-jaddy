import React from 'react';
import {View, Pressable, StyleSheet, ViewStyle} from 'react-native';
import Text from 'components/Text';
import {colors, spacing} from 'theme';

interface ISwitch {
  onPress: () => void;
  isActive: boolean;
  containerStyle?: ViewStyle;
  title: string;
}

const Switch = ({onPress, isActive, containerStyle, title}: ISwitch) => {
  return (
    <View style={[styles.row, containerStyle]}>
      <Pressable
        onPress={onPress}
        style={[
          styles.container,
          {alignItems: isActive ? 'flex-end' : 'flex-start'},
        ]}>
        <View style={styles.button} />
      </Pressable>
      <Text tx={title} variant="xSmallBold" style={styles.attachImage} />
    </View>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attachImage: {
    marginLeft: spacing.tiny,
  },
});
