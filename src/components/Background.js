import React from 'react'
import { ImageBackground, StyleSheet, KeyboardAvoidingView } from 'react-native'
import { theme } from '../core/theme'

export default function Background({ children }) {
  return (
    <ImageBackground
      source={require('../assets/image.png')}
      resizeMode="cover"
      style={styles.background}
    >
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        {children}
      </KeyboardAvoidingView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    backgroundColor: '#392F36'
  },
  container: {
    flex: 1,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    justifyContent: 'center',
  },
})
