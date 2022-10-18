import {
  View,
  FlatList,
  Image,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import {useQueries, useQuery} from '@tanstack/react-query';
import {getCartProducts} from 'services/Cart';
import {colors, font, spacing} from 'theme';
import {BASE_URL} from 'utils/Axios';
import {Button, InputField, Loader, Text} from 'components';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Switch} from 'react-native-paper';
import {useCurrency} from 'hook/useCurrency';

const Cart = () => {
  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error,
    refetch,
    isFetching,
    isRefetching,
  } = useQuery(['cartProducts'], getCartProducts);
  const [isUsedPoints, setUsedPoints] = useState<boolean>(false);
  const {currency} = useCurrency();

  const onUsedPoints = () => {
    setUsedPoints(!isUsedPoints);
  };

  if (isLoading || isRefetching) {
    return (
      <Loader
        containerStyle={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      />
    );
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
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
                  <MaterialIcons
                    size={18}
                    name="remove"
                    color={colors.secondary}
                  />
                </Pressable>
                <Text
                  text={item?.SubTotal + ' ' + currency?.Symbol}
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
      <KeyboardAvoidingView
        behavior={'padding'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : -40}>
        <View style={{marginTop: 20, paddingHorizontal: spacing.content}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}>
            <Text tx="cart.discountCode" variant="smallRegular" size={14} />
            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 20,
                backgroundColor: '#EEEEEE',
              }}>
              <Text
                size={12}
                tx="cart.useDiscountCode"
                color={colors.secondary}
                variant="smallBold"
              />
            </View>
          </View>
          <View
            style={{
              height: 50,
              borderRadius: 6,
              borderWidth: 1.5,
              borderColor: colors.secondary,
              borderStyle: 'dashed',
              backgroundColor: '#4B95550F',
              flexDirection: 'row',
              alignItems: 'center',
              overflow: 'hidden',
            }}>
            <TextInput
              placeholder="كود الخصم"
              style={{
                flex: 1,
                height: '100%',
                fontFamily: font.regular,
                paddingHorizontal: 10,
              }}
            />
            <MaterialCommunityIcons
              name="percent"
              color={colors.secondary}
              size={14}
              style={{
                padding: 2,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: colors.secondary,
                marginHorizontal: 10,
              }}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
      <View style={{marginTop: 20, paddingHorizontal: spacing.content}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 10,
          }}>
          <Text
            tx={data?.data?.RewardPoints?.RewardPointsMessage}
            variant="smallRegular"
          />
          <Switch
            value={isUsedPoints}
            onValueChange={onUsedPoints}
            color={colors.primary}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
          }}>
          <View style={{flex: 1}}>
            <Button title="cart.submitBtn" />
          </View>
          <View
            style={{
              marginLeft: 6,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <MaterialIcons
                name={`keyboard-arrow-down`}
                size={18}
                color={colors.black}
              />
              <Text
                txOptions={{currency: currency?.Symbol}}
                tx="cart.total"
                color={colors.reloadColor}
                variant="xSmallRegular"
              />
            </View>
            <Text
              txOptions={{currency: currency?.Symbol}}
              text={data?.data?.Total}
              color={colors.primary}
              variant="xLargeBold"
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Cart;
