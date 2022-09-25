import {OnboardingBG} from 'assets/images';
import React, {useState} from 'react';
import {
  ImageBackground,
  ViewStyle,
  View,
  SafeAreaView,
  Pressable,
  StyleSheet,
} from 'react-native';
import {colors} from 'theme';

import Pagination from './components/Pagination';
import Slider from './components/Slider';
import SliderList from './components/SliderList';
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {Button, Text} from 'components';

const Onboarding: React.FC<{
  children: React.ReactNode;
  style?: ViewStyle;
}> = () => {
  const [language, setLanguage] = useState('ar');
  const [visibleLangModal, setVisibleLangModal] = useState(false);
  return (
    <ImageBackground
      style={{flex: 1, position: 'relative'}}
      source={OnboardingBG}>
      <Slider>
        <SliderList />
        <Pagination />
        {visibleLangModal && (
          <Pressable
            onPress={() => setVisibleLangModal(false)}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundColor: '#0008',
              justifyContent: 'flex-end',
            }}>
            <SafeAreaView style={{width: '100%', alignItems: 'center'}}>
              <View
                style={{
                  width: '90%',
                  paddingHorizontal: 25,
                  paddingVertical: 20,
                  borderRadius: 15,
                  // height: 300,
                  backgroundColor: colors.white,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 30,
                  }}>
                  <Icon
                    name="close"
                    style={{opacity: 0}}
                    size={26}
                    color={colors.gray[500]}
                  />
                  <Text tx="languageModel.title" variant="largeBold" />
                  <Icon name="close" size={26} color={colors.gray[500]} />
                </View>
                <Pressable
                  onPress={() => setLanguage('ar')}
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
                  onPress={() => setLanguage('en')}
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
                <Button title="buttons.languageBtn" style={{marginTop: 30}} />
              </View>
            </SafeAreaView>
          </Pressable>
        )}
      </Slider>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
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

export default Onboarding;
