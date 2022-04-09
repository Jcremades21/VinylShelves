import React, { useState, useRef, useEffect, useContext, Component  } from 'react'
import { Alert, TouchableOpacity, StyleSheet, View, Modal, MsgBox, Text, SafeAreaView, ScrollView, Image, Pressable } from 'react-native'
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
import TextInput from '../components/TextInput'
import TextInputE from '../components/TextInput';
import { showMessage, hideMessage } from "react-native-flash-message";
import FlashMessage from "react-native-flash-message";
import { Entypo } from '@expo/vector-icons'; 
import { Feather } from '@expo/vector-icons'; 
import moment from 'moment'
import { Fontisto } from '@expo/vector-icons'; 

import {
    useFonts,
    Raleway_300Light,
    Raleway_400Regular,
    Raleway_700Bold,
    Raleway_300Light_Italic,
    Raleway_400Regular_Italic,
  } from '@expo-google-fonts/raleway';

export default function ReviewScreen({ navigation, route }) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [token, setToken] = useState(''); 
  const [usutoken, setusuToken] = useState('');   
  const [album, setAlbum] = useState('');  
  const [UID, setUsuUID] = useState('');  
  const [fecha, setFecha] = useState('');  
  const [modalVisible, setModalVisible] = useState(false);
  const [modalRVisible, setModalRVisible] = useState(false);
  const [modalDVisible, setModalDVisible] = useState(false);
  const [reviewTitle, setreviewTitle] = useState({ value: '', error: '' })
  const [reviewText, setreviewText] = useState({ value: '', error: '' })
  const [comment, setComment] = useState({ value: '', error: '' })
  const [success, setSuccess] = useState(false);
  const [liked, setLiked] = useState(false);
  const [load, setLoad] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [inter, setInter] = useState('');
  const [review , setReview] = useState([]);
  const [arraycoms , setArraycoms] = useState([]);
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
    Raleway_400Regular_Italic
    });

  var spotifyApi = new SpotifyWebApi({
        clientId: 'd25870205635429285732c34594b8249',
        clientSecret: '508413bf4ea24a26ad44b70d831ae2bc'
      });
  
    /*React.useEffect(() => {
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
    }, [spotify.ClientId, spotify.ClientSecret]); */


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
          setToken(ret.token);
          let array = [];
          let arraycom = [];
          let url = Url + "/reviews/?id=" + id;
          axios.get(url,
              {
                  headers: { 'Content-Type': 'application/json',
                  'x-token' : token },
                  withCredentials: true
              }
          ).then((res) => {   
            res.data.reviews.comentarios.forEach( (element) => {
            let url = Url + "/comentarios/?id=" + element._id;
              axios.get(url,
                  {
                      headers: { 'Content-Type': 'application/json',
                      'x-token' : token },
                      withCredentials: true
                  }
                ).then((res) => {
                  console.log(res.data);
                  arraycom.push(res.data.comentarios);
                  setArraycoms(arraycom);
                });
              });
            setInter(moment.utc(res.data.reviews.fecha).local().startOf('seconds').fromNow());
            setreviewTitle({ value: res.data.reviews.titulo, error: '' });
            setreviewText({ value: res.data.reviews.texto, error: '' });
            spotifyApi.setAccessToken(token); 
            console.log(res.data.reviews.usuario.username);
            setReview(res.data.reviews); 
            res.data.reviews.likes.forEach( (element2) => {
              if(element2 == ret.uid){
                  setLiked(true);
              }
            });
            spotifyApi.getAlbum(res.data.reviews.album).then(
              function(albumResponse) {
                  setAlbum(albumResponse.body);
                  if(albumResponse.body.release_date_precision!='year'){
                      let split = albumResponse.body.release_date.split('-');
                      setFecha(split[0]);
                    }
                },
                function(err) {
                  console.error(err);
                }
              );
  
          })
          .catch((error) => {
            console.error(error)
          });
        })
        .catch(err => {
          // any exception including data not found
          // goes to catch()
          let array = [];
          let arraycom = [];
          let url = Url + "/reviews/?id=" + id;
          axios.get(url,
              {
                  headers: { 'Content-Type': 'application/json',
                  'x-token' : token },
                  withCredentials: true
              }
          ).then((res) => {   
            res.data.reviews.comentarios.forEach( (element) => {
            let url = Url + "/comentarios/?id=" + element._id;
              axios.get(url,
                  {
                      headers: { 'Content-Type': 'application/json',
                      'x-token' : token },
                      withCredentials: true
                  }
                ).then((res) => {
                  console.log(res.data);
                  arraycom.push(res.data.comentarios);
                  setArraycoms(arraycom);
                });
              });
            setInter(moment.utc(res.data.reviews.fecha).local().startOf('seconds').fromNow());
            setreviewTitle({ value: res.data.reviews.titulo, error: '' });
            setreviewText({ value: res.data.reviews.texto, error: '' });
            spotifyApi.setAccessToken(token); 
            console.log(res.data.reviews.usuario.username);
            setReview(res.data.reviews); 

            spotifyApi.getAlbum(res.data.reviews.album).then(
              function(albumResponse) {
                  setAlbum(albumResponse.body);
                  if(albumResponse.body.release_date_precision!='year'){
                      let split = albumResponse.body.release_date.split('-');
                      setFecha(split[0]);
                    }
                },
                function(err) {
                  console.error(err);
                }
              );
  
          })
          .catch((error) => {
            console.error(error)
          });
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

     function addLike(){
      let url3 = Url + "/reviews/" + id;
      let like = review.likes;
      like.push(UID);
      const reviews = {
        titulo : review.titulo,
        texto : review.texto,
        fecha : review.fecha,
        usuario : review.usuario,
        album: review.album,
        artista: review.artista,
        comentarios: review.comentarios,
        likes : like
       }
      axios.put(url3,
       reviews,
       {
           headers: { 'Content-Type': 'application/json',
           'x-token' : token },
           withCredentials: true
       }
       ).then((res3) => { 
         setLiked(true);
         showMessage({
           message: "Liked!",
           type: "success",
           icon: "success"
         });
       });
     }

     function quitLike(){
      let url3 = Url + "/reviews/" + id;
      let like = review.likes;
      like.forEach( (element, index) => { //lo borramos del usuario
        if(element == UID){
          like.splice(index,1);
          console.log('deleted');
        }
       });

      const reviews = {
        titulo : review.titulo,
        texto : review.texto,
        fecha : review.fecha,
        usuario : review.usuario,
        album: review.album,
        artista: review.artista,
        comentarios: review.comentarios,
        likes : like
       }
      axios.put(url3,
       reviews,
       {
           headers: { 'Content-Type': 'application/json',
           'x-token' : token },
           withCredentials: true
       }
       ).then((res3) => { 
         setLiked(false);
         showMessage({
           message: "Unliked!",
           type: "default",
           icon: "success"
         });
       });
     }

     function addComment(){
      if(UID){
        let arraycom = [];
        let url = Url + "/reviews/?id=" + id;
        try {
          axios.get(url,
              {
                  headers: { 'Content-Type': 'application/json',
                  'x-token' : token },
                  withCredentials: true
              }
             ).then((res) => {
              const data = {
                creador: UID,
                texto: comment.value
              }
              let array = res.data.reviews.comentarios;
              const hilo = {
                comentarios: array,
                activadas: false
              }
              let url2 = Url + "/comentarios";

              axios.post(url2,
                  data,
                  {
                      headers: { 'Content-Type': 'application/json',
                      'x-token' : token },
                      withCredentials: true
                  }
              ).then((res2) => {   
                  array.push(res2.data.comentario.uid);
                  const review1 = {
                    titulo : res.data.reviews.titulo,
                    texto : res.data.reviews.texto,
                    fecha : res.data.reviews.fecha,
                    usuario : res.data.reviews.usuario,
                    album: res.data.reviews.album,
                    artista: res.data.reviews.artista,
                    comentarios: array,
                    likes : res.data.reviews.likes
                   }
                   console.log(array);
                   let url3 = Url + "/reviews/" + id;
                   axios.put(url3,
                    review1,
                    {
                        headers: { 'Content-Type': 'application/json',
                        'x-token' : token },
                        withCredentials: true
                    }
                    ).then((res3) => { 
                      showMessage({
                        message: "Comment added succesfully!",
                        type: "success",
                        icon: "success"
                      });
                      setReview(review1);
                      setLoad(!load);
                      //setArraycoms(array);

                    });


              })
              .catch((error) => {
                console.error(error)
              });
              
          });
          
      } catch (err) {
          console.log(err);
        }
        }
    }

    function deleteComment() {

    }

    function deleteReview() {
      let url = Url + "/reviews/" + id;
        axios.delete(url,
            {
                headers: { 'Content-Type': 'application/json',
                'x-token' : token },
                withCredentials: true
            }
        ).then((res) => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Dashboard' }],
          });

        })
        .catch((error) => {
          console.error(error)
        });
    }

     function renderComments () {
        let r = arraycoms.map((item) => (
          <View style={styles.comments}><View style={styles.comments2}>
            <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
              <Image source={{ uri: item.creador.imagen }} style={styles.imageusu}></Image>
            </TouchableOpacity>
          <Text style={[
            { fontFamily:'Raleway_400Regular',
             paddingVertical: 4,
             marginLeft: 11,
             color: theme.colors.text,
             fontSize: 17,
             width: 170
            }
           ]}>{item.texto}</Text></View><View style={styles.comments2}><View style={[
            { paddingHorizontal: 15}
             ]}>{UID == item.creador._id &&<Entypo name="trash" size={24} color="white" />}
             </View><Feather name="flag" size={24} color="white" /></View></View>
       ))     
       return r;
       }

      function clickEdit(){
        setModalRVisible(true);
      }

      function closeModalD(){
        setModalDVisible(false);
      }

      function clickDelete(){
        setModalDVisible(true);
      }

      const onReviewPressed = () => {

      try {
        let titleform = reviewTitle.value;
        let textform = reviewText.value;
        const data = {
          titulo : titleform,
          texto : textform,
          usuario : review.usuario,
          album: album.id,
          artista: album.artists[0].id,
          comentarios: review.comentarios,
          likes: review.likes,
          fecha: review.fecha
        }
        let url = Url + "/reviews/" + id;
        axios.put(url,
            data,
            {
                headers: { 'Content-Type': 'application/json',
                'x-token' : token },
                withCredentials: true
            }
        ).then((res) => {
          setModalRVisible(false);
          setReview(data);
          showMessage({
            message: "Review edited succesfully!",
            type: "success",
            icon: "success"
          });
          
        })
        .catch((error) => {
          console.error(error)
        });
        
    } catch (err) {
        console.log(err);
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
            ]}>Edit review...</Text>
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
            <TextInput multiline={true} 
            numberOfLines={8} value={reviewText.value}
            onChangeText={(text) => setreviewText({ value: text, error: '' })}></TextInput>
            { review ? <Button
              mode="contained"
              onPress={onReviewPressed}
              >
                Save
              </Button>:null}
            </View>
          </View>
        
          </ScrollView>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalDVisible}
        onRequestClose={() => {
          setModalDVisible(!modalDVisible);
        }}
      >
        <View style={[styles.centeredView,modalBackgroundStyle]}>
        <ScrollView>
          <View style={styles.modalView}>
            <View style={styles.reviewView}>
            <Text style={[
              { fontFamily:'Raleway_400Regular',
              color: theme.colors.text,
              fontSize: 19,
              textAlign: 'center'
              }
            ]}>Delete review?</Text>
            <View style={[
              { fontFamily:'Raleway_400Regular',
              color: theme.colors.text,
              fontSize: 19,
              flexDirection: 'row',
              paddingVertical: 15,
              justifyContent: 'space-between'
              }
            ]}>
            <Button style={styles.buttonTrack}
              mode="contained"
              onPress={closeModalD}
              >
                CANCEL
            </Button>
            <Button
              mode="contained"
              onPress={deleteReview}
              >
                YES
              </Button>
              </View>
            </View>
          </View>
        
          </ScrollView>
        </View>
      </Modal>
      <ScrollView>
      <View style={styles.encabezado}>
      <BackButton goBack={navigation.goBack} />
      {review.usuario && inter ? <><PageHeader
          >{review.usuario.username}'s review </PageHeader><View style={[
            { paddingHorizontal: 10 }
          ]}>{UID == review.usuario._id && <><TouchableOpacity onPress={clickDelete}><Entypo name="trash" size={24} color="white" /></TouchableOpacity></>}</View></>:null}
      </View>
      <View style={styles.TopBanner}>
      <View style={styles.TopBanner}>
      <View style={styles.Info}>
      <TouchableOpacity onPress={() => navigation.navigate('AlbumScreen', {id: album.id})}><Text style={styles.Infoname}>{album.name}</Text></TouchableOpacity>
      {album ? <Text style={styles.Infoart}>{album.artists[0].name}</Text>:null } 
      <Text style={styles.Infoart}>{fecha}</Text>
      <Paragraph style={styles.Infoval}>
      <FontAwesome name="star" size={24} color="#FFCF26" /><Text style={styles.Infoval}> </Text><Text style={styles.Infoval}>3/5</Text>
      </Paragraph>
      <View>
      {review.usuario ? <Text style={styles.Infogenero}>{review.usuario.username}'s rating</Text>: null}
      </View>
      </View>
      <View style={styles.rateandtrackdiv}>
      <View style={styles.RateDiv}>
      {album ? <TouchableOpacity onPress={() => navigation.navigate('AlbumScreen', {id: album.id})}><Image source={{ uri: album.images[0].url }} style={styles.image}></Image></TouchableOpacity>:null } 
      </View>
         </View>
        </View>
        </View>
        
        <View style={styles.reviewDiv}>
        <View style={[
       { flexDirection: 'row', marginTop: 10, marginLeft: 2}
        ]}>
       <Fontisto name="date" size={17} color="white" /><Text style={[
            {   color: theme.colors.text,
                fontFamily: 'Raleway_400Regular_Italic',
                fontSize: 12,
                marginLeft:3}
             ]}> {inter}</Text>
        </View>
        <View style={[
            {   flexDirection: 'row', marginTop: 5, width: '100%', justifyContent: 'space-between'}
             ]}>
        <View style={[
            {   flexDirection: 'row', width: '45%'}
             ]}>
        {review && inter ? <><Text style={styles.titulo}>{review.titulo} </Text><Text style={styles.titulo2}>by</Text></>: null}
        
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <View style={styles.usuDiv}>    
              {review.usuario ?<Image source={{ uri: review.usuario.imagen }} style={styles.imageusulink}></Image>:null }
              {review.usuario ?<Text style={styles.link}>{review.usuario.username}</Text>:null }
              </View>     
       </TouchableOpacity>
       </View>
       </View>   
     
        <ScrollView>
        <LinearGradient
        // Button Linear Gradient
        colors={['#5F1880', '#713b8c', '#392F36']}
        style={styles.textoDiv}
        >       
        {review ? <Text style={styles.texto}>{review.texto}</Text>: null}
        </LinearGradient> 
        </ScrollView>
        <View style={styles.likes}>
          {review.usuario ?<View style={styles.edit}>
          {UID == review.usuario._id && <TouchableOpacity onPress={() => clickEdit()}><FontAwesome name="pencil-square-o" size={24} color="white" /></TouchableOpacity>}
          </View>:null}
       <TouchableOpacity style={[
       { flexDirection: 'row', marginRight: 10}
        ]}><Entypo name="book" size={24} color="white" />{review.usuario ? <Text style={[
            {   color: theme.colors.text,
                fontFamily: 'Raleway_700Bold',
                fontSize: 14}
             ]}> More by {review.usuario.username}</Text>:null}</TouchableOpacity >{ review && token ? <View>{liked == true && <TouchableOpacity onPress={quitLike}><AntDesign name="heart" size={20} color="#B81EFF" /></TouchableOpacity>}{liked == false &&<TouchableOpacity onPress={addLike}><AntDesign name="hearto" size={20} color="#B81EFF" /></TouchableOpacity>}</View>:<AntDesign name="hearto" size={20} color="#B81EFF" />}{review && review.likes ?<Text style={styles.like}> {review.likes.length}</Text>: null}</View>
        </View>
        <View style={styles.commentsDiv}>
          <View style={styles.commentsDiv2}>
          {review.comentarios ? <><Text style={styles.Infoart}>Comments  </Text><FontAwesome5 name="comment-alt" size={20} color="#B81EFF" /><Text style={styles.like}>{review.comentarios.length}</Text></> :null}
          </View>
          <View>
          <Feather name="bell" size={24} color="white" /> 
          </View>  
        </View>
        {review.comentarios && arraycoms ? <View>{renderComments()}</View>:null }
        <View style={styles.addcDiv}>
          <Text style={styles.Infoname2}>Add a comment</Text>
          { UID ? <TextInput onChangeText={(text) => setComment({ value: text, error: '' })} numberOfLines={3} placeholderTextColor='rgba(255, 255, 255, 0.65)' 
            placeholder="Please be respectful with the community"></TextInput>:<><TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}><Text style={styles.link2}>Log In here to add a comment</Text></TouchableOpacity></> }
           { UID ? <Button mode="contained" onPress={addComment}>save</Button>:null }

        </View>
        </ScrollView>
      </View>
  )
  
}

const styles = StyleSheet.create({
    centeredView:{
      height: '100%'
    },
    buttonTrack:{
      backgroundColor: '#636363',
      width: 115
    },
    Info2:{
      alignItems: 'center',
      width:'95%',
      paddingVertical: 10
    },
    edit: {
      alignSelf: 'center',
      marginRight: 78
    },
    comments: {
      flexDirection: 'row',
      paddingVertical: 8,
      paddingHorizontal: 5,
      borderWidth: 2,
      borderColor: 'rgba(255, 255, 255, 0.3)',
      borderRadius: 10,
      marginHorizontal: 15,
      marginVertical: 3,
      justifyContent: 'space-between'
    },
    comments2: {
      flexDirection: 'row'
    },
    commentsDiv:{
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 17,
      paddingVertical:15
    },
    addcDiv:{
      paddingHorizontal: 17,
      marginBottom: 10
    },
    commentsDiv2:{
      flexDirection: 'row',
    },
    usuDiv:{
        flexDirection: 'row'
    },
    Info: {
        alignItems: 'center',
        width: '50%',
        marginRight: 17,
        paddingHorizontal: 10
    },
    like: {
        color: theme.colors.text,
        fontFamily: 'Raleway_400Regular',
        fontSize: 14,
        marginLeft: 4
    },
    likes:{
        bottom: 5,
        marginLeft: 5,
        marginRight: 5,
        flexDirection: 'row',
        marginTop: 15,
        justifyContent:'flex-end'
    },
    textoDiv:{
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 200
    },
    reviewDiv:{
        paddingHorizontal: 15
    },
    texto: {
        fontSize: 16,
        marginTop: 6,
        color: theme.colors.text,
        fontFamily: 'Raleway_400Regular'
    },
    titulo:{
        fontSize: 21,
        marginBottom: 10,
        marginRight: 10,
        color: theme.colors.text,
        fontFamily: 'Raleway_700Bold',
    },
    titulo2: {
      fontSize: 21,
      marginBottom: 10,
      marginRight: 10,
      color: theme.colors.text,
      fontFamily: 'Raleway_400Regular_Italic'
    },
    Infoname:{
        fontSize: 16,
        marginTop: 6,
        width: '70%',
        textAlign: 'center',
        color: theme.colors.text,
        fontFamily: 'Raleway_700Bold',
      },
    Infoname2:{
        fontSize: 16,
        marginTop: 6,
        width: '70%',
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
        fontSize: 14,
        marginBottom: 15,
        color: theme.colors.text,
        fontFamily:'Raleway_400Regular' 
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
        marginTop: 5,
        fontSize: 15
    },
    link2:{
      fontFamily: 'Raleway_700Bold',
      color: theme.colors.secondary,
      fontSize: 15,
      textAlign: 'center',
      paddingVertical: 10
    },
    Banner: {
        backgroundColor: '#fff',
        height: 60,
        marginTop: 10,
        alignItems: 'center'
    },
    Infoname:{
        fontSize: 16,
        textAlign: 'center',
        color: theme.colors.text,
        fontFamily: 'Raleway_700Bold',
    },
    image: {
        width: 140,
        height: 140,
        marginBottom: 1,
        marginLeft: 0,
        alignItems:'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 10
    },
    imageusulink: {
      width: 40,
      height: 40,
      marginTop: 0,
      marginBottom: 10,
      marginLeft: 0,
      marginRight: 5,
      alignItems:'center',
      borderWidth: 2,
      borderColor: 'rgba(255, 255, 255, 0.3)',
      borderRadius: 15
    },
    imageusu:{
        width: 40,
        height: 40,
        marginTop: 0,
        marginBottom: 1,
        marginLeft: 0,
        marginRight: 5,
        alignItems:'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 15
    },
    rateandtrackdiv:{
        width: '40%'
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
