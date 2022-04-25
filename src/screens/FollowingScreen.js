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

export default function FollowingScreen({ navigation, route }) {
    const [usu, setUsu] = useState('');  
    const [UID, setUID] = useState('');  
    const [token, setToken] = useState('');  
    const [usutoken, setUsutoken] = useState(''); 
    const [load, setLoad] = useState(false);
    const [search, setSearch] = useState({ value: '', error: '' })
    const [searchResults, setSearchResults] = useState([])
    const [listaSocial, setListaSocial] = useState([])
    const [image, setImage] = useState('')
    const { id, filtro } = route.params;
    const [selectedSort, setSelectedSort] = useState(filtro);
    const [selectedSort1, setSelectedSort1] = useState('');
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
              console.log(res.data); 
              setUsu(res.data.usuarios);
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

    React.useEffect(() => {
        //console.log(selectedSort);
        let url = Url + "/usuarios?id=" + id;
          axios.get(url,
              {
                  headers: { 'Content-Type': 'application/json',
                  'x-token' : usutoken },
                  withCredentials: true
              }
          ).then((res) => {
            let array = [];
            if(selectedSort == '0'){
            array = res.data.usuarios.seguidores;
            }
            else {
            array = res.data.usuarios.seguidos;
            }
            switch(selectedSort1) {
              case '1':
                break;
              case '2':
                array.sort((a, b) => (a.seguidores.length) > (b.seguidores.length) ? 1 : -1)
                break;
              case '3':
                array.sort((a, b) => a.nombre > b.nombre ? 1 : -1)
                break;
              case '4':
                break;
              default:
            }
            setListaSocial(array)
          })
          .catch((error) => {
            console.error(error)
          });     

    }, [selectedSort, selectedSort1]); 

      var modalBackgroundStyle = {
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
      };
    
    return (
        <View style={styles.Fondo}>
            <ScrollView>
            <View style={styles.encabezado}>
            <BackButton goBack={navigation.goBack} />
            <PageHeader>Social</PageHeader>
            </View>
            <View style={[
                {   paddingHorizontal: 15,
                  marginTop: 15,
                  flexDirection: 'row'
                }
                ]}>
            <Picker
            selectedValue={selectedSort}
            itemStyle={{ backgroundColor: "grey", color: "blue", fontSize:17 }}
            mode= 'dropdown'
            style={[
                { width: 155
                }
            ]}
            onValueChange={(itemValue, itemIndex) =>
                setSelectedSort(itemValue)
            }>
            <Picker.Item label="Followers" color="#f545e3" value="0" />
            <Picker.Item label="Following" color="#f545e3" value="1" />
            </Picker>
            <Picker
            selectedValue={selectedSort}
            itemStyle={{ backgroundColor: "grey", color: "blue", fontSize:17 }}
            mode= 'dropdown'
            style={[
                { width: 160
                }
            ]}
            onValueChange={(itemValue, itemIndex) =>
                setSelectedSort1(itemValue)
            }>
            <Picker.Item label="Default order" color="#f545e3" value="1" />
            <Picker.Item label="Popularity" color="#f545e3" value="2" />
            <Picker.Item label="Alphabetical" color="#f545e3" value="3" />
            </Picker>
            </View>
            <View style={styles.lista}>
            { listaSocial.length ?
            <><FlatList
                            data={listaSocial}
                            renderItem={({ item }) => (
                                <><View style={{ flex: 1, flexDirection: 'column', margin: 1, alignItems: 'center', marginBottom: 5 }}>
                                    <TouchableOpacity onPress={() => navigation.navigate('UserScreen', { id: item._id })}>
                                        <View style={styles.infoDiv}>
                                            <Image source={{ uri: item.imagen }} style={styles.image2} />
                                            <Text numberOfLines={1} style={styles.itemText}>{item.username}</Text>
                                            <View>
                                                <Paragraph><Text style={styles.itemText2}>{item.reviews.length}</Text><Text style={styles.itemText3}> reviews </Text><Text style={styles.itemText2}>{item.user_lists.length+item.list_liked.length}</Text><Text style={styles.itemText3}> lists</Text></Paragraph>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View></>
                            )}
                            numColumns={2}
                            keyExtractor={(item, index) => index} /></>
            :null}
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
    },
    infoDiv:{
        paddingVertical: 7,
        paddingHorizontal: 10,
        alignItems: 'center'
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
      fontFamily:'Raleway_700Bold',
      fontSize: 18,
      marginTop: 5,
    },
    lista:{
        paddingHorizontal: 10
    },
    itemText3: {
        color: theme.colors.secondary,
        paddingHorizontal: 10,
        fontFamily:'Raleway_400Regular',
        fontSize: 17,
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
      fontSize: 17,
      width: 185
    },
    restitle2:{
        paddingHorizontal: 10,
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