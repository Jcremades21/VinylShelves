import { View, Dimensions, Text, StyleSheet, Platform, FlatList, Animated, Pressable, SafeAreaView, Image } from "react-native";
import Carousel from "react-native-snap-carousel";
import React, { useState, useEffect } from 'react'
import { ParallaxImage } from 'react-native-snap-carousel';
import { theme } from '../core/theme';
import { FontAwesome } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 
import { FontAwesome5 } from '@expo/vector-icons'; 


const { width } = Dimensions.get("window");


export default function CustomSlider2({ data, navigation }) {

  function CarouselItem2({ item, index }, parallaxProps) {
    return (
      <Pressable onPress={() => navigation.navigate('ReviewScreen', {id: item.id})}>
        <SafeAreaView style={styles.item}>
          <View style={styles.top}>
              <View style={styles.infoimg}>
              <Image style={styles.imagealb} source={{ uri: item.albumimg }}></Image>
              <View style={styles.centroimg}>
              <Text style={styles.artistal} numberOfLines={1}>
              {item.albumname}
              </Text>
              <Text style={styles.titleal} numberOfLines={1}>
              {item.albumartist}
              </Text>
              </View>
              </View>
              <View style={styles.info}>
              <Text style={styles.artist} numberOfLines={1}>
              {item.titulo}
              </Text>
              <Text style={styles.title} numberOfLines={4}>
              {item.texto}
              </Text>
              </View>
          </View>
          <View style={styles.bottom}>
          <Image style={styles.image} source={{ uri: item.usuimg }}></Image>
          <Text style={styles.artist2} numberOfLines={1}>  {item.usu} </Text><Text style={styles.artist}></Text>
          <View style={styles.icons}><AntDesign name="hearto" size={20} color="#B81EFF" /><Text style={styles.like}> {item.likes}</Text></View>
          <FontAwesome5 name="comment-alt" size={20} color="#B81EFF" /><Text style={styles.like}> {item.comments} </Text>
          </View>
          </SafeAreaView>
          </Pressable>
      );
      }

  const settings = {
    sliderWidth: width,
    sliderHeight: width,
    itemWidth: 210,
    navigation: navigation,
    data: data,
    renderItem: CarouselItem2,
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
      paddingTop: 10,
      textAlign: 'center',
    },
    artistal: {
      fontSize: 11,
      color: theme.colors.text,
      fontFamily: 'Raleway_400Regular',
    },
    titleal: {
      fontSize: 11,
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
    artist2: {
      fontSize: 13,
      color: theme.colors.text,
      textAlign: 'center',
      fontFamily: 'Raleway_400Regular_Italic',
      marginTop: 5,
      width: 45
    },
    artist: {
      fontSize: 16,
      color: theme.colors.text,
      textAlign: 'center',
      fontFamily: 'Raleway_700Bold'
    },
    item: {
      width: '100%',
      height: 150, //height will be 20 units less than screen width.
      textAlign: 'center',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.4)',
      borderRadius: 5,
      backgroundColor: '#444444'
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
    bottom: {
      position: 'absolute',
      bottom: 5,
      marginLeft: 5,
      flexDirection: 'row',
      marginTop: 1,
      justifyContent:'space-between'
    },
    image: {
      width: 35,
      height: 35,
      borderRadius: 10
    },
    imagealb: {
      width: 50,
      height: 50,
      borderRadius: 10,
      marginLeft: 5,
      marginTop: 5
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