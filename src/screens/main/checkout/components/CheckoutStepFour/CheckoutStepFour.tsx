import React, {useContext, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
} from 'react-native';
import {colors, spacing} from 'theme';
import {Button, InputField, Text} from 'components';
import {Switch} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ICheckoutStep} from '..';
import {IAddress} from 'types';
import {UserContext} from 'context/UserContext';

interface ICheckoutStepFour extends ICheckoutStep {
  shippingMethod: any;
  paymentMethod: any;
  paymentAddress: IAddress;
  shippingAddress: IAddress;
}

const borderColor = colors.reloadColor;

const Line = () => <View style={styles.line} />;

const CheckoutStepFour = ({
  shippingMethod,
  paymentMethod,
  paymentAddress,
  shippingAddress,
}: ICheckoutStepFour) => {
  const {userData} = useContext(UserContext);

  const [isDefualt, setDefualt] = useState<boolean>(false);
  const [tellUs, setTellUs] = useState<string>('');
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  console.log({
    // shippingMethod
    // paymentMethod
    // , paymentMethod, paymentAddress, shippingAddress
    paymentAddress,
  });

  const onConfirmPayment = () => {
    console.log('onConfirmPayment');
  };
  const onPressPrivacyTerms = () => {
    console.log('onPressPrivacyTerms');
  };
  const onPressConfirm = () => {
    setIsConfirmed(currentValue => !currentValue);
  };
  return (
    <ScrollView style={{zIndex: -1}}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <View style={styles.selectedOptions}>
            <View
              style={[
                styles.optionContainer,
                {borderRightWidth: 0.5, borderRightColor: borderColor},
              ]}>
              <Text
                tx="checkout.shipping-method"
                color={colors.tabsColor + 50}
              />
              <Text
                text={shippingMethod.Name}
                color={colors.primary}
                variant="mediumBold"
              />
            </View>
            <View
              style={[
                styles.optionContainer,
                {borderLeftWidth: 0.5, borderLeftColor: borderColor},
              ]}>
              <Text
                tx="checkout.payment-method"
                color={colors.tabsColor + 50}
              />
              <Text
                text={paymentMethod.Name}
                color={colors.primary}
                variant="mediumBold"
              />
            </View>
          </View>
          <View style={{flex: 1, paddingHorizontal: spacing.normal}}>
            <Text
              tx="checkout.payment-address"
              color={colors.tabsColor + 60}
              style={{marginVertical: spacing.medium}}
            />
            <Text text={`${userData.FirstName} ${userData.LastName}`} />
            <Text text="دولة فلسطين,رام الله, البيرة" />
            <Text text="0590000000" />
            <Text text="test@test.email" />
            <Text
              tx="checkout.shipping-address"
              color={colors.tabsColor + 60}
              style={{marginVertical: spacing.medium}}
            />
            <Text text={`${userData.FirstName} ${userData.LastName}`} />
            <Text text="دولة فلسطين,رام الله, البيرة" />
            <Text text="0590000000" />
            <Text text="test@test.email" />
          </View>
          <View style={styles.selectGiftContainer}>
            <View style={styles.defualtContainer}>
              <Switch
                value={isDefualt}
                onValueChange={() => setDefualt(!isDefualt)}
                color={colors.primary}
                style={{transform: [{scale: 0.7}]}}
              />
              <Text
                tx="checkout.choose-gift"
                variant="xSmallBold"
                style={{marginHorizontal: 10}}
              />
            </View>
          </View>
          <View style={styles.confirmOrderHints}>
            <Text style={styles.confirmHintText}>
              <Text
                tx="checkout.confirm-order-hint-1"
                variant="xSmallRegular"
                color={colors.modalDescriptionColor}
              />{' '}
              <Text
                tx="checkout.confirm-payment"
                variant="xSmallBold"
                color={colors.secondary}
                onPress={onConfirmPayment}
              />
            </Text>
            <Line />
            <View style={styles.confirmHintText}>
              <Pressable style={styles.row} onPress={onPressConfirm}>
                <MaterialCommunityIcons
                  name={
                    isConfirmed ? 'checkbox-marked' : 'checkbox-blank-outline'
                  }
                  size={20}
                  color={colors.primary}
                />
                <Text>
                  <Text
                    tx="checkout.confirm-order-hint-2"
                    variant="xSmallRegular"
                    color={colors.modalDescriptionColor}
                  />
                  <Text
                    tx="checkout.privacy-terms"
                    variant="xSmallRegular"
                    color={colors.primary}
                    underline
                    onPress={onPressPrivacyTerms}
                  />{' '}
                  <Text
                    tx="checkout.confirm-order-hint-2-2"
                    variant="xSmallRegular"
                    color={colors.modalDescriptionColor}
                  />
                </Text>
              </Pressable>
            </View>
          </View>
          <View style={{paddingHorizontal: spacing.normal}}>
            <InputField
              placeholder="checkout.want-tell-us"
              value={tellUs}
              onChangeText={setTellUs}
            />
            <Button
              onPress={() => {}}
              style={{marginBottom: 10}}
              title="checkout.confirm-payment"
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
};

export default CheckoutStepFour;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  selectedOptions: {
    flexDirection: 'row',
  },
  optionContainer: {
    flex: 0.5,
    height: 100,
    borderBottomWidth: 1,
    borderBottomColor: borderColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectGiftContainer: {
    paddingHorizontal: spacing.normal,
    marginTop: spacing.xLarge,
  },
  defualtContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.arrowColor + '07',
    borderRadius: spacing.small,
  },
  confirmOrderHints: {
    paddingHorizontal: spacing.normal,
    backgroundColor: colors.simiWhite2,
    marginTop: spacing.large,
  },
  confirmHintText: {
    marginVertical: spacing.large,
  },
  line: {
    height: 1,
    flex: 1,
    backgroundColor: colors.reloadColor,
    marginHorizontal: -spacing.normal,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
});
