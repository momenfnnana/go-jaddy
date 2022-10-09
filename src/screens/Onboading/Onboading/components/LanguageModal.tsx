import {
  I18nManager,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {colors} from 'theme';
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {Button, Text} from 'components';
import {useNavigation} from '@react-navigation/native';
import i18n from 'i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';
import {AuthNavigationsType} from 'navigators/NavigationsTypes';

interface ILanguageModalProps {
  style?: ViewStyle;
  language?: string;
  visibleLangModal?: boolean;
  setLanguage?: (lang: string) => void;
  setVisibleLangModal?: (lang: boolean) => void;
}

const LanguageModal: React.FC<ILanguageModalProps> = ({
  language,
  visibleLangModal,
  setLanguage,
  setVisibleLangModal,
}) => {
  const {navigate} = useNavigation<AuthNavigationsType>();
  const confirmLanguage = async () => {
    i18n.changeLanguage(language);
    AsyncStorage.setItem('languageId', language!);
    navigate('Login');
    if (language == 'en') {
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
  console.log({language});
  
  return (
    <>
      {visibleLangModal && (
        <View style={styles.container}>
          <Pressable
            style={styles.overlay}
            onPress={() => setVisibleLangModal!(false)}
          />
          <SafeAreaView style={{width: '100%', alignItems: 'center'}}>
            <View style={styles.containerModal}>
              <View style={styles.containerHeader}>
                <Icon
                  name="close"
                  style={{opacity: 0}}
                  size={26}
                  color={colors.gray[500]}
                />
                <Text tx="languageModel.title" variant="largeBold" />
                <Icon
                  onPress={() => setVisibleLangModal!(false)}
                  name="close"
                  size={26}
                  color={colors.gray[500]}
                />
              </View>
              <Pressable
                onPress={() => setLanguage!('ar')}
                style={
                  language == 'ar' ? styles.activeButn : styles.disabledButn
                }>
                <MaterialIcon
                  name="radio-button-off"
                  size={25}
                  color={colors.white}
                  style={{opacity: 0}}
                />
                <Text
                  center
                  color={language == 'ar' ? colors.white : '#000'}
                  tx="languageModel.arBtn"
                  variant={language == 'ar' ? 'largeBold' : 'largeRegular'}
                />
                <MaterialIcon
                  name={`radio-button-${language == 'ar' ? 'on' : 'off'}`}
                  size={25}
                  color={language == 'ar' ? colors.white : colors.gray[500]}
                />
              </Pressable>
              <Pressable
                onPress={() => setLanguage!('en')}
                style={[
                  language == 'en' ? styles.activeButn : styles.disabledButn,
                  {marginTop: 20},
                ]}>
                <MaterialIcon
                  name="radio-button-off"
                  size={25}
                  color={colors.gray[500]}
                  style={{opacity: 0}}
                />
                <Text
                  center
                  color={language == 'en' ? colors.white : '#000'}
                  tx="languageModel.enBtn"
                  variant={language == 'en' ? 'largeBold' : 'largeRegular'}
                />
                <MaterialIcon
                  name={`radio-button-${language == 'en' ? 'on' : 'off'}`}
                  size={25}
                  color={language == 'en' ? colors.white : colors.gray[500]}
                />
              </Pressable>
              <Button
                onPress={confirmLanguage}
                title="buttons.languageBtn"
                style={{marginTop: 30}}
              />
            </View>
          </SafeAreaView>
        </View>
      )}
    </>
  );
};

export default LanguageModal;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#0008',
  },
  containerModal: {
    width: '90%',
    paddingHorizontal: 25,
    paddingVertical: 20,
    borderRadius: 15,
    backgroundColor: colors.white,
  },
  containerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  activeButn: {
    paddingVertical: 10,
    backgroundColor: colors.secondary,
    borderRadius: 30,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  disabledButn: {
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.gray[500],
    borderRadius: 30,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
});
