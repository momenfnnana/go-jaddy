import React, {useContext, useEffect} from 'react';
import {useMutation} from '@tanstack/react-query';
import {AddCartIcon, TrashIcon} from 'assets/icons';
import {Loader, Text} from 'components';
import {useCurrency} from 'hook/useCurrency';
import {
  View,
  StyleSheet,
  Image as RNImage,
  useWindowDimensions,
  Pressable,
} from 'react-native';
import {deleteWishlistItem} from 'services/Profile';
import {colors, spacing} from 'theme';
import {ImageData} from 'types';
import {BASE_URL} from 'utils/Axios';
import {useNavigation} from '@react-navigation/native';
import {WishlistDetailsScreenNavigationProp} from 'navigators/NavigationsTypes';
import {addCartProducts} from 'services/Cart';
import {UserContext} from 'context/UserContext';
interface Price {
  RegularPrice: number;
  Price: number;
}
interface IProductCard {
  CategoryName: string;
  EnteredQuantity: number;
  Id: number;
  Image: ImageData;
  ProductId: number;
  ProductName: string;
  ShortDesc: string;
  Sku: string;
  Price: Price;
  filterItems?: (value: number) => void;
}

const ProductCard = ({
  ProductName,
  Image,
  CategoryName,
  Price,
  Id,
  ProductId,
  filterItems,
}: IProductCard) => {
  const {navigate} = useNavigation<WishlistDetailsScreenNavigationProp>();
  const {height} = useWindowDimensions();
  const {currency} = useCurrency();
  const {setUpdateProducts, updateProducts} = useContext(UserContext);
  const {mutate, isLoading} = useMutation(deleteWishlistItem, {
    onSuccess: data => {
      if (filterItems) {
        filterItems(Id);
      }
      return data;
    },
  });
  const deleteItem = () => {
    mutate(Id);
  };
  const navigateToProductDetails = () => {
    navigate('ProductDetails', {Id: ProductId} as any);
  };
  const {mutate: mutateAddToCart, isLoading: isLoadingAddToCart} = useMutation(
    addCartProducts,
    {
      onSuccess: () => {
        setUpdateProducts(!updateProducts);
      },
      onError: () => {
        navigate('ProductDetails', {Id: ProductId} as any);
      },
    },
  );
  const addtoCartHandler = () => {
    mutateAddToCart({
      ProductId,
      QuantityToAdd: 1,
    });
  };

  return (
    <View style={[styles.container, {height: height * 0.156}]}>
      <Pressable
        onPress={navigateToProductDetails}
        style={styles.productImageContainer}>
        <RNImage
          source={{uri: BASE_URL + Image?.Url}}
          style={styles.productImage}
          resizeMode="contain"
        />
      </Pressable>
      <View style={styles.productContent}>
        <Text text={ProductName} variant="smallRegular" numberOfLines={2} />
        <Text
          tx="wishlist.category"
          txOptions={{category: CategoryName}}
          color={colors.secondary}
          variant="xSmallRegular"
          style={styles.categoryName}
        />
        <Pressable onPress={addtoCartHandler} style={styles.row}>
          {isLoadingAddToCart ? <Loader size={'small'} /> : <AddCartIcon />}
          <Text
            tx="product-details.add-to-cart"
            variant="smallRegular"
            color={colors.primary}
            style={styles.addToCartText}
          />
        </Pressable>
      </View>
      <View style={styles.pricesContainer}>
        <View>
          <Text
            text={Price.RegularPrice.toString()}
            variant="xSmallLight"
            style={styles.prevPrice}
            color={colors.grayMainBolder}
            numberOfLines={1}
          />
          <Text text={Price.Price.toString()} numberOfLines={1} />
          <Text text={currency?.Symbol} />
        </View>
        <Pressable
          onPress={deleteItem}
          disabled={isLoading}
          style={[
            styles.TrashIconContainer,
            {borderColor: isLoading ? 'transparent' : colors.orangeDark},
          ]}>
          {isLoading ? <Loader size={'small'} /> : <TrashIcon />}
        </Pressable>
      </View>
    </View>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.normal,
    flexDirection: 'row',
    paddingVertical: spacing.normal,
    marginVertical: spacing.smaller,
    backgroundColor: colors.white,
    borderRadius: spacing.medium - 2,
  },
  productImageContainer: {
    flex: 0.3,
  },
  productImage: {
    flex: 1,
  },
  productContent: {
    flex: 0.6,
    paddingHorizontal: spacing.normal,
  },
  pricesContainer: {
    flex: 0.1,
    justifyContent: 'space-between',
  },
  prevPrice: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    lineHeight: spacing.normal,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addToCartText: {
    marginHorizontal: spacing.small,
  },
  categoryName: {
    marginVertical: spacing.medium,
  },
  TrashIconContainer: {
    borderWidth: 1,
    width: spacing.xLarge,
    height: spacing.xLarge,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: spacing.xLarge * 0.5,
  },
});
