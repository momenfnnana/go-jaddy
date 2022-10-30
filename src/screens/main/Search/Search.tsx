import React, {useState, useContext, useEffect, useMemo} from 'react';
import {
  Loader,
  ProductCard,
  RowProductCard,
  SearchHeader,
  Text,
} from 'components';
import {
  FlatList,
  Keyboard,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {colors, spacing} from 'theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import {useInfiniteQuery, useMutation} from '@tanstack/react-query';
import {getSearchResults} from 'services/Home';
import {UserContext} from 'context/UserContext';
import {useCurrency} from 'hook/useCurrency';
import {useRoute} from '@react-navigation/native';
import {HomeNavigationsType} from 'navigators/NavigationsTypes';
import {getCategoryProducts} from 'services/Category';

const FILTER_ICON_SIZE = 26;
type IshowListHandler = 'list' | 'grid';
const Search = () => {
  const {settings} = useContext(UserContext);
  const [searchText, setSearchText] = useState<string>('');
  const {params} = useRoute<HomeNavigationsType>();
  const [viewType, setViewType] = useState<IshowListHandler>('grid');
  const {currency} = useCurrency();
  const showListHandler = (value: IshowListHandler) => {
    setViewType(value);
  };

  const {
    data: Products,
    isRefetching: isRefetchingProductsCategory,
    refetch: refetchProductsCategory,
    isFetching: isFetchingProductsCategory,
    remove,
  } = useInfiniteQuery(
    [`productsCategory${(params as any)?.categoryId}`],
    ({pageParam}) =>
      getCategoryProducts({pageParam, categoryId: (params as any)?.categoryId}),
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
    if ((params as any)?.paramsType == 'category') {
      refetchProductsCategory();
      DismissKeyboard();
    }
    return () => remove();
  }, [params]);

  // const {mutate, isLoading, data} = useMutation(getSearchResults, {
  //   onSuccess: data => {
  //     return data;
  //   },
  //   onError: error => {
  //     return error;
  //   },
  // });

  const {
    data,
    isFetching,
    hasNextPage: hasNextPageReviews,
    fetchNextPage,
    refetch: refetchReviews,
    isFetchingNextPage,
    isRefetching: isRefetchingReviews,
  } = useInfiniteQuery(
    [`getSearchResults${searchText}`],
    ({pageParam}: any) =>
      getSearchResults({
        page: pageParam,
        pageSize: 5,
        term: searchText,
        Filters: null,
        CurrencyId: currency?.Id,
      }),
    {
      enabled: false,
      getNextPageParam: (lastPage: any) => {
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

  const SearchHandler = () => {
    if (
      searchText.length >
      parseInt(settings?.SearchSettings?.InstantSearchTermMinLength)
    ) {
      refetchReviews();
      // mutate({searchText, CurrencyId: currency?.Id});
    }
  };

  const DismissKeyboard = () => {
    Keyboard.dismiss();
  };
  const productsList = useMemo(() => {
    return data?.pages.map(page => page.data?.ProductsModel?.Items).flat();
  }, [data]);
  const productsModel = useMemo(() => {
    return data?.pages.map(page => page.data?.ProductsModel);
  }, [data]);

  if (
    isFetching ||
    (params?.paramsType == 'category' &&
      (isRefetchingProductsCategory || isFetchingProductsCategory))
  ) {
    return <Loader containerStyle={styles.loaderStyle} />;
  }

  return (
    <TouchableWithoutFeedback onPress={DismissKeyboard}>
      <View style={styles.container}>
        <SearchHeader
          value={searchText}
          setValue={setSearchText}
          onSubmitEditing={SearchHandler}
          autoFocus={true}
        />
        <View style={[styles.row, styles.resultsHeader]}>
          <View style={styles.row}>
            <Text tx="search.search-result-for" variant="smallRegular" />
            <Text
              text={` ${searchText || (params as any)?.title}`}
              variant="smallBold"
            />
          </View>
          <View style={[styles.row, styles.viewFilters]}>
            <Pressable
              style={[
                styles.viewIconContainer,
                {
                  backgroundColor:
                    viewType === 'list' ? colors.secondary : undefined,
                  marginRight: 10,
                },
              ]}
              onPress={() => showListHandler('list')}>
              <Feather
                name="list"
                size={18}
                color={viewType === 'list' ? colors.white : colors.grayMain}
              />
            </Pressable>
            <Pressable
              style={[
                styles.viewIconContainer,
                {
                  backgroundColor:
                    viewType === 'grid' ? colors.secondary : undefined,
                },
              ]}
              onPress={() => showListHandler('grid')}>
              <Ionicons
                name="grid-outline"
                size={18}
                color={viewType === 'grid' ? colors.white : colors.grayMain}
              />
            </Pressable>
          </View>
        </View>
        {viewType === 'grid' ? (
          <FlatList
            key={'_'}
            data={productsList}
            keyExtractor={item => item?.Id}
            contentContainerStyle={{
              paddingTop: spacing.large,
              paddingHorizontal: spacing.content,
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
          />
        ) : (
          <FlatList
            key={'#'}
            data={productsList}
            keyExtractor={item => item?.Id}
            contentContainerStyle={{
              paddingHorizontal: spacing.medium - 2,
            }}
            numColumns={1}
            renderItem={({item}) => (
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
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewFilters: {
    backgroundColor: colors.gray[1000],
    paddingVertical: spacing.tiny,
    paddingHorizontal: spacing.tiny,
    borderRadius: spacing.large,
    justifyContent: 'space-between',
  },
  viewIconContainer: {
    width: FILTER_ICON_SIZE,
    height: FILTER_ICON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: FILTER_ICON_SIZE * 0.5,
  },
  resultsHeader: {
    justifyContent: 'space-between',
    marginHorizontal: spacing.medium,
    marginTop: spacing.medium,
  },
  loaderStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
