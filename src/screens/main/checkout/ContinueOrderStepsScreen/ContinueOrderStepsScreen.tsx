import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {CheckoutHeader} from '../components';

const ContinueOrderStepsScreen = () => {
  return (
    <View style={styles.container}>
      <CheckoutHeader />
      <Text>ContinueOrderStepsScreen</Text>
    </View>
  );
};

export default ContinueOrderStepsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
