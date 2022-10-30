import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {IAttribute} from './types';
import {colors} from 'theme';

const CheckboxList = ({item}: IAttribute) => {
  return (
    <View style={styles.container}>
      {item?.Values?.map((ele: any, index: number) => (
        <View style={styles.row}>
          <Ionicons name={'checkbox'} size={15} color={colors.primary} />
          <Text key={index.toString()} text={ele.Name} />
        </View>
      ))}
    </View>
  );
};

export default CheckboxList;
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
