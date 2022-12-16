import {View, StyleSheet} from 'react-native';
import React from 'react';
import {colors, spacing} from 'theme';
import {BackButton, Text} from 'components';
import CheckoutStepsContainer from './CheckoutStepsContainer';

interface ICheckoutHeader {
  activeStep: number;
  maximumVisitedStep: number;
  setActiveStep: (value: number) => void;
}
const EmptyView = () => <View style={{width: spacing.xxxLarge + 2}} />;
const CheckoutHeader = ({
  activeStep,
  setActiveStep,
  maximumVisitedStep,
}: ICheckoutHeader) => {
  return (
    <View style={styles.container}>
      <BackButton />
      <Text
        tx="cart.continue-request"
        center
        color="white"
        variant="mediumRegular"
      />
      <EmptyView />
      <CheckoutStepsContainer
        containerStyle={styles.stepsContainer}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        maximumVisitedStep={maximumVisitedStep}
      />
    </View>
  );
};

export default CheckoutHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    height: 148,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.small,
    zIndex: 10,
  },
  stepsContainer: {
    position: 'absolute',
    bottom: -spacing.medium,
    left: 0,
    right: 0,
    zIndex: 1,
  },
});
