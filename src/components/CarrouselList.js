import { View, Dimensions, Text, StyleSheet, Platform, FlatList, Animated, Pressable, SafeAreaView, Image } from "react-native";
import Carousel from "react-native-snap-carousel";
import React, { useState, useEffect } from 'react'
import { ParallaxImage } from 'react-native-snap-carousel';
import { theme } from '../core/theme';
import { FontAwesome } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 
import { FontAwesome5 } from '@expo/vector-icons'; 
import axios from 'axios';
import {decode as atob, encode as btoa} from 'base-64'
import { Credentials } from '../helpers/credentials';
import SpotifyWebApi from "spotify-web-api-node";
import album from "../../Backend/models/album";
import { TouchableOpacity } from "react-native-gesture-handler";

const { width } = Dimensions.get("window");


export default function CustomSlider3({ data, navigation }) {
  function CarouselItem3({ item, index }, parallaxProps) {
    return (
      <Pressable onPress={() => navigation.navigate('DetailListScreen', {id: item.uid})}>
        <SafeAreaView style={styles.item}>
          <View>
            <Text style={styles.titleal}>{item.titulo}</Text>
            <View style={styles.tracks}>
            {item.array.slice(0, 4).map((track, i) => ( 
                <Image key={i} style={styles.imagealb} source={{ uri: track.imagen }}></Image>                
            ))}
            </View>
            <View style={styles.bottomSPA}>
            <View style={styles.bottom}>
            <Image style={styles.image} source={{ uri: item.usuario.imagen }}></Image>
            <TouchableOpacity><Text style={styles.link}>{item.usuario.username}</Text></TouchableOpacity>
            </View>
            <View style={styles.bottom}>
            <AntDesign name="hearto" size={20} color="#B81EFF" />
            <Text style={styles.artistal}>{item.likes.length}</Text>
            <FontAwesome5 name="comment-alt" size={20} color="#B81EFF" />
            <Text style={styles.artistal}>{item.comentarios.length}</Text>
            </View>
            </View>
          </View>
          </SafeAreaView>
        </Pressable>
      );
      }

  const settings = {
    sliderWidth: width,
    sliderHeight: width,
    itemWidth: 250,
    navigation: navigation,
    data: data,
    renderItem: CarouselItem3,
    useScrollView: true,
    hasParallaxImages: true,
    loop: true
    };

  return (
    <View style={styles.container}>
      <Carousel {...settings} />
    </View>
  );
}



const styles = StyleSheet.create({
    //carrousel
    container: {
      paddingTop: 3,
      textAlign: 'center',
    },
    link:{
        fontFamily: 'Raleway_700Bold',
        color: theme.colors.secondary,
        fontSize: 11,
        padding: 0,
        marginLeft: 5
    },
    artistal: {
      fontSize: 11,
      color: theme.colors.text,
      fontFamily: 'Raleway_400Regular',
      marginRight: 10,
      marginLeft: 2
    },
    titleal: {
      fontSize: 16,
      color: theme.colors.text,
      fontFamily: 'Raleway_700Bold',
    },
    title: {
      fontSize: 14,
      color: theme.colors.text,
      fontFamily: 'Raleway_400Regular'
    },
    like: {
      fontSize: 15,
      color: theme.colors.text,
      textAlign: 'center',
      fontFamily: 'Raleway_700Bold',
      marginRight: 16
    },
    artist: {
      fontSize: 16,
      color: theme.colors.text,
      textAlign: 'center',
      fontFamily: 'Raleway_700Bold'
    },
    item: {
      width: '100%',
      height: 140, //height will be 20 units less than screen width.
      textAlign: 'center',
      borderRadius: 5,
      backgroundColor: '#392F36'
    },
    imageContainer: {
      flex: 1,
      borderRadius: 5,
      backgroundColor: 'rgba(255, 255, 255, 0)',
      marginBottom: Platform.select({ ios: 0, android: 1 }), //handle rendering bug.
      width: 40,
      padding: 10

    },
    info :{
       width: 130,
       marginRight: 10
    },
    centroimg :{
      alignItems: 'center',
      width: '100%'
    },
    icons:{
      flexDirection: 'row',
      marginTop: 1,
      justifyContent: 'space-between',
      marginLeft: 35
    },
    infoimg:{
      textAlign: 'center',
      width: 60
    },
    top:{
      flexDirection: 'row',
      marginTop: 1,
      justifyContent:'space-between'
    },
    bottomSPA: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    bottom: {
      flexDirection: 'row',
      marginTop: 5
    },
    image: {
      width: 25,
      height: 25,
      borderRadius: 10
    },
    tracks:{
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        borderRadius: 5,
        marginTop: 5
    },
    imagealb: {
      width: 70,
      height: 70,
      borderRadius: 5,
      marginRight: -10,
    },
    dotContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0)',
    },
    dotStyle: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: 'black',
    },
    inactiveDotStyle: {
      backgroundColor: 'rgb(255,230,230)',
    }
  })