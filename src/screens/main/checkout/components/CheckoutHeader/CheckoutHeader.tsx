import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {colors} from 'theme';

const CheckoutHeader = () => {
  return (
    <View style={styles.container}>
      <Text>CheckoutHeader</Text>
    </View>
  );
};

export default CheckoutHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    flex: 0.15,
  },
});
