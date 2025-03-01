import {Image, Pressable, StyleSheet, View} from 'react-native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {colors, spacing} from 'theme';
import {SelectedAttribute, Text} from 'components';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useCurrency} from 'hook/useCurrency';
import {BASE_URL} from 'utils/Axios';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useMutation, useQuery} from '@tanstack/react-query';
import {editCartProducts, removeCartProducts} from 'services/Cart';
import {useLogged} from 'hook/useLogged';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CART} from 'types';
import {UserContext} from 'context/UserContext';
import {useNavigation} from '@react-navigation/native';
import {IProductNavigation} from 'navigators/NavigationsTypes';
import {LogoSplash} from 'assets/images';
import {numberWithCommas} from 'utils/Regex';
import {readAccessToken} from 'constants';

interface ICartItem {
  item: any;
  setData: (() => void) | any;
  onPress?: (() => void) | any;
}

const CartItem = ({item, setData}: ICartItem) => {
  const {setUpdateProducts, updateProducts} = useContext(UserContext);
  const {isLogged} = useLogged();
  const {currency} = useCurrency();
  const {navigate} = useNavigation<IProductNavigation>();
  const initialQuantity = useMemo(() => {
    if (item?.EnteredQuantity) {
      return item?.EnteredQuantity;
    }
    return item?.QuantityToAdd;
  }, [item]);
  const [quantity, setQuantity] = useState<number>(initialQuantity || 1);

  const {
    refetch: refetchEditItem,
    isFetching: isFetchingEditItem,
    isLoading: isLoadingEditCart,
  } = useQuery(
    [`EditCartItem${item.Id}`],
    () =>
      editCartProducts({
        itemId: item.Id,
        newQuantity: quantity,
      }),
    {
      enabled: false,
      onSuccess(data) {
        setData(data.data);
      },
    },
  );
  const {mutate: mutateRemoveItem, isLoading: isFetchingRemoveItem} =
    useMutation(removeCartProducts, {
      onSuccess(data) {
        setData(data.data);
      },
    });

  const removeItem = useCallback(async () => {
    const res = await readAccessToken();
    if (res) {
      mutateRemoveItem(item?.Id);
    } else {
      const cartItems = await AsyncStorage.getItem(CART);
      const cartArray =
        JSON.parse(cartItems as any) === null
          ? []
          : JSON.parse(cartItems as any);
      const filteredProducts = cartArray.filter(
        (element: any) => element?.Id !== item?.Id,
      );
      setData(filteredProducts);
      if (filteredProducts.length == 0) {
        AsyncStorage.removeItem(CART);
        setUpdateProducts(!updateProducts);
        return;
      }
      AsyncStorage.setItem(CART, JSON.stringify(filteredProducts));
      setUpdateProducts(!updateProducts);
    }
  }, [item?.id]);

  const changeLocalItems = async (increaseNumber: number) => {
    const cartItems = await AsyncStorage.getItem(CART);
    const cartArray =
      JSON.parse(cartItems as any) === null ? [] : JSON.parse(cartItems as any);
    const filteredItems = cartArray?.filter(
      (element: any) => element?.Id !== item?.Id,
    );
    const foundedItems = cartArray?.find(
      (element: any) => element?.Id === item?.Id,
    );
    const newArray = [
      ...filteredItems,
      {...foundedItems, QuantityToAdd: increaseNumber},
    ];
    AsyncStorage.setItem(CART, JSON.stringify(newArray));
  };

  const imageUrl = useMemo(() => {
    if (isLogged) {
      if (item?.Image?.Url?.length) {
        return {
          uri: BASE_URL + item?.Image?.Url,
        };
      } else {
        return LogoSplash;
      }
    } else {
      return item?.Images?.length
        ? {uri: BASE_URL + item?.Images[0]?.Url}
        : LogoSplash;
    }
  }, [item, BASE_URL, isLogged, item?.Image?.Url?.length]);
  const imageOpacity = useMemo(() => {
    return isLogged
      ? {opacity: item?.Image?.Url ? 1 : 0.5}
      : {opacity: item?.Images?.length ? 1 : 0.5};
  }, [item, isLogged]);
  const productPrice = useMemo(() => {
    if (isLogged) {
      if (item?.SubTotal) {
        return numberWithCommas(item?.SubTotal) + ' ' + currency?.Symbol;
      }
      return 0 + ' ' + currency?.Symbol;
    } else {
      return (
        numberWithCommas((item?.ProductPrice?.Price * quantity).toFixed(1)) +
        ' ' +
        currency?.Symbol
      );
    }
  }, [item, currency, isLogged, quantity]);

  const increaseQuantityHandler = useCallback(() => {
    if (!isLogged) {
      changeLocalItems(quantity + 1);
    }
    setQuantity(quantity + 1);
  }, [quantity, isLogged]);
  const decreaseQuantityHandler = useCallback(() => {
    if (quantity === 1) {
      removeItem();
    } else {
      setQuantity(quantity - 1);
      if (!isLogged) {
        changeLocalItems(quantity - 1);
      }
    }
  }, [quantity, isLogged]);
  const navigateToProductDetails = useCallback(() => {
    if (isLogged) {
      navigate('ProductDetails', {Id: item?.ProductId} as any);
    } else {
      navigate('ProductDetails', {Id: item?.Id} as any);
    }
  }, [item?.ProductId, isLogged]);

  useEffect(() => {
    if (item?.EnteredQuantity !== quantity) {
      if (isLogged) {
        refetchEditItem();
      }
    }
  }, [quantity]);

  return (
    <View style={styles.container}>
      <View style={{flex: 1}}>
        <Text
          tx={item.ProductName || item.Name}
          variant="smallBold"
          size={12}
        />
        {!!item.Sku && (
          <Text
            text={'SKU :' + item.Sku}
            variant="smallLight"
            color={'#262626'}
            size={11}
            style={{marginTop: 2}}
          />
        )}
        <View style={styles.counterButtonsContainer}>
          <Pressable
            disabled={isFetchingEditItem}
            onPress={increaseQuantityHandler}
            style={styles.increaseQuantityBtn}>
            <MaterialIcons size={18} name="add" color={colors.white} />
          </Pressable>

          <Text
            text={quantity.toString()}
            variant="smallBold"
            style={{marginRight: 10}}
          />

          <Pressable
            disabled={isFetchingEditItem || isFetchingRemoveItem}
            onPress={decreaseQuantityHandler}
            style={[
              styles.decreaseQuantityBtn,
              {borderColor: quantity == 1 ? colors.red : colors.secondary},
            ]}>
            {quantity == 1 ? (
              <FontAwesome name="trash-o" size={18} color={colors.red} />
            ) : (
              <MaterialIcons size={18} name="remove" color={colors.secondary} />
            )}
          </Pressable>
          <Text
            text={productPrice}
            color={colors.primary}
            variant="smallExtraBold"
          />
        </View>
        <View style={{marginTop: spacing.medium, marginBottom: spacing.normal}}>
          <SelectedAttribute items={item?.AttributesSelection} />
        </View>
      </View>
      <Pressable
        onPress={navigateToProductDetails}
        style={styles.productImageContainer}>
        <Image style={[styles.productImage, imageOpacity]} source={imageUrl} />
      </Pressable>
    </View>
  );
};

export default CartItem;

const styles = StyleSheet.create({
  container: {
    padding: 7,
    borderRadius: 7,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  counterButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  increaseQuantityBtn: {
    backgroundColor: colors.secondary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.transparent,
  },
  decreaseQuantityBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
  },
  productImageContainer: {
    marginLeft: 10,
    width: 120,
    height: 115,
    borderRadius: 8,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
