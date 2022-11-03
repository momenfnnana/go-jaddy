import React, {useCallback, useEffect, useMemo, useState} from 'react';
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
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {DiscountIcon, ShareIcon, StarFilledIcon} from 'assets/icons';
import {AddToFav, InputField, Loader, Text} from 'components';
import ArrowIcon from 'components/Arrow';
import {colors, spacing, font} from 'theme';
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
import {useMutation} from '@tanstack/react-query';
import {addCartProducts} from 'services/Cart';
import {useTranslation} from 'react-i18next';
import {Boxes, CheckboxList, DropdownList, RadioList} from './attributes';
import {RatingFiltters} from 'components/RatingFilters';
import { Ifiltter } from 'screens/main/StoreDetails/StoreDetails';

interface IListHeaderComponent {
  Product: any;
  ProductId: number;
  selectedFilter: Ifiltter;
  setSelectedFilter: (value: any) => void;
  ratingFilters: string[];
  setRatingFilters: (value: any) => void;
  isRefetchingReviews: boolean;
  reviewsList: any[];
}
interface IAttributes {
  AttributeControlType:
    | 'Boxes'
    | 'DropdownList'
    | 'RadioList'
    | 'Checkboxes'
    | 'TextBox';
  AttributeId: number;
  DisplayOrder: number;
  IsMultipleChoice: boolean;
  IsRequired: boolean;
  isSelected: boolean;
  Name: string;
  Values: any[];
  VariantAttributeId: number;
}
interface ISelectAttribute {
  attributeValue?: any[];
  attribute?: number;
}
interface ISelectAttributeHandler {
  attribute: IAttributes;
  attributeValue: any;
}
interface ICheckIncludedItem {
  item: ISelectAttribute;
  array: ISelectAttribute[];
}

enum productCounter {
  increase,
  descrease,
}
const checkIncludedItem = ({item, array}: ICheckIncludedItem) => {
  const foundedItem = array.filter(element => {
    return (
      element.attribute === item.attribute &&
      element.attributeValue?.includes(item.attributeValue)
    );
  });
  return foundedItem.length > 0;
};

const ListHeaderComponent = ({
  Product,
  ProductId,
  selectedFilter,
  setSelectedFilter,
  ratingFilters,
  setRatingFilters,
  isRefetchingReviews,
  reviewsList,
}: IListHeaderComponent) => {
  const {t} = useTranslation();
  const {navigate, goBack, canGoBack} =
    useNavigation<CategoryNavigationsType>();
  const [productsNumber, setProductsNumber] = useState<number>(1);
  const {top} = useSafeAreaInsets();
  const {height} = useWindowDimensions();
  const {currency} = useCurrency();
  const [isLoadingImageBackground, setIsLoadingImageBackground] =
    useState<boolean>(true);
  const [attributes, setAttributes] = useState<IAttributes[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [subscribed, setSubscribed] = useState<boolean>(false);
  const [isAddToCollectionShown, setIsAddToCollectionShown] =
    useState<boolean>(false);
  const [selectedAttributes, setSelectedAttributes] = useState<any[]>([]);
  const [customTextValue, setCustomTextValue] = useState<string>('');

  const {mutate: mutateAddToCart, isLoading: isLoadingAddToCart} =
    useMutation(addCartProducts);

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

  const totalPrice: number = useMemo(() => {
    if (!!selectedAttributes.length) {
      let attributesArray: any[] = [];
      selectedAttributes.map(y => {
        y.values.map((ele: any) => {
          attributesArray.push(ele);
        });
      });
      const total = attributesArray.reduce(function (prev: number, cur) {
        return prev + cur.PriceAdjustmentValue;
      }, 0);
      return total;
    }
    return 0;
  }, [StockAvailability, selectedAttributes]);

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
  const onSelect = (value: any, attributesList: any[]) => {
    const foundParent = selectedAttributes.find((item: any) => {
      return item?.AttributeId === value?.parentAttribute?.AttributeId;
    });
    const filteredParent = selectedAttributes.filter((item: any) => {
      return item?.AttributeId !== value?.parentAttribute?.AttributeId;
    });
    if (foundParent) {
      if (foundParent.IsMultipleChoice) {
        const foundChild = foundParent.values.find((element: any) => {
          return element.Id === value.selectedItem.Id;
        });
        const remainedValues = foundParent.values.filter((element: any) => {
          return element.Id !== value.selectedItem.Id;
        });
        if (foundChild) {
          const newItem = {
            AttributeId: foundParent.AttributeId,
            IsMultipleChoice: foundParent.IsMultipleChoice,
            IsRequired: foundParent.IsRequired,
            VariantAttributeId: foundParent.VariantAttributeId,
            values: remainedValues,
          };
          setSelectedAttributes([...filteredParent, newItem]);
          return;
        }
        const newItem = {
          AttributeId: foundParent.AttributeId,
          IsMultipleChoice: foundParent.IsMultipleChoice,
          IsRequired: foundParent.IsRequired,
          VariantAttributeId: foundParent.VariantAttributeId,
          values: [...remainedValues, {...value.selectedItem}],
        };
        setSelectedAttributes([...filteredParent, newItem]);
        return;
      }
      const newParent = {...foundParent, values: [value.selectedItem]};
      setSelectedAttributes([...filteredParent, newParent]);
      return;
    }
    const newArray = [
      ...attributesList,
      {
        AttributeId: value.parentAttribute?.AttributeId,
        IsMultipleChoice: value.parentAttribute?.IsMultipleChoice,
        IsRequired: value.parentAttribute?.IsRequired,
        VariantAttributeId: value.parentAttribute.VariantAttributeId,
        values: [{...value.selectedItem}],
      },
    ];
    setSelectedAttributes(newArray);
  };

  const selectAttributeHandler = useCallback(
    ({attribute, attributeValue}: ISelectAttributeHandler) => {
      const newItems = attributes.map(element => {
        if (element.AttributeId === attribute.AttributeId) {
          return {
            ...element,
            Values:
              element?.IsMultipleChoice === true
                ? element.Values.map(ele => {
                    if (ele.Id === attributeValue.Id) {
                      return {
                        ...ele,
                        isSelected: !ele.isSelected,
                        IsPreSelected: false,
                      };
                    }
                    return ele;
                  })
                : element.Values.map(ele => {
                    if (ele.Id === attributeValue.Id) {
                      return {
                        ...ele,
                        isSelected: !ele.isSelected,
                        IsPreSelected: false,
                      };
                    }
                    return {
                      ...ele,
                      isSelected: false,
                      IsPreSelected: false,
                    };
                  }),
          };
        }
        return element;
      });
      setAttributes(newItems);
    },
    [attributes],
  );
  useEffect(() => {
    if (Product?.Attributes) {
      const newItems = Product?.Attributes.map((element: IAttributes) => {
        return {
          ...element,
          Values: element.Values.map(ele => {
            return {
              ...ele,
              isSelected: false,
            };
          }),
        };
      });
      setAttributes(newItems);
    }
  }, [Product?.Attributes]);
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
                {/* <Pressable style={styles.singleRightIcon}>
                  <CartIcon stroke={colors.white} />
                </Pressable> */}
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
                } as any)
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
        <View style={{marginTop: spacing.smaller}}>
          {attributes?.map((item: IAttributes, index: number) => {
            return (
              <View style={styles.attributeContainer} key={index.toString()}>
                <Text
                  key={item.AttributeId}
                  text={item.Name}
                  color={colors.tabsColor}
                  variant="mediumBold"
                />
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{marginHorizontal: -spacing.normal}}
                  contentContainerStyle={{paddingHorizontal: spacing.normal}}>
                  {item.AttributeControlType === 'Boxes' ? (
                    item.Values?.map(attributeValue => {
                      return (
                        <Boxes
                          {...{attributeValue, item, selectAttributeHandler}}
                          key={attributeValue.Id}
                          onSelect={value =>
                            onSelect(value, selectedAttributes)
                          }
                        />
                      );
                    })
                  ) : item.AttributeControlType === 'RadioList' ? (
                    item.Values?.map(attributeValue => {
                      return (
                        <RadioList
                          {...{selectAttributeHandler, item, attributeValue}}
                          key={attributeValue.Id}
                          onSelect={value =>
                            onSelect(value, selectedAttributes)
                          }
                        />
                      );
                    })
                  ) : item.AttributeControlType === 'DropdownList' ? (
                    <DropdownList
                      {...{item}}
                      onSelect={value => onSelect(value, selectedAttributes)}
                    />
                  ) : (
                    item.AttributeControlType === 'Checkboxes' && (
                      <CheckboxList
                        {...{item}}
                        onSelect={value => onSelect(value, selectedAttributes)}
                      />
                    )
                  )}
                </ScrollView>
                {item.AttributeControlType === 'TextBox' && (
                  <InputField
                    style={{}}
                    placeholder={'product-details.custom-text'}
                    value={customTextValue}
                    onChangeText={setCustomTextValue}
                  />
                )}
              </View>
            );
          })}
        </View>
        <View style={[styles.row, styles.availableQuantity]}>
          <View style={styles.row}>
            <Text
              tx="product-details.available-quantity"
              color={colors.tabsColor}
              variant="mediumLight"
            />
            <Text style={styles.stockAvailability}>
              {StockAvailability === ''
                ? 0
                : (StockAvailability + totalPrice) * productsNumber}
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
              disabled={isLoadingAddToCart}
              style={{flex: 0.5}}
              onPress={() =>
                mutateAddToCart({
                  productId: ProductId,
                  quantityToAdd: productsNumber,
                })
              }>
              {isLoadingAddToCart ? (
                <Loader color={colors.white} size={'small'} />
              ) : (
                <Text
                  tx="product-details.add-to-cart"
                  color={colors.white}
                  variant="mediumBold"
                />
              )}
            </Pressable>
          </View>
          <Pressable onPress={onPressHeart} style={styles.heartContainer}>
            <AntDesign name="heart" color={colors.red} size={20} />
          </Pressable>
        </View>
        <RatingFiltters
          style={{paddingHorizontal: spacing.content}}
          setSelectedFilter={setSelectedFilter}
          selectedFilter={selectedFilter}
          RatingSum={ReviewOverview?.RatingSum?.toString()}
          TotalReviews={ReviewOverview?.TotalReviews?.toString()}
        />
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
  colorAttribute: {
    width: spacing.xxLarge,
    height: spacing.xxLarge,
    marginHorizontal: spacing.tiny + 1,
    borderWidth: 2,
    marginTop: spacing.smaller,
  },
  attributeContainer: {
    marginBottom: spacing.small,
  },
  radioBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.small,
    marginTop: spacing.smaller,
  },
});
