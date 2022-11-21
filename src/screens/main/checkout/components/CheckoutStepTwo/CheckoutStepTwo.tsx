import React, {useState} from 'react';
import {
  FlatList,
  Image,
  Keyboard,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {AddAddressComponent, Button, Loader, Text} from 'components';
import {colors, spacing} from 'theme';
import {useQuery, useMutation} from '@tanstack/react-query';
import {
  getCheckoutMethods,
  selectBillingAddress,
  selectShippingMethod,
} from 'services/Checkout';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Switch} from 'react-native-paper';
import {BASE_URL} from 'utils/Axios';
import {ICheckoutStep} from '..';
import {IAddress} from 'types';

interface ICheckoutStepTwo extends ICheckoutStep {
  selectedAddress: IAddress;
}

const CheckoutStepTwo = ({
  setActiveStep,
  selectedAddress,
}: ICheckoutStepTwo) => {
  const [selectedMethod, setselectedMethod] = useState<any>({});
  const [isSameAddress, setSameAddress] = useState<boolean>(true);

  const {data: dataCheckoutMethods, isLoading: isLoadingCheckoutMethods} =
    useQuery(['getCheckoutMethods'], getCheckoutMethods, {
      onSuccess(data) {
        setselectedMethod(data.data.ShippingMethods[0]);
      },
    });
  const {mutate: mutateSelectAddress, isLoading: isLoadingSelectAddress} =
    useMutation(selectBillingAddress, {
      onSuccess: data => {
        setActiveStep(3);
        return data;
      },
    });
  const {
    mutate: mutateSelectShippingMethod,
    isLoading: isLoadingShippingMethod,
  } = useMutation(selectShippingMethod, {
    onSuccess: data => {
      if (isSameAddress && selectedAddress.Id) {
        mutateSelectAddress({
          addressId: selectedAddress.Id,
          isBillingAddress: false,
        });
      } else {
        setActiveStep(3);
      }
      return data;
    },
  });
  const handleSubmit = (address: IAddress) => {
    mutateSelectShippingMethod({
      Name: selectedMethod.Name,
      ShippingRateComputationMethodSystemName:
        selectedMethod.ShippingRateComputationMethodSystemName,
    });
  };

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
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <FlatList
        data={dataCheckoutMethods?.data?.ShippingMethods}
        style={styles.container}
        contentContainerStyle={{paddingHorizontal: spacing.content}}
        keyExtractor={(i, _) => _.toString()}
        ListHeaderComponent={
          <Text
            color={colors.primary}
            variant="mediumBold"
            tx="checkout.checkout-method-title"
            style={{marginBottom: spacing.small}}
          />
        }
        renderItem={({item}) => {
          const isSelected = selectedMethod === item;
          return (
            <Pressable
              onPress={() => setselectedMethod(item)}
              style={[
                styles.checkoutMethod,
                {
                  backgroundColor: isSelected ? colors.transparent : '#F3FBFF',
                  borderColor: isSelected
                    ? colors.secondary
                    : colors.transparent,
                },
              ]}>
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
        ListFooterComponent={
          <>
            <View style={styles.componentTitle}>
              <Text
                color={colors.primary}
                variant="mediumBold"
                tx="checkout.checkout-delivery-address"
                style={{flex: 1}}
              />
              <Text
                color={colors.gray[300]}
                variant="smallRegular"
                tx="checkout.checkout-delivery-description"
                numberOfLines={1}
                style={{flex: 1}}
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
                  transform: [{scale: 0.7}],
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
            {!isSameAddress ? (
              <AddAddressComponent
                onSubmit={handleSubmit}
                isBillingAddress={false}
              />
            ) : (
              <Button
                isLoading={isLoadingShippingMethod || isLoadingSelectAddress}
                onPress={handleSubmit}
                style={{marginBottom: 10}}
                title="addAddress.submitBtn"
              />
            )}
          </>
        }
      />
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: spacing.xLarge,
    marginBottom: spacing.medium,
  },
  componentTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkoutMethod: {
    padding: spacing.normal,
    borderRadius: spacing.small,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: spacing.small,
  },
});

export default CheckoutStepTwo;
