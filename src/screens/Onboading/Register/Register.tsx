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
} from 'react-native';
import React, {ReactNode, useContext, useEffect, useState} from 'react';
import {RegisterHeader, RegisterLogo, ShareImage} from './images';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors, spacing} from 'theme';
import {Button, InputField, Text} from 'components';
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
    .required('phone number is required')
    .length(10, 'phone number must be exactly 10 characters'),
  password: Yup.string()
    .required('password is required')
    .min(8, 'password must being at least 8 characters'),
  confirmPassword: Yup.string()
    .required('confirm password is required')
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

const Register = () => {
  const {width, height} = useWindowDimensions();
  const {canGoBack, goBack} = useNavigation();
  const [isClient, setClient] = useState(true);
  const [isPasswordShow, setIsPasswordShown] = useState<boolean>(false);
  const [isCPasswordShow, setIsCPasswordShown] = useState<boolean>(false);
  const {setUserData} = useContext(UserContext);
  const [image, setImage] = useState({});
  // const [data, setData÷÷] = useState({});
  const [selectedFlag, setSelectedFlag] = useState<IFlag>({
    imageUrl: PalestineFlag,
    introructionNumber: '970',
  });
  const onRegisterHandle = (values: any) => {
    const data = new FormData();
    data.append('CustomerType', 'Seller');
    data.append('FirstName', values.firstName);
    data.append('LastName', values.lastName);
    data.append('PhoneNumber', values.phoneNumber);
    data.append('Email', values.email);
    data.append('Password', values.password);
    data.append('ConfirmPassword', values.confirmPassword);
    data.append('CustomerStoreName', 'sasasada');
    data.append('StoreImage', image);
    const datas = {
      CustomerType: isClient ? 'Seller' : 'Buyer',
      FirstName: values.firstName,
      LastName: values.lastName,
      PhoneNumber: values.phoneNumber,
      Email: values.email,
      Password: values.password,
      ConfirmPassword: values.confirmPassword,
    };
    console.log({data});
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
  console.log({sss: error});

  useEffect(() => {
    if (isSuccess) {
      const {AccessToken} = data?.data;
      setUserData({
        ...data?.data,
      });
      // if (!RememberMe) {
      AsyncStorage.setItem('accessToken', AccessToken);
      // }
    }
  }, [data]);

  const useLibraryHandler = async () => {
    const options = {
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
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        if (response.customButton === 'remove') {
          console.log('User tapped custom button: ', response.customButton);
        }
      } else {
        console.log({image: response?.assets[0]});
        let localUri = response?.assets[0]?.uri;
        let filename = response?.assets[0]?.fileName;
        let type = response?.assets[0]?.type;
        ImageResizer.createResizedImage(localUri, 120, 120, 'PNG', 100, 0)
          .then(response => {
            console.log('ImageResizer : ', response);
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

  console.log({image});

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
            {/* <SafeAreaView> */}
            {canGoBack() && (
              <Pressable style={styles.goBackContainer} onPress={goBack}>
                <MaterialIcons
                  name="keyboard-backspace"
                  size={25}
                  color={colors.white}
                  style={styles.goBackArrow}
                />
              </Pressable>
            )}
            {/* </SafeAreaView> */}
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
            onPress={() => setClient(true)}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <MaterialIcons
              name={`radio-button-${isClient ? 'on' : 'off'}`}
              size={20}
              color={isClient ? colors.secondary : colors.gray[300]}
            />
            <Text
              tx="register.clientAccount"
              style={{marginLeft: 5}}
              variant={'smallBold'}
              color={isClient ? colors.secondary : colors.gray[400]}
            />
          </Pressable>
          <Pressable
            onPress={() => setClient(false)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 20,
            }}>
            <MaterialIcons
              name={`radio-button-${!isClient ? 'on' : 'off'}`}
              size={20}
              color={!isClient ? colors.secondary : colors.gray[300]}
            />
            <Text
              tx="register.traderAccount"
              style={{marginLeft: 5}}
              variant={'smallBold'}
              color={!isClient ? colors.secondary : colors.gray[400]}
            />
          </Pressable>
        </View>
        <TouchableOpacity
          onPress={useLibraryHandler}
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            backgroundColor: '#EFEFEF',
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
        </TouchableOpacity>
        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            phoneNumber: '',
            email: '',
            password: '',
            confirmPassword: '',
          }}
          onSubmit={onRegisterHandle}
          validationSchema={loginSchema}>
          {({handleChange, handleBlur, handleSubmit, values, errors}) => {
            console.log({SS: errors});
            return (
              <>
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
                  rightIcon={
                    <Pressable style={styles.row}>
                      <View style={styles.introNumber}>
                        <Text
                          text={selectedFlag.introructionNumber}
                          variant="smallRegular"
                          color={colors.brouwnLight}
                        />
                      </View>
                      <Image
                        source={selectedFlag.imageUrl}
                        style={[styles.flag, styles.introNumber]}
                        resizeMode="contain"
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
                </View>
              </>
            );
          }}
        </Formik>
        {/* <SafeAreaView> */}
        <View
          style={{
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
        {/* </SafeAreaView> */}
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
  goBackArrow: {
    // transform: [{rotate: '180deg'}],
  },
  goBackContainer: {
    width: GO_BACK_SIZE,
    height: GO_BACK_SIZE,
    borderRadius: spacing.small + 2,
    backgroundColor: colors.gray[400],
    justifyContent: 'center',
    alignItems: 'center',
    // alignSelf: 'flex-end',
    marginLeft: 20,
    marginTop: 20,
    zIndex: 10,
  },
  mainImage: {
    alignSelf: 'center',
  },
  introNumber: {
    maxWidth: ICON_WIDTH,
    minWidth: ICON_WIDTH,
  },
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
    width: SIZE,
    height: SIZE,
  },

  formContainer: {
    backgroundColor: colors.white,
  },

  inputContainer: {
    marginBottom: spacing.medium - 2,
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
