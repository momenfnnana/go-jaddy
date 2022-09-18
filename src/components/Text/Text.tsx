import * as React from 'react';
import {useTranslation} from 'react-i18next';
import {
  Text as ReactNativeText,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import {colors, spacing, typography} from 'theme';
import {TextProps} from './Text.props';

export default function Text(props: TextProps) {
  const {t} = useTranslation();
  // grab the props
  const {
    variant = 'mediumRegular',
    tx,
    center,
    txOptions,
    text,
    children,
    style: styleOverride,
    containerStyle,
    touchable,
    top,
    bottom,
    left,
    right,
    underline,
    ...rest
  } = props;
  let {color = colors.text} = props;

  // figure out which content to use
  const i18nText = tx && t(tx, txOptions);
  const content = i18nText || text || children;

  const customStyle: TextStyle = {
    marginTop: top ? spacing[top] : undefined,
    marginBottom: bottom ? spacing[bottom] : undefined,
    marginLeft: left ? spacing[left] : undefined,
    marginRight: right ? spacing[right] : undefined,
    textAlign: center ? 'center' : 'left',
    textDecorationLine: underline ? 'underline' : 'none',
  };
  if (color) {
    customStyle.color = color;
  }

  const style = [typography[variant], customStyle, styleOverride];

  if (touchable) {
    return (
      <TouchableOpacity onPress={props.onPress} style={containerStyle}>
        <ReactNativeText {...rest} onPress={undefined} style={style}>
          {content}
        </ReactNativeText>
      </TouchableOpacity>
    );
  }
  return (
    <ReactNativeText {...rest} style={style}>
      {content}
    </ReactNativeText>
  );
}
