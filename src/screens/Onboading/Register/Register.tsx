import {
  View,
  ScrollView,
  Image,
  useWindowDimensions,
  ImageBackground,
  SafeAreaView,
  Pressable,
  StyleSheet,
} from 'react-native';
import React, {ReactNode, useState} from 'react';
import {RegisterHeader, RegisterLogo, ShareImage} from './images';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {colors, spacing} from 'theme';
import {Button, InputField, Text} from 'components';
import {PalestineFlag} from 'assets/images';
import {Formik} from 'formik';
import * as Yub from 'yup';
import {FacebookIcon, GoogleIcon} from 'assets/icons';

interface IFlag {
  imageUrl: ReactNode;
  introructionNumber: string;
}

const loginSchema = Yub.object().shape({
  phoneNumber: Yub.number()
    .required('phone number must be string')
    .min(10, 'phone number must be at least 10 characters'),
  password: Yub.string()
    .required('password is required')
    .min(8, 'password must being at least 8 characters'),
});

const Register = () => {
  const {width, height} = useWindowDimensions();
  const {canGoBack, goBack} = useNavigation();
  const [isClient, setClient] = useState(true);
  const [selectedFlag, setSelectedFlag] = useState<IFlag>({
    imageUrl: PalestineFlag,
    introructionNumber: '970',
  });
  return (
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
          <SafeAreaView>
            {/* {canGoBack() && ( */}
            <Pressable style={styles.goBackContainer} onPress={goBack}>
              <MaterialIcons
                name="keyboard-backspace"
                size={25}
                color={colors.white}
                style={styles.goBackArrow}
              />
            </Pressable>
            {/* )} */}
          </SafeAreaView>
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
          style={{flexDirection: 'row', alignItems: 'center', marginLeft: 20}}>
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
      <Formik
        initialValues={{
          firstName: '',
          lasttName: '',
          phoneNumber: '',
          email: '',
          password: '',
          confirmPassword: '',
        }}
        onSubmit={() => true}
        validationSchema={loginSchema}>
        {({handleChange, handleBlur, handleSubmit, values, errors}) => (
          <>
            <InputField
              value={values.firstName}
              onChangeText={handleChange('firstName')}
              containerStyle={styles.inputContainer}
              placeholder={'common.firstName'}
            />
            <InputField
              value={values.lasttName}
              placeholder={'common.lastName'}
              onChangeText={handleChange('lasttName')}
              containerStyle={styles.inputContainer}
            />
            <InputField
              value={values.phoneNumber}
              onChangeText={handleChange('phoneNumber')}
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
              placeholder={'common.email'}
              onChangeText={handleChange('email')}
              containerStyle={styles.inputContainer}
            />
            <InputField
              value={values.password}
              placeholder={'common.password'}
              onChangeText={handleChange('password')}
              containerStyle={styles.inputContainer}
            />
            <InputField
              value={values.confirmPassword}
              placeholder={'register.confirmPassword'}
              onChangeText={handleChange('confirmPassword')}
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
                  title="register.newRegister"
                  style={[styles.submitLogin, {flex: 1}]}
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
        )}
      </Formik>
      <SafeAreaView>
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
      </SafeAreaView>
    </ScrollView>
  );
};
const GO_BACK_SIZE = 36;
const SIZE = 18;
const ICON_WIDTH = 30;
const topFieldsSpace = 20;

const styles = StyleSheet.create({
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
  submitLogin: {},
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
