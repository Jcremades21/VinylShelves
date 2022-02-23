import React from 'react'
import { Image, StyleSheet } from 'react-native'

export default function Logo() {
  return <Image source={require('../assets/SVGtop.png')} style={styles.image} />

}

const styles = StyleSheet.create({
  image: {
    width: 600,
    height:'30%',
    marginTop: 20,
    marginBottom: 8,
    marginLeft: 100
  },
})
