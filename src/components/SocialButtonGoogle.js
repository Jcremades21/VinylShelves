import React from 'react'
import Radium from 'radium';
import color from 'color';

import { Image, View, Text, StyleSheet, TouchableOpacity  } from 'react-native'
import { Button as PaperButton } from 'react-native-paper'
import { theme } from '../core/theme'

export default function Button({ mode, style, ...props }) {
  return (
    <TouchableOpacity style={styles.FacebookStyle} activeOpacity={0.5}>
    <Image
     source={require('../assets/googleic.png')}
     style={styles.ImageIconStyle}
    />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  FacebookStyle:{
    borderWidth:1,
    borderColor:'rgba(0,0,0,0.1)',
    backgroundColor: '#473d44',
    padding:3,
    width: 40,
    height: 40
  },
  ImageIconStyle:{
    width: 35,
    height: 35,
  }
})
