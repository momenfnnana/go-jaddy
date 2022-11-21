import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {Button, Loader, Text} from 'components';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {colors, spacing} from 'theme';
import {paymentOptions} from '../PaymentOptions';
import {ICheckoutStep} from '..';
import {useMutation, useQuery} from '@tanstack/react-query';
import {getPaymentMethods, selectPaymentMethod} from 'services/Checkout';

interface ICheckoutStepThree extends ICheckoutStep {
  setPaymentMethod: (data: any) => void;
}
const CheckoutStepThree = ({
  setActiveStep,
  setPaymentMethod,
}: ICheckoutStepThree) => {
  const [selectedOption, setSelectedOption] = useState<any>({});
  const {data, isLoading} = useQuery(['getPaymentMethods'], getPaymentMethods, {
    onSuccess: data => {
      setSelectedOption(data?.data?.PaymentMethods[0]);
      return data;
    },
  });
  const {mutate, isLoading: isLoadingSelectPaymentMethod} = useMutation(
    selectPaymentMethod,
    {
      onSuccess: data => {
        setPaymentMethod(selectedOption);
        setActiveStep(4);
        return data;
      },
    },
  );
  const onSubmit = () => {
    mutate({paymentMethod: selectedOption.PaymentMethodSystemName});
  };
  if (isLoading) {
    return <Loader isPageLoading />;
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.componentTitle}>
          <Text
            color={colors.primary}
            variant="mediumBold"
            tx="checkout.payment-method"
            style={{flex: 1}}
          />
          <Text
            color={colors.arrowColor}
            variant="smallRegular"
            tx="checkout.choose-payment-method-cost"
            numberOfLines={1}
            style={{flex: 1}}
          />
        </View>
        {data?.data?.PaymentMethods.map((item: any) => {
          return (
            <View
              style={[
                styles.paymentOptionContainer,
                {
                  backgroundColor:
                    selectedOption === item ? colors.white : colors.simiWhite,
                },
              ]}>
              <Pressable
                onPress={() => setSelectedOption(item)}
                key={item.id}
                style={styles.optionName}>
                <MaterialIcons
                  name={`radio-button-${
                    selectedOption === item ? 'on' : 'off'
                  }`}
                  size={20}
                  color={
                    selectedOption === item
                      ? colors.secondary
                      : colors.gray[300]
                  }
                  style={styles.radioButton}
                />
                <Text
                  tx={item.Name}
                  color={colors.tabsColor}
                  variant={
                    selectedOption === item ? 'smallBold' : 'smallRegular'
                  }
                />
              </Pressable>
              {/* {selectedOption === item && item.component} */}
            </View>
          );
        })}
        <Button
          title="addAddress.submitBtn"
          style={styles.submitButton}
          onPress={onSubmit}
          isLoading={isLoadingSelectPaymentMethod}
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
