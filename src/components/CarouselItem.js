import React from 'react';
import { ParallaxImage } from 'react-native-snap-carousel';
import { View, Text, Pressable, SafeAreaView, StyleSheet } from 'react-native';
import { theme } from '../core/theme';

function CarouselItem({ item, index }, parallaxProps) {

  return (
    <Pressable onPress={() => alert('Image description:' + item.artist)}>
      <SafeAreaView style={styles.item}>
        <ParallaxImage
          source={{ uri: item.source }} /* the source of the image */
          containerStyle={styles.imageContainer}
          style={styles.image}
          {...parallaxProps} /* pass in the necessary props */ 
        />
            <Text style={styles.title} numberOfLines={2}>
            {item.title}
            </Text>
            <Text style={styles.artist} numberOfLines={2}>
            {item.artist}
            </Text>
        </SafeAreaView>
        </Pressable>
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
          borderWidth: 1,
          borderColor: 'white',
          borderRadius: 10,
          height: 200,
        },
        image: {
          ...StyleSheet.absoluteFillObject,
          resizeMode: 'contain',
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

export default CarouselItem;