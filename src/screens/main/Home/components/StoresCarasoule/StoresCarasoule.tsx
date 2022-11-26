import React, {useMemo, useState} from 'react';
import {Text} from 'components';
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  useWindowDimensions,
  Pressable,
} from 'react-native';
import {colors, spacing} from 'theme';
import {ICategories} from '../../types';
import {BASE_URL} from 'utils/Axios';
import {useNavigation} from '@react-navigation/native';
import {IStoresNavigation} from 'navigators/NavigationsTypes';

interface IStoresCarasoule {
  items: ICategories[];
}

interface IIndicators {
  activeIndex: number;
  data: any[];
}
interface IStoreItem {
  item: ICategories[];
  CONTAINER_WIDTH: number;
  ITEM_WIDTH: number;
  ITEM_HEIGHT: number;
  SIZE: number;
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

const StoreItem = ({
  item,
  CONTAINER_WIDTH,
  ITEM_WIDTH,
  ITEM_HEIGHT,
  SIZE,
}: IStoreItem) => {
  const {navigate} = useNavigation<IStoresNavigation>();
  const navigateToStore = (id: number) => {
    navigate('StoresStack', {
      screen: 'StoresDetails',
      params: {
        storeId: id,
      },
    } as any);
  };
  return (
    <View style={[styles.BoxContainer, {width: CONTAINER_WIDTH}]}>
      {item?.map(subItem => (
        <Pressable
          onPress={() => navigateToStore(subItem.Id)}
          style={[styles.item, {width: ITEM_WIDTH, height: ITEM_HEIGHT}]}
          key={subItem.Id}>
          <View style={styles.subItem}>
            <Image
              key={subItem.Id}
              source={{
                uri: `${BASE_URL}${subItem.Image?.Url}`,
              }}
              resizeMode="contain"
              style={[styles.storeImage, {height: SIZE, width: SIZE}]}
            />
            <Text
              text={subItem.Name}
              variant="mediumBold"
              style={styles.name}
              numberOfLines={1}
            />
          </View>
        </Pressable>
      ))}
    </View>
  );
};

const StoresCarasoule = ({items}: IStoresCarasoule) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const {width, height} = useWindowDimensions();
  const SIZE: number = width * 0.18;
  const CONTAINER_WIDTH = width - 30;
  const ITEM_WIDTH = CONTAINER_WIDTH * 0.25;
  const ITEM_HEIGHT = height * 0.126;

  const itemsToRender = useMemo(() => {
    var size = 8;
    var arrayOfArrays = [];
    for (var i = 0; i < items.length; i += size) {
      arrayOfArrays.push(items.slice(i, i + size));
    }
    return arrayOfArrays;
  }, [items]);

  const scrollHandler = (event: any) => {
    const leftSpace = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(leftSpace / CONTAINER_WIDTH);
    setActiveIndex(currentIndex);
  };
  return (
    <>
      {!!itemsToRender.length && (
        <FlatList
          data={itemsToRender}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={scrollHandler}
          renderItem={({item}) => {
            return (
              <StoreItem
                {...{CONTAINER_WIDTH, item, ITEM_HEIGHT, ITEM_WIDTH, SIZE}}
              />
            );
          }}
        />
      )}
      <Indicators activeIndex={activeIndex} data={itemsToRender} />
    </>
  );
};

export default StoresCarasoule;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  column: {
    flex: 1,
    flexDirection: 'column',
    padding: spacing.tiny + 1,
  },
  row: {
    flexDirection: 'row',
  },
  item: {
    padding: spacing.tiny + 1,
  },
  subItem: {
    padding: spacing.tiny + 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: spacing.small + 2,
    marginVertical: spacing.tiny + 1,
  },
  name: {
    paddingBottom: spacing.tiny,
    width: '100%',
    textAlign: 'center',
  },
  BoxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  storeImage: {
    borderWidth: 1,
    borderRadius: spacing.small + 2,
    borderColor: colors.storesImageBorder,
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
