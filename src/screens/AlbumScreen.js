import React, { useState, useRef, useEffect, useContext } from 'react'
import { Alert, TouchableOpacity, StyleSheet, View, Modal, MsgBox, Text, SafeAreaView, ScrollView, Image } from 'react-native'
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
import { theme } from '../core/theme'
import axios from 'axios';
import { Url, usuemail } from '../global'
import AppLoading from 'expo-app-loading';
import {decode as atob, encode as btoa} from 'base-64';
import SpotifyWebApi from "spotify-web-api-node";
import SocialButtonFacebook from '../components/SocialButtonFacebook'
import SocialButtonTwitter from '../components/SocialButtonTwitter'
import ClipboardButton from '../components/ClipboardButton'
import BackButton from '../components/BackButton'
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons'; 
import { FontAwesome } from '@expo/vector-icons'; 
import { Audio } from 'expo-av'
import { Rating, AirbnbRating } from 'react-native-ratings';
import { AntDesign } from '@expo/vector-icons'; 
import Icon from "react-native-animated-icons"


import {
    useFonts,
    Raleway_300Light,
    Raleway_400Regular,
    Raleway_700Bold,
    Raleway_300Light_Italic,
    Raleway_400Regular_Italic,
  } from '@expo-google-fonts/raleway';

export default function AlbumScreen({ navigation, route }) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [token, setToken] = useState('');  
  const [album, setAlbum] = useState('');  
  const [news, setNews] = useState([]);
  const [fecha, setFecha] = useState('');  
  const [audioTracks, setAudioTracks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [sound, setSound] = React.useState();
  const [audioStatus, setAudioStatus] = useState(true)

  const { id } = route.params;

    
  const spotify = Credentials();  
  //insfav();
      
  //llamada API 
  const favsfromapi = [];  
  const newsfromapi = [];


  //llamada album favs
  let [fontsLoaded] = useFonts({
    Raleway_400Regular,
    Raleway_700Bold,
    });

  var spotifyApi = new SpotifyWebApi({
        clientId: 'd25870205635429285732c34594b8249',
        clientSecret: '508413bf4ea24a26ad44b70d831ae2bc'
      });

    async function playSound(item) {
      let url = '';
        for (var i = 0; i < audioTracks.length; i++) {
          if(item == audioTracks[i].name){
            url = audioTracks[i].preview_url;
          }
        }
        console.log('Loading Sound');
        console.log('url: ' + url);
        setAudioStatus(!audioStatus)
        const { sound } = await Audio.Sound.createAsync(
          { uri: url },
          { shouldPlay: true }     
       );
        setSound(sound);
        if (audioStatus) {
        console.log('Playing Sound');
        await sound.playAsync(); 
        }

        else{
          await sound.stopAsync()
          await sound.unloadAsync()
        }
      
      }
    
      React.useEffect(() => {
        return sound
          ? () => {
              console.log('Unloading Sound');
              sound.unloadAsync(); }
          : undefined;
      }, [sound]);


    React.useEffect(() => {
      const getData = async () =>{
      await axios('https://accounts.spotify.com/api/token', {
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
        axios('https://api.spotify.com/v1/albums/' + id, {
          method: 'GET',
          headers: { 'Authorization' : 'Bearer ' + tokenResponse.data.access_token}
        })
        .then (albumResponse => {        
         console.log(albumResponse.data.tracks.items[0].preview_url);
         setAlbum(albumResponse.data);
         setAudioTracks(albumResponse.data.tracks.items);
         if(albumResponse.data.release_date_precision!='year'){
           let split = albumResponse.data.release_date.split('-');
           setFecha(split[0]);
         }
         });

      });}
      getData();
    }, [spotify.ClientId, spotify.ClientSecret]); 

    function clickTracklist(){
      setModalVisible(true);
    }
    function renderTracks() {
      if(audioTracks){
      return album.tracks.items.map((item) => (
        <View style={styles.trackDiv}><Text style={[
          { fontFamily:'Raleway_400Regular',
           paddingVertical: 4,
           marginLeft: 11,
           color: theme.colors.text,
           fontSize: 17
          }
         ]}>{item.track_number}. {item.name}</Text>{item.preview_url ?<TouchableOpacity onPress={() => playSound(item.name)} style={styles.iconPlay}>{audioStatus?<AntDesign name="playcircleo" size={24} color="white" />:<Ionicons name="md-stop-circle-outline" size={24} color="white" />}</TouchableOpacity>:null  }</View>
     )) 
    }}
    if (!fontsLoaded) {
    return <AppLoading />
  }

  var modalBackgroundStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  };

  return (
    
      <View style={styles.Fondo}>
        <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={[styles.centeredView,modalBackgroundStyle]}>
        <ScrollView>
          <View><LinearGradient
          colors={['#5F1880', '#710067']}
          style={styles.modalView}
          ><Paragraph>     
           {album ?<Text style={[
          { fontFamily:'Raleway_700Bold',
           paddingVertical: 4,
           color: theme.colors.text,
           fontSize: 21
          }
         ]}>{album.name} </Text>:null  }
         <Text style={[
          { fontFamily:'Raleway_400Regular',
           paddingVertical: 4,
           color: theme.colors.text,
           fontSize: 21
          }
         ]}>tracklist:</Text></Paragraph> 

           {album ?<View>{renderTracks()}</View>:null }
          </LinearGradient>
          </View>
          </ScrollView>
        </View>
      </Modal>
      <BackButton goBack={navigation.goBack} />
      <View style={styles.encabezado}>
      <PageHeader>Album details</PageHeader>
      </View>
      <View style={styles.TopBanner}>
      <View style={styles.Info}>
      {album ? <Image source={{ uri: album.images[0].url }} style={styles.image}  />:null } 
      <Text style={styles.Infoname}>{album.name}</Text>
      {album ? <Text style={styles.Infoart}>{album.artists[0].name}</Text>:null } 
      <Text style={styles.Infoart}>{fecha}</Text>
      <Paragraph style={styles.Infoval}>
      <FontAwesome name="star" size={24} color="#FFCF26" /><Text style={styles.Infoval}> </Text><Text style={styles.Infoval}>4.5/5</Text>
      </Paragraph>
      <Text style={styles.Infogenero}>Average rating</Text>
      </View>
      <View style={styles.rateandtrackdiv}>
      <View style={styles.RateDiv}>
      <Text style={[
       { fontFamily:'Raleway_400Regular',
        marginTop: 5,
        color: theme.colors.text,
        textAlign:'center' }
      ]}>Rate this album</Text>
      <Rating
          type="custom"
          ratingColor="#D90FC8"
          tintColor="#444444"
          startingValue={5}
          ratingCount={5}
          imageSize={26}
          style={{ paddingVertical: 2, marginBottom: 8}}
        />
      <Button style={styles.buttonRev}> <Text style={[
       { fontFamily:'Raleway_400Regular',lineHeight: 19,
      color: theme.colors.text }
      ]}>Review</Text></Button>
      <Button style={styles.buttonRev}> <Text style={[
       { fontFamily:'Raleway_400Regular',    
       fontSize: 9, lineHeight: 19,
      color: theme.colors.text }
      ]}>Add to a List</Text></Button>
      <View style={styles.shareDiv}>
        <ClipboardButton style={styles.share}></ClipboardButton>
        <SocialButtonFacebook style={styles.share}></SocialButtonFacebook>
        <SocialButtonTwitter style={styles.share}></SocialButtonTwitter>
      </View>
      </View>
      <View style={styles.TrackListDiv}>
      <Button style={styles.buttonTrack} onPress={() => clickTracklist()}> <Text style={[
       { fontFamily:'Raleway_400Regular',
      color: theme.colors.text }
      ]}>Tracklist</Text></Button>
      </View>
      </View>
      </View>
      <LinearGradient
      colors={['#5F1880', '#713b8c', '#392F36']}
      style={styles.Banner}
      >      
      <Text style={styles.Divtext}>Reviews From Friends</Text>
      </LinearGradient>
      <LinearGradient
      // Button Linear Gradient
      colors={['#5F1880', '#713b8c', '#392F36']}
      style={styles.Banner}
      >      
        <Text style={styles.Divtext}>Popular Reviews</Text>
      </LinearGradient>
  <View>
  </View>
      </View>
  )
  
}

const styles = StyleSheet.create({
  iconPlay:{
    padding: 5
  },
  trackDiv:{
    backgroundColor: '#636363',
    marginBottom: 3,
    marginTop: 6,
    flexDirection: 'row',
    justifyContent:'space-between',

  },
  centeredView:{
    height: '100%'
  },
  rating:{
    marginTop: 3,
    marginBottom: 8
  },  
  buttonTrack:{
    alignSelf: 'center',
    backgroundColor: '#636363',
    width: 140,
    marginTop: 20
  },
  buttonRev:{
    alignSelf: 'center',
    backgroundColor: theme.colors.primary,
    width: 120,
    marginTop: 1
  },
  rateandtrackdiv:{
    width: '40%'
  },
  Fondo:{
    backgroundColor: '#392F36',
    height: '100%',
    fontFamily: 'Raleway_400Regular'
  },
  TopBanner:{
    flexDirection: 'row',
    marginTop: 4,
  },
  TrackListDiv: {
    width: '100%'
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
    marginTop: 15,
    fontSize: 15,
  },
  Banner: {
    backgroundColor: '#fff',
    height: 60,
    marginTop: 10,
    alignItems: 'center'
  },
  image: {
    width: 140,
    height: 140,
    marginTop: 25,
    marginBottom: 1,
    marginLeft: 0,
    alignItems:'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10
  },
  Divtext:{
    fontSize: 17,
    marginTop: 16,
    color: theme.colors.text,
    fontFamily:'Raleway_400Regular' 
  },
  Info:{
    alignItems: 'center',
    width:'55%'
  },
  Infoname:{
    fontSize: 16,
    marginTop: 6,
    width: '70%',
    textAlign: 'center',
    color: theme.colors.text,
    fontFamily: 'Raleway_700Bold',
  },
  Infoart:{
    fontSize: 16,
    marginTop: 4,
    color: theme.colors.text,
    fontFamily:'Raleway_400Regular' 
  },
  Infoval:{
    fontSize: 20,
    marginTop: 15,
    color: theme.colors.text,
    fontFamily:'Raleway_400Regular' 
  },
  Infogenero:{
    fontSize: 16,
    marginBottom: 15,
    color: theme.colors.text,
    fontFamily:'Raleway_400Regular' 
  },
  RateDiv:{
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: '#444444',
    borderRadius: 10,
    height: 220,
    width: '100%',
    marginTop: 25,
  },
  shareDiv:{
    width: '100%',
    flexDirection: 'row',
    marginTop: 1,
    justifyContent:'space-between',
    marginBottom: 24,
  },
  modalView: {
    top: '5%',
    margin: 20,
    marginBottom: 100,
    backgroundColor: "#444444",
    borderRadius: 20,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,
    elevation: 24
  },
  modalText: {
    fontFamily: 'Raleway_400Regular',
    fontSize: 21,
    color: theme.colors.text
  }
})
