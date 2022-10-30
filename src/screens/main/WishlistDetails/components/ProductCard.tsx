import React, {useEffect} from 'react';
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
  const {mutate, isLoading, isSuccess} = useMutation(deleteWishlistItem);
  const deleteItem = () => {
    mutate(Id);
  };
  const navigateToProductDetails = () => {
    navigate('ProductDetails', {Id: ProductId} as any);
  };

  useEffect(() => {
    if (isSuccess) {
      if (filterItems) {
        filterItems(Id);
      }
    }
  }, [isSuccess]);

  return (
    <View style={[styles.container, {height: height * 0.155}]}>
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
        <View style={styles.row}>
          <AddCartIcon />
          <Text
            tx="product-details.add-to-cart"
            variant="smallRegular"
            color={colors.primary}
            style={styles.addToCartText}
          />
        </View>
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
          <Text text={Price.Price.toString()} />
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
    flex: 1,
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
