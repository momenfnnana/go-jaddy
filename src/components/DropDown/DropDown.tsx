import React, {useContext, useState} from 'react';
import {Pressable, View, StyleSheet, TouchableOpacity} from 'react-native';
import {colors, font, spacing} from 'theme';
import Text from 'components/Text';
import Divider from 'components/Divider';
import {UserContext} from 'context/UserContext';
import {useCurrency} from 'hook/useCurrency';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {ICurrency} from 'types';
import {changeLocalCurrencies} from 'constants';
import {useDropDownContext} from 'context/dropdownContext';
import {getCurrencies} from 'services/Auth';
import {useQuery} from '@tanstack/react-query';

interface IDropDown {
  text?: string;
  items?: any[];
  varient?: 'currencies' | 'primmary';
}

let dropdownWidth: number = 145;
const DropDown = ({text, items}: IDropDown) => {
  const {currencies} = useContext(UserContext);
  const {isDropDownShown, setIsDropDownShown} = useDropDownContext();
  const [refreshCurrency, setRefreshCurrency] = useState<boolean>();
  const {currency} = useCurrency(refreshCurrency);
  const {
    data: currenciesData,
    isLoading: isLoadingCurrencies,
    isSuccess: isSuccessLoadingCurrencies,
  } = useQuery(['currencies'], getCurrencies);
  const showDropDownHandler = () => {
    setIsDropDownShown((currentValue: boolean) => !currentValue);
  };
  const changeCurrencyHandler = (value: ICurrency) => {
    changeLocalCurrencies(value);
    setRefreshCurrency(currentState => !currentState);
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={showDropDownHandler} style={styles.currencyContainer}>
        <Text
          variant="smallBold"
          text={`${currency?.Name} (${currency?.Symbol})`}
        />
      </Pressable>
      {isDropDownShown && currenciesData?.data?.Currencies.length && (
        <View style={styles.listContainer}>
          {currenciesData?.data?.Currencies.map(
            (item: ICurrency, index: number) => {
              return (
                <>
                  <TouchableOpacity
                    onPress={() => changeCurrencyHandler(item)}
                    style={styles.row}>
                    <View key={item?.Id} style={styles.dropDownItem}>
                      <Text
                        variant={
                          currency?.Id === item?.Id
                            ? 'xSmallBold'
                            : 'xSmallRegular'
                        }
                        text={`${item?.Name} (${item?.Symbol})`}
                        color={
                          currency?.Id === item?.Id
                            ? colors.primary
                            : colors.arrowColor
                        }
                      />
                    </View>
                    {currency?.Id === item?.Id && (
                      <AntDesign
                        name={'check'}
                        size={15}
                        color={colors.primary}
                      />
                    )}
                  </TouchableOpacity>
                  {currenciesData?.data?.Currencies.length !== index + 1 && (
                    <Divider />
                  )}
                </>
              );
            },
          )}
        </View>
      )}
    </View>
  );
};

export default DropDown;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  currencyContainer: {
    backgroundColor: colors.secondaryBackground3,
    paddingHorizontal: spacing.small,
    paddingVertical: spacing.smaller,
    borderRadius: spacing.large,
  },
  listContainer: {
    position: 'absolute',
    borderWidth: 0.5,
    borderColor: colors.greenSecondary,
    borderRadius: spacing.tiny + 1,
    bottom: spacing.small * 2 + font.lineHeight.small,
    backgroundColor: colors.white,
    width: dropdownWidth,
    right: 10,
  },
  dropDownItem: {
    paddingVertical: spacing.medium,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.small,
  },
});
