import React from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {AddAddressComponent, AddressItem, Loader, Text} from 'components';
import {useMutation, useQuery} from '@tanstack/react-query';
import {getCheckoutAddresses, selectBillingAddress} from 'services/Checkout';
import {colors, spacing} from 'theme';
import {IAddress} from 'types';
import {ICheckoutStep} from '..';
import {useAccessToken} from 'hook/useAccessToken';
interface ICheckoutAddress {
  item: IAddress;
  index: number;
  onSelect: (item: IAddress) => void;
}

interface ICheckoutStepOne extends ICheckoutStep {
  setSelectedAddress: (address: IAddress) => void;
}

const RenderItem = ({item, onSelect}: ICheckoutAddress) => {
  return (
    <AddressItem
      item={item}
      isSelectAddress={true}
      onPressAddress={onSelect}
      containerStyle={{backgroundColor: colors.blue + 10}}
    />
  );
};

const CheckoutStepOne = ({
  setActiveStep,
  setSelectedAddress,
}: ICheckoutStepOne) => {
  const {data, isLoading} = useQuery(
    ['getCheckoutAddresses'],
    getCheckoutAddresses,
  );
  const {mutate, isLoading: isLoadingSelectAddress} = useMutation(
    selectBillingAddress,
    {
      onSuccess: data => {
        setActiveStep(2);
        return data;
      },
    },
  );
  const onSelectAddress = (address: IAddress) => {
    if (address.Id) {
      setSelectedAddress(address);
      mutate({addressId: address.Id, isBillingAddress: true});
    }
  };
  if (isLoading) {
    return <Loader containerStyle={styles.containerStyle} />;
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{flex: 1, zIndex: -1}}>
        {isLoadingSelectAddress && <Loader variant="screenContent" />}
        <View style={styles.container}>
          <View style={styles.componentTitle}>
            <Text
              color={colors.primary}
              variant="mediumBold"
              tx="checkout.payment-address"
              style={{flex: 1}}
            />
            <Text
              color={colors.arrowColor}
              variant="smallRegular"
              tx="checkout.address-to-recieve-invoice"
              numberOfLines={1}
              style={{flex: 1}}
            />
          </View>
          <FlatList
            data={data?.data?.Addresses}
            keyExtractor={item => item?.Id.toString()}
            renderItem={data => (
              <RenderItem {...data} onSelect={onSelectAddress} />
            )}
            style={styles.flatList}
            ListFooterComponent={
              <AddAddressComponent
                onSubmit={address => {
                  setSelectedAddress(address);
                  setActiveStep(2);
                }}
                isBillingAddress={true}
              />
            }
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CheckoutStepOne;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.small,
    marginTop: spacing.xLarge,
    flex: 1,
  },
  containerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  componentTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flatList: {
    marginTop: spacing.normal,
  },
});
