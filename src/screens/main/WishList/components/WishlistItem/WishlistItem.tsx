import React, {ReactNode, useMemo, useState} from 'react';
import {View, Pressable, FlatList, Image, StyleSheet} from 'react-native';
import {CloseIcon, EditIcon, EmptyItemImage} from 'assets/icons';
import {Text} from 'components';
import {BASE_URL} from 'utils/Axios';
import {colors, spacing} from 'theme';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CollectionNameInput from '../CollectionNameInput';

interface ITop4Products {
  DetailUrl?: string;
  Id: number;
  localImage?: ReactNode;
  Image?: {
    Id?: number;
    ThumbUrl?: string;
    Title?: string;
    Url?: string;
  };
  Name?: string;
  ShortDescription?: string;
}
interface IWishListItem {
  Name: string;
  CreatedOn: Date;
  Id: number;
  ModifiedOn: Date;
  Top4Products: ITop4Products[];
  WishlistLinesCount: number;
}
const ITEM_SIZE: number = 163;

const WishlistItem = ({Name, Top4Products, ...rest}: IWishListItem) => {
  const [collectionName, setCollectionName] = useState<string>(Name);
  const [isEdititingCollectionName, setIsEdititingCollectionName] =
    useState<boolean>();
  const products = useMemo(() => {
    if (Top4Products.length < 4) {
      const data = [];
      for (let index = 0; index < 4; index++) {
        const element = Top4Products[index];
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
    // mutate api change collection name
  };
  const removeCollectionHandler = () => {
    // mutate api call to remove collection
  };

  return (
    <View style={styles.wishlistItemContainer}>
      <View style={styles.wishlistItemContentContainer}>
        <Pressable
          onPress={removeCollectionHandler}
          style={styles.closeBtnContainer}>
          <CloseIcon style={styles.closeBtn} />
        </Pressable>
        <FlatList
          data={products}
          keyExtractor={item => item.Id.toString()}
          numColumns={2}
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
      {isEdititingCollectionName ? (
        <View>
          <CollectionNameInput
            placeholder="whishlist.collection-name"
            value={collectionName}
            onChangeText={setCollectionName}
            containerStyle={styles.collectionNameInput}
            rightIcon={
              <Pressable
                onPress={editCollectionNameHandler}
                style={styles.checkboxContainer}>
                <AntDesign name={'check'} size={15} color={colors.white} />
              </Pressable>
            }
          />
        </View>
      ) : (
        <Pressable
          onPress={onPressEditCollectionName}
          style={styles.collectionNameContainer}>
          <Text text={Name} />
          <View style={styles.editIconContainer}>
            <EditIcon />
          </View>
        </Pressable>
      )}
    </View>
  );
};

export default WishlistItem;

const styles = StyleSheet.create({
  wishlistItemContainer: {
    width: '50%',
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
});
