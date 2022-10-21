import React, {useMemo} from 'react';
import {
  StyleSheet,
  View,
  useWindowDimensions,
  ViewStyle,
  Pressable,
  StatusBar,
} from 'react-native';
import {ScreenContainer, Text} from 'components';
import {NetworkErrorIcon} from 'assets/icons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {colors, spacing} from 'theme';
import NetInfo from '@react-native-community/netinfo';

interface INetworkErrorScreen {
  onPress?: () => void;
}

const NetworkErrorScreen = ({...rest}: INetworkErrorScreen) => {
  const {width} = useWindowDimensions();
  const SIZE = width * 0.2;
  const customReloadButtonStyle: ViewStyle = useMemo(() => {
    return {
      width: SIZE,
      height: SIZE,
      borderRadius: SIZE * 0.5,
    };
  }, []);
  const onPress = () => {
    NetInfo.refresh().then(status => {
      console.log({status});
    });
  };
  return (
    <ScreenContainer withPadding>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <NetworkErrorIcon />
        <Text
          tx="internet.title"
          variant="largeBold"
          color={colors.blue}
          style={styles.title}
          center
        />
        <Text
          tx="internet.description"
          variant="mediumRegular"
          color={colors.tabsColor}
          style={styles.description}
          center
        />
        <Pressable
          onPress={onPress}
          style={[styles.reloadButtonContainer, customReloadButtonStyle]}
          {...rest}>
          <SimpleLineIcons
            name="reload"
            size={40}
            color={colors.white}
            style={styles.reloadIcon}
          />
        </Pressable>
      </View>
    </ScreenContainer>
  );
};

export default NetworkErrorScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: spacing.large,
    marginBottom: spacing.medium + 2,
    marginTop: spacing.huge,
  },
  description: {
    width: '80%',
  },
  reloadButtonContainer: {
    backgroundColor: colors.reloadColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.huge,
  },
  reloadIcon: {
    transform: [{rotate: '270deg'}],
  },
});
