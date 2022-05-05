import React, { useState, useRef, useEffect, useContext } from 'react'
import axios from 'axios';
import { Alert, Pressable, Modal, View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import { theme } from '../core/theme'

export default function Loading() {
  return (
    <Background>
      <View style={styles.Banner}>
      <Logo />
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  bottomdiv:{
    marginTop: 10
  },
  Banner:{
    alignItems: 'center'
  },
  desc:{
    width: 255,
    color: 'rgba(255, 255, 255, 0.75)',
    marginLeft: 10,
    fontFamily: 'Raleway_400Regular'
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
    justifyContent:'space-between'
  },
  link: {
    fontFamily: 'Raleway_700Bold',
    color: theme.colors.secondary,
    fontSize: 18
  },
  text: {
    color: theme.colors.text,
    fontFamily: 'Raleway_400Regular'
  },
  account:{
    fontFamily: 'Raleway_400Regular',
    fontSize: 16
  },
  modalView: {
    top: '50%',
    margin: 20,
    backgroundColor: "#444444",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,
    
    elevation: 24,
  },
  modalText: {
    fontFamily: 'Raleway_400Regular',
    fontSize: 21,
    textAlign: 'center'
  },
  buttonClose: {
    marginTop: 25,
    marginBottom: 0,
    alignSelf: 'center',
    width: 140
  }
})
