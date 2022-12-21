import React from 'react';
import {StyleSheet, View} from 'react-native';
import Text from 'components/Text';
import {colors, spacing} from 'theme';

interface IAttribute {
  AttributeType?: string;
  AttributeValue?: string;
}

export interface ISelectedAttribute {
  items?: IAttribute[];
}

const SelectedAttribute = ({items}: ISelectedAttribute) => {
  if (!!items?.length) {
    return items?.map((_: any, index: number) => {
      return (
        <View
          style={[
            styles.container,
            {width: _?.values?.length > 0 ? undefined : 70},
          ]}
          key={index.toString()}>
          <Text
            text={_?.Name || _?.AttributeType}
            variant="xSmallBold"
            style={styles.attributeType}
            center
            numberOfLines={1}
          />
          {_?.values?.length > 0 ? (
            _?.values?.map((ele: any) => (
              <>
                {ele?.Color ? (
                  <View
                    style={[
                      styles.attributeColor,
                      {
                        width: 27,
                        left: -10,
                        backgroundColor: ele?.Color || colors.primary,
                      },
                    ]}
                  />
                ) : (
                  <View style={[styles.attributeColor, {marginHorizontal: 5}]}>
                    <Text>{ele?.Name}</Text>
                  </View>
                )}
              </>
            ))
          ) : _?.AttributeType === 'TextBox' ? (
            <View style={[styles.attributeColor, {marginHorizontal: 5}]}>
              <Text>{_?.AttributeValue}</Text>
            </View>
          ) : (
            <View
              style={[
                styles.attributeColor,
                {
                  width: 27,
                  left: -10,
                  backgroundColor: _?.AttributeValue || colors.primary,
                },
              ]}
            />
          )}
        </View>
      );
    });
  }
  return null;
};

export default SelectedAttribute;
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginTop: spacing.tiny,
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
    height: 27,
    borderRadius: 27 * 0.5,
    zIndex: -1,
  },
});
