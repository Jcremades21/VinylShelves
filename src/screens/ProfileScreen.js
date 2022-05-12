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
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import * as ImagePicker from 'expo-image-picker';

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
    const [image, setImage] = useState('')
    const spotify = Credentials();  
    //console.log(searchResults);
    var spotifyApi = new SpotifyWebApi({
        clientId: 'd25870205635429285732c34594b8249',
        clientSecret: '508413bf4ea24a26ad44b70d831ae2bc'
      });

    React.useEffect(() => {
      navigation.addListener('focus', async () =>{
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
            axios.get(url,
                {
                    headers: { 'Content-Type': 'application/json',
                    'x-token' : usutoken },
                    withCredentials: true
                }
            ).then((res) => {   
              //console.log(res.data.listas);  
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
      })
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
      React.useEffect(() => {
        if(!search) return setSearchResults([])
        let cancel = false;
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
              let url = 'https://api.spotify.com/v1/search?q='+ search.value +'&type=track';
              axios(url, {
                    method: 'GET',
                    headers: { 'Authorization' : 'Bearer ' + tokenResponse.data.access_token}
                  })
                  .then (albumResponse => { 
                      if (cancel) return       
                  setSearchResults(albumResponse.data.tracks.items.map(track => {
                    let fechasplit = track.album.release_date;
                    return{
                        artista: track.album.artists[0].name,
                        nombre: track.album.name,
                        id: track.album.id,
                        imagen: track.album.images[0].url ,
                        release_date: fechasplit,
                        release_date_precision: track.album.release_date_precision,
                        idart: track.album.artists[0].id
                    }
                    }))
                  });
            });}
        getData();

        return () => cancel = true;
     }, [search]); 

     const selectImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [3, 3],
        quality: 1,
      });
  
  
      if (!result.cancelled) {
        setImage(result.uri);
        //se sube a bd
        let data = new FormData();
        let split = result.uri.split('/');
        data.append('archivo',{
            uri: result.uri,
            type: result.type,
            name:  split[split.length-1]
        });
        let url = Url + "/upload/foto/usuario/"+ UID;
        axios.post(url,
            data,
            {
                headers: { 'Content-Type': 'application/json',
                'x-token' : usutoken },
                withCredentials: true
            }
        ).then((res) => {
          showMessage({
            message: "Profile photo successfully changed!",
            type: "success",
            icon: "success"
          });
          
        })
        .catch((error) => {
          console.error(error)
        });
      }
    };

      var modalBackgroundStyle = {
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
      };
    
    return (
        <View style={styles.Fondo}>
            <Modal
        animationType="fade"
        transparent={true}
        visible={modalSVisible}
        onRequestClose={() => {
          setModalSVisible(!modalSVisible);
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
            ]}>Add a favourite album</Text>
            <View style={styles.Info2}>
            <TextInputE placeholder="Search by name" placeholderTextColor='rgba(255, 255, 255, 0.75)' 
            onChangeText={(text) => setSearch({ value: text, error: '' })}></TextInputE>
            </View>
                        
            {search.value != '' && <View style={styles.container2}>
                  <View style={styles.subContainer}>
                      {
                          searchResults.length ?

                              searchResults.slice(0, 6).map(item => {
                                  return (
                                      <TouchableOpacity style={styles.itemView} onPress={addfav.bind(this,0,item.id)}>
                                      <View style={styles.infoDiv}>
                                          <Image source={{ uri: item.imagen }} style={styles.image3}  />
                                          <View  style={styles.restitle2}>
                                          <Text numberOfLines={1} style={styles.itemText}>{item.nombre}</Text>
                                          <Text numberOfLines={1} style={styles.itemText2}>{item.artista}</Text>
                                          </View>
                                      </View>
                                      </TouchableOpacity>

                                  )
                              })

                              :
                              <View
                                  style={styles.noResultView}>
                                  <Text style={styles.noResultText}>No search items matched</Text>
                              </View>
                      }

                  </View>
              </View>}
            </View>
          </View>
        
          </ScrollView>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalS1Visible}
        onRequestClose={() => {
          setModalS1Visible(!modalS1Visible);
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
            ]}>Add a favourite album</Text>
            <View style={styles.Info2}>
            <TextInputE placeholder="Search by name" placeholderTextColor='rgba(255, 255, 255, 0.75)' 
            onChangeText={(text) => setSearch({ value: text, error: '' })}></TextInputE>
            </View>
                        
            {search.value != '' && <View style={styles.container2}>
                  <View style={styles.subContainer}>
                      {
                          searchResults.length ?

                              searchResults.slice(0, 6).map(item => {
                                  return (
                                      <TouchableOpacity style={styles.itemView} onPress={addfav.bind(this,1,item.id)}>
                                      <View style={styles.infoDiv}>
                                          <Image source={{ uri: item.imagen }} style={styles.image3}  />
                                          <View  style={styles.restitle2}>
                                          <Text numberOfLines={1} style={styles.itemText}>{item.nombre}</Text>
                                          <Text numberOfLines={1} style={styles.itemText2}>{item.artista}</Text>
                                          </View>
                                      </View>
                                      </TouchableOpacity>

                                  )
                              })

                              :
                              <View
                                  style={styles.noResultView}>
                                  <Text style={styles.noResultText}>No search items matched</Text>
                              </View>
                      }

                  </View>
              </View>}
            </View>
          </View>
        
          </ScrollView>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalS2Visible}
        onRequestClose={() => {
          setModalS2Visible(!modalS2Visible);
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
            ]}>Add a favourite album</Text>
            <View style={styles.Info2}>
            <TextInputE placeholder="Search by name" placeholderTextColor='rgba(255, 255, 255, 0.75)' 
            onChangeText={(text) => setSearch({ value: text, error: '' })}></TextInputE>
            </View>
                        
            {search.value != '' && <View style={styles.container2}>
                  <View style={styles.subContainer}>
                      {
                          searchResults.length ?

                              searchResults.slice(0, 6).map(item => {
                                  return (
                                      <TouchableOpacity style={styles.itemView} onPress={addfav.bind(this,2,item.id)}>
                                      <View style={styles.infoDiv}>
                                          <Image source={{ uri: item.imagen }} style={styles.image3}  />
                                          <View  style={styles.restitle2}>
                                          <Text numberOfLines={1} style={styles.itemText}>{item.nombre}</Text>
                                          <Text numberOfLines={1} style={styles.itemText2}>{item.artista}</Text>
                                          </View>
                                      </View>
                                      </TouchableOpacity>

                                  )
                              })

                              :
                              <View
                                  style={styles.noResultView}>
                                  <Text style={styles.noResultText}>No search items matched</Text>
                              </View>
                      }

                  </View>
              </View>}
            </View>
          </View>
        
          </ScrollView>
        </View>
      </Modal>
            <ScrollView>
            <View style={styles.encabezado}>
            <PageHeader>Profile</PageHeader>
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
            {usu ? <><TouchableOpacity onPress={selectImage}>
            { image ? <Image style={styles.image2} source={{ uri: image }}></Image>:<Image style={styles.image2} source={{ uri: usu.imagen }}></Image>}
              </TouchableOpacity>
            <Text style={styles.itemText3}>{usu.username}</Text>
            </>:null}
            
            </View>
            <View style={[
              {   flexDirection: 'row',
              width: '50%',
              alignSelf: 'center'
              }
            ]}>
                
               {usu ? <><TouchableOpacity onPress={() => navigation.navigate('FollowingScreen', {id: UID, filtro: "1"})}><View><Text style={styles.foltext}>Following</Text><Text style={styles.foltextnum}>{usu.seguidos.length}</Text>
               </View></TouchableOpacity>
               <TouchableOpacity onPress={() => navigation.navigate('FollowingScreen', {id: UID, filtro: "0"})}><View><Text style={styles.foltext}>Followers</Text><Text style={styles.foltextnum}>{usu.seguidores.length}</Text></View></TouchableOpacity></>:null}
            </View>
            <Button onPress={() => navigation.navigate('EditInfo')} style={styles.buttonTrack} mode="contained">Edit info</Button>
            <Text style={[
              {  color: theme.colors.text,
                paddingHorizontal: 10,
                fontFamily:'Raleway_400Regular',
                fontSize: 17,
                marginLeft: 7,
                marginTop: 7
              }
            ]}>Favourite albums</Text>
            {usu.favs ? <View style={[
              {   flexDirection: 'row',
              justifyContent: 'space-around'
              , marginTop: 15
              }
            ]}>
                { fav0 ?
                <TouchableOpacity onPress={() => openSearch()}><Image source={{ uri: fav0.source }} style={styles.imagefav}></Image></TouchableOpacity>: <TouchableOpacity onPress={() => openSearch()}><Image style={styles.imagefav}></Image></TouchableOpacity>}
                { fav1 ?
                <TouchableOpacity onPress={() => openSearch1()}><Image source={{ uri: fav1.source }} style={styles.imagefav}></Image></TouchableOpacity>: <TouchableOpacity onPress={() => openSearch1()}><Image style={styles.imagefav}></Image></TouchableOpacity>}
                { fav2 ?
                <TouchableOpacity onPress={() => openSearch2()}><Image source={{ uri: fav2.source }}style={styles.imagefav}></Image></TouchableOpacity>: <TouchableOpacity onPress={() => openSearch2()}><Image style={styles.imagefav}></Image></TouchableOpacity>}

            </View>:null}
            {usu ? <View style={[
                 {   paddingHorizontal: 20,
                    paddingVertical: 30
                }
                ]}>
                <TouchableOpacity onPress={() => navigation.navigate('UserReviews', {id: UID})}><View style={[
                 {   flexDirection: 'row',
                 paddingVertical: 10
                }
                ]}>
                <FontAwesome5 name="newspaper" size={28} color="white" />
                <Text style={styles.link}>Reviews</Text>
                <Text style={styles.link2}>({usu.reviews.length})</Text>
                </View></TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('UserLists', {id: UID})}><View style={[
                 {   flexDirection: 'row',
                 paddingVertical: 10
                }
                ]}>
                <Entypo name="list" size={28} color="white" style={[
                 {   marginRight: 3
                }
                ]} />
                <Text style={styles.link}>Lists</Text>
                <Text style={styles.link2}>({usu.list_liked.length + usu.user_lists.length})</Text>
                </View></TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('UserRatings', {id: UID})}><View style={[
                 {   flexDirection: 'row',
                 paddingVertical: 10
                }
                ]}>
                <Feather name="star" size={28} color="white" style={[
                 {   marginRight: 3
                }
                ]} />
                <Text style={styles.link}>Ratings</Text>
                <Text style={styles.link2}>({usu.ratings.length})</Text>
                </View></TouchableOpacity>
            </View>:null}
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
      width: 170
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
        color: theme.colors.text,
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