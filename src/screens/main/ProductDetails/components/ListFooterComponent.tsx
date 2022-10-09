import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Button, Modal, ShowSection} from 'components';
import {colors, spacing} from 'theme';
import {StarFilledIcon} from 'assets/icons';

interface IListFooterComponent {
  RelatedProductsModel: any;
  AlsoPurchasedModel: any;
  ProductId: number | string;
}

const ListFooterComponent = ({
  RelatedProductsModel,
  AlsoPurchasedModel,
  ProductId,
}: IListFooterComponent) => {
  const [isRateModalShown, setIsRateModalShown] = useState<boolean>(false);
  const showRatePopup = () => {
    setIsRateModalShown(true);
  };
  const hideRatePopup = () => {
    setIsRateModalShown(false);
  };
  return (
    <View style={styles.contentContainer}>
      <Button
        title="product-details.rate-product"
        variant="Secondary"
        color={colors.secondary}
        icon={
          <StarFilledIcon
            color={colors.secondary}
            style={styles.starIconStyle}
          />
        }
        onPress={showRatePopup}
        style={styles.buttonContainer}
      />
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
      <Modal
        data={[]}
        title=''
        isVisible={isRateModalShown}
        onBackdropPress={hideRatePopup}
        isLoading={false}
        ProductId={ProductId}
      />
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
  buttonContainer: {
    justifyContent: 'center',
  },
  starIconStyle: {
    marginHorizontal: spacing.smaller,
    transform: [{scale: 1.5}],
  },
});
