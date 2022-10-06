import React from 'react';
import {View, StyleSheet} from 'react-native';
import {ShowSection} from 'components';
import {spacing} from 'theme';

interface IListFooterComponent {
  RelatedProductsModel: any;
  AlsoPurchasedModel: any;
}

const ListFooterComponent = ({
  RelatedProductsModel,
  AlsoPurchasedModel,
}: IListFooterComponent) => {
  return (
    <View style={styles.contentContainer}>
      {RelatedProductsModel?.Items?.length > 0 && (
        <ShowSection
          data={RelatedProductsModel?.Items}
          title="product-details.products"
          showSeeMore={false}
          coloredTitle="product-details.related"
        />
      )}
      {AlsoPurchasedModel?.Items?.length > 0 && (
        <ShowSection
          data={AlsoPurchasedModel?.Items}
          title="product-details.products"
          showSeeMore={false}
          coloredTitle="product-details.you-may-like"
        />
      )}
    </View>
  );
};

export default ListFooterComponent;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: spacing.normal,
    marginTop: spacing.normal,
  },
});
