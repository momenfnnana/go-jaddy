import {View, FlatList, RefreshControl, ViewStyle} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  WishlistDetailsScreenNavigationProp,
  ProfileStackProps,
} from 'navigators/NavigationsTypes';
import {BackButton, Loader} from 'components';
import {getWishlist, getWishlistDetails} from 'services/Profile';
import {useInfiniteQuery, useQuery} from '@tanstack/react-query';
import {colors} from 'theme';
import ProductCard from './components/ProductCard';
import {FreeWishlist} from '../WishList/components';
const fullPageStyle = {
  flex: 1,
} as ViewStyle;
const WishlistDetails = () => {
  const {setOptions} = useNavigation<WishlistDetailsScreenNavigationProp>();
  const {params} = useRoute<ProfileStackProps>();
  const [wishListData, setWishListData] = useState<any[]>();
  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    refetch,
    isFetchingNextPage,
    isRefetching,
  } = useInfiniteQuery(
    [`getWishlistDetails${params?.Id}`],
    ({pageParam}) =>
      getWishlistDetails({
        Id: params?.Id ? params?.Id : 0,
        pageParam: pageParam,
      }),
    {
      getNextPageParam: lastPage => {
        if (lastPage?.data?.Page < lastPage?.data?.TotalPages) {
          return lastPage?.data?.Page + 1;
        }
        return null;
      },
    },
  );
  const {refetch: refetchWishlist} = useQuery(['getWishlist'], getWishlist, {
    enabled: false,
  });
  const onRefresh = React.useCallback(() => {
    refetch();
    refetchWishlist();
  }, []);
  const loadMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const filterItems = (Id: number) => {
    setWishListData(wishListData?.filter(item => item?.Id !== Id));
    onRefresh();
  };
  const loaderStyle = {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle;
  useLayoutEffect(() => {
    setOptions({
      headerLeft: () => <BackButton />,
      headerTitle: params?.title,
    });
    return () => {
      setOptions({
        headerTitle: '',
      });
    };
  }, []);

  useEffect(() => {
    if (data?.pages) {
      setWishListData(
        data?.pages?.map(page => page.data?.Wishlist?.Items).flat(),
      );
    }
  }, [data?.pages]);

  if (isLoading) {
    return <Loader size={'large'} containerStyle={loaderStyle} />;
  }

  return (
    <View style={fullPageStyle}>
      <FlatList
        data={wishListData}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        keyExtractor={(i, _) => _.toString()}
        renderItem={({item}) => (
          <ProductCard {...item} filterItems={filterItems} />
        )}
        ListEmptyComponent={<FreeWishlist />}
        ListFooterComponent={
          isFetchingNextPage || isLoading ? (
            <Loader size={'small'} color={colors.primary} />
          ) : undefined
        }
        contentContainerStyle={{flex: 1}}
      />
    </View>
  );
};

export default WishlistDetails;
