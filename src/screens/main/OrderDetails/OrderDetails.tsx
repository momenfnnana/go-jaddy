import {View, ScrollView, useWindowDimensions} from 'react-native';
import React, {useLayoutEffect} from 'react';
import {BackButton, Loader, Text} from 'components';
import {useNavigation, useRoute} from '@react-navigation/native';
import {OrdersDetailsRouteProp} from 'navigators/NavigationsTypes';
import {useQuery} from '@tanstack/react-query';
import {getOrdersDetails} from 'services/Orders';
import {colors, spacing} from 'theme';
import moment from 'moment';
import {useLanguage} from 'hook/useLanguage';
import {useCurrency} from 'hook/useCurrency';
require('moment/locale/ar.js');

const OrderDetails = () => {
  const {params} = useRoute<OrdersDetailsRouteProp>();
  const {setOptions} = useNavigation();
  const {language} = useLanguage();
  const {width} = useWindowDimensions();
  const {currency} = useCurrency();
  useLayoutEffect(() => {
    setOptions({
      tabBarVisible: false,
      headerLeft: () => <BackButton />,
      headerTitle: '#' + params?.Id,
    });
  }, []);

  const {isLoading, data} = useQuery(['getOrderDetails'], () =>
    getOrdersDetails({orderId: params?.Id}),
  );

  if (isLoading) {
    return (
      <Loader
        size={'large'}
        containerStyle={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      />
    );
  }

  const item = data?.data?.OrderDetails;
  return (
    <View style={{flex: 1}}>
      <ScrollView>
        <View
          style={{
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderBottomColor: colors.gray[300],
            height: 100,
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              tx="orderDetails.shipping-method"
              variant="smallRegular"
              color={colors.gray[400]}
              center
            />
            <Text
              text={item?.ShippingMethod}
              variant="mediumBold"
              center
              color={colors.primary}
              style={{marginTop: spacing.smaller}}
            />
          </View>
          <View
            style={{
              width: 1,
              height: '100%',
              backgroundColor: colors.gray[300],
            }}
          />
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              tx="orderDetails.payment-method"
              variant="smallRegular"
              color={colors.gray[400]}
              center
            />
            <Text
              text={item?.PaymentMethod}
              variant="mediumBold"
              center
              color={colors.primary}
              style={{marginTop: spacing.smaller}}
            />
          </View>
        </View>
        <View style={{paddingHorizontal: spacing.normal}}>
          <View
            style={{
              paddingVertical: 14,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              tx="orderDetails.order-date"
              variant="smallRegular"
              color="#12121260"
            />
            <Text
              text={moment(item?.CreatedOn)
                .locale(language == '2' ? 'ar' : 'en')
                .format('YYYY/MM/DD, hh:mm A')
                .toString()}
              variant="smallRegular"
              color="#121212"
            />
          </View>
          <View
            style={{
              paddingVertical: 14,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              tx="orderDetails.order-status"
              variant="smallRegular"
              color="#12121260"
            />
            <Text
              text={item?.OrderStatus}
              variant="smallRegular"
              color="#121212"
            />
          </View>
          <View
            style={{
              paddingVertical: 14,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              tx="orderDetails.shipping-status"
              variant="smallRegular"
              color="#12121260"
            />
            <Text
              text={item?.ShippingStatus}
              variant="smallRegular"
              color="#121212"
            />
          </View>
          <View style={{marginTop: spacing.large}}>
            <Text
              tx="orderDetails.payment-address"
              variant="smallRegular"
              color="#12121260"
              style={{marginBottom: spacing.small}}
            />
            <Text
              text={
                item?.ShippingAddress?.FirstName +
                ' ' +
                item?.ShippingAddress?.LastName
              }
              variant="smallRegular"
              numberOfLines={1}
            />
            <Text
              text={
                item?.ShippingAddress?.CountryName +
                ' ' +
                item?.ShippingAddress?.City
              }
              variant="smallRegular"
              numberOfLines={1}
            />
            <Text
              text={item?.ShippingAddress?.PhoneNumber}
              variant="smallRegular"
              numberOfLines={1}
            />
            <Text
              text={item?.ShippingAddress?.Email}
              variant="smallRegular"
              numberOfLines={1}
            />
          </View>
          <View style={{marginTop: spacing.large}}>
            <Text
              tx="orderDetails.shipping-address"
              variant="smallRegular"
              color="#12121260"
              style={{marginBottom: spacing.small}}
            />
            <Text
              text={
                item?.BillingAddress?.FirstName +
                ' ' +
                item?.BillingAddress?.LastName
              }
              variant="smallRegular"
              numberOfLines={1}
            />
            <Text
              text={
                item?.BillingAddress?.CountryName +
                ' ' +
                item?.BillingAddress?.City
              }
              variant="smallRegular"
              numberOfLines={1}
            />
            <Text
              text={item?.BillingAddress?.PhoneNumber}
              variant="smallRegular"
              numberOfLines={1}
            />
            <Text
              text={item?.BillingAddress?.Email}
              variant="smallRegular"
              numberOfLines={1}
            />
          </View>
          <View
            style={{
              height: 1,
              width: width,
              backgroundColor: colors.gray[300],
              marginVertical: spacing.large,
              marginHorizontal: -spacing.normal,
            }}
          />
          <Text
            tx="orderDetails.order-invoice"
            variant="smallRegular"
            color="#12121260"
            style={{marginBottom: spacing.small}}
          />
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
            <Text variant="mediumRegular" tx="modal.TotalProducts" />
            <Text variant="mediumRegular" text={item?.OrderSubtotal} />
          </View>
          {item.DisplayTax && (
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
              <Text variant="mediumRegular" text={item?.Tax} />
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
            <Text variant="mediumRegular" text={item?.OrderShipping} />
          </View>
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
            <Text variant="mediumRegular" text={item?.OrderTotalDiscount} />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: 10,
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
              text={item.OrderTotal}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default OrderDetails;
