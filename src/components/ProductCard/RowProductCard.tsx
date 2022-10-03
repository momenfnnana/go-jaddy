import {DiscountIcon, FavoriteIcon} from 'assets/icons';
import Text from 'components/Text';
import React from 'react';
import {View, StyleSheet, ImageBackground} from 'react-native';
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
  } = props;
  const DiscountBadge = Badges.find(item => item?.Style === 5);
  const isNewBadge = Badges.find(item => item?.Style === 2);

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageBackground
          source={{uri: `${BASE_URL}${ImageResponse?.Url}`}}
          style={styles.image}>
          {SupportMultiWishlists && WishlistEnabled && (
            <FavoriteIcon stroke={colors.tabsColor} />
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
      </View>
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
        <Text
          text={Price?.RegularPrice}
          variant="xSmallLight"
          style={styles.prevPrice}
          color={colors.grayMainBolder}
        />
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
});
