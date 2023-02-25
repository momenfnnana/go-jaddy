import React, {useState} from 'react';
import {View, StyleSheet, Pressable, I18nManager} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import {getLanguages} from 'services/Auth';
import Text from 'components/Text';
import {colors, spacing} from 'theme';
import {useLanguage} from 'hook/useLanguage';
import i18n from 'i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';

interface ILanguage {
  Id: number;
  Name: string;
  FlagImage: string;
  CultureCode: string;
}

const SwitchLang = () => {
  const {data} = useQuery(['getLanguages'], getLanguages);
  const [refreshLanguage, setRefreshLanguage] = useState<boolean>(false);
  const {language} = useLanguage(refreshLanguage);
  const confirmLanguage = async (languageCode: string, languageId: string) => {
    i18n.changeLanguage(languageCode);
    AsyncStorage.setItem('languageId', languageId!);
    setRefreshLanguage(currentValue => !currentValue);
    if (languageCode == 'en') {
      if (I18nManager.isRTL) {
        await I18nManager.forceRTL(false);
        RNRestart.Restart();
      }
    } else {
      if (!I18nManager.isRTL) {
        await I18nManager.forceRTL(true);
        RNRestart.Restart();
      }
    }
  };

  const changeLanguageHandler = (item: ILanguage) => {
    confirmLanguage(item.CultureCode, item.Id.toString());
  };

  return (
    <View style={styles.container}>
      {data?.data?.Languages?.map((item: ILanguage) => {
        console.log({first: language});
        return (
          <Pressable
            key={item?.Id}
            onPress={() => changeLanguageHandler(item)}
            style={[
              styles.languageBtnContainer,
              {
                backgroundColor:
                  item.Id.toString() === language
                    ? colors.primary
                    : 'transparent',
              },
            ]}>
            <Text
              text={item?.Name}
              color={
                item.Id.toString() === language
                  ? colors.white
                  : colors.languagesSwitchText
              }
            />
          </Pressable>
        );
      })}
    </View>
  );
};

export default SwitchLang;
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: spacing.large,
    backgroundColor: colors.secondaryBackground3,
  },
  languageBtnContainer: {
    paddingHorizontal: spacing.normal,
    paddingVertical: spacing.small,
    borderRadius: spacing.large,
  },
});
