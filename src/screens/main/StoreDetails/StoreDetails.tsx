import {useRoute} from '@react-navigation/native';
import {Loader, ProductCard, SearchHeader, Text} from 'components';
import {IStores} from 'navigators/NavigationsTypes';
import React, {useEffect, useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  View,
  Pressable,
  FlatList,
  useWindowDimensions,
  Image,
} from 'react-native';
import {colors, spacing} from 'theme';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {useInfiniteQuery, useQuery} from '@tanstack/react-query';
import {
  getStoreCategories,
  getStoreDetails,
  getStoreNewProducts,
} from 'services/Stores';
import NetworkErrorScreen from 'screens/NetworkErrorScreen';
import {BASE_URL} from 'utils/Axios';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator} from 'react-native-paper';

const StoreDetails = () => {
  const {params} = useRoute<IStores>();
  const [searchText, setSearchText] = useState<string>('');
  const [tab, setTab] = useState<number>(0);
  const [isFollowed, setFollowed] = useState<boolean>(false);
  const {t} = useTranslation();
  const {width} = useWindowDimensions();
  const {
    isLoading: isLoadingStoreDetails,
    data: storeDetailsData,
    isError: isErrorStoreDetails,
    refetch: refetchStoreDetails,
    isRefetching: isRefetchingrefetchStoreDetails,
    remove: removeStoreDetails,
  } = useQuery(['getStoreDetails'], () =>
    getStoreDetails({storeId: params?.storeId}),
  );

  const {
    isLoading: isLoadingStoreMain,
    data: StoreMainData,
    isError: isErrorStoreMain,
    refetch: refetchStoreMain,
    isRefetching: isRefetchingrefetchStoreMain,
    remove: removeStoreMain,
    hasNextPage,
  } = useInfiniteQuery(
    ['getStoreMainTab'],
    ({pageParam}) => getStoreCategories({storeId: params?.storeId, pageParam}),
    {
      getNextPageParam: lastPage => {
        if (lastPage?.data?.Page < lastPage?.data?.TotalPages) {
          return lastPage?.data?.Page + 1;
        }
        return null;
      },
    },
  );

  // const getStoreNewProductsPages = ({pageParam}: any) =>
  //   getStoreNewProducts({pageParam, storeId: params?.storeId});

  const {
    isLoading: isLoadingStoreNew,
    data: StoreNewData,
    isError: isErrorStoreNew,
    refetch: refetchStoreNew,
    isRefetching: isRefetchingrefetchStoreNew,
    remove: removeStoreNew,
    hasNextPage: hasNextPageNew,
    isFetchingNextPage: isFetchingNextPageNew,
    fetchNextPage: fetchNextPageNew,
  } = useInfiniteQuery(
    ['getStoreNewTab'],
    ({pageParam}) => getStoreNewProducts({pageParam, storeId: params?.storeId}),
    {
      getNextPageParam: lastPage => {
        if (lastPage?.data?.Page < lastPage?.data?.TotalPages) {
          const next = lastPage?.data?.Page + 2;
          console.log({next});
          return next;
        }
        return null;
      },
    },
  );

  console.log({hasNextPageNew});

  const SearchHandler = () => {
    // if (
    //   searchText.length >
    //   parseInt(settings?.SearchSettings?.InstantSearchTermMinLength)
    // ) {
    //   mutate({searchText, CurrencyId: currency?.Id});
    // }
  };

  if (isLoadingStoreDetails) {
    return <Loader isPageLoading />;
  }

  if (isErrorStoreDetails) {
    return <NetworkErrorScreen />;
  }

  // useEffect(() => {
  //   return () => removeStoreDetails();
  // }, []);

  const loadMore = () => {
    if (hasNextPageNew) {
      fetchNextPageNew();
    }
  };

  const tabs: string[] = [
    'storeDetails.tabs.mainTab',
    'storeDetails.tabs.newTab',
    'storeDetails.tabs.offerTab',
    'storeDetails.tabs.categoriesTab',
  ];

  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <SearchHeader
        value={searchText}
        setValue={setSearchText}
        onSubmitEditing={SearchHandler}
        filterIcon={false}
        RightIcon={
          <MaterialCommunityIcons
            name="share-variant"
            size={20}
            color={colors.white}
          />
        }
        placeholder={`${t('storeDetails.search')} ${
          storeDetailsData.data?.StoreInfo.Name
        }`}
        Footer={
          <View
            style={{
              marginTop: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View
                style={{
                  position: 'relative',
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 7,
                }}>
                <Image
                  style={{width: '100%', height: '100%'}}
                  resizeMode="contain"
                  source={{
                    uri: BASE_URL + storeDetailsData.data?.StoreInfo?.Image.Url,
                  }}
                />
                {storeDetailsData.data?.StoreInfo?.Trusted && (
                  <View
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      height: 16,
                      width: 16,
                      borderRadius: 8,
                      backgroundColor: colors.secondary,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <MaterialCommunityIcons
                      name="shield-check"
                      color={colors.white}
                      size={11}
                    />
                  </View>
                )}
              </View>
              <View>
                <Text
                  tx={storeDetailsData.data?.StoreInfo?.Name}
                  variant="smallBold"
                  color={colors.white}
                />
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View style={{flexDirection: 'row', marginRight: 3}}>
                    {[...new Array(5)].map((item, index) => (
                      <FontAwesome
                        name="star"
                        size={11}
                        color={
                          index <
                          storeDetailsData.data?.ReviewOverview?.RatingSum
                            ? colors.secondary
                            : colors.gray[400]
                        }
                        style={{marginRight: 2}}
                      />
                    ))}
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text
                      style={{lineHeight: 0}}
                      color={colors.white}
                      variant="xSmallLight"
                      tx={` ${
                        storeDetailsData.data?.ReviewOverview?.RatingSum
                      }  (${
                        storeDetailsData.data?.ReviewOverview?.RatingSum
                      }  ${t('storeDetails.rating')})`}
                    />
                    <MaterialIcon
                      name="keyboard-arrow-right"
                      color={colors.white}
                      size={13}
                      style={{lineHeight: 0}}
                    />
                  </View>
                </View>
              </View>
            </View>
            <Pressable
              onPress={() => setFollowed(!isFollowed)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 5,
                paddingHorizontal: 20,
                backgroundColor: isFollowed
                  ? colors.white + 30
                  : colors.secondary,
                borderRadius: 8,
              }}>
              <MaterialIcon
                name={isFollowed ? 'check' : 'add'}
                color={colors.white}
                size={13}
              />
              <Text
                tx={
                  isFollowed ? 'storeDetails.followed' : 'storeDetails.follow'
                }
                color={colors.white}
                variant="smallRegular"
                style={{fontSize: 11, marginLeft: 5}}
              />
            </Pressable>
          </View>
        }
      />
      <Image
        resizeMode="contain"
        style={{height: 100, width: '100%'}}
        source={{
          uri: BASE_URL + storeDetailsData.data?.StoreInfo?.CoverImage.Url,
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: spacing.content,
          backgroundColor: '#F3FBFF',
        }}>
        {tabs.map((item, index) => (
          <Pressable
            onPress={() => setTab(index)}
            key={index.toString()}
            style={{
              position: 'relative',
              paddingTop: 15,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              tx={item}
              color={tab == index ? colors.secondary : colors.black}
              variant={tab == index ? 'smallBold' : 'smallRegular'}
              style={{marginBottom: 12}}
            />
            {tab == index && (
              <View
                style={{
                  backgroundColor: colors.secondary,
                  position: 'absolute',
                  bottom: 0,
                  height: 2,
                  width: 25,
                  borderRadius: 15,
                }}
              />
            )}
          </Pressable>
        ))}
      </View>
      {tab == 0 && (
        <FlatList
          data={StoreMainData?.pages.map(page => page.data.Categories).flat()}
          numColumns={2}
          keyExtractor={(item, index) => item.Id}
          contentContainerStyle={{
            paddingHorizontal: spacing.content,
            paddingTop: 20,
          }}
          renderItem={({item, index}) => (
            <Pressable
              style={{
                borderRadius: 10,
                borderWidth: 1,
                borderColor: colors.border,
                padding: 8,
                width: width / 2 - 20,
                marginBottom: 10,
                marginRight: index % 2 == 0 ? 10 : 0,
              }}>
              <Text tx={item.Name} variant="smallBold" />
              <Image
                source={{uri: BASE_URL + item.Image.Url}}
                style={{width: '100%', height: 90, marginTop: 10}}
                resizeMode="contain"
              />
            </Pressable>
          )}
        />
      )}
      {tab == 1 && (
        <FlatList
          onEndReached={loadMore}
          onEndReachedThreshold={0.7}
          contentContainerStyle={{
            paddingHorizontal: spacing.content,
            paddingTop: 20,
          }}
          numColumns={2}
          data={StoreNewData?.pages
            .map(page => page.data.ProductSummary.Items)
            .flat()}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <ProductCard
              styleContainer={{
                marginRight: index % 2 == 0 ? 10 : 0,
              }}
              {...item}
            />
          )}
          ListFooterComponent={
            isFetchingNextPageNew
              ? () => (
                  <ActivityIndicator size={'small'} color={colors.primary} />
                )
              : null
          }
        />
      )}
    </View>
  );
};

export default StoreDetails;
