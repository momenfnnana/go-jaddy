import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {colors} from 'theme';
import {IAddress} from 'types';
import {
  CheckoutStepOne,
  CheckoutHeader,
  CheckoutStepTwo,
  CheckoutStepThree,
  CheckoutStepFour,
} from '../components';

const ContinueOrderStepsScreen = () => {
  const [activeStep, setActiveStep] = useState<number>(2);
  const [paymentAddress, setPaymentAddress] = useState<IAddress>({});
  const [shippingAddress, setShippingAddress] = useState<IAddress>({});
  const [shippingMethod, setShippingMethod] = useState<IAddress>({});

  const renderSection = (activeStep: number) => {
    switch (activeStep) {
      case 1:
        return (
          <CheckoutStepOne
            setActiveStep={setActiveStep}
            setSelectedAddress={setPaymentAddress}
          />
        );
        break;
      case 2:
        return (
          <CheckoutStepTwo
            setActiveStep={setActiveStep}
            selectedAddress={paymentAddress}
            setShippingMethod={setShippingMethod}
            setShippingAddress={setShippingAddress}
          />
        );
        break;
      case 3:
        return <CheckoutStepThree setActiveStep={setActiveStep} />;
        break;
      case 4:
        return <CheckoutStepFour />;
        break;
      default:
      // code block
    }
    return null;
  };
  return (
    <View style={styles.container}>
      <CheckoutHeader activeStep={activeStep} />
      {renderSection(activeStep)}
    </View>
  );
};

export default ContinueOrderStepsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
