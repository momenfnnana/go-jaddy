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
  Image,
  Keyboard,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {colors, spacing} from 'theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import {useInfiniteQuery} from '@tanstack/react-query';
import {getSearchResults} from 'services/Home';
import {UserContext} from 'context/UserContext';
import {useCurrency} from 'hook/useCurrency';
import {useRoute} from '@react-navigation/native';
import {HomeNavigationsType} from 'navigators/NavigationsTypes';
import {getCategoryProducts} from 'services/Category';
import {LogoSplash} from 'assets/images';
import Octicons from 'react-native-vector-icons/Octicons';
import ViewShow from 'components/ViewShow/ViewShow';

const FILTER_ICON_SIZE = 26;
export type IshowListHandler = 'list' | 'grid';
const Search = () => {
  const {settings} = useContext(UserContext);
  const [searchText, setSearchText] = useState<string>('');
  const [isCategory, setIsCategory] = useState<boolean>(false);
  const [categoryId, setCategoryId] = useState<number>(0);
  const [categoryName, setCategoryName] = useState<string>('');
  const {params} = useRoute<HomeNavigationsType>();
  const [viewType, setViewType] = useState<IshowListHandler>('grid');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [filterOptions, setFilterOptions] = useState(null);
  const {currency} = useCurrency();
  const showListHandler = (value: IshowListHandler) => {
    setViewType(value);
  };

  const {
    data: ProductsCategoryData,
    isRefetching: isRefetchingProductsCategory,
    refetch: refetchProductsCategory,
    isFetching: isFetchingProductsCategory,
    remove,
  } = useInfiniteQuery(
    [`productsCategory${(params as any)?.categoryId}`],
    ({pageParam}) =>
      getCategoryProducts({
        pageParam,
        categoryId: categoryId,
        Filters: filterOptions,
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
    if ((params as any)?.paramsType == 'category') {
      setIsCategory(true);
      if ((params as any)?.categoryId) {
        setCategoryId((params as any)?.categoryId);
        setCategoryName((params as any)?.title);
      }
      setTimeout(() => {
        refetchProductsCategory();
      }, 100);
      DismissKeyboard();
    }
    return () => remove();
  }, [params, (params as any)?.categoryId]);

  const {
    data,
    isFetching,
    refetch: refetchSearchResults,
  } = useInfiniteQuery(
    [`getSearchResults${searchText}`],
    ({pageParam}: any) =>
      getSearchResults({
        page: pageParam,
        pageSize: 5,
        term: searchText,
        Filters: filterOptions,
        CurrencyId: currency?.Id,
      }),
    {
      enabled: false,
      onSuccess: data => {
        setIsSubmitted(true);
        return data;
      },
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

  useEffect(() => {
    if ((params as any)?.paramsType == 'filter') {
      DismissKeyboard();
      if ((params as any)?.dataFilter) {
        setFilterOptions((params as any)?.dataFilter);
        if (isCategory) {
          console.log('here');
          setTimeout(() => {
            refetchProductsCategory();
          }, 200);
        } else {
          setTimeout(() => {
            refetchSearchResults();
          }, 200);
        }
        DismissKeyboard();
      }
    }
  }, [params]);

  const SearchHandler = () => {
    if (
      searchText.length >
      parseInt(settings?.SearchSettings?.InstantSearchTermMinLength)
    ) {
      setIsCategory(false);
      refetchSearchResults();
    }
  };

  const DismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const productsList = useMemo(() => {
    if (isCategory) {
      return ProductsCategoryData?.pages
        .map(page => page.data?.ProductsModel?.Items)
        .flat();
    }
    return data?.pages.map(page => page.data?.ProductsModel?.Items).flat();
  }, [data, ProductsCategoryData]);

  const facetsList = useMemo(() => {
    if (isCategory) {
      return ProductsCategoryData?.pages.map(page => page.data?.Facets).flat();
    }
    return data?.pages.map(page => page.data?.Facets).flat();
  }, [data, ProductsCategoryData]);

  const productsModel = useMemo(() => {
    if (isCategory) {
      return ProductsCategoryData?.pages.map(page => page.data?.ProductsModel);
    }
    return data?.pages.map(page => page.data?.ProductsModel);
  }, [data, ProductsCategoryData]);

  if (
    isFetching ||
    (params?.paramsType == 'category' &&
      (isRefetchingProductsCategory || isFetchingProductsCategory))
  ) {
    return <Loader containerStyle={styles.loaderStyle} />;
  }

  return (
    <View style={styles.container}>
      <SearchHeader
        route={(params as any)?.paramsType == 'category' ? 'Categories' : ''}
        value={searchText}
        setValue={setSearchText}
        onSubmitEditing={SearchHandler}
        autoFocus={
          (params as any)?.paramsType == 'category' ||
          (params as any)?.paramsType == 'filter'
            ? false
            : true
        }
        facetsList={facetsList}
        filterIcon={(facetsList as any)?.length > 0}
        Footer={
          filterOptions && (
            <Pressable
              onPress={() => {
                setFilterOptions(null);
                setTimeout(() => {
                  if (isCategory) {
                    refetchProductsCategory();
                  } else {
                    refetchSearchResults();
                  }
                }, 100);
              }}
              style={{
                marginTop: spacing.small,
                padding: spacing.smaller,
                backgroundColor: colors.red,
                borderRadius: spacing.small,
                alignSelf: 'flex-end',
              }}>
              <Text
                tx={'search.clear-filters'}
                color={colors.white}
                variant="smallRegular"
              />
            </Pressable>
          )
        }
      />
      {!!productsList?.length && (
        <View style={[styles.row, styles.resultsHeader]}>
          <View style={styles.row}>
            <Text
              tx={
                isCategory ? 'search.categoryTitle' : 'search.search-result-for'
              }
              variant="smallRegular"
            />
            <Text
              text={` ${isCategory ? categoryName : searchText}`}
              variant="smallBold"
            />
          </View>
          <ViewShow showListHandler={showListHandler} viewType={viewType} />
        </View>
      )}
      {!!productsList?.length ? (
        viewType === 'grid' ? (
          <FlatList
            key={'_'}
            data={productsList}
            keyExtractor={item => item?.Id}
            contentContainerStyle={{
              paddingTop: spacing.large,
              paddingHorizontal: spacing.content,
            }}
            numColumns={2}
            renderItem={({item, index}) => {
              return (
                <ProductCard
                  styleContainer={{
                    marginRight: index % 2 == 0 ? 10 : 0,
                  }}
                  {...item}
                  WishlistEnabled={
                    productsModel && productsModel[0].WishlistEnabled
                  }
                />
              );
            }}
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
        )
      ) : (
        <View style={styles.emptySearchResultsContainer}>
          {isSubmitted ? (
            <>
              <Octicons name="no-entry" color={colors.primary + 70} size={70} />
              <Text tx="search.no-search-results" />
            </>
          ) : (
            <>
              <Image source={LogoSplash} style={styles.emptyResultsLogo} />
              <Text
                tx="search.start-searching"
                variant="largeBold"
                color={colors.black + 99}
              />
            </>
          )}
        </View>
      )}
    </View>
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
  emptySearchResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyResultsLogo: {
    opacity: 0.5,
  },
});
