import {View, Pressable, Platform, FlatList} from 'react-native';
import React, {useLayoutEffect, useState} from 'react';
import {BackButton, Loader, Text} from 'components';
import {useNavigation} from '@react-navigation/native';
import {colors, spacing} from 'theme';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {SearchInput} from 'components/SearchHeader/components';
import {FilterIcon, OrderIcon} from 'assets/icons';
import {useInfiniteQuery} from '@tanstack/react-query';
import {getStoreOrders} from 'services/Orders';
import moment from 'moment';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {useCurrency} from 'hook/useCurrency';
import {useLanguage} from 'hook/useLanguage';

const GO_BACK_SIZE = 36;
const ICON_SIZE = 20;

const OrdersList = () => {
  const {setOptions} = useNavigation();
  const {currency} = useCurrency();
  const [searchText, setSearchText] = useState<string>('');
  const {language} = useLanguage();
  useLayoutEffect(() => {
    setOptions({
      headerLeft: () => <BackButton />,
    });
  }, []);

  const {
    data: StoreOrdersData,
    isLoading: isLoadingStoreOrders,
    hasNextPage: hasNextPageStoreOrders,
    fetchNextPage: fetchNextPageStoreOrders,
    refetch: refetchStoreOrders,
    isFetchingNextPage: isFetchingNextPageStoreOrders,
  } = useInfiniteQuery(
    ['StoreOrders'],
    ({pageParam}) => getStoreOrders({pageParam}),
    {
      getNextPageParam: lastPage => {
        if (lastPage?.data?.Page < lastPage?.data?.TotalPages) {
          return lastPage?.data?.Page + 1;
        }
        return null;
      },
    },
  );

  const loadMoreStoreOrders = () => {
    if (hasNextPageStoreOrders) {
      fetchNextPageStoreOrders();
    }
  };

  if (isLoadingStoreOrders) {
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
        textColor={colors.white}
        value={searchText}
        onChangeText={setSearchText}
        onSubmitEditing={() => {}}
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
        data={StoreOrdersData?.pages.map(page => page.data.Orders).flat()}
        keyExtractor={(i, _) => _.toString()}
        contentContainerStyle={{
          paddingHorizontal: spacing.content,
        }}
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
                <Text
                  variant="xSmallRegular"
                  color="#747474"
                  text={moment(item?.CreatedOn)
                    .format('YYYY/MM/DD, hh:mm A')
                    .toString()}
                />
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
                          .locale('ar')
                          .format('YYYY/MM/DD, hh:mm A')
                          .toString(),
                      }}
                      variant="xSmallRegular"
                    />
                  </View>
                </View>
                <View
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
                </View>
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
