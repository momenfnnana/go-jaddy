import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  useWindowDimensions,
  ImageStyle,
  Pressable,
  Keyboard,
  Alert,
  TouchableWithoutFeedback,
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
  Loader,
} from 'components';
import {colors, spacing} from 'theme';
import {FacebookIcon, GojaddyLoginIcon, GoogleIcon} from 'assets/icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {Formik} from 'formik';
import {useTranslation} from 'react-i18next';
import {doLogin_service, ExtenalLogin} from 'services/Auth';
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
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';
import {firebase} from '@react-native-firebase/auth';
import {
  appleAuth,
  AppleButton,
} from '@invertase/react-native-apple-authentication';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';

interface IinitialValues {
  phoneNumber: string;
  password: string;
}

export const ICON_WIDTH = 30;
const topFieldsSpace = 20;

const GredientFrom = '#AFB2B500';
const GredientTo = '#231D2590';

const initialValues: IinitialValues = {
  phoneNumber: '595702522',
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
  const [notificationToken, setNotificationToken] = useState<string>();
  const [isPasswordShow, setIsPasswordShown] = useState<boolean>(false);
  const [isAnonymousModalOpened, setIsAnonymousModalOpened] =
    useState<boolean>(false);
  const [isResetPassModalOpened, setIsResetPassModalOpened] =
    useState<boolean>(false);
  const [isSetPassModalOpened, setSetPassModalOpened] =
    useState<boolean>(false);
  const [countryCode, setCountryCode] = useState<string>('00970');
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

  const successLogin = (data: any) => {
    const {AccessToken, RememberMe} = data.data;
    setAccessToken(AccessToken);
    if (!RememberMe) {
      axios.defaults.headers.common['AccessToken'] = `${AccessToken}`;
      AsyncStorage.setItem('accessToken', AccessToken);
    }
    reload(data.data?.AccessToken);
    if (localData && localData.length) {
      const newData = localData.map(item => {
        if (!!Object.keys(item?.SelectedAttributes).length) {
          return {
            ProductId: item?.ProductId,
            QuantityToAdd: item?.QuantityToAdd || 1,
            SelectedAttributes: item?.SelectedAttributes,
          };
        }
        return {
          ProductId: item?.ProductId,
          QuantityToAdd: item?.QuantityToAdd || 1,
          SelectedAttributes: [],
        };
      });
      mutateAddToCart(newData);
    }
    dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'HomeFlow', params: {screen: 'HomeStack'}}],
      }),
    );
    return data;
  };

  const {mutate, isLoading, isError, error} = useMutation(doLogin_service, {
    onSuccess: successLogin,
    onError: error => {
      return error;
    },
  });

  const {
    mutate: mutateExtenalLogin,
    isLoading: isLoadingExtenalLogin,
    isError: isErrorExtenalLogin,
    error: errorExtenalLogin,
  } = useMutation(ExtenalLogin, {
    onSuccess: successLogin,
    onError: error => {
      return error;
    },
  });

  const doLogin = (values: any) => {
    const data = {
      // PhoneNumber: countryCode + values.phoneNumber,
      // Password: values.password,
      NotificationToken: notificationToken,
      PhoneNumber: '00970595800504',
      Password: '/9875410Bara',
    };
    mutate(data);
  };

  const doExtenalLogin = (UID: string) => {
    const data = {
      NotificationToken: notificationToken,
      UID,
    };
    mutateExtenalLogin(data);
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
    messaging()
      .getToken()
      .then(token => {
        setNotificationToken(token);
      });
    (async () => {
      const cartItems = await AsyncStorage.getItem(CART);
      const cartArray = JSON.parse(cartItems as any) as any[];
      if (cartItems && cartArray) {
        let readyItems: any[] = [];
        for (let index = 0; index < cartArray.length; index++) {
          const productItem = cartArray[index];
          const attributes = productItem?.AttributesSelection;
          let SelectedAttributes: any[] = [];
          if (attributes?.length > 0) {
            for (let idx = 0; idx < attributes.length; idx++) {
              const attributeItem = attributes[idx];
              const values: any[] = attributeItem?.values;
              if (values) {
                for (let ix = 0; ix < values.length; ix++) {
                  const attributeValue = values[ix];
                  let attributeObject = {
                    AttributeId: attributeItem.AttributeId,
                    VariantAttributeId: attributeItem.VariantAttributeId,
                    AttributeValue: attributeValue.Id,
                  };
                  SelectedAttributes = [...SelectedAttributes, attributeObject];
                }
              } else {
                let attributeObject = {
                  AttributeId: attributeItem.AttributeId,
                  VariantAttributeId: attributeItem.VariantAttributeId,
                  AttributeValue: attributeItem?.AttributeValue,
                };
                SelectedAttributes = [...SelectedAttributes, attributeObject];
              }
            }
            readyItems = [
              ...readyItems,
              {
                ProductId: productItem?.Id,
                QuantityToAdd: productItem?.QuantityToAdd || 1,
                SelectedAttributes,
              },
            ];
          } else {
            readyItems = [
              ...readyItems,
              {
                ProductId: productItem?.Id,
                QuantityToAdd: productItem?.QuantityToAdd || 1,
                SelectedAttributes: [],
              },
            ];
          }
        }
        setLocalData(readyItems);
      }
    })();
  }, [updateProducts]);

  const signInwithFacebook = async () => {
    try {
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);
      if (result.isCancelled) {
      }
      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        Alert.alert(
          'Something went wrong obtaining access token',
          JSON.stringify(data),
        );
      }
      const facebookCredential = auth.FacebookAuthProvider.credential(
        (data as any).accessToken,
      );
      const respones = await auth().signInWithCredential(facebookCredential);
      doExtenalLogin(respones?.user?.uid);
    } catch (error) {}
  };

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      const currentUser = await GoogleSignin.getCurrentUser();
      const {idToken, ...rest} = await GoogleSignin.signIn();
      const token = await GoogleSignin.getTokens();

      const googleCredential = auth.GoogleAuthProvider.credential(
        token.idToken,
      );
      const response = await auth().signInWithCredential(googleCredential);
      doExtenalLogin(response.user.uid);
    } catch (error: any) {}
  };

  async function onAppleButtonPress() {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });
      const {identityToken, nonce} = appleAuthRequestResponse;
      if (identityToken) {
        const appleCredential = firebase.auth.AppleAuthProvider.credential(
          identityToken,
          nonce,
        );
        const userCredential = await firebase
          .auth()
          .signInWithCredential(appleCredential);
        doExtenalLogin(userCredential.user.uid);
      } else {
      }
    } catch (error) {}
  }

  if (isLoadingExtenalLogin) {
    return <Loader isPageLoading />;
  }

  return (
    <TouchableWithoutFeedback onPress={closeKeyboard} style={styles.cont}>
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
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: colors.black,
                      marginTop: spacing.small,
                      marginBottom: -12,
                      borderRadius: 24,
                      overflow: 'hidden',
                      width: '100%',
                    }}>
                    <AppleButton
                      cornerRadius={5}
                      style={{
                        height: 40,
                        borderRadius: 24,
                      }}
                      buttonStyle={AppleButton.Style.WHITE}
                      buttonType={AppleButton.Type.SIGN_IN}
                      onPress={() => onAppleButtonPress()}
                    />
                  </View>
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
    </TouchableWithoutFeedback>
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
