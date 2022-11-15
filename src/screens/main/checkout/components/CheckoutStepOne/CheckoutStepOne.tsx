import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {AddAddressComponent, AddressItem, Loader, Text} from 'components';
import {useQuery} from '@tanstack/react-query';
import {getCheckoutAddresses} from 'services/Checkout';
import {colors, spacing} from 'theme';
import {IAddress} from 'types';
import {ICheckoutStep} from '..';
interface ICheckoutAddress {
  item: IAddress;
  index: number;
  onSelect: () => void;
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

const CheckoutStepOne = ({setActiveStep}: ICheckoutStep) => {
  const {data, isLoading} = useQuery(
    ['getCheckoutAddresses'],
    getCheckoutAddresses,
  );
  const onSelectAddress = () => {
    // placeholder the address and do api call if needed
  };
  if (isLoading) {
    return <Loader containerStyle={styles.containerStyle} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.componentTitle}>
        <Text
          color={colors.primary}
          variant="mediumBold"
          tx="checkout.payment-address"
        />
        <Text
          color={colors.arrowColor}
          variant="smallRegular"
          tx="checkout.address-to-recieve-invoice"
        />
      </View>
      <FlatList
        data={data?.data?.Addresses}
        keyExtractor={item => item?.Id.toString()}
        renderItem={data => <RenderItem {...data} onSelect={onSelectAddress} />}
        style={styles.flatList}
        ListFooterComponent={
          <AddAddressComponent onSubmit={() => setActiveStep(2)} />
        }
      />
    </View>
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
