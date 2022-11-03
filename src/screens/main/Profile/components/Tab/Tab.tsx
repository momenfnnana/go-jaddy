import React from 'react';
import {StyleSheet, View, Pressable} from 'react-native';
import {Divider, Text} from 'components';
import {spacing} from 'theme';
import {useCurrency} from 'hook/useCurrency';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {ProfileScreenNavigationProp} from 'navigators/NavigationsTypes';
import {ITab} from '../../Lists/UnAuthList';

interface ITabCustom extends ITab {
  showDevider: boolean;
  isLogged: boolean;
}
const Tab = ({
  icon,
  title,
  RightIcon,
  bottomSection,
  showDevider = true,
  goTo,
  isLogged,
}: ITabCustom) => {
  const {currency} = useCurrency();
  const {t} = useTranslation();
  const {navigate} = useNavigation<ProfileScreenNavigationProp>();
  const onPressTab = () => {
    if (isLogged) {
      if (goTo) {
        navigate(goTo);
      }
    } else {
      navigate('AuthFlow', {screen: 'Login'} as any);
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
