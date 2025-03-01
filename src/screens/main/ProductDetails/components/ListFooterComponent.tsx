import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, Pressable, Image} from 'react-native';
import {Button, InputField, Modal, ShowSection, Switch, Text} from 'components';
import {colors, spacing} from 'theme';
import {StarFilledIcon, UploadImageIcon} from 'assets/icons';
import {UserContext} from 'context/UserContext';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useTranslation} from 'react-i18next';
import {launchImageLibrary} from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import {useMutation, useQuery} from '@tanstack/react-query';
import {getIpAddress, postAddReview} from 'services/Home';
import {useLogged} from 'hook/useLogged';

interface IListFooterComponent {
  RelatedProductsModel: any;
  AlsoPurchasedModel: any;
  ProductId: number | string;
  productData: any;
  loadMore?: () => void;
  hasNextPageReviews?: boolean;
  refetchReviews: () => void;
}
interface ICameraImage {
  uri?: string;
  type?: string;
  name?: string;
}
interface IinitialValues {
  ReviewText?: string;
  Image?: ICameraImage;
}

const ratingInitialValues: IinitialValues = {
  ReviewText: '',
  Image: {},
};
const ratingSchema = Yup.object().shape({
  ReviewText: Yup.string(),
});

const ListFooterComponent = ({
  RelatedProductsModel,
  AlsoPurchasedModel,
  ProductId,
  productData,
  loadMore,
  hasNextPageReviews,
  refetchReviews,
}: IListFooterComponent) => {
  const {isLogged} = useLogged();
  const {settings} = useContext(UserContext);
  const {t} = useTranslation();
  const [isRateModalShown, setIsRateModalShown] = useState<boolean>(false);
  const [filledLength, setFilledLength] = useState<number>(
    parseInt(settings?.StoreSettings?.DefaultStoreRatingValue) - 1,
  );
  const [image, setImage] = useState<ICameraImage>({
    name: '',
    type: '',
    uri: '',
  });
  const [addImagesVisible, setAddImagesVisible] = useState<boolean>(false);
  const [isRateProductShown, setIsRateProductShown] = useState<boolean>(true);
  const {data: IPAddressData} = useQuery(['settings'], getIpAddress);

  const ReviewOverview = productData?.data?.Product?.ReviewOverview;
  const showRatePopup = () => {
    setIsRateModalShown(true);
  };
  const hideRatePopup = () => {
    setIsRateModalShown(false);
    setAddImagesVisible(false);
  };

  const rateProductRange = (index: number) => {
    setFilledLength(index);
  };
  const enableAddImagesHandler = () => {
    setAddImagesVisible(currentState => !currentState);
  };
  const useLibraryHandler = async () => {
    const options: any = {
      title: null,
      takePhotoButtonTitle: 'Take photo',
      chooseFromLibraryButtonTitle: 'Choose from library',
      cancelButtonTitle: 'cancel',
      cameraType: 'front',
      mediaType: 'photo',
      aspectX: 1,
      aspectY: 1,
      quality: 0.6,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
      } else {
        let localUri = (response as any).assets[0]?.uri;
        let filename = (response as any).assets[0]?.fileName;
        let type = (response as any).assets[0]?.type;
        ImageResizer.createResizedImage(localUri, 120, 120, 'PNG', 100, 0)
          .then(response => {
            setImage({
              uri: response?.uri,
              name: response?.name,
              type: type,
            });
          })
          .catch(err => {});
      }
    });
  };
  const {
    mutate,
    isLoading: isLoadingAddingReview,
    isSuccess: isAddingReviewSuccess,
  } = useMutation(postAddReview, {
    onSuccess: data => {
      setIsRateProductShown(false);
      refetchReviews();
      return data;
    },
    onError: error => {
      return error;
    },
  });
  const addRatingHandler = (values: IinitialValues) => {
    const data = new FormData();
    data.append('ProductId', ProductId);
    data.append('ClientIpAddress', IPAddressData?.data?.IPv4);
    data.append('ReviewText', values.ReviewText);
    data.append('Rating', filledLength);
    if (image.uri) {
      data.append('Image', {
        uri: image.uri,
        type: image.type,
        name: image.name,
      });
    }
    mutate(data);
  };

  useEffect(() => {
    if (isAddingReviewSuccess === true) {
      hideRatePopup();
    }
  }, [isAddingReviewSuccess]);

  return (
    <View style={styles.contentContainer}>
      {hasNextPageReviews && (
        <Pressable style={styles.loadMoreContainer} onPress={loadMore}>
          <Text
            tx="common.load-more"
            variant="smallRegular"
            color={colors.secondary}
          />
        </Pressable>
      )}
      {ReviewOverview?.AllowCustomerReviews &&
        isRateProductShown &&
        isLogged && (
          <Button
            disabled={isAddingReviewSuccess}
            title="product-details.product-rating"
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
        )}
      {RelatedProductsModel?.Items?.length > 0 && (
        <ShowSection
          data={RelatedProductsModel?.Items}
          title="product-details.products"
          showSeeMore={false}
          coloredTitle="product-details.related"
          WishlistEnabled={AlsoPurchasedModel?.WishlistEnabled}
        />
      )}
      {AlsoPurchasedModel?.Items?.length > 0 && (
        <ShowSection
          data={AlsoPurchasedModel?.Items}
          title="product-details.products"
          showSeeMore={false}
          coloredTitle="product-details.you-may-like"
          WishlistEnabled={AlsoPurchasedModel?.WishlistEnabled}
        />
      )}
      <Modal
        isVisible={isRateModalShown}
        onBackdropPress={hideRatePopup}
        isLoading={false}
        forceRefetch={() => {}}
        ProductId={ProductId}
        title="product-details.rate-product">
        <View style={[styles.row, styles.starsContainer]}>
          {[1, 2, 3, 4, 5].map((item, index) => (
            <AntDesign
              name="star"
              color={
                index <= filledLength ? colors.secondary : colors.reloadColor
              }
              key={item}
              style={[styles.starIconStyle, styles.rateMeStars]}
              onPress={() => rateProductRange(index)}
            />
          ))}
        </View>
        <Formik
          initialValues={ratingInitialValues}
          validationSchema={ratingSchema}
          onSubmit={addRatingHandler}>
          {({
            values,
            handleChange,
            handleBlur,
            errors,
            touched,
            handleSubmit,
          }) => {
            return (
              <View style={styles.formContainer}>
                <InputField
                  value={values.ReviewText}
                  onChangeText={handleChange('ReviewText')}
                  onBlur={handleBlur('ReviewText')}
                  placeholder={t('product-details.rate-field')}
                  style={{}}
                  error={{
                    value: errors.ReviewText,
                    touched: touched.ReviewText,
                  }}
                />
                <Switch
                  isActive={addImagesVisible}
                  onPress={enableAddImagesHandler}
                  containerStyle={styles.switchBtn}
                  title="product-details.attach-image"
                />
                <View style={styles.row}>
                  {addImagesVisible && !image.uri && (
                    <Pressable
                      onPress={useLibraryHandler}
                      style={styles.uploadImageContainer}>
                      <UploadImageIcon />
                    </Pressable>
                  )}
                  {image.uri && (
                    <Pressable onPress={useLibraryHandler}>
                      <Image
                        source={{uri: image.uri}}
                        style={styles.uploadImageContainer}
                      />
                    </Pressable>
                  )}
                </View>
                <Button
                  title="common.send"
                  variant="Primary"
                  color={colors.white}
                  onPress={handleSubmit}
                  style={styles.sendReviewBtn}
                  isLoading={isLoadingAddingReview}
                />
              </View>
            );
          }}
        </Formik>
      </Modal>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    alignSelf: 'center',
  },
  rateMeStars: {
    transform: [{scale: 2}],
  },
  formContainer: {
    paddingHorizontal: spacing.normal,
    marginTop: spacing.xLarge,
  },
  switchBtn: {
    marginTop: spacing.xLarge,
  },
  uploadImageContainer: {
    width: 65,
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.brouwnLight,
    borderRadius: spacing.tiny + 1,
    borderStyle: 'dashed',
    marginTop: spacing.normal,
  },
  sendReviewBtn: {
    marginTop: spacing.xLarge,
  },
  loadMoreContainer: {
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    alignSelf: 'center',
    borderRadius: spacing.xxLarge + 2,
    paddingHorizontal: spacing.large,
    paddingVertical: spacing.small + 2,
    borderColor: colors.secondary,
    backgroundColor: colors.white,
  },
});
