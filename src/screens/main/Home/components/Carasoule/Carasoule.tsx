import React, {useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  useWindowDimensions,
  ViewStyle,
  FlatList,
} from 'react-native';
import {CarasouleOneIcon} from 'assets/icons';
import {Text} from 'components';
import {colors, spacing} from 'theme';
import {BASE_URL} from 'utils/Axios';

interface IIndicators {
  activeIndex: number;
  data: any[];
}

interface ICarasoule {
  containerStyle: ViewStyle;
  data: any[];
}

const Indicators = ({activeIndex, data}: IIndicators) => {
  const {height} = useWindowDimensions();
  return (
    <FlatList
      data={data}
      horizontal
      keyExtractor={(_, index) => index.toString()}
      style={[styles.indicatorsContainer, {maxHeight: height * 0.2}]}
      scrollEnabled={false}
      renderItem={({index}) => {
        const itemWidth =
          activeIndex === index ? spacing.small * 3 : spacing.small;
        const itemColor =
          activeIndex === index ? colors.tabsColor : colors.reloadColor;
        return (
          <View
            style={[
              styles.indicator,
              {
                width: itemWidth,
                backgroundColor: itemColor,
              },
            ]}
          />
        );
      }}
    />
  );
};

const Carasoule = ({containerStyle, data}: ICarasoule) => {
  const {width, height} = useWindowDimensions();
  const itemWidth = width - spacing.normal - 1;
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const customStyle: ViewStyle = useMemo(() => {
    return {
      height: height * 0.2,
      justifyContent: 'flex-end',
      paddingVertical: spacing.large + 2,
      width: width - 30,
    };
  }, []);
  const customTitleContainer: ViewStyle = useMemo(() => {
    return {
      width: width * 0.4,
      alignSelf: 'flex-start',
    };
  }, []);

  const flatListStyle: ViewStyle = useMemo(() => {
    return {
      alignSelf: 'center',
      maxHeight: height * 0.2,
    };
  }, []);

  const scrollHandler = (event: any) => {
    const leftSpace = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(leftSpace / itemWidth);
    setActiveIndex(currentIndex);
  };

  return (
    <View style={containerStyle}>
      <FlatList
        data={data}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate={0}
        style={flatListStyle}
        snapToInterval={width - 30}
        onScroll={scrollHandler}
        renderItem={({item: {imageUrl, Description, Image}}) => (
          <ImageBackground
            source={{uri: `${BASE_URL}${Image?.Url}`}}
            style={customStyle}>
            <View style={[styles.titleContainer, customTitleContainer]}>
              <View style={styles.tab} />
              <Text
                tx={Description}
                variant="smallBold"
                color={colors.white}
                style={styles.title}
              />
            </View>
          </ImageBackground>
        )}
      />
      <Indicators activeIndex={activeIndex} data={data} />
    </View>
  );
};

export default Carasoule;

const styles = StyleSheet.create({
  imageBackground: {
    height: 166,
  },
  titleContainer: {
    backgroundColor: colors.tabsColor + 65,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  title: {
    paddingVertical: spacing.medium,
  },
  tab: {
    width: 4,
    height: '100%',
    backgroundColor: colors.white,
    position: 'absolute',
    left: 0,
  },
  indicator: {
    height: spacing.small,
    margin: spacing.tiny,
    borderRadius: spacing.small * 0.5,
  },
  indicatorsContainer: {
    alignSelf: 'center',
  },
});
