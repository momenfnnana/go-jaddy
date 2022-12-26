import {View, Pressable, Image, StyleSheet} from 'react-native';
import React, {useContext, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {colors, spacing} from 'theme';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useTranslation} from 'react-i18next';
import {UploadImageIcon} from 'assets/icons';
import {launchImageLibrary} from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import {UserContext} from 'context/UserContext';
import {useMutation, useQuery} from '@tanstack/react-query';
import {getIpAddress, postAddReview} from 'services/Home';
import {Switch} from 'react-native-paper';
import {postAddStoreReview} from 'services/Stores';
import Modal from 'components/Modal';
import InputField from 'components/InputField';
import Button from 'components/Button';
import Text from 'components/Text';

interface ICameraImage {
  uri?: string;
  type?: string;
  name?: string;
}
interface IinitialValues {
  ReviewText?: string;
  Image?: ICameraImage;
}
interface IRateModel {
  ProductId?: number;
  StoreId?: number;
  isStore?: boolean;
  isRateModalShown: boolean;
  setIsRateModalShown: (value: boolean) => void;
}
const ratingSchema = Yup.object().shape({
  ReviewText: Yup.string(),
});

const ratingInitialValues: IinitialValues = {
  ReviewText: '',
  Image: {},
};
const RateModal = ({
  ProductId,
  StoreId,
  isStore,
  isRateModalShown,
  setIsRateModalShown,
}: IRateModel) => {
  const {settings} = useContext(UserContext);
  //   const [isRateModalShown, setIsRateModalShown] = useState<boolean>(false);
  const [addImagesVisible, setAddImagesVisible] = useState<boolean>(false);
  const {data: IPAddressData} = useQuery(['settings'], getIpAddress);
  const [image, setImage] = useState<ICameraImage>({
    name: '',
    type: '',
    uri: '',
  });
  const [filledLength, setFilledLength] = useState<number>(
    parseInt(settings?.StoreSettings?.DefaultStoreRatingValue) - 1,
  );
  const enableAddImagesHandler = () => {
    setAddImagesVisible(currentState => !currentState);
  };
  const rateProductRange = (index: number) => {
    setFilledLength(index);
  };
  const hideRatePopup = () => {
    setIsRateModalShown(false);
    setAddImagesVisible(false);
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

  const {mutate: mutateAddProductReview, isLoading: isLoadingAddingReview} =
    useMutation(postAddReview, {
      onSuccess: data => {
        hideRatePopup();
        return data;
      },
      onError: error => {
        hideRatePopup();
        return error;
      },
    });

  const {mutate: mutateAddStoreReview, isLoading: isLoadingStoreReview} =
    useMutation(postAddStoreReview, {
      onSuccess: data => {
        hideRatePopup();
        return data;
      },
      onError: error => {
        hideRatePopup();
        return error;
      },
    });

  const addRatingHandler = (values: IinitialValues) => {
    const data = new FormData();
    if (isStore) {
      data.append('StoreId', StoreId);
    } else {
      data.append('ProductId', ProductId);
    }
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
    if (isStore) {
      mutateAddStoreReview(data);
    } else {
      mutateAddProductReview(data);
    }
  };

  return (
    <Modal
      isVisible={isRateModalShown}
      onBackdropPress={hideRatePopup}
      isLoading={false}
      forceRefetch={() => {}}
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
          handleSubmit,
          touched,
        }) => {
          return (
            <View style={styles.formContainer}>
              <InputField
                value={values.ReviewText}
                onChangeText={handleChange('ReviewText')}
                onBlur={handleBlur('ReviewText')}
                placeholder={'product-details.rate-field'}
                style={{}}
                error={{value: errors.ReviewText, touched: touched.ReviewText}}
              />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: spacing.medium,
                }}>
                <Switch
                  value={addImagesVisible}
                  color={colors.primary}
                  onChange={enableAddImagesHandler}
                />
                <Text
                  tx="product-details.attach-image"
                  variant="xSmallBold"
                  style={{marginLeft: spacing.tiny}}
                />
              </View>

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
                isLoading={
                  isStore ? isLoadingStoreReview : isLoadingAddingReview
                }
              />
            </View>
          );
        }}
      </Formik>
    </Modal>
  );
};

export default RateModal;

const styles = StyleSheet.create({
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
});
