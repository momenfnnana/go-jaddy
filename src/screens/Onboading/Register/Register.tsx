import {
  View,
  ScrollView,
  Image,
  useWindowDimensions,
  ImageBackground,
  SafeAreaView,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ImageSourcePropType,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {ReactNode, useContext, useEffect, useState} from 'react';
import {RegisterHeader, RegisterLogo, ShareImage} from './images';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors, spacing} from 'theme';
import {BackButton, Button, InputField, Text} from 'components';
import {PalestineFlag} from 'assets/images';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {FacebookIcon, GoogleIcon, VisibilityEyeIcon} from 'assets/icons';
import {useMutation, useQuery} from '@tanstack/react-query';
import {createAccount} from 'services/Register';
import {UserContext} from 'context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageResizer from 'react-native-image-resizer';
import {launchImageLibrary} from 'react-native-image-picker';
import {VerifyAccountModal} from './components';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import axios from 'axios';
import {RegisterScreenNavigationProp} from 'navigators/NavigationsTypes';

interface IFlag {
  imageUrl: ImageSourcePropType;
  introructionNumber: string;
}
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const loginSchema = Yup.object().shape({
  firstName: Yup.string().required('first name is required'),
  lastName: Yup.string().required('last name is required'),
  email: Yup.string().email().required('email is required'),
  phoneNumber: Yup.string()
    .matches(phoneRegExp, 'phone number is not valid')
    .required('phone number is required'),
  password: Yup.string()
    .required('password is required')
    .min(8, 'password must being at least 8 characters'),
  confirmPassword: Yup.string()
    .required('confirm password is required')
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

interface camiraImage {
  uri: string;
  type: string;
  name: string;
}

const Register = () => {
  const {settings, setUserData, setAccessToken} = useContext(UserContext);
  const {width, height} = useWindowDimensions();
  const {canGoBack, goBack, navigate} =
    useNavigation<RegisterScreenNavigationProp>();
  const [isSeller, setSeller] = useState(false);
  const [isPasswordShow, setIsPasswordShown] = useState<boolean>(false);
  const [isCPasswordShow, setIsCPasswordShown] = useState<boolean>(false);
  const [verifyModalShow, setVerifyModalShow] = useState<boolean>(false);
  const [image, setImage] = useState<camiraImage>({
    name: '',
    type: '',
    uri: '',
  });
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const {top, bottom} = useSafeAreaInsets();
  const [selectedFlag, setSelectedFlag] = useState<IFlag>({
    imageUrl: PalestineFlag,
    introructionNumber: '970',
  });
  const onRegisterHandle = (values: any) => {
    const data = new FormData();
    setEmail(values.email);
    setPhoneNumber(values.phoneNumber);
    data.append('CustomerType', isSeller ? 'Seller' : 'Buyer');
    data.append('FirstName', values.firstName);
    data.append('LastName', values.lastName);
    data.append('PhoneNumber', values.phoneNumber);
    data.append('Email', values.email);
    data.append('Password', values.password);
    data.append('ConfirmPassword', values.confirmPassword);
    if (isSeller) {
      data.append('CustomerStoreName', values.storeName);
      data.append('StoreImage', {
        uri: image.uri,
        type: image.type,
        name: image.name,
      });
    }

    mutate(data);
  };
  const {mutate, isLoading, isError, error, isSuccess, data} = useMutation(
    createAccount,
    {
      onSuccess: data => {
        return data;
      },
      onError: error => {
        return error;
      },
    },
  );

  const showPassword = () => {
    setIsPasswordShown(currentValue => !currentValue);
  };

  const showCPassword = () => {
    setIsCPasswordShown(currentValue => !currentValue);
  };

  useEffect(() => {
    if (isSuccess) {
      setUserData({
        ...data?.data,
      });
      if (
        (settings as any).CustomerSettings.UserRegistrationType == 'Standard'
      ) {
        AsyncStorage.setItem('accessToken', data.data.AccessToken);
        axios.defaults.headers.common[
          'AccessToken'
        ] = `${data.data.AccessToken}`;
        setAccessToken(data.data.AccessToken);
        navigate('HomeFlow', {screen: 'HomeStack'} as any);
      } else {
        setVerifyModalShow(true);
      }
    }
  }, [data]);

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
          .catch(err => {
            console.log('error in ImageResizer: ', err);
          });
      }
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.cont}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        style={{backgroundColor: colors.white}}
        contentContainerStyle={{paddingHorizontal: 15}}>
        <ImageBackground
          resizeMode="cover"
          style={{
            paddingTop: top,
            height: height / 4.3,
            width,
            position: 'relative',
            marginHorizontal: -15,
          }}
          source={RegisterHeader}>
          <LinearGradient
            colors={['#fff1', '#fff']}
            style={{
              position: 'absolute',
              height: '100%',
              bottom: 0,
              width: '100%',
            }}>
            {canGoBack() && (
              <BackButton
                style={styles.goBackContainer}
                size={22}
                color={colors.white}
              />
            )}
          </LinearGradient>
          <RegisterLogo
            style={{
              alignSelf: 'center',
              position: 'absolute',
              zIndex: 1,
              bottom: 20,
            }}
          />
        </ImageBackground>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 20,
          }}>
          <Pressable
            onPress={() => setSeller(false)}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <MaterialIcons
              name={`radio-button-${!isSeller ? 'on' : 'off'}`}
              size={20}
              color={!isSeller ? colors.secondary : colors.gray[300]}
            />
            <Text
              tx="register.buyerAccount"
              style={{marginLeft: 5}}
              variant={'smallBold'}
              color={!isSeller ? colors.secondary : colors.gray[400]}
            />
          </Pressable>
          <Pressable
            onPress={() => setSeller(true)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 20,
            }}>
            <MaterialIcons
              name={`radio-button-${isSeller ? 'on' : 'off'}`}
              size={20}
              color={isSeller ? colors.secondary : colors.gray[300]}
            />
            <Text
              tx="register.sellerAccount"
              style={{marginLeft: 5}}
              variant={'smallBold'}
              color={isSeller ? colors.secondary : colors.gray[400]}
            />
          </Pressable>
        </View>
        {isSeller && (
          <TouchableOpacity
            onPress={useLibraryHandler}
            style={{
              width: 80,
              height: 80,
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
              backgroundColor: colors.border,
              marginBottom: 20,
              position: 'relative',
            }}>
            {image.uri && (
              <>
                <Image
                  source={{uri: image.uri}}
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
                    backgroundColor: '#0005',
                  }}
                />
              </>
            )}
            <MaterialCommunityIcons
              name="camera-outline"
              color={colors.white}
              size={25}
              style={{zIndex: 1}}
            />
            <Text
              variant="smallRegular"
              color={colors.white}
              style={{fontSize: 11}}
              tx="register.storeImage"
            />
          </TouchableOpacity>
        )}
        <Formik
          initialValues={{
            firstName: '',
            storeName: '',
            lastName: '',
            phoneNumber: '',
            email: '',
            password: '',
            confirmPassword: '',
          }}
          onSubmit={onRegisterHandle}
          validationSchema={loginSchema}>
          {({handleChange, handleBlur, handleSubmit, values, errors}) => {
            return (
              <>
                {isSeller && (
                  <InputField
                    value={values.storeName}
                    onChangeText={handleChange('storeName')}
                    onBlur={handleBlur('storeName')}
                    containerStyle={styles.inputContainer}
                    placeholder={'register.storeName'}
                    error={errors.storeName}
                  />
                )}
                <InputField
                  value={values.firstName}
                  onChangeText={handleChange('firstName')}
                  onBlur={handleBlur('firstName')}
                  containerStyle={styles.inputContainer}
                  placeholder={'common.firstName'}
                  error={errors.firstName}
                />
                <InputField
                  value={values.lastName}
                  placeholder={'common.lastName'}
                  onChangeText={handleChange('lastName')}
                  onBlur={handleBlur('lastName')}
                  containerStyle={styles.inputContainer}
                  error={errors.lastName}
                />
                <InputField
                  value={values.phoneNumber}
                  keyboardType="phone-pad"
                  onChangeText={handleChange('phoneNumber')}
                  onBlur={handleBlur('phoneNumber')}
                  error={errors.phoneNumber}
                  disabledRight
                  rightIcon={
                    <Pressable style={[styles.row]}>
                      <Text
                        text={selectedFlag.introructionNumber}
                        variant="smallRegular"
                        color={colors.brouwnLight}
                        style={{fontSize: 11}}
                      />
                      <Image
                        source={selectedFlag.imageUrl}
                        style={[styles.flag, styles.introNumber]}
                        resizeMode="center"
                      />
                    </Pressable>
                  }
                  containerStyle={styles.inputContainer}
                />
                <InputField
                  value={values.email}
                  keyboardType="email-address"
                  placeholder={'common.email'}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  containerStyle={styles.inputContainer}
                  error={errors.email}
                />
                <InputField
                  value={values.password}
                  placeholder={'common.password'}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  secureTextEntry={!isPasswordShow}
                  error={errors.password}
                  onPressRightIcon={showPassword}
                  rightIcon={
                    <MaterialCommunityIcons
                      onPress={showPassword}
                      name={isPasswordShow ? 'eye' : 'eye-off'}
                      size={18}
                    />
                  }
                  containerStyle={styles.inputContainer}
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
                  containerStyle={styles.inputContainer}
                />
                <View style={styles.buttonsContainer}>
                  <View
                    style={[
                      styles.row,
                      {
                        flex: 1,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: spacing.huge,
                      },
                    ]}>
                    <Button
                      onPress={handleSubmit}
                      title="register.newRegister"
                      style={styles.submitLogin}
                      isLoading={isLoading}
                    />
                    <View style={styles.row}>
                      <View style={styles.socailButtonContainer}>
                        <FacebookIcon />
                      </View>
                      <View style={styles.socailButtonContainer}>
                        <GoogleIcon />
                      </View>
                    </View>
                  </View>
                  {isError && (
                    <Text
                      variant="backend_error"
                      color={colors.red}
                      style={{
                        alignSelf: 'flex-start',
                        fontSize: 18,
                        marginTop: 20,
                      }}
                      tx={`${(error as any).response?.data?.Message}`}
                    />
                  )}
                </View>
              </>
            );
          }}
        </Formik>

        <View
          style={{
            marginBottom: bottom,
            borderWidth: 1,
            borderColor: colors.primary,
            borderRadius: 15,
            paddingHorizontal: 15,
            paddingVertical: 10,
            marginTop: 30,
            flexDirection: 'row',
          }}>
          <ShareImage style={{marginTop: -22, marginRight: 20}} />
          <View style={{flex: 1}}>
            <Text tx="register.shareDetails" variant="smallRegular" />
            <View style={{flexDirection: 'row'}}>
              <Pressable
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: colors.gray[300],
                }}>
                <Text
                  tx="register.referFriend"
                  variant="smallRegular"
                  color={colors.primary}
                />
              </Pressable>
            </View>
          </View>
        </View>
        {verifyModalShow && (
          <VerifyAccountModal
            onClose={() => setVerifyModalShow(false)}
            isVisible={verifyModalShow}
            email={email}
            phoneNumber={phoneNumber}
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
const GO_BACK_SIZE = 36;
const SIZE = 18;
const ICON_WIDTH = 30;
const topFieldsSpace = 20;

const styles = StyleSheet.create({
  cont: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'space-between',
  },
  goBackArrow: {},
  goBackContainer: {
    width: GO_BACK_SIZE,
    height: GO_BACK_SIZE,
    borderRadius: spacing.small + 2,
    backgroundColor: colors.gray[400],
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
    marginTop: 20,
    zIndex: 10,
  },
  mainImage: {
    alignSelf: 'center',
  },
  introNumber: {},
  linearGradient: {
    backgroundColor: '#D9DFFF',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  welcomeGoJaddy: {
    marginHorizontal: spacing.tiny,
    marginBottom: spacing.xxxLarge,
  },
  flag: {
    width: 30,
    height: 30,
  },

  formContainer: {
    backgroundColor: colors.white,
  },

  inputContainer: {
    // marginBottom: spacing.medium - 2,
  },
  submitLogin: {
    flex: 1,
  },
  buttonsContainer: {
    alignItems: 'center',
  },
  socailButtonContainer: {
    backgroundColor: colors.white,
    width: spacing.huge + 5,
    height: spacing.huge + 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: spacing.huge * 0.7,
    marginHorizontal: spacing.tiny,
    borderWidth: 1,
    borderColor: colors.brouwn + '80',
  },
  continueAsVisitor: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.secondary,
    marginTop: spacing.large,
  },

  registerTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  registerText: {
    marginHorizontal: spacing.tiny,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.large,
  },
});

export default Register;
