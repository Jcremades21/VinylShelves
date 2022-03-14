import React, { useState, useRef, useEffect, useContext } from 'react'
import { TouchableOpacity, StyleSheet, View, MsgBox, Text, SafeAreaView   } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import { Credentials } from '../helpers/credentials';
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import PageHeader from '../components/PageHeader'
import Paragraph from '../components/Paragraph'
import CustomSlider from '../components/Carrousel'
import Button from '../components/Button'
import storage from '.'
import { ParallaxImage } from 'react-native-snap-carousel';
import { theme } from '../core/theme'
import axios from 'axios';
import {decode as atob, encode as btoa} from 'base-64'
import { Url, usuemail } from '../global'
import AppLoading from 'expo-app-loading';

export default function Dashboard({ navigation }) {
  const [ourfavs, setOurFavs] = useState('');  
  const [usuemail, setUsuemail] = useState('');
  const [usutoken, setUsutoken] = useState('');
  const [usunombre, setUsunombre] = useState('');
  const [isLoading, setIsLoading] = React.useState(true);

  const spotify = Credentials();  
  //insfav();
      
  //llamada API 
  const favsfromapi = [];
  
  const llamadafavs = async () => {
    let url = Url + "/albumes"
    await axios(url, {
      headers: {
        'Content-Type' : 'application/json',
      },
      method: 'GET'
    })
    .then(res => {     
            //console.log(res.data.albumes); 
            albumfavs = res.data.albumes;
    });
    return albumfavs;
  }
  ;(async () => {
  albumfavs = await llamadafavs();
    albumfavs.forEach( (element2) => {
      const object = {
      title: element2.nombre,
      artist: element2.artista,
      source: element2.imagen
      }
    favsfromapi.push(object);
   });
    setOurFavs(favsfromapi);
  })()


    // cargamos local storage
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
    //console.log(ret.useremail);
      let url = Url + "/usuarios?id=" + ret.uid;
      axios(url, {
        headers: {
          'Content-Type' : 'application/json'
        },
        method: 'GET'
      })
      .then(res => {     

      //setUsunombre(res.data.usuarios.username);

            });
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
 
    
  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);
   if (isLoading) {
    return <AppLoading />;
  }
  
  return (
      <View style={styles.Fondo}>
      <View style={styles.encabezado}>
      <PageHeader>Home</PageHeader>
      <Paragraph>
       <Text>Welcome back<TouchableOpacity onPress={() => navigation.replace('')}>
       <Text style={styles.link}>{usunombre}</Text>
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
      <View>
        <CustomSlider data={ourfavs} />
      </View>
      
      </View>
  )
}

const styles = StyleSheet.create({
  Fondo:{
    backgroundColor: '#392F36',
    height: '100%',
    fontFamily: 'Raleway_400Regular'
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
