import React from 'react';
import {Image, StyleSheet, Pressable} from 'react-native';
import {colors, spacing} from 'theme';
import {BASE_URL} from 'utils/Axios';

interface IProductImagesList {
  item: any;
  index: number;
  activeImageIndex: number;
  setActiveImageIndex: (value: number) => void;
}
let IMAGE_CONTAINER: number = 57;

const ProductImagesList = ({
  item,
  index,
  setActiveImageIndex,
  activeImageIndex,
}: IProductImagesList) => {
  const changeActiveIndex = () => {
    setActiveImageIndex(index);
  };
  return (
    <Pressable
      style={[
        styles.imagesRowContainer,
        {
          borderWidth: 2,
          borderColor:
            activeImageIndex === index ? colors.orange : 'transparent',
        },
      ]}
      onPress={changeActiveIndex}>
      <Image
        source={{uri: `${BASE_URL}${item.Url}`}}
        style={styles.imagesRow}
      />
    </Pressable>
  );
};

export default ProductImagesList;
const styles = StyleSheet.create({
  imagesRowContainer: {
    width: IMAGE_CONTAINER,
    height: IMAGE_CONTAINER,
    padding: 1,
    marginHorizontal: spacing.tiny,
  },
  imagesRow: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.white,
  },
});
