export { default as StartScreen } from './StartScreen'
export { default as LoginScreen } from './LoginScreen'
export { default as RegisterScreen } from './RegisterScreen'
export { default as ResetPasswordScreen } from './ResetPasswordScreen'
export { default as Dashboard } from './Dashboard'
export { default as Landing } from './LandingScreen'
import Storage from 'react-native-storage';
import {  AsyncStorage  } from '@react-native-async-storage/async-storage'

const storage = new Storage({
    storageBackend: AsyncStorage,
    enableCache: true,
    sync: {
      tabIndex() {
        return 0;
      }
    }
  });

  export default storage;
