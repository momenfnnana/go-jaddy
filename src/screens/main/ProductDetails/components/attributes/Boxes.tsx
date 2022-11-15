import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {colors, spacing} from 'theme';
import {IAttribute} from './types';

const Boxes = ({
  selectAttributeHandler,
  attributeValue,
  item,
  onSelect,
}: IAttribute) => {
  const onPress = () => {
    selectAttributeHandler &&
      selectAttributeHandler({
        attributeValue,
        attribute: item,
      });
    onSelect({
      selectedItem: attributeValue,
      parentAttribute: {
        AttributeId: item.AttributeId,
        IsRequired: item.IsRequired,
        IsMultipleChoice: item.IsMultipleChoice,
        VariantAttributeId: item.VariantAttributeId,
        Name: item.Name,
      },
    });
  };
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.colorAttribute,
        {
          borderRadius:
            item.AttributeControlType === 'RadioList'
              ? spacing.xxLarge * 0.5
              : spacing.tiny,
          backgroundColor: attributeValue?.Color || undefined,
          borderColor:
            attributeValue.IsPreSelected || attributeValue.isSelected
              ? colors.secondary
              : 'transparent',
        },
      ]}
    />
  );
};

export default Boxes;
const styles = StyleSheet.create({
  colorAttribute: {
    width: spacing.xxLarge,
    height: spacing.xxLarge,
    marginHorizontal: spacing.tiny + 1,
    borderWidth: 2,
    marginTop: spacing.smaller,
  },
});
