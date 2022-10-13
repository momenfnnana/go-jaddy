import React from 'react';
import {StyleSheet, View} from 'react-native';
import {colors} from 'theme';

const Divider = () => {
  return <View style={styles.line} />;
};

export default Divider;

const styles = StyleSheet.create({
  line: {
    height: 1,
    width: '100%',
    backgroundColor: colors.reloadColor,
  },
});
