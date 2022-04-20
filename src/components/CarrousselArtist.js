import { View, Dimensions, Text, StyleSheet, Platform, FlatList, Animated, Pressable, SafeAreaView } from "react-native";
import Carousel from "react-native-snap-carousel";
import React, { useState, useEffect } from 'react'
import { ParallaxImage } from 'react-native-snap-carousel';
import { theme } from '../core/theme';


const { width } = Dimensions.get("window");


export default function CustomSlider4({ data, navigation, load }) {

  function CarouselItem({ item, index }, parallaxProps) {

    const toArtistPage = () => {
        navigation.navigate('ArtistScreen', {id: item.id, refresh: !load})
      }
    return (
      <Pressable onPress={toArtistPage}>
        <SafeAreaView style={styles.item}>
          <ParallaxImage
            source={{ uri: item.images[0].url }} /* the source of the image */
            containerStyle={styles.imageContainer}
            style={styles.image}
            {...parallaxProps} /* pass in the necessary props */ 
          />
              <Text style={styles.title} numberOfLines={1}>
              {item.name}
              </Text>
          </SafeAreaView>
          </Pressable>
      );
      }

  const settings = {
    sliderWidth: width,
    sliderHeight: width,
    itemWidth: 160,
    navigation: navigation,
    data: data,
    renderItem: CarouselItem,
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
    title: {
      fontSize: 16,
      color: theme.colors.text,
      textAlign: 'center',
      fontFamily: 'Raleway_400Regular'
    },
    artist: {
      fontSize: 16,
      color: theme.colors.text,
      textAlign: 'center',
      fontFamily: 'Raleway_700Bold'
    },
    item: {
      width: '100%',
      height: 170, //height will be 20 units less than screen width.
      textAlign: 'center'
    },
    imageContainer: {
      flex: 1,
      borderRadius: 5,
      backgroundColor: 'rgba(255, 255, 255, 0)',
      marginBottom: Platform.select({ ios: 0, android: 1 }), //handle rendering bug.
      height: 200,
    },
    image: {
      ...StyleSheet.absoluteFillObject,
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