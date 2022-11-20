import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {InputField, Text} from 'components';
import {VisaIcon} from 'assets/icons';
import {colors, spacing} from 'theme';
import {Switch} from 'react-native-paper';

const CardsForms = () => {
  const [isDefualt, setDefualt] = useState<boolean>(false);
  return (
    <View>
      <InputField
        style={{}}
        placeholder="3742 4545 5400 1226"
        rightIcon={<VisaIcon />}
      />
      <View style={styles.cardDetails}>
        <View style={styles.cardPickerName}>
          <InputField style={{}} placeholder="checkout.card-picker-name" />
        </View>
        <View style={styles.expireDate}>
          <InputField
            style={{textAlign: 'center'}}
            placeholder="checkout.card-expire-date"
          />
        </View>
        <View style={styles.secretNumber}>
          <InputField
            style={{textAlign: 'center'}}
            placeholder="checkout.card-ccv"
          />
        </View>
      </View>
      <View style={styles.defualtContainer}>
        <Switch
          value={isDefualt}
          onValueChange={() => setDefualt(!isDefualt)}
          color={colors.primary}
          style={{transform: [{scale: 0.7}]}}
        />
        <Text
          tx="addAddress.setDefualt"
          variant="xSmallBold"
          style={{marginHorizontal: 10}}
        />
      </View>
    </View>
  );
};

export default CardsForms;

const styles = StyleSheet.create({
  cardDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.smaller,
  },
  cardPickerName: {
    flex: 0.5,
    paddingHorizontal: spacing.tiny,
  },
  expireDate: {
    flex: 0.25,
    paddingHorizontal: spacing.tiny,
  },
  secretNumber: {
    flex: 0.25,
    paddingHorizontal: spacing.tiny,
  },
  defualtContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.small,
  },
});
