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
import { SimpleLineIcons } from '@expo/vector-icons'; 
import { Feather } from '@expo/vector-icons'; 
import moment from 'moment'
import { Fontisto } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';

export default function UserScreen({ navigation, route }) {
    const [usu, setUsu] = useState('');  
    const [UID, setUID] = useState(''); 
    const [email, setEmail] = useState('');   
    const [token, setToken] = useState('');  
    const [usutoken, setUsutoken] = useState('');  
    const [fav0, setFav0] = useState('');  
    const [fav1, setFav1] = useState('');  
    const [fav2, setFav2] = useState('');
    const [sigue, setSigue] = useState(false);
    const [followed, setFollowed] = useState('');   
    const [modalRVisible, setModalRVisible] = useState(false);
    const [selectedSort, setSelectedSort] = useState('');
    const [modalSVisible, setModalSVisible] = useState(false);
    const [modalS1Visible, setModalS1Visible] = useState(false);
    const [modalS2Visible, setModalS2Visible] = useState(false);
    const [load, setLoad] = useState(false);
    const [search, setSearch] = useState({ value: '', error: '' })
    const [reportText, setReportText] = useState({ value: '', error: '' })
    const [searchResults, setSearchResults] = useState([])
    const [image, setImage] = useState('')
    const spotify = Credentials();  
    const { id } = route.params;

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
            setEmail(ret.useremail);
            if(ret.uid == id){
               navigation.navigate('Profile')
            }
            let url = Url + "/usuarios?id=" + id;
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
              res.data.usuarios.seguidores.forEach( (element) => {
                if(element._id == ret.uid){
                    setFollowed(true);
                }
              });
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
                console.log(albumResponse);
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
            let url = Url + "/usuarios?id=" + id;
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
                console.log(albumResponse);
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
    }, [load, id]); 


    function quitFollow(){
        let url = Url + "/usuarios?id=" + id;
        axios.get(url,
           {
               headers: { 'Content-Type': 'application/json',
               'x-token' : usutoken },
               withCredentials: true
           }
           ).then((res) => { 
            let seguidores = res.data.usuarios.seguidores;
            seguidores.forEach( (element, index) => { //lo borramos del usuario
                console.log(element._id);
                if(element._id == UID){
                  seguidores.splice(index,1);
                  console.log('deleted');
                }
               });
            const usuario = {
                activo: res.data.usuarios.activo,
                baneado: res.data.usuarios.baneado,
                email: res.data.usuarios.email,
                favs: res.data.usuarios.favs,
                imagen: res.data.usuarios.imagen,
                list_liked: res.data.usuarios.list_liked,
                notis: res.data.usuarios.notis,
                notis_act : res.data.usuarios.notis_act,
                ratings: res.data.usuarios.ratings,
                reviews: res.data.usuarios.reviews,
                rol: res.data.usuarios.rol,
                seguidores: seguidores,
                seguidos: res.data.usuarios.seguidos,
                uid: res.data.usuarios.uid,
                user_lists: res.data.usuarios.user_lists,
                username: res.data.usuarios.username
               }
              let url2 = Url + "/usuarios/" + id;
              axios.put(url2,
                usuario,
               {
                   headers: { 'Content-Type': 'application/json',
                   'x-token' : usutoken },
                   withCredentials: true
               }
               ).then((res) => { 
                 setFollowed(false);
                 setLoad(!load);
                 let url3 = Url + "/usuarios/" + UID;
                 let sigue = usu.seguidos;
                 sigue.forEach( (element, index) => { //lo borramos del usuario
                    console.log(element._id);
                    if(element._id == id){
                      sigue.splice(index,1);
                      console.log('deleted');
                    }
                   });
                 const usuario3 = {
                    email: email,
                    seguidos: sigue,
                 }
                 axios.put(url3,
                   usuario3,
                  {
                      headers: { 'Content-Type': 'application/json',
                      'x-token' : usutoken },
                      withCredentials: true
                  }
                  ).then((res) => { 
                    showMessage({
                        message: "Unfollowed!",
                        type: "default",
                        icon: "success"
                      });
                  });              
           });
         });
    }

    function addReport(){
      try {
        let moti = '';
        switch(selectedSort) {
          case '1':
            moti = 'Sin motivo';
            break;
          case '2':
            moti = 'Offensive username';
            break;
          case '3':
            moti = 'Spam';
            break;
          case '4':
            moti = 'Account promotes piracy';
            break;
          case '5':
            moti = 'Racist, sexist, homophobic or other discriminatory views';
            break;
          default:
        }
        const data = {
          usuario : UID,
          usuario_reportado: id,
          motivo: moti,
          texto: reportText.value
        }
        let url = Url + "/reportesu";
        axios.post(url,
            data,
            {
                headers: { 'Content-Type': 'application/json',
                'x-token' : usutoken },
                withCredentials: true
            }
        ).then((res) => {
          setModalRVisible(false);
          showMessage({
            message: "User reported succesfully, you'll have news in a few days!",
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

    function addFollow(){
        let url = Url + "/usuarios?id=" + id;
        axios.get(url,
           {
               headers: { 'Content-Type': 'application/json',
               'x-token' : usutoken },
               withCredentials: true
           }
           ).then((res) => { 
            let seguidores = res.data.usuarios.seguidores;
            seguidores.push(UID);
            const usuario = {
                activo: res.data.usuarios.activo,
                baneado: res.data.usuarios.baneado,
                email: res.data.usuarios.email,
                favs: res.data.usuarios.favs,
                imagen: res.data.usuarios.imagen,
                list_liked: res.data.usuarios.list_liked,
                notis: res.data.usuarios.notis,
                notis_act : res.data.usuarios.notis_act,
                ratings: res.data.usuarios.ratings,
                reviews: res.data.usuarios.reviews,
                rol: res.data.usuarios.rol,
                seguidores: seguidores,
                seguidos: res.data.usuarios.seguidos,
                uid: res.data.usuarios.uid,
                user_lists: res.data.usuarios.user_lists,
                username: res.data.usuarios.username
               }
              let url2 = Url + "/usuarios/" + id;
              axios.put(url2,
                usuario,
               {
                   headers: { 'Content-Type': 'application/json',
                   'x-token' : usutoken },
                   withCredentials: true
               }
               ).then((res2) => { 
                 setFollowed(true);
                 setLoad(!load);
                 let url3 = Url + "/usuarios/" + UID;
                 let sigue = usu.seguidos;
                 sigue.push(id);
                 console.log(sigue);
                 const usuario3 = {
                   email: email,
                   seguidos: sigue,
                  }
                 axios.put(url3,
                   usuario3,
                  {
                      headers: { 'Content-Type': 'application/json',
                      'x-token' : usutoken },
                      withCredentials: true
                  }
                  ).then((res3) => { 
                    showMessage({
                        message: "Followed!",
                        type: "success",
                        icon: "success"
                      });
                  });
                 
           });
       
         });
    }
    function clickReport(){
      setModalRVisible(true);
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
              { fontFamily:'Raleway_700Bold',
              color: theme.colors.text,
              fontSize: 15
              }
            ]}>Report user</Text>
            <View style={styles.Info2}>
            <Text style={[
              { fontFamily:'Raleway_400Regular',
              paddingVertical: 4,
              color: theme.colors.text,
              fontSize: 17,
              marginTop: 10
              }
            ]}>Why are you reporting this member?</Text>
            </View>
            <Picker
            selectedValue={selectedSort}
            itemStyle={{ backgroundColor: "grey", color: "blue", fontSize:17 }}
            mode= 'dropdown'
            style={[
             
            ]}
            onValueChange={(itemValue, itemIndex) =>
                setSelectedSort(itemValue)
            }>
            <Picker.Item label="Please select a reason..." color="#f545e3" value="1" />
            <Picker.Item label="Offensive username" color="#f545e3" value="2" />
            <Picker.Item label="Spam" color="#f545e3" value="3" />
            <Picker.Item label="Account promotes piracy" color="#f545e3" value="4" />
            <Picker.Item label="Racist, sexist, homophobic or other discriminatory views" color="#f545e3" value="5" />
            </Picker>
            <Text style={[
              { fontFamily:'Raleway_400Regular',
              paddingVertical: 4,
              color: theme.colors.text,
              fontSize: 18
              }
            ]}>Message</Text>
            <TextInput multiline={true}
            numberOfLines={8} value={reportText.value}
            onChangeText={(text) => setReportText({ value: text, error: '' })}></TextInput>
            <Button
              mode="contained"
              onPress={addReport}
              >
                Send
              </Button>
            </View>
          </View>
        
          </ScrollView>
        </View>
      </Modal>
            <ScrollView>
            <View style={styles.encabezado}>
            <BackButton goBack={navigation.goBack} />
            <PageHeader>Profile</PageHeader>
            {UID ? <TouchableOpacity onPress={clickReport} style={[
              {   position: 'absolute',
              right: 1,
              marginRight: 20
              }
            ]}><Feather name="flag" size={24} color="white" /></TouchableOpacity>:null}
            </View>
            <View style={[
              {  alignItems: 'center'
              }
            ]}>
            {usu ? <>
            { image ? <Image style={styles.image2} source={{ uri: image }}></Image>:<Image style={styles.image2} source={{ uri: usu.imagen }}></Image>}
            <View style={[
              {  flexDirection: 'row',
              marginTop: 10,
              alignSelf: 'center'
              }
            ]}><Text style={styles.itemText3}>{usu.username}</Text>{UID ? followed==true && <TouchableOpacity onPress={quitFollow}><SimpleLineIcons name="user-following" size={24} color="green" /></TouchableOpacity>:null}{UID ? followed==false && <TouchableOpacity onPress={addFollow}><SimpleLineIcons name="user-follow" size={24} color="white" /></TouchableOpacity>:null}</View>
            </>:null}
            
            </View>
            <View style={[
              {   flexDirection: 'row',
              width: '50%',
              alignSelf: 'center'
              }
            ]}>
                
               {usu ? <><TouchableOpacity onPress={() => navigation.navigate('FollowingScreen', {id: id, filtro: "1"})}><View><Text style={styles.foltext}>Following</Text><Text style={styles.foltextnum}>{usu.seguidos.length}</Text>
               </View></TouchableOpacity>
               <TouchableOpacity onPress={() => navigation.navigate('FollowingScreen', {id: id, filtro: "0"})}><View><Text style={styles.foltext}>Followers</Text><Text style={styles.foltextnum}>{usu.seguidores.length}</Text></View></TouchableOpacity></>:null}
            </View>
            <Text style={[
              {  color: theme.colors.text,
                paddingHorizontal: 10,
                fontFamily:'Raleway_400Regular',
                fontSize: 17,
                marginLeft: 7,
                marginTop: 20
              }
            ]}>Favourite albums</Text>
            {usu.favs ? <View style={[
              {   flexDirection: 'row',
              justifyContent: 'space-around'
              , marginTop: 15
              }
            ]}>
                { fav0 ?
                <Image source={{ uri: fav0.source }} style={styles.imagefav}></Image>: <Image style={styles.imagefav}></Image>}
                { fav1 ?
                <Image source={{ uri: fav1.source }} style={styles.imagefav}></Image>: <Image style={styles.imagefav}></Image>}
                { fav2 ?
                <Image source={{ uri: fav2.source }}style={styles.imagefav}></Image>: <Image style={styles.imagefav}></Image>}

            </View>:null}
            {usu ? <View style={[
                 {   paddingHorizontal: 20,
                    paddingVertical: 30
                }
                ]}>
                <TouchableOpacity onPress={() => navigation.navigate('UserReviews', {id: id})}><View style={[
                 {   flexDirection: 'row',
                 paddingVertical: 10
                }
                ]}>
                <FontAwesome5 name="newspaper" size={28} color="white" />
                <Text style={styles.link}>Reviews</Text>
                <Text style={styles.link2}>({usu.reviews.length})</Text>
                </View></TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('UserLists', {id: id})}><View style={[
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
                <TouchableOpacity onPress={() => navigation.navigate('UserRatings', {id: id})}><View style={[
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
        fontFamily:'Raleway_400Regular',
        paddingHorizontal: 10,
        fontSize: 20,
        textAlign: 'center',
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