import React, {ReactNode} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  ImageProps,
  ImageURISource,
  ViewStyle,
} from 'react-native';

interface IProgressiveImage extends ImageProps {
  thumbnailSource: ImageURISource;
  variant?: 'Image' | 'ImageBackground';
  children?: ReactNode;
  containerStyle?: ViewStyle;
}
const ProgressiveImage = ({
  thumbnailSource,
  source,
  style,
  variant = 'Image',
  children,
  containerStyle,
  ...props
}: IProgressiveImage) => {
  let thumbnailAnimated = new Animated.Value(0);
  let imageAnimated = new Animated.Value(0);

  const handleThumbnailLoad = () => {
    console.log('handleThumbnailLoad');
    Animated.timing(thumbnailAnimated, {
      toValue: 1,
    } as any).start();
  };
  const onImageLoad = () => {
    console.log('onImageLoad');
    Animated.timing(imageAnimated, {
      toValue: 1,
    } as any).start();
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Animated.Image
        {...props}
        source={thumbnailSource}
        style={[style, {opacity: thumbnailAnimated}]}
        onLoad={handleThumbnailLoad}
        blurRadius={1}
      />
      <Animated.Image
        {...props}
        source={source}
        style={[styles.imageOverlay, {opacity: imageAnimated}, style]}
        onLoad={onImageLoad}
      />
      {variant === 'ImageBackground' && children}
    </View>
  );
};
export default ProgressiveImage;
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e1e4e8',
  },
  imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
});
