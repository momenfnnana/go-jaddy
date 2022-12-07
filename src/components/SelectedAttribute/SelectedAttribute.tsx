import React from 'react';
import {StyleSheet, View} from 'react-native';
import Text from 'components/Text';
import {colors, spacing} from 'theme';

interface IAttribute {
  AttributeType?: string;
  AttributeValue?: string;
}

export interface ISelectedAttribute {
  items: IAttribute[];
}

const SelectedAttribute = ({items}: ISelectedAttribute) => {
  if (!!items?.length) {
    return items?.map((_: any, index: number) => (
      <View style={styles.container} key={index.toString()}>
        <Text
          text={_?.AttributeType}
          variant="xSmallBold"
          style={styles.attributeType}
          center
        />
        <View
          style={[
            styles.attributeColor,
            {backgroundColor: _?.AttributeValue || colors.primary},
          ]}
        />
      </View>
    ));
  }
  return null;
};

export default SelectedAttribute;
const styles = StyleSheet.create({
  container: {
    width: 70,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  attributeType: {
    borderRadius: spacing.medium + 2,
    borderWidth: 1,
    borderColor: colors.reloadColor,
    padding: spacing.tiny,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  attributeColor: {
    width: 27,
    height: 27,
    borderRadius: 27 * 0.5,
    left: -10,
    zIndex: -1,
  },
});
