import {RouteProp, useNavigation} from '@react-navigation/native';
import {Button, Text} from 'components';
import SecondaryButton from 'components/SecondaryButton';
import {readLanguage} from 'constants';
import {AuthNavigationsType} from 'navigators/NavigationsTypes';
import {AuthRoutes} from 'navigators/RoutesTypes';
import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Pressable,
  SafeAreaView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import {string} from 'yup';
import {ISliderListProps} from '../helpers/types';
import DotIndicator from './DotIndicator';

const Pagination: React.FC<ISliderListProps> = ({
  style,
  data,
  currentIndex,
  setCurrentIndex,
  scrollX,
  flatRef,
  setVisibleLangModal,
}) => {
  const {width, height} = useWindowDimensions();
  const {navigate} = useNavigation<AuthNavigationsType>();
  const [isAr, setAr] = useState<boolean>(false);
  const safeData = data ?? [];
  const safeScrollX = scrollX ?? useRef(new Animated.Value(0)).current;
  const safeCurrentIndex = currentIndex ?? 0;

  useEffect(() => {
    readLanguage().then(lang => setAr(lang == 'ar'));
  }, []);

  const langCondetion = () => {
    if (isAr) {
      return {main: currentIndex! != 0, setCurr: currentIndex! - 1};
    } else {
      return {
        main: currentIndex! < data?.length! - 1,
        setCurr: currentIndex! + 1,
      };
    }
  };

  return (
    <View style={[styles.container, {width: 0.9 * width}, style]}>
      <DotIndicator
        data={safeData}
        scrollX={safeScrollX}
        currentIndex={safeCurrentIndex}
        style={{...styles.dotIndicator, marginBottom: height / 6}}
      />
      <SafeAreaView>
        {langCondetion().main ? (
          <View style={[styles.containerButtons, {width: width}]}>
            <SecondaryButton
              onPress={() => {
                if (langCondetion()) {
                  flatRef.current.scrollToIndex({
                    index: langCondetion().setCurr,
                    animated: true,
                  });
                } else {
                }
              }}
              title="buttons.next"
            />
            <Pressable>
              <Text
                onPress={() => setVisibleLangModal!(true)}
                tx="buttons.skip"
                style={{opacity: 0.5}}
              />
            </Pressable>
          </View>
        ) : (
          <Button
            onPress={() => setVisibleLangModal!(true)}
            style={{width: width - 50, marginBottom: 10}}
            title="buttons.onboardingBtn"
          />
        )}
      </SafeAreaView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotIndicator: {
    marginTop: 52,
  },
  containerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
});
export default Pagination;
