import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {Button, Text} from 'components';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {colors, spacing} from 'theme';
import {paymentOptions} from '../PaymentOptions';
import {ICheckoutStep} from '..';

const CheckoutStepThree = ({setActiveStep}: ICheckoutStep) => {
  const [selectedOption, setSelectedOption] = useState<string>(
    paymentOptions[0].title || '',
  );
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.componentTitle}>
          <Text
            color={colors.primary}
            variant="mediumBold"
            tx="checkout.payment-method"
          />
          <Text
            color={colors.arrowColor}
            variant="smallRegular"
            tx="checkout.choose-payment-method-cost"
          />
        </View>
        {paymentOptions.map(item => {
          return (
            <View
              style={[
                styles.paymentOptionContainer,
                {
                  backgroundColor:
                    selectedOption === item.title
                      ? colors.white
                      : colors.simiWhite,
                },
              ]}>
              <Pressable
                onPress={() => setSelectedOption(item.title)}
                key={item.id}
                style={styles.optionName}>
                <MaterialIcons
                  name={`radio-button-${
                    selectedOption === item.title ? 'on' : 'off'
                  }`}
                  size={20}
                  color={
                    selectedOption === item.title
                      ? colors.secondary
                      : colors.gray[300]
                  }
                  style={styles.radioButton}
                />
                <Text
                  tx={item.title}
                  color={colors.tabsColor}
                  variant={
                    selectedOption === item.title ? 'smallBold' : 'smallRegular'
                  }
                />
              </Pressable>
              {selectedOption === item.title && item.component}
            </View>
          );
        })}
        <Button
          title="addAddress.submitBtn"
          style={styles.submitButton}
          onPress={() => setActiveStep(4)}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CheckoutStepThree;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.small,
    marginTop: spacing.xLarge,
    flex: 1,
  },
  componentTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.normal,
  },
  paymentOptionContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.reloadColor,
    marginHorizontal: -spacing.normal,
    paddingHorizontal: spacing.normal,
    paddingBottom: spacing.tiny,
  },
  optionName: {
    paddingVertical: spacing.normal,
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  radioButton: {
    marginRight: spacing.small,
  },
  submitButton: {
    marginTop: spacing.medium,
  },
});
