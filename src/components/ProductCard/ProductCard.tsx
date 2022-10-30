import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  ImageBackground,
  StyleSheet,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import {useNavigation, useNavigationState} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useMutation} from '@tanstack/react-query';
import {DiscountIcon, ProductFavoriteIcon, StarFilledIcon} from 'assets/icons';
import {Text, AddToFav} from 'components';
import {useCurrency} from 'hook/useCurrency';
import {HomeNavigationsType} from 'navigators/NavigationsTypes';
import {HomeRoutes} from 'navigators/RoutesTypes';
import {IProductInterface} from 'screens/main/Home/types';
import {postAddToWishlist} from 'services/Home';
import {colors, spacing} from 'theme';
import {BASE_URL} from 'utils/Axios';
import {useTranslation} from 'react-i18next';

const CARD_SIZE: number = 43;

const ProductCard = (props: IProductInterface) => {
  const {
    Image: ImageResponse,
    Price,
    Badges,
    Name,
    RatingSum,
    CategoryName,
    WishlistEnabled,
    styleContainer,
    Id,
    ColorAttributes,
  } = props;

  const {currency} = useCurrency();
  const {navigate, setParams} = useNavigation<HomeNavigationsType>();
  const routes = useNavigationState(state => state.routes);
  const {t} = useTranslation();
  const [isAddToCollectionShown, setIsAddToCollectionShown] =
    useState<boolean>(false);

  const DiscountBadge = Badges?.find(item => item?.Style === 5);
  const isNewBadge = Badges?.find(item => item?.Style === 2);
  const {width} = useWindowDimensions();
  const currentRoute = routes[routes.length - 1].name;

  const {
    mutate: mutateAddToWishlist,
    isLoading: isLoadingAddToWishlist,
    isSuccess: isSuccessAddToWishlist,
  } = useMutation(postAddToWishlist, {
    onSuccess: data => {
      return data;
    },
    onError: error => {
      return error;
    },
  });
  const navigateToProduct = () => {
    if (currentRoute === 'ProductDetails') {
      setParams({...props});
    }
    navigate('ProductDetails', {...props});
  };

  const onCloseAddToCollection = () => {
    setIsAddToCollectionShown(false);
  };
  const showAddToWishList = () => {
    setIsAddToCollectionShown(true);
  };

  useEffect(() => {
    if (!isLoadingAddToWishlist && isSuccessAddToWishlist) {
      onCloseAddToCollection();
    }
  }, [isLoadingAddToWishlist, isSuccessAddToWishlist]);

  return (
    <>
      <Pressable
        onPress={navigateToProduct}
        style={[styles.container, {width: width / 2 - 20}, styleContainer]}>
        <ImageBackground
          source={{uri: `${BASE_URL}${ImageResponse?.Url}`}}
          resizeMode="contain"
          style={styles.Imagecontainer}>
          <View style={styles.topIconsContainer}>
            {WishlistEnabled && (
              <View style={styles.favoriteIconContainer}>
                <ProductFavoriteIcon
                  stroke={colors.tabsColor}
                  onPress={showAddToWishList}
                />
              </View>
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
            numberOfLines={2}
            lineBreakMode="clip"
            style={{flex: 1}}
          />
          <View style={styles.priceContainer}>
            {Price?.HasDiscount ? (
              <Text
                text={Price?.RegularPrice?.toString()}
                variant="xSmallLight"
                style={styles.prevPrice}
                color={colors.grayMainBolder}
                numberOfLines={1}
              />
            ) : (
              <View style={{height: spacing.normal}} />
            )}
            <Text
              text={Price?.Price}
              variant="smallBold"
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
        <View style={styles.rateAndColorsContainer}>
          <StarFilledIcon color={colors.orange} />
          <Text
            text={RatingSum.toString()}
            variant="xSmallRegular"
            style={styles.rate}
          />
          <View style={styles.verticalLine} />
          <View style={styles.colorsContainer}>
            {ColorAttributes &&
              ColorAttributes &&
              ColorAttributes.map((item, index) => (
                <View
                  key={index.toString()}
                  style={[
                    styles.colorItem,
                    {
                      backgroundColor: item.Color,
                      left: spacing.smaller * (index + 1),
                    },
                  ]}
                />
              ))}
          </View>
        </View>
      </Pressable>
      <AddToFav
        isAddToCollectionShown={isAddToCollectionShown}
        setIsAddToCollectionShown={setIsAddToCollectionShown}
        ProductId={Id}
      />
    </>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  container: {
    height: 268,
    marginBottom: 10,
    marginRight: 10,
  },
  Imagecontainer: {
    height: 201,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.small,
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
  favoriteIconContainer: {
    height: 40,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceContainer: {
    alignItems: 'center',
    marginLeft: spacing.tiny,
  },
  prevPrice: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    lineHeight: spacing.normal,
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
    backgroundColor: colors.red,
    position: 'absolute',
    bottom: spacing.small,
    left: spacing.small,
    color: colors.white,
    paddingHorizontal: spacing.smaller,
    paddingVertical: spacing.tiny,
    borderRadius: 5,
    overflow: 'hidden',
  },
});
