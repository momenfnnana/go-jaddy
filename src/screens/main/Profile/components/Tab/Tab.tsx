import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Divider, Text} from 'components';
import {ITab} from '../../Lists/UnAuthList';
import {spacing} from 'theme';
import {useCurrency} from 'hook/useCurrency';
import {useTranslation} from 'react-i18next';

const Tab = ({icon, title, RightIcon}: ITab) => {
  const {currency} = useCurrency();
  const {t} = useTranslation();
  return (
    <View style={styles.container}>
      <View style={styles.containerContent}>
        <View style={styles.row}>
          {icon}
          <Text tx={title} style={styles.title} />
        </View>
        {RightIcon && (
          <RightIcon
            text={t('currencies.shikel', {currency: currency?.Symbol})}
          />
        )}
      </View>
      <Divider />
    </View>
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
