import React, {useEffect} from 'react';
import {StyleSheet, View, Pressable} from 'react-native';
import {Divider, Text} from 'components';
import {ITab} from '../../Lists/UnAuthList';
import {spacing} from 'theme';
import {useCurrency} from 'hook/useCurrency';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

interface ITabCustom extends ITab {
  showDevider: boolean;
}
const Tab = ({
  icon,
  title,
  RightIcon,
  bottomSection,
  showDevider = true,
  goTo,
}: ITabCustom) => {
  const {currency} = useCurrency();
  const {t} = useTranslation();
  const {navigate} = useNavigation();
  useEffect(() => {
    const currencyObj = AsyncStorage.getItem('currency');
    currencyObj.then(res => {
      console.log({currencyObj: res});
    });
  }, []);
  const onPressTab = () => {
    console.log({title});
    if (goTo) {
      navigate(goTo);
    }
  };
  return (
    <Pressable onPress={onPressTab}>
      <View style={styles.containerContent}>
        <View style={styles.row}>
          {icon}
          <Text tx={title} style={styles.title} />
        </View>
        <View>
          {RightIcon && (
            <RightIcon
              text={t('currencies.shikel', {currency: currency?.Symbol})}
            />
          )}
        </View>
      </View>
      {bottomSection}
      {showDevider && <Divider />}
    </Pressable>
  );
};

export default Tab;

const styles = StyleSheet.create({
  container: {},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.large - 2,
  },
  containerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    marginLeft: spacing.small,
  },
});
