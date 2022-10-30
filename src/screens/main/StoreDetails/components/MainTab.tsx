import {
  View,
  FlatList,
  useWindowDimensions,
  Image,
  Pressable,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useInfiniteQuery} from '@tanstack/react-query';
import {getStoreCategories} from 'services/Stores';
import {getCategoryProducts, getSubCategories} from 'services/Category';
import {colors, spacing} from 'theme';
import {Loader, ProductCard, Text} from 'components';
import {BASE_URL} from 'utils/Axios';

interface IMainTab {
  storeId: number | any;
  setSubCatId: (() => void) | any;
  setCatProductId: (() => void) | any;
  subCatId: number;
}

const MainTab = ({
  storeId,
  setSubCatId,
  subCatId,
  setCatProductId,
}: IMainTab) => {
  const {width} = useWindowDimensions();
  const {
    isLoading: isLoadingStoreMain,
    data: StoreMainData,
    isError: isErrorStoreMain,
    refetch: refetchStoreMain,
    isRefetching: isRefetchingrefetchStoreMain,
    remove: removeStoreMain,
    hasNextPage: hasNextPageStoreMain,
  } = useInfiniteQuery(
    ['getStoreMainTab'],
    ({pageParam}) => getStoreCategories({storeId: storeId, pageParam}),
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
    data: dataSubCat,
    isLoading: isLoadingSubCat,
    isSuccess: isSuccessSubCat,
    hasNextPage: hasNextPageSubCat,
    fetchNextPage: fetchNextPageSubCat,
    isFetchingNextPage: isFetchingNextPageSubCat,
    refetch: refetchSubCat,
  } = useInfiniteQuery(
    [`subCategories${subCatId}`],
    ({pageParam}) =>
      getSubCategories({categoryId: subCatId, pageParam, StoreId: storeId}),
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
    if (subCatId == -1 || subCatId == -2) {
    } else {
      refetchSubCat();
    }
  }, [subCatId]);

  if (subCatId == -1 && isLoadingStoreMain) {
    return (
      <View
        style={{
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 20,
        }}>
        <Loader size={'large'} color={colors.primary} />
      </View>
    );
  }

  if (subCatId != -1 && isLoadingSubCat) {
    return (
      <View
        style={{
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 20,
        }}>
        <Loader size={'large'} color={colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      key={'#main'}
      data={
        subCatId == -1
          ? StoreMainData?.pages.map(page => page.data.Categories).flat()
          : dataSubCat?.pages.map(page => page.data?.Categories).flat()
      }
      numColumns={2}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={{
        paddingHorizontal: spacing.content,
        paddingTop: 20,
      }}
      renderItem={({item, index}) => (
        <Pressable
          onPress={() => {
            if (item.HasSubCategories) {
              setSubCatId(item.Id);
            } else {
              setCatProductId(item.Id);
              setSubCatId(-2);
            }
          }}
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
            source={{uri: BASE_URL + item.Image?.Url}}
            style={{width: '100%', height: 90, marginTop: 10}}
            resizeMode="contain"
          />
        </Pressable>
      )}
    />
  );
};

export default MainTab;
