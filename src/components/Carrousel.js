import { View, Dimensions, StyleSheet, Platform, FlatList, Animated } from "react-native";
import Carousel from "react-native-snap-carousel";
import CarouselItem from "./CarouselItem";
import React, { useState, useEffect } from 'react'

const { width } = Dimensions.get("window");

export default function CustomSlider({ data }) {

  const settings = {
    sliderWidth: width,
    sliderHeight: width,
    itemWidth: 120,
    data: data,
    renderItem: CarouselItem,
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
      textAlign: 'center'
    }
  })