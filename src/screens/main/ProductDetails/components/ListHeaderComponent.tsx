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
import {InputField, Loader, Modal, Text} from 'components';
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
import {useMutation, useQuery} from '@tanstack/react-query';
import {
  getWishlists,
  postAddToWishlist,
  postCreateWishlist,
} from 'services/Home';
import {useTranslation} from 'react-i18next';
import {Formik} from 'formik';
import * as Yup from 'yup';
import Fontisto from 'react-native-vector-icons/Fontisto';

interface IProductNavigation
  extends NativeStackNavigationProp<HomeRoutes, 'ProductDetails'>,
    RouteProp<HomeRoutes, 'ProductDetails'> {}
interface IListHeaderComponent {
  Product: any;
  ProductId: number;
  selectedFilter: string[];
  setSelectedFilter: (value: any) => void;
}
interface IinitialValues {
  collectionName: string;
}
enum productCounter {
  increase,
  descrease,
}
const CARD_SIZE = 43;

const collectionsInitialValues: IinitialValues = {
  collectionName: '',
};
const addCollectionSchema = Yup.object().shape({
  collectionName: Yup.string().required('collection name is required'),
});

const ListHeaderComponent = ({
  Product,
  ProductId,
  selectedFilter,
  setSelectedFilter,
}: IListHeaderComponent) => {
  const {navigate, goBack, canGoBack} = useNavigation<IProductNavigation>();
  const {productsNumber, setProductsNumber} = useContext(CartContext);
  const {top} = useSafeAreaInsets();
  const {height} = useWindowDimensions();
  const {currency} = useCurrency();
  const {t} = useTranslation();
  const [showInput, setShowInput] = useState<boolean>(false);
  const [selectedWishlist, setSelectedWishlist] = useState<number | string>();
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
  };

  const {
    isLoading: isLoadingWishlists,
    data: wishlistsData,
    isError: isErrorWishlists,
    refetch: refetchWishlists,
    isFetched: isFetchedWishlists,
    isRefetching: isRefetchingWishlists,
    isSuccess: isLoadedWishlists,
  } = useQuery(['getWishlists'], getWishlists);

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
    if (!selectedFilter.includes(value)) {
      const newlist = [...selectedFilter, value];
      setSelectedFilter(newlist);
    } else {
      const newlist = selectedFilter.filter(item => item !== value);
      setSelectedFilter(newlist);
    }
  };

  const onPressHeart = () => {
    refetchWishlists();
    onOpenAddToCollection();
  };

  const {
    mutate,
    isLoading: isLoadingCreateWishList,
    isError,
    error,
    isSuccess,
    data: newWishlistData,
  } = useMutation(postCreateWishlist, {
    onSuccess: data => {
      return data;
    },
    onError: error => {
      return error;
    },
  });
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

  const showAddCollectionInput = () => {
    setShowInput(currentState => !currentState);
  };

  const addCollectionHandler = (values: IinitialValues) => {
    mutate(values.collectionName);
  };

  const addToWishlistHandler = (item: any) => {
    setSelectedWishlist(item?.Id);
    const NewWishlistName =
      item?.WishlistLinesCount === 0 ? item?.Name : undefined;
    mutateAddToWishlist({
      ProductId,
      SelectedWishlistId: item?.Id,
      NewWishlistName,
    });
  };

  // useEffect(() => {
  //   if (isSuccess === true && !isLoading) {
  //     forceRefetch();
  //   }
  // }, [isSuccess, isLoading]);
  // useEffect(() => {
  //   if (isSuccessAddToWishlist === true && !isLoadingAddToWishlist) {
  //     onBackdropPress();
  //   }
  // }, [isLoadingAddToWishlist, isSuccessAddToWishlist]);
  // if (isLoadingWishlists || isRefetchingWishlists) {
  //   return <Loader size={'small'} style={styles.collectionsLoader} />;
  // }
  const mainImage = {
    height: height * 0.5,
  } as ViewStyle;
  const imageLoadingStyle = {
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle;
  console.log({Product});

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
                        backgroundColor: selectedFilter.includes(
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
                            selectedFilter.includes((index + 1).toString())
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
        isVisible={isAddToCollectionShown}
        onBackdropPress={onCloseAddToCollection}
        isLoading={isLoadedWishlists}
        forceRefetch={refetchWishlists}
        ProductId={ProductId}
        title="whishlist.add"
        description="whishlist.add-hint">
        {isLoadingWishlists ? (
          <Loader size={'small'} style={styles.collectionsLoader} />
        ) : wishlistsData?.data?.length > 0 ? (
          <FlatList
            data={wishlistsData?.data}
            keyExtractor={(_, index) => index.toString()}
            ListHeaderComponent={
              <View style={styles.addCollectionBtnContainer}>
                <Formik
                  initialValues={collectionsInitialValues}
                  validationSchema={addCollectionSchema}
                  onSubmit={addCollectionHandler}>
                  {({
                    values,
                    handleChange,
                    handleBlur,
                    errors,
                    handleSubmit,
                  }) => (
                    <>
                      <Pressable
                        onPress={showAddCollectionInput}
                        style={styles.row}
                        disabled={isLoadingCreateWishList}>
                        <View style={styles.addCollectionBtn}>
                          {
                            <AntDesign
                              name="plus"
                              color={colors.white}
                              size={25}
                            />
                          }
                        </View>
                        <Text
                          tx="whishlist.add-collection"
                          variant="mediumBold"
                          color={colors.primary}
                          style={styles.collectionName}
                        />
                      </Pressable>
                      {showInput && (
                        <InputField
                          value={values.collectionName}
                          onChangeText={handleChange('collectionName')}
                          onBlur={handleBlur('collectionName')}
                          placeholder={t('whishlist.collection-name')}
                          style={{}}
                          rightIcon={
                            isLoadingCreateWishList ? (
                              <Loader size={'small'} color={colors.primary} />
                            ) : (
                              <AntDesign
                                onPress={handleSubmit}
                                name={'check'}
                                size={18}
                                color={colors.primary}
                              />
                            )
                          }
                          error={errors.collectionName}
                        />
                      )}
                    </>
                  )}
                </Formik>
              </View>
            }
            renderItem={({item}) => {
              return (
                <Pressable
                  onPress={() => addToWishlistHandler(item)}
                  style={[styles.collectionRow, styles.row]}>
                  <View style={styles.row}>
                    <View style={styles.imageContainer}>
                      <FlatList
                        data={item?.Top4Products}
                        keyExtractor={item => item?.Id}
                        scrollEnabled={false}
                        numColumns={2}
                        renderItem={({item}) => (
                          <Image
                            source={{uri: `${BASE_URL}${item?.Image?.Url}`}}
                            key={item.Id}
                            style={{
                              width: CARD_SIZE / 2,
                              height: CARD_SIZE / 2,
                            }}
                          />
                        )}
                      />
                    </View>
                    <Text
                      text={item?.Name}
                      variant="smallRegular"
                      color={colors.tabsColor}
                      style={styles.collectionName}
                    />
                  </View>
                  <Fontisto
                    name={
                      selectedWishlist === item?.Id
                        ? 'radio-btn-active'
                        : 'radio-btn-passive'
                    }
                    color={colors.red}
                    size={18}
                  />
                </Pressable>
              );
            }}
          />
        ) : (
          <View style={styles.addCollectionBtnContainer}>
            <Formik
              initialValues={collectionsInitialValues}
              validationSchema={addCollectionSchema}
              onSubmit={addCollectionHandler}>
              {({values, handleChange, handleBlur, errors, handleSubmit}) => (
                <>
                  <Pressable
                    onPress={showAddCollectionInput}
                    style={[styles.row]}
                    disabled={isLoadingCreateWishList}>
                    <View style={styles.addCollectionBtn}>
                      {<AntDesign name="plus" color={colors.white} size={25} />}
                    </View>
                    <Text
                      tx="whishlist.add-collection"
                      variant="mediumBold"
                      color={colors.primary}
                      style={styles.collectionName}
                    />
                  </Pressable>
                  {showInput && (
                    <InputField
                      value={values.collectionName}
                      onChangeText={handleChange('collectionName')}
                      onBlur={handleBlur('collectionName')}
                      placeholder={t('whishlist.collection-name')}
                      style={{}}
                      rightIcon={
                        isLoadingCreateWishList ? (
                          <Loader size={'small'} color={colors.primary} />
                        ) : (
                          <AntDesign
                            onPress={handleSubmit}
                            name={'check'}
                            size={18}
                            color={colors.primary}
                          />
                        )
                      }
                      error={errors.collectionName}
                    />
                  )}
                </>
              )}
            </Formik>
          </View>
        )}
      </Modal>
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
  addCollectionBtnContainer: {
    paddingHorizontal: spacing.xxxLarge,
    marginTop: spacing.normal,
  },
  collectionName: {
    marginHorizontal: spacing.normal,
  },
  collectionRow: {
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xxxLarge,
    marginTop: spacing.smaller,
  },
  imageContainer: {
    borderRadius: spacing.medium - 2,
    height: CARD_SIZE,
    width: CARD_SIZE,
    backgroundColor: colors.gray[300],
    overflow: 'hidden',
  },
  addCollectionBtn: {
    backgroundColor: colors.primary,
    borderRadius: spacing.medium - 2,
    height: CARD_SIZE,
    width: CARD_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  collectionsLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
