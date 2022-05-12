import React, { useState, useRef, useEffect, useContext, Component  } from 'react'
import { Alert, FlatList, CheckBox, TouchableOpacity, StyleSheet, View, Modal, MsgBox, Text, SafeAreaView, ScrollView, Image, Pressable } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import { Credentials } from '../helpers/credentials';
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import PageHeader from '../components/PageHeader'
import Paragraph from '../components/Paragraph'
import CustomSlider from '../components/Carrousel'
import Button from '../components/Button'
import Loading from '../components/Loading';
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
import CustomSlider3 from '../components/CarrouselList';


export default function AddtolistScreen({ navigation, route }) {
    const [usutoken, setUsutoken] = useState('');  
    const [listasUSU, setlistasUSU] = useState([]);
    const [token, setToken] = useState(''); 
    const [UID, setUID] = useState(''); 
    const [isLoading, setIsLoading] = useState(true); 
    const [search, setSearch] = useState({ value: '', error: '' })
    const [searchResults, setSearchResults] = useState([])
    const [albumToAdd, setAlbumToAdd] = useState('');
    const [load, setLoad] = useState(false);
    const { id, name, imagen, artista, release_date, release_date_precision} = route.params;
    const objetoparam = {
        id:id,name:name,imagen:imagen,artista:artista,release_date:release_date,release_date_precision:release_date_precision
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
        })
        .then(ret => {
        // found data go to then()
        //console.log(ret.useremail);
            setUsutoken(ret.token);
            setUID(ret.uid)
            //busqueda
            
            let cancel = false;
            let arraylist = [];

            let url = Url + "/listal?texto=" + search.value;
            console.log(url);
            axios.get(url,
                {
                    headers: { 'Content-Type': 'application/json',
                    'x-token' : usutoken },
                    withCredentials: true
                }
            ).then((res) => {   
              //console.log(res.data.listas);  
              console.log(UID); 
              res.data.listas.map(track => {
                if(ret.uid == track.usuario._id){
                arraylist.push(track);
                }
              })
              setSearchResults(arraylist);
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
    }, [search]); 

    React.useEffect(() => {
        let arraylist = [];
        console.log('effect');
        let url = Url + "/listal";
        axios.get(url,
            {
                headers: { 'Content-Type': 'application/json',
                'x-token' : usutoken },
                withCredentials: true
            }
        ).then((res) => {   
          //console.log(res.data.listas);               
          res.data.listas.map(track => {
            if(UID == track.usuario._id){
            arraylist.push(track);
            }
          })
          setlistasUSU(arraylist);
          console.log(listasUSU);
          console.log('setted');
        })
        .catch((error) => {
          console.error(error)
            });

      },[load]); 

      React.useEffect(() => {
        //if(!search) return setSearchResults([])

    }, [search]); 

      function addToList(list){
        //primero creamos album en bd
        //console.log(list)
        const track = {
            artista: artista,
            nombre: name,
            id: id,
            imagen: imagen,
            release_date: release_date,
            release_date_precision: release_date_precision 
        }
        let url = Url + "/albumes";
        axios.post(url,
            track,
            {
                headers: { 'Content-Type': 'application/json',
                'x-token' : usutoken },
                withCredentials: true
            }
        ).then((res) => {
          //console.log(res.data.album.uid);
          if(res.status){

          }
          let url3 = Url + "/albumes?id=" + res.data.album.uid ;
          axios.get(url3,
            {
                headers: { 'Content-Type': 'application/json',
                'x-token' : usutoken },
                withCredentials: true
            }
        ).then((res) => {
          //console.log(res.data.albumes);
          list.array.push(res.data.albumes.uid);
                //segundo añadimos ese álbum a nuestra lista
                let url2 = Url + "/listal/" + list.uid;
                console.log(url2);
                console.log(list)
                const lista1 = list;
                axios.put(url2,
                    lista1,
                {
                    headers: { 'Content-Type': 'application/json',
                    'x-token' : usutoken },
                    withCredentials: true
                }
                ).then((res3) => { 
                    console.log(res3.status)
                    showMessage({
                    message: "Album added to list!",
                    type: "success",
                    icon: "success"
                    });
                });
                setLoad(!load);

        })
        .catch((error) => {
          console.error(error)
            });
        });
        
      }
      function removeFromList(){

      }

      function compruebaADD(lista, obj){
        //console.log(lista);
        let esta = false;
        let url = Url + "/listal?id=" + lista.uid;
        //console.log(url);
        axios.get(url,
            {
                headers: { 'Content-Type': 'application/json',
                'x-token' : token },
                withCredentials: true
            }
        ).then((res) => {   
          //console.log(res.data.listas);
          res.data.listas.array.map((l, i) => {
            //console.log(l);
            if(objetoparam.id == l.id){
                esta = true;
            }
          })        
        })
        .catch((error) => {
          console.error(error)
            });
        
        if(esta==false){
        return <TouchableOpacity onPress={addToList.bind(this, lista)}><Ionicons name="add-sharp" size={24} color="white" /></TouchableOpacity>
          }
        else{
        return <TouchableOpacity onPress={removeFromList.bind(this, lista)}><Feather name="check-circle" size={24} color="green" /></TouchableOpacity>
        }
      }

      setTimeout(() => {
        setIsLoading(false);
      }, 100);
      if(isLoading) {
        return <Loading />;
      }

    return (
        <View style={styles.Fondo}>
        <ScrollView>
        <View style={styles.encabezado}>
        <BackButton goBack={navigation.goBack} />
        <PageHeader>Add to list</PageHeader>
         </View>
         <View style={styles.topbar}>
            <View style={styles.searchDiv1}> 
            <TouchableOpacity  style={[
                { 
                flexDirection: 'row'
                }
                ]} onPress={() => navigation.navigate('NewListScreen', {id: id, nombre: name, artista: artista, release_date: release_date, imagen: imagen, release_date_precision: release_date_precision })}><Ionicons name="add-circle-outline" size={24} color="white" /><Text style={styles.Divtext2}>New List</Text></TouchableOpacity>
            </View>
             <View style={styles.searchDiv}> 
                <Feather style={[
                { 
                marginBottom: 12,
                marginRight: 5
                }
                ]} name="search" size={24} color="white" />
                
                <TextInputE placeholder="Search by name" placeholderTextColor='rgba(255, 255, 255, 0.75)' 
                onChangeText={(text) => setSearch({ value: text, error: '' })}></TextInputE>
            </View>
         </View>
        <View style={styles.listasDiv}>
            {searchResults.map((track, i) => {
                return <View key={i} style={styles.divlists}>
                        <View style={[
                        { 
                        flexDirection: 'row'
                        }
                        ]}>{compruebaADD(track,objetoparam)}<Text numberOfLines={1} style={styles.Divtext}>{track.titulo}</Text></View>
                        <View style={[
                        { 
                        flexDirection: 'row'
                        }
                        ]}>{track.public == true && <><Fontisto name="world-o" size={24} color="white" /><Text style={styles.Divtext}> {track.array.length}</Text></>}
                        {track.public == false && <><Entypo name="lock" size={24} color="white" /><Text style={styles.Divtext}> {track.array.length}</Text></>}
                        </View>
                    </View>
            })}
         </View>
           
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
    searchDiv1:{
        flexDirection:'row',
        alignItems: 'center',
        width: '30%',
        marginLeft: 20
    },  
    searchDiv:{
        flexDirection:'row',
        alignItems: 'center',
        width: '50%'
    },  
    topbar:{
        flexDirection: 'row'
    },
    listasDiv:{
        paddingHorizontal: 25
      },
    divlists: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10
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
    Divtext:{
        fontSize: 17,
        color: theme.colors.text,
        fontFamily:'Raleway_400Regular' 
    },
    Divtext2:{
        fontSize: 15,
        color: theme.colors.text,
        fontFamily:'Raleway_700Bold' 
    },
    buttonTrack:{
        width: '70%',
        alignSelf: 'center',
        paddingBottom: 6,
      },
    encabezado:{
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',   
        marginTop: 30,
        fontFamily:'Raleway_400Regular',
        justifyContent: 'center'
    }
})