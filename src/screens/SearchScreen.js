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

export default function SearchScreen({ navigation, route }) {
    const [search, setSearch] = useState({ value: '', error: '' })
    const [searchResults, setSearchResults] = useState([])
    const [searchResultsArtists, setSearchResultsArtist] = useState([])
    const [searchResultsAlbums, setSearchResultsAlbums] = useState([])
    const [searchResultsUsers, setSearchResultsUser] = useState([])
    const [searchResultsReview, setSearchResultsReview] = useState([])
    const [searchResultsList, setSearchResultsList] = useState([])
    const [usutoken, setUsutoken] = useState('');  
    const [filtraalb, setFiltraalb] = useState(true);  
    const [filtraart, setFiltraart] = useState(true);  
    const [filtralis, setFiltralis] = useState(true);
    const [filtrarev, setFiltrarev] = useState(true);    
    const [filtrauser, setFiltrauser] = useState(true);  

    const [UID, setUID] = useState('');  
    const [token, setToken] = useState('');  
    const [val, setVal] = useState('');
    const spotify = Credentials();  
    //console.log(searchResults);
    var spotifyApi = new SpotifyWebApi({
        clientId: 'd25870205635429285732c34594b8249',
        clientSecret: '508413bf4ea24a26ad44b70d831ae2bc'
      });

    React.useEffect(() => {
        if(route.params){
            //primero cambiamos todos a false
            setFiltraart(false);
            setFiltraalb(false);
            setFiltralis(false);
            setFiltrarev(false);
            setFiltrauser(false);
        //y ahora comprobamos que filtro activar
        if(JSON.stringify(route.params.fibyalb) == 'true'){
            setFiltraalb(true);
        }
        if(JSON.stringify(route.params.fibyart) == 'true'){
            setFiltraart(true);
        }
        if(JSON.stringify(route.params.fibyrev) == 'true'){
            setFiltrarev(true);
        }
        if(JSON.stringify(route.params.fybylis) == 'true'){
            setFiltralis(true);
        }
        if(JSON.stringify(route.params.fybyuse) == 'true'){
            setFiltrauser(true);
        }
        if(JSON.stringify(route.params.fibyalb) == 'false' && JSON.stringify(route.params.fibyart) == 'false' && JSON.stringify(route.params.fibyrev) == 'false'  && JSON.stringify(route.params.fybylis) == 'false' && JSON.stringify(route.params.fybyuse) == 'false' ){
            setFiltraart(true);
            setFiltraalb(true);
            setFiltralis(true);
            setFiltrarev(true);
            setFiltrauser(true);
        }
    }
    }, [route.params]); 

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
                    }
                    
                    }))
                   });
              let url2 = 'https://api.spotify.com/v1/search?q='+ search.value +'&type=artist';
              axios(url2, {
                    method: 'GET',
                    headers: { 'Authorization' : 'Bearer ' + tokenResponse.data.access_token}
                  })
                  .then (artistResponse => { 
                      if (cancel) return       
                   setSearchResultsArtist(artistResponse.data.artists.items.map(artist => {
                    return{
                        id: artist.id,
                        imagen: artist.images[0].url ,
                        nombre: artist.name
                    }
                    }))
                   });
             let url3 = Url + "/usuarios?texto=" + search.value;
             if(search.value=='')
             url3 = Url + "/usuarios?texto=placeholderparaquenoencuentre";
              axios(url3, {
                    method: 'GET',
                    headers: { 'Authorization' : 'Bearer ' + tokenResponse.data.access_token}
                  })
                  .then (userResponse => { 
                      if (cancel) return       
                   setSearchResultsUser(userResponse.data.usuarios.map(user => {
                    return{
                        id: user.uid,
                        imagen: user.imagen ,
                        nombre: user.username
                    }
                    }))
                   });
                let url4 = Url + "/reviews?texto=" + search.value;
                if(search.value=='')
                url4 = Url + "/reviews?texto=placeholderparaquenoencuentre";
                        axios(url4, {
                            method: 'GET',
                            headers: { 'Authorization' : 'Bearer ' + tokenResponse.data.access_token}
                            })
                            .then (reviewResponse => { 
                                if (cancel) return       
                            setSearchResultsReview(reviewResponse.data.reviews.map(rev => {
                            let imguri = '';
                            spotifyApi.getAlbum(rev.album).then(
                                function(albumResponse) {
                                    imguri = albumResponse.body.images[0].url;
                                  },
                                  function(err) {
                                    console.error(err);
                                  }
                            )
                            return{
                                id: rev.uid,
                                imagen: rev.albumimg,
                                nombre: rev.titulo,
                                user: rev.usuario.username
                            }
                            }))
                            });
                    let url5 = Url + "/listal?texto=" + search.value;
                    if(search.value=='')
                    url5 = Url + "/listal?texto=placeholderparaquenoencuentre";
                                    axios(url5, {
                                        method: 'GET',
                                        headers: { 'Authorization' : 'Bearer ' + tokenResponse.data.access_token}
                                        })
                                        .then (listaResponse => { 
                                            console.log(listaResponse.data);
                                            if (cancel) return       
                                        setSearchResultsList(listaResponse.data.listas.map(lista => {
                                        return{
                                            id: lista.uid,
                                            array: lista.array,
                                            nombre: lista.titulo,
                                            user: lista.usuario.username
                                        }
                                        }))
                            });
            });}
        getData();

        return () => cancel = true;
    }, [search]);
      
    function resetSearch(){
       setSearch({ value: '', error: '' })
    }
    return (
        <View style={styles.Fondo}>
            <ScrollView>
            <View style={styles.encabezado}>
            <PageHeader>Search</PageHeader>
            </View>
            <View style={styles.searchDiv}> 
                <Feather style={[
                { 
                marginBottom: 12,
                marginRight: 5
                }
                ]} name="search" size={24} color="white" />
                
                <TextInputE value={search.value} placeholder="Search for anything" placeholderTextColor='rgba(255, 255, 255, 0.75)' 
                onChangeText={(text) => setSearch({ value: text, error: '' })}></TextInputE>
                
                <View style={[
                        { 
                            flexDirection: 'row'
                        }
                ]}>
                <TouchableOpacity onPress={resetSearch} style={[
                { 
                marginTop: 4,
                marginLeft: 5
                }
                ]}><Feather name="x-circle" size={24} color="white" /></TouchableOpacity>
                { route.params ? <TouchableOpacity onPress={() => navigation.navigate('FilterScreen', { fibyalb: route.params.fibyalb, fibyart: route.params.fibyart, filtralis: route.params.fybylis, fibyrev: route.params.fibyrev, fibyuser: route.params.fybyuse })} style={[
                { 
                marginBottom: 12,
                marginLeft: 5
                }
                ]} ><MaterialIcons name="filter-list" size={32} color="white" />
                </TouchableOpacity>:null}
                <TouchableOpacity onPress={() => navigation.navigate('FilterScreen', { fibyalb: false, fibyart: false, filtralis: false, fibyrev: false, fibyuser: false })} style={[
                { 
                marginBottom: 12,
                marginLeft: 5
                }
                ]} ><MaterialIcons name="filter-list" size={32} color="white" />
                </TouchableOpacity>  
                    
                </View>
            </View>
            {search.value == '' && 
            <View
            style={styles.noResultView}>
                <Text style={styles.beginText}>Search for albums, artists, members and more...</Text>
            </View>
            }
            {search.value != '' && <View style={styles.container2}>
                  <View style={styles.subContainer}>
                  {
                          searchResultsList.length && filtralis == true ?

                          searchResultsList.slice(0, 6).map(item => {
                                  return (
                                    <TouchableOpacity onPress={() => navigation.navigate('DetailListScreen', { id: item.id })}>
                                      <View style={styles.infoDiv}>
                                      <View style={styles.tracks}>
                                        {item.array.slice(0, 4).map((track, i) => ( 
                                            <Image key={i} style={styles.imagealb} source={{ uri: track.imagen }}></Image>                
                                        ))}
                                        </View>
                                          <View  style={styles.reslista}>
                                          <View style={styles.icondiv}>
                                          <Text numberOfLines={1} style={styles.itemTextLista}>{item.nombre}</Text>
                                          <Entypo name="list" size={24} color="white" />
                                          </View>
                                          <Text numberOfLines={1} style={styles.itemText2}>by {item.user}</Text>
                                          </View>
                                      </View>
                                      </TouchableOpacity>

                                  )
                              })

                              :
                              null
                    }
                  {
                          searchResultsReview.length && filtrarev == true ?

                          searchResultsReview.slice(0, 6).map(item => {
                                  return (
                                    <TouchableOpacity onPress={() => navigation.navigate('ReviewScreen', { id: item.id })}>
                                      <View style={styles.infoDiv}>
                                          <Image source={{ uri: item.imagen }} style={styles.image2}  />
                                          <View  style={styles.restitle2}>
                                            <View style={styles.icondiv}>                                              
                                          <Text numberOfLines={1} style={styles.itemText}>{item.nombre}</Text>
                                          <FontAwesome5 name="newspaper" size={24} color="white" />
                                            </View>
                                          <Text numberOfLines={1} style={styles.itemText2}>by {item.user}</Text>
                                          </View>
                                      </View>
                                      </TouchableOpacity>

                                  )
                              })

                              :
                              null
                    }
                    {
                          searchResultsUsers.length && filtrauser == true ?

                          searchResultsUsers.slice(0, 4).map(item => {
                                  return (
                                    <TouchableOpacity onPress={() => navigation.navigate('Profile', { id: item.id })}>
                                      <View style={styles.infoDiv}>
                                          <Image source={{ uri: item.imagen }} style={styles.image2}  />
                                          <View  style={styles.restitle2}>
                                            <View style={styles.icondiv}>
                                          <Text numberOfLines={1} style={styles.itemText}>{item.nombre}</Text>
                                          <Ionicons name="ios-people-circle-outline" size={24} color="white" />
                                            </View>
                                          <Text numberOfLines={1} style={styles.itemText2}>{item.artista}</Text>
                                          </View>
                                      </View>
                                      </TouchableOpacity>

                                  )
                              })

                              :
                              null
                    }
                  {
                          searchResultsArtists.length && filtraart == true ?

                          searchResultsArtists.slice(0, 4).map(item => {
                                  return (
                                    <TouchableOpacity onPress={() => navigation.navigate('ArtistScreen', { id: item.id })}>
                                      <View style={styles.infoDiv}>
                                          <Image source={{ uri: item.imagen }} style={styles.image2}  />
                                          <View style={styles.restitle2}>
                                             <View style={styles.icondiv}> 
                                          <Text numberOfLines={1} style={styles.itemText}>{item.nombre}</Text>
                                          <MaterialCommunityIcons name="account-music" size={24} color="white" />
                                             </View>
                                          </View>
                                      </View>
                                      </TouchableOpacity>

                                  )
                              })

                              :
                              null
                      }
                      {
                          searchResults.length && filtraalb == true ?

                              searchResults.slice(0, 8).map(item => {
                                  return (
                                    <TouchableOpacity onPress={() => navigation.navigate('AlbumScreen', { id: item.id })}>
                                      <View style={styles.infoDiv}>
                                          <Image source={{ uri: item.imagen }} style={styles.image2}  />
                                          <View style={styles.restitle2}>
                                            <View style={styles.icondiv}>
                                          <Text numberOfLines={1} style={styles.itemText}>{item.nombre}</Text>
                                          <MaterialIcons name="album" size={24} color="white" />
                                            </View>
                                          <Text numberOfLines={1} style={styles.itemText2}>{item.artista}</Text>
                                          </View>
                                      </View>
                                      </TouchableOpacity>

                                  )
                              })

                              :
                              <View
                                  style={styles.noResultView}>
                                  <Text style={styles.beginText}>No search items matched</Text>
                              </View>
                      }
                      

                  </View>
              </View>}
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
        marginVertical: 3,
        marginHorizontal: 10,
        borderRadius: 10
    },
    noResultView: {
        width: '75%',
        alignItems: 'center',
        alignSelf:'center'
    },
    itemView: {
        // marginHorizontal: '10%',
        backgroundColor: 'white',
        height: 60,
        width: '95%',
        marginBottom: 10,
        justifyContent: 'center',
        borderRadius: 4, 
    },
    itemText: {
        color: theme.colors.text,
        paddingHorizontal: 10,
        fontFamily:'Raleway_700Bold',
        fontSize: 20,
        width: 190
    },
    itemTextLista: {
        color: theme.colors.text,
        paddingHorizontal: 10,
        fontFamily:'Raleway_700Bold',
        fontSize: 20,
        width: 175
    },
    itemText2: {
      color: theme.colors.text,
      paddingHorizontal: 10,
      fontFamily:'Raleway_400Regular',
      fontSize: 20
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
        width: 80,
        height: 80,
        marginLeft: 5,
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
})