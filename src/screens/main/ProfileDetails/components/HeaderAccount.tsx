import {Image, Pressable, View} from 'react-native';
import React, {useContext, useState} from 'react';
import {colors, spacing} from 'theme';
import {Loader, Text} from 'components';
import Entypo from 'react-native-vector-icons/Entypo';
import {launchImageLibrary} from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import {UserContext} from 'context/UserContext';
import {useMutation, useQuery} from '@tanstack/react-query';
import {uploadAvatar} from 'services/Profile';
import {BASE_URL} from 'utils/Axios';
import {AvatarPerson} from 'assets/images';

interface IHeaderAccount {
  setEditInfo: (val: boolean) => void;
  setIdImage: (val: number) => void;
  isEditInfo: boolean;
  avatarInitial?: string;
  enableUpload: boolean;
}
interface camiraImage {
  uri: string;
  type: string;
  name: string;
}

const HeaderAccount = ({
  setEditInfo,
  isEditInfo,
  setIdImage,
  enableUpload,
  avatarInitial,
}: IHeaderAccount) => {
  const [image, setImage] = useState<camiraImage>({
    name: '',
    type: '',
    uri: avatarInitial ? BASE_URL + avatarInitial : '',
  });

  const {mutate, isLoading} = useMutation(['uploadAvatar'], uploadAvatar, {
    onSuccess: data => {
      setIdImage(data.data?.Properties?.AvatarId);
      return data;
    },
    onError: error => {
      return error;
    },
  });

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
      quality: 1,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        setImage({
          uri: '',
          name: '',
          type: '',
        });
      } else {
        let localUri = (response as any).assets[0]?.uri;
        let filename = (response as any).assets[0]?.fileName;
        let type = (response as any).assets[0]?.type;
        ImageResizer.createResizedImage(localUri, 200, 200, 'PNG', 100, 0)
          .then(response => {
            setImage({
              uri: response?.uri,
              name: response?.name,
              type: type,
            });
            const data = new FormData();
            data.append('Avatar', {
              uri: response?.uri,
              type: type,
              name: response?.name,
            });
            mutate(data);
          })
          .catch(err => {});
      }
    });
  };

  return (
    <View>
      <View
        style={{
          marginTop: spacing.huge,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Pressable
          onPress={() => setEditInfo(true)}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            backgroundColor: isEditInfo ? colors.secondary : colors.gray[200],
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderTopLeftRadius: 30,
            borderBottomLeftRadius: 30,
          }}>
          <Text
            tx="profileDetails.myInfo"
            variant="smallRegular"
            color={isEditInfo ? colors.white : colors.gray[500]}
          />
        </Pressable>
        <Pressable
          disabled={!enableUpload || isLoading}
          onPress={useLibraryHandler}
          style={{
            width: 130,
            height: 130,
            borderWidth: 5,
            borderColor: colors.white,
            borderRadius: 65,
            marginHorizontal: -10,
            zIndex: 2,
            overflow: 'hidden',
            position: 'relative',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.white,
          }}>
          <Image
            source={
              image.uri
                ? {
                    uri: image.uri,
                  }
                : AvatarPerson
            }
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              zIndex: -1,
            }}
          />
          <View
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              zIndex: 0,
              backgroundColor: colors.primary + '30',
            }}
          />
          <View
            style={{
              width: 46,
              height: 46,
              borderRadius: 23,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: colors.white,
            }}>
            {isLoading ? (
              <Loader size={'small'} />
            ) : (
              <Entypo name="camera" color={colors.gray[400]} size={22} />
            )}
          </View>
        </Pressable>
        <Pressable
          onPress={() => setEditInfo(false)}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            backgroundColor: !isEditInfo ? colors.secondary : colors.gray[200],
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderTopRightRadius: 30,
            borderBottomRightRadius: 30,
          }}>
          <Text
            tx="profileDetails.password"
            variant="smallRegular"
            color={!isEditInfo ? colors.white : colors.gray[500]}
          />
        </Pressable>
      </View>
      <Text
        tx="profileDetails.changePhoto"
        center
        variant="smallRegular"
        style={{marginTop: 5, marginBottom: 10}}
      />
    </View>
  );
};

export default HeaderAccount;
