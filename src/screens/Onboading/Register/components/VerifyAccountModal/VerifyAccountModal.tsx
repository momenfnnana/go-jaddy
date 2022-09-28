import {Text} from 'components';
import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  useWindowDimensions,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import Modal from 'react-native-modal';
import {colors, spacing} from 'theme';
import Icon from 'react-native-vector-icons/AntDesign';
import {VerifyAccountImage} from 'assets/icons';
import {ICON_WIDTH} from 'screens/Onboading/Login/Login';
import {useMutation} from '@tanstack/react-query';
import {verificationCode} from 'services/Auth';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {useTimer} from 'react-timer-hook';

const CELL_COUNT = 4;

interface IVerifyAccountModal {
  isVisible: boolean;
  email: string;
  onClose: () => void;
}
const VerifyAccountModal = ({
  isVisible,
  onClose,
  email,
}: IVerifyAccountModal) => {
  const {width} = useWindowDimensions();
  const onsubmit = (values: any) => {
    //pass values here
    // mutate()
  };
  const [value, setValue] = useState('');
  const time: Date = new Date();
  time.setSeconds(time.getSeconds() + 120);
  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({
    autoStart: true,
    expiryTimestamp: time,
    onExpire: () => console.warn('onExpire called'),
  });

  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const {mutate, isLoading, isError, error, isSuccess, data} = useMutation(
    verificationCode,
    {
      onSuccess: data => {
        return data;
      },
      onError: error => {
        return error;
      },
    },
  );

  useEffect(() => {
    if (isSuccess) {
      Alert.alert(JSON.stringify({...data.data}));
    }
  }, [data]);

  useEffect(() => {
    if (value.length == CELL_COUNT) {
      mutate({email, verificationCode: value});
    }
  }, [value]);

  return (
    <ScrollView>
      <KeyboardAvoidingView
        style={{
          flex: 1,
          backgroundColor: colors.white,
          justifyContent: 'space-between',
        }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Modal isVisible={isVisible} onBackdropPress={onClose}>
          <View style={[styles.container, {width}]}>
            <View style={styles.containerHeader}>
              <Icon
                name="close"
                style={{opacity: 0}}
                size={26}
                color={colors.gray[500]}
              />
              <Text tx="common.verifyAccount" variant="largeBold" />
              <Icon
                onPress={onClose}
                name="close"
                size={26}
                color={colors.gray[400]}
              />
            </View>
            <VerifyAccountImage style={styles.retrivePasswordIcon} />
            <Text
              tx="common.verifyModalText"
              variant="mediumRegular"
              color={colors.grayMain}
              center
              style={styles.description}
            />
            <Text
              tx={email}
              variant="mediumExtraBold"
              center
              style={styles.email}
            />
            <CodeField
              ref={ref}
              {...props}
              // caretHidden={false}
              // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
              value={value}
              onChangeText={setValue}
              cellCount={CELL_COUNT}
              rootStyle={styles.codeFieldRoot}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              renderCell={({index, symbol, isFocused}) => (
                <Text
                  key={index}
                  style={[styles.cell, isFocused && styles.focusCell]}
                  onLayout={getCellOnLayoutHandler(index)}>
                  {symbol || (isFocused ? <Cursor /> : null)}
                </Text>
              )}
            />
            <Text
              center
              variant="mediumRegular"
              color={colors.red}
              tx={` ${minutes} : ${seconds} `}
            />
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default VerifyAccountModal;

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.xxLarge,
    backgroundColor: colors.white,
    position: 'absolute',
    bottom: spacing.none,
    alignSelf: 'center',
    height: 500,
    marginBottom: -spacing.large,
    borderTopRightRadius: spacing.small,
    borderTopLeftRadius: spacing.small,
    paddingHorizontal: spacing.content,
  },
  containerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  retrivePasswordIcon: {
    alignSelf: 'center',
  },
  description: {
    marginTop: spacing.large,
    marginBottom: spacing.medium,
    paddingHorizontal: spacing.medium,
  },
  email: {
    marginBottom: spacing.medium,
    paddingHorizontal: spacing.medium,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  root: {flex: 1, padding: 20},
  title: {textAlign: 'center', fontSize: 30},
  codeFieldRoot: {marginTop: 20, justifyContent: 'center', marginBottom: 20},
  cell: {
    width: 55,
    height: 55,
    lineHeight: 50,
    fontSize: 24,
    borderWidth: 1,
    borderColor: colors.gray[300],
    textAlign: 'center',
    borderRadius: 8,
    marginHorizontal: 10,
  },
  focusCell: {
    borderColor: '#000',
  },
});
