import {Text} from 'components';
import React from 'react';
import {Pressable, ViewStyle} from 'react-native';
import {colors, spacing} from 'theme';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {IAttribute} from './types';

const RadioList = ({
  selectAttributeHandler,
  attributeValue,
  item,
}: IAttribute) => {
  const radioBtnContainer = {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.small,
    marginTop: spacing.smaller,
  } as ViewStyle;
  return (
    <Pressable
      onPress={() =>
        selectAttributeHandler &&
        selectAttributeHandler({
          attributeValue,
          attribute: item,
        })
      }
      style={radioBtnContainer}>
      <MaterialIcons
        name={`radio-button-${
          attributeValue.IsPreSelected || attributeValue.isSelected
            ? 'on'
            : 'off'
        }`}
        size={20}
        color={
          attributeValue.IsPreSelected || attributeValue.isSelected
            ? colors.secondary
            : colors.gray[300]
        }
      />
      <Text
        text={attributeValue.Name}
        variant="smallRegular"
        style={{paddingRight: spacing.smaller}}
      />
    </Pressable>
  );
};

export default RadioList;
