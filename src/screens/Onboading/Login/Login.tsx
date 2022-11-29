import React, {useContext, useEffect, useState} from 'react';
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
  Keyboard,
} from 'react-native';
import {LoginMain} from 'assets/images';
import LinearGradient from 'react-native-linear-gradient';
import {
  BackButton,
  Button,
  InputField,
  Spacer,
  Text,
  PhoneNumberInput,
} from 'components';
import {colors, spacing} from 'theme';
import {FacebookIcon, GojaddyLoginIcon, GoogleIcon} from 'assets/icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {CommonActions, useNavigation} from '@react-navigation/native';
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
import {LoginScreenNavigationProp} from 'navigators/NavigationsTypes';
import axios from 'axios';
import {useAccessToken} from 'hook/useAccessToken';
import {addCartProducts} from 'services/Cart';
import {CART} from 'types';
import {useSchema} from 'hook/useSchema';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {LoginManager} from 'react-native-fbsdk-next';
import {firebase} from '@react-native-firebase/auth';
import {
  appleAuth,
  AppleButton,
} from '@invertase/react-native-apple-authentication';

interface IinitialValues {
  phoneNumber: string;
  password: string;
}

export const ICON_WIDTH = 30;
const topFieldsSpace = 20;

const GredientFrom = '#AFB2B500';
const GredientTo = '#231D2590';

const initialValues: IinitialValues = {
  phoneNumber: '05957025222',
  password: 'Password$1',
};

const Login = () => {
  const {reload} = useAccessToken();
  const {loginSchema} = useSchema();
  const {width, height} = useWindowDimensions();
  const {top} = useSafeAreaInsets();
  const {navigate, canGoBack, dispatch} =
    useNavigation<LoginScreenNavigationProp>();
  const {t} = useTranslation();
  const {setAccessToken, updateProducts} = useContext(UserContext);
  const [isPasswordShow, setIsPasswordShown] = useState<boolean>(false);
  const [isAnonymousModalOpened, setIsAnonymousModalOpened] =
    useState<boolean>(false);
  const [isResetPassModalOpened, setIsResetPassModalOpened] =
    useState<boolean>(false);
  const [isSetPassModalOpened, setSetPassModalOpened] =
    useState<boolean>(false);
  const [countryCode, setCountryCode] = useState<string>('970');
  const [localData, setLocalData] = useState<any[]>([]);
  const mainImageStyle: ImageStyle = {
    width: width * 0.9,
    height: height * 0.5,
  };

  const goRegister = () => {
    navigate('Register');
  };
  const {mutate: mutateAddToCart} = useMutation(addCartProducts, {
    onSuccess: data => {
      AsyncStorage.removeItem(CART);
      return data;
    },
  });

  const {mutate, isLoading, isError, error} = useMutation(doLogin_service, {
    onSuccess: data => {
      const {AccessToken, RememberMe} = data.data;
      setAccessToken(AccessToken);
      dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'HomeFlow', params: {screen: 'HomeStack'}}],
        }),
      );
      // navigate('HomeFlow', {screen: 'HomeStack'} as any);
      if (!RememberMe) {
        axios.defaults.headers.common['AccessToken'] = `${AccessToken}`;
        AsyncStorage.setItem('accessToken', AccessToken);
      }
      reload(data.data?.AccessToken);
      if (localData && !!localData.length) {
        localData?.map(item => {
          console.log({Attributes: item?.Attributes});
          const attributesToSend = item?.Attributes.map((element: any) => {
            return {
              AttributeId: element.AttributeId,
              VariantAttributeId: element.VariantAttributeId,
              AttributeValueId: element.values[0].Id,
            };
          });
          mutateAddToCart({
            ProductId: item?.Id,
            QuantityToAdd: item?.QuantityToAdd || 1,
            SelectedAttributes: attributesToSend,
          });
        });
      }
      return data;
    },
    onError: error => {
      return error;
    },
  });

  const doLogin = (values: any) => {
    const data = {
      PhoneNumber: countryCode + values.phoneNumber,
      Password: values.password,
      // PhoneNumber: '00970595800504',
      // Password: '/9875410Bara',
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

  const onChangeCountry = (value: string) => {
    setCountryCode(value);
  };

  useEffect(() => {
    (async () => {
      const cartItems = await AsyncStorage.getItem(CART);
      const cartArray = JSON.parse(cartItems as any) as any[];
      if (cartArray) {
        setLocalData(cartArray);
      }
    })();
  }, [updateProducts]);

  const signInwithFacebook = async () => {
    LoginManager.logInWithPermissions(['email']).then(
      function (result) {
        if (result.isCancelled) {
          console.log('Login cancelled');
        } else {
          console.log({result});
          console.log(
            'Login success with permissions: ' +
              result?.grantedPermissions?.toString(),
          );
        }
      },
      function (error) {
        console.log('Login fail with error: ' + error);
      },
    );
  };

  const signInWithGoogle = async () => {
    try {
      console.log('first');
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const token = await GoogleSignin.getTokens();
      console.log({userInfo});
      console.log({token});
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('SIGN_IN_CANCELLED');
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('IN_PROGRESS');
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('PLAY_SERVICES_NOT_AVAILABLE');
        // play services not available or outdated
      } else {
        console.log('some other error happened', {error});
        // some other error happened
      }
    }
  };

  async function onAppleButtonPress() {
    try {
      // 1). start a apple sign-in request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      // 2). if the request was successful, extract the token and nonce
      const {identityToken, nonce} = appleAuthRequestResponse;

      // can be null in some scenarios
      if (identityToken) {
        // 3). create a Firebase `AppleAuthProvider` credential
        const appleCredential = firebase.auth.AppleAuthProvider.credential(
          identityToken,
          nonce,
        );

        // 4). use the created `AppleAuthProvider` credential to start a Firebase auth request,
        //     in this example `signInWithCredential` is used, but you could also call `linkWithCredential`
        //     to link the account to an existing user
        const userCredential = await firebase
          .auth()
          .signInWithCredential(appleCredential);

        // user is now signed in, any Firebase `onAuthStateChanged` listeners you have will trigger
        console.warn(
          `Firebase authenticated via Apple, UID: ${userCredential.user.uid}`,
        );
      } else {
        // handle this - retry?
        console.log({appleAuthRequestResponse});
        console.log('no token');
      }
    } catch (error) {
      console.log('error in apple auth:', {error});
    }
  }

  return (
    <View style={styles.cont}>
      <View style={{flex: 1}}>
        <LinearGradient
          colors={[GredientFrom, GredientTo]}
          style={styles.linearGradient}>
          <View style={[styles.headerContainer, {marginTop: top}]}>
            {canGoBack() && (
              <BackButton
                style={styles.goBackContainer}
                size={22}
                color={colors.arrowColor}
              />
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
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View style={styles.formContainer}>
              <View style={styles.inputsContainer}>
                <View style={styles.feildContainer}>
                  <PhoneNumberInput
                    value={values.phoneNumber}
                    onChangeText={handleChange('phoneNumber')}
                    onBlur={handleBlur('phoneNumber')}
                    errorTouched={touched.phoneNumber}
                    errorValue={errors.phoneNumber}
                    onChangeCountry={onChangeCountry}
                    style={{}}
                  />
                </View>
                <View style={styles.feildContainer}>
                  <InputField
                    value={values.password}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    placeholder={t('common.password')}
                    secureTextEntry={!isPasswordShow}
                    onPressRightIcon={showPassword}
                    style={{}}
                    rightIcon={
                      <MaterialCommunityIcons
                        onPress={showPassword}
                        name={isPasswordShow ? 'eye' : 'eye-off'}
                        size={18}
                      />
                    }
                    containerStyle={styles.inputContainer}
                    error={{
                      value: errors.password,
                      touched: touched.password,
                    }}
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
                    <Pressable
                      onPress={signInwithFacebook}
                      style={styles.socailButtonContainer}>
                      <FacebookIcon />
                    </Pressable>
                    <Pressable
                      onPress={signInWithGoogle}
                      style={styles.socailButtonContainer}>
                      <GoogleIcon />
                    </Pressable>
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
                {appleAuth.isSupported && (
                  <AppleButton
                    cornerRadius={5}
                    style={{
                      marginTop: spacing.small,
                      width: '100%',
                      height: 50,
                      borderWidth: 1,
                      borderColor: colors.black,
                      borderRadius: 24,
                      marginBottom:-12
                    }}
                    buttonStyle={AppleButton.Style.WHITE}
                    buttonType={AppleButton.Type.SIGN_IN}
                    onPress={() => onAppleButtonPress()}
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
      </View>
    </View>
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
    flex: 0.8,
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
  formContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.normal - 1,
    flex: 0.8,
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
    backgroundColor: colors.arrowBackgroundColor,
    padding: 8,
    borderRadius: spacing.small + 2,
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
  justifyBtw: {
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: spacing.huge,
    paddingBottom: spacing.normal,
    marginBottom: spacing.normal,
    borderBottomColor: colors.disabledBackground,
    borderBottomWidth: 1,
  },
});
