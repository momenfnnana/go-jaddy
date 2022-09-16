import React, {useMemo} from 'react';
import {View, StatusBar} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors, typography, spacing} from 'theme';
// import {CardStyleInterpolators} from '@react-navigation/native-stack';

const headerOptions = {
  headerBackTitleVisible: false,
  headerTitleAlign: 'center',
  headerTitleStyle: {...typography.mediumRegular, color: colors.primary},
  headerLeftContainerStyle: {paddingLeft: spacing.normal},
  headerRightContainerStyle: {paddingRight: spacing.normal},
  headerTintColor: colors.primary,
};

export const useNavigationOptions = () => {
  const {top} = useSafeAreaInsets();
  const paddingTop = StatusBar.currentHeight
    ? 0
    : Math.max(top, spacing.normal);

  const modalOptions = useMemo(
    () => ({
      presentation: 'modal',
      headerShown: false,
      gestureDirection: 'vertical',
      // cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
      gestureEnabled: true,
      cardOverlayEnabled: false,
      cardOverlay: () => (
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 43, 46,0.7)',
          }}
        />
      ),
      cardStyle: {
        backgroundColor: 'rgba(0, 43, 46,0.7)',
        paddingTop,
      },
    }),
    [paddingTop],
  );

  return {modalOptions, headerOptions};
};
