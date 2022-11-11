import {View, FlatList, RefreshControl} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {getPreAddresses} from 'services/Addresses';
import {AddHeaderBtn, AddressItem, BackButton, Loader} from 'components';
import {spacing} from 'theme';
import {useNavigation, useRoute} from '@react-navigation/native';
import EmptyPage from 'components/EmptyPage/EmptyPage';
import {PreviousAddressNavigationProp} from 'navigators/NavigationsTypes';

const PreviousTitles = () => {
  // const [isDefault, setDefault] = useState<number>(-1);
  const {params} = useRoute();
  const [deletedItem, setDeletedItem] = useState<number>(-1);
  const {setOptions, navigate} = useNavigation<PreviousAddressNavigationProp>();

  const {
    isFetching: isFetchingPreAdd,
    isLoading: isLoadingPreAdd,
    refetch: refetchPreAdd,
    data: AddressesData,
  } = useQuery(['getPreAddresses'], getPreAddresses);

  useLayoutEffect(() => {
    setOptions({
      headerLeft: () => <BackButton />,
      headerRight: () => (
        <AddHeaderBtn
          onPress={() => {
            navigate('AddAddress');
          }}
        />
      ),
    });
  }, []);

  useEffect(() => {
    if (params?.refetch) {
      refetchPreAdd();
    }
  }, [params?.refetch]);

  // useEffect(() => {
  //   if (isDefault != -1) {
  //     refetchPreAdd();
  //   }
  // }, [isDefault]);

  useEffect(() => {
    if (deletedItem != -1) {
      refetchPreAdd();
    }
  }, [deletedItem]);

  if (isFetchingPreAdd) {
    return (
      <Loader
        containerStyle={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        size="large"
      />
    );
  }

  return (
    <View style={{flex: 1}}>
      {AddressesData?.data?.Addresses?.length > 0 ? (
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={isFetchingPreAdd}
              onRefresh={refetchPreAdd}
            />
          }
          data={AddressesData?.data?.Addresses}
          keyExtractor={(i, _) => _.toString()}
          contentContainerStyle={{
            paddingHorizontal: spacing.content,
            paddingVertical: spacing.xLarge,
          }}
          renderItem={({item}) => (
            <AddressItem
              item={item}
              setDeletedItem={setDeletedItem}
              refetchAddresses={refetchPreAdd}
            />
          )}
        />
      ) : (
        <EmptyPage
          title="EmptyPage.addresses-title"
          descritopn="EmptyPage.addresses-description"
        />
      )}
    </View>
  );
};

export default PreviousTitles;
