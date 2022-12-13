import {Image, Pressable, View} from 'react-native';
import React, {useContext, useEffect, useMemo, useState} from 'react';
import {colors, spacing} from 'theme';
import {SelectedAttribute, Text} from 'components';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useCurrency} from 'hook/useCurrency';
import {BASE_URL} from 'utils/Axios';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useQuery} from '@tanstack/react-query';
import {editCartProducts, removeCartProducts} from 'services/Cart';
import {useLogged} from 'hook/useLogged';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CART} from 'types';
import {UserContext} from 'context/UserContext';
interface ICartItem {
  item: any;
  setData: (() => void) | any;
}

const CartItem = ({item, setData}: ICartItem) => {
  const {setUpdateProducts, updateProducts} = useContext(UserContext);
  const {isLogged} = useLogged();
  const {currency} = useCurrency();
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
  const {
    refetch: refetchRemoveItem,
    isFetching: isFetchingRemoveItem,
    isLoading: isLoadingRemoveItem,
  } = useQuery(
    [`removeCartItem${item.Id}`],
    () => removeCartProducts(item.Id),
    {
      enabled: false,
      onSuccess(data) {
        setData(data.data);
      },
    },
  );
  const removeItem = async () => {
    if (isLogged) {
      refetchRemoveItem();
    } else {
      const cartItems = await AsyncStorage.getItem(CART);
      const cartArray =
        JSON.parse(cartItems as any) === null
          ? []
          : JSON.parse(cartItems as any);
      const filteredProducts = cartArray.filter(
        (element: any) => element.Id !== item.Id,
      );
      AsyncStorage.setItem(CART, JSON.stringify(filteredProducts));
      setUpdateProducts(!updateProducts);
    }
  };

  useEffect(() => {
    if (item?.EnteredQuantity !== quantity) {
      refetchEditItem();
    }
  }, [quantity]);

  useEffect(() => {
    setQuantity(initialQuantity || 1);
  }, [item]);
  const imageUrl = item?.Image?.Url
    ? BASE_URL + item?.Image?.Url
    : BASE_URL + item?.Images[0]?.Url;
  const productPrice = useMemo(() => {
    if (item?.SubTotal) {
      return item?.SubTotal + ' ' + currency?.Symbol;
    }
    return item?.ProductPrice?.Price + ' ' + currency?.Symbol;
  }, [item, currency]);

  return (
    <View
      style={{
        padding: 7,
        borderRadius: 7,
        backgroundColor: colors.white,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
      }}>
      <View style={{flex: 1}}>
        <Text
          tx={item.ProductName || item.Name}
          variant="smallBold"
          style={{fontSize: 12}}
        />
        <Text
          tx={'SKU :' + item.Sku}
          variant="smallLight"
          color={'#262626'}
          style={{fontSize: 11, marginTop: 2}}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 10,
          }}>
          <Pressable
            disabled={isFetchingEditItem}
            onPress={() => setQuantity(quantity + 1)}
            style={{
              backgroundColor: colors.secondary,
              width: 28,
              height: 28,
              borderRadius: 14,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 10,
              borderWidth: 1,
              borderColor: colors.transparent,
            }}>
            <MaterialIcons size={18} name="add" color={colors.white} />
          </Pressable>

          <Text
            text={quantity.toString()}
            variant="smallBold"
            style={{marginRight: 10}}
          />

          <Pressable
            disabled={isFetchingEditItem || isFetchingRemoveItem}
            onPress={() => {
              if (quantity == 1) {
                removeItem();
              } else {
                setQuantity(quantity - 1);
              }
            }}
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 10,
              borderWidth: 1,
              borderColor: quantity == 1 ? colors.red : colors.secondary,
            }}>
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
      <View
        style={{
          marginLeft: 10,
          width: 120,
          height: 115,
          borderRadius: 8,
          overflow: 'hidden',
        }}>
        <Image
          style={{width: '100%', height: '100%', resizeMode: 'contain'}}
          source={{
            uri: imageUrl,
          }}
        />
      </View>
    </View>
  );
};

export default CartItem;
