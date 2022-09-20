import React, {ReactNode} from 'react';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface IScreenContainer {
  children: ReactNode;
}

const ScreenContainer = ({children}: IScreenContainer) => {
  const {top, bottom} = useSafeAreaInsets();
  return (
    <View style={{paddingTop: top, paddingBottom: bottom, flex: 1}}>
      {children}
    </View>
  );
};

export default ScreenContainer;
