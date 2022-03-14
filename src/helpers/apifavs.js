
    import { Credentials } from '../helpers/credentials';
    import axios from 'axios';
    import React, { useState, useRef, useEffect, useContext } from 'react'
    import {decode as atob, encode as btoa} from 'base-64';
    const spotify = Credentials();  

    const insfav = async () => {
    const [token, setToken] = useState('');  

    await axios('https://accounts.spotify.com/api/token', {
      headers: {
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Authorization' : 'Basic ' + btoa(spotify.ClientId + ':' + spotify.ClientSecret)      
      },
      data: 'grant_type=client_credentials',
      method: 'POST'
    })
    .then(tokenResponse => {      
      setToken(tokenResponse.data.access_token);
      axios('https://api.spotify.com/v1/albums/7D2NdGvBHIavgLhmcwhluK', {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + tokenResponse.data.access_token}
      })
      .then (trackResponse => {  
        console.log(trackResponse.data.name);  
        const data = {
            nombre: trackResponse.data.name,
            artista: trackResponse.data.artists[0].name,
            imagen: trackResponse.data.images[0].url
        } 
        axios.post('http://192.168.1.39:3000/api/albumes',
        data,
        {
            headers: { 'Content-Type': 'application/json' }
        }
            ).then((res) => {
            console.log(res);
             })
             
      })
      
    });
  }
  insfav();
  export { insfav };
