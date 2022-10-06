import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  ImageBackground,
  ViewStyle,
  useWindowDimensions,
  Pressable,
  FlatList,
  Image,
  StyleSheet,
} from 'react-native';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {DiscountIcon, StarFilledIcon} from 'assets/icons';
import {Loader, Modal, Text} from 'components';
import ArrowIcon from 'components/Arrow';
import {HomeRoutes} from 'navigators/RoutesTypes';
import {colors, spacing} from 'theme';
import {BASE_URL} from 'utils/Axios';
import ProductImagesList from './ProductImagesList';
import {CartContext} from 'context/CartContext';
import NotifyMeOnAvailable from './NotifyMeOnAvailable';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useCurrency} from 'hook/useCurrency';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useQuery} from '@tanstack/react-query';
import {getWishlists} from 'services/Home';

interface IProductNavigation
  extends NativeStackNavigationProp<HomeRoutes, 'ProductDetails'>,
    RouteProp<HomeRoutes, 'ProductDetails'> {}
interface IListHeaderComponent {
  Product: any;
  Id: number;
  selectedFilter: any;
  setSelectedFilter: (value: any) => void;
}
enum productCounter {
  increase,
  descrease,
}

const ListHeaderComponent = ({
  Product,
  Id,
  selectedFilter,
  setSelectedFilter,
}: IListHeaderComponent) => {
  const {navigate, goBack, canGoBack} = useNavigation<IProductNavigation>();
  const {productsNumber, setProductsNumber} = useContext(CartContext);
  const {top} = useSafeAreaInsets();
  const {height} = useWindowDimensions();
  const {currency} = useCurrency();
  const [isLoadingImageBackground, setIsLoadingImageBackground] =
    useState<boolean>(true);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [subscribed, setSubscribed] = useState<boolean>(false);
  const [isAddToCollectionShown, setIsAddToCollectionShown] =
    useState<boolean>(false);
  const onLoadBackgroundEnd = () => {
    setIsLoadingImageBackground(false);
  };
  const onCloseAddToCollection = () => {
    setIsAddToCollectionShown(false);
  };
  const onOpenAddToCollection = () => {
    setIsAddToCollectionShown(true);
    onOpenAddToCollection();
  };

  const {
    isLoading: isLoadingWishlists,
    data: wishlistsData,
    isError: isErrorWishlists,
    refetch: refetchWishlists,
    isRefetching: isRefetchingWishlists,
    isSuccess: isLoadedWishlists,
  } = useQuery(['getWishlists'], getWishlists, {
    enabled: false,
  });

  const ShowDiscountBadge: boolean = Product?.ShowDiscountBadge;
  const DisplayProductReviews: boolean = Product?.DisplayProductReviews;
  const ProductPrice = Product?.ProductPrice;
  const SavingPercent: number = ProductPrice?.SavingPercent;
  const StockAvailability = Product?.StockAvailability;
  const ReviewOverview = Product?.ReviewOverview;
  const DisplayBackInStockSubscription =
    Product?.DisplayBackInStockSubscription;
  const BackInStockAlreadySubscribed = Product?.BackInStockAlreadySubscribed;
  const productCounterHandler = (type: productCounter) => {
    if (type === productCounter.increase) {
      if (productsNumber < parseInt(StockAvailability)) {
        setProductsNumber((currentValue: number) => currentValue + 1);
      }
    } else if (type === productCounter.descrease) {
      if (productsNumber > 0) {
        setProductsNumber((currentValue: number) => currentValue - 1);
      }
    }
  };

  const onPressFilter = (value: number | string) => {
    setSelectedFilter(value);
  };

  const onPressHeart = () => {
    refetchWishlists();
  };

  const mainImage = {
    height: height * 0.5,
  } as ViewStyle;
  const imageLoadingStyle = {
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle;

  return (
    <View>
      <ImageBackground
        source={{
          uri: `${BASE_URL}${Product?.Images[activeImageIndex]?.Url}`,
        }}
        style={[
          mainImage,
          isLoadingImageBackground ? imageLoadingStyle : undefined,
        ]}
        onLoadEnd={onLoadBackgroundEnd}>
        {isLoadingImageBackground ? (
          <Loader size="large" color={colors.primary + 50} />
        ) : (
          <>
            {canGoBack() && (
              <Pressable
                onPress={() => goBack()}
                style={{
                  backgroundColor: colors.white + 18,
                  padding: 10,
                  borderRadius: 5,
                  position: 'absolute',
                  top: top,
                  left: spacing.medium,
                }}>
                <ArrowIcon color={colors.white} />
              </Pressable>
            )}
            <FlatList
              data={Product?.Images}
              keyExtractor={(_, index) => index.toString()}
              style={styles.flatList}
              contentContainerStyle={styles.contentContainerStyle}
              showsHorizontalScrollIndicator={false}
              horizontal
              renderItem={({item, index}) => (
                <ProductImagesList
                  item={item}
                  index={index}
                  activeImageIndex={activeImageIndex}
                  setActiveImageIndex={setActiveImageIndex}
                />
              )}
            />
            {ShowDiscountBadge && (
              <View style={styles.discountPercentageContainer}>
                <DiscountIcon />
                <Text
                  variant="mediumRegular"
                  color={colors.white}
                  text={`${SavingPercent}%`}
                />
              </View>
            )}
          </>
        )}
      </ImageBackground>
      <View style={styles.contentContainer}>
        <View style={[styles.row, styles.justifyBetween]}>
          <Text
            text={Product?.Name}
            color={colors.tabsColor}
            variant="largeBold"
            numberOfLines={1}
          />
          {Product?.StoreId !== 0 && (
            <Pressable
            // onPress={()=>navigate('')}
            >
              <Image
                source={{uri: `${BASE_URL}${Product?.StoreImage?.Url}`}}
                style={[styles.storeImage, styles.storeWidth]}
              />
            </Pressable>
          )}
        </View>
        <View style={styles.row}>
          {Product?.ShowSku && (
            <Text color={colors.black} variant="mediumLight">
              {Product?.Sku}
            </Text>
          )}
        </View>
        <View style={[styles.row, styles.justifyBetween]}>
          <Text
            text={Product?.ShortDescription}
            color={colors.tabsColor}
            variant="mediumRegular"
            style={styles.shortDescription}
          />
          <View style={[styles.priceContainer, styles.storeWidth]}>
            <Text
              text={Product?.ProductPrice?.Price}
              color={colors.orange}
              variant="xLargeBold"
              numberOfLines={1}
            />
            <View style={styles.row}>
              <Text
                text={Product?.ProductPrice?.OldPrice?.toString()}
                color={colors.grayMain}
                variant="mediumRegular"
                style={styles.oldPrice}
                numberOfLines={1}
              />
              <Text text={currency?.Symbol} />
            </View>
          </View>
        </View>
        <View style={styles.row}>
          <Text
            tx="product-details.select-color"
            color={colors.tabsColor}
            variant="mediumBold"
          />
        </View>
        <View style={[styles.row, styles.availableQuantity]}>
          <View style={styles.row}>
            <Text
              tx="product-details.available-quantity"
              color={colors.tabsColor}
              variant="mediumLight"
            />
            <Text style={styles.stockAvailability}>
              {StockAvailability === '' ? 0 : StockAvailability}
            </Text>
          </View>
          {StockAvailability === '' &&
            DisplayBackInStockSubscription === true &&
            !BackInStockAlreadySubscribed &&
            !subscribed && (
              <NotifyMeOnAvailable id={Id} setSubscribed={setSubscribed} />
            )}
        </View>
        <View style={[styles.row, styles.addToCartContainer]}>
          <View style={[styles.addToCardContainer, styles.row]}>
            <View
              style={[
                styles.row,
                {
                  flex: 0.5,
                  justifyContent: 'flex-start',
                },
              ]}>
              <Pressable
                onPress={() => productCounterHandler(productCounter.increase)}
                style={styles.addToCartBtn}>
                <Entypo name="plus" size={20} color={colors.primary} />
              </Pressable>
              <Text
                color={colors.white}
                text={productsNumber.toString()}
                style={styles.productInCartNumber}
                variant="mediumBold"
              />
              <Pressable
                onPress={() => productCounterHandler(productCounter.descrease)}
                style={styles.addToCartBtn}>
                <Entypo name="minus" size={20} color={colors.primary} />
              </Pressable>
            </View>
            <Text
              tx="product-details.add-to-cart"
              color={colors.white}
              variant="mediumBold"
              style={{flex: 0.5}}
            />
          </View>
          <Pressable onPress={onPressHeart} style={styles.heartContainer}>
            <AntDesign name="heart" color={colors.red} size={20} />
          </Pressable>
        </View>
        {DisplayProductReviews === true && (
          <>
            <View style={[styles.ratingsContainer, styles.row]}>
              <View style={styles.row}>
                <Text tx="product-details.ratings" variant="mediumBold" />
                <Text
                  text={ReviewOverview?.TotalReviews?.toString()}
                  variant="mediumBold"
                  style={styles.totalRatings}
                />
              </View>
              <View style={[styles.ratingTotal, styles.row]}>
                <StarFilledIcon color={colors.orangeDark} />
                <Text
                  text={ReviewOverview?.RatingSum?.toString()}
                  color={colors.orangeDark}
                  style={styles.ratingSum}
                  variant="smallRegular"
                />
              </View>
            </View>
            <View style={styles.ratingFiltersContainer}>
              <Pressable
                style={[
                  styles.filterItem,
                  {
                    backgroundColor:
                      selectedFilter === 'all'
                        ? colors.secondary
                        : colors.simiWhite,
                  },
                ]}
                onPress={() => onPressFilter('all')}>
                <Text
                  tx="product-details.all"
                  color={selectedFilter === 'all' ? colors.white : colors.black}
                />
              </Pressable>
              <Pressable
                style={[
                  styles.filterItem,
                  {
                    backgroundColor:
                      selectedFilter === 'with-images'
                        ? colors.secondary
                        : colors.simiWhite,
                  },
                ]}
                onPress={() => onPressFilter('with-images')}>
                <Text
                  tx="product-details.with-images"
                  color={
                    selectedFilter === 'with-images'
                      ? colors.white
                      : colors.black
                  }
                />
              </Pressable>
              {[0, 1, 2, 3, 4].map((item, index) => {
                const itemsArray = [];
                switch (index) {
                  case 0:
                    itemsArray.push(item);
                    break;
                  case 1:
                    itemsArray.push(item);
                    itemsArray.push(item);
                    break;
                  case 2:
                    itemsArray.push(item);
                    itemsArray.push(item);
                    itemsArray.push(item);
                    break;
                  case 3:
                    itemsArray.push(item);
                    itemsArray.push(item);
                    itemsArray.push(item);
                    itemsArray.push(item);
                    break;
                  case 4:
                    itemsArray.push(item);
                    itemsArray.push(item);
                    itemsArray.push(item);
                    itemsArray.push(item);
                    itemsArray.push(item);
                    break;

                  default:
                    break;
                }

                return (
                  <Pressable
                    style={[
                      styles.filterItem,
                      {
                        backgroundColor:
                          selectedFilter === index + 1
                            ? colors.secondary
                            : colors.simiWhite,
                      },
                    ]}
                    key={item}
                    onPress={() => onPressFilter(item + 1)}>
                    <View style={styles.row}>
                      {itemsArray.map((_, subIndex) => (
                        <AntDesign
                          name="star"
                          color={
                            selectedFilter === index + 1
                              ? colors.white
                              : colors.reloadColor
                          }
                          key={subIndex}
                        />
                      ))}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </>
        )}
      </View>
      <Modal
        data={wishlistsData?.data}
        isVisible={isAddToCollectionShown}
        onBackdropPress={onCloseAddToCollection}
        isLoading={isLoadedWishlists}
      />
    </View>
  );
};

export default ListHeaderComponent;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flatList: {
    position: 'absolute',
    bottom: spacing.normal,
  },
  discountPercentageContainer: {
    backgroundColor: colors.orangeDark,
    width: 38,
    height: 49,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: spacing.tiny + 1,
    position: 'absolute',
    bottom: -spacing.medium,
    left: spacing.normal - 1,
  },
  storeImage: {
    height: 41,
    resizeMode: 'contain',
  },
  oldPrice: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    marginHorizontal: spacing.tiny,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: spacing.normal,
    marginTop: spacing.normal,
  },
  priceContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  justifyBetween: {
    justifyContent: 'space-between',
  },
  storeWidth: {
    width: 50,
  },
  contentContainerStyle: {
    paddingHorizontal: 72,
  },
  availableQuantity: {
    marginTop: spacing.medium,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stockAvailability: {
    marginHorizontal: spacing.tiny,
  },
  addToCardContainer: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.medium,
    flex: 0.9,
    borderRadius: 29,
    height: spacing.huge * 1.2,
  },
  addToCartBtn: {
    backgroundColor: colors.white,
    height: 29,
    width: 29,
    borderRadius: 29 * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInCartNumber: {
    marginHorizontal: spacing.normal,
  },
  heartContainer: {
    width: spacing.huge * 1.2,
    borderWidth: 1,
    borderRadius: spacing.huge * 0.6,
    borderColor: colors.red,
    justifyContent: 'center',
    alignItems: 'center',
    height: spacing.huge * 1.2,
  },
  addToCartContainer: {
    justifyContent: 'space-between',
    marginTop: spacing.normal,
  },
  ratingsContainer: {
    marginTop: spacing.normal,
  },
  shortDescription: {
    flex: 1,
  },
  totalRatings: {
    marginHorizontal: spacing.tiny,
  },
  ratingTotal: {
    backgroundColor: colors.secondary + 24,
    width: 52,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingSum: {
    marginHorizontal: spacing.tiny,
  },
  ratingFiltersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterItem: {
    paddingHorizontal: spacing.medium + 1,
    height: spacing.xxLarge + 2,
    borderRadius: spacing.tiny,
    marginHorizontal: spacing.tiny,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.medium,
  },
});
