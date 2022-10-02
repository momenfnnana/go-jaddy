import {useNavigation} from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {DiscountIcon, FavoriteIcon, StarFilledIcon} from 'assets/icons';
import {Text} from 'components';
import {HomeNavigationsType} from 'navigators/NavigationsTypes';
import {HomeRoutes} from 'navigators/RoutesTypes';
import React from 'react';
import {View, ImageBackground, StyleSheet, Pressable} from 'react-native';
import {IProductInterface} from 'screens/main/Home/types';
import {colors, spacing} from 'theme';
import {BASE_URL} from 'utils/Axios';

const ProductCard = (props: IProductInterface) => {
  const {
    // title,
    Image,
    Price,
    Badges,
    AddedToCart,
    Name,
    RatingSum,
    // isHaveDiscount,
    // discountValue,
    // acttualPrice,
    // prevPrice,
    // currency,
    // rate,
    // productColors,
    // isNews,
    // isFav,
  } = props;

  const {navigate} = useNavigation<HomeNavigationsType>();
  return (
    <Pressable
      onPress={() => navigate('ProductDetails', {...props})}
      style={styles.container}>
      <ImageBackground
        source={{uri: `${BASE_URL}${Image.File?.url}`}}
        style={styles.Imagecontainer}>
        <View style={styles.topIconsContainer}>
          <FavoriteIcon stroke={colors.tabsColor} />
          {Price?.HasDiscount && (
            <View style={styles.discountIcon}>
              <DiscountIcon />
              <Text
                text={`${Price?.SavingPercent}%`}
                variant="smallBold"
                color={colors.white}
              />
            </View>
          )}
        </View>
        {Badges[0]?.Label === 'New' && (
          <View style={styles.newsContainer}>
            <Text tx="home.news" color={colors.white} />
          </View>
        )}
      </ImageBackground>
      <View style={styles.row}>
        <Text
          text={Name}
          variant="xSmallRegular"
          color={colors.tabsColor}
          numberOfLines={2}
          style={{width: '80%'}}
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
          {/* <Text
            text={currency}
            variant="xSmallRegular"
            color={colors.tabsColor}
            style={styles.currency}
          /> */}
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
        <View style={styles.colorsContainer}>
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
        </View>
      </View>
    </Pressable>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  container: {
    width: 165,
    height: 268,
    margin: 5,
  },
  Imagecontainer: {
    width: 165,
    height: 201,
  },
  topIconsContainer: {
    position: 'absolute',
    flexDirection: 'row',
    top: spacing.medium + 2,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
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
});
