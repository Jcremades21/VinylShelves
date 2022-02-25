import React from 'react'
import Radium from 'radium';
import color from 'color';

import { StyleSheet } from 'react-native'
import { Button as PaperButton } from 'react-native-paper'
import { theme } from '../core/theme'

export default function Button({ mode, style, ...props }) {
  return (
    <PaperButton
      style={[
        styles.button,
        mode === 'outlined' && { backgroundColor: theme.colors.surface },
        style,
      ]}
      labelStyle={styles.text}
      mode={mode}
      {...props}
    />
  )
}

const styles = StyleSheet.create({
  button: {
    width: '40%',
    marginVertical: 10,
    paddingVertical: 2,
    backgroundColor: '#7e22a8',
    alignSelf: 'flex-end',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.4)',
  },
  text: {
    fontFamily: 'Raleway_400Regular',
    fontSize: 15,
    lineHeight: 26,
  },
})
