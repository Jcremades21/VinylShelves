import React, { useState, useRef, useEffect, useContext, Component  } from 'react'
import { Alert, CheckBox, TouchableOpacity, StyleSheet, View, Modal, MsgBox, Text, SafeAreaView, ScrollView, Image, Pressable } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import { Credentials } from '../helpers/credentials';
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import PageHeader from '../components/PageHeader'
import Paragraph from '../components/Paragraph'
import CustomSlider from '../components/Carrousel'
import Loading from '../components/Loading';
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
import CustomSlider3 from '../components/CarrouselList';
 

export default function ListsScreen({ navigation }) {
    const [usutoken, setUsutoken] = useState('');  
    const [ourPicks, setourPicks] = useState([]);
    const [populars, setPopulars] = useState([]);
    const [newest, setnewest] = useState([]);
    const [token, setToken] = useState(''); 
    const [isLoading, setIsLoading] = useState(''); 

    React.useEffect(() => {
        let arrayalb = [];
        let arraypicks = ['627a9ff14dbfb6bc9f76a142','627aa0e04dbfb6bc9f76a696','627aa1604dbfb6bc9f76aa20','627aa37f4dbfb6bc9f76b3c2'];
        arraypicks.forEach( (element) => {
        let url = Url + "/listal?id=" + element;
        axios.get(url,
            {
                headers: { 'Content-Type': 'application/json',
                'x-token' : token },
                withCredentials: true
            }
        ).then((res) => {   
          //console.log(res.data);
          arrayalb.push(res.data.listas);
        })
        .catch((error) => {
          console.error(error)
            });
        });
        setourPicks(arrayalb);
        //console.log(ourPicks);
      },[]); 

      React.useEffect(() => {
        let arrayalb = [];
        let url = Url + "/listal";
        axios.get(url,
            {
                headers: { 'Content-Type': 'application/json',
                'x-token' : token },
                withCredentials: true
            }
        ).then((res) => {   
          arrayalb = res.data.listas.sort((a, b) => (a.likes.length + a.comentarios.length) > (b.likes.length + b.comentarios.length)  ? 1 : -1)
          arrayalb.slice(0, 6);
          setPopulars(arrayalb);
        })
        .catch((error) => {
          console.error(error)
            });
        //console.log(populars);
      },[]); 

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
        let url = Url + "/usuarios?id=" + ret.uid;
        axios(url, {
          headers: {
            'Content-Type' : 'application/json'
          },
          method: 'GET'
        })
        .then(res => {     
        //setUsunombre(res.data.usuarios.username);
        //cargamos albumes 7 dias de seguidores
        var date = new Date();
        date.setDate(date.getDate() - 7); //actividad de los últimos 3 días
        res.data.usuarios.seguidos.forEach( (element) => {
          let albums = []
          element.user_lists.forEach( (element2) => {
              let url2 = Url + "/listal?id=" + element2;
              console.log(url2);
              axios(url2, {
                headers: {
                  'Content-Type' : 'application/json'
                },
                method: 'GET'
              })
              .then(res3 => {
                console.log(res3.data.listas);
                var fecha = new Date(res3.data.listas.fecha);  
                if(fecha.getTime() > date.getTime() ){
                setnewest((newest) => newest.concat(res3.data.listas))
                }
                });
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
    }, []); 

    setTimeout(() => {
        setIsLoading(false);
      }, 300);
    if(isLoading) {
      return <Loading />;
    }
    return (
        <View style={styles.Fondo}>
            
        <ScrollView>
        <View style={styles.encabezado}>
        <PageHeader>Lists</PageHeader>
         </View>
         <View>
         {usutoken ? <Button mode="contained" style={styles.buttonTrack} onPress={() => navigation.navigate('NewListScreen', {id: '', nombre: '', artista: '', release_date: '', imagen: '', release_date_precision: '' })}><Entypo name="add-to-list" size={15} color="white" /><Text> </Text> Start your own list</Button>:<TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}><Text style={styles.link2}>Log In here to start creating lists</Text></TouchableOpacity>}
         </View>
         <LinearGradient
            // Button Linear Gradient
            colors={['#5F1880', '#713b8c', '#392F36']}
            style={styles.Banner}
            >      
            <Text style={styles.Divtext}>Our picks</Text>
            </LinearGradient> 
            <View>
            { ourPicks ? <CustomSlider3 navigation={navigation} data={ourPicks} />:null}
            </View>
            <LinearGradient
            // Button Linear Gradient
            colors={['#5F1880', '#713b8c', '#392F36']}
            style={styles.Banner}
            >      
                <Text style={styles.Divtext}>Popular this week</Text>
            </LinearGradient> 
            <View>
            { populars ? <CustomSlider3 navigation={navigation} data={populars} />:null}
            </View>
            <LinearGradient
            // Button Linear Gradient
            colors={['#5F1880', '#713b8c', '#392F36']}
            style={styles.Banner}
            >      
               {usutoken ? <Text style={styles.Divtext}>New from friends</Text>:<Text style={styles.Divtext}>All time favourites</Text>}
            </LinearGradient> 
            <View>
            { populars && newest && usutoken ? <CustomSlider3 navigation={navigation} data={newest} />:<CustomSlider3 navigation={navigation} data={populars}/> }
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
        marginTop: 0,
        alignItems: 'center'
    },
    Divtext:{
        fontSize: 17,
        marginTop: 16,
        color: theme.colors.text,
        fontFamily:'Raleway_400Regular' 
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