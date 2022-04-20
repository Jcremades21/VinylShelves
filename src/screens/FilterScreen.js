import React, { useState, useRef, useEffect, useContext, Component  } from 'react'
import { Alert, TouchableOpacity, StyleSheet, Switch, View, Modal, MsgBox, Text, SafeAreaView, ScrollView, Image, Pressable } from 'react-native'
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

export default function FilterScreen({ navigation, route }) {
    const [search, setSearch] = useState({ value: '', error: '' })
    const [searchResults, setSearchResults] = useState([])
    const [usutoken, setUsutoken] = useState('');  
    const [UID, setUID] = useState('');  
    const [token, setToken] = useState('');  
    const [val, setVal] = useState('');
    const { fibyalb, fibyart, fibyrev, filtralis, fibyuser } = route.params;
    const [isEnabled, setIsEnabled] = useState(fibyalb);
    const [isEnabled1, setIsEnabled1] = useState(fibyart);
    const [isEnabled2, setIsEnabled2] = useState(fibyrev);
    const [isEnabled3, setIsEnabled3] = useState(filtralis);
    const [isEnabled4, setIsEnabled4] = useState(fibyuser);

    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    const toggleSwitch1 = () => setIsEnabled1(previousState => !previousState);
    const toggleSwitch2 = () => setIsEnabled2(previousState => !previousState);
    const toggleSwitch3 = () => setIsEnabled3(previousState => !previousState);
    const toggleSwitch4 = () => setIsEnabled4(previousState => !previousState);

    const spotify = Credentials();  
    //console.log(searchResults);
    var spotifyApi = new SpotifyWebApi({
        clientId: 'd25870205635429285732c34594b8249',
        clientSecret: '508413bf4ea24a26ad44b70d831ae2bc'
      });
    
    function limpiaTodos(){
        setIsEnabled(false)
        setIsEnabled1(false)
        setIsEnabled2(false)
        setIsEnabled3(false)
        setIsEnabled4(false)
    }

    React.useEffect(() => {
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

    return (
        <View style={styles.Fondo}>
            <ScrollView>
            <View style={styles.encabezado}>
            <BackButton goBack={navigation.goBack} />
            <PageHeader>Filters</PageHeader>
            <TouchableOpacity onPress={limpiaTodos} style={[
              {   position: 'absolute',
              right: 1,
              marginRight: 20
              }
            ]}><Text style={styles.deleteText}>Delete all</Text></TouchableOpacity>
            </View>
            <View> 
               <Text style={styles.filterText1}>Filter search by</Text>
               <View style={styles.containerFilter}>
               <View style={styles.containerFilter1}>
               <Ionicons name="ios-people-circle-outline" size={24} color="white" style={[
                {   marginTop: 8
                }
                ]}/>
                   <Text style={styles.filterText}>Albums</Text>
                   </View>
                   <Switch
                        trackColor={{ false: "#767577", true: "#9e169a" }}
                        thumbColor={isEnabled ? "#D90FC8" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
               </View>
               <View style={styles.containerFilter}>
                   <View style={styles.containerFilter1}>
                   <MaterialCommunityIcons name="account-music" size={24} color="white" style={[
                {   marginTop: 8
                }
                ]}/>
                   <Text style={styles.filterText}>Artists</Text>
                   </View>
                   <Switch
                        trackColor={{ false: "#767577", true: "#9e169a" }}
                        thumbColor={isEnabled1 ? "#D90FC8" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch1}
                        value={isEnabled1}
                    />
               </View>
               <View style={styles.containerFilter}>
               <View style={styles.containerFilter1}>
               <FontAwesome5 name="newspaper" size={24} color="white" style={[
                {   marginTop: 8
                }
                ]}/>
                   <Text style={styles.filterText}>Reviews</Text>
                   </View>
                   <Switch
                        trackColor={{ false: "#767577", true: "#9e169a" }}
                        thumbColor={isEnabled2 ? "#D90FC8" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch2}
                        value={isEnabled2}
                    />
               </View>
               <View style={styles.containerFilter}>
               <View style={styles.containerFilter1}>
                <Entypo name="list" size={24} color="white" style={[
                {   marginTop: 8
                }
                ]}/>
                   <Text style={styles.filterText}>Lists</Text>
                   </View>
                   <Switch
                        trackColor={{ false: "#767577", true: "#9e169a" }}
                        thumbColor={isEnabled3 ? "#D90FC8" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch3}
                        value={isEnabled3}
                    />
               </View>
               <View style={styles.containerFilter}>
               <View style={styles.containerFilter1}>
               <Ionicons name="ios-people-circle-outline" size={24} color="white" style={[
                {   marginTop: 8
                }
                ]}/>
                   <Text style={styles.filterText}>Users</Text>
                   </View>
                   <Switch
                        trackColor={{ false: "#767577", true: "#9e169a" }}
                        thumbColor={isEnabled4 ? "#D90FC8" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch4}
                        value={isEnabled4}
                    />
               </View>
            </View>
            <View style={styles.containerButton}>
            <Button onPress={() => navigation.navigate('Landing', {
            screen: 'Search',
            params: {
                fibyalb: isEnabled,
                fibyart: isEnabled1,
                fibyrev: isEnabled2,
                fybylis: isEnabled3,
                fybyuse: isEnabled4
            },
            })} style={styles.button} mode="contained">Apply</Button>
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
    infoDiv:{
        flexDirection: 'row',
        paddingVertical: 7,
        paddingHorizontal: 10
    },
    noResultView: {
        width: '75%',
        alignItems: 'center',
        alignSelf:'center'
    },
    containerFilter1: {
        flexDirection: 'row'
    },
    containerFilter: {
        paddingHorizontal: 40,
        paddingVertical: 14,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    containerButton:{
        marginTop: 40    
    },
    button: {
        alignSelf: 'center',
        width: 200
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
        fontSize: 20
    },
    itemText2: {
      color: theme.colors.text,
      paddingHorizontal: 10,
      fontFamily:'Raleway_400Regular',
      fontSize: 20
    },
    restitle2:{
        paddingHorizontal: 10,
        width: 270
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
    filterText: {
        marginLeft: 10,
        marginTop: 7,
        fontSize: 18,
        fontFamily:'Raleway_400Regular',
        justifyContent: 'center',
        color: theme.colors.text
      },
    filterText1: {
        marginTop: 5,
        marginBottom: 10,
        marginLeft: 40,
        fontSize: 18,
        fontFamily:'Raleway_400Regular',
        justifyContent: 'center',
        color: theme.colors.text
      },
    deleteText: {
        marginTop: 5,
        fontSize: 15,
        fontFamily:'Raleway_700Bold',
        justifyContent: 'center',
        textAlign: 'center',
        color: theme.colors.secondary
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
        justifyContent: 'center',
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
})