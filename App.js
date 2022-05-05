import React from 'react'
import { Provider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { theme } from './src/core/theme'
import Ionicons from 'react-native-vector-icons/Ionicons';
import storage from './src/screens';
import Loading from './src/components/Loading';
import AppLoading from 'expo-app-loading';
import { showMessage, hideMessage } from "react-native-flash-message";
import { StatusBar } from 'react-native';
import FlashMessage from "react-native-flash-message";

import {
  LoginScreen,
  RegisterScreen,
  ResetPasswordScreen,
  Dashboard
} from './src/screens'
import ListsScreen from './src/screens/ListsScreen';
import SearchScreen from './src/screens/SearchScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LandingScreen from './src/screens/LandingScreen';
import AlbumScreen from './src/screens/AlbumScreen';
import ReviewScreen from './src/screens/ReviewScreen';
import NewListScreen from './src/screens/NewListScreen';
import DetailListScreen from './src/screens/DetailListScreen'; 
import AddtolistScreen from './src/screens/AddtolistScreen'; 
import ArtistScreen from './src/screens/ArtistScreen';
import FilterScreen from './src/screens/FilterScreen';
import EditInfo from './src/screens/EditInfo';
import UserReviews from './src/screens/UserReviews';
import UserLists from './src/screens/UserLists';
import UserRatings from './src/screens/UserRatings';
import ChangePassScreen from './src/screens/ChangePassScreen';
import AccountInfoScreen from './src/screens/AccountInfoScreen';
import NotSettingsScreen from './src/screens/NotSettingsScreen';
import DeleteAccountScreen from './src/screens/DeleteAccountScreen';
import FollowingScreen from './src/screens/FollowingScreen';
import UserScreen from './src/screens/UserScreen';
 
const Stack = createStackNavigator()
const Tab = createBottomTabNavigator();
const dashboardName = "Dashboard";
const searchName = "Search";
const ListsName = "Lists";
const ProfileName = "Profile";
const landingName = "Landing";

function LandingTabs() {
  return (
    <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              let rn = route.name;

              if (rn === landingName) {
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

          <Tab.Screen name={landingName} component={LandingScreen}  />
          <Tab.Screen name={ListsName} component={ListsScreen} />
          <Tab.Screen name={searchName} component={SearchScreen} />
          <Tab.Screen name={ProfileName} component={LoginScreen}
          options={{
            // hide the bottom tab bar on Contact Screen
            tabBarStyle: { display: "none" }
          }} 
          />
         

      </Tab.Navigator>
  );
}
const HomeTabs = () => (
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
          <Tab.Screen name={searchName} component={SearchScreen}/>
          <Tab.Screen name={ProfileName} component={ProfileScreen}
          //options={{
            // hide the bottom tab bar on Contact Screen
            //tabBarStyle: { display: "none" }
          //}} 
          />

      </Tab.Navigator>
)

export default function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [hidden, setHidden] = React.useState(true);
  const [userToken, setUserToken] = React.useState(null);

  React.useEffect(() => {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Provider theme={theme}>
      <NavigationContainer>
          <Stack.Navigator
          initialRouteName="Landing"
          screenOptions={{
            headerShown: false,
            backgroundColor: "blue",
          }}
        > 
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="Dashboard" component={HomeTabs} />
          <Stack.Screen name="Landing" component={LandingTabs} />
          <Stack.Screen name="AlbumScreen" component={AlbumScreen} />
          <Stack.Screen name="ReviewScreen" component={ReviewScreen} />
          <Stack.Screen name="NewListScreen" component={NewListScreen} />
          <Stack.Screen name="DetailListScreen" component={DetailListScreen} />
          <Stack.Screen name="AddtolistScreen" component={AddtolistScreen} />
          <Stack.Screen name="ArtistScreen" component={ArtistScreen} />
          <Stack.Screen name="SearchScreen" component={SearchScreen} />
          <Stack.Screen name="FilterScreen" component={FilterScreen} />
          <Stack.Screen name="EditInfo" component={EditInfo} />
          <Stack.Screen name="UserReviews" component={UserReviews} />
          <Stack.Screen name="UserLists" component={UserLists} />
          <Stack.Screen name="AccountInfoScreen" component={AccountInfoScreen} />
          <Stack.Screen name="ChangePassScreen" component={ChangePassScreen} />
          <Stack.Screen name="DeleteAccountScreen" component={DeleteAccountScreen} />
          <Stack.Screen name="NotSettingsScreen" component={NotSettingsScreen} />
          <Stack.Screen name="FollowingScreen" component={FollowingScreen} />
          <Stack.Screen name="UserScreen" component={UserScreen} />
          <Stack.Screen name="UserRatings" component={UserRatings} />
          <Stack.Screen
            name="ResetPasswordScreen"
            component={ResetPasswordScreen}
          />
        </Stack.Navigator>

        <FlashMessage position="top" />

      </NavigationContainer>
    </Provider>
  )
}
