import React, { useState, useRef, useEffect, useContext } from 'react'
import { Alert, FlatList, TouchableOpacity, StyleSheet, View, Modal, MsgBox, Text, SafeAreaView, ScrollView, Image } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import { Credentials } from '../helpers/credentials';
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import PageHeader from '../components/PageHeader'
import Paragraph from '../components/Paragraph'
import CustomSlider from '../components/Carrousel'
import CustomSlider2 from '../components/CarrouselReviews'
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
import { Picker } from '@react-native-picker/picker';
import moment from 'moment'
import { Fontisto } from '@expo/vector-icons'; 

import {
    useFonts,
    Raleway_300Light,
    Raleway_400Regular,
    Raleway_700Bold,
    Raleway_300Light_Italic,
    Raleway_400Regular_Italic,
  } from '@expo-google-fonts/raleway';

export default function AlbumScreen({ navigation, route }) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [token, setToken] = useState(''); 
  const [usutoken, setusuToken] = useState('');   
  const [list, setList] = useState(''); 
  const [listofalb, setListofalb] = useState(''); 
  const [liked, setLiked] = useState('');   
  const [UID, setUsuUID] = useState('');  
  const [modalDVisible, setModalDVisible] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const { id } = route.params;
  const [arraycoms , setArraycoms] = useState([]);
  const [load, setLoad] = useState(false);
  const [selectedSort, setSelectedSort] = useState();
  const [comment, setComment] = useState({ value: '', error: '' })
  const [inter, setInter] = useState('');

    
  const spotify = Credentials();  
  //insfav();
      
  //llamada API 
  const favsfromapi = [];  
  const newsfromapi = [];


  //llamada album favs
  let [fontsLoaded] = useFonts({
    Raleway_400Regular,
    Raleway_700Bold,
    Raleway_400Regular_Italic
    });

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
        }).then(ret => {
          // found data go to then()
          //console.log(ret.useremail);  
          setUsuUID(ret.uid);
          let array = [];//cargamos lista
          let arraycom = [];
          let url = Url + "/listal?id=" + id;
          axios.get(url,
              {
                  headers: { 'Content-Type': 'application/json',
                  'x-token' : token },
                  withCredentials: true
              }
          ).then((res) => {
            console.log(res.data);
            setInter(moment.utc(res.data.listas.fecha).local().startOf('seconds').fromNow());
            res.data.listas.comentarios.forEach( (element) => {
                let url = Url + "/comentarios/?id=" + element._id;
                  axios.get(url,
                      {
                          headers: { 'Content-Type': 'application/json',
                          'x-token' : token },
                          withCredentials: true
                      }
                    ).then((res) => {
                      console.log(res.data);
                      arraycom.push(res.data.comentarios);
                      setArraycoms(arraycom);
                    });
                  });
            setList(res.data.listas)
            setListofalb(res.data.listas.array)
            res.data.listas.likes.forEach( (element2) => {
              if(element2 == ret.uid){
                  setLiked(true);
              }
            });
          })
          .catch((error) => {
            console.error(error)
          });
        })
        .catch(err => {
          // any exception including data not found
          // goes to catch()
          let array = [];//cargamos lista
          let arraycom = [];
          let url = Url + "/listal?id=" + id;
          axios.get(url,
              {
                  headers: { 'Content-Type': 'application/json',
                  'x-token' : token },
                  withCredentials: true
              }
          ).then((res) => {
            console.log(res.data);
            setInter(moment.utc(res.data.listas.fecha).local().startOf('seconds').fromNow());
            res.data.listas.comentarios.forEach( (element) => {
                let url = Url + "/comentarios/?id=" + element._id;
                  axios.get(url,
                      {
                          headers: { 'Content-Type': 'application/json',
                          'x-token' : token },
                          withCredentials: true
                      }
                    ).then((res) => {
                      console.log(res.data);
                      arraycom.push(res.data.comentarios);
                      setArraycoms(arraycom);
                    });
                  });
            setList(res.data.listas)
            setListofalb(res.data.listas.array)
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
       
     }, [load]); 

     function addLike(){
      let url = Url + "/listal/" + id;
      let like = list.likes;
      like.push(UID);
      const lista = {
        titulo: list.titulo,
        array: list.array,
        comentarios: list.comentarios,
        usuario: list.usuario,
        public: list.public,
        descripcion: list.descripcion,
        fecha: list.fecha,
        likes : like
       }
       console.log(lista);
      axios.put(url,
       lista,
       {
           headers: { 'Content-Type': 'application/json',
           'x-token' : token },
           withCredentials: true
       }
       ).then((res) => { 
         setLiked(true);
         showMessage({
           message: "List saved to your likes!",
           type: "success",
           icon: "success"
         });
       });
     }

     function quitLike(){
      let url = Url + "/listal/" + id;
      let like = list.likes;
      like.forEach( (element, index) => { //lo borramos del usuario
        if(element == UID){
          like.splice(index,1);
          console.log('deleted');
        }
       });
       const lista = {
        titulo: list.titulo,
        array: list.array,
        comentarios: list.comentarios,
        usuario: list.usuario,
        public: list.public,
        descripcion: list.descripcion,
        fecha: list.fecha,
        likes : like
       }
      axios.put(url,
       lista,
       {
           headers: { 'Content-Type': 'application/json',
           'x-token' : token },
           withCredentials: true
       }
       ).then((res3) => { 
         setLiked(false);
         showMessage({
           message: "Unliked!",
           type: "default",
           icon: "success"
         });
       });
     }

    React.useEffect(() => {
        //console.log(selectedSort);
        let url = Url + "/listal?id=" + id;
          axios.get(url,
              {
                  headers: { 'Content-Type': 'application/json',
                  'x-token' : token },
                  withCredentials: true
              }
          ).then((res) => {
            console.log(res.data.listas.array);
            let array = res.data.listas.array;
            switch(selectedSort) {
              case '1':
                break;
              case '2':
                array.sort((a, b) => a.nombre > b.nombre ? 1 : -1)
                break;
              case '3':
                array.sort((a, b) => a.release_date > b.release_date ? 1 : -1)
                break;
              case '4':
                break;
              default:
            }
            setListofalb(array)
          })
          .catch((error) => {
            console.error(error)
          });
          
       

    }, [selectedSort]); 

    function deleteList() {
      let url = Url + "/listal/" + id;
        axios.delete(url,
            {
                headers: { 'Content-Type': 'application/json',
                'x-token' : token },
                withCredentials: true
            }
        ).then((res) => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Lists' }],
          });

        })
        .catch((error) => {
          console.error(error)
        });
    }

    function addComment(){
        if(UID){
          let arraycom = [];
          let url = Url + "/listal/?id=" + id;
          try {
            axios.get(url,
                {
                    headers: { 'Content-Type': 'application/json',
                    'x-token' : token },
                    withCredentials: true
                }
               ).then((res) => {
                const data = {
                  creador: UID,
                  texto: comment.value
                }
                let array = res.data.listas.comentarios;
                const hilo = {
                  comentarios: array,
                  activadas: false
                }
                let url2 = Url + "/comentarios";
  
                axios.post(url2,
                    data,
                    {
                        headers: { 'Content-Type': 'application/json',
                        'x-token' : token },
                        withCredentials: true
                    }
                ).then((res2) => {   
                    array.push(res2.data.comentario.uid);
                    const lista1 = {
                      titulo : res.data.listas.titulo,
                      descripcion : res.data.listas.descripcion,
                      fecha : res.data.listas.fecha,
                      usuario : res.data.listas.usuario,
                      likes: res.data.listas.likes,
                      public: res.data.listas.public,
                      comentarios: array,
                      array: res.data.listas.array
                     }
                     console.log(array);
                     let url3 = Url + "/listal/" + id;
                     axios.put(url3,
                      lista1,
                      {
                          headers: { 'Content-Type': 'application/json',
                          'x-token' : token },
                          withCredentials: true
                      }
                      ).then((res3) => { 
                        showMessage({
                          message: "Comment added succesfully!",
                          type: "success",
                          icon: "success"
                        });
                        setList(lista1);
                        //setLoad(!load);
                        //setArraycoms(array);
                      });
  
                })
                .catch((error) => {
                  console.error(error)
                });
                
            });
            
        } catch (err) {
            console.log(err);
          }
          }
      }
    function closeModalD(){
        setModalDVisible(false);
    }
    function clickDelete(){
        setModalDVisible(true);
    }

    if (!fontsLoaded) {
    return <AppLoading />
  }

  var modalBackgroundStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  };

  return (
      <View style={styles.Fondo}>
        <Modal
                animationType="fade"
                transparent={true}
                visible={modalDVisible}
                onRequestClose={() => {
                setModalDVisible(!modalDVisible);
                }}
                >
                <View style={[styles.centeredView,modalBackgroundStyle]}>
                <ScrollView>
                <View style={styles.modalView}>
                    <View style={styles.reviewView}>
                    <Text style={[
                    { fontFamily:'Raleway_400Regular',
                    color: theme.colors.text,
                    fontSize: 19,
                    textAlign: 'center'
                    }
                    ]}>Delete list?</Text>
                    <View style={[
                    { fontFamily:'Raleway_400Regular',
                    color: theme.colors.text,
                    fontSize: 19,
                    flexDirection: 'row',
                    paddingVertical: 15,
                    justifyContent: 'space-between'
                    }
                    ]}>
                    <Button style={styles.buttonTrack}
                    mode="contained"
                    onPress={closeModalD}
                    >
                        CANCEL
                    </Button>
                    <Button
                    mode="contained"
                    onPress={deleteList}
                    >
                        YES
                    </Button>
                    </View>
                    </View>
                </View>
                
                </ScrollView>
                </View>
         </Modal>
        <ScrollView>
        <View style={styles.encabezado}>
        <BackButton goBack={navigation.goBack} />
        {list.usuario && inter ? <><PageHeader
            >List details </PageHeader><View style={[
              { paddingHorizontal: 10 }
            ]}>{UID == list.usuario._id && <><TouchableOpacity onPress={clickDelete}><Entypo name="trash" size={24} color="white" /></TouchableOpacity></>}</View></>:null}
        </View>
        <View style={styles.TopBanner}>
        <View style={styles.Info}>
            <View style={[
                { flexDirection: 'row',
                width: '100%'
                }
             ]}>
            {list ?<Image source={{ uri: list.usuario.imagen }} style={styles.imageusu}  />:null } 
            {list ?<TouchableOpacity style={[
                { marginLeft: 5,
                marginTop: 5
                }
             ]}><Paragraph><Text style={styles.Infousu}>List by </Text><Text style={styles.link}>{list.usuario.username}</Text></Paragraph></TouchableOpacity>:null } 
            
            </View>
        <View style={[
                { flexDirection: 'row',
                marginTop: 10,
                width: '100%',
                alignItems: 'center',
                }
             ]}><Fontisto name="date" size={17} color="white" /><Text style={[
            {   color: theme.colors.text,
                fontFamily: 'Raleway_400Regular_Italic',
                fontSize: 12,
                marginLeft:3}
             ]}> {inter}</Text></View>    
           <View style={[
                { flexDirection: 'row',
                width: '77%',
                alignItems: 'center',
                }
             ]}><Text style={styles.Infoname}>{list.titulo}</Text>
                {list.usuario ? <View>{UID == list.usuario._id &&<TouchableOpacity style={[
                { marginTop: 10,
                  marginRight: 10
                }
             ]}><FontAwesome name="pencil-square-o" size={24} color="white" /></TouchableOpacity>}</View>:null}

        { list && UID ? <View>
            {liked == true && <TouchableOpacity style={[
                { marginTop: 10
                }
             ]} onPress={quitLike}><AntDesign name="heart" size={28} color="#B81EFF" /></TouchableOpacity>}{liked == false &&<TouchableOpacity style={[
                { marginTop: 10
                }
             ]} onPress={addLike}><AntDesign name="hearto" size={28} color="#B81EFF" /></TouchableOpacity>}</View>:null}
        </View>
        <Text style={styles.Infotext}>{list.descripcion}</Text>
        <View style={styles.pickerDiv}>
        <Text style={[
        { fontFamily:'Raleway_700Bold',
         color: theme.colors.text,
         fontSize: 17,
         marginTop: 14
        }
       ]}>Sort by</Text>
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
        <Picker.Item label="List Order" color="#f545e3" value="1" />
        <Picker.Item label="Alphabetical " color="#f545e3" value="2" />
        <Picker.Item label="Release Date" color="#f545e3" value="3" />
        <Picker.Item label="Best Rated" color="#f545e3" value="4" />
        </Picker>

        </View>

        {list.array ? <View style={styles.tracksDiv}>
        <FlatList
            data={listofalb}
            renderItem={({ item }) => (
                <><View style={{ flex: 1, flexDirection: 'column', margin: 1 , alignItems: 'center', marginBottom: 15}}>
                    <TouchableOpacity onPress={() => navigation.navigate('AlbumScreen', { id: item.id })}><Image style={styles.imagetrack} source={{ uri: item.imagen }}></Image></TouchableOpacity><Text style={[
                    { fontFamily:'Raleway_400Regular',
                     paddingVertical: 4,
                     color: theme.colors.text,
                     fontSize: 11,
                     textAlign: 'center' }
                   ]}>{item.nombre}</Text><Text style={[
                    { fontFamily:'Raleway_700Bold',
                     color: theme.colors.text,
                     fontSize: 11,
                     textAlign: 'center' }
                   ]}>{item.artista}</Text></View></>
                )}
                numColumns={3}
                keyExtractor={(item, index) => index}
            />
        </View>:null}

        <View style={styles.commentsDiv}>
          <View style={styles.commentsDiv2}>
          {list.comentarios ? <><Text style={styles.Infoart}>Comments  </Text><FontAwesome5 name="comment-alt" size={20} color="#B81EFF" /><Text style={styles.like}>{list.comentarios.length}</Text></> :null}
          </View>
          <View>
          <Feather name="bell" size={24} color="white" /> 
          </View>  
        </View>
        {list.comentarios && arraycoms ? 
        <View>
        <FlatList
            data={arraycoms}
            extraData={arraycoms}
            renderItem={({ item }) => (
                    <View style={styles.comments}><View style={styles.comments2}>
                    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                    <Image source={{ uri: item.creador.imagen }} style={styles.imageusu}></Image>
                    </TouchableOpacity>
                    <Text style={[
                        { fontFamily:'Raleway_400Regular',
                        paddingVertical: 4,
                        marginLeft: 11,
                        color: theme.colors.text,
                        fontSize: 17,
                        width: 170
                        }
                    ]}>{item.texto}</Text></View><View style={styles.comments2}><View style={[
                        { paddingHorizontal: 15}
                        ]}>{UID == item.creador._id &&<Entypo name="trash" size={24} color="white" />}
                        </View><Feather name="flag" size={24} color="white" /></View></View>
                )}
                numColumns={1}
                keyExtractor={(item, index) => index}
            />
        </View>:null }
        <View style={styles.addcDiv}>
          <Text style={styles.Infoname2}>Add a comment</Text>
          { UID ? <TextInputE onChangeText={(text) => setComment({ value: text, error: '' })} numberOfLines={3} placeholderTextColor='rgba(255, 255, 255, 0.65)' 
            placeholder="Please be respectful with the community"></TextInputE>:<><TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}><Text style={styles.link2}>Log In here to add a comment</Text></TouchableOpacity></> }
           { UID ? <Button mode="contained" onPress={addComment}>save</Button>:null }

        </View>
        </View>
        </View>
        <View>
        </View>
        </ScrollView>
      </View>
  )
  
}

const styles = StyleSheet.create({
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
  centeredView:{
    height: '100%'
  },
  pickerDiv: {
    flexDirection: 'row'
  },
  Fondo:{
    backgroundColor: '#392F36',
    height: '100%',
    fontFamily: 'Raleway_400Regular'
  },
  TopBanner:{
    flexDirection: 'row',
    marginTop: 4,
  },
  tracksDiv:{
    justifyContent: 'center',
    flex: 1,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  encabezado:{
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',   
      marginTop: 30,
      fontFamily:'Raleway_400Regular',
      justifyContent: 'center'
  },
  link:{
    fontFamily: 'Raleway_700Bold',
    color: theme.colors.secondary,
    marginTop: 15,
    fontSize: 15,
  },
  Banner: {
    backgroundColor: '#fff',
    height: 60,
    marginTop: 10,
    alignItems: 'center'
  },
  image: {
    width: 140,
    height: 140,
    marginTop: 25,
    marginBottom: 1,
    marginLeft: 0,
    alignItems:'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10
  },
  imageusu: {
    width: 35,
    height: 35,
    marginBottom: 1,
    marginLeft: 0,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
  },
  imagetrack: {
    width: 85,
    height: 85,
    marginBottom: 1,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
  },
  Divtext:{
    fontSize: 17,
    marginTop: 16,
    color: theme.colors.text,
    fontFamily:'Raleway_400Regular' 
  },
  Info:{
    width:'100%',
    paddingHorizontal: 15
  },
  Infousu:{
    fontSize: 16,
    marginTop: 6,
    width: '100%',
    color: theme.colors.text,
    fontFamily: 'Raleway_400Regular_Italic',
  },
  Infotext:{
    fontSize: 16,
    marginTop: 6,
    width: '100%',
    color: theme.colors.text,
    fontFamily: 'Raleway_400Regular',
  },
  Infoname:{
    fontSize: 22,
    marginTop: 6,
    width: '100%',
    color: theme.colors.text,
    fontFamily: 'Raleway_700Bold',
  },
  RateDiv:{
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: '#444444',
    borderRadius: 10,
    height: 220,
    width: '100%',
    marginTop: 25,
  },
  modalView: {
    top: '5%',
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
  modalText: {
    fontFamily: 'Raleway_400Regular',
    fontSize: 21,
    color: theme.colors.text
  }
  ,
  comments2: {
    flexDirection: 'row'
  },
  commentsDiv:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    paddingVertical:15
  },
  addcDiv:{
    paddingHorizontal: 0,
    marginBottom: 10
  },
  commentsDiv2:{
    flexDirection: 'row',
  },
  Infoname2:{
    fontSize: 16,
    marginTop: 6,
    width: '70%',
    color: theme.colors.text,
    fontFamily: 'Raleway_700Bold',
  },
  link2:{
    fontFamily: 'Raleway_700Bold',
    color: theme.colors.secondary,
    fontSize: 15,
    textAlign: 'center',
    paddingVertical: 10
  },
  Infoart:{
    fontSize: 16,
    marginTop: 4,
    color: theme.colors.text,
    fontFamily:'Raleway_400Regular' 
  },
  like: {
    color: theme.colors.text,
    fontFamily: 'Raleway_400Regular',
    fontSize: 14,
    marginLeft: 4
  },
  buttonTrack:{
    backgroundColor: '#636363',
    width: 115
  },
  likes:{
        bottom: 5,
        marginLeft: 5,
        marginRight: 5,
        flexDirection: 'row',
        marginTop: 15,
        justifyContent:'flex-end'
    },
    comments: {
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: 5,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 10,
        marginVertical: 3,
        justifyContent: 'space-between'
      }
})
