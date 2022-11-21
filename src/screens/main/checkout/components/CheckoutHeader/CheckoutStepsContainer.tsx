import React, {FC, ReactNode, useMemo} from 'react';
import {Pressable, StyleSheet, View, ViewStyle} from 'react-native';
import {
  PaymentMethods,
  PaymentConfirmation,
  PaymentShippingAddress,
  PaymentAddress,
} from 'assets/icons';
import {colors, spacing} from 'theme';
interface ICheckoutStepsContainer {
  containerStyle?: ViewStyle | ViewStyle[];
  activeStep: number;
  setActiveStep: (value: number) => void;
}
interface IStepContainer {
  children: ReactNode;
  isActive: boolean;
  onPress: () => void;
}

const StepContainer = ({children, isActive, onPress}: IStepContainer) => (
  <Pressable
    onPress={onPress}
    style={[
      styles.stepContainer,
      {
        backgroundColor: isActive ? colors.secondary : colors.white,
        borderColor: isActive ? colors.secondary + 25 : colors.reloadColor,
      },
    ]}>
    {children}
  </Pressable>
);
const CheckoutStepsContainer: FC<ICheckoutStepsContainer> = ({
  containerStyle,
  activeStep,
  setActiveStep,
}) => {
  const isActive = useMemo(() => {
    return {
      firstStep: activeStep >= 1,
      secondStep: activeStep >= 2,
      thirdStep: activeStep >= 3,
      fourthStep: activeStep >= 4,
    };
  }, [activeStep]);
  return (
    <View style={[styles.containerStyle, containerStyle]}>
      <StepContainer
        isActive={isActive.firstStep}
        onPress={() => setActiveStep(1)}>
        <PaymentAddress
          stroke={isActive.firstStep ? colors.white : colors.black}
        />
      </StepContainer>
      <StepContainer
        isActive={isActive.secondStep}
        onPress={() => setActiveStep(2)}>
        <PaymentShippingAddress
          stroke={isActive.secondStep ? colors.white : colors.black}
        />
      </StepContainer>
      <StepContainer
        isActive={isActive.thirdStep}
        onPress={() => setActiveStep(3)}>
        <PaymentMethods
          stroke={isActive.thirdStep ? colors.white : colors.black}
        />
      </StepContainer>
      <StepContainer
        isActive={isActive.fourthStep}
        onPress={() => setActiveStep(4)}>
        <PaymentConfirmation
          stroke={isActive.fourthStep ? colors.white : colors.black}
        />
      </StepContainer>
    </View>
  );
};

export default CheckoutStepsContainer;

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
    paddingHorizontal: spacing.small,
  },
  stepContainer: {
    width: spacing.xxxLarge,
    height: spacing.xxxLarge,
    borderRadius: spacing.xxxLarge * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
});
