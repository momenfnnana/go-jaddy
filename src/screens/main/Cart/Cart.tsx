import {View, FlatList, Image, Pressable} from 'react-native';
import React from 'react';
import {useQueries, useQuery} from '@tanstack/react-query';
import {getCartProducts} from 'services/Cart';
import {colors, spacing} from 'theme';
import {BASE_URL} from 'utils/Axios';
import {Text} from 'components';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Cart = () => {
  const {data, isLoading, isSuccess, isError, error, refetch, isFetching} =
    useQuery(['cartProducts'], getCartProducts);
  return (
    <View style={{flex: 1}}>
      <FlatList
        contentContainerStyle={{
          marginHorizontal: spacing.content,
          paddingTop: 10,
        }}
        data={data?.data?.Items}
        keyExtractor={(i, _) => _.toString()}
        renderItem={({item}) => (
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
                tx={item.ProductName}
                variant="smallBold"
                style={{fontSize: 12}}
              />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 10,
                }}>
                <Pressable
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
                  <MaterialIcons name="add" color={colors.white} />
                </Pressable>
                <Text
                  tx={item?.EnteredQuantity}
                  variant="smallBold"
                  style={{marginRight: 10}}
                />
                <Pressable
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 10,
                    borderWidth: 1,
                    borderColor: colors.secondary,
                  }}>
                  <MaterialIcons name="remove" color={colors.secondary} />
                </Pressable>
                <Text
                  tx={item?.SubTotal}
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
                source={{uri: BASE_URL + item?.Image?.Url}}
              />
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default Cart;
