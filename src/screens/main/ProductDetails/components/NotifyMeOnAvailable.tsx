import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Pressable, StyleSheet, View} from 'react-native';
import {Text} from 'components';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {colors, spacing} from 'theme';
import {subscribeProduct} from 'services/Home';
import {useMutation} from '@tanstack/react-query';

interface INotifyMeOnAvailable {
  id: number;
  setSubscribed: (value: boolean) => void;
}
const NotifyMeOnAvailable = ({id, setSubscribed}: INotifyMeOnAvailable) => {
  const [checked, setChecked] = useState<boolean>(false);

  const {mutate, isLoading, isError, error, isSuccess, data} = useMutation(
    subscribeProduct,
    {
      onSuccess: data => {
        return data;
      },
      onError: error => {
        return error;
      },
    },
  );
  const onPressCheckbox = () => {
    setChecked(true);
    mutate(id);
  };

  useEffect(() => {
    if (data) {
      setSubscribed(true);
    }
  }, [isSuccess]);

  return (
    <Pressable
      style={styles.row}
      onPress={onPressCheckbox}
      disabled={isSuccess}>
      <View style={styles.checkboxContainer}>
        {checked && <AntDesign name="check" />}
      </View>
      {isLoading && <ActivityIndicator size={'small'} color={colors.primary} />}
      <Text tx="product-details.notify-me" />
    </Pressable>
  );
};

export default NotifyMeOnAvailable;
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxContainer: {
    width: spacing.normal,
    height: spacing.normal,
    borderWidth: 1,
    borderColor: colors.reloadColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 5,
  },
});
