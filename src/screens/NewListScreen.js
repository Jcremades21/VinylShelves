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
import { TextInput } from 'react-native-paper';
import TextInputE from '../components/TextInput';
import { showMessage, hideMessage } from "react-native-flash-message";
import FlashMessage from "react-native-flash-message";
import { Entypo } from '@expo/vector-icons'; 
import { Feather } from '@expo/vector-icons'; 
import moment from 'moment'
import { Fontisto } from '@expo/vector-icons'; 
import CheckBox from 'expo-checkbox';
import SearchDropDown from '../components/SearchDropdown';
 

export default function ListsScreen({ navigation, route }) {
    const [usutoken, setUsutoken] = useState('');  
    const [UID, setUID] = useState('');  
    const [token, setToken] = useState('');  
    const [listTitle, setlistTitle] = useState('');  
    const [listText, setlistText] = useState('');  setSearch
    const [toggleCheckBox, setToggleCheckBox] = useState(false)
    const [search, setSearch] = useState({ value: '', error: '' })
    const [optionsSel, setOptionsSel] = useState({ name: '', value: '' })
    const [searchResults, setSearchResults] = useState([])
    const [listContent, setListContent] = useState([])
    const [arrayContent, setArrayContent] = useState([])
    const [selectedLanguage, setSelectedLanguage] = useState();
    const [modalRVisible, setModalRVisible] = useState(false);
    const [trackadded, setTrackAdded] = useState(false);
    const [listcreated, setlistCreated] = useState('');  
    const { id, nombre, imagen, artista, release_date, release_date_precision } = route.params;

    const spotify = Credentials();  
    //console.log(searchResults);
    var spotifyApi = new SpotifyWebApi({
        clientId: 'd25870205635429285732c34594b8249',
        clientSecret: '508413bf4ea24a26ad44b70d831ae2bc'
      });
    
      React.useEffect(() => {
       if(id && trackadded==false){
        const track = {
          item:{
          artista: artista,
          nombre: nombre,
          id: id,
          imagen: imagen,
          release_date: release_date,
          release_date_precision: release_date_precision
          }
        }
        addToList(track);
        setTrackAdded(true)
        }  
      }, []); 

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
    
    function addToList(track){
      //console.log(track);
      setSearch({ value: '', error: '' }); 
      /*const data = {
        titulo : titleform,
        descripcion : textform,
        usuario : UID,
        array: listContent,
        public: !toggleCheckBox
      }*/
      let url = Url + "/albumes";
      console.log(track.item.release_date_precision);
      if(track.item.release_date_precision!='year'){
        let split = track.item.release_date.split('-');
        track.item.release_date = split[0];
      }    
      axios.post(url,
          track.item,
          {
              headers: { 'Content-Type': 'application/json',
              'x-token' : usutoken },
              withCredentials: true
          }
      ).then((res) => {
        console.log(res.data.album.uid);
        setArrayContent((arrayContent) => arrayContent.concat(res.data.album.uid))

      })
      .catch((error) => {
        console.error(error)
      });
      setListContent((listContent) => listContent.concat(track))
      //console.log(listContent);
    }
             let arrayconten = arrayContent
         let idalb = '';
         let url2 = Url + "/albumes";
         axios.get(url2,
             {
                 headers: { 'Content-Type': 'application/json',
                 'x-token' : token },
                 withCredentials: true
             }
         ).then((res) => {
          res.data.albumes.forEach( (element2, index2) => { 
            console.log(track.track.item.id);
            console.log(element2.id);
              if(element2.id == track.track.item.id){
                  idalb = element2.uid;
              }
            });
            console.log(idalb);
            arrayconten.forEach( (element, index) => { 
              if(element == idalb){
                arrayconten.splice(index,1);
                console.log('llega y borra');
              }
             });
         })
        
 
    function deleteTrack(track){
      console.log(track);
      let index = 0;
      let encontrado = false;
      listContent.map(track2 => {
        if(track2.item.nombre != track.track.item.nombre && encontrado == false){
          index++;
        }
        else{
          encontrado = true;
        }
      })
      setListContent(listContent.filter((_, i) => i !== index))
      console.log(listContent);
      
      
    }

    function saveList(){
      let stringList = [];
      /*listContent.map(track => {
        stringList.push(track.item);
      });*/
      console.log(arrayContent);

      try {
        let titleform = listTitle.value;
        let textform = listText.value;
        const data = {
          titulo : titleform,
          descripcion : textform,
          usuario : UID,
          array: arrayContent,
          public: !toggleCheckBox
        }
        let url = Url + "/listal";
        axios.post(url,
            data,
            {
                headers: { 'Content-Type': 'application/json',
                'x-token' : usutoken },
                withCredentials: true
            }
        ).then((res) => {
          console.log(res.data);
          setlistCreated(res.data.lista.uid)
          setModalRVisible(true);
        })
        .catch((error) => {
          console.error(error)
        });
        
        } catch (err) {
        console.log(err);
      }
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
                    }
                    
                    }))
                   });
            });}
        getData();

        return () => cancel = true;
    }, [search]); 

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
              fontSize: 17
              }
            ]}>Review added succesfully!</Text>
            <TouchableOpacity onPress={() => navigation.navigate('DetailListScreen', {id: listcreated})}><Text style={styles.link}>Go to your list page!</Text></TouchableOpacity>
            <Button mode="contained" style={styles.buttonTrack} onPress={() => navigation.navigate('Dashboard')}>OK</Button>
            </View>
          </View>
        
          </ScrollView>
        </View>
      </Modal>
      <View style={styles.encabezado}>
      <BackButton goBack={navigation.goBack}/>
      <PageHeader>New List</PageHeader>
      </View>
      <View style={styles.container}>
      <Text style={[
              { fontFamily:'Raleway_400Regular',
              paddingVertical: 4,
              color: theme.colors.text,
              fontSize: 18
              }
            ]}>Name</Text>
            <TextInputE 
            onChangeText={(text) => setlistTitle({ value: text, error: '' })}></TextInputE>
            <Text style={[
              { fontFamily:'Raleway_400Regular',
              paddingVertical: 4,
              color: theme.colors.text,
              fontSize: 18
              }
            ]}>Description</Text>
            <TextInput multiline={true} 
            numberOfLines={4} style={styles.input}
            onChangeText={(text) => setlistText({ value: text, error: '' })}></TextInput>
            <View style={styles.checkboxContainer}>
            <CheckBox style={styles.checkbox} value={toggleCheckBox} onValueChange={setToggleCheckBox} />
                <Text style={styles.label}>Private</Text>
            </View>
            <Text style={[
              { fontFamily:'Raleway_400Regular',
              paddingVertical: 4,
              color: theme.colors.text,
              fontSize: 18
              }
            ]}>Add albums to your list</Text>
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
            {search.value != '' && <View style={styles.container2}>
                  <View style={styles.subContainer}>
                      {
                          searchResults.length ?

                              searchResults.slice(0, 4).map(item => {
                                  return (
                                      <TouchableOpacity style={styles.itemView} onPress={() => addToList({item})}>
                                      <View style={styles.infoDiv}>
                                          <Image source={{ uri: item.imagen }} style={styles.image2}  />
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
            <View>
                {listContent.map((track, i) => {
                    return <View key={i} style={styles.resul}>
                    <Image source={{ uri: track.item.imagen }} style={styles.image}  />
                    <View style={styles.restitle}>
                    <Text numberOfLines={1} style={[
                    { fontFamily:'Raleway_700Bold',
                    paddingVertical: 4,
                    color: theme.colors.text,
                    fontSize: 18
                    }
                    ]}>{track.item.nombre}</Text>
                    <Text numberOfLines={1} style={[
                    { fontFamily:'Raleway_400Regular',
                    paddingVertical: 4,
                    color: theme.colors.text,
                    fontSize: 18
                    }
                    ]}>{track.item.artista}</Text>
                    </View>
                    <TouchableOpacity onPress={() => deleteTrack({track})}><Entypo name="circle-with-cross" size={24} color="white" /></TouchableOpacity>
                     </View>

                })}
               
              
            </View>
            
            <Button
              mode="contained"
              onPress={saveList}
              >
                Save
            </Button>

        </View>
        </ScrollView>
      </View>
    );
}

const styles = StyleSheet.create({
    Fondo:{
        backgroundColor: '#392F36',
        height: '100%',
        fontFamily: 'Raleway_400Regular',
    },
    reviewView:{
      alignItems: 'center'
    },
    restitle:{
        paddingHorizontal: 10,
        width: 187
    },
    restitle2:{
      paddingHorizontal: 10,
      width: 240
    },
    image: {
        width: 70,
        height: 70,
        marginLeft: 0,
        alignItems:'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 5
    },
    image2: {
      width: 40,
      height: 40,
      marginLeft: 5,
      alignItems:'center',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.3)',
      borderRadius: 5
    },
    centeredView:{
      height: '100%'
    },
    resul:{
        flexDirection: 'row',
        paddingVertical: 1,
        paddingHorizontal: 1,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 10,
        marginHorizontal: 15,
        marginVertical: 3,
        backgroundColor: 'rgba(152, 152, 152, 0.45)'
    },
    searchDiv:{
        flexDirection:'row',
        alignItems: 'center',
        width: '90%'
    },  
    checkboxContainer: {
        flexDirection: "row",
        marginBottom: 20,
      },
    checkbox: {
        margin: 8,
        
      },
    label: {
        margin: 8,
        fontFamily: 'Raleway_400Regular',
        color: theme.colors.text,
    },
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
        marginTop: 16,
        color: theme.colors.text,
        fontFamily:'Raleway_400Regular' 
    },
    buttonTrack:{
        marginTop: 20,
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
    },
    container:{
        width: '100%',
        height: '100%',
        paddingHorizontal: 20,
    },
    container2: { 
     marginTop: -18,
     marginLeft: 15
    },
    subContainer: {
        backgroundColor: '#672f78',
        paddingTop: 10,
        marginHorizontal: 15,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center'
        
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
        color: 'black',
        paddingHorizontal: 10,
        fontFamily:'Raleway_700Bold',
    },
    itemText2: {
      color: 'black',
      paddingHorizontal: 10,
      fontFamily:'Raleway_400Regular',
    },
    noResultView: {
        alignSelf: 'center',
        // margin: 20,
        height: 100,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
    },
    noResultText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white'
    },
    modalView: {
      top: '5%',
      margin: 20,
      marginTop: 100,
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
    link:{
      fontFamily: 'Raleway_700Bold',
      color: theme.colors.secondary,
      marginTop: 15,
      fontSize: 15,
    },
    infoDiv:{
      flexDirection: 'row'
    }
})