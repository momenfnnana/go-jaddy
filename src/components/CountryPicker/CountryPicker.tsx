import React from 'react';
import {View, Pressable, Image, StyleSheet} from 'react-native';
import {Modal, Text} from 'components';
import {colors, spacing} from 'theme';
import {ICON_WIDTH, IFlag} from 'screens/Onboading/Login/Login';

const SIZE = 18;
interface ICountryPicker {
  isFlagsShown: boolean;
  hideCountries: () => void;
  flags: IFlag[];
  onSelectCountry: (value: IFlag) => void;
}

const CountryPicker = ({
  isFlagsShown,
  hideCountries,
  flags,
  onSelectCountry,
}: ICountryPicker) => {
  const onSelect = (value: IFlag) => {
    onSelectCountry(value);
    hideCountries();
  };
  return (
    <Modal
      isVisible={isFlagsShown}
      onBackdropPress={hideCountries}
      title="common.select-country">
      {flags.map((item, index) => (
        <Pressable
          onPress={() => onSelect(item)}
          style={[styles.row, styles.justifyBtw]}
          key={index}>
          <Text
            tx={`common.${item.countryName}`}
            variant="smallRegular"
            color={colors.brouwnLight}
            size={20}
          />
          <View style={styles.row}>
            <Text
              text={item.introructionNumber}
              variant="smallRegular"
              color={colors.brouwnLight}
              size={20}
            />
            <Image
              source={item.imageUrl}
              style={[styles.flag, styles.introNumber]}
              resizeMode="center"
            />
          </View>
        </Pressable>
      ))}
    </Modal>
  );
};

export default CountryPicker;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  justifyBtw: {
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: spacing.huge,
    paddingBottom: spacing.normal,
    marginBottom: spacing.normal,
    borderBottomColor: colors.disabledBackground,
    borderBottomWidth: 1,
  },
  flag: {
    width: SIZE,
    height: SIZE,
  },
  introNumber: {
    maxWidth: ICON_WIDTH,
    minWidth: ICON_WIDTH,
  },
});
