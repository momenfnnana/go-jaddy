import {useNavigation} from '@react-navigation/native';
import {DiscountIcon, ProductFavoriteIcon} from 'assets/icons';
import AddToFav from 'components/Modal/AddToFav';
import Text from 'components/Text';
import {HomeNavigationsType} from 'navigators/NavigationsTypes';
import React, {useState} from 'react';
import {View, StyleSheet, ImageBackground, Pressable} from 'react-native';
import {IProductInterface} from 'screens/main/Home/types';
import {colors, spacing} from 'theme';
import {BASE_URL} from 'utils/Axios';

const RowProductCard = (props: IProductInterface) => {
  const {
    Image: ImageResponse,
    Price,
    Badges,
    Name,
    currency,
    CategoryName,
    SupportMultiWishlists,
    WishlistEnabled,
    Id,
  } = props;
  const {navigate} = useNavigation<HomeNavigationsType>();
  const [isAddToCollectionShown, setIsAddToCollectionShown] =
    useState<boolean>(false);
  const DiscountBadge = Badges.find(item => item?.Style === 5);
  const isNewBadge = Badges.find(item => item?.Style === 2);
  const navigateToProduct = () => {
    navigate('ProductDetails', {...props});
  };
  const showAddToWishList = () => {
    setIsAddToCollectionShown(true);
  };
  const onCloseAddToCollection = () => {
    setIsAddToCollectionShown(false);
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={navigateToProduct} style={styles.imageContainer}>
        <ImageBackground
          source={{uri: `${BASE_URL}${ImageResponse?.Url}`}}
          resizeMode="contain"
          style={styles.image}>
          {SupportMultiWishlists && WishlistEnabled && (
            <View style={styles.favoriteIconContainer}>
              <ProductFavoriteIcon
                stroke={colors.tabsColor}
                onPress={showAddToWishList}
              />
            </View>
          )}
          {Price?.HasDiscount && DiscountBadge?.Label && (
            <View style={styles.discountBadgeContainer}>
              <DiscountIcon />
              <Text
                style={styles.discountBadge}
                variant="xSmallLight"
                text={DiscountBadge?.Label}
              />
            </View>
          )}
          {isNewBadge && (
            <Text
              style={styles.isNewBadge}
              variant="xSmallLight"
              text={isNewBadge?.Label}
            />
          )}
        </ImageBackground>
      </Pressable>
      <View style={styles.productNameContainer}>
        <Text
          text={Name}
          variant="mediumRegular"
          color={colors.tabsColor}
          numberOfLines={2}
        />
        <View style={styles.row}>
          <Text
            tx="product-details.category"
            variant="mediumRegular"
            color={colors.orange}
            numberOfLines={2}
            style={styles.categoryHint}
          />
          <Text
            text={CategoryName}
            variant="mediumRegular"
            color={colors.tabsColor}
            numberOfLines={2}
          />
        </View>
      </View>
      <View style={styles.priceContainer}>
        {Price?.HasDiscount && (
          <Text
            text={Price?.RegularPrice}
            variant="xSmallLight"
            style={styles.prevPrice}
            color={colors.grayMainBolder}
          />
        )}
        <Text
          text={Price?.Price}
          variant="mediumBold"
          color={colors.orange}
          numberOfLines={1}
        />
        <Text
          text={currency?.Symbol}
          variant="xSmallRegular"
          color={colors.tabsColor}
          style={styles.currency}
        />
      </View>
      <AddToFav
        isAddToCollectionShown={isAddToCollectionShown}
        setIsAddToCollectionShown={setIsAddToCollectionShown}
        ProductId={Id}
      />
    </View>
  );
};

export default RowProductCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 103,
    borderRadius: spacing.medium - 2,
    overflow: 'hidden',
    backgroundColor: colors.secondaryBackground2,
    marginTop: spacing.normal - 1,
  },
  image: {
    flex: 1,
    padding: 5,
    backgroundColor: colors.white,
  },
  imageContainer: {
    flex: 0.25,
  },
  productNameContainer: {
    flex: 0.5,
    paddingHorizontal: spacing.normal - 1,
  },
  priceContainer: {
    flex: 0.25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currency: {
    textTransform: 'uppercase',
  },
  prevPrice: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryHint: {
    marginHorizontal: spacing.tiny,
  },
  discountBadgeContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    paddingHorizontal: spacing.smaller,
    paddingVertical: spacing.tiny,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: colors.orangeDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  discountBadge: {
    color: colors.white,
  },
  isNewBadge: {
    backgroundColor: colors.orange,
    position: 'absolute',
    top: 5,
    right: 5,
    color: colors.white,
    paddingHorizontal: spacing.smaller,
    paddingVertical: spacing.tiny,
    borderRadius: 5,
    overflow: 'hidden',
  },
  favoriteIconContainer: {
    height: 40,
  },
});
