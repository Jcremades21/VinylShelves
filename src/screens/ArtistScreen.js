import React, { useState, useRef, useEffect, useContext } from 'react'
import { Alert, FlatList, TouchableOpacity, StyleSheet, View, Modal, MsgBox, Text, SafeAreaView, ScrollView, Image } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import { Credentials } from '../helpers/credentials';
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import PageHeader from '../components/PageHeader'
import Paragraph from '../components/Paragraph'
import CustomSlider from '../components/Carrousel'
import CustomSlider2 from '../components/CarrouselReviews'
import CustomSlider4 from '../components/CarrousselArtist';
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
import { TextInput } from 'react-native-paper';
import TextInputE from '../components/TextInput';
import { showMessage, hideMessage } from "react-native-flash-message";
import FlashMessage from "react-native-flash-message";

import {
    useFonts,
    Raleway_300Light,
    Raleway_400Regular,
    Raleway_700Bold,
    Raleway_300Light_Italic,
    Raleway_400Regular_Italic,
  } from '@expo-google-fonts/raleway';

export default function ArtistScreen({ navigation, route }) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [load, setLoad] = React.useState(false);
  const [token, setToken] = useState(''); 
  const [usutoken, setusuToken] = useState('');   
  const [artist, setArtist] = useState('');  
  const [UID, setUsuUID] = useState('');  
  const [news, setNews] = useState([]);
  const [reviewspop, setReviewspop] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [related, setRelated] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalRVisible, setModalRVisible] = useState(false);
  const [sound, setSound] = React.useState();
  const [audioStatus, setAudioStatus] = useState(true)
  const [reviewTitle, setreviewTitle] = useState({ value: '', error: '' })
  const [reviewText, setreviewText] = useState({ value: '', error: '' })
  const [success, setSuccess] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const { id, refresh } = route.params;
    
  const spotify = Credentials();  
  //insfav();
      
  //llamada API 
  const favsfromapi = [];  
  const newsfromapi = [];


  //llamada album favs
  let [fontsLoaded] = useFonts({
    Raleway_400Regular,
    Raleway_700Bold,
    Raleway_400Regular_Italic
    });

  var spotifyApi = new SpotifyWebApi({
        clientId: 'd25870205635429285732c34594b8249',
        clientSecret: '508413bf4ea24a26ad44b70d831ae2bc'
      });

    
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
        axios('https://api.spotify.com/v1/artists/' + id, {
          method: 'GET',
          headers: { 'Authorization' : 'Bearer ' + tokenResponse.data.access_token}
        })
        .then (albumResponse => {        
         //console.log(albumResponse.data);
         setArtist(albumResponse.data);
            axios('https://api.spotify.com/v1/artists/' + id + '/albums?include_groups=album', {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + tokenResponse.data.access_token}
            })
            .then (albumResponse => {        
            //console.log(albumResponse.data.items);
            let arrayitems = [];
            albumResponse.data.items.map(item => {
                let esta = false;
                arrayitems.map(item2 => {
                    if(item.name == item2.name){
                        esta = true;
                    }
                });
                if(esta==false){
                    arrayitems.push(item);     
                }
            });
            setAlbums(arrayitems);
            });
            axios('https://api.spotify.com/v1/artists/' + id + '/related-artists', {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + tokenResponse.data.access_token}
            })
            .then (albumResponse2 => {        
            setRelated(albumResponse2.data.artists);
            });
         });

      });}
      getData();
    }, [spotify.ClientId, spotify.ClientSecret, refresh]); 

    function clickTracklist(){
      setModalVisible(true);
    }
    function clickReview(){
      setModalRVisible(true);
    }
    
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
        }).then(ret => {
          // found data go to then()
          //console.log(ret.useremail);  
          setUsuUID(ret.uid);
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
      let url = Url + "/reviews/?artist=" + id;
      console.log(url);
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
                albumimg: albumResponse.body.images[0].url,
                albumname: albumResponse.body.name,
                albumartist: albumResponse.body.artists[0].name,
                usuimg: element.usuario.imagen,
                titulo: element.titulo,
                texto: element.texto,
                likes: element.likes.length,
                comments: '0',
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
      setReviewspop(array); 
    }, [id]);

   
    if (!fontsLoaded) {
    return <AppLoading />
  }

  var modalBackgroundStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  };

  return (
      <View style={styles.Fondo}>
        <ScrollView>
        {/*<Modal
        animationType="fade"
        transparent={true}
        visible={modalRVisible}
        onRequestClose={() => {
          setModalRVisible(!modalRVisible);
        }}
      >
        <View style={[styles.centeredView,modalBackgroundStyle]}>
        <ScrollView>
          <View style={styles.modalView}>
            <View style={styles.reviewView}>
            <Text style={[
              { fontFamily:'Raleway_400Regular',
              color: theme.colors.text,
              fontSize: 15
              }
            ]}>Add a review of...</Text>
            <View style={styles.Info2}>
            <Text style={styles.Infoname}>{album.name}</Text>
            {album ? <Text style={styles.Infoart}>{album.artists[0].name}</Text>:null } 
            <Text style={styles.Infoart}>{fecha}</Text>
            </View>
            <Text style={[
              { fontFamily:'Raleway_400Regular',
              paddingVertical: 4,
              color: theme.colors.text,
              fontSize: 18
              }
            ]}>Title</Text>
            <TextInputE value={reviewTitle.value}
            onChangeText={(text) => setreviewTitle({ value: text, error: '' })}></TextInputE>
            <Text style={[
              { fontFamily:'Raleway_400Regular',
              paddingVertical: 4,
              color: theme.colors.text,
              fontSize: 18
              }
            ]}>Review</Text>
            <TextInput style={styles.input} multiline={true}
            numberOfLines={8} value={reviewText.value}
            onChangeText={(text) => setreviewText({ value: text, error: '' })}></TextInput>
            <Button
              mode="contained"
              onPress={onReviewPressed}
              >
                Save
              </Button>
            </View>
          </View>
        
          </ScrollView>
        </View>
      </Modal>
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
        </Modal>*/}
      <View style={styles.encabezado}>
      <BackButton goBack={navigation.goBack} />
      <PageHeader>Artist details</PageHeader>
      </View>
      <View style={styles.TopBanner}>
      <View style={styles.Infoimg}>
      {artist ? <Image source={{ uri: artist.images[0].url }} style={styles.image}  />:null } 
      </View>
      <View style={styles.Info}>
      <Text style={styles.Infoname}>{artist.name}</Text>
      <Paragraph style={styles.Infoval}>
      <FontAwesome name="star" size={24} color="#FFCF26" /><Text style={styles.Infoval}> </Text><Text style={styles.Infoval}>4.5/5</Text>
      </Paragraph>
        
        <Text style={styles.Infogenero}>Average rating</Text>
        <Text style={styles.Infostat}>Total ratings</Text>
        <Text style={styles.Infostat1}>0</Text>
        <Text style={styles.Infostat}>Total works</Text>
        {albums ? <Text style={styles.Infostat1}>{albums.length}</Text>:null}
        
        </View>
      <View style={styles.rateandtrackdiv}>
      
     

      </View>
      </View>
      <LinearGradient
      colors={['#5F1880', '#713b8c', '#392F36']}
      style={styles.Banner}
      >      
      <Text style={styles.Divtext}>Discography</Text>
      </LinearGradient>
      {albums ? <View style={styles.tracksDiv}>
        <FlatList
            data={albums}
            renderItem={({ item }) => (
                <><View style={{ flex: 1, flexDirection: 'column', margin: 1 , alignItems: 'center', marginBottom: 15}}>
                    <TouchableOpacity onPress={() => navigation.navigate('AlbumScreen', { id: item.id })}><Image style={styles.imagetrack} source={{ uri: item.images[0].url }}></Image></TouchableOpacity><Text style={[
                    { fontFamily:'Raleway_700Bold',
                     color: theme.colors.text,
                     fontSize: 11,
                     textAlign: 'center',
                     paddingVertical: 5 }
                   ]}>{item.name}</Text></View></>
                )}
                numColumns={3}
                keyExtractor={(item, index) => index}
            />
        </View>:null}
      <LinearGradient
      // Button Linear Gradient
      colors={['#5F1880', '#713b8c', '#392F36']}
      style={styles.Banner2}
      >      
        <Text style={styles.Divtext}>Popular Reviews</Text>
      </LinearGradient>
      {reviewspop.length > 0 && <View>
      { reviewspop ? <CustomSlider2 navigation={navigation} data={reviewspop} />:null}
      </View> }
      {reviewspop.length == 0 && <View>
        <Text style={[
              { fontFamily:'Raleway_400Regular',
              paddingVertical: 4,
              color: theme.colors.text,
              fontSize: 14,
              alignSelf: 'center'
              }
        ]}>Seems like there are no reviews yet...</Text>
      </View> }
      <LinearGradient
      // Button Linear Gradient
      colors={['#5F1880', '#713b8c', '#392F36']}
      style={styles.Banner}
      >      
      <Text style={styles.Divtext}>Related Artists</Text>
      </LinearGradient>
      <View style={[
              { marginBottom: 25
              }
        ]}>
        {related ? <CustomSlider4 navigation={navigation} data={related} load={refresh} />:null}
      </View>
  <View>
  </View>
  </ScrollView>
      </View>
  )
  
}

const styles = StyleSheet.create({
  input:{
    backgroundColor: 'rgba(248, 34, 34, 0.25)',
    color: theme.colors.text,
    fontSize: 15,
    borderWidth: 1,
    borderColor: 'rgba(217, 15, 200, 0.55)',
    borderRadius: 10,
    padding: 6,
    marginTop: 6,
    marginBottom: 16,
    fontFamily:'Raleway_400Regular'
  },
  iconPlay:{
    padding: 5
  },
  trackDiv:{
    backgroundColor: '#636363',
    marginBottom: 3,
    marginTop: 6,
    flexDirection: 'row',
    justifyContent:'space-between',
    borderRadius: 5
  },
  centeredView:{
    height: '100%'
  },
  imagetrack: {
    width: 85,
    height: 85,
    marginBottom: 1,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
  },
  tracksDiv:{
    justifyContent: 'center',
    flex: 1,
    marginTop: 5
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
    paddingHorizontal: 30,
    marginBottom: 15
  },
  TrackListDiv: {
    width: '100%'
    },
    encabezado:{
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',   
      marginTop: 30,
      fontFamily:'Raleway_400Regular',
      justifyContent: 'center'
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
  Banner2: {
    backgroundColor: '#fff',
    height: 60,
    marginTop: 0,
    alignItems: 'center'
  },
  image: {
    width: 140,
    height: 140,
    marginTop: 10,
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
  Divtext2:{
    fontSize: 17,
    marginTop: 11,
    color: theme.colors.text,
    fontFamily:'Raleway_400Regular' 
  },
  Info:{
    alignItems: 'center',
    width:'65%',
  },
  Infoimg:{
    alignItems: 'center',
    width:'40%',
    marginLeft: 10
  },
  Info2:{
    alignItems: 'center',
    width:'95%',
    paddingVertical: 10
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
  Infostat:{
    fontSize: 16,
    color: theme.colors.text,
    fontFamily:'Raleway_700Bold' 
  },
  Infostat1:{
    fontSize: 16,
    color: theme.colors.text,
    fontFamily:'Raleway_400Regular_Italic' 
  },
  RateDiv:{
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: '#444444',
    borderRadius: 10,
    width: '100%',
    marginTop: 15,
  },
  shareDiv:{
    width: '100%',
    flexDirection: 'row',
    marginTop: 1,
    justifyContent:'space-between',
    padding:4,
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
