import React, { useState, useRef, useEffect, useContext } from 'react'
import axios from 'axios';
import { TouchableOpacity, StyleSheet, View, MsgBox } from 'react-native'
import { FiMail, FiLock } from 'react-icons/fi'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import SocialButtonFacebook from '../components/SocialButtonFacebook'
import SocialButtonTwitter from '../components/SocialButtonTwitter'
import SocialButtonGoogle from '../components/SocialButtonGoogle'
import { theme } from '../core/theme'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import {
  useFonts,
  Raleway_100Thin,
  Raleway_200ExtraLight,
  Raleway_300Light,
  Raleway_400Regular,
  Raleway_500Medium,
  Raleway_600SemiBold,
  Raleway_700Bold,
  Raleway_800ExtraBold,
  Raleway_900Black,
  Raleway_100Thin_Italic,
  Raleway_200ExtraLight_Italic,
  Raleway_300Light_Italic,
  Raleway_400Regular_Italic,
  Raleway_500Medium_Italic,
  Raleway_600SemiBold_Italic,
  Raleway_700Bold_Italic,
  Raleway_800ExtraBold_Italic,
  Raleway_900Black_Italic,
} from '@expo-google-fonts/raleway';
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  Pattern,
  Use,
  Image,
  TSpan
} from "react-native-svg"


export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const [success, setSuccess] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const errRef = useRef();

  let [fontsLoaded] = useFonts({
    Raleway_400Regular,
    Raleway_700Bold,
    });

  function SvgTop1(){
    return(<Svg
      width={369}
      height={300}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <Path
        d="M215.71 6.062a7 7 0 0 1 9.562-2.562l537.289 310.204a7 7 0 0 1 2.563 9.562l-173.63 300.736c-2.221 3.847-8.116 1.555-7.156-2.782 23.51-106.173-65.783-203.359-173.563-188.906L299.397 447.25c-100.704 7.9-198.987-33.516-263.665-111.108l-5.878-7.053a.85.85 0 0 1-.083-.97L215.71 6.062Z"
        fill="url(#a)"
        fillOpacity={0.85}
      />
      <Path
        d="M51.141 48.443a7 7 0 0 1 7-7h549a7 7 0 0 1 7 7v300.069c0 3.921-5.509 4.789-6.714 1.058-29.291-90.653-139.191-125.418-215.289-68.103l-80.915 60.943c-74.075 49.697-167.359 61.238-251.312 31.09l-8.26-2.966a.77.77 0 0 1-.51-.725V48.443Z"
        fill="url(#b)"
      />
      <Path fill="url(#c)" d="M96 80h473v301H96z" />
      <Defs>
        <LinearGradient
          id="a"
          x1={493.917}
          y1={158.602}
          x2={274.707}
          y2={538.285}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#EA2DDA" />
          <Stop offset={1} stopColor="#EA2DDA" stopOpacity={0} />
        </LinearGradient>
        <LinearGradient
          id="b"
          x1={332.641}
          y1={41.443}
          x2={332.641}
          y2={421.443}
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset={0.672} stopColor="#5F1880" />
          <Stop offset={1} stopColor="#5F1880" stopOpacity={0} />
        </LinearGradient>
        <Pattern
          id="c"
          patternContentUnits="objectBoundingBox"
          width={1}
          height={1}
        >
          <Use xlinkHref="#d" transform="matrix(.00198 0 0 .0031 -.009 0)" />
        </Pattern>
        <Image
          id="d"
          width={515}
          height={322}
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgMAAAFCCAYAAABsN94DAAAACXBIWXMAAA7DAAAOwwHHb6hkAABGA0lEQVR4Xu3dCXwU5d3A8Wc2JzlIAsgNSTi1HnjfAkHxaG211tajKkTbKt4HtLZ9W2Nf61FfFW0r1lbBE++zKl4QBDy4FDw5JAEh3LnInezO+39md+Jks7vZ3Zywv/2wbLI788wz35nNPM9/nkMpHggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAII7JUCxl6ZazLdJQKmaTafH4ZhmF2yUTaCAAIIINDlAhQGOoH8vhyzprJY9XJJ2s6nxvb/PU7ei+R9/zT17/7r28sESjeK9U1Zx0jMUU1Di42ETuAiSQQQQACBbhbQ1wYeHSwgF2EjUClLv+d83/45kvftZf3TCXd7ba0fIF17X+o7mInkEEAAAQR6iACFgU44EBJPr/bF1FuE1vUvgWLt4b5vr+u/fLjr27sabHn9uTN/9j74Xhs7gYokEUAAAQR6gEB8D8jDPpcFqV03yNMjT33TPS4jR+2WUleCjhgECuHb7/vC+taNet9y9s/Wevb7vlerxq5D+ParYxm9vH7fXs9+tUL+AdLS6ehtuX2v+vcad7HaTx8cvR/ykrjPHSh2CAEEEEDAEqAw0Aknglw5e8vTJU9P7xxVeWWx0a8TNtPpSRblmBVSIND7oh8pnb5BNoAAAggg0C0CFAY6gT13onqzolhl65p2Vo76Ts3phI10QZK9JqpPpDAwSqIEDQl78X50ARWbQAABBBBAQEIAHn1XoH0PO41I0/Jfr73r+++F7mLo7GbYvr1kbQQQQACBnibQ7gtYT9uh7shPWZE5qrxY/UAwm2T7Tbq9gLzq6Hqc/KyjL/G67YC8Wrfrfffgv+/Er9/0ZTxAbwNnz4TmnwMsZ9/bt1IKkF6wda27AL48Wfn25d9Ow2q+oNsf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AQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBCIV+H8+voyxYRMv8AAAAABJRU5ErkJggg=="
        />
      </Defs>
    </Svg>)
  }
  function SvgBot1(){
    return ( <Svg
      width={586}
      height={156}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M562.047 349.5a7 7 0 0 1-7.485 6.478L6.982 316.52a7 7 0 0 1-6.479-7.485L22.07 9.743c.282-3.911 5.839-4.38 6.773-.572 22.7 92.523 129.816 135.097 209.837 83.4l85.086-54.97C401.222-6.644 495.094-11.45 576.663 24.653l8.025 3.552a.77.77 0 0 1 .456.76L562.047 349.5Z"
        fill="url(#a)"
        fillOpacity={0.85}
      />
      <Defs>
        <LinearGradient
          id="a"
          x1={280.772}
          y1={336.249}
          x2={308.084}
          y2={-42.768}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#5F1880" />
          <Stop offset={1} stopColor="#EA2DDA" stopOpacity={0} />
        </LinearGradient>
      </Defs>
    </Svg>)
  }
  

  const onLoginPressed =  async (e) => {
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    e.preventDefault();

    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }
    else{
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      let emailform = email.value;
      let passform = password.value;
      const data = {
        email : emailform,
        password : passform
      }
      //comprobación login
        try {

          axios.post('http://192.168.1.33:3000/api/login',
              data,
              {
                  headers: { 'Content-Type': 'application/json' },
                  withCredentials: true
              }
          ).then((res) => {
            console.log(res.data)
            navigation.reset({
              index: 0,
              routes: [{ name: 'Dashboard' }],
            });
            setSuccess(true);
            //clear state and controlled inputs
            //need value attrib on inputs for this
            setEmail('');
            setPassword('');
          })
          .catch((error) => {
            console.error(error)
          });

      } catch (err) {
          if (!err?.response) {
              setErrMsg('No Server Response');
          } else if (err.response?.status === 400) {
              setErrMsg('Missing Username or Password');
          } else if (err.response?.status === 401) {
              setErrMsg('Unauthorized');
          } else {
              setErrMsg('Login Failed');
          }
          console.log(errMsg);
      }
      
    }
    
    /*navigation.reset({
      index: 0,
      routes: [{ name: 'Dashboard' }],
    })*/
  }

  return (
    <Background>
      <View style={styles.Banner}>
      <Logo />
      <Text style={styles.desc}>
      Vinyl Shelves is a platform that brings you the possibility to share your music with friends thanks to reviews, ratings and lists, growing even more your love for music.</Text>
      </View>
      <Header>Login</Header>
      <Text style={[
       { fontFamily:'Raleway_400Regular' }
      ]}>Email</Text>
      <TextInput
        placeholder="Enter your email address"
        placeholderTextColor='rgba(255, 255, 255, 0.75)' 
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
        icon={<FiMail/>}
      />
      <Text style={[
       { fontFamily:'Raleway_400Regular' }
      ]}>Password</Text>
      <TextInput
        placeholder="Enter your password"
        placeholderTextColor='rgba(255, 255, 255, 0.75)'
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
        icon={<FiLock/>}
      />
      <View style={styles.forgotPassword}>
        <SocialButtonGoogle></SocialButtonGoogle>
        <SocialButtonTwitter></SocialButtonTwitter>
        <SocialButtonFacebook></SocialButtonFacebook>
        <TouchableOpacity
          onPress={() => navigation.navigate('ResetPasswordScreen')}
        >
          <Text style={styles.forgot}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.row}>
        <View style={styles.bottomdiv}>
        <Text style={styles.account}>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('RegisterScreen')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
        </View>
        <Button mode="contained" onPress={onLoginPressed}>
        Login
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
    fontFamily: 'Raleway_400Regular',
    width: 255,
    color: 'rgba(255, 255, 255, 0.75)',
    marginLeft: 10,
  },
  forgotPassword: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 4,
    justifyContent:'space-between',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
    justifyContent:'space-between'
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.text,
    fontFamily: 'Raleway_700Bold'
  },
  account:{
    fontFamily: 'Raleway_400Regular',
    fontSize: 16
  },
  link: {
    fontFamily: 'Raleway_700Bold',
    color: theme.colors.secondary,
    fontSize: 18
  },
  image: {
    width: 80,
    height: 110,
    marginBottom: 8,
    marginLeft: 40,
    alignItems:'center'
  }
})
