import React, { useState } from 'react'
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native'
import Background from '../components/Background'
import BackButton from '../components/BackButton'
import Logo from '../components/Logo'
import Header from '../components/Header'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import { emailValidator } from '../helpers/emailValidator'
import { theme } from '../core/theme'

export default function ResetPasswordScreen({ navigation }) {
  const [email, setEmail] = useState({ value: '', error: '' })

  const sendResetPasswordEmail = () => {
    const emailError = emailValidator(email.value)
    if (emailError) {
      setEmail({ ...email, error: emailError })
      return
    }
    navigation.navigate('LoginScreen')
  }

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <View style={styles.Banner}>
      <Logo />
      </View>
      <Header>Restore Password</Header>
      <Text style={styles.text}>Email</Text>
      <TextInput
        placeholder="Enter your email address"
        placeholderTextColor='rgba(255, 255, 255, 0.75)' 
        label="E-mail address"
        returnKeyType="done"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <Text style={styles.text}>*You will receive an email with password reset link</Text>
      <Button
        mode="contained"
        onPress={sendResetPasswordEmail}
        style={{ marginTop: 16 }}
      >
        Send
      </Button>
    </Background>
  )
}

const styles = StyleSheet.create({
  Banner:{
    alignItems: 'center'
  },
  text: {
    color: theme.colors.text,
    fontFamily: 'Raleway_400Regular'
  }
})
