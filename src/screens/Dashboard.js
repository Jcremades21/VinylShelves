import React, { useState, useRef, useEffect, useContext } from 'react'
import { TouchableOpacity, StyleSheet, View, MsgBox, Text, SafeAreaView, ScrollView  } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import { Credentials } from '../helpers/credentials';
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import PageHeader from '../components/PageHeader'
import Paragraph from '../components/Paragraph'
import CustomSlider from '../components/Carrousel'
import CustomSlider2 from '../components/CarrouselReviews'
import Button from '../components/Button'
import storage from '.'
import { ParallaxImage } from 'react-native-snap-carousel';
import { theme } from '../core/theme'
import axios from 'axios';
import {decode as atob, encode as btoa} from 'base-64'
import { Url, usuemail } from '../global'
import AppLoading from 'expo-app-loading';
import SpotifyWebApi from "spotify-web-api-node";
import {
  useFonts,
  Raleway_300Light,
  Raleway_400Regular,
  Raleway_700Bold,
  Raleway_300Light_Italic,
  Raleway_400Regular_Italic,
} from '@expo-google-fonts/raleway';

export default function Dashboard({ navigation }) {
  const [ourfavs, setOurFavs] = useState([]); 
  const [reviews, setReviews] = useState([]);   
  const [usuemail, setUsuemail] = useState('');
  const [usutoken, setUsutoken] = useState('');
  const [usunombre, setUsunombre] = useState('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [news, setNews] = useState([]);
  const [token, setToken] = useState('');  

  const spotify = Credentials();  
  //insfav();
  let [fontsLoaded] = useFonts({
    Raleway_400Regular,
    Raleway_700Bold,
    });
  //llamada API 
  const favsfromapi = [];
  const newsfromapi = [];

  var spotifyApi = new SpotifyWebApi({
    clientId: 'd25870205635429285732c34594b8249',
    clientSecret: '508413bf4ea24a26ad44b70d831ae2bc'
  });


  React.useEffect(() => {

    axios('https://accounts.spotify.com/api/token', {
      headers: {
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Authorization' : 'Basic ' + btoa(spotify.ClientId + ':' + spotify.ClientSecret)      
      },
      data: 'grant_type=client_credentials',
      method: 'POST'
    })
    .then(tokenResponse => {      
      setToken(tokenResponse.data.access_token);
      spotifyApi.setAccessToken(token);

      axios('https://api.spotify.com/v1/browse/new-releases?limit=10', {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + tokenResponse.data.access_token}
      })
      .then (albumResponse => {        
        //console.log(albumResponse.data.albums.items[0].name);
        albumResponse.data.albums.items.forEach( (element2) => {
          let spliuri = element2.uri.split(':');
          let alid = spliuri[2];
          const object = {
          id: alid,
          title: element2.name,
          artist: element2.artists[0].name,
          source: element2.images[0].url
          }
        newsfromapi.push(object);
       });
       
       setNews(newsfromapi);
      });
      console.log(newsfromapi);
      
    });
    const InsertaFavs = () => {
      spotifyApi.setAccessToken(token);  
      spotifyApi.getAlbums(['4KjbNbnTnJ97kZgQkOHr6v', '5LEXck3kfixFaA3CqVE7bC','6X1x82kppWZmDzlXXK3y3q','6SBkXTPlJ3oEaFwRm5o2lD','3hhDpPtCFuQbppwYgsVhMO','6c94J2yum9wHxmbSB27YXE','7D2NdGvBHIavgLhmcwhluK']).then(
        function(albumResponse) {
            albumResponse.body.albums.forEach( (element2) => {
              let spliuri = element2.uri.split(':');
              let alid = spliuri[2];
              const object = {
              id: alid,
              title: element2.name,
              artist: element2.artists[0].name,
              source: element2.images[0].url
              }
            favsfromapi.push(object);
           });
           setOurFavs(favsfromapi);
          },
          function(err) {
            console.error(err);
          }
        );
      }
      InsertaFavs();
  }, [spotify.ClientId, spotify.ClientSecret]); 


    // cargamos local storage
  React.useEffect(() => {
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
      setUsutoken(res.data.token)
      setUsunombre(res.data.usuarios.username);
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
  }, []); 

   React.useEffect(() => {
    let array = [];
    let url = Url + "/reviews";
    axios.get(url,
        {
            headers: { 'Content-Type': 'application/json',
            'x-token' : token },
            withCredentials: true
        }
    ).then((res) => {
      spotifyApi.setAccessToken(token);  
      res.data.reviews.forEach( (element) => {
      
      spotifyApi.getAlbum(element.album).then(
        function(albumResponse) {
            const data = {
              id: element.uid,
              albumimg: albumResponse.body.images[0].url,
              albumname: albumResponse.body.name,
              albumartist: albumResponse.body.artists[0].name,
              usuimg: element.usuario.imagen,
              titulo: element.titulo,
              texto: element.texto,
              likes: element.likes.length,
              comments: element.comentarios.length,
              val: '5',
            }
            array.push(data);
            console.log(albumResponse.body.images[0].url);
          },
          function(err) {
            console.error(err);
          }
        );
      });
    })
    .catch((error) => {
      console.error(error)
    });
    setReviews(array); 
  }, []); 


  if (isLoading && !fontsLoaded) {
    return <AppLoading />;
  }
  
  return (
    <ScrollView>
      <View style={styles.Fondo}>
      <View style={styles.encabezado}>
      <PageHeader>Home</PageHeader>
      <Paragraph>
       <Text style={styles.welcome}>Welcome back {usunombre ?<TouchableOpacity onPress={() => navigation.navigate('Profile')}>
       <Text style={styles.link}>{usunombre} </Text></TouchableOpacity>: null} </Text>
       <Text style={styles.welcome}> this is what we have for you today!</Text>
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
        <CustomSlider navigation={navigation} data={ourfavs} />
      </View>
      <LinearGradient
      // Button Linear Gradient
      colors={['#5F1880', '#713b8c', '#392F36']}
      style={styles.Banner}
      >      
        <Text style={styles.Divtext}>New from friends</Text>
      </LinearGradient>
      <View>
      </View>
      <View>
      </View>
      <LinearGradient
      // Button Linear Gradient
      colors={['#5F1880', '#713b8c', '#392F36']}
      style={styles.Banner}
      >      
        <Text style={styles.Divtext}>New Releases</Text>
      </LinearGradient> 
      <View>
      <CustomSlider navigation={navigation} data={news} />
      </View>
      <LinearGradient
      // Button Linear Gradient
      colors={['#5F1880', '#713b8c', '#392F36']}
      style={styles.Banner}
      >      
        <Text style={styles.Divtext}>Popular reviews</Text>
      </LinearGradient> 
      <View>
      { reviews ? <CustomSlider2 navigation={navigation} data={reviews} />:null}
      </View>
      <LinearGradient
      // Button Linear Gradient
      colors={['#5F1880', '#713b8c', '#392F36']}
      style={styles.Banner}
      >      
        <Text style={styles.Divtext}>Popular Users</Text>
      </LinearGradient> 
      <View>
      </View>
      </View>
    </ScrollView>
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
    color: theme.colors.text,
    fontFamily:'Raleway_400Regular' 
  },
  welcome:{
    fontSize: 15,
    marginTop: 16,
    color: theme.colors.text,
    fontFamily:'Raleway_400Regular' 
  }
})
