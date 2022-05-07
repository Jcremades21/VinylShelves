import React, { useState, useRef, useEffect, useContext } from 'react'
import { TouchableOpacity, FlatList, StyleSheet, View, MsgBox, Text, SafeAreaView, ScrollView, Image } from 'react-native'
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
import { theme } from '../core/theme'
import axios from 'axios';
import { Url, usuemail } from '../global'
import AppLoading from 'expo-app-loading';
import {decode as atob, encode as btoa} from 'base-64';
import Loading from '../components/Loading';
import SpotifyWebApi from "spotify-web-api-node";


import {
    useFonts,
    Raleway_300Light,
    Raleway_400Regular,
    Raleway_700Bold,
    Raleway_300Light_Italic,
    Raleway_400Regular_Italic,
  } from '@expo-google-fonts/raleway';

export default function Landing({ navigation }) {
  const [ourfavs, setOurFavs] = useState([]);  
  const [isLoading, setIsLoading] = React.useState(true);
  const [pops, setPops] = useState([]);
  const [news, setNews] = useState([]);
  const [token, setToken] = useState('');  
  const [reviews, setReviews] = useState([]);   
  const [popusers, setUsers] = useState([]);   

  const spotify = Credentials();  
  //insfav();
      
  //llamada API 
  const favsfromapi = [];  
  const newsfromapi = [];
  const popsfromapi = [];


  //llamada album favs
  let [fontsLoaded] = useFonts({
    Raleway_400Regular,
    Raleway_700Bold,
    });
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
        spotifyApi.setAccessToken(tokenResponse.data.access_token);
  
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
        const InsertaPops = () => {
        spotifyApi.setAccessToken(token);  
        spotifyApi.getAlbums(['4SZko61aMnmgvNhfhgTuD3', '2ODvWsOgouMbaA5xf0RkJe','6trNtQUgC8cgbWcqoMYkOR','5lKlFlReHOLShQKyRv6AL9','0S0KGZnfBGSIssfF54WSJh','2Ti79nwTsont5ZHfdxIzAm','0ETFjACtuP2ADo6LFhL6HN']).then(
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
              popsfromapi.push(object);
             });
             setPops(popsfromapi);
            },
            function(err) {
              console.error(err);
            }
          );
        }
        InsertaPops();
        InsertaFavs();
    }, [spotify.ClientId, spotify.ClientSecret]); 

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

    React.useEffect(() => {
      let array = [];
      let url = Url + "/usuarios";
      axios.get(url,
          {
              headers: { 'Content-Type': 'application/json',
              'x-token' : token },
              withCredentials: true
          }
      ).then((res) => {
        let array = [];
        res.data.usuarios.forEach( (element) => {
          array.push(element);
        });
        array.sort((a, b) => a.seguidores.length > b.seguidores.length ? 1 : -1)
        setUsers(array.slice(0, 6))
      })
      .catch((error) => {
        console.error(error)
      });
    }, []); 

  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);
   if (isLoading && !fontsLoaded) {
    return <Loading />;
  }
  return (
    <ScrollView>
      <View style={styles.Fondo}>
      <View style={styles.encabezado}>
      <PageHeader>Home</PageHeader>
      <Paragraph>
       <Text style={styles.welcome}>Seems like you are not logged yet, you can <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
       <Text style={styles.link}>log in here!</Text></TouchableOpacity></Text>
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
        {ourfavs ?<CustomSlider navigation={navigation} data={ourfavs} />:null}
      </View>
      <LinearGradient
      // Button Linear Gradient
      colors={['#5F1880', '#713b8c', '#392F36']}
      style={styles.Banner}
      >      
        <Text style={styles.Divtext}>Popular albums</Text>
      </LinearGradient>
      <View>
      { pops ? <CustomSlider navigation={navigation} data={pops} />:null}
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
      { popusers ?
            <><FlatList
                            data={popusers}
                            renderItem={({ item }) => (
                                <><View style={{ flex: 1, flexDirection: 'column', margin: 1, alignItems: 'center', marginBottom: 5 }}>
                                    <TouchableOpacity onPress={() => navigation.navigate('UserScreen', { id: item.uid })}>
                                        <View style={styles.infoDiv}>
                                            <Image source={{ uri: item.imagen }} style={styles.image2} />
                                            <Text numberOfLines={1} style={styles.itemText}>{item.username}</Text>
                                            <View>
                                                <Paragraph><Text style={styles.itemText2}>{item.reviews.length}</Text><Text style={styles.itemText3}> reviews </Text><Text style={styles.itemText2}>{item.user_lists.length+item.list_liked.length}</Text><Text style={styles.itemText3}> lists</Text></Paragraph>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View></>
                            )}
                            numColumns={2}
                            keyExtractor={(item, index) => index} /></>
            :null}
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
  itemText: {
    color: theme.colors.text,
    fontFamily:'Raleway_700Bold',
    fontSize: 18,
    marginTop: 5,
  },
  itemText2: {
    color: theme.colors.text,
    paddingHorizontal: 10,
    fontFamily:'Raleway_400Regular',
    fontSize: 17,
    width: 185
  },
  image2: {
    width: 100,
    height: 100,
    alignItems:'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 5,
  },
  encabezado:{
    alignItems: 'center',
    width: '75%',
    alignSelf: 'center',
    marginTop: 30,
    fontFamily:'Raleway_400Regular' 
  },
  infoDiv:{
    paddingVertical: 7,
    paddingHorizontal: 10,
    alignItems: 'center'
  },
  itemText3: {
    color: theme.colors.secondary,
    paddingHorizontal: 10,
    fontFamily:'Raleway_400Regular',
    fontSize: 17,
    textAlign: 'center',
    marginTop: 10,
    width: 190
  },
  link:{
    fontFamily: 'Raleway_700Bold',
    color: theme.colors.secondary,
    marginTop: 5,
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
