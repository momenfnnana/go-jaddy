import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
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
  Share,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {DiscountIcon, ShareIcon} from 'assets/icons';
import {AddToFav, InputField, Loader, Text, ArrowIcon} from 'components';
import {colors, spacing} from 'theme';
import {BASE_URL} from 'utils/Axios';
import ProductImagesList from './ProductImagesList';
import NotifyMeOnAvailable from './NotifyMeOnAvailable';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useCurrency} from 'hook/useCurrency';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import {CategoryNavigationsType} from 'navigators/NavigationsTypes';
import {useMutation} from '@tanstack/react-query';
import {addCartProducts} from 'services/Cart';
import {Boxes, CheckboxList, DropdownList, RadioList} from './attributes';
import {RatingFiltters} from 'components/RatingFilters';
import {LogoSplash} from 'assets/images';
import {useProtectedFunction} from 'hook/useProdectedFunction';
import {useLogged} from 'hook/useLogged';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CART} from 'types';
import Snackbar from 'react-native-snackbar';
import {useTranslation} from 'react-i18next';
import {UserContext} from 'context/UserContext';
import {FormikTouched, useFormik} from 'formik';
import {object, string} from 'yup';
import {
  AttributesTypes,
  IAttributes,
  IListHeaderComponent,
  ISelectAttributeHandler,
  productCounter,
} from '../types';

const AttributeContainer = ({
  children,
  error,
  type,
  touched,
}: {
  children: ReactNode;
  error: string | undefined;
  type: AttributesTypes;
  touched: boolean | FormikTouched<any> | FormikTouched<any>[] | undefined;
}) => (
  <View>
    {type === 'TextBox' ? (
      <View>{children}</View>
    ) : (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{marginHorizontal: -spacing.normal}}
        contentContainerStyle={{paddingHorizontal: spacing.normal}}>
        {children}
      </ScrollView>
    )}
    <View>
      {touched && error && (
        <Text text={error} variant="error" top="small" color="red" />
      )}
    </View>
  </View>
);

const ListHeaderComponent = ({
  Product,
  ProductId,
  selectedFilter,
  setSelectedFilter,
  ratingFilters,
  setRatingFilters,
  isRefetchingReviews,
  reviewsList,
  isLoadingReviews,
}: IListHeaderComponent) => {
  const {t} = useTranslation();
  const {setUpdateProducts, updateProducts} = useContext(UserContext);
  const {protectedFunction} = useProtectedFunction();
  const {isLogged} = useLogged();
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
  const [customTextValue, setCustomTextValue] = useState<{
    text: string;
    attributeData: IAttributes;
  }>({
    text: '',
    attributeData: {},
  });

  const {navigate, goBack, canGoBack} =
    useNavigation<CategoryNavigationsType>();
  let initialValues: any = {};
  Product?.Attributes.forEach((f: any, index: number) => {
    if (f.IsRequired === true) {
      const foundItem = f?.Values.find((element: any) => {
        return element.IsPreSelected === true;
      });
      initialValues[f?.Name] = foundItem?.Name || '';
    }
  });

  useEffect(() => {
    let readyData: any[] = [];
    Product?.Attributes.forEach((f: any, index: number) => {
      const foundItem = f?.Values.find((element: any) => {
        return element.IsPreSelected === true;
      });
      if (f?.AttributeControlType === 'TextBox') {
        readyData.push({
          AttributeId: f?.AttributeId,
          IsMultipleChoice: f?.IsMultipleChoice,
          IsRequired: f?.IsRequired,
          VariantAttributeId: f?.VariantAttributeId,
          AttributeValue: '',
          AttributeType: f?.AttributeControlType,
          Name: f?.Name,
        });
      } else {
        readyData.push({
          AttributeId: f?.AttributeId,
          IsMultipleChoice: f?.IsMultipleChoice,
          IsRequired: f?.IsRequired,
          VariantAttributeId: f?.VariantAttributeId,
          AttributeValueId: foundItem?.Id,
          AttributeType: f?.AttributeControlType,
          Name: f?.Name,
          ValueName: foundItem?.Name,
          Color: foundItem?.Color,
          PriceAdjustmentValue: foundItem?.PriceAdjustmentValue,
        });
      }
    });
    setSelectedAttributes(readyData);
  }, []);

  const showAddedMessage = () => {
    Snackbar.show({
      text: t('cart.added-successfull'),
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: colors.success,
    });
  };

  const addLocalProduct = (prevList: any[] = [], attributesList?: any[]) => {
    AsyncStorage.setItem(
      CART,
      JSON.stringify([
        ...prevList,
        {
          ...Product,
          Id: ProductId,
          Attributes: attributesList,
          AttributesSelection: attributesList,
          QuantityToAdd: productsNumber,
        },
      ]),
    ).then(() => {
      showAddedMessage();
    });
    setUpdateProducts(!updateProducts);
  };

  const onSubmit = async () => {
    const cartItems = await AsyncStorage.getItem(CART);
    const cartArray =
      JSON.parse(cartItems as any) === null ? [] : JSON.parse(cartItems as any);
    if (!!selectedAttributes.length) {
      // array of Attributes ready to send to BE
      const attributesToSend = selectedAttributes?.map(item => {
        if (isLogged) {
          if (item?.AttributeType === 'TextBox') {
            return {
              AttributeId: item?.AttributeId,
              VariantAttributeId: item?.VariantAttributeId,
              AttributeValue: customTextValue?.text,
            };
          }
          return {
            AttributeId: item?.AttributeId,
            VariantAttributeId: item?.VariantAttributeId,
            AttributeValueId: item?.AttributeValueId,
          };
        } else {
          if (item?.AttributeType === 'Boxes') {
            return {
              ...item,
              isColor: true,
              Color: item?.Color,
            };
          } else if (item?.AttributeType === 'TextBox') {
            return {
              ...item,
              AttributeValue: customTextValue?.text,
            };
          } else if (!item?.AttributeValueId) {
            return {};
          }
          return item;
        }
      });
      if (isLogged) {
        mutateAddToCart([
          {
            ProductId,
            QuantityToAdd: productsNumber,
            SelectedAttributes: attributesToSend,
          },
        ]);
      } else {
        if (!!cartArray.length) {
          const filteredList = cartArray.filter((item: any) => {
            return item.Id !== ProductId;
          });
          addLocalProduct(filteredList, attributesToSend);
        } else {
          // add data to the cart as array of products
          addLocalProduct([], attributesToSend);
        }
      }
    } else {
      if (isLogged) {
        mutateAddToCart([
          {
            ProductId,
            QuantityToAdd: productsNumber,
            SelectedAttributes: [],
          },
        ]);
      } else {
        // if there is no attributes selected and unLogged
        addLocalProduct();
      }
    }
  };

  const schemaObj: any = {};
  Object.keys(initialValues).forEach(f => {
    schemaObj[f] = string().required('This field is required');
  });
  let validationSchema = object(schemaObj);

  const {setFieldValue, errors, handleSubmit, touched, values} = useFormik({
    onSubmit,
    validationSchema,
    initialValues,
  });

  const {mutate: mutateAddToCart, isLoading: isLoadingAddToCart} = useMutation(
    addCartProducts,
    {
      onSuccess: () => {
        Snackbar.show({
          text: t('cart.added-successfull'),
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: colors.success,
        });
        setUpdateProducts(!updateProducts);
      },
    },
  );

  const onLoadBackgroundEnd = () => {
    setIsLoadingImageBackground(false);
  };
  const onOpenAddToCollection = () => {
    setIsAddToCollectionShown(true);
  };

  const gradientColors = [colors.black + '70', colors.white + '00'];
  const initialFilterValues = {ratings: [], withImage: false};
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
      if (productsNumber > 1) {
        setProductsNumber((currentValue: number) => currentValue - 1);
      }
    }
  };

  const onPressHeart = () => {
    protectedFunction({func: () => onOpenAddToCollection()});
  };
  console.log({selectedAttributes});

  const totalPrice = useMemo(() => {
    const sum = selectedAttributes.reduce((accumulator, object) => {
      return (
        accumulator +
        (object.PriceAdjustmentValue ? object.PriceAdjustmentValue : 0)
      );
    }, 0);
    return sum + ProductPrice?.Price;
  }, [selectedAttributes, ProductPrice?.Price]);

  const onSelect = (value: any, attributesList: any[]) => {
    const attributeObject = value?.parentAttribute;
    const attributeValueObject = value?.selectedItem;
    // this object will remove all prev attributes
    const filteredAttributes = attributesList.filter(item => {
      return item?.AttributeId !== attributeObject?.AttributeId;
    });
    const regularAttributeObject = {
      AttributeId: attributeObject?.AttributeId,
      AttributeType: attributeObject?.AttributeControlType,
      AttributeValueId: attributeValueObject?.Id,
      IsMultipleChoice: attributeObject?.IsMultipleChoice,
      IsRequired: attributeObject?.IsRequired,
      VariantAttributeId: attributeObject?.VariantAttributeId,
      Name: attributeObject?.Name,
      ValueName: attributeValueObject?.Name,
      Color: attributeValueObject?.Color,
      PriceAdjustmentValue: attributeValueObject?.PriceAdjustmentValue,
    };
    if (attributeObject?.IsMultipleChoice === true) {
      // this array contains all attributes related with selected one
      const foundedAttributes = attributesList.filter(item => {
        return item?.AttributeId === attributeObject?.AttributeId;
      });
      if (!!foundedAttributes.length) {
        // if the value added before and attribute can accpet multiple values
        const filteredValues = foundedAttributes?.filter(item => {
          return item?.AttributeValueId !== attributeValueObject?.Id;
        });
        // get prev attribute
        const foundedSameAttribute = foundedAttributes?.find(item => {
          return item?.AttributeValueId === attributeValueObject?.Id;
        });
        if (foundedSameAttribute !== undefined) {
          // remove value for multiple choice
          setSelectedAttributes([...filteredAttributes, ...filteredValues]);
        } else {
          // add new value for multiple choice
          // check if the item type is Boxes to add value Color
          console.log({regularAttributeObject});
          setSelectedAttributes([
            ...filteredAttributes,
            ...filteredValues,
            regularAttributeObject,
          ]);
        }
      } else {
        // if attribute value not added before and can accept multiple values
        // check if the type is Boxes to add value Color
        setSelectedAttributes([...filteredAttributes, regularAttributeObject]);
      }
    } else {
      // if attribute accpet single values
      setSelectedAttributes([
        ...filteredAttributes,
        {
          AttributeId: attributeObject?.AttributeId,
          AttributeType: attributeObject?.AttributeControlType,
          AttributeValueId: attributeValueObject?.Id,
          IsMultipleChoice: attributeObject?.IsMultipleChoice,
          IsRequired: attributeObject?.IsRequired,
          VariantAttributeId: attributeObject?.VariantAttributeId,
          Name: attributeObject?.Name,
          ValueName: attributeValueObject?.Name,
          Color: attributeValueObject?.Color,
          PriceAdjustmentValue: attributeValueObject?.PriceAdjustmentValue,
        },
      ]);
    }
  };

  const selectAttributeHandler = useCallback(
    ({attribute, attributeValue}: ISelectAttributeHandler) => {
      const newItems = attributes.map(element => {
        setFieldValue(`${attribute.Name}`, attribute.Name);
        if (element.AttributeId === attribute.AttributeId) {
          return {
            ...element,
            Values:
              element?.IsMultipleChoice === true
                ? element.Values.map(ele => {
                    if (ele.Id === attributeValue.Id) {
                      return {
                        ...ele,
                        isSelected: true,
                        IsPreSelected: false,
                      };
                    }
                    return ele;
                  })
                : element.Values.map(ele => {
                    if (ele.Id === attributeValue.Id) {
                      return {
                        ...ele,
                        isSelected: true,
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

  const doAddToCart = async () => {
    handleSubmit();
  };

  const onPressShare = async () => {
    await Share.share({
      url: Product.ShareLink,
    });
  };

  useEffect(() => {
    if (Product?.Attributes) {
      const newItems = Product?.Attributes.map((element: IAttributes) => {
        return {
          ...element,
          Values: element?.Values?.map(ele => {
            return {
              ...ele,
              isSelected: ele?.IsPreSelected,
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
  const source = useMemo(() => {
    return Product?.Images[activeImageIndex]?.Url
      ? {uri: `${BASE_URL}${Product?.Images[activeImageIndex]?.Url}`}
      : LogoSplash;
  }, [Product?.Images, LogoSplash]);
  const isHavingFilters = useMemo(() => {
    if (
      initialFilterValues.ratings.length === selectedFilter.ratings.length &&
      initialFilterValues.withImage === selectedFilter.withImage
    ) {
      return false;
    }
    return true;
  }, [initialFilterValues, selectedFilter]);
  const displayFilters = useMemo(() => {
    return (
      (!!reviewsList.length ||
        isHavingFilters ||
        isRefetchingReviews ||
        isLoadingReviews) &&
      DisplayProductReviews
    );
  }, [
    reviewsList,
    isHavingFilters,
    isRefetchingReviews,
    isLoadingReviews,
    DisplayProductReviews,
  ]);

  return (
    <View>
      <ImageBackground
        source={source}
        onLoadEnd={onLoadBackgroundEnd}
        imageStyle={{
          opacity: Product?.Images[activeImageIndex]?.Url ? 1 : 0.5,
        }}>
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
                <Pressable
                  style={styles.singleRightIcon}
                  onPress={onPressShare}>
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
              text={totalPrice?.toString()}
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
                {item.AttributeControlType === 'Boxes' ? (
                  <AttributeContainer
                    type={item.AttributeControlType}
                    error={errors[item.Name]?.toString()}
                    touched={touched[item.Name]}>
                    {item.Values?.map(attributeValue => {
                      return (
                        <Boxes
                          {...{
                            attributeValue,
                            item,
                            selectAttributeHandler,
                          }}
                          key={attributeValue.Id}
                          onSelect={value =>
                            onSelect(value, selectedAttributes)
                          }
                        />
                      );
                    })}
                  </AttributeContainer>
                ) : item.AttributeControlType === 'RadioList' ? (
                  <AttributeContainer
                    type={item.AttributeControlType}
                    error={errors[item.Name]?.toString()}
                    touched={touched[item.Name]}>
                    {item.Values?.map(attributeValue => {
                      return (
                        <RadioList
                          {...{
                            selectAttributeHandler,
                            item,
                            attributeValue,
                          }}
                          key={attributeValue.Id}
                          onSelect={value =>
                            onSelect(value, selectedAttributes)
                          }
                        />
                      );
                    })}
                  </AttributeContainer>
                ) : item.AttributeControlType === 'DropdownList' ? (
                  <AttributeContainer
                    type={item.AttributeControlType}
                    error={errors[item.Name]?.toString()}
                    touched={touched[item.Name]}>
                    <DropdownList
                      {...{item}}
                      onSelect={value => onSelect(value, selectedAttributes)}
                    />
                  </AttributeContainer>
                ) : (
                  item.AttributeControlType === 'Checkboxes' && (
                    <AttributeContainer
                      type={item.AttributeControlType}
                      error={errors[item.Name]?.toString()}
                      touched={touched[item.Name]}>
                      <CheckboxList
                        {...{item}}
                        onSelect={value => onSelect(value, selectedAttributes)}
                      />
                    </AttributeContainer>
                  )
                )}
                {item.AttributeControlType === 'TextBox' && (
                  <AttributeContainer
                    error={errors[item.Name]?.toString()}
                    type={`${item.AttributeControlType}`}
                    touched={touched[item.Name]}>
                    <InputField
                      placeholder={'product-details.custom-text'}
                      value={values[item.Name]}
                      onChangeText={value => {
                        setCustomTextValue({text: value, attributeData: item});
                        setFieldValue(item.Name, value);
                      }}
                    />
                  </AttributeContainer>
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
              {StockAvailability === '' ? 0 : StockAvailability}
            </Text>
          </View>
          {StockAvailability === 0 &&
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
              onPress={doAddToCart}>
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
        {displayFilters && (
          <RatingFiltters
            style={{paddingHorizontal: spacing.content}}
            setSelectedFilter={setSelectedFilter}
            selectedFilter={selectedFilter}
            RatingSum={ReviewOverview?.RatingSum?.toString()}
            TotalReviews={ReviewOverview?.TotalReviews?.toString()}
          />
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

export default React.memo(ListHeaderComponent);

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
