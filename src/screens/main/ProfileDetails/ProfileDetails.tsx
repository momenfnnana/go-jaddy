import {
  View,
  ScrollView,
  Pressable,
  Image,
  ImageSourcePropType,
  StyleSheet,
} from 'react-native';
import React, {useContext, useLayoutEffect, useState} from 'react';
import {
  BackButton,
  Button,
  InputField,
  Loader,
  PhoneNumberInput,
  Text,
} from 'components';
import {useNavigation} from '@react-navigation/native';
import {colors, spacing} from 'theme';
import HeaderAccount from './components/HeaderAccount';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {PalestineFlag} from 'assets/images';
import {UserContext} from 'context/UserContext';
import {useMutation, useQuery} from '@tanstack/react-query';
import {changePassword, changeUserInfo, getUserData} from 'services/Profile';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSchema} from 'hook/useSchema';

const topFieldsSpace = 20;
interface IFlag {
  imageUrl: ImageSourcePropType;
  introructionNumber: string;
}

const ProfileDetails = () => {
  const {settings} = useContext(UserContext);
  const {defualtSchema, updatePasswordSchema} = useSchema();
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
  const {
    data,
    isLoading: isLoadingUserData,
    refetch,
    isRefetching,
    isFetching,
  } = useQuery(['getUserData'], getUserData);
  const {mutate: mutateUpdateUserInfo, isLoading: isLoadingUpdateUserInfo} =
    useMutation(['changeUserInfo'], changeUserInfo, {
      onSuccess: data => {
        refetch();
        return data;
      },
      onError: error => {
        return error;
      },
    });
  const {mutate: mutateUpdatePassword, isLoading: isLoadingUpdatePassword} =
    useMutation(['changePassword'], changePassword, {
      onSuccess: data => {
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

  const onUpdatePasswordHandle = (values: any) => {
    const {confirmPassword, newPassword, oldPassword} = values;
    mutateUpdatePassword({
      OldPassword: oldPassword,
      NewPassword: newPassword,
      ConfirmNewPassword: confirmPassword,
    });
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

  const onChangeCountry = (value: string) => {
    console.log({value});
  };

  const enableUpload =
    settings.CustomerSettings.AllowCustomersToUploadAvatars == 'True';
  const enableChangeData =
    settings.CustomerSettings.AllowUsersToChangeUsernames == 'True';

  if (isLoadingUserData || isFetching) {
    return (
      <Loader
        size={'large'}
        containerStyle={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      />
    );
  }

  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <View style={{flex: 1}}>
        <ScrollView
          contentContainerStyle={{paddingHorizontal: spacing.content}}>
          <HeaderAccount
            avatarInitial={data?.data?.Avatar?.Url}
            enableUpload={enableUpload}
            isEditInfo={isEditInfo}
            setEditInfo={setEditInfo}
            setIdImage={setImageId}
          />
          {isEditInfo ? (
            <Formik
              key={'#pesonal'}
              initialValues={{
                firstName: data?.data.FirstName,
                lastName: data?.data.LastName,
                phoneNumber: data?.data.PhoneNumber,
                email: data?.data.Email,
              }}
              onSubmit={onUpdateProfileHandle}
              validationSchema={defualtSchema}>
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => {
                return (
                  <>
                    <InputField
                      value={values.firstName}
                      onChangeText={handleChange('firstName')}
                      onBlur={handleBlur('firstName')}
                      placeholder={'common.firstName'}
                      error={{
                        touched: touched.firstName,
                        value: errors.firstName,
                      }}
                      style={{}}
                    />
                    <InputField
                      value={values.lastName}
                      placeholder={'common.lastName'}
                      onChangeText={handleChange('lastName')}
                      onBlur={handleBlur('lastName')}
                      error={{
                        touched: touched.lastName,
                        value: errors.lastName,
                      }}
                    />
                    <PhoneNumberInput
                      disabled={!enableChangeData}
                      value={values.phoneNumber}
                      onChangeText={handleChange('phoneNumber')}
                      onBlur={handleBlur('phoneNumber')}
                      error={{
                        touched: touched.phoneNumber,
                        value: errors.phoneNumber,
                      }}
                      onChangeCountry={onChangeCountry}
                    />
                    {/* <InputField
                      disabled={!enableChangeData}
                      value={values.phoneNumber}
                      keyboardType="phone-pad"
                      onChangeText={handleChange('phoneNumber')}
                      onBlur={handleBlur('phoneNumber')}
                      error={{
                        touched: touched.phoneNumber,
                        value: errors.phoneNumber,
                      }}
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
                    /> */}
                    <InputField
                      disabled={!enableChangeData}
                      value={values.email}
                      keyboardType="email-address"
                      placeholder={'common.email'}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      error={{
                        touched: touched.email,
                        value: errors.email,
                      }}
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
              key={'#password-form'}
              initialValues={{
                oldPassword: '',
                newPassword: '',
                confirmPassword: '',
              }}
              onSubmit={onUpdatePasswordHandle}
              validationSchema={updatePasswordSchema}>
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => {
                return (
                  <>
                    <InputField
                      value={values.oldPassword}
                      placeholder={'common.oldPassword'}
                      onChangeText={handleChange('oldPassword')}
                      onBlur={handleBlur('oldPassword')}
                      secureTextEntry={!isOldPasswordShow}
                      error={{
                        touched: touched.oldPassword,
                        value: errors.oldPassword,
                      }}
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
                      error={{
                        touched: touched.newPassword,
                        value: errors.newPassword,
                      }}
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
                      error={{
                        touched: touched.confirmPassword,
                        value: errors.confirmPassword,
                      }}
                      onPressRightIcon={showCPassword}
                      rightIcon={
                        <MaterialCommunityIcons
                          onPress={showCPassword}
                          name={isCPasswordShow ? 'eye' : 'eye-off'}
                          size={18}
                        />
                      }
                    />
                    <Button
                      isLoading={isLoadingUpdatePassword}
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
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default ProfileDetails;
const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.normal - 1,
  },
  inputsContainer: {
    marginTop: -topFieldsSpace,
  },
  feildContainer: {
    marginBottom: spacing.large,
  },
});
