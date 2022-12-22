import React, {useContext, useEffect, useMemo, useState} from 'react';
import {View, Pressable, FlatList, Image, StyleSheet} from 'react-native';
import {
  CloseIcon,
  EditIcon,
  EmptyItemImage,
  GoJaddyRedIcon,
} from 'assets/icons';
import {Button, Loader, Modal, Text} from 'components';
import {BASE_URL} from 'utils/Axios';
import {colors, spacing} from 'theme';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CollectionNameInput from '../CollectionNameInput';
import {useMutation} from '@tanstack/react-query';
import {
  editWishListName,
  postCreateWishlist,
  removeWishListName,
} from 'services/Home';
import {ITop4Products, IWishListItem} from '../../types';
import {useNavigation} from '@react-navigation/native';
import {WishlistScreenNavigationProp} from 'navigators/NavigationsTypes';
import {WishlistContext} from 'context/WishlistContext';

const ITEM_SIZE: number = 163;

const WishlistItem = ({
  Name,
  Top4Products,
  Id,
  refreshItems,
  removeEmptyItem,
}: IWishListItem) => {
  const {isRefetch, setIsRefetch} = useContext(WishlistContext);
  const {navigate} = useNavigation<WishlistScreenNavigationProp>();
  const [collectionName, setCollectionName] = useState<string>(Name || '');

  const [isEdititingCollectionName, setIsEdititingCollectionName] =
    useState<boolean>(false);
  const [
    isDeleteWishListComponentVisibel,
    setIsDeleteWishListComponentVisibel,
  ] = useState<boolean>(false);
  const {mutate: mutateEditWishlistName, isLoading: isLoadingEditWishlistName} =
    useMutation(editWishListName, {
      onSuccess: data => {
        setIsRefetch(!isRefetch);
        onPressEditCollectionName();
        refreshItems();
        return data;
      },
    });

  const {
    mutate: mutateRemoveWishListCollection,
    isLoading: isLoadingRemoveWishListName,
  } = useMutation(removeWishListName, {
    onSuccess: data => {
      refreshItems();
      setIsRefetch(!isRefetch);
      return data;
    },
  });

  const {mutate: createNewWishlist, isLoading: isLoadingCreateWishList} =
    useMutation(postCreateWishlist, {
      onSuccess: data => {
        refreshItems();
        setIsRefetch(!isRefetch);
        return data;
      },
    });

  const products = useMemo(() => {
    if (Top4Products?.length < 4) {
      const data = [];
      for (let index = 0; index < 4; index++) {
        const element = Top4Products?.[index];
        if (element) {
          data.push(element);
        } else {
          data.push({
            Id: Math.random(),
          });
        }
      }
      return data as ITop4Products[];
    }
    return Top4Products as ITop4Products[];
  }, [Top4Products]);

  const onPressEditCollectionName = () =>
    setIsEdititingCollectionName(currentValue => !currentValue);

  const editCollectionNameHandler = () => {
    if (Id === 0) {
      return createNewWishlist(collectionName);
    }
    mutateEditWishlistName({wishlistId: Id, Name: collectionName});
  };

  const onSubmitDeleteColletion = () => {
    hideDeleteWishlistModal();
    mutateRemoveWishListCollection(Id);
  };

  const hideDeleteWishlistModal = () => {
    setIsDeleteWishListComponentVisibel(false);
  };

  const showDeleteWishlistModal = () => {
    if (Id) {
      setIsDeleteWishListComponentVisibel(true);
    } else {
      if (removeEmptyItem) {
        removeEmptyItem();
      }
    }
  };

  const goToDetails = () => {
    navigate('WishlistDetails', {
      Id: Id,
      title: Name,
    });
  };

  useEffect(() => {
    if (collectionName.length === 0) {
      setIsEdititingCollectionName(true);
    }
  }, []);

  return (
    <Pressable onPress={goToDetails} style={styles.wishlistItemContainer}>
      <View style={styles.wishlistItemContentContainer}>
        {isLoadingRemoveWishListName && (
          <Loader containerStyle={styles.collectionLoader} />
        )}
        {Id !== -1 && (
          <Pressable
            onPress={showDeleteWishlistModal}
            style={styles.closeBtnContainer}
            disabled={isLoadingRemoveWishListName}>
            <CloseIcon style={styles.closeBtn} />
          </Pressable>
        )}
        <FlatList
          data={products}
          keyExtractor={item => item.Id.toString()}
          numColumns={2}
          scrollEnabled={false}
          renderItem={({item}) => (
            <>
              {item?.Image ? (
                <Image
                  source={{uri: `${BASE_URL}${item?.Image?.Url}`}}
                  style={styles.productImage}
                />
              ) : (
                <EmptyItemImage
                  width={ITEM_SIZE * 0.5}
                  height={ITEM_SIZE * 0.5}
                  style={styles.emptyImage}
                />
              )}
            </>
          )}
        />
      </View>
      {Id !== -1 &&
        (isEdititingCollectionName ? (
          <CollectionNameInput
            placeholder="wishlist.collection-name"
            value={collectionName}
            onChangeText={setCollectionName}
            containerStyle={styles.collectionNameInput}
            rightIcon={
              collectionName.length > 0 ? (
                <Pressable
                  onPress={editCollectionNameHandler}
                  style={styles.checkboxContainer}
                  disabled={
                    isLoadingEditWishlistName || isLoadingCreateWishList
                  }>
                  {isLoadingEditWishlistName || isLoadingCreateWishList ? (
                    <Loader size={'small'} />
                  ) : (
                    <AntDesign name={'check'} size={15} color={colors.white} />
                  )}
                </Pressable>
              ) : null
            }
          />
        ) : (
          <Pressable
            onPress={onPressEditCollectionName}
            style={styles.collectionNameContainer}
            disabled={isLoadingRemoveWishListName}>
            <Text text={collectionName} />
            <View style={styles.editIconContainer}>
              <EditIcon />
            </View>
          </Pressable>
        ))}
      <Modal
        isVisible={isDeleteWishListComponentVisibel}
        onBackdropPress={hideDeleteWishlistModal}
        isLoading={false}
        forceRefetch={() => {}}
        title=""
        showCloseBtn={false}>
        <View style={styles.modalContent}>
          <GoJaddyRedIcon style={styles.redIcon} />
          <Text
            tx="wishlist.are-sure-want-to-delete"
            variant="xLargeBold"
            color={colors.red}
            center
          />
          <Text
            tx="wishlist.are-sure-want-to-delete-hint"
            variant="smallRegular"
            color={colors.modalDescriptionColor}
            center
          />
          <View style={styles.row}>
            <Button
              title="common.continue"
              style={styles.confirmButton}
              onPress={onSubmitDeleteColletion}
            />
            <Button
              title="common.cancel"
              style={styles.confirmButton}
              variant="Secondary"
              color={colors.secondary}
              onPress={hideDeleteWishlistModal}
            />
          </View>
        </View>
      </Modal>
    </Pressable>
  );
};

export default WishlistItem;

const styles = StyleSheet.create({
  wishlistItemContainer: {
    padding: 15,
  },
  wishlistItemContentContainer: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: spacing.small + 2,
    overflow: 'hidden',
    position: 'relative',
  },
  productImage: {
    width: ITEM_SIZE * 0.5,
    height: ITEM_SIZE * 0.5,
  },
  emptyImage: {
    backgroundColor: colors.reloadColor,
  },
  closeBtnContainer: {
    backgroundColor: colors.white + 43,
    position: 'absolute',
    top: spacing.small,
    right: spacing.small,
    zIndex: 1,
    width: spacing.large - 2,
    height: spacing.large - 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: spacing.small,
    transform: [{scale: 1.3}],
  },
  closeBtn: {
    transform: [{scale: 1.2}],
  },
  collectionNameContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIconContainer: {
    backgroundColor: colors.primary,
    width: spacing.medium + 1,
    height: spacing.medium + 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: spacing.smaller + 1,
    marginLeft: spacing.small,
  },
  collectionNameInput: {
    flex: 1,
    height: 33,
    marginTop: spacing.small,
  },
  checkIconContainer: {
    backgroundColor: colors.white,
    alignSelf: 'center',
  },
  checkboxContainer: {
    backgroundColor: colors.primary,
    width: 23,
    height: 23,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  collectionLoader: {
    flex: 1,
    position: 'absolute',
    zIndex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white + 80,
  },
  redIcon: {
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xxxLarge + 2,
    marginBottom: spacing.xxLarge + 2,
  },
  confirmButton: {
    width: '48%',
  },
  modalContent: {
    paddingHorizontal: spacing.large - 2,
  },
});
