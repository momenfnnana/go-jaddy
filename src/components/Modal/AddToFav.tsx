import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, FlatList, Pressable, Image} from 'react-native';
import Modal from './Modal';
import {useMutation, useQuery} from '@tanstack/react-query';
import {
  getWishlists,
  postAddToWishlist,
  postCreateWishlist,
} from 'services/Home';
import {Loader, Text, InputField} from 'components';
import {Formik} from 'formik';
import * as Yup from 'yup';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {colors, spacing} from 'theme';
import {useTranslation} from 'react-i18next';
import {BASE_URL} from 'utils/Axios';
import {WishlistContext} from 'context/WishlistContext';
import {useAccessToken} from 'hook/useAccessToken';

const CARD_SIZE: number = 43;

interface IinitialValues {
  collectionName: string;
}
interface IAddToFav {
  isAddToCollectionShown: boolean;
  setIsAddToCollectionShown: (value: boolean) => void;
  ProductId: string | number;
}

const collectionsInitialValues: IinitialValues = {
  collectionName: '',
};
const addCollectionSchema = Yup.object().shape({
  collectionName: Yup.string().required('collection name is required'),
});

const AddToFav = ({
  isAddToCollectionShown,
  setIsAddToCollectionShown,
  ProductId,
}: IAddToFav) => {
  const {accessToken} = useAccessToken();
  const {isRefetch} = useContext(WishlistContext);
  const [showInput, setShowInput] = useState<boolean>(false);
  const [selectedWishlist, setSelectedWishlist] = useState<number | string>();
  const {t} = useTranslation();
  const {
    isLoading: isLoadingWishlists,
    data: wishlistsData,
    refetch: refetchWishlists,
    isSuccess: isLoadedWishlists,
  } = useQuery(['getWishlists'], getWishlists, {cacheTime: 0});
  const {
    mutate: mutateAddToWishlist,
    isLoading: isLoadingAddToWishlist,
    isSuccess: isSuccessAddToWishlist,
  } = useMutation(postAddToWishlist);
  const {mutate, isLoading: isLoadingCreateWishList} = useMutation(
    postCreateWishlist,
    {
      onSuccess: data => {
        refetchWishlists();
        return data;
      },
    },
  );
  const showAddCollectionInput = () => {
    setShowInput(currentState => !currentState);
  };
  const onCloseAddToCollection = () => {
    setIsAddToCollectionShown(false);
  };
  const addCollectionHandler = (values: IinitialValues, {resetForm}: any) => {
    mutate(values.collectionName);
    resetForm();
  };
  const addToWishlistHandler = (item: any) => {
    setSelectedWishlist(item?.Id);
    const NewWishlistName =
      item?.WishlistLinesCount === 0 ? item?.Name : undefined;
    mutateAddToWishlist({
      ProductId,
      SelectedWishlistId: item?.Id,
      NewWishlistName,
    });
  };
  useEffect(() => {
    if (!isLoadingAddToWishlist && isSuccessAddToWishlist) {
      onCloseAddToCollection();
    }
  }, [isLoadingAddToWishlist, isSuccessAddToWishlist]);
  useEffect(() => {
    refetchWishlists();
  }, [isRefetch, accessToken]);
  return (
    <Modal
      isVisible={isAddToCollectionShown}
      onBackdropPress={onCloseAddToCollection}
      isLoading={isLoadedWishlists}
      forceRefetch={refetchWishlists}
      ProductId={ProductId}
      title="wishlist.add"
      description="wishlist.add-hint">
      {isLoadingWishlists ? (
        <Loader size={'small'} style={styles.collectionsLoader} />
      ) : wishlistsData?.data?.Wishlists?.length > 0 ? (
        <FlatList
          data={wishlistsData?.data?.Wishlists}
          keyExtractor={(_, index) => index.toString()}
          ListHeaderComponent={
            <View style={styles.addCollectionBtnContainer}>
              <Formik
                initialValues={collectionsInitialValues}
                validationSchema={addCollectionSchema}
                onSubmit={addCollectionHandler}>
                {({
                  values,
                  handleChange,
                  handleBlur,
                  errors,
                  touched,
                  handleSubmit,
                }) => (
                  <>
                    <Pressable
                      onPress={showAddCollectionInput}
                      style={styles.row}
                      disabled={isLoadingCreateWishList}>
                      <View style={styles.addCollectionBtn}>
                        {
                          <AntDesign
                            name="plus"
                            color={colors.white}
                            size={25}
                          />
                        }
                      </View>
                      <Text
                        tx="wishlist.add-collection"
                        variant="mediumBold"
                        color={colors.primary}
                        style={styles.collectionName}
                      />
                    </Pressable>
                    {showInput && (
                      <InputField
                        value={values.collectionName}
                        onChangeText={handleChange('collectionName')}
                        onBlur={handleBlur('collectionName')}
                        placeholder={t('wishlist.collection-name')}
                        style={{}}
                        rightIcon={
                          isLoadingCreateWishList ? (
                            <Loader size={'small'} color={colors.primary} />
                          ) : (
                            <AntDesign
                              onPress={handleSubmit}
                              name={'check'}
                              size={18}
                              color={colors.primary}
                            />
                          )
                        }
                        error={{
                          value: errors.collectionName,
                          touched: touched.collectionName,
                        }}
                      />
                    )}
                  </>
                )}
              </Formik>
            </View>
          }
          renderItem={({item}) => {
            return (
              <Pressable
                onPress={() => addToWishlistHandler(item)}
                style={[styles.collectionRow, styles.row]}>
                <View style={styles.row}>
                  <View style={styles.imageContainer}>
                    <FlatList
                      data={item?.Top4Products}
                      keyExtractor={item => item?.Id}
                      scrollEnabled={false}
                      numColumns={2}
                      renderItem={({item}) => (
                        <Image
                          source={{uri: `${BASE_URL}${item?.Image?.Url}`}}
                          key={item.Id}
                          style={{
                            width: CARD_SIZE / 2,
                            height: CARD_SIZE / 2,
                          }}
                        />
                      )}
                    />
                  </View>
                  <Text
                    text={item?.Name}
                    variant="smallRegular"
                    color={colors.tabsColor}
                    style={styles.collectionName}
                  />
                </View>
                {isLoadingAddToWishlist && selectedWishlist === item?.Id ? (
                  <Loader size={'small'} />
                ) : (
                  <Fontisto
                    name={
                      selectedWishlist === item?.Id
                        ? 'radio-btn-active'
                        : 'radio-btn-passive'
                    }
                    color={colors.red}
                    size={18}
                  />
                )}
              </Pressable>
            );
          }}
        />
      ) : (
        <View style={styles.addCollectionBtnContainer}>
          <Formik
            initialValues={collectionsInitialValues}
            validationSchema={addCollectionSchema}
            onSubmit={addCollectionHandler}>
            {({
              values,
              handleChange,
              handleBlur,
              errors,
              touched,
              handleSubmit,
            }) => (
              <>
                <Pressable
                  onPress={showAddCollectionInput}
                  style={[styles.row]}
                  disabled={isLoadingCreateWishList}>
                  <View style={styles.addCollectionBtn}>
                    {<AntDesign name="plus" color={colors.white} size={25} />}
                  </View>
                  <Text
                    tx="wishlist.add-collection"
                    variant="mediumBold"
                    color={colors.primary}
                    style={styles.collectionName}
                  />
                </Pressable>
                {showInput && (
                  <InputField
                    value={values.collectionName}
                    onChangeText={handleChange('collectionName')}
                    onBlur={handleBlur('collectionName')}
                    placeholder={t('wishlist.collection-name')}
                    style={{}}
                    rightIcon={
                      isLoadingCreateWishList ? (
                        <Loader size={'small'} color={colors.primary} />
                      ) : (
                        <AntDesign
                          onPress={handleSubmit}
                          name={'check'}
                          size={18}
                          color={colors.primary}
                        />
                      )
                    }
                    error={{
                      value: errors.collectionName,
                      touched: touched.collectionName,
                    }}
                  />
                )}
              </>
            )}
          </Formik>
        </View>
      )}
    </Modal>
  );
};

export default AddToFav;

const styles = StyleSheet.create({
  collectionsLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addCollectionBtnContainer: {
    paddingHorizontal: spacing.xxxLarge,
    marginTop: spacing.normal,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addCollectionBtn: {
    backgroundColor: colors.primary,
    borderRadius: spacing.medium - 2,
    height: CARD_SIZE,
    width: CARD_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  collectionName: {
    marginHorizontal: spacing.normal,
    flex: 1,
  },
  collectionRow: {
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xxxLarge,
    marginTop: spacing.smaller,
  },
  imageContainer: {
    borderRadius: spacing.medium - 2,
    height: CARD_SIZE,
    width: CARD_SIZE,
    backgroundColor: colors.gray[300],
    overflow: 'hidden',
  },
});
