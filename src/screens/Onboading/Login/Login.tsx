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

interface IinitialValues {
  phoneNumber: string;
  password: string;
}
interface IFlag {
  imageUrl: ReactNode;
  introructionNumber: string;
}
interface ILoginNavigation
  extends NativeStackNavigationProp<AuthRoutes, 'Login'>,
    RouteProp<AuthRoutes, 'Login'> {}
const SIZE = 18;
const ICON_WIDTH = 30;
const topFieldsSpace = 20;
const GO_BACK_SIZE = 36;

const GredientFrom = '#AFB2B500';
const GredientTo = '#231D2590';

const initialValues: IinitialValues = {
  phoneNumber: '',
  password: '',
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
  const {navigate, canGoBack, goBack} = useNavigation<ILoginNavigation>();
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
  const [isSetPassModalOpened, setSetPassModalOpened] = useState<boolean>(false);
  const mainImageStyle: ImageStyle = {
    width: width * 0.9,
    height: height * 0.5,
  };

  const goRegister = () => {
    navigate('Register');
  };

  const doLogin = (values: any) => {
    const data = {
      PhoneNumber: values.phoneNumber,
      Password: values.password,
    };
    mutate(data);
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
    navigate('SetPasswordScreen')
    // setIsResetPassModalOpened(true);
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
        AsyncStorage.setItem('accessToken', AccessToken);
      }
    }
  }, [isSuccess]);

  return (
    <ScrollView keyboardDismissMode="interactive">
      <TouchableWithoutFeedback onPress={closeKeyboard}>
        <KeyboardAvoidingView>
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
                      onChangeText={handleChange('phoneNumber')}
                      onBlur={handleBlur('phoneNumber')}
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
                    {errors.phoneNumber && (
                      <Text
                        variant="error"
                        color={colors.red}
                        style={styles.errorMessage}>
                        {errors.phoneNumber}
                      </Text>
                    )}
                  </View>
                  <View style={styles.feildContainer}>
                    <InputField
                      value={values.password}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      placeholder={t('common.password')}
                      secureTextEntry={!isPasswordShow}
                      rightIcon={
                        <Pressable style={styles.row} onPress={showPassword}>
                          <View style={styles.introNumber} />
                          <VisibilityEyeIcon style={styles.introNumber} />
                        </Pressable>
                      }
                      containerStyle={styles.inputContainer}
                    />
                    {errors.password && (
                      <Text
                        variant="error"
                        color={colors.red}
                        style={styles.errorMessage}>
                        {errors.password}
                      </Text>
                    )}
                  </View>
                </View>
                <Text
                  tx="common.forget-password"
                  center
                  variant="mediumRegular"
                  onPress={showPasswordModal}
                />
                <View style={styles.buttonsContainer}>
                  <View style={[styles.row, styles.loginMethods]}>
                    <Button
                      title="login.login"
                      style={[styles.submitLogin, {width: width * 0.5}]}
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
                    title="login.continue-as-visitor"
                    style={[styles.continueAsVisitor, {width: width * 0.9}]}
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
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  submitLogin: {},
  buttonsContainer: {
    paddingHorizontal: spacing.xxLarge * 1,
    width: '100%',
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
