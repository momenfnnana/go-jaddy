import {useNavigation, useRoute} from '@react-navigation/native';
import {
  Loader,
  ProductCard,
  SearchHeader,
  Text,
  ReviewList,
  RateModal,
  ArrowIcon,
  RowProductCard,
} from 'components';

import {
  IStoresProps,
  StoresDetailsNavigationProp,
} from 'navigators/NavigationsTypes';
import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {View, Pressable, FlatList, Image, Animated, Share} from 'react-native';
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
import EmptyPage from 'components/EmptyPage/EmptyPage';
import {LogoSplash} from 'assets/images';
import {useLogged} from 'hook/useLogged';
import {useProtectedFunction} from 'hook/useProdectedFunction';
import ViewShow from 'components/ViewShow/ViewShow';
import {useCurrency} from 'hook/useCurrency';
import {UserContext} from 'context/UserContext';

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

const tabsName: string[] = [
  'main',
  'new',
  'offers',
  'categories',
  'review',
  'search',
  'products',
];
const StoreDetails = () => {
  const {params} = useRoute<IStoresProps>();
  const {protectedFunction} = useProtectedFunction();
  const [isRateModalShown, setIsRateModalShown] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [viewType, setViewType] = useState<string>('grid');
  const [tab, setTab] = useState<string>(tabsName[0]);
  const [isFollowed, setFollowed] = useState<boolean>(false);
  const [subCatId, setSubCatId] = useState<number>(-1);
  const [catProductId, setCatProductId] = useState<number>(-1);
  const [selectedFilter, setSelectedFilter] = useState<Ifiltter>({
    ratings: [],
    withImage: false,
  });
  const {currency} = useCurrency();
  const {settings} = useContext(UserContext);
  const {t} = useTranslation();
  const scrollOffsetY = useRef(new Animated.Value(0)).current;
  const Max_Header_Height = 100;
  const Min_Header_Height = 0;
  const Scroll_Distance = 100;
  const animatedHeaderHeight = scrollOffsetY.interpolate({
    inputRange: [0, Scroll_Distance],
    outputRange: [Max_Header_Height, Min_Header_Height],
    extrapolate: 'clamp',
  });

  const showListHandler = (value: string) => {
    setViewType(value);
  };

  const {
    data: storeReviewsData,
    isLoading: isLoadingStoreReviews,
    refetch: refetchStoreReviews,
    isFetchingNextPage: isFetchingNextPageStoreReviews,
  } = useInfiniteQuery(
    [`perantCategories${params?.storeId}`],
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
    isFetching: isLoadingStoreDetails,
    data: storeDetailsData,
    isError: isErrorStoreDetails,
  } = useQuery(
    [`getStoreDetails${params?.storeId}`],
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
        isFollow: !isFollowed,
      }),
    {
      enabled: false,
      onSuccess() {
        setFollowed(!isFollowed);
      },
    },
  );

  const {
    data: StoreMainData,
    isFetching: isLoadingStoreMain,
    refetch: refetchStoreMain,
  } = useInfiniteQuery(
    [`getStoreMainTab${params?.storeId}`],
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
    isFetching: isLoadingStoreNews,
    refetch: refetchStoreNews,
  } = useInfiniteQuery(
    [`getStoreNewTab${params?.storeId}`],
    ({pageParam}) => getStoreNewProducts({pageParam, storeId: params?.storeId}),
    {
      enabled: false,
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
    refetch: refetchOfferData,
    hasNextPage: hasNextPageOffer,
    isFetchingNextPage: isFetchingNextPageOffer,
    fetchNextPage: fetchNextPageOffer,
    isFetching: isLoadingStoreOfferes,
  } = useInfiniteQuery(
    [`getStoreOfferTab${params?.storeId}`],
    ({pageParam}) =>
      getStoreOfferProducts({pageParam, storeId: params?.storeId}),
    {
      enabled: false,
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
    isFetching: isLoadingStoreSearch,
    data: StoreSearchData,
    refetch: refetchStoreSearch,
    hasNextPage: hasNextPageSearch,
    isFetchingNextPage: isFetchingNextPageSearch,
    fetchNextPage: fetchNextPageSearch,
  } = useInfiniteQuery(
    [`getStoreSearchTab${params?.storeId}${searchText}`],
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
        setTab(tabsName[5]);
      },
    },
  );

  const {
    data: ProductsData,
    isFetching: isFetchingProductsCategory,
    refetch: refetchProductsCategory,
    isLoading: isLoadingProductsCategory,
    remove,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    [`productsCategory${catProductId}${params?.storeId}`],
    ({pageParam}) =>
      getCategoryProducts({
        pageParam,
        categoryId: catProductId,
        StoreId: params?.storeId,
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

  const productsModel = useMemo(() => {
    return ProductsData?.pages.map(page => page.data?.ProductsModel);
  }, [ProductsData]);

  useEffect(() => {
    if (subCatId == -2) {
      setTab(tabsName[6]);
      refetchProductsCategory();
    }
  }, [subCatId]);

  useEffect(() => {
    refetchStoreReviews();
  }, [selectedFilter]);

  const SearchHandler = () => {
    setTab(tabsName[5]);
    refetchStoreSearch();
  };

  if (isLoadingStoreDetails || isLoadingStoreMain) {
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

  const isExistCoverImage = storeDetailsData.data?.StoreInfo?.CoverImage;
  const sourceCover = !isExistCoverImage
    ? LogoSplash
    : {
        uri: BASE_URL + isExistCoverImage?.Url,
      };
  const onPressShare = async () => {
    await Share.share({
      url: 'https://www.google.com/',
    });
  };
  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <SearchHeader
        value={searchText}
        setValue={setSearchText}
        onSubmitEditing={SearchHandler}
        filterIcon={false}
        onPressRightIcon={onPressShare}
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
                    onPress={() => setTab(tabsName[4])}
                    style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text
                      // style={{lineHeight: 0}}
                      color={colors.white}
                      variant="xSmallLight"
                      tx={` ${
                        storeDetailsData.data?.ReviewOverview?.RatingSum
                      }  (${
                        storeDetailsData.data?.ReviewOverview?.TotalReviews
                      }  ${t('storeDetails.rating')})`}
                    />
                    <ArrowIcon
                      name="keyboard-arrow-right"
                      color={colors.white}
                      size={13}
          
                    />
                  </Pressable>
                </View>
              </View>
            </View>
            <Pressable
              onPress={() => {
                protectedFunction({func: () => refetchrefreshFollowStore()});
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
      <Animated.Image
        resizeMode="cover"
        style={{
          height: animatedHeaderHeight,
          width: '100%',
          opacity: isExistCoverImage ? 1 : 0.5,
        }}
        source={sourceCover}
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
              if (index === 1) {
                refetchStoreNews();
              } else if (index === 2) {
                refetchOfferData();
              }
              setTab(tabsName[index]);
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
              color={tab == tabsName[index] ? colors.secondary : colors.black}
              variant={tab == tabsName[index] ? 'smallBold' : 'smallRegular'}
              style={{marginBottom: 12}}
            />
            {tab == tabsName[index] && (
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
      {tab == tabsName[0] && (
        <MainTab
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollOffsetY}}}],
            {useNativeDriver: false},
          )}
          setCatProductId={setCatProductId}
          setSubCatId={setSubCatId}
          storeId={params?.storeId}
          subCatId={subCatId}
        />
      )}
      {tab == tabsName[1] && (
        <FlatList
          ListHeaderComponent={isLoadingStoreNews ? <Loader /> : null}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollOffsetY}}}],
            {useNativeDriver: false},
          )}
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
          ListEmptyComponent={
            <EmptyPage
              descritopn="EmptyPage.product-description"
              title="EmptyPage.product-title"
            />
          }
          renderItem={({item, index}) => (
            <ProductCard
              styleContainer={{
                marginRight: index % 2 == 0 ? 10 : 0,
              }}
              WishlistEnabled={
                StoreNewData?.pages
                  .map(page => page.data.ProductSummary)
                  .flat()[0].WishlistEnabled
              }
              {...item}
            />
          )}
          ListFooterComponent={
            isFetchingNextPageNew ? () => <Loader size={'small'} /> : null
          }
        />
      )}
      {tab == tabsName[2] && (
        <FlatList
          ListHeaderComponent={isLoadingStoreOfferes ? <Loader /> : null}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollOffsetY}}}],
            {useNativeDriver: false},
          )}
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
          ListEmptyComponent={
            <EmptyPage
              descritopn="EmptyPage.product-description"
              title="EmptyPage.product-title"
            />
          }
          renderItem={({item, index}) => (
            <ProductCard
              styleContainer={{
                marginRight: index % 2 == 0 ? 10 : 0,
              }}
              {...item}
              WishlistEnabled={
                StoreOfferData?.pages
                  .map(page => page.data.ProductSummary)
                  .flat()[0].WishlistEnabled
              }
            />
          )}
          ListFooterComponent={
            isFetchingNextPageOffer ? () => <Loader size={'small'} /> : null
          }
        />
      )}
      {tab == tabsName[3] && (
        <FlatList
          ListHeaderComponent={isLoadingStoreMain ? <Loader /> : null}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollOffsetY}}}],
            {useNativeDriver: false},
          )}
          key={'#categories'}
          data={StoreMainData?.pages.map(page => page.data.Categories).flat()}
          numColumns={1}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{
            paddingHorizontal: spacing.content,
            paddingTop: 20,
          }}
          ListEmptyComponent={
            <EmptyPage
              descritopn="EmptyPage.product-description"
              title="EmptyPage.product-title"
            />
          }
          renderItem={({item}) => (
            <CategoryItem
              setCatProductId={setCatProductId}
              setSubCatId={setSubCatId}
              item={item}
            />
          )}
        />
      )}
      {tab == tabsName[4] && (
        <FlatList
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollOffsetY}}}],
            {useNativeDriver: false},
          )}
          keyExtractor={(i, _) => _.toString()}
          ListHeaderComponent={
            <RatingFiltters
              DisplayStoreReviews={storeDetailsData.data.DisplayStoreReviews}
              style={{paddingHorizontal: spacing.content}}
              setSelectedFilter={setSelectedFilter}
              selectedFilter={selectedFilter}
              RatingSum={storeDetailsData.data.ReviewOverview.RatingSum}
              TotalReviews={storeDetailsData.data.ReviewOverview.TotalReviews}
              onPressRate={() => {
                protectedFunction({func: () => setIsRateModalShown(true)});
              }}
            />
          }
          ListEmptyComponent={<EmptyPage title="EmptyPage.no-reviews-title" />}
          renderItem={ReviewList}
          data={storeReviewsData?.pages
            .map(page => page.data.StoreReviews.Items)
            .flat()}
          ListFooterComponent={
            isFetchingNextPageStoreReviews || isLoadingStoreReviews ? (
              <Loader size={'small'} />
            ) : null
          }
        />
      )}
      {tab == tabsName[5] && (
        <FlatList
          ListEmptyComponent={
            <EmptyPage
              descritopn="EmptyPage.product-description"
              title="EmptyPage.product-title"
              displayButton
            />
          }
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollOffsetY}}}],
            {useNativeDriver: false},
          )}
          data={StoreSearchData?.pages
            .map(page => page.data.ProductSummary.Items)
            .flat()}
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
              WishlistEnabled={
                StoreSearchData?.pages
                  .map(page => page.data.ProductSummary)
                  .flat()[0].WishlistEnabled
              }
            />
          )}
          ListFooterComponent={
            isFetchingNextPageSearch || isLoadingStoreSearch ? (
              <Loader size={'small'} />
            ) : null
          }
        />
      )}
      {tab == tabsName[6] &&
        (isLoadingProductsCategory ? (
          <View
            style={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20,
            }}>
            <Loader size={'large'} />
          </View>
        ) : (
          <>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: spacing.content,
                marginTop: spacing.large,
              }}>
              <Text tx="storeDetails.display-methods" variant="xSmallRegular" />
              <ViewShow showListHandler={showListHandler} viewType={viewType} />
            </View>
            {viewType == 'grid' ? (
              <FlatList
                onScroll={Animated.event(
                  [{nativeEvent: {contentOffset: {y: scrollOffsetY}}}],
                  {useNativeDriver: false},
                )}
                key={'#Product_categories_grid'}
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
                    WishlistEnabled={
                      ProductsData?.pages
                        .map(page => page.data.ProductsModel)
                        .flat()[0].WishlistEnabled
                    }
                    {...item}
                  />
                )}
                ListFooterComponent={
                  isFetchingNextPage ? () => <Loader size={'small'} /> : null
                }
              />
            ) : (
              <FlatList
                onScroll={Animated.event(
                  [{nativeEvent: {contentOffset: {y: scrollOffsetY}}}],
                  {useNativeDriver: false},
                )}
                key={'#Product_categories_list'}
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
                numColumns={1}
                data={ProductsData?.pages
                  .map(page => page.data.ProductsModel.Items)
                  .flat()}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => (
                  <RowProductCard
                    {...item}
                    currency={currency}
                    WishlistEnabled={
                      productsModel && productsModel[0].WishlistEnabled
                    }
                    SupportMultiWishlists={
                      settings?.ShoppingCartSettings?.SupportMultiWishlists
                    }
                  />
                )}
                ListFooterComponent={
                  isFetchingNextPage ? () => <Loader size={'small'} /> : null
                }
              />
            )}
          </>
        ))}
      <RateModal
        isRateModalShown={isRateModalShown}
        setIsRateModalShown={setIsRateModalShown}
        isStore
        StoreId={params?.storeId}
      />
    </View>
  );
};

export default StoreDetails;
