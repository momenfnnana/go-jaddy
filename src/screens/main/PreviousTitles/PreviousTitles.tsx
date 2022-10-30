import {View, FlatList, Pressable} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {getPreAddresses, setDefulatAddress} from 'services/Addresses';
import {AddHeaderBtn, BackButton, Loader, Text} from 'components';
import {colors, spacing} from 'theme';
import AddressItem from './components/AddressItem';
import {useNavigation} from '@react-navigation/native';

const PreviousTitles = () => {
  const [isDefault, setDefault] = useState<number>(-1);
  const [deletedItem, setDeletedItem] = useState<number>(-1);
  const [data, setData] = useState([]);
  const {setOptions, navigate} = useNavigation();
  const {isFetching: isFetchingPreAdd} = useQuery(
    ['getPreAddresses'],
    getPreAddresses,
    {
      onSuccess(data) {
        setDefault(
          data.data?.Addresses.find((i: any) => i.IsDefault === true).Id,
        );
        setData(data.data?.Addresses);
      },
    },
  );

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
      <FlatList
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
    </View>
  );
};

export default PreviousTitles;
