import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {colors} from 'theme';
import {
  CheckoutStepOne,
  CheckoutHeader,
  CheckoutStepTwo,
  CheckoutStepThree,
  CheckoutStepFour,
} from '../components';

const ContinueOrderStepsScreen = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  console.log({activeStep});
  const renderSection = (activeStep: number) => {
    switch (activeStep) {
      case 1:
        return <CheckoutStepOne setActiveStep={setActiveStep} />;
        break;
      case 2:
        return <CheckoutStepTwo setActiveStep={setActiveStep} />;
        break;
      case 3:
        return <CheckoutStepThree setActiveStep={setActiveStep} />;
        break;
      case 4:
        return <CheckoutStepFour setActiveStep={setActiveStep} />;
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
