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

 

export default function ListsScreen({ navigation }) {
    const [usutoken, setUsutoken] = useState('');  

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

    return (
        <View style={styles.Fondo}>
        <ScrollView>
        <View style={styles.encabezado}>
        <PageHeader>Lists</PageHeader>
         <FlashMessage position="top" />
         </View>
         <View>
         {usutoken ? <Button mode="contained" style={styles.buttonTrack}><Entypo name="add-to-list" size={15} color="white" /><Text> </Text> Start your own list</Button>:<TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}><Text style={styles.link2}>Log In here to start creating lists</Text></TouchableOpacity>}
         </View>
         <LinearGradient
            // Button Linear Gradient
            colors={['#5F1880', '#713b8c', '#392F36']}
            style={styles.Banner}
            >      
                <Text style={styles.Divtext}>Our picks</Text>
            </LinearGradient> 
            <LinearGradient
            // Button Linear Gradient
            colors={['#5F1880', '#713b8c', '#392F36']}
            style={styles.Banner}
            >      
                <Text style={styles.Divtext}>Popular this week</Text>
            </LinearGradient> 
            <LinearGradient
            // Button Linear Gradient
            colors={['#5F1880', '#713b8c', '#392F36']}
            style={styles.Banner}
            >      
                <Text style={styles.Divtext}>Newest lists</Text>
            </LinearGradient> 
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