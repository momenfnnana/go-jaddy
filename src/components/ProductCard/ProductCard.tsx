import {useNavigation} from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {DiscountIcon, FavoriteIcon, StarFilledIcon} from 'assets/icons';
import {Text} from 'components';
import {useCurrency} from 'hook/useCurrency';
import {HomeNavigationsType} from 'navigators/NavigationsTypes';
import {HomeRoutes} from 'navigators/RoutesTypes';
import React from 'react';
import {
  View,
  ImageBackground,
  StyleSheet,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import {IProductInterface} from 'screens/main/Home/types';
import {colors, spacing} from 'theme';
import {BASE_URL} from 'utils/Axios';

interface IProductNaviagtion
  extends NativeStackNavigationProp<HomeRoutes, 'Home'> {}

const ProductCard = (props: IProductInterface) => {
  const {
    Image: ImageResponse,
    Price,
    Badges,
    Name,
    RatingSum,
    CategoryName,
    SupportMultiWishlists,
    WishlistEnabled,
    styleContainer,
  } = props;
  const {currency} = useCurrency();
  const {navigate} = useNavigation<HomeNavigationsType>();
  const DiscountBadge = Badges.find(item => item?.Style === 5);
  const isNewBadge = Badges.find(item => item?.Style === 2);
  const {width} = useWindowDimensions();
  return (
    <Pressable
      onPress={() => navigate('ProductDetails', {...props})}
      style={[styles.container, {width: width / 2 - 20}, styleContainer]}>
      <ImageBackground
        source={{uri: `${BASE_URL}${ImageResponse?.Url}`}}
        resizeMode="contain"
        style={styles.Imagecontainer}>
        <View style={styles.topIconsContainer}>
          {SupportMultiWishlists && WishlistEnabled && (
            <FavoriteIcon stroke={colors.tabsColor} />
          )}
          {Price?.HasDiscount && DiscountBadge?.Label && (
            <View style={styles.discountIcon}>
              <DiscountIcon />
              <Text
                variant="xSmallLight"
                text={DiscountBadge?.Label}
                color={colors.white}
              />
            </View>
          )}
        </View>
        {isNewBadge && (
          <Text
            style={styles.isNewBadge}
            variant="xSmallLight"
            text={isNewBadge?.Label}
          />
        )}
      </ImageBackground>
      <View style={styles.row}>
        <Text
          text={Name}
          variant="xSmallRegular"
          color={colors.tabsColor}
          numberOfLines={1}
          // adjustsFontSizeToFit
          lineBreakMode="clip"
          style={{flex: 1}}
        />
        <View style={styles.priceContainer}>
          {/* <Text
            text={prevPrice}
            variant="xSmallLight"
            style={styles.prevPrice}
            color={colors.grayMainBolder}
          /> */}
          <Text
            text={Price?.Price}
            variant="smallBold"
            color={colors.orange}
            style={{flex: 1, width: 16}}
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
      <View style={styles.rateAndColorsContainer}>
        <StarFilledIcon color={colors.orange} />
        <Text
          text={RatingSum.toString()}
          variant="xSmallRegular"
          style={styles.rate}
        />
        <View style={styles.verticalLine} />
        {/* <View style={styles.colorsContainer}>
          {props?.ColorAttributes &&
            props?.ColorAttributes &&
            props?.ColorAttributes.map((item, index) => (
              <View
                key={index.toString()}
                style={[
                  styles.colorItem,
                  {
                    backgroundColor: item,
                    left: spacing.smaller * (index + 1),
                  },
                ]}
              />
            ))}
        </View> */}
      </View>
    </Pressable>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  container: {
    // width: 165,
    height: 268,
    // margin: 5,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  Imagecontainer: {
    // width: 165,
    width: '100%',
    height: 201,
    backgroundColor: colors.white,
  },
  topIconsContainer: {
    position: 'absolute',
    flexDirection: 'row',
    top: spacing.medium + 2,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    alignSelf: 'center',
  },
  discountIcon: {
    backgroundColor: colors.orange,
    width: 31,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: spacing.tiny + 1,
  },
  newsContainer: {
    position: 'absolute',
    bottom: spacing.medium + 2,
    right: spacing.medium + 2,
    backgroundColor: colors.orangeDark,
    paddingHorizontal: spacing.small,
    borderRadius: spacing.tiny + 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceContainer: {},
  prevPrice: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  currency: {
    textTransform: 'uppercase',
  },
  rateAndColorsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verticalLine: {
    height: '100%',
    width: 2,
    backgroundColor: colors.reloadColor,
  },
  rate: {
    marginHorizontal: spacing.smaller,
  },
  colorsContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  colorItem: {
    width: spacing.medium,
    height: spacing.medium,
    borderRadius: spacing.medium * 0.5,
    position: 'absolute',
    borderWidth: 1,
    borderColor: colors.white,
  },
  isNewBadge: {
    backgroundColor: colors.orange,
    position: 'absolute',
    bottom: 10,
    // left: 10,
    color: colors.white,
    paddingHorizontal: spacing.smaller,
    paddingVertical: spacing.tiny,
    borderRadius: 5,
    overflow: 'hidden',
  },
});
