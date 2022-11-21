import {useRoute} from '@react-navigation/native';
import {ContinueStepsRouteProp} from 'navigators/NavigationsTypes';
import React, {useMemo, useState} from 'react';
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
  const {params} = useRoute<ContinueStepsRouteProp>();
  const {
    skip: {SkipAddressesStep, SkipPaymentStep, SkipShippingStep},
  } = params;

  const initialStepNumber = useMemo(() => {
    if (SkipAddressesStep && SkipPaymentStep && SkipShippingStep) {
      return 4;
    } else if (SkipAddressesStep && SkipShippingStep) {
      return 3;
    } else if (SkipAddressesStep) {
      return 2;
    } else {
      return 1;
    }
  }, [SkipAddressesStep, SkipPaymentStep, SkipShippingStep]);

  const [activeStep, setActiveStep] = useState<number>(initialStepNumber || 1);
  const [paymentAddress, setPaymentAddress] = useState<IAddress>({});

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
      <CheckoutHeader activeStep={activeStep} setActiveStep={setActiveStep} />
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
