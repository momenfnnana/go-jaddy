import {View, StyleSheet, ViewStyle} from 'react-native';
import {ProfileIconTab} from 'assets/icons';
import {colors, spacing} from 'theme';
import {Text} from 'components';
interface IRightIconInputs {
  text: string;
}
export interface ITab {
  id: number;
  title: string;
  icon: JSX.Element;
  RightIcon?: ({text}: IRightIconInputs) => JSX.Element;
  bottomSection?: JSX.Element;
}
const iconcontainerStyle = {
  backgroundColor: colors.secondary,
  height: spacing.normal,
  width: spacing.normal,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: spacing.normal * 0.5,
} as ViewStyle;
const currencyContainer = {
  backgroundColor: colors.secondaryBackground3,
  paddingHorizontal: spacing.small,
  paddingVertical: spacing.smaller,
  borderRadius: spacing.large,
} as ViewStyle;
export const data: ITab[] = [
  {
    id: 1,
    title: 'profile.notifications',
    icon: <ProfileIconTab />,
  },
  {
    id: 2,
    title: 'profile.favorite',
    icon: <ProfileIconTab />,
  },
  {
    id: 3,
    title: 'profile.about-app',
    icon: <ProfileIconTab />,
  },
  {
    id: 4,
    title: 'profile.currency',
    icon: <ProfileIconTab />,
    RightIcon: ({text}) => {
      return (
        <View style={currencyContainer}>
          <Text variant="smallBold" text={text} />
        </View>
      );
    },
  },
  {
    id: 5,
    title: 'profile.language',
    icon: <ProfileIconTab />,
    RightIcon: () => <></>,
  },
  {
    id: 6,
    title: 'profile.need-help',
    icon: <ProfileIconTab />,
    bottomSection: <></>,
  },
];
