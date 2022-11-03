import {View, FlatList, Pressable, RefreshControl} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {getPreAddresses, setDefulatAddress} from 'services/Addresses';
import {AddHeaderBtn, BackButton, Loader, Text} from 'components';
import {colors, spacing} from 'theme';
import AddressItem from './components/AddressItem';
import {useNavigation, useRoute} from '@react-navigation/native';
import EmptyPage from 'components/EmptyPage/EmptyPage';
import {PreviousAddressNavigationProp} from 'navigators/NavigationsTypes';

const PreviousTitles = () => {
  const [isDefault, setDefault] = useState<number>(-1);
  const {params} = useRoute();
  const [deletedItem, setDeletedItem] = useState<number>(-1);
  const [data, setData] = useState([]);
  const {setOptions, navigate} = useNavigation<PreviousAddressNavigationProp>();
  const {
    isFetching: isFetchingPreAdd,
    isLoading: isLoadingPreAdd,
    refetch: refetchPreAdd,
  } = useQuery(['getPreAddresses'], getPreAddresses, {
    onSuccess(data) {
      if (data.data?.Addresses.length > 0) {
        setDefault(
          data.data?.Addresses.find((i: any) => i.IsDefault === true).Id,
        );
        setData(data.data?.Addresses);
      }
    },
  });

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
    if (deletedItem !== -1) {
      setData(data.filter(i => (i as any)?.Id != deletedItem));
    }
  }, [deletedItem]);

  useEffect(() => {
    if (params?.refetch) {
      refetchPreAdd();
    }
  }, [params?.refetch]);

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
      {data.length > 0 ? (
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={isFetchingPreAdd}
              onRefresh={refetchPreAdd}
            />
          }
          data={data}
          keyExtractor={(i, _) => _.toString()}
          contentContainerStyle={{
            paddingHorizontal: spacing.content,
            paddingVertical: spacing.xLarge,
          }}
          renderItem={({item}) => (
            <AddressItem
              item={item}
              isDefault={isDefault}
              setDefault={setDefault}
              setDeletedItem={setDeletedItem}
            />
          )}
        />
      ) : (
        <EmptyPage
          title="EmptyPage.addresses-title"
          descritopn="addresses-description"
        />
      )}
    </View>
  );
};

export default PreviousTitles;
