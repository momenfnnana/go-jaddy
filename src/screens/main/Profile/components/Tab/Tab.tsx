import React, {useContext} from 'react';
import {StyleSheet, View, Pressable} from 'react-native';
import {Divider, Text} from 'components';
import {colors, spacing} from 'theme';
import {useCurrency} from 'hook/useCurrency';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {ProfileScreenNavigationProp} from 'navigators/NavigationsTypes';
import {ITab} from '../../Lists/UnAuthList';
import {useProtectedFunction} from 'hook/useProdectedFunction';
import {UserContext} from 'context/UserContext';
import Snackbar from 'react-native-snackbar';

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
  params,
}: ITabCustom) => {
  const {userData} = useContext(UserContext);
  const {currency} = useCurrency();
  const {t} = useTranslation();
  const {protectedFunction} = useProtectedFunction();
  const {navigate} = useNavigation<ProfileScreenNavigationProp>();
  const onPressTab = () => {
    if (goTo) {
      switch (title) {
        case 'profile.about-app':
          navigate(goTo, params);
          break;
        case 'profile.favorite':
          if (userData?.IsGuestUser !== true) {
            navigate(goTo, params);
          } else {
            Snackbar.show({
              text: t('wishlist.guest-warning-message'),
              duration: Snackbar.LENGTH_LONG,
              backgroundColor: colors.warning,
            });
          }
          break;
        default:
          protectedFunction({func: () => navigate(goTo, params)});
          break;
      }
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
