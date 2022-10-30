import React, {useEffect, useMemo, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from 'components';
import SelectDropdown from 'react-native-select-dropdown';
import {colors, font, spacing} from 'theme';
import {useTranslation} from 'react-i18next';
import {IAttribute} from './types';

interface selectedAttribute {
  Id: number;
  IsPreSelected: boolean;
  Name: string;
  PriceAdjustment: string;
  PriceAdjustmentValue: number;
  isSelected: boolean;
}

const DropdownList = ({item}: IAttribute) => {
  const {t} = useTranslation();
  const [selectedAttribute, setSelectedAttribute] =
    useState<selectedAttribute>();
  const selectedItem = useMemo(() => {
    return item.Values.find((ele: any) => {
      return ele?.IsPreSelected === true;
    });
  }, [item]);
  useEffect(() => {
    setSelectedAttribute(selectedItem);
  }, [selectedItem]);

  return (
    <SelectDropdown
      defaultButtonText={
        selectedAttribute?.Name ||
        t(`product-details.select`, {
          optionName: item.Name,
        })
      }
      data={item.Values}
      buttonStyle={styles.dropDownBtn}
      buttonTextStyle={styles.dropDownBtnText}
      renderCustomizedRowChild={item => (
        <View style={styles.dropDownItemContainer}>
          <Text variant="mediumBold" text={item.Name} />
        </View>
      )}
      onSelect={(selectedItem: selectedAttribute) => {
        setSelectedAttribute(selectedItem);
      }}
      buttonTextAfterSelection={(selectedItem: selectedAttribute) => {
        return selectedItem.Name;
      }}
      rowTextForSelection={(item: any) => item}
    />
  );
};

export default DropdownList;
const styles = StyleSheet.create({
  dropDownBtn: {
    backgroundColor: colors.secondaryBackground3,
    borderRadius: spacing.large,
  },
  dropDownBtnText: {
    fontFamily: font.bold,
    fontSize: font.size.medium,
  },
  dropDownItemContainer: {
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: spacing.smaller,
  },
});
