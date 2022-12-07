import {View, Pressable, StyleSheet, ViewStyle} from 'react-native';
import React from 'react';
import {colors, spacing} from 'theme';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {StarFilledIcon} from 'assets/icons';
import {Ifiltter} from 'screens/main/StoreDetails/StoreDetails';
import Text from 'components/Text';
import Button from 'components/Button';

interface IRatingFiltters {
  selectedFilter: Ifiltter;
  setSelectedFilter: (value: any) => void;
  onPressRate?: () => void;
  TotalReviews?: any;
  RatingSum?: any;
  style?: ViewStyle;
  DisplayStoreReviews?: boolean;
}

const RatingFiltters = ({
  selectedFilter,
  setSelectedFilter,
  TotalReviews,
  RatingSum,
  style,
  DisplayStoreReviews,
  onPressRate,
}: IRatingFiltters) => {
  const onPressFilter = (value: string) => {
    if (value === 'all') {
      setSelectedFilter({
        withImage: false,
        ratings: [],
      });
      return;
    }
    if (value === 'with-images') {
      setSelectedFilter({
        ...selectedFilter,
        withImage: !selectedFilter.withImage,
      });
      return;
    }
    selectedFilter.ratings.includes(value)
      ? setSelectedFilter({
          ...selectedFilter,
          ratings: selectedFilter.ratings.filter(rate => rate !== value),
        })
      : setSelectedFilter({
          ...selectedFilter,
          ratings: [...selectedFilter.ratings, value],
        });
  };

  return (
    <View style={style}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: spacing.normal,
        }}>
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
        {DisplayStoreReviews && (
          <Button
            onPress={onPressRate}
            style={{paddingVertical: 2, paddingHorizontal: spacing.small}}
            title="stores.rate-store"
            variant="Secondary"
            icon={<StarFilledIcon color={colors.orangeDark} />}
            textVariant="xSmallRegular"
            textStyle={{marginLeft: 3}}
          />
        )}
      </View>
      <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
        <Pressable
          style={[
            styles.filterItem,
            {
              backgroundColor:
                !selectedFilter.withImage && selectedFilter.ratings.length === 0
                  ? colors.secondary
                  : colors.simiWhite,
            },
          ]}
          onPress={() => onPressFilter('all')}>
          <Text
            tx="product-details.all"
            color={
              !selectedFilter.withImage && selectedFilter.ratings.length === 0
                ? colors.white
                : colors.black
            }
          />
        </Pressable>
        <Pressable
          style={[
            styles.filterItem,
            {
              backgroundColor: selectedFilter.withImage
                ? colors.secondary
                : colors.simiWhite,
            },
          ]}
          onPress={() => onPressFilter('with-images')}>
          <Text
            tx="product-details.with-images"
            color={selectedFilter.withImage ? colors.white : colors.black}
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
                  backgroundColor: selectedFilter.ratings.includes(
                    (index + 1) as any,
                  )
                    ? colors.secondary
                    : colors.simiWhite,
                },
              ]}
              key={item}
              onPress={() => onPressFilter((item + 1) as any)}>
              <View style={styles.row}>
                {itemsArray.map((_, subIndex) => (
                  <AntDesign
                    name="star"
                    color={
                      selectedFilter.ratings.includes((index + 1) as any)
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
  ratingsContainer: {},
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
