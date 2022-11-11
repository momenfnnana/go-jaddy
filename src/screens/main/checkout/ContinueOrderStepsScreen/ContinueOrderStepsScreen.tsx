import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {
  CheckoutFirstStep,
  CheckoutHeader,
  CheckoutSecondStep,
  CheckoutThirdStep,
  CheckoutFourthStep,
} from '../components';
const renderSection = (activeStep: number) => {
  switch (activeStep) {
    case 1:
      return <CheckoutFirstStep />;
      break;
    case 2:
      return <CheckoutSecondStep />;
      break;
    case 3:
      return <CheckoutThirdStep />;
      break;
    case 4:
      return <CheckoutFourthStep />;
      break;
    default:
    // code block
  }
  return null;
};
const ContinueOrderStepsScreen = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
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
  },
});
