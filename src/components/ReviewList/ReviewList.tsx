import {View, StyleSheet, Image} from 'react-native';
import React from 'react';
import {colors, spacing} from 'theme';
import {BASE_URL} from 'utils/Axios';
import Text from 'components/Text';
import AntDesign from 'react-native-vector-icons/AntDesign';

const ReviewList = ({item}: any) => {
  return (
    <View style={[styles.reviewItem, styles.contentContainer]}>
      <View style={[styles.row, {alignItems: 'flex-start'}]}>
        <Image
          source={{uri: `${BASE_URL}${item?.CustomerAvatar?.Url}`}}
          style={styles.customerReviewAvatar}
        />
        <View>
          <View style={styles.row}>
            <Text
              tx={item?.CustomerName}
              style={styles.customerName}
              variant="smallLight"
              color={colors.arrowBackgroundColor2}
            />
            {[0, 1, 2, 3, 4].map((_, index) => {
              return (
                <AntDesign
                  name="star"
                  color={
                    index < item?.Rating ? colors.orange : colors.reloadColor
                  }
                  key={index}
                />
              );
            })}
          </View>
          <View style={styles.rateContent}>
            <Text
              tx={item?.ReviewText}
              variant="smallRegular"
              color={colors.tabsColor}
            />
            {item?.ReviewImage?.Url?.length && (
              <Image
                source={{uri: `${BASE_URL}${item?.ReviewImage?.Url}`}}
                style={styles.reviewImage}
              />
            )}
            <Text
              tx={item?.WrittenOnStr}
              variant="xSmallLight"
              color={colors.arrowColor}
              style={styles.reviewDate}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  reviewItem: {
    marginTop: spacing.medium,
  },
  customerReviewAvatar: {
    height: 51,
    width: 51,
    borderRadius: 51 * 0.5,
    marginRight: spacing.smaller,
  },
  customerName: {
    marginHorizontal: spacing.smaller,
  },
  rateContent: {
    marginHorizontal: spacing.smaller,
  },
  reviewDate: {
    marginTop: spacing.tiny,
  },
  reviewImage: {
    height: 77,
    width: 75,
    marginVertical: spacing.medium,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: spacing.normal,
    marginTop: spacing.normal,
  },
});

export default ReviewList;
