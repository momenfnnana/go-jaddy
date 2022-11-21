import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
  FlatList,
  Image,
} from 'react-native';
import {colors, font, spacing} from 'theme';
import {Button, InputField, Loader, Text} from 'components';
import {Switch} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useMutation, useQuery} from '@tanstack/react-query';
import {getCartProducts, getCartSummary} from 'services/Cart';
import {useCurrency} from 'hook/useCurrency';
import {LogoSplash} from 'assets/images';
import {BASE_URL} from 'utils/Axios';
import {submitOrder} from 'services/Checkout';
import {CommonActions} from '@react-navigation/native';

const borderColor = colors.reloadColor;

const Line = () => <View style={styles.line} />;

const CheckoutStepFour = () => {
  const {currency} = useCurrency();
  const {data: CartData, isLoading: isLoadingCart} = useQuery(
    ['cartProducts'],
    getCartProducts,
  );
  const {data: summaryData, isLoading: isLoadingSummary} = useQuery(
    ['applyCartSummary'],
    getCartSummary,
  );
  const {mutate, isLoading: isLoadingSubmitOrder} = useMutation(submitOrder, {
    onSuccess: () => {
      // navigate to home or orders
      CommonActions.reset({
        index: 1,
        routes: [{name: 'HomeStack', params: {screen: 'Home'}}],
      });
    },
  });

  const [isDefualt, setDefualt] = useState<boolean>(false);
  const [tellUs, setTellUs] = useState<string>('');
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

  const onConfirmPayment = () => {
    console.log('onConfirmPayment');
  };
  const onPressPrivacyTerms = () => {
    console.log('onPressPrivacyTerms');
  };
  const onPressConfirm = () => {
    setIsConfirmed(currentValue => !currentValue);
  };
  const oSubmit = () => {
    mutate({customerComments: tellUs});
  };
  if (isLoadingCart || isLoadingSummary) {
    return <Loader />;
  }

  const BillingAddress = CartData?.data?.OrderReviewData?.BillingAddress;
  const ShippingAddress = CartData?.data?.OrderReviewData?.ShippingAddress;
  const ShippingMethod = CartData?.data?.OrderReviewData?.ShippingMethod;
  const PaymentMethod = CartData?.data?.OrderReviewData?.PaymentMethod;
  const CartSummary = summaryData?.data;

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
                text={ShippingMethod}
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
                text={PaymentMethod}
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
            <Text
              text={`${BillingAddress.FirstName} ${BillingAddress.LastName}`}
            />
            <Text
              text={`${BillingAddress.CountryName} ${BillingAddress.City}`}
            />
            <Text text={BillingAddress.PhoneNumber} />
            <Text text={BillingAddress.Email} />
            <Text
              tx="checkout.shipping-address"
              color={colors.tabsColor + 60}
              style={{marginVertical: spacing.medium}}
            />
            <Text
              text={`${ShippingAddress.FirstName} ${ShippingAddress.LastName}`}
            />
            <Text
              text={`${ShippingAddress.CountryName} ${ShippingAddress.City}`}
            />
            <Text text={ShippingAddress.PhoneNumber} />
            <Text text={ShippingAddress.Email} />
            <Text
              tx="modal.BillTitle"
              variant="smallRegular"
              color="#12121260"
              style={{marginVertical: spacing.medium}}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: 10,
                borderBottomWidth: 0.5,
                borderBottomColor: colors.border,
              }}>
              <Text variant="mediumRegular" tx="modal.price" />
              <Text
                variant="mediumRegular"
                text={`${CartSummary?.OrderTotal || 0} ${currency?.Symbol}`}
              />
            </View>
            {CartSummary.DisplayTax && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: 10,
                  borderBottomWidth: 0.5,
                  borderBottomColor: colors.border,
                  marginTop: 10,
                }}>
                <Text variant="mediumRegular" tx="modal.tax" />
                <Text
                  variant="mediumRegular"
                  text={CartSummary?.Tax?.toString()}
                />
              </View>
            )}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: 10,
                borderBottomWidth: 0.5,
                borderBottomColor: colors.border,
                marginTop: 20,
              }}>
              <Text variant="mediumRegular" tx="orderDetails.shipping-fee" />
              <Text
                variant="mediumRegular"
                text={CartSummary?.Shipping.toString()}
              />
            </View>
            {CartSummary?.IsDiscountApplied && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: 10,
                  borderBottomWidth: 0.5,
                  borderBottomColor: colors.border,
                  marginTop: 10,
                }}>
                <Text variant="mediumRegular" tx="modal.DiscoundCode" />
                <Text
                  variant="mediumRegular"
                  text={CartSummary?.Shipping.toString()}
                />
              </View>
            )}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: 20,
                marginTop: 10,
              }}>
              <Text
                variant="mediumBold"
                color={colors.secondary}
                tx="modal.total"
                txOptions={{currencySymbol: currency?.Symbol}}
              />
              <Text
                variant="mediumBold"
                color={colors.secondary}
                text={`${CartSummary.OrderTotal?.toString()} ${
                  currency?.Symbol
                }`}
              />
            </View>

            <Text
              tx="orderDetails.products-list"
              variant="smallRegular"
              color="#12121260"
              style={{marginBottom: spacing.small}}
            />
            <FlatList
              data={CartData?.data?.Items}
              keyExtractor={(i, _) => _.toString()}
              renderItem={({item}) => (
                <View
                  style={{
                    marginBottom: spacing.small,
                    backgroundColor: colors.white,
                    padding: spacing.medium,
                    borderRadius: spacing.small,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={
                      item?.Image?.Id === 0
                        ? LogoSplash
                        : {uri: `${BASE_URL}${item?.Image?.Url}`}
                    }
                    style={{
                      opacity: item?.Image?.Id === 0 ? 0.5 : 1,
                      borderRadius: spacing.small,
                      backgroundColor: colors.white,
                      height: 75,
                      width: 90,
                      marginRight: spacing.small,
                    }}
                    resizeMode="contain"
                  />
                  <View style={{flex: 1}}>
                    <Text
                      text={item?.ProductName}
                      variant="mediumBold"
                      style={{marginBottom: spacing.tiny}}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text
                          text={item?.SubTotal + ' ' + currency?.Symbol}
                          color={colors.secondary}
                          variant="mediumExtraBold"
                          style={{marginRight: spacing.tiny}}
                        />
                        <Text
                          text={'×' + ' ' + item?.EnteredQuantity}
                          color={colors.primary}
                          variant="mediumExtraBold"
                        />
                      </View>
                      {!!item?.AttributesSelection?.length &&
                        item?.AttributesSelection.map(
                          (_: any, index: number) => (
                            <View
                              style={{
                                width: 70,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'transparent',
                              }}
                              key={index.toString()}>
                              <Text
                                text={_?.AttributeType}
                                variant="xSmallBold"
                                style={{
                                  borderRadius: spacing.medium + 2,
                                  borderWidth: 1,
                                  borderColor: colors.reloadColor,
                                  flex: 1,
                                  paddingVertical: spacing.tiny,
                                  backgroundColor: colors.white,
                                }}
                                center
                              />
                              <View
                                style={{
                                  backgroundColor: '#000' || _?.AttributeValue,
                                  width: 27,
                                  height: 27,
                                  borderRadius: 27 * 0.5,
                                  left: -10,
                                  zIndex: -1,
                                }}
                              />
                            </View>
                          ),
                        )}
                    </View>
                    {item?.AllowPackageAsGift && (
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
                    )}
                  </View>
                </View>
              )}
            />
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
              style={{fontSize: font.size.small, marginBottom: spacing.large}}
            />
            <Button
              onPress={oSubmit}
              style={{marginBottom: 10}}
              title="checkout.confirm-payment"
              disabled={!isConfirmed}
              isLoading={isLoadingSubmitOrder}
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
