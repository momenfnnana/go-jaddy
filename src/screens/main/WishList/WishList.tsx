import React, {useLayoutEffect, useMemo, useState} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {AddHeaderBtn, BackButton, Loader} from 'components';
import {colors, spacing} from 'theme';
import {useQuery} from '@tanstack/react-query';
import {getWishlist} from 'services/Profile';
import {FreeWishlist, WishlistItem} from './components';
import {IWishListItem} from './types';

const WishList = () => {
  const {setOptions} = useNavigation();
  const [wishlistData, setWishlistData] = useState<IWishListItem[]>([]);
  const {data, isFetching, refetch} = useQuery(['getWishlist'], getWishlist, {
    onSuccess: data => {
      setWishlistData(data?.data?.Wishlists);
    },
  });
  const onPress = () => {
    const newArray: IWishListItem[] = [
      ...data?.data?.Wishlists,
      {
        Name: '',
        CreatedOn: new Date(),
        Id: 0,
        ModifiedOn: new Date(),
        Top4Products: [],
        WishlistLinesCount: 0,
        refreshItems: () => {},
      },
    ];
    setWishlistData(newArray);
  };

  const refreshItems = () => {
    refetch();
  };
  const removeEmptyItem = () => {
    setWishlistData(
      data?.data?.Wishlists?.filter((item: IWishListItem) => item?.Id !== 0),
    );
  };

  useLayoutEffect(() => {
    setOptions({
      headerLeft: () => <BackButton />,
      headerRight: () => (
        <AddHeaderBtn onPress={onPress} disabled={isFetching} />
      ),
    });
  }, [isFetching]);

  const WishListItemsToRender = useMemo(() => {
    if (wishlistData.length === 1) {
      return [
        ...wishlistData,
        {
          Name: '',
          Id: -1,
          WishlistLinesCount: -1,
          refreshItems: () => {},
          removeEmptyItem: () => {},
        },
      ];
    } else {
      return wishlistData.filter((element: IWishListItem) => element.Id !== -1);
    }
  }, [wishlistData]);

  if (isFetching) {
    return <Loader size={'large'} containerStyle={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={WishListItemsToRender}
        keyExtractor={item => item.Id.toString()}
        numColumns={2}
        ListEmptyComponent={<FreeWishlist />}
        renderItem={({item}) => (
          <WishlistItem
            {...item}
            refreshItems={refreshItems}
            removeEmptyItem={removeEmptyItem}
          />
        )}
      />
    </View>
  );
};

export default WishList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnContainer: {
    backgroundColor: colors.white + 18,
    padding: 8,
    borderRadius: spacing.small + 2,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
