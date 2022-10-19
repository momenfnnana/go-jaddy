import React, {useLayoutEffect, useMemo, useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  useWindowDimensions,
  Pressable,
  FlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {BackButton, Button, Loader, Text} from 'components';
import {FreeWishlistIcon} from 'assets/images';
import {colors, spacing} from 'theme';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useQuery} from '@tanstack/react-query';
import {getWishlist} from 'services/Profile';
import {BASE_URL} from 'utils/Axios';

interface IAddBtn {
  onPress: () => void;
}
interface ITop4Products {
  DetailUrl: string;
  Id: number;
  Image: {
    Id: number;
    ThumbUrl: string;
    Title: string;
    Url: string;
  };
  Name: string;
  ShortDescription: string;
}
interface IWishListItem {
  Name: string;
  CreatedOn: Date;
  Id: number;
  ModifiedOn: Date;
  Top4Products: ITop4Products[];
  WishlistLinesCount: number;
}
const ITEM_SIZE: number = 163;

const AddBtn = ({onPress}: IAddBtn) => (
  <Pressable onPress={onPress} style={styles.addBtnContainer}>
    <AntDesign name="plus" color={colors.white} size={25} />
  </Pressable>
);

const FreeWishlist = () => {
  const {width} = useWindowDimensions();
  const {navigate} = useNavigation();
  return (
    <View>
      <Image source={FreeWishlistIcon} style={styles.image} />
      <Text
        tx="wishlist.free-wishlist"
        variant="largeBold"
        center
        top={'xLarge'}
        bottom={'medium'}
      />
      <Text
        tx="wishlist.free-wishlist-description"
        variant="smallLight"
        center
        style={{width: width * 0.7}}
      />
      <Button
        title="wishlist.discover-products"
        style={[styles.discoverProductsBtn, {width: width * 0.5}]}
        onPress={() => navigate('HomeStack')}
      />
    </View>
  );
};

const WishlistItem = ({Name, Top4Products, ...rest}: IWishListItem) => {
  console.log({Top4Products: Top4Products.length});
  // const [products, setProducts] = useState<ITop4Products[]>(Top4Products);
  const products = useMemo(() => {
    for (let index = 0; index < Top4Products.length; index++) {
      const element = Top4Products[index];
    }
    // const newArr = Top4Products
    return Top4Products;
    // EmptyItemImage
  }, [Top4Products]);
  return (
    <View style={styles.wishlistItemContainer}>
      <View style={styles.wishlistItemContentContainer}>
        <FlatList
          data={products}
          keyExtractor={item => item.Id.toString()}
          numColumns={2}
          renderItem={({item}) => {
            return (
              <View>
                <Image
                  source={{uri: `${BASE_URL}${item.Image.Url}`}}
                  style={styles.productImage}
                />
              </View>
            );
          }}
        />
      </View>
      <Text text={Name} />
    </View>
  );
};

const WishList = () => {
  const {setOptions, navigate, goBack} = useNavigation();
  const {width} = useWindowDimensions();
  const onPress = () => {
    console.log('onPress');
  };
  const {data, isLoading} = useQuery(['getWishlist'], getWishlist);
  useLayoutEffect(() => {
    setOptions({
      headerLeft: () => <BackButton />,
      headerRight: () => <AddBtn onPress={onPress} />,
    });
  }, []);

  if (isLoading) {
    return <Loader size={'large'} containerStyle={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      {data?.data?.Wishlists?.length > 0 ? (
        <FlatList
          data={data?.data?.Wishlists}
          keyExtractor={item => item?.Id}
          numColumns={2}
          renderItem={({item}) => <WishlistItem {...item} />}
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
  image: {
    width: 190,
    height: 159,
  },
  discoverProductsBtn: {
    alignSelf: 'center',
    marginTop: spacing.xxxLarge + 3,
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
  wishlistItemContainer: {
    width: '50%',
    padding: 15,
  },
  wishlistItemContentContainer: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: spacing.small + 2,
    overflow: 'hidden',
  },
  productImage: {
    width: ITEM_SIZE * 0.5,
    height: ITEM_SIZE * 0.5,
  },
});
