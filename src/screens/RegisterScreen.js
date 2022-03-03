import React, { useState, useRef, useEffect, useContext } from 'react'
import axios from 'axios';
import { Alert, Pressable, Modal, View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import { nameValidator } from '../helpers/nameValidator'

export default function RegisterScreen({ navigation }) {
  const [username, setName] = useState({ value: '', error: '' })
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const [success, setSuccess] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const toMainPage = () => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Dashboard' }],
      });
  }

  const onSignUpPressed = () => {
    const nameError = nameValidator(username.value)
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    let nameform = username.value;
    let emailform = email.value;
    let passform = password.value;
    const data = {
      username : nameform,
      email : emailform,
      password : passform
    }

    if (emailError || passwordError || nameError) {
      setName({ ...username, error: nameError })
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }
    else{
      console.log(JSON.stringify(nameform));
      try {
        axios.post('http://192.168.1.33:3000/api/usuarios',
            data,
            {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            }
        ).then((res) => {
          console.log(res.data)
          setSuccess(true);
          setModalVisible(true);
          setName('');
          setPassword('');
        })
        .catch((error) => {
          console.error(error)
        });
        
    } catch (err) {
        if (!err?.response) {
            setErrMsg('No Server Response');
        } else if (err.response?.status === 409) {
            setErrMsg('Username Taken');
        } else {
            setErrMsg('Registration Failed')
        }
        //errRef.current.focus();
      }
    }
  
  }

  return (
    <Background>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Account created successfully!</Text>
            <Button
              style={styles.buttonClose}
              onPress={() => setModalVisible(!modalVisible)}
              onPress={() => toMainPage()}
            >
              <Text style={styles.modalText}>BEGIN!</Text>
            </Button>
          </View>
        </View>
      </Modal>

      <View style={styles.Banner}>
      <Logo />
      <Text style={styles.desc}>
      Vinyl Shelves is a platform that brings you the possibility to share your music with friends thanks to reviews, ratings and lists, growing even more your love for music.</Text>
      </View>
      <Header>Register</Header>
      <Text style={[
       { fontFamily:'Raleway_400Regular' }
      ]}>Username</Text>
      <TextInput
        placeholder="Enter your user name"
        placeholderTextColor='rgba(255, 255, 255, 0.75)' 
        label="Username"
        returnKeyType="next"
        value={username.value}
        onChangeText={(text) => setName({ value: text, error: '' })}
        error={!!username.error}
        errorText={username.error}
      />
      <Text style={[
       { fontFamily:'Raleway_400Regular' }
      ]}>Email</Text>
      <TextInput
        placeholder="Enter your email address"
        placeholderTextColor='rgba(255, 255, 255, 0.75)' 
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <Text style={[
       { fontFamily:'Raleway_400Regular' }
      ]}>Password</Text>
      <TextInput
        placeholder="Enter your user password"
        placeholderTextColor='rgba(255, 255, 255, 0.75)' 
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      
      <View style={styles.row}>
      <View style={styles.bottomdiv}>
        <Text style={styles.account}>Already a member? </Text>
        <TouchableOpacity onPress={() => navigation.replace('LoginScreen')}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
      <Button
        mode="contained"
        onPress={onSignUpPressed}
      >
        Sign Up
      </Button>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  bottomdiv:{
    marginTop: 10
  },
  Banner:{
    alignItems: 'center'
  },
  desc:{
    width: 255,
    color: 'rgba(255, 255, 255, 0.75)',
    marginLeft: 10,
    fontFamily: 'Raleway_400Regular'
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
    justifyContent:'space-between'
  },
  link: {
    fontFamily: 'Raleway_700Bold',
    color: theme.colors.secondary,
    fontSize: 18
  },
  text: {
    color: theme.colors.text,
    fontFamily: 'Raleway_400Regular'
  },
  account:{
    fontFamily: 'Raleway_400Regular',
    fontSize: 16
  },
  modalView: {
    top: '50%',
    margin: 20,
    backgroundColor: "#444444",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,
    
    elevation: 24,
  },
  modalText: {
    fontFamily: 'Raleway_400Regular',
    fontSize: 21,
    textAlign: 'center'
  },
  buttonClose: {
    marginTop: 25,
    marginBottom: 0,
    alignSelf: 'center',
    width: 140
  }
})
