import {
  View,
  ScrollView,
  useWindowDimensions,
  FlatList,
  Image,
  Pressable,
} from 'react-native';
import React, {useLayoutEffect, useMemo} from 'react';
import {BackButton, Button, Loader, Text} from 'components';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  IProductNavigation,
  OrdersDetailsRouteProp,
} from 'navigators/NavigationsTypes';
import {useInfiniteQuery, useMutation, useQuery} from '@tanstack/react-query';
import {
  cancelOrder,
  getCustomerOrders,
  getOrdersDetails,
} from 'services/Orders';
import {colors, spacing} from 'theme';
import moment from 'moment';
import {useLanguage} from 'hook/useLanguage';
import {useCurrency} from 'hook/useCurrency';
import {LogoSplash} from 'assets/images';
import {BASE_URL} from 'utils/Axios';
require('moment/locale/ar.js');

const OrderDetails = () => {
  const {params} = useRoute<OrdersDetailsRouteProp>();
  const {setOptions} = useNavigation();
  const {language} = useLanguage();
  const {width} = useWindowDimensions();
  const {currency} = useCurrency();
  const {navigate} = useNavigation<IProductNavigation>();
  useLayoutEffect(() => {
    setOptions({
      tabBarVisible: false,
      headerLeft: () => <BackButton />,
      headerTitle: '#' + params?.Id,
    });
  }, []);

  const {refetch: refetchCustomerOrders} = useInfiniteQuery(
    ['CustomerOrders'],
    ({pageParam}) =>
      getCustomerOrders({
        pageParam,
        orderNumber: '',
      }),
    {
      enabled: false,
    },
  );

  const {isLoading: isLoadingCancelOrder, mutate} = useMutation(
    ['cancelOrder'],
    cancelOrder,
    {
      onSuccess() {
        refetch();
        refetchCustomerOrders();
      },
    },
  );

  const {isLoading, data, refetch} = useQuery(['getOrderDetails'], () =>
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

  const item = useMemo(() => data?.data?.OrderDetails, [data]);

  return (
    <View style={{flex: 1}}>
      <FlatList
        ListHeaderComponent={
          <>
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
            <View style={{paddingHorizontal: spacing.content}}>
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
                  color={item?.OrderStatusColor}
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
                }}>
                <Text variant="mediumRegular" tx="modal.TotalProducts" />
                <Text variant="mediumRegular" text={item?.OrderSubtotal || 0} />
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
                  <Text variant="mediumRegular" text={item?.Tax?.toString()} />
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
                  text={item?.OrderShipping?.toString()}
                />
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
                <Text
                  variant="mediumRegular"
                  text={item?.OrderTotalDiscount?.toString()}
                />
              </View>
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
                  text={item.OrderTotal?.toString()}
                />
              </View>
              <Text
                tx="orderDetails.products-list"
                variant="smallRegular"
                color="#12121260"
                style={{marginBottom: spacing.small}}
              />
            </View>
          </>
        }
        data={item?.Items}
        keyExtractor={(i, _) => _.toString()}
        renderItem={({item}) => (
          <Pressable
            onPress={() => {
              navigate('ProductDetails', {Id: item?.ProductId} as any);
            }}
            style={{
              marginBottom: spacing.small,
              marginHorizontal: spacing.content,
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
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text
                    text={item?.SubTotal + ' ' + currency?.Symbol}
                    color={colors.secondary}
                    variant="mediumExtraBold"
                    style={{marginRight: spacing.tiny}}
                  />
                  <Text
                    text={'×' + ' ' + item?.Quantity}
                    color={colors.primary}
                    variant="mediumExtraBold"
                  />
                </View>
                {!!item?.AttributesSelection?.length &&
                  item?.AttributesSelection.map((_: any, index: number) => (
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
                          padding: spacing.tiny,
                          backgroundColor: colors.white,
                          overflow: 'hidden',
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
                  ))}
              </View>
            </View>
          </Pressable>
        )}
        ListFooterComponent={
          item?.IsCancelOrderAllowed ? (
            <Button
              isLoading={isLoadingCancelOrder}
              onPress={() => mutate({orderId: item?.Id})}
              title="orderDetails.cancelBtn"
              variant="Secondary"
              style={{
                marginHorizontal: spacing.content,
                borderColor: colors.red,
                marginTop: spacing.normal,
                marginBottom: spacing.small,
                backgroundColor: colors.transparent,
              }}
              color={colors.red}
            />
          ) : null
        }
      />
    </View>
  );
};

export default OrderDetails;
