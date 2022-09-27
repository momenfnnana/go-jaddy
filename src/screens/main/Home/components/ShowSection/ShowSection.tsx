import {FlatList, StyleSheet, View} from 'react-native';
import React from 'react';
import {ProductCard, Text} from 'components';
import {colors, spacing} from 'theme';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {IProductInterface} from '../../types';
import {GoNextArrowIcon} from 'assets/icons';

interface IHeader {
  title: string;
  coloredTitle: string;
}

interface IShowSection {
  title: string;
  coloredTitle: string;
  data: IProductInterface[];
}
const Header = ({title, coloredTitle}: IHeader) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerTitleContainer}>
        <Text tx={title} color={colors.tabsColor} variant="mediumRegular" />
        <Text
          tx={coloredTitle}
          color={colors.orange}
          variant="mediumBold"
          style={styles.coloredTitle}
        />
      </View>
      <View style={styles.headerTitleContainer}>
        <Text
          tx="common.see-more"
          color={colors.grayMain}
          style={styles.seeMore}
        />
        <FontAwesome5
          name="long-arrow-alt-left"
          style={styles.arrow}
          color={colors.grayMain}
        />
      </View>
    </View>
  );
};

const ShowSection = ({title, coloredTitle, data}: IShowSection) => {
  return (
    <View style={styles.container}>
      <Header title={title} coloredTitle={coloredTitle} />
      <View>
        {/* <View style={styles.goNextArrowContainer}>
          <GoNextArrowIcon />
        </View> */}
        <FlatList
          data={data}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={{marginHorizontal: -15}}
          contentContainerStyle={{paddingHorizontal: 15}}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          renderItem={({item}) => <ProductCard {...item} />}
        />
      </View>
    </View>
  );
};

export default ShowSection;

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xLarge,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coloredTitle: {
    marginHorizontal: 5,
  },
  arrow: {
    transform: [{rotate: '180deg'}],
  },
  seeMore: {
    marginHorizontal: spacing.small,
  },
  goNextArrowContainer: {
    backgroundColor: colors.greenSimiLight + 46,
    width: spacing.huge + 2,
    height: spacing.huge + 2,
    borderRadius: (spacing.huge + 2) * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: -spacing.normal,
  },
});
