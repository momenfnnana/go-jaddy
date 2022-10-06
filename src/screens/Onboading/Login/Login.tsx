import React, {ReactNode, useContext, useEffect, useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  useWindowDimensions,
  ImageStyle,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ImageSourcePropType,
} from 'react-native';
import {LoginMain, PalestineFlag} from 'assets/images';
import LinearGradient from 'react-native-linear-gradient';
import {Button, InputField, Loader, Spacer, Text} from 'components';
import {colors, spacing} from 'theme';
import {
  FacebookIcon,
  GojaddyLoginIcon,
  GoogleIcon,
  VisibilityEyeIcon,
} from 'assets/icons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AuthRoutes, HomeRoutes} from 'navigators/RoutesTypes';
import {Formik} from 'formik';
import * as Yub from 'yup';
import {useTranslation} from 'react-i18next';
import {doLogin_service} from 'services/Auth';
import {useMutation} from '@tanstack/react-query';
import {UserContext} from 'context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AnonymousModal from './components/AnonymousModal';
import ResetPasswordModal from './components/ForgetPasswordModal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {HomeNavigationsType} from 'navigators/NavigationsTypes';
import axios from 'axios';

interface IinitialValues {
  phoneNumber: string;
  password: string;
}
interface IFlag {
  imageUrl: ImageSourcePropType;
  introructionNumber: string;
}

const SIZE = 18;
export const ICON_WIDTH = 30;
const topFieldsSpace = 20;
const GO_BACK_SIZE = 36;

const GredientFrom = '#AFB2B500';
const GredientTo = '#231D2590';

const initialValues: IinitialValues = {
  phoneNumber: '121234567891011',
  password: 'Password$1',
};
const loginSchema = Yub.object().shape({
  phoneNumber: Yub.number()
    .required('phone number must be string')
    .min(10, 'phone number must be at least 10 characters'),
  password: Yub.string()
    .required('password is required')
    .min(8, 'password must being at least 8 characters'),
});
const Login = () => {
  const {width, height} = useWindowDimensions();
  const {top} = useSafeAreaInsets();
  const {navigate, canGoBack, goBack} = useNavigation<HomeNavigationsType>();
  const {t} = useTranslation();
  const {setUserData} = useContext(UserContext);
  const [selectedFlag, setSelectedFlag] = useState<IFlag>({
    imageUrl: PalestineFlag,
    introructionNumber: '970',
  });
  const [isPasswordShow, setIsPasswordShown] = useState<boolean>(false);
  const [isAnonymousModalOpened, setIsAnonymousModalOpened] =
    useState<boolean>(false);
  const [isResetPassModalOpened, setIsResetPassModalOpened] =
    useState<boolean>(false);
  const [isSetPassModalOpened, setSetPassModalOpened] =
    useState<boolean>(false);
  const mainImageStyle: ImageStyle = {
    width: width * 0.9,
    height: height * 0.5,
  };

  const goRegister = () => {
    navigate('Register');
  };

  const {mutate, isLoading, isError, error, isSuccess, data} = useMutation(
    doLogin_service,
    {
      onSuccess: data => {
        return data;
      },
      onError: error => {
        return error;
      },
    },
  );

  const doLogin = (values: any) => {
    const data = {
      PhoneNumber: values.phoneNumber,
      Password: values.password,
    };
    mutate(data);
  };

  const showPassword = () => {
    setIsPasswordShown(currentValue => !currentValue);
  };

  const closeKeyboard = () => {
    Keyboard.dismiss();
  };

  const showAnonymousModal = () => {
    setIsAnonymousModalOpened(true);
  };

  const showPasswordModal = () => {
    setIsResetPassModalOpened(true);
  };

  const onCodeSent = (value: boolean) => {
    value && setSetPassModalOpened(true);
  };

  useEffect(() => {
    if (isSuccess) {
      const {
        AccessToken,
        RememberMe,
        UserEmailAddress,
        UserFullName,
        UserId,
        UserPhoneNumber,
        UserType,
      } = data.data;
      setUserData({
        AccessToken,
        RememberMe,
        UserEmailAddress,
        UserFullName,
        UserId,
        UserPhoneNumber,
        UserType,
      });
      if (!RememberMe) {
        axios.defaults.headers.common['AccessToken'] = `${AccessToken}`;
        AsyncStorage.setItem('accessToken', AccessToken);
      }
    }
  }, [isSuccess]);

  return (
    <KeyboardAvoidingView
      style={styles.cont}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 27}>
      <ScrollView>
        <LinearGradient
          colors={[GredientFrom, GredientTo]}
          style={styles.linearGradient}>
          <View style={[styles.headerContainer, {marginTop: top}]}>
            {canGoBack() && (
              <Pressable style={styles.goBackContainer} onPress={goBack}>
                <FontAwesome
                  name="long-arrow-right"
                  size={25}
                  color={colors.arrowColor}
                  style={styles.goBackArrow}
                />
              </Pressable>
            )}
            <Pressable
              onPress={goRegister}
              style={styles.registerTextContainer}>
              <Text
                tx="login.new-user"
                variant="mediumRegular"
                style={styles.registerText}
              />
              <Text
                tx="login.register"
                variant="mediumBold"
                style={styles.registerText}
              />
            </Pressable>
          </View>
          <Image
            source={LoginMain}
            style={[styles.mainImage, mainImageStyle]}
            resizeMode="contain"
          />
          <View style={styles.row}>
            <Text
              tx="login.welcome"
              color={colors.white}
              variant="largeBold"
              style={styles.welcomeGoJaddy}
            />
            <GojaddyLoginIcon style={styles.welcomeGoJaddy} />
          </View>
        </LinearGradient>
        <Formik
          initialValues={initialValues}
          onSubmit={doLogin}
          validationSchema={loginSchema}>
          {({handleChange, handleBlur, handleSubmit, values, errors}) => (
            <View style={styles.formContainer}>
              <View style={styles.inputsContainer}>
                <View style={styles.feildContainer}>
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
                  {/* <InputField
                      value={values.phoneNumber}
                      keyboardType="phone-pad"
                      onChangeText={handleChange('phoneNumber')}
                      onBlur={handleBlur('phoneNumber')}
                      disabledRight
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
                      error={errors.phoneNumber}
                    /> */}
                </View>
                <View style={styles.feildContainer}>
                  <InputField
                    value={values.password}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    placeholder={t('common.password')}
                    secureTextEntry={!isPasswordShow}
                    onPressRightIcon={showPassword}
                    rightIcon={
                      <MaterialCommunityIcons
                        onPress={showPassword}
                        name={isPasswordShow ? 'eye' : 'eye-off'}
                        size={18}
                      />
                    }
                    containerStyle={styles.inputContainer}
                    error={errors.password}
                  />
                </View>
              </View>
              <Text
                tx="common.forget-password"
                center
                variant="mediumRegular"
                onPress={showPasswordModal}
              />
              <View style={styles.buttonsContainer}>
                <View
                  style={[
                    styles.row,
                    {
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: spacing.huge,
                    },
                  ]}>
                  <Button
                    title="login.login"
                    style={styles.submitLogin}
                    onPress={handleSubmit}
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
                    tx={`${error?.response?.data?.Message}`}
                  />
                )}
                <Button
                  variant="Secondary"
                  title="login.continue-as-visitor"
                  style={styles.continueAsVisitor}
                  color={colors.secondary}
                  onPress={showAnonymousModal}
                />
                <Spacer />
              </View>
            </View>
          )}
        </Formik>
        <AnonymousModal
          visibleAnonymousModal={isAnonymousModalOpened}
          setvisibleAnonymousModal={setIsAnonymousModalOpened}
        />
        <ResetPasswordModal
          visibleResetPasswordModal={isResetPassModalOpened}
          setvisibleResetPasswordModal={setIsResetPassModalOpened}
          success={onCodeSent}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cont: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'space-between',
  },
  mainImage: {
    alignSelf: 'center',
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
  introNumber: {
    maxWidth: ICON_WIDTH,
    minWidth: ICON_WIDTH,
  },
  formContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.normal - 1,
  },
  inputsContainer: {
    marginTop: -topFieldsSpace,
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
    borderColor: colors.brouwn,
  },
  continueAsVisitor: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.secondary,
    marginTop: spacing.large,
  },
  goBackContainer: {
    width: GO_BACK_SIZE,
    height: GO_BACK_SIZE,
    borderRadius: spacing.small + 2,
    backgroundColor: colors.arrowBackgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingHorizontal: spacing.normal - 1,
  },
  goBackArrow: {
    transform: [{rotate: '180deg'}],
  },
  errorMessage: {
    marginHorizontal: spacing.large,
  },
  feildContainer: {
    marginBottom: spacing.large,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginMethods: {
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.huge,
  },
});
