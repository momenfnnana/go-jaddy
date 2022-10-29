import {
  View,
  ScrollView,
  Pressable,
  Image,
  ImageSourcePropType,
} from 'react-native';
import React, {useContext, useLayoutEffect, useState} from 'react';
import {BackButton, Button, InputField, Text} from 'components';
import {useNavigation} from '@react-navigation/native';
import {colors, spacing} from 'theme';
import HeaderAccount from './components/HeaderAccount';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {PalestineFlag} from 'assets/images';
import {UserContext} from 'context/UserContext';
import {useMutation} from '@tanstack/react-query';
import {changeUserInfo} from 'services/Profile';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

interface IFlag {
  imageUrl: ImageSourcePropType;
  introructionNumber: string;
}

const updateProfileSchema = Yup.object().shape({
  firstName: Yup.string().required('first name is required'),
  lastName: Yup.string().required('last name is required'),
  email: Yup.string().email().required('email is required'),
  phoneNumber: Yup.string()
    .matches(phoneRegExp, 'phone number is not valid')
    .required('phone number is required'),
});

const updatePasswordSchema = Yup.object().shape({
  oldPassword: Yup.string().required('Old Password name is required'),
  newPassword: Yup.string()
    .required('new Password is required')
    .min(8, 'password must being at least 8 characters'),
  confirmPassword: Yup.string()
    .required('confirm password is required')
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

const ProfileDetails = () => {
  const {settings} = useContext(UserContext);
  const [isEditInfo, setEditInfo] = useState<boolean>(true);
  const [imageId, setImageId] = useState<number>(-1);
  const [isOldPasswordShow, setIsOldPasswordShown] = useState<boolean>(false);
  const [isPasswordShow, setIsPasswordShown] = useState<boolean>(false);
  const [isCPasswordShow, setIsCPasswordShown] = useState<boolean>(false);
  const [selectedFlag, setSelectedFlag] = useState<IFlag>({
    imageUrl: PalestineFlag,
    introructionNumber: '970',
  });
  const {setOptions} = useNavigation();

  useLayoutEffect(() => {
    setOptions({
      headerLeft: () => <BackButton />,
    });
  }, []);

  const {mutate: mutateUpdateUserInfo, isLoading: isLoadingUpdateUserInfo} =
    useMutation(['changeUserInfo'], changeUserInfo, {
      onSuccess: data => {
        console.log({changeUserInfo: data.data});
        return data;
      },
      onError: error => {
        return error;
      },
    });

  const onUpdateProfileHandle = (values: any) => {
    if (imageId !== -1) {
      mutateUpdateUserInfo({
        AvatarId: imageId,
        Email: values?.email,
        FirstName: values?.firstName,
        LastName: values?.lastName,
        PhoneNumber: values?.phoneNumber,
      });
    } else {
      mutateUpdateUserInfo({
        Email: values?.email,
        FirstName: values?.firstName,
        LastName: values?.lastName,
        PhoneNumber: values?.phoneNumber,
      });
    }
  };

  const showOldPassword = () => {
    setIsOldPasswordShown(currentValue => !currentValue);
  };
  const showPassword = () => {
    setIsPasswordShown(currentValue => !currentValue);
  };

  const showCPassword = () => {
    setIsCPasswordShown(currentValue => !currentValue);
  };

  const enableUpload =
    settings.CustomerSettings.AllowCustomersToUploadAvatars == 'True';
  const enableChangeData =
    settings.CustomerSettings.AllowUsersToChangeUsernames == 'True';
  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <View style={{flex: 1}}>
        <ScrollView
          contentContainerStyle={{paddingHorizontal: spacing.content}}>
          <HeaderAccount
            enableUpload={enableUpload}
            isEditInfo={isEditInfo}
            setEditInfo={setEditInfo}
            setIdImage={setImageId}
          />
          {isEditInfo ? (
            <Formik
              initialValues={{
                firstName: '',
                lastName: '',
                phoneNumber: '',
                email: '',
              }}
              onSubmit={onUpdateProfileHandle}
              validationSchema={updateProfileSchema}>
              {({handleChange, handleBlur, handleSubmit, values, errors}) => {
                return (
                  <>
                    <InputField
                      value={values.firstName}
                      onChangeText={handleChange('firstName')}
                      onBlur={handleBlur('firstName')}
                      placeholder={'common.firstName'}
                      error={errors.firstName}
                    />
                    <InputField
                      value={values.lastName}
                      placeholder={'common.lastName'}
                      onChangeText={handleChange('lastName')}
                      onBlur={handleBlur('lastName')}
                      error={errors.lastName}
                    />
                    <InputField
                      disabled={!enableChangeData}
                      value={values.phoneNumber}
                      keyboardType="phone-pad"
                      onChangeText={handleChange('phoneNumber')}
                      onBlur={handleBlur('phoneNumber')}
                      error={errors.phoneNumber}
                      disabledRight
                      rightIcon={
                        <Pressable
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            alignSelf: 'center',
                          }}>
                          <Text
                            text={selectedFlag.introructionNumber}
                            variant="smallRegular"
                            color={colors.brouwnLight}
                            style={{fontSize: 11}}
                          />
                          <Image
                            source={selectedFlag.imageUrl}
                            style={{width: 30, height: 30}}
                            resizeMode="center"
                          />
                        </Pressable>
                      }
                    />
                    <InputField
                      disabled={!enableChangeData}
                      value={values.email}
                      keyboardType="email-address"
                      placeholder={'common.email'}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      error={errors.email}
                    />
                    <Button
                      // isLoading={isLoadingUpdateUserInfo}
                      onPress={handleSubmit}
                      style={{
                        marginTop: 20,
                      }}
                      title="profileDetails.submitBtn"
                    />
                  </>
                );
              }}
            </Formik>
          ) : (
            <Formik
              initialValues={{
                oldPassword: '',
                newPassword: '',
                confirmPassword: '',
              }}
              onSubmit={onUpdateProfileHandle}
              validationSchema={updatePasswordSchema}>
              {({handleChange, handleBlur, handleSubmit, values, errors}) => {
                return (
                  <>
                    <InputField
                      value={values.oldPassword}
                      placeholder={'common.oldPassword'}
                      onChangeText={handleChange('oldPassword')}
                      onBlur={handleBlur('oldPassword')}
                      secureTextEntry={!isOldPasswordShow}
                      error={errors.oldPassword}
                      onPressRightIcon={showOldPassword}
                      rightIcon={
                        <MaterialCommunityIcons
                          onPress={showOldPassword}
                          name={isOldPasswordShow ? 'eye' : 'eye-off'}
                          size={18}
                        />
                      }
                    />
                    <InputField
                      value={values.newPassword}
                      placeholder={'common.password'}
                      onChangeText={handleChange('newPassword')}
                      onBlur={handleBlur('newPassword')}
                      secureTextEntry={!isPasswordShow}
                      error={errors.newPassword}
                      onPressRightIcon={showPassword}
                      rightIcon={
                        <MaterialCommunityIcons
                          onPress={showPassword}
                          name={isPasswordShow ? 'eye' : 'eye-off'}
                          size={18}
                        />
                      }
                    />
                    <InputField
                      value={values.confirmPassword}
                      placeholder={'register.confirmPassword'}
                      onChangeText={handleChange('confirmPassword')}
                      onBlur={handleBlur('confirmPassword')}
                      secureTextEntry={!isCPasswordShow}
                      error={errors.confirmPassword}
                      onPressRightIcon={showCPassword}
                      rightIcon={
                        <MaterialCommunityIcons
                          onPress={showCPassword}
                          name={isCPasswordShow ? 'eye' : 'eye-off'}
                          size={18}
                        />
                      }
                    />
                  </>
                );
              }}
            </Formik>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default ProfileDetails;
