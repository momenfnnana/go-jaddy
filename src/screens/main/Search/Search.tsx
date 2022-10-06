import React, {useState, useContext} from 'react';
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
import {useMutation} from '@tanstack/react-query';
import {getSearchResults} from 'services/Home';
import NetworkErrorScreen from 'screens/NetworkErrorScreen';
import {UserContext} from 'context/UserContext';
import {useCurrency} from 'hook/useCurrency';

const FILTER_ICON_SIZE = 26;
type IshowListHandler = 'list' | 'grid';
const Search = () => {
  const {settings} = useContext(UserContext);
  const [searchText, setSearchText] = useState<string>('');
  const [viewType, setViewType] = useState<IshowListHandler>('grid');
  const {currency} = useCurrency();
  const showListHandler = (value: IshowListHandler) => {
    setViewType(value);
  };

  const {mutate, isLoading, isError, error, isSuccess, data} = useMutation(
    getSearchResults,
    {
      onSuccess: data => {
        return data;
      },
      onError: error => {
        return error;
      },
    },
  );

  const SearchHandler = () => {
    if (
      searchText.length >
      parseInt(settings?.SearchSettings?.InstantSearchTermMinLength)
    ) {
      mutate({searchText, CurrencyId: currency?.Id});
    }
  };

  const DismissKeyboard = () => {
    Keyboard.dismiss();
  };

  if (isLoading) {
    return <Loader containerStyle={styles.loaderStyle} />;
  }

  if (isError) {
    return (
      <NetworkErrorScreen
        onPress={() => mutate({searchText, CurrencyId: currency?.Id})}
      />
    );
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
            <Text text={` ${searchText}`} variant="smallBold" />
          </View>
          <View style={[styles.row, styles.viewFilters]}>
            <Pressable
              style={[
                styles.viewIconContainer,
                {
                  backgroundColor:
                    viewType === 'list' ? colors.secondary : undefined,
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
        <FlatList
          data={data?.data?.ProductsModel?.Items}
          keyExtractor={item => item?.Id}
          contentContainerStyle={{
            paddingHorizontal: spacing.medium - 2,
          }}
          numColumns={2}
          renderItem={({item}) =>
            viewType === 'grid' ? (
              <ProductCard {...item} />
            ) : (
              <RowProductCard
                {...item}
                currency={currency}
                WishlistEnabled={data?.data?.ProductsModel?.WishlistEnabled}
                SupportMultiWishlists={
                  settings?.ShoppingCartSettings?.SupportMultiWishlists
                }
              />
            )
          }
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewFilters: {
    backgroundColor: colors.gray[1000],
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.tiny,
    borderRadius: spacing.large,
    justifyContent: 'space-between',
    flex: 0.25,
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
