import "./gesture-handler";
import { Provider, useDispatch } from "react-redux";
import store from "./redux/store";
import { StatusBar } from "expo-status-bar";
import { setFalse, setTrue, setUser } from "./redux/loginSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  TabNav,
  Home,
  Signin,
  Signup,
  Add,
  TaskDetails,
  Edit,
  ForgetPassword,
} from "./Screens";
import * as Network from "expo-network";

import { useSelector } from "react-redux";
import { Text, View } from "react-native";
import { screenHeight } from "./Dimentions";
const { Navigator, Screen } = createStackNavigator();
const MainLayout = () => {
  const dispatch = useDispatch();
  const [isLoggedIn, setIsLoggedIn] = useState(null); // Avoid undefined initial state
  const login = useSelector((state) => state.loginstatus.isLoggedIn);
  const [isConnected, setIsConnected] = useState(null);
  useEffect(() => {
    const checkNetwork = async () => {
      const networkState = await Network.getNetworkStateAsync();
      setIsConnected(networkState.isConnected);
    };
    checkNetwork();
  }, []);

  const fetchLoginStatus = async () => {
    try {
      const res = await AsyncStorage.getItem("isLoggedIn");
      const user = await AsyncStorage.getItem("user");

      if (res == "true" || login) {
        dispatch(setTrue());
        dispatch(setUser(JSON.parse(user)));
        setIsLoggedIn(true);
      } else {
        dispatch(setFalse());
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.log("Error fetching login status from AsyncStorage:", error);
    }
  };

  useEffect(() => {
    fetchLoginStatus();
  }, [login]);

  return (
    <NavigationContainer>
      {isConnected === null ? (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: screenHeight,
          }}
        >
          <View
            style={{ padding: 50, backgroundColor: "orange", borderRadius: 20 }}
          >
            <Text
              style={{
                fontSize: 16,
                color: "#fff",
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              Checking network status...
            </Text>
          </View>
        </View>
      ) : isConnected ? (
        <Navigator
          screenOptions={{
            headerTitleAlign: "center",
            headerBackTitle: false,
            headerTitleStyle: { fontSize: 22 },
          }}
        >
          {isLoggedIn ? (
            <>
              <Screen
                name="TabNav"
                component={TabNav}
                options={{ headerShown: false }}
              />
              <Screen
                name="TaskDetails"
                component={TaskDetails}
                options={{ headerShown: true, title: "Task Detail" }}
              />
              <Screen
                name="Edit"
                component={Edit}
                options={{ headerShown: true, title: "Edit Task" }}
              />
            </>
          ) : (
            <>
              <Screen
                name="Signin"
                component={Signin}
                options={{ headerShown: false }}
              />
              <Screen
                name="Signup"
                component={Signup}
                options={{ headerShown: false }}
              />
              <Screen
                name="ForgetPassword"
                component={ForgetPassword}
                options={{ headerShown: false }}
              />
            </>
          )}
        </Navigator>
      ) : (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: screenHeight,
          }}
        >
          <View
            style={{ padding: 50, backgroundColor: "orange", borderRadius: 20 }}
          >
            <Text
              style={{
                fontSize: 16,
                color: "#fff",
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              No internet Connected!! Please check you internet connection and
              try again.
            </Text>
          </View>
        </View>
      )}
      <StatusBar style="auto" />
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <MainLayout />
    </Provider>
  );
}
