import React from 'react'
import { TouchableOpacity, StyleSheet, View, MsgBox, Text  } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import PageHeader from '../components/PageHeader'
import Paragraph from '../components/Paragraph'
import Button from '../components/Button'
import storage from '.'
import { theme } from '../core/theme'
import {
  useFonts,
  Raleway_300Light,
  Raleway_400Regular,
  Raleway_700Bold,
  Raleway_300Light_Italic,
  Raleway_400Regular_Italic,
} from '@expo-google-fonts/raleway';

export default function Dashboard({ navigation }) {
  const username = 'User';
  let [fontsLoaded] = useFonts({
    Raleway_400Regular,
    Raleway_700Bold,
    });
    
  storage
  .load({
    key: 'loginState',
    autoSync: true,
    syncInBackground: true,
    syncParams: {
      extraFetchOptions: {
      },
      someFlag: true
    }
  })
  .then(ret => {
    // found data go to then()
    console.log(ret.useremail);
  })
  .catch(err => {
    // any exception including data not found
    // goes to catch()
    console.warn(err.message);
    switch (err.name) {
      case 'NotFoundError':
        // TODO;
        break;
      case 'ExpiredError':
        // TODO
        break;
    }
  });
  return (
      <View style={styles.Fondo}>
      <View style={styles.encabezado}>
      <PageHeader>Home</PageHeader>
      <Paragraph>
       <Text>Welcome back <TouchableOpacity onPress={() => navigation.replace('')}>
       <Text style={styles.link}>{username}</Text>
        </TouchableOpacity>, this is what we have for you today!</Text>
      </Paragraph>
      </View>
      <LinearGradient
      // Button Linear Gradient
      colors={['#5F1880', '#713b8c', '#392F36']}
      style={styles.Banner}
      >      
        <Text style={styles.Divtext}>Our favourite albums</Text>
      </LinearGradient>
      
      </View>
  )
}

const styles = StyleSheet.create({
  Fondo:{
    backgroundColor: '#392F36',
    height: '100%',
  },
  encabezado:{
    alignItems: 'center',
    width: '75%',
    alignSelf: 'center',
    marginTop: 30,
    fontFamily:'Raleway_400Regular' 
  },
  link:{
    fontFamily: 'Raleway_700Bold',
    color: theme.colors.secondary,
    fontSize: 15,
    padding: 0
  },
  Banner: {
    backgroundColor: '#fff',
    height: 60,
    marginTop: 10,
    alignItems: 'center'
  },
  Divtext:{
    fontSize: 17,
    marginTop: 16,
    color: theme.colors.text
  }
})
