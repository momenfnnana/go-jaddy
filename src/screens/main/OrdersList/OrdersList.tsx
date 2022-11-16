import {View, Pressable, Platform, FlatList} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {BackButton, Loader, Text} from 'components';
import {useNavigation, useRoute} from '@react-navigation/native';
import {colors, spacing} from 'theme';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {SearchInput} from 'components/SearchHeader/components';
import {FilterIcon, OrderIcon} from 'assets/icons';
import {useInfiniteQuery} from '@tanstack/react-query';
import {getCustomerOrders, getStoreOrders} from 'services/Orders';
import moment from 'moment';
// import ar from 'moment/';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {useCurrency} from 'hook/useCurrency';
import {useLanguage} from 'hook/useLanguage';
import EmptyPage from 'components/EmptyPage/EmptyPage';
import {useTranslation} from 'react-i18next';
import {
  OrdersNavigationProp,
  OrdersRouteProp,
} from 'navigators/NavigationsTypes';
require('moment/locale/ar.js');

const GO_BACK_SIZE = 36;
const ICON_SIZE = 20;

const OrdersList = () => {
  const {t} = useTranslation();
  const {params} = useRoute<OrdersRouteProp>();
  const {setOptions, navigate} = useNavigation<OrdersNavigationProp>();
  const {currency} = useCurrency();
  const [search, setSearch] = useState<{
    isSearching?: boolean;
    searchText: string;
  }>({searchText: '', isSearching: false});
  const {language} = useLanguage();

  useLayoutEffect(() => {
    setOptions({
      headerLeft: () => <BackButton />,
      headerTitle: params?.isOrederRequest
        ? t('myOrders.orderRequestTitleHeader')
        : t('myOrders.titleHeader'),
    });
  }, []);

  const {
    data: StoreOrdersData,
    isLoading: isLoadingStoreOrders,
    isFetching: isFetchingStoreOrders,
    hasNextPage: hasNextPageStoreOrders,
    fetchNextPage: fetchNextPageStoreOrders,
    refetch: refetchStoreOrders,
    isFetchingNextPage: isFetchingNextPageStoreOrders,
  } = useInfiniteQuery(
    ['StoreOrders'],
    ({pageParam}) =>
      getStoreOrders({
        pageParam,
        orderNumber: search.isSearching ? search.searchText : '',
      }),
    {
      enabled: false,
      getNextPageParam: lastPage => {
        if (lastPage?.data?.Page < lastPage?.data?.TotalPages) {
          return lastPage?.data?.Page + 1;
        }
        return null;
      },
    },
  );

  const {
    data: CustomerOrdersData,
    isLoading: isLoadingCustomerOrders,
    isFetching: isFetchingCustomerOrders,
    hasNextPage: hasNextPageCustomerOrders,
    fetchNextPage: fetchNextPageCustomerOrders,
    refetch: refetchCustomerOrders,
    isFetchingNextPage: isFetchingNextPageCustomerOrders,
  } = useInfiniteQuery(
    ['CustomerOrders'],
    ({pageParam}) =>
      getCustomerOrders({
        pageParam,
        orderNumber: search.isSearching ? search.searchText : '',
      }),
    {
      enabled: false,
      getNextPageParam: lastPage => {
        if (lastPage?.data?.Page < lastPage?.data?.TotalPages) {
          return lastPage?.data?.Page + 1;
        }
        return null;
      },
    },
  );

  useEffect(() => {
    if (params?.isOrederRequest) {
      refetchStoreOrders();
    } else {
      refetchCustomerOrders();
    }
  }, [params?.isOrederRequest]);

  useEffect(() => {
    if (params?.isOrederRequest) {
      if (search.isSearching) {
        refetchStoreOrders();
      } else if (search.searchText.length == 0) {
        setSearch({...search, isSearching: false});
        refetchStoreOrders();
      }
    } else {
      if (search.isSearching) {
        refetchCustomerOrders();
      } else if (search.searchText.length == 0) {
        setSearch({searchText: '', isSearching: false});
        refetchCustomerOrders();
      }
    }
  }, [search.searchText, search.isSearching]);

  const loadMoreStoreOrders = () => {
    if (hasNextPageStoreOrders) {
      fetchNextPageStoreOrders();
    }
  };

  if (isFetchingStoreOrders || isFetchingCustomerOrders) {
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

  const data = params?.isOrederRequest ? StoreOrdersData : CustomerOrdersData;

  if (
    data?.pages.map(page => page.data.Orders).flat().length == 0 &&
    !search.isSearching
  ) {
    return (
      <EmptyPage
        descritopn="EmptyPage.product-description"
        title="EmptyPage.product-title"
        displayButton
      />
    );
  }

  return (
    <View style={{flex: 1}}>
      <SearchInput
        containerStyle={{
          marginTop: spacing.xxLarge,
          marginHorizontal: spacing.content,
          borderWidth: 0,
          paddingVertical: 2,
          height: Platform.OS === 'android' ? 36 : undefined,
          paddingHorizontal: spacing.tiny,
          alignSelf: 'flex-end',
          marginBottom: spacing.xLarge,
        }}
        placeholderTextColor={colors.gray[400]}
        placeholder={'myOrders.placeholderSearch'}
        textColor={colors.primary}
        value={search.searchText}
        onChangeText={val => setSearch({...search, searchText: val})}
        onSubmitEditing={() => {
          setSearch({...search, isSearching: true});
        }}
        rightIcon={
          <Pressable
            style={{
              backgroundColor: colors.primary,
              width: GO_BACK_SIZE - 6,
              height: GO_BACK_SIZE - 6,
              borderRadius: spacing.small + 2,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <FilterIcon />
          </Pressable>
        }
        leftIcon={
          <Pressable
            style={{
              width: GO_BACK_SIZE,
              height: GO_BACK_SIZE,
              borderRadius: spacing.small + 2,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <AntDesign name="search1" size={ICON_SIZE} color={colors.primary} />
          </Pressable>
        }
      />
      <FlatList
        data={data?.pages.map(page => page.data.Orders).flat()}
        keyExtractor={(i, _) => _.toString()}
        contentContainerStyle={{
          paddingHorizontal: spacing.content,
        }}
        ListEmptyComponent={<EmptyPage title="EmptyPage.oreder-no-result" />}
        renderItem={({item}) => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderRadius: spacing.medium,
              backgroundColor: colors.white,
              paddingHorizontal: spacing.small,
              marginBottom: spacing.medium,
            }}>
            <View style={{marginRight: spacing.small}}>
              <OrderIcon />
            </View>
            <View
              style={{
                height: '100%',
                width: 0.3,
                backgroundColor: colors.gray[300],
                marginRight: spacing.smaller,
              }}
            />
            <View style={{flex: 1, paddingVertical: spacing.medium}}>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: spacing.medium,
                }}>
                <Text
                  text={item?.Status}
                  color={item?.StatusColor}
                  variant="xSmallBold"
                />
                <Text variant="xSmallBold" text={'#' + item?.OrderNumber} />
              </View>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  //   alignItems: 'center',
                }}>
                <View>
                  <Text
                    tx="myOrders.total"
                    txOptions={{
                      currency: item?.OrderTotal + ' ' + currency?.Symbol,
                      itemNumber: item?.ItemsCount,
                    }}
                    variant="xSmallRegular"
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: spacing.tiny,
                    }}>
                    <MaterialIcon
                      name="access-time"
                      size={11}
                      style={{marginRight: spacing.tiny}}
                    />
                    <Text
                      tx="myOrders.chargeTime"
                      color="#747474"
                      txOptions={{
                        time: moment(item?.CreatedOn)
                          .locale(language == '2' ? 'ar' : 'en')
                          .format('YYYY/MM/DD, hh:mm A')
                          .toString(),
                      }}
                      variant="xSmallRegular"
                    />
                  </View>
                </View>
                <Pressable
                onPress={()=>navigate("OrdersDetails",{Id:item?.OrderNumber})}
                  style={{
                    width: 30,
                    height: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 15,
                    borderWidth: 1,
                    borderColor: colors.primary,
                  }}>
                  <SimpleLineIcons
                    name={`arrow-${language == '1' ? 'right' : 'left'}`}
                    color={colors.primary}
                    size={15}
                    style={{marginRight: -3}}
                  />
                </Pressable>
              </View>
            </View>
          </View>
        )}
        ListFooterComponent={
          isFetchingNextPageStoreOrders ? () => <Loader /> : null
        }
        onEndReached={loadMoreStoreOrders}
        onEndReachedThreshold={0.3}
      />
    </View>
  );
};

export default OrdersList;
