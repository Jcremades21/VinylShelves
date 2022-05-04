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
import { MaterialIcons } from '@expo/vector-icons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

export default function ProfileScreen({ navigation, route }) {
    const [usu, setUsu] = useState('');  
    const [UID, setUID] = useState('');  
    const [token, setToken] = useState('');  
    const [usutoken, setUsutoken] = useState('');  
    const [fav0, setFav0] = useState('');  
    const [fav1, setFav1] = useState('');  
    const [fav2, setFav2] = useState('');  
    const [modalSVisible, setModalSVisible] = useState(false);
    const [modalS1Visible, setModalS1Visible] = useState(false);
    const [modalS2Visible, setModalS2Visible] = useState(false);
    const [load, setLoad] = useState(false);
    const [search, setSearch] = useState({ value: '', error: '' })
    const [searchResults, setSearchResults] = useState([])

    const spotify = Credentials();  
    //console.log(searchResults);
    var spotifyApi = new SpotifyWebApi({
        clientId: 'd25870205635429285732c34594b8249',
        clientSecret: '508413bf4ea24a26ad44b70d831ae2bc'
      });

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
            setUsutoken(ret.token);
            setUID(ret.uid);
            let url = Url + "/usuarios?id=" + ret.uid;
            console.log(url);
            axios.get(url,
                {
                    headers: { 'Content-Type': 'application/json',
                    'x-token' : usutoken },
                    withCredentials: true
                }
            ).then((res) => {   
              //console.log(res.data.listas);  
              console.log(res.data); 
              setUsu(res.data.usuarios);
              axios('https://accounts.spotify.com/api/token', {
              headers: {
                'Content-Type' : 'application/x-www-form-urlencoded',
                'Authorization' : 'Basic ' + btoa(spotify.ClientId + ':' + spotify.ClientSecret)      
              },
              data: 'grant_type=client_credentials',
              method: 'POST'
            })
            .then(tokenResponse => { 
            spotifyApi.setAccessToken(tokenResponse.data.access_token); 
            spotifyApi.getAlbums([res.data.usuarios.favs]).then(
            function(albumResponse) {
                console.log(albumResponse.body);
                console.log(res.data.usuarios.favs);
                const favo1 = {
                    id: albumResponse.body.albums[0].id,
                    title: albumResponse.body.albums[0].name,
                    artist: albumResponse.body.albums[0].artists[0].name,
                    source: albumResponse.body.albums[0].images[0].url
                }
                const favo2 = {
                    id: albumResponse.body.albums[1].id,
                    title: albumResponse.body.albums[1].name,
                    artist: albumResponse.body.albums[1].artists[0].name,
                    source: albumResponse.body.albums[1].images[0].url
                }
                const favo3 = {
                    id: albumResponse.body.albums[2].id,
                    title: albumResponse.body.albums[2].name,
                    artist: albumResponse.body.albums[2].artists[0].name,
                    source: albumResponse.body.albums[2].images[0].url
                }

                setFav0(favo1)   
                setFav1(favo2)                
                setFav2(favo3)                

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


    function addfav(pos, album){
      let url = Url + "/usuarios/" + UID;
      let favos = usu.favs;
      favos[pos] = album;
      const usuario = {
        activo: usu.activo,
        baneado: usu.baneado,
        email: usu.email,
        favs: favos,
        imagen: usu.imagen,
        list_liked: usu.list_liked,
        notis: usu.notis,
        notis_act : usu.notis_act,
        ratings: usu.ratings,
        reviews: usu.reviews,
        rol: usu.rol,
        seguidores: usu.seguidores,
        seguidos: usu.seguidos,
        uid: usu.uid,
        user_lists: usu.user_lists,
        username: usu.username
       }
      console.log(usuario);
      axios.put(url,
        usuario,
       {
           headers: { 'Content-Type': 'application/json',
           'x-token' : usutoken },
           withCredentials: true
       }
       ).then((res) => { 
         if(pos==0){
          setModalSVisible(false);
         }
         if(pos==1){
          setModalS1Visible(false);
        }
         if(pos==2){
          setModalS2Visible(false);
        }
         setLoad(!load);
         showMessage({
           message: "Album added to your favs!",
           type: "success",
           icon: "success"
         });
       });
    }
    function openSearch(){
        setModalSVisible(true);
      }
    function openSearch1(){
        setModalS1Visible(true);
      }
    function openSearch2(){
        setModalS2Visible(true);
      }

    const logout = () => {
        storage.remove({
            key: 'loginState'
          });
        navigation.reset({
            index: 0,
            routes: [{ name: 'Landing' }],
          });
      }

      var modalBackgroundStyle = {
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
      };
    
    return (
        <View style={styles.Fondo}>
            <ScrollView>
            <View style={styles.encabezado}>
            <BackButton goBack={navigation.goBack} />
            <PageHeader>Profile Settings</PageHeader>
            <TouchableOpacity onPress={logout} style={[
              {   position: 'absolute',
              right: 1,
              marginRight: 20
              }
            ]}><AntDesign name="logout" size={24} color="white" /></TouchableOpacity>
            </View>
            <View style={[
              {  alignItems: 'center'
              }
            ]}>
            {usu ? <><TouchableOpacity><Image style={styles.image2} source={{ uri: usu.imagen }}></Image></TouchableOpacity>
            <Text style={styles.itemText3}>{usu.username}</Text>
            </>:null} 
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('AccountInfoScreen')}><View style={[
              {  flexDirection: 'row',
              paddingHorizontal: 25,
              paddingVertical: 15,
              marginTop: 20
              }
            ]}>
           <FontAwesome name="user-circle-o" size={30} color="white" />
            <Text style={styles.itemText}>Account info</Text>
            </View></TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('ChangePassScreen')}><View style={[
              {  flexDirection: 'row',
              paddingHorizontal: 25,
              paddingVertical: 15
              }
            ]}>
            <MaterialCommunityIcons name="shield-key-outline" size={30} color="white" />
            <Text style={styles.itemText}>Change password</Text>
            </View></TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('NotSettingsScreen')}><View style={[
              {  flexDirection: 'row',
              paddingHorizontal: 25,
              paddingVertical: 15
              }
            ]}>
            <MaterialIcons name="notifications" size={30} color="white" />
            <Text style={styles.itemText}>Notifications settings</Text>
            </View></TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('DeleteAccountScreen')}><View style={[
              {  flexDirection: 'row',
              paddingHorizontal: 25,
              paddingVertical: 15
              }
            ]}>
           <Entypo name="circle-with-cross" size={30} color="white" />
            <Text style={styles.itemText}>Delete account</Text>
            </View></TouchableOpacity>
            
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    Fondo:{
        backgroundColor: '#392F36',
        height: '100%',
        fontFamily: 'Raleway_400Regular'
    },
    buttonTrack:{
        alignSelf: 'center',
        backgroundColor: '#636363',
        width: 140,
        marginTop: 20
      },
    icondiv: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%'
    },
    infoDiv:{
        flexDirection: 'row',
        paddingVertical: 7,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.4)',
        backgroundColor: 'rgba(96, 91, 91, 0.55)',
        borderRadius: 10,
    },
    noResultView: {
        width: '75%',
        alignItems: 'center',
        alignSelf:'center'
    },
    itemView: {
        // marginHorizontal: '10%',
        backgroundColor: 'transparent',
        height: 60,
        width: '100%',
        marginBottom: 22,
        justifyContent: 'center',
        borderRadius: 4, 
    },
    itemText: {
      color: theme.colors.text,
      paddingHorizontal: 10,
      fontFamily:'Raleway_400Regular',
      fontSize: 20,
      marginTop: 0,
    },
    itemText3: {
        color: theme.colors.text,
        paddingHorizontal: 10,
        fontFamily:'Raleway_400Regular',
        fontSize: 20,
        textAlign: 'center',
        marginTop: 10,
        width: 190
    },
    link:{
        color: theme.colors.secondary,
        paddingHorizontal: 10,
        fontFamily:'Raleway_700Bold',
        fontSize: 19,
    },
    link2:{
        color: theme.colors.secondary,
        fontFamily:'Raleway_700Bold',
        fontSize: 19,
    },
    foltext: {
        color: theme.colors.secondary,
        paddingHorizontal: 10,
        fontFamily:'Raleway_700Bold',
        fontSize: 16,
        marginTop: 7
    },
    foltextnum: {
        color: theme.colors.text,
        paddingHorizontal: 10,
        fontFamily:'Raleway_700Bold',
        fontSize: 16,
        marginTop: 5
    },
    itemTextLista: {
        color: theme.colors.text,
        paddingHorizontal: 10,
        fontFamily:'Raleway_700Bold',
        fontSize: 20,
        width: 185
    },
    itemText2: {
      color: theme.colors.text,
      paddingHorizontal: 10,
      fontFamily:'Raleway_400Regular',
      fontSize: 20,
      width: 185
    },
    restitle2:{
        paddingHorizontal: 10,
        width: 265,
      },
    reslista:{
        paddingHorizontal: 10,
        width: 245,
        marginLeft: 60
      },
    image2: {
        width: 150,
        height: 150,
        alignItems:'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 5
      },
    image3: {
        width: 60,
        height: 60,
        alignItems:'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 5
      },
     imagefav: {
        width:90,
        height:90,
        alignItems:'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 5
      },
    beginText: {
        width: '100%',   
        marginTop: 30,
        fontSize: 15,
        fontFamily:'Raleway_400Regular',
        justifyContent: 'center',
        textAlign: 'center',
        color: theme.colors.text
    },
    encabezado:{
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',   
        marginTop: 30,
        fontFamily:'Raleway_400Regular',
        justifyContent: 'center'
    },
    searchDiv1:{
        flexDirection:'row',
        alignItems: 'center',
        width: '30%',
        marginLeft: 20
    },  
    searchDiv:{
        flexDirection:'row',
        alignItems: 'center',
        width: '75%',
        paddingHorizontal: 15
    },  
    topbar:{
        flexDirection: 'row'
    },
    imagealb: {
        width: 70,
        height: 70,
        borderRadius: 5,
        marginRight: -60,
      },
    tracks:{
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        borderRadius: 5,
        marginTop: 5
    },
    modalView: {
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
    centeredView:{
      height: '100%'
    }
})