import React, {useMemo} from 'react';
import {
  StyleSheet,
  View,
  useWindowDimensions,
  ViewStyle,
  Pressable,
} from 'react-native';
import {ScreenContainer, Text} from 'components';
import {NetworkErrorIcon} from 'assets/icons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {colors, spacing} from 'theme';

const NetworkErrorScreen = () => {
  const {width} = useWindowDimensions();
  const SIZE = width * 0.2;
  const customReloadButtonStyle: ViewStyle = useMemo(() => {
    return {
      width: SIZE,
      height: SIZE,
      borderRadius: SIZE * 0.5,
    };
  }, []);
  return (
    <ScreenContainer>
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
          style={[styles.reloadButtonContainer, customReloadButtonStyle]}>
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
