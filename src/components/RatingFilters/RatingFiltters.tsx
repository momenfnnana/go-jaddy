import {View, Pressable, StyleSheet, ViewStyle} from 'react-native';
import React from 'react';
import {colors, spacing} from 'theme';
import Text from 'components/Text';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {StarFilledIcon} from 'assets/icons';

interface IRatingFiltters {
  selectedFilter: string[];
  setSelectedFilter: (value: any) => void;
  TotalReviews?: any;
  RatingSum?: any;
  style?: ViewStyle;
}

const RatingFiltters = ({
  selectedFilter,
  setSelectedFilter,
  TotalReviews,
  RatingSum,
  style,
}: IRatingFiltters) => {
  const onPressFilter = (value: string) => {
    if (!selectedFilter.includes(value)) {
      const newlist = [...selectedFilter, value];
      setSelectedFilter(newlist);
    } else {
      const newlist = selectedFilter.filter(item => item !== value);
      setSelectedFilter(newlist);
    }
  };

  return (
    <View style={style}>
      <View style={[styles.ratingsContainer, styles.row]}>
        <View style={styles.row}>
          <Text tx="product-details.ratings" variant="mediumBold" />
          <Text
            text={TotalReviews.toString()}
            variant="mediumBold"
            style={styles.totalRatings}
          />
        </View>
        <View style={[styles.ratingTotal, styles.row]}>
          <StarFilledIcon color={colors.orangeDark} />
          <Text
            text={RatingSum.toString()}
            color={colors.orangeDark}
            style={styles.ratingSum}
            variant="smallRegular"
          />
        </View>
      </View>
      <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
        <Pressable
          style={[
            styles.filterItem,
            {
              backgroundColor: selectedFilter.includes('all')
                ? colors.secondary
                : colors.simiWhite,
            },
          ]}
          onPress={() => onPressFilter('all')}>
          <Text
            tx="product-details.all"
            color={selectedFilter.includes('all') ? colors.white : colors.black}
          />
        </Pressable>
        <Pressable
          style={[
            styles.filterItem,
            {
              backgroundColor: selectedFilter.includes('with-images')
                ? colors.secondary
                : colors.simiWhite,
            },
          ]}
          onPress={() => onPressFilter('with-images')}>
          <Text
            tx="product-details.with-images"
            color={
              selectedFilter.includes('with-images')
                ? colors.white
                : colors.black
            }
          />
        </Pressable>
        {[0, 1, 2, 3, 4].map((item, index) => {
          const itemsArray = [];
          switch (index) {
            case 0:
              itemsArray.push(item);
              break;
            case 1:
              itemsArray.push(item);
              itemsArray.push(item);
              break;
            case 2:
              itemsArray.push(item);
              itemsArray.push(item);
              itemsArray.push(item);
              break;
            case 3:
              itemsArray.push(item);
              itemsArray.push(item);
              itemsArray.push(item);
              itemsArray.push(item);
              break;
            case 4:
              itemsArray.push(item);
              itemsArray.push(item);
              itemsArray.push(item);
              itemsArray.push(item);
              itemsArray.push(item);
              break;

            default:
              break;
          }

          return (
            <Pressable
              style={[
                styles.filterItem,
                {
                  backgroundColor: selectedFilter.includes(
                    (index + 1).toString(),
                  )
                    ? colors.secondary
                    : colors.simiWhite,
                },
              ]}
              key={item}
              onPress={() => onPressFilter((item + 1).toString())}>
              <View style={styles.row}>
                {itemsArray.map((_, subIndex) => (
                  <AntDesign
                    name="star"
                    color={
                      selectedFilter.includes((index + 1).toString())
                        ? colors.white
                        : colors.reloadColor
                    }
                    key={subIndex}
                  />
                ))}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  filterItem: {
    paddingHorizontal: spacing.medium + 1,
    height: spacing.xxLarge + 2,
    borderRadius: spacing.tiny,
    marginHorizontal: spacing.tiny,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.medium,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingsContainer: {
    marginTop: spacing.normal,
  },
  totalRatings: {
    marginHorizontal: spacing.tiny,
  },
  ratingTotal: {
    backgroundColor: colors.secondary + 24,
    width: 52,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingSum: {
    marginHorizontal: spacing.tiny,
  },
});

export default RatingFiltters;
