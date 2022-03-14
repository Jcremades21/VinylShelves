import React from 'react'
import { Provider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { theme } from './src/core/theme'
import Ionicons from 'react-native-vector-icons/Ionicons';
import storage from './src/screens';
import AppLoading from 'expo-app-loading';

import {
  LoginScreen,
  RegisterScreen,
  ResetPasswordScreen,
  Dashboard
} from './src/screens'
import ListsScreen from './src/screens/ListsScreen';
import SearchScreen from './src/screens/SearchScreen';
import ProfileScreen from './src/screens/ProfileScreen';


const Stack = createStackNavigator()
const Tab = createBottomTabNavigator();
const dashboardName = "Dashboard";
const searchName = "Search";
const ListsName = "Lists";
const ProfileName = "Profile";

function HomeTabs() {
  return (
    <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              let rn = route.name;

              if (rn === dashboardName) {
                iconName = focused ? 'home' : 'home-outline';

              } else if (rn === ListsName) {
                iconName = focused ? 'list' : 'list-outline';

              } else if (rn === searchName) {
                iconName = focused ? 'search' : 'search-outline';

              } else if (rn === ProfileName) {
                iconName = focused ? 'person-circle' : 'person-circle-outline';
              }
              

              // You can return any component that you like here!
              return <Ionicons name={iconName} size={size} color={color} />;
            },headerShown: false,
            tabBarStyle: { 
              height: 65,
              backgroundColor: "#3f426b"
            }

          })}
          tabBarOptions={{
            activeTintColor: '#BF34FF',
            headerShown: false,
            inactiveTintColor: 'white',
            showLabel: false,
            tabBarActiveBackgroundColor: '#373856',
            style: { 
              padding: 10, 
              height: 70,
              backgroundColor: "#373856"
            }
          }}>

          <Tab.Screen name={dashboardName} component={Dashboard}  />
          <Tab.Screen name={ListsName} component={ListsScreen} />
          <Tab.Screen name={searchName} component={SearchScreen} />
          <Tab.Screen name={ProfileName} component={ProfileScreen}
          options={{
            // hide the bottom tab bar on Contact Screen
            tabBarStyle: { display: "none" }
          }} />

      </Tab.Navigator>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [userToken, setUserToken] = React.useState(null);
  // cargamos local storage
  storage
  .load({
    key: 'loginState',
    autoSync: true,
    syncInBackground: true,
    syncParams: {
      extraFetchOptions: {
      },
      someFlag: true
    }
  })
  .then(ret => {
    // found data go to then()
    //console.log(ret.useremail);
    setUserToken(ret.token);
    setIsLoading(false);
  })
  .catch(err => {
    // any exception including data not found
    // goes to catch()
    console.warn(err.message);
    switch (err.name) {
      case 'NotFoundError':
        // TODO;
        break;
      case 'ExpiredError':
        // TODO
        break;
    }
  });

  React.useEffect(() => {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }, []);

  if (isLoading) {
    return <AppLoading />;
  }

  return (
    <Provider theme={theme}>
      <NavigationContainer>
          <Stack.Navigator
          initialRouteName="LoginScreen"
          screenOptions={{
            headerShown: false,
            backgroundColor: "blue",
          }}
        > 
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="Dashboard" component={HomeTabs} />
          <Stack.Screen
            name="ResetPasswordScreen"
            component={ResetPasswordScreen}
          />
        </Stack.Navigator>

        
      </NavigationContainer>
    </Provider>
  )
}
