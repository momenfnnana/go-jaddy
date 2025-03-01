import React, {useRef} from 'react';
import {
  Animated,
  FlatList,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewToken,
} from 'react-native';
import {ISliderListProps} from '../helpers/types';
import Pagination from './Pagination';
import SliderItem from './SliderItem';

/**
 * @author Mike Vas <mikevastech@gmail.com>
 */

const SliderList: React.FC<ISliderListProps> = ({
  style,
  scrollX,
  data,
  currentIndex,
  setCurrentIndex,
  flatRef,
}) => {
  const {width} = useWindowDimensions();
  // TODO: Fix this non-null assertions once you find more time
  const viewableItemsChanged = useRef(
    ({viewableItems}: {viewableItems: ViewToken[]}) => {
      setCurrentIndex!(viewableItems[0].index ?? 0);
    },
  ).current;

  const viewConfig = useRef({viewAreCoveragePercentTrehshold: 50}).current;
  const onScrollRef = () => {
    return Animated.event(
      [
        {
          nativeEvent: {contentOffset: {x: scrollX!}},
        },
      ],
      {useNativeDriver: false},
    );
  };
  return (
    <>
      <View style={[styles.container, {width}, style]}>
        <FlatList
          data={data}
          renderItem={({item}) => <SliderItem item={item} />}
          horizontal
          pagingEnabled
          bounces={false}
          keyExtractor={item => item.id}
          onScroll={onScrollRef()}
          onViewableItemsChanged={viewableItemsChanged}
          scrollEventThrottle={32}
          ref={flatRef}
          style={{flex: 1}}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </>
  );
};
export default SliderList;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
});
