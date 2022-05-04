import React, { useState, useRef, useEffect, useContext, Component  } from 'react'
import { Alert, FlatList, TouchableOpacity, StyleSheet, View, Modal, MsgBox, Text, SafeAreaView, ScrollView, Image, Pressable } from 'react-native'
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
import { Picker } from '@react-native-picker/picker';

export default function UserLists({ navigation, route }) {
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
    const [selectedSort, setSelectedSort] = useState('2');
    const [load, setLoad] = useState(false);
    const [search, setSearch] = useState({ value: '', error: '' })
    const [searchResults, setSearchResults] = useState([])
    const [image, setImage] = useState('')
    const { id } = route.params;
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
              //console.log(res.data); 
              setUsu(res.data.usuarios);
              console.log(res.data.usuarios);
              switch(selectedSort) {
                case '1':
                  break;
                case '2':
                  setSearchResults(res.data.usuarios.user_lists)
                  break;
                case '3':
                  setSearchResults(res.data.usuarios.list_liked)
                  break;
                default:
              }
            })
            .catch((error) => {
              console.error(error)
                });

        })
        .catch(err => {
        // any exception including data not found
        // goes to catch()
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
              //console.log(res.data); 
              setUsu(res.data.usuarios);
              console.log(res.data.usuarios);
              switch(selectedSort) {
                case '1':
                  break;
                case '2':
                  setSearchResults(res.data.usuarios.user_lists)
                  break;
                case '3':
                  setSearchResults(res.data.usuarios.list_liked)
                  break;
                default:
              }
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
    }, [load, selectedSort]); 

      var modalBackgroundStyle = {
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
      };
    
    return (
        <View style={styles.Fondo}>
            <ScrollView>
            <View style={styles.encabezado}>
            <BackButton goBack={navigation.goBack} />
            {usu ? <PageHeader>{usu.username}'s lists</PageHeader>:null}
            </View>
            <View style={styles.lista}>
            <Picker
            selectedValue={selectedSort}
            itemStyle={{ backgroundColor: "grey", color: "blue", fontSize:17 }}
            mode= 'dropdown'
            style={[
                { width: 160
                }
            ]}
            onValueChange={(itemValue, itemIndex) =>
                setSelectedSort(itemValue)
            }>
            <Picker.Item label="Lists created" color="#f545e3" value="2" />
            <Picker.Item label="Lists liked" color="#f545e3" value="3" />
            </Picker>
            <FlatList
            data={searchResults}
            renderItem={({ item }) => (
                <><View style={{ flex: 1, flexDirection: 'column', margin: 1 , alignItems: 'center', marginBottom: 5}}>
                <TouchableOpacity onPress={() => navigation.navigate('DetailListScreen', { id: item._id })}>
                                      <View style={styles.infoDiv}>
                                      <View style={styles.tracks}>
                                        {
                                            item.portadas.slice(0, 4).map((track, i) => ( 
                                                <Image style={styles.imagealb} source={{uri : track}}></Image>
                                            ))
                                        }
                                        </View>
                                          <View  style={styles.reslista}>
                                          <View style={styles.icondiv}>
                                          <Text numberOfLines={1} style={styles.itemTextLista}>{item.titulo}</Text>
                                          <Entypo name="list" size={24} color="white" />
                                          </View>
                                          </View>
                                      </View>
                    </TouchableOpacity>
                </View></>
                )}
                numColumns={1}
                keyExtractor={(item, index) => index}
            />
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
    like: {
        color: theme.colors.text,
        fontFamily: 'Raleway_400Regular',
        fontSize: 14,
        marginLeft: 4
    },
    icons:{
        flexDirection: 'row',
        alignSelf: 'flex-end',
        position: 'absolute',
        bottom: 5,
        right: 37
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
      fontFamily:'Raleway_700Bold',
      fontSize: 20,
      marginTop: 0,
      width: 170
    },
    lista:{
        paddingHorizontal: 10
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
    itemTextLista2: {
        color: theme.colors.text,
        paddingHorizontal: 10,
        fontFamily:'Raleway_400Regular',
        fontSize: 17,
        width: 185
    },
    itemText2: {
      color: theme.colors.text,
      paddingHorizontal: 10,
      fontFamily:'Raleway_400Regular',
      fontSize: 17,
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
        width: 100,
        height: 100,
        alignItems:'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 5,
        marginLeft: 35
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
        marginTop: 5,
        marginLeft: 15
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