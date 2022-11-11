import {Image, Pressable, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {colors} from 'theme';
import {Loader, Text} from 'components';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useCurrency} from 'hook/useCurrency';
import {BASE_URL} from 'utils/Axios';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useQuery} from '@tanstack/react-query';
import {
  addCartProducts,
  editCartProducts,
  removeCartProducts,
} from 'services/Cart';

interface ICartItem {
  item: any;
  setData: (() => void) | any;
}

const CartItem = ({item, setData}: ICartItem) => {
  const {currency} = useCurrency();
  const [quantity, setQuantity] = useState<number>(
    item?.EnteredQuantity || item?.QuantityToAdd || 0,
  );

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

  useEffect(() => {
    if (item?.EnteredQuantity !== quantity) {
      refetchEditItem();
    }
  }, [quantity]);

  useEffect(() => {
    setQuantity(item?.EnteredQuantity || 0);
  }, [item?.EnteredQuantity]);
  const imageUrl = item?.Image?.Url
    ? BASE_URL + item?.Image?.Url
    : BASE_URL + item?.Images[0]?.Url;
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
                refetchRemoveItem();
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
            text={
              item?.SubTotal ||
              item?.ProductPrice?.Price + ' ' + currency?.Symbol
            }
            color={colors.primary}
            variant="smallExtraBold"
          />
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
