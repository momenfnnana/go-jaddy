import React, {useEffect, useLayoutEffect, useState} from 'react';
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
  const {data, isLoading, refetch} = useQuery(['getWishlist'], getWishlist);
  const onPress = () => {
    const newArray: IWishListItem[] = [
      {
        Name: '',
        CreatedOn: new Date(),
        Id: 0,
        ModifiedOn: new Date(),
        Top4Products: [],
        WishlistLinesCount: 0,
        refreshItems: () => {},
      },
      ...data?.data?.Wishlists,
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
      headerRight: () => <AddHeaderBtn onPress={onPress} />,
    });
  }, []);

  useEffect(() => {
    if (data?.data?.Wishlists) {
      setWishlistData(data?.data?.Wishlists);
    }
  }, [data?.data?.Wishlists]);

  if (isLoading) {
    return <Loader size={'large'} containerStyle={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      {wishlistData?.length > 0 ? (
        <FlatList
          data={wishlistData}
          keyExtractor={item => item.Id.toString()}
          numColumns={2}
          renderItem={({item}) => (
            <WishlistItem
              {...item}
              refreshItems={refreshItems}
              removeEmptyItem={removeEmptyItem}
            />
          )}
        />
      ) : (
        <FreeWishlist />
      )}
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
