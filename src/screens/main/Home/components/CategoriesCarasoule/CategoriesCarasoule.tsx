import React from 'react';
import {Text} from 'components';
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import {colors, spacing} from 'theme';
import {ICategories} from '../../types';
import {BASE_URL} from 'utils/Axios';

interface CategoriesCarasoule {
  items: ICategories[];
}

const CategoriesCarasoule = ({items}: CategoriesCarasoule) => {
  const {width} = useWindowDimensions();
  const SIZE: number = width * 0.18;
  const CONTAINER_WIDTH = width * 0.265;

  const column1Data = items.filter((_, i) => i < 2);
  const column2Data = items.filter((_, i) => i < 2);
  const column3Data = items.filter((_, i) => i < 2);
  const column4Data = items.filter((_, i) => i < 2);
  return (
    <>
      <View style={styles.container}>
        {/* <View style={styles.column}> */}
        <FlatList
          data={column1Data}
          // scrollEnabled={false}
          horizontal
          style={{marginHorizontal: -15}}
          contentContainerStyle={{marginHorizontal: 15}}
          renderItem={({item}) => (
            <View style={[styles.item, {width: CONTAINER_WIDTH}]}>
              <Image
                source={{
                  uri: `${BASE_URL}${item.Image?.Url}`,
                }}
                resizeMode="contain"
                style={{height: SIZE, width: SIZE}}
              />
              <Text
                text={item.Name}
                variant="mediumBold"
                style={styles.name}
                numberOfLines={1}
              />
            </View>
          )}
        />
        {/* </View> */}

        <View style={styles.column}>
          {/* <FlatList
            data={column2Data}
            scrollEnabled={false}
            renderItem={({item}) => (
              <View style={styles.item}>
                <Image
                  source={item.imageUrl}
                  resizeMode="contain"
                  style={[styles.brandImage, {height: SIZE}]}
                />
                <Text
                  text={item.name}
                  variant="mediumBold"
                  style={styles.name}
                />
              </View>
            )}
          /> */}
        </View>
        <View style={styles.column}>
          {/* <FlatList
            data={column3Data}
            scrollEnabled={false}
            renderItem={({item}) => (
              <View style={styles.item}>
                <Image
                  source={item.imageUrl}
                  resizeMode="contain"
                  style={[styles.brandImage, {height: SIZE}]}
                />
                <Text
                  text={item.name}
                  variant="mediumBold"
                  style={styles.name}
                />
              </View>
            )}
          /> */}
        </View>
        <View style={styles.column}>
          {/* <FlatList
            data={column4Data}
            scrollEnabled={false}
            renderItem={({item}) => (
              <View style={styles.item}>
                <Image
                  source={item.imageUrl}
                  resizeMode="contain"
                  style={[styles.brandImage, {height: SIZE}]}
                />
                <Text
                  text={item.name}
                  variant="mediumBold"
                  style={styles.name}
                />
              </View>
            )}
          /> */}
        </View>
      </View>
    </>
  );
};

export default CategoriesCarasoule;

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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: spacing.small + 2,
    // margin: spacing.small + 2,
    marginVertical: spacing.small + 2,
    marginRight: spacing.small + 2,
    padding: spacing.tiny + 1,
  },
  name: {
    paddingBottom: spacing.tiny,
    width: '100%',
    textAlign: 'center',
  },
});
