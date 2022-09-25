import { OnboardingBG } from 'assets/images';
import React from 'react';
import {ImageBackground, ViewStyle} from 'react-native';
import LanguageModal from './components/LanguageModal';
import Pagination from './components/Pagination';
import Slider from './components/Slider';
import SliderList from './components/SliderList';


const Onboarding: React.FC<{
  children: React.ReactNode;
  style?: ViewStyle;
}> = () => {
  return (
    <ImageBackground style={{flex: 1}} source={OnboardingBG}>
      <Slider>
        <SliderList />
        <Pagination />
        <LanguageModal />
      </Slider>
    </ImageBackground>
  );
};

export default Onboarding;
