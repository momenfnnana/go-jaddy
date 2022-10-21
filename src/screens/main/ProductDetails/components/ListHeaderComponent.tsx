import React, {useContext, useState} from 'react';
import {
  View,
  ImageBackground,
  ViewStyle,
  useWindowDimensions,
  Pressable,
  FlatList,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CartIcon, DiscountIcon, ShareIcon, StarFilledIcon} from 'assets/icons';
import {AddToFav, Loader, Text} from 'components';
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
import LinearGradient from 'react-native-linear-gradient';
import {CategoryNavigationsType} from 'navigators/NavigationsTypes';
import {useQuery} from '@tanstack/react-query';
import {addCartProducts} from 'services/Cart';

interface IProductNavigation
  extends NativeStackNavigationProp<HomeRoutes, 'ProductDetails'>,
    RouteProp<HomeRoutes, 'ProductDetails'> {}
interface IListHeaderComponent {
  Product: any;
  ProductId: number;
  selectedFilter: string[];
  setSelectedFilter: (value: any) => void;
  ratingFilters: string[];
  setRatingFilters: (value: any) => void;
  isRefetchingReviews: boolean;
}

enum productCounter {
  increase,
  descrease,
}

const ListHeaderComponent = ({
  Product,
  ProductId,
  selectedFilter,
  setSelectedFilter,
  ratingFilters,
  setRatingFilters,
  isRefetchingReviews,
}: IListHeaderComponent) => {
  const {navigate, goBack, canGoBack} =
    useNavigation<CategoryNavigationsType>();
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
  const {
    isLoading: isLoadingCartProduct,
    isError: isErrorCartProduct,
    refetch: refetchCartProduct,
    isFetching: isFetchingCartProduct,
  } = useQuery(
    ['adProductDetails'],
    () =>
      addCartProducts({productId: ProductId, quantityToAdd: productsNumber}),
    {
      enabled: false,
    },
  );

  const onLoadBackgroundEnd = () => {
    setIsLoadingImageBackground(false);
  };
  const onOpenAddToCollection = () => {
    setIsAddToCollectionShown(true);
  };

  const gradientColors = ['#00000070', '#ffffff00'];

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

  const onPressFilter = (value: string) => {
    if (value === 'all' || value === 'with-images') {
      if (!selectedFilter.includes(value)) {
        const newlist = [...selectedFilter, value];
        setSelectedFilter(newlist);
      } else {
        const newlist = selectedFilter.filter(item => item !== value);
        setSelectedFilter(newlist);
      }
      return;
    }
    if (!ratingFilters.includes(value)) {
      const newlist = [...ratingFilters, value];
      setRatingFilters(newlist);
    } else {
      const newlist = ratingFilters.filter(item => item !== value);
      setRatingFilters(newlist);
    }
  };

  const onPressHeart = () => {
    onOpenAddToCollection();
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
        onLoadEnd={onLoadBackgroundEnd}>
        <LinearGradient
          colors={gradientColors}
          style={[
            styles.gradientColorContainer,
            mainImage,
            isLoadingImageBackground ? imageLoadingStyle : undefined,
          ]}>
          {isLoadingImageBackground ? (
            <Loader size="large" color={colors.primary + 50} />
          ) : (
            <>
              {canGoBack() && (
                <Pressable
                  onPress={() => goBack()}
                  style={[
                    styles.backIconContainer,
                    {top: Platform.OS === 'android' ? spacing.smaller : top},
                  ]}>
                  <ArrowIcon color={colors.white} />
                </Pressable>
              )}
              <View
                style={[
                  styles.rightIcons,
                  {top: Platform.OS === 'android' ? spacing.tiny : top},
                ]}>
                <Pressable style={styles.singleRightIcon}>
                  <CartIcon stroke={colors.white} />
                </Pressable>
                <Pressable style={styles.singleRightIcon}>
                  <ShareIcon color={colors.white} />
                </Pressable>
              </View>
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
            </>
          )}
        </LinearGradient>
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
      </ImageBackground>
      <View style={styles.contentContainer}>
        <View style={[styles.row, styles.justifyBetween]}>
          <Text
            text={Product?.Name}
            color={colors.tabsColor}
            variant="largeBold"
            numberOfLines={1}
            style={{flex: 1}}
          />
          {Product?.StoreId !== 0 && (
            <Pressable
              onPress={() =>
                navigate('StoresStack', {
                  screen: 'StoresDetails',
                  params: {
                    storeId: Product?.StoreId,
                  },
                })
              }>
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
              <NotifyMeOnAvailable
                id={ProductId}
                setSubscribed={setSubscribed}
              />
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
            <Pressable
              disabled={isFetchingCartProduct}
              style={{flex: 0.5}}
              onPress={() => refetchCartProduct()}>
              {isFetchingCartProduct ? (
                <Loader
                  color={colors.white}
                  size={'small'}
                  style={{flex: 0.5}}
                />
              ) : (
                <Text
                  tx="product-details.add-to-cart"
                  color={colors.white}
                  variant="mediumBold"
                  style={{flex: 0.5}}
                />
              )}
            </Pressable>
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
                    backgroundColor: selectedFilter.includes('all')
                      ? colors.secondary
                      : colors.simiWhite,
                  },
                ]}
                onPress={() => onPressFilter('all')}>
                <Text
                  tx="product-details.all"
                  color={
                    selectedFilter.includes('all') ? colors.white : colors.black
                  }
                />
              </Pressable>
              <Pressable
                style={[
                  styles.filterItem,
                  {
                    backgroundColor: selectedFilter.includes('with-images')
                      ? colors.secondary
                      : colors.simiWhite,
                  },
                ]}
                onPress={() => onPressFilter('with-images')}>
                <Text
                  tx="product-details.with-images"
                  color={
                    selectedFilter.includes('with-images')
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
                        backgroundColor: ratingFilters.includes(
                          (index + 1).toString(),
                        )
                          ? colors.secondary
                          : colors.simiWhite,
                      },
                    ]}
                    key={item}
                    onPress={() => onPressFilter((item + 1).toString())}>
                    <View style={styles.row}>
                      {itemsArray.map((_, subIndex) => (
                        <AntDesign
                          name="star"
                          color={
                            ratingFilters.includes((index + 1).toString())
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
      {isRefetchingReviews && (
        <Loader size={'small'} color={colors.secondary} />
      )}
      <AddToFav
        isAddToCollectionShown={isAddToCollectionShown}
        setIsAddToCollectionShown={setIsAddToCollectionShown}
        ProductId={ProductId}
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
    zIndex: 2,
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
  gradientColorContainer: {
    flex: 1,
  },
  backIconContainer: {
    backgroundColor: colors.white + 18,
    padding: 10,
    borderRadius: 5,
    position: 'absolute',
    left: spacing.medium,
  },
  rightIcons: {
    flexDirection: 'row',
    position: 'absolute',
    right: spacing.medium,
  },
  singleRightIcon: {
    backgroundColor: colors.white + 18,
    padding: 10,
    borderRadius: 5,
    marginHorizontal: spacing.tiny,
  },
});
