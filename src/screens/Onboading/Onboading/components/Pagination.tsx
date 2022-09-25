import {RouteProp, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Button, Text} from 'components';
import SecondaryButton from 'components/SecondaryButton';
import {AuthRoutes} from 'navigators/RoutesTypes';
import React, {useRef} from 'react';
import {
  Animated,
  Pressable,
  SafeAreaView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import {ISliderListProps} from '../helpers/types';
import DotIndicator from './DotIndicator';

interface IProfileNavigation
  extends NativeStackNavigationProp<AuthRoutes, 'Onboarding'>,
    RouteProp<AuthRoutes, 'Onboarding'> {}

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
  const {navigate} = useNavigation<IProfileNavigation>();
  const safeData = data ?? [];
  const safeScrollX = scrollX ?? useRef(new Animated.Value(0)).current;
  const safeCurrentIndex = currentIndex ?? 0;
  return (
    <View style={[styles.container, {width: 0.9 * width}, style]}>
      <DotIndicator
        data={safeData}
        scrollX={safeScrollX}
        currentIndex={safeCurrentIndex}
        style={{...styles.dotIndicator, marginBottom: height / 6}}
      />
      <SafeAreaView>
        {currentIndex! < data?.length! - 1 ? (
          <View style={[styles.containerButtons, {width: width}]}>
            <SecondaryButton
              onPress={() => {
                if (currentIndex! < data?.length! - 1) {
                  flatRef.current.scrollToIndex({
                    index: currentIndex! + 1,
                    animated: true,
                  });
                } else {
                }
              }}
              title="buttons.next"
            />
            <Text
              onPress={() => setVisibleLangModal!(true)}
              tx="buttons.skip"
              style={{opacity: 0.5}}
            />
          </View>
        ) : (
          <Button
            onPress={() => setVisibleLangModal!(true)}
            style={{width: width - 50}}
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
  },
});
export default Pagination;
