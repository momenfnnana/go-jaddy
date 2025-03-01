const white = '#FFFFFF';
const simiWhite = '#F3FBFF';
const simiWhite2 = '#F8F8F8';
const black = '#000000';
const tabsColor = '#121212';
const reloadColor = '#DEDEDE';
const arrowColor = '#747474';
const arrowBackgroundColor = '#0000000A';
const arrowBackgroundColor2 = '#2929297F';
const grayMain = '#C4C4C4';
const grayMainBolder = '#C8C8C8';
const inactiveStar = '#C7C7CC';
const languagesSwitchText = '#1313137F';
const modalDescriptionColor = '#262626';
const storesImageBorder = '#7474743D';
const aboutTheAppBorder = '#E1E5EB';

const primaryPalette = {
  primary: '#0232EB', // Main
  primaryLight1: '#FF8863',
  primaryLight2: '#FFC19E',
  primaryLight3: '#F2DE91',
  primaryBackground: '#FFE6D6',
};

const secondaryPalette = {
  secondary: '#FF6701', // Main
  secondaryLight1: '#17505C',
  secondaryLight2: '#A4C1C8',
  secondaryLight3: '#D1E0E3',
  secondaryBackground: '#EDF3F4',
  secondaryBackground2: '#F5F5F5',
  secondaryBackground3: '#0232EB1A',
};

const redPalette = {
  red: '#EF4444', // Main
  redLight: '#FEE2E2',
  redDark: '#B91C1C',
};
const yellowPalette = {
  yellow: '#F2A60D', // Main
  yellowLight: '#FDF7EB',
  yellowDark: '#C2850A',
};

const orangePalette = {
  orange: '#FF6701',
  orangeDark: '#F83838',
};

const greenPalette = {
  green: '#087F23', // Main
  green2: '#00C851',
  greenLight: '#E7F3E7',
  greenSimiLight: '#B5B5B5',
  greenDark: '#005005',
  greenSecondary: '#B6B7B7',
  greenSecondary2: '#a3a3a3',
};
const brouwnPalette = {
  brouwn: '#9F9F9F', // Main
  brouwnLight: '#747474',
  greenDark: '#005005',
};

const bluePalette = {
  blue: '#0232EB', // Main
  blueLight: '#E9F4FF',
  blueDark: '#005CB2',
};

const gray = {
  50: '#F9FAFB',
  100: '#F3F4F6',
  200: '#E5E7EB',
  300: '#D1D5DB',
  400: '#9CA3AF',
  500: '#6B7280',
  600: '#4B5563',
  700: '#374151',
  800: '#1F2937',
  900: '#111827',
  1000: '#7474741A',
};

const statusPalette = {
  danger: redPalette.red,
  success: greenPalette.green,
  success2: '#2CDCCA',
  warning: yellowPalette.yellow,
  info: bluePalette.blue,
};
export type ColorStatus = keyof typeof statusPalette;

export const colors = {
  white,
  simiWhite,
  simiWhite2,
  transparentWhite: 'rgba(255, 255, 255, 0.2)',
  transparent: 'rgba(0, 0, 0, 0)',
  backdrop: 'rgba(0, 0, 0, 0.4)',
  ...primaryPalette,
  ...secondaryPalette,
  gray,
  ...redPalette,
  ...greenPalette,
  ...yellowPalette,
  ...bluePalette,
  ...brouwnPalette,
  ...orangePalette,

  text: gray[800], // Default text color
  input: gray[800], // Input text color
  border: gray[200], // Default border color
  background: white, // Screen background color
  disabledText: gray[500], // Disabled button background color
  disabledBackground: gray[200], // Disabled button background color

  // Status colors
  ...statusPalette,
  tabsColor,
  reloadColor,
  arrowColor,
  arrowBackgroundColor,
  arrowBackgroundColor2,
  black,
  grayMain,
  grayMainBolder,
  inactiveStar,
  languagesSwitchText,
  modalDescriptionColor,
  storesImageBorder,
  aboutTheAppBorder,
};

export type ColorsTypes = keyof typeof colors;
