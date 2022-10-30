import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {colors, spacing} from 'theme';
interface IAttribute {
  selectAttributeHandler: ({attributeValue, attribute}: any) => void;
  attributeValue: any;
  item: any;
}
const Boxes = ({selectAttributeHandler, attributeValue, item}: IAttribute) => {
  return (
    <Pressable
      onPress={() =>
        selectAttributeHandler({
          attributeValue,
          attribute: item,
        })
      }
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
