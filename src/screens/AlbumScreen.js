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
import CustomSlider2 from '../components/CarrouselReviews'
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

export default function AlbumScreen({ navigation, route }) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [load, setLoad] = React.useState(false);
  const [media, setMedia] = React.useState(0);
  const [token, setToken] = useState(''); 
  const [contador, setContador] = useState(0); 
  const [usutoken, setusuToken] = useState('');   
  const [album, setAlbum] = useState('');  
  const [albumid, setAlbumID] = useState('6253673aa7c75d22b8bd8cd2');  
  const [UID, setUsuUID] = useState('');  
  const [news, setNews] = useState([]);
  const [reviewsfriends, setReviewsfriends] = useState([]);
  const [reviewspop, setReviewspop] = useState([]);
  const [fecha, setFecha] = useState('');  
  const [audioTracks, setAudioTracks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalRVisible, setModalRVisible] = useState(false);
  const [sound, setSound] = React.useState();
  const [audioStatus, setAudioStatus] = useState(true)
  const [reviewTitle, setreviewTitle] = useState({ value: '', error: '' })
  const [reviewText, setreviewText] = useState({ value: '', error: '' })
  const [success, setSuccess] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [usu, setUsu] = useState('');
  const [ratinges, setRatinges] = useState('');
  const [exrating, setEXRating] = useState(false);
  const [ratid, setRatid] = useState(false);

  const { id, back } = route.params;

    
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
         setAlbumID(albumResponse.data.id);
         setAudioTracks(albumResponse.data.tracks.items);
         if(albumResponse.data.release_date_precision!='year'){
           let split = albumResponse.data.release_date.split('-');
           setFecha(split[0]);
         }
         });

      });}
      getData();
      setLoad(!load)
    }, [spotify.ClientId, spotify.ClientSecret, id]); 

    function clickTracklist(){
      setModalVisible(true);
    }
    function clickReview(){
      setModalRVisible(true);
    }
    function renderTracks() {
      if(audioTracks){
      return album.tracks.items.map((item, i) => (
        <View key={i} style={styles.trackDiv}><Text style={[
          { fontFamily:'Raleway_400Regular',
           paddingVertical: 4,
           marginLeft: 11,
           color: theme.colors.text,
           fontSize: 17,
           maxWidth: 240
          }
         ]}>{item.track_number}. {item.name}</Text>{item.preview_url ?<TouchableOpacity onPress={() => playSound(item.name)} style={styles.iconPlay}>{audioStatus?<AntDesign name="playcircleo" size={24} color="white" />:<AntDesign name="playcircleo" size={24} color="white" />}</TouchableOpacity>:null  }</View>
     )) 
    }}
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
          setusuToken(ret.token);
          let url = Url + "/usuarios?id=" + ret.uid;
            console.log(url);
            axios.get(url,
                {
                    headers: { 'Content-Type': 'application/json',
                    'x-token' : ret.token },
                    withCredentials: true
                }
            ).then((res) => {   
              //console.log(res.data.listas);  
              setUsu(res.data.usuarios);
              setUsuUID(ret.uid);
              //sacamos reviews de amigos
              res.data.usuarios.seguidos.forEach( (element) => {
                element.reviews.forEach( (element2) => {
                    let url2 = Url + "/reviews?id=" + element2;
                    console.log(url2);
                    axios(url2, {
                      headers: {
                        'Content-Type' : 'application/json'
                      },
                      method: 'GET'
                    })
                    .then(res3 => {
                      if(res3.data.reviews.album == id){
                        const data = {
                          id: res3.data.reviews.uid,
                          albumimg: res3.data.reviews.albumimg,
                          albumname: res3.data.reviews.albumtitle,
                          albumartist: res3.data.reviews.albumart,
                          usuimg: res3.data.reviews.usuario.imagen,
                          usu: element.usuario.username,
                          titulo: res3.data.reviews.titulo,
                          texto: res3.data.reviews.texto,
                          likes: res3.data.reviews.likes.length,
                          comments: res3.data.reviews.comentarios.length,
                          val: '5',
                        }
                      setReviewsfriends((reviewsfriends) => reviewsfriends.concat(data))
                      }
                      });
                     });
                    });
              //comprobamos rating
              let existe = false;
              axios('https://accounts.spotify.com/api/token', {
                headers: {
                  'Content-Type' : 'application/x-www-form-urlencoded',
                  'Authorization' : 'Basic ' + btoa(spotify.ClientId + ':' + spotify.ClientSecret)      
                },
                data: 'grant_type=client_credentials',
                method: 'POST'
              })
              .then(tokenResponse => { 
              axios('https://api.spotify.com/v1/albums/' + id, {
                method: 'GET',
                headers: { 'Authorization' : 'Bearer ' + tokenResponse.data.access_token}
              })
              .then (albumResponse => {        
              res.data.usuarios.ratings.forEach( (element) => {
                if(element.album == albumResponse.data.id){
                  setEXRating(true);
                  existe = true;
                  setRatinges(element.estrellas);
                  setRatid(element._id);
                  console.log('existe');
                }
              });
              if(!existe){
                setRatinges(0);
              }
              });
             
            });

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
       
     }, [load]); 

     function ratingCompleted(rating) {
       console.log("Rating is: " + rating);
       setRatinges(rating);
       }

     React.useEffect(() => {
       try {
        if(ratinges != 0){
        const data = {
          estrellas: ratinges,
          album: album.id,
          albumimg: album.images[0].url,
          albumtit: album.name,
          albumart: album.artists[0].name,
          usuario: UID,
          artistaid: album.artists[0].id
        }
        let ratarray = usu.ratings;
        if(exrating){ //si existe hacemos PUT
        let url = Url + "/ratings/" + ratid;
        axios.put(url,
            data,
            {
                headers: { 'Content-Type': 'application/json',
                'x-token' : usutoken },
                withCredentials: true
            }
        ).then((res) => {
          console.log(res.data);
          setLoad(!load);
          showMessage({
            message: "Rating edited succesfully!",
            type: "success",
            icon: "success"
          });
            console.log('actualiza');
          });
        }
        else {
          let url = Url + "/ratings";
          axios.post(url,
            data,
            {
                headers: { 'Content-Type': 'application/json',
                'x-token' : usutoken },
                withCredentials: true
            }
        ).then((res) => {
          console.log(res.data);
          ratarray.push(res.data.rat.uid);
          const usuario = {
            activo: usu.activo,
            baneado: usu.baneado,
            email: usu.email,
            favs: usu.favos,
            imagen: usu.imagen,
            list_liked: usu.list_liked,
            notis: usu.notis,
            notis_act : usu.notis_act,
            ratings: ratarray,
            reviews: usu.reviews,
            rol: usu.rol,
            seguidores: usu.seguidores,
            seguidos: usu.seguidos,
            uid: usu.uid,
            user_lists: usu.user_lists,
            username: usu.username
           }
           let urlu = Url + "/usuarios/" + UID;
          axios.put(urlu,
            usuario,
              {
                  headers: { 'Content-Type': 'application/json',
                  'x-token' : usutoken },
                  withCredentials: true
              }
          ).then((res3) => {
            setLoad(!load);
            showMessage({
              message: "Rating added to your collection!",
              type: "success",
              icon: "success"
            });
          })
          .catch((error) => {
            console.error(error)
          });

          
        })
        .catch((error) => {
          console.error(error)
        });
        }}
        } catch (err) {
          console.log(err);
        }
      
      }, [ratinges]); 

      React.useEffect(() => { //valoracion media
        let url = Url + "/ratings?pag=0";
        let suma = 0;
        let total = 0;

        axios.get(url,
          {
              headers: { 'Content-Type': 'application/json',
              'x-token' : usutoken },
              withCredentials: true
          }
      ).then((res) => {
        res.data.ratings.forEach( (element) => {
          if(element.album == id){
           suma = suma + element.estrellas;
           total++;
          }
        })
        console.log(suma);
        console.log(total);
        if(suma!=0){
        setMedia((suma/total).toFixed(1));
        }
        else{
          setMedia('0');
        }
      });
      }, [ratinges]); 

     React.useEffect(() => {
      let array = [];
      let url = Url + "/reviews/?album=" + id;
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
                usu: element.usuario.username,
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
    }, [load]); 

    const onReviewPressed = () => {
      if(token){
      try {
        let titleform = reviewTitle.value;
        let textform = reviewText.value;
        const data = {
          titulo : titleform,
          texto : textform,
          usuario : UID,
          album: album.id,
          artista: album.artists[0].id,
          albumimg: album.images[0].url,
          albumart: album.artists[0].name,
          albumtitle: album.name
        }
        let revarray = usu.reviews;
        

        let url = Url + "/reviews";
        axios.post(url,
            data,
            {
                headers: { 'Content-Type': 'application/json',
                'x-token' : usutoken },
                withCredentials: true
            }
        ).then((res) => {
          console.log(res.data.review.uid);
          revarray.push(res.data.review.uid);
          const usuario = {
            activo: usu.activo,
            baneado: usu.baneado,
            email: usu.email,
            favs: usu.favos,
            imagen: usu.imagen,
            list_liked: usu.list_liked,
            notis: usu.notis,
            notis_act : usu.notis_act,
            ratings: usu.ratings,
            reviews: revarray,
            rol: usu.rol,
            seguidores: usu.seguidores,
            seguidos: usu.seguidos,
            uid: usu.uid,
            user_lists: usu.user_lists,
            username: usu.username
           }
           let urlu = Url + "/usuarios/" + UID;
          axios.put(urlu,
            usuario,
              {
                  headers: { 'Content-Type': 'application/json',
                  'x-token' : usutoken },
                  withCredentials: true
              }
          ).then((res3) => {
            console.log(res3.status);
            console.log(res3.data);
            setLoad(!load);
            setModalRVisible(false);
            setreviewText('');
            setreviewTitle('');
            showMessage({
              message: "Review added to your collection!",
              type: "success",
              icon: "success",
              onPress: () => {
                navigation.navigate('ReviewScreen', {id: res.data.review.uid})
              },
            });
          })
          .catch((error) => {
            console.error(error)
          });

          
        })
        .catch((error) => {
          console.error(error)
        });
        
    } catch (err) {
        console.log(err);
      }
      }
    }


    if (!fontsLoaded) {
    return <AppLoading />
  }


  var modalBackgroundStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  };

  return (
      <View style={styles.Fondo}>
        <ScrollView>
        <Modal
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
      </Modal>
      <View style={styles.encabezado}>
      <BackButton goBack={navigation.goBack} />
      <PageHeader>Album details</PageHeader>
      </View>
      <View style={styles.TopBanner}>
      <View style={styles.Info}>
      {album ? <Image source={{ uri: album.images[0].url }} style={styles.image}  />:null } 
      <Text style={styles.Infoname}>{album.name}</Text>
      {album ? <TouchableOpacity onPress={() => navigation.navigate('ArtistScreen', {id: album.artists[0].id})}><Text style={styles.Infoart}>{album.artists[0].name}</Text></TouchableOpacity>:null } 
      <Text style={styles.Infodate}>{fecha}</Text>
      <Paragraph style={styles.Infoval}>
      <FontAwesome name="star" size={24} color="#FFCF26" /><Text style={styles.Infoval}> </Text>{media ? <Text style={styles.Infoval}>{media}/5</Text>:null}
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
      {UID ? <Rating
          type="custom"
          ratingColor="#D90FC8"
          tintColor="#444444"
          startingValue={ratinges}
          ratingCount={5}
          imageSize={26}
          onFinishRating={ratingCompleted}
          style={{ paddingVertical: 2, marginBottom: 8}}
        />:<Rating
        type="custom"
        ratingColor="#D90FC8"
        tintColor="#444444"
        startingValue={ratinges}
        ratingCount={5}
        imageSize={26}
        readonly
        style={{ paddingVertical: 2, marginBottom: 8}}
      />}
        {UID ? <Button  onPress={() => clickReview()} style={styles.buttonRev}> <Text style={[
        { fontFamily:'Raleway_400Regular',lineHeight: 19,
        color: theme.colors.text }
        ]}>Review</Text></Button>: <Button onPress={() => navigation.navigate('LoginScreen')} style={styles.buttonRev}> <Text style={[
        { fontFamily:'Raleway_400Regular',lineHeight: 19,
       color: theme.colors.text }
       ]}>Review</Text></Button>}
      {UID ?<Button  onPress={() => navigation.navigate('AddtolistScreen', {id: album.id, name: album.name, release_date_precision: album.release_date_precision, release_date: album.release_date, imagen: album.images[0].url, artista: album.artists[0].name})} style={styles.buttonRev}> <Text style={[
       { fontFamily:'Raleway_400Regular',    
       fontSize: 9, lineHeight: 19,
      color: theme.colors.text }
      ]}>Add to a List</Text></Button>: <Button onPress={() => navigation.navigate('LoginScreen')} style={styles.buttonRev}> <Text style={[
        { fontFamily:'Raleway_400Regular',lineHeight: 19,
       color: theme.colors.text, fontSize: 9 }
       ]}>Add to a List</Text></Button>}
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
      {reviewsfriends.length > 0 && <View style={[
              { marginBottom: 15
              }
        ]}>
      { reviewsfriends ? <CustomSlider2 navigation={navigation} data={reviewsfriends} />:null}
      </View> }
      {reviewsfriends.length == 0 && <View>
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
        <Text style={styles.Divtext}>Popular Reviews</Text>
      </LinearGradient>
      {reviewspop.length > 0 && <View style={[
              { marginBottom: 15
              }
        ]}>
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
    color: theme.colors.secondary,
    fontFamily:'Raleway_700Bold',
  },
  Infodate:{
    fontSize: 16,
    marginTop: 4,
    color: theme.colors.text,
    fontFamily:'Raleway_400Regular',
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
  },
  containerflecha: {
    position: 'absolute',
    left: 4
  },
  flecha: {
    width: 24,
    height: 24,
    marginLeft: 10
  },
})
