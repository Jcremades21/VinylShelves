import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
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

  const onSignUpPressed = () => {
    const nameError = nameValidator(username.value)
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    if (emailError || passwordError || nameError) {
      setName({ ...username, error: nameError })
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }
    navigation.reset({
      index: 0,
      routes: [{ name: 'Dashboard' }],
    })
  }

  return (
    <Background>
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
})
