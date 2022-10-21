import {useRoute} from '@react-navigation/native';
import {Loader, ProductCard, SearchHeader, Text, ReviewList} from 'components';
import {IStores} from 'navigators/NavigationsTypes';
import React, {useEffect, useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {View, Pressable, FlatList, Image} from 'react-native';
import {colors, spacing} from 'theme';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {useInfiniteQuery, useQuery} from '@tanstack/react-query';
import {
  getRefreshFollowStore,
  getStoreCategories,
  getStoreDetails,
  getStoreNewProducts,
  getStoreOfferProducts,
  getStoreReviews,
  getStoreSearchProducts,
} from 'services/Stores';
import NetworkErrorScreen from 'screens/NetworkErrorScreen';
import {BASE_URL} from 'utils/Axios';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useTranslation} from 'react-i18next';
import {RatingFiltters} from 'components/RatingFilters';
import CategoryItem from './components/categoryItem';
import {getCategoryProducts} from 'services/Category';
import MainTab from './components/MainTab';

export interface Ifiltter {
  withImage: boolean;
  ratings: string[];
}

const tabs: string[] = [
  'storeDetails.tabs.mainTab',
  'storeDetails.tabs.newTab',
  'storeDetails.tabs.offerTab',
  'storeDetails.tabs.categoriesTab',
];
const StoreDetails = () => {
  const {params} = useRoute<IStores>();
  const [searchText, setSearchText] = useState<string>('');
  const [tab, setTab] = useState<number>(0);
  const [isFollowed, setFollowed] = useState<boolean>(false);
  const [subCatId, setSubCatId] = useState<number>(-1);
  const [catProductId, setCatProductId] = useState<number>(-1);
  const [selectedFilter, setSelectedFilter] = useState<Ifiltter>({
    ratings: [],
    withImage: false,
  });
  const {t} = useTranslation();

  const {
    data: storeReviewsData,
    isLoading: isLoadingStoreReviews,
    refetch: refetchStoreReviews,
    isFetchingNextPage: isFetchingNextPageStoreReviews,
  } = useInfiniteQuery(
    ['perantCategories'],
    ({pageParam}) =>
      getStoreReviews({
        pageParam,
        storeId: params?.storeId,
        WithImageOnly: selectedFilter.withImage,
        Ratings: selectedFilter.ratings,
      }),
    {
      getNextPageParam: lastPage => {
        if (
          lastPage?.data?.ProductReviews?.Page <
          lastPage?.data?.ProductReviews?.TotalPages
        ) {
          return lastPage?.data?.ProductReviews?.Page + 1;
        }
        return null;
      },
    },
  );

  const {
    isLoading: isLoadingStoreDetails,
    data: storeDetailsData,
    isError: isErrorStoreDetails,
  } = useQuery(
    ['getStoreDetails'],
    () => getStoreDetails({storeId: params?.storeId}),
    {
      onSuccess(data) {
        setFollowed(data.data?.IsCustomerFollowingTheStore);
      },
    },
  );

  const {refetch: refetchrefreshFollowStore} = useQuery(
    ['refreshFollowStore'],
    () =>
      getRefreshFollowStore({
        storeId: params?.storeId as number,
        isFollow: isFollowed,
      }),
    {
      enabled: false,
      onSuccess() {
        setFollowed(!isFollowed);
      },
    },
  );

  const {data: StoreMainData} = useInfiniteQuery(
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

  const {
    data: StoreNewData,
    hasNextPage: hasNextPageNew,
    isFetchingNextPage: isFetchingNextPageNew,
    fetchNextPage: fetchNextPageNew,
  } = useInfiniteQuery(
    ['getStoreNewTab'],
    ({pageParam}) => getStoreNewProducts({pageParam, storeId: params?.storeId}),
    {
      getNextPageParam: lastPage => {
        if (lastPage?.data?.Page < lastPage?.data?.TotalPages) {
          const next = lastPage?.data?.Page + 1;
          return next;
        }
        return null;
      },
    },
  );
  const {
    data: StoreOfferData,
    hasNextPage: hasNextPageOffer,
    isFetchingNextPage: isFetchingNextPageOffer,
    fetchNextPage: fetchNextPageOffer,
  } = useInfiniteQuery(
    ['getStoreOfferTab'],
    ({pageParam}) =>
      getStoreOfferProducts({pageParam, storeId: params?.storeId}),
    {
      getNextPageParam: lastPage => {
        if (lastPage?.data?.Page < lastPage?.data?.TotalPages) {
          const next = lastPage?.data?.Page + 1;
          return next;
        }
        return null;
      },
    },
  );
  const {
    isLoading: isLoadingStoreSearch,
    data: StoreSearchData,
    refetch: refetchStoreSearch,
    hasNextPage: hasNextPageSearch,
    isFetchingNextPage: isFetchingNextPageSearch,
    fetchNextPage: fetchNextPageSearch,
    isSuccess: isSuccessSearch,
  } = useInfiniteQuery(
    ['getStoreSearchTab'],
    ({pageParam}) =>
      getStoreSearchProducts({
        pageParam,
        storeId: params?.storeId,
        term: searchText,
      }),
    {
      enabled: false,
      getNextPageParam: lastPage => {
        if (lastPage?.data?.Page < lastPage?.data?.TotalPages) {
          const next = lastPage?.data?.Page + 1;
          return next;
        }
        return null;
      },
      onSuccess() {
        setTab(5);
      },
    },
  );

  const {
    data: ProductsData,
    isRefetching: isRefetchingProductsCategory,
    refetch: refetchProductsCategory,
    isLoading: isLoadingProductsCategory,
    remove,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    [`productsCategory${catProductId}`],
    ({pageParam}) => getCategoryProducts({pageParam, categoryId: catProductId}),
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
    if (subCatId == -2) {
      setTab(6);
      refetchProductsCategory();
    }
  }, [subCatId]);

  useEffect(() => {
    refetchStoreReviews();
  }, [selectedFilter]);

  const SearchHandler = () => {
    setTab(5);
    refetchStoreSearch();
  };

  if (isLoadingStoreDetails) {
    return <Loader isPageLoading />;
  }

  if (isErrorStoreDetails) {
    return <NetworkErrorScreen />;
  }

  const loadMoreNew = () => {
    if (hasNextPageNew) {
      fetchNextPageNew();
    }
  };

  const loadMoreOffers = () => {
    if (hasNextPageOffer) {
      fetchNextPageOffer();
    }
  };

  const loadMoreSearch = () => {
    if (hasNextPageSearch) {
      fetchNextPageSearch();
    }
  };

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
                    uri:
                      BASE_URL + storeDetailsData.data?.StoreInfo?.Image?.Url,
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
                        key={index.toString()}
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
                  <Pressable
                    onPress={() => setTab(4)}
                    style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text
                      style={{lineHeight: 0}}
                      color={colors.white}
                      variant="xSmallLight"
                      tx={` ${
                        storeDetailsData.data?.ReviewOverview?.RatingSum
                      }  (${
                        storeDetailsData.data?.ReviewOverview?.TotalReviews
                      }  ${t('storeDetails.rating')})`}
                    />
                    <MaterialIcon
                      name="keyboard-arrow-right"
                      color={colors.white}
                      size={13}
                      style={{lineHeight: 0}}
                    />
                  </Pressable>
                </View>
              </View>
            </View>
            <Pressable
              onPress={() => {
                refetchrefreshFollowStore();
              }}
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
          uri: BASE_URL + storeDetailsData.data?.StoreInfo?.CoverImage?.Url,
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
            onPress={() => {
              if (index === 0 || index === 3) {
                setSubCatId(-1);
              }
              setTab(index);
            }}
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
        <MainTab
          setCatProductId={setCatProductId}
          setSubCatId={setSubCatId}
          storeId={params?.storeId}
          subCatId={subCatId}
        />
      )}
      {tab == 1 && (
        <FlatList
          key={'#new'}
          onEndReached={loadMoreNew}
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
              ? () => <Loader size={'small'} color={colors.primary} />
              : null
          }
        />
      )}
      {tab == 2 && (
        <FlatList
          key={'#Offers'}
          onEndReached={loadMoreOffers}
          onEndReachedThreshold={0.7}
          contentContainerStyle={{
            paddingHorizontal: spacing.content,
            paddingTop: 20,
          }}
          numColumns={2}
          data={StoreOfferData?.pages
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
            isFetchingNextPageOffer
              ? () => <Loader size={'small'} color={colors.primary} />
              : null
          }
        />
      )}
      {tab == 3 && (
        <FlatList
          key={'#categories'}
          data={StoreMainData?.pages.map(page => page.data.Categories).flat()}
          numColumns={1}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{
            paddingHorizontal: spacing.content,
            paddingTop: 20,
          }}
          renderItem={({item, index}) => (
            <CategoryItem
              setCatProductId={setCatProductId}
              setSubCatId={setSubCatId}
              item={item}
            />
          )}
        />
      )}
      {tab == 4 && (
        <FlatList
          keyExtractor={(i, _) => _.toString()}
          ListHeaderComponent={
            <RatingFiltters
              style={{paddingHorizontal: spacing.content}}
              setSelectedFilter={setSelectedFilter}
              selectedFilter={selectedFilter}
              RatingSum={storeDetailsData.data.ReviewOverview.RatingSum}
              TotalReviews={storeDetailsData.data.ReviewOverview.TotalReviews}
            />
          }
          renderItem={ReviewList}
          data={storeReviewsData?.pages
            .map(page => page.data.StoreReviews.Items)
            .flat()}
          ListFooterComponent={
            isFetchingNextPageStoreReviews || isLoadingStoreReviews ? (
              <Loader size={'small'} color={colors.primary} />
            ) : null
          }
        />
      )}
      {tab == 5 &&
        (isSuccessSearch && !isLoadingStoreSearch ? (
          <FlatList
            keyExtractor={(i, _) => _.toString()}
            key={'#Search'}
            onEndReached={loadMoreSearch}
            onEndReachedThreshold={0.7}
            contentContainerStyle={{
              paddingHorizontal: spacing.content,
              paddingTop: 20,
            }}
            numColumns={2}
            renderItem={({item, index}) => (
              <ProductCard
                styleContainer={{
                  marginRight: index % 2 == 0 ? 10 : 0,
                }}
                {...item}
              />
            )}
            data={StoreSearchData?.pages
              .map(page => page.data.ProductSummary.Items)
              .flat()}
            ListFooterComponent={
              isFetchingNextPageSearch || isLoadingStoreSearch ? (
                <Loader size={'small'} color={colors.primary} />
              ) : null
            }
          />
        ) : (
          <Loader size={'small'} color={colors.primary} />
        ))}
      {tab == 6 &&
        (isLoadingProductsCategory ? (
          <View
            style={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20,
            }}>
            <Loader size={'large'} color={colors.primary} />
          </View>
        ) : (
          <FlatList
            key={'#Product_categories'}
            onEndReached={() => {
              if (hasNextPage) {
                fetchNextPage();
              }
            }}
            onEndReachedThreshold={0.7}
            contentContainerStyle={{
              paddingHorizontal: spacing.content,
              paddingTop: 20,
            }}
            numColumns={2}
            data={ProductsData?.pages
              .map(page => page.data.ProductsModel.Items)
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
              isFetchingNextPage
                ? () => <Loader size={'small'} color={colors.primary} />
                : null
            }
          />
        ))}
    </View>
  );
};

export default StoreDetails;
