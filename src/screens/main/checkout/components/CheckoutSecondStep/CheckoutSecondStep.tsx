import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {Loader, Text} from 'components';
import {colors, spacing} from 'theme';
import {useQuery} from '@tanstack/react-query';
import {getCheckoutMethods} from 'services/Checkout';
import {HouseIcon} from 'assets/images';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Switch} from 'react-native-paper';
import {BASE_URL} from 'utils/Axios';

const CheckoutSecondStep = () => {
  const [selectedMethod, setselectedMethod] = useState<number>(0);
  const [isSameAddress, setSameAddress] = useState<boolean>(true);
  const {data: dataCheckoutMethods, isLoading: isLoadingCheckoutMethods} =
    useQuery(['getCheckoutMethods'], getCheckoutMethods, {
      onSuccess(data) {
        setselectedMethod(data.data.ShippingMethods[0].ShippingMethodId);
      },
    });

  if (isLoadingCheckoutMethods) {
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
    <View style={styles.container}>
      <Text
        color={colors.primary}
        variant="mediumBold"
        tx="checkout.checkout-method-title"
        style={{marginBottom: spacing.small}}
      />
      <ScrollView>
        <FlatList
          data={dataCheckoutMethods?.data?.ShippingMethods}
          keyExtractor={(i, _) => _.toString()}
          style={{marginBottom: spacing.medium}}
          renderItem={({item}) => {
            const isSelected = selectedMethod === item.ShippingMethodId;
            return (
              <Pressable
                onPress={() => setselectedMethod(item.ShippingMethodId)}
                style={{
                  padding: spacing.normal,
                  borderRadius: spacing.small,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: isSelected ? colors.transparent : '#F3FBFF',
                  borderWidth: 1,
                  borderColor: isSelected
                    ? colors.secondary
                    : colors.transparent,
                  marginBottom: spacing.small,
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={{uri: BASE_URL + item?.ShippingMethodImage?.Url}}
                    style={{
                      height: 44,
                      width: 44,
                      marginRight: spacing.normal,
                    }}
                  />
                  <View>
                    <Text
                      text={item?.Name}
                      color={isSelected ? colors.secondary : colors.gray[500]}
                      variant="smallBold"
                      style={{marginBottom: spacing.smaller - 1}}
                    />
                    <Text
                      text={item?.Description}
                      variant="xSmallRegular"
                      color={isSelected ? colors.black : colors.gray[400]}
                    />
                  </View>
                </View>
                <MaterialIcons
                  name={`radio-button-${isSelected ? 'on' : 'off'}`}
                  size={20}
                  color={isSelected ? colors.secondary : colors.gray[300]}
                />
              </Pressable>
            );
          }}
        />
        <View style={styles.componentTitle}>
          <Text
            color={colors.primary}
            variant="mediumBold"
            tx="checkout.checkout-delivery-address"
          />
          <Text
            color={colors.gray[300]}
            variant="smallRegular"
            tx="checkout.checkout-delivery-description"
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: spacing.smaller,
          }}>
          <Switch
            style={{
              transform: [{scaleX: 0.7}, {scaleY: 0.7}],
              marginRight: spacing.smaller,
            }}
            value={isSameAddress}
            onValueChange={() => {
              setSameAddress(!isSameAddress);
            }}
            color={colors.primary}
          />
          <Text
            tx={'checkout.checkout-same-address'}
            variant="smallRegular"
            color={colors.gray[500]}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.content,
    marginTop: spacing.xLarge,
    flex: 1,
  },
  componentTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default CheckoutSecondStep;
