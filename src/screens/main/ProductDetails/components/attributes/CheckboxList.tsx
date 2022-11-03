import React, {useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {Text} from 'components';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors, spacing} from 'theme';
import {IAttribute} from './types';
interface ICheckboxItem {
  ele: any;
  onSelect: (value: any) => void;
}
const CheckboxItem = ({ele, onSelect}: ICheckboxItem) => {
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const onPress = () => {
    onSelect({...ele, isSelected: !isSelected});
    setIsSelected(currentState => !currentState);
  };
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <MaterialCommunityIcons
        name={isSelected ? 'checkbox-marked' : 'checkbox-blank-outline'}
        size={20}
        color={colors.primary}
      />
      <Text text={ele.Name} style={styles.checkboxText} />
    </Pressable>
  );
};

const CheckboxList = ({item, onSelect}: IAttribute) => {
  const onSelectItem = (value: any) => {
    onSelect({
      selectedItem: value,
      parentAttribute: {
        AttributeId: item.AttributeId,
        IsRequired: item.IsRequired,
        IsMultipleChoice: item.IsMultipleChoice,
        VariantAttributeId: item.VariantAttributeId,
      },
    });
  };
  return (
    <View style={styles.container}>
      {item?.Values?.map((ele: any, index: number) => (
        <CheckboxItem ele={ele} key={index} onSelect={onSelectItem} />
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
  checkboxText: {
    marginLeft: spacing.tiny,
  },
});
