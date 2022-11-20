import {Pressable, View, ViewStyle} from 'react-native';
import React, {useEffect, useState} from 'react';
import {colors} from 'theme';
import {Loader, Text} from 'components';
import {useMutation, useQuery} from '@tanstack/react-query';
import {deleteAddress, setDefulatAddress} from 'services/Addresses';
import {useNavigation} from '@react-navigation/native';
import {PreviousAddressNavigationProp} from 'navigators/NavigationsTypes';
import {IAddress} from 'types';

interface IAddressItem {
  item: IAddress;
  setDeletedItem?: (id: number) => void;
  refetchAddresses?: () => void;
  isSelectAddress?: boolean;
  onPressAddress?: (item: IAddress) => void;
  containerStyle?: ViewStyle;
}

const AddressItem = ({
  item,
  setDeletedItem,
  refetchAddresses,
  isSelectAddress = false,
  onPressAddress,
  containerStyle,
}: IAddressItem) => {
  const [pressedDefualt, setPressedDefualt] = useState<number>(-1);
  const [pressedDelete, setPressedDelete] = useState<number>(-1);
  const {navigate} = useNavigation<PreviousAddressNavigationProp>();
  const {
    isLoading,
    // isFetching: isFetchingSetDefulatAddress,
    // refetch: refetchSetDefulatAddress,
    mutate,
  } = useMutation([`setDefulatAddress${item.Id}`], setDefulatAddress, {
    onSuccess: data => {
      refetchAddresses?.();
      return data;
    },
  });

  const {isFetching: isFetchingDeleteAddress, refetch: refetchDeleteAddress} =
    useQuery(
      [`DeleteAddress${item.Id}`],
      () => deleteAddress({id: pressedDelete}),
      {
        enabled: false,
        onSuccess() {
          setDeletedItem?.(pressedDelete);
          setPressedDelete(-1);
        },
      },
    );

  // useEffect(() => {
  //   if (pressedDefualt != -1) {
  //     refetchSetDefulatAddress();
  //   }
  // }, [pressedDefualt]);

  useEffect(() => {
    if (pressedDelete != -1) {
      refetchDeleteAddress();
    }
  }, [pressedDelete]);

  return (
    <Pressable
      onPress={() => onPressAddress?.(item)}
      disabled={!isSelectAddress}
      style={[
        {
          paddingHorizontal: 30,
          paddingVertical: 20,
          borderRadius: 8,
          backgroundColor: colors.white,
          marginBottom: 10,
        },
        containerStyle,
      ]}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={{flex: 1}}>
          <Text
            text={item?.FirstName + ' ' + item?.LastName}
            variant="smallRegular"
            numberOfLines={1}
          />
          <Text
            text={item?.Address1 + ' ' + item?.Address2}
            variant="smallRegular"
            numberOfLines={1}
          />
          <Text text={item?.City} variant="smallRegular" numberOfLines={1} />
          <Text
            text={item?.CountryName}
            variant="smallRegular"
            numberOfLines={1}
          />
          <Text text={item?.Email} variant="smallRegular" numberOfLines={1} />
          <Text
            txOptions={{phoneNumber: item?.PhoneNumber}}
            tx={'previousTitles.phoneNumber'}
            variant="smallRegular"
            numberOfLines={1}
          />
        </View>
        {!isSelectAddress && (
          <View style={{flex: 1, alignItems: 'flex-end'}}>
            <View
              style={{
                paddingVertical: 5,
                paddingHorizontal: 10,
                borderRadius: 5,
                backgroundColor: colors.secondary,
              }}>
              <Text
                tx="previousTitles.chargeLabel"
                color={colors.white}
                variant="xSmallBold"
              />
            </View>
          </View>
        )}
      </View>
      {!isSelectAddress && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 20,
          }}>
          <View
            style={{
              backgroundColor: colors.gray[200],
              paddingVertical: 5,
              paddingHorizontal: 15,
              borderRadius: 7,
              opacity: item.IsDefault ? 1 : 0,
            }}>
            <Text tx="previousTitles.defultLabel" variant="xSmallBold" />
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {!item.IsDefault && (
              <Pressable
                disabled={isLoading}
                onPress={() => {
                  // setPressedDefualt(item.Id);
                  mutate({id: item.Id});
                }}>
                {isLoading ? (
                  <Loader size={'small'} />
                ) : (
                  <Text
                    tx="previousTitles.defualtBtn"
                    color={colors.gray[500]}
                    variant="smallRegular"
                  />
                )}
              </Pressable>
            )}
            <Pressable
              onPress={() => {
                navigate('AddAddress', {item});
              }}
              style={{marginHorizontal: 10}}>
              <Text tx="previousTitles.editBtn" variant="smallRegular" />
            </Pressable>
            <Pressable
              disabled={isFetchingDeleteAddress}
              onPress={() => {
                setPressedDelete(item.Id);
              }}>
              {isFetchingDeleteAddress ? (
                <Loader size={'small'} color={colors.red} />
              ) : (
                <Text
                  tx="previousTitles.deleteBtn"
                  color={colors.red}
                  variant="smallRegular"
                />
              )}
            </Pressable>
          </View>
        </View>
      )}
    </Pressable>
  );
};

export default AddressItem;
