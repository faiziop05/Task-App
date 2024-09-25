import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableNativeFeedback,
  Keyboard,
  Text,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { setUser } from "../../redux/loginSlice";
import { screenHeight, screenWidth } from "../../Dimentions";
import { setTrue } from "../../redux/loginSlice";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../services/Config";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, getDocs, query, where } from "firebase/firestore";

const fetchTodysTodos = async (userInfo) => {
  try {
    const q = query(
      collection(db, "todos"), // Reference to the 'todos' collection
      where("userId", "==", userInfo.uid) // First condition: match userId
    );
    const querySnapshot = await getDocs(q); // Fetch the matching documents
    if (!querySnapshot.empty) {
      // Map over the docs to return data along with document ID
      const fetchedData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        docId: doc.id, // Add document ID to each object
      }));
      return fetchedData;
    } else {
      console.log("No matching documents found!");
      return [];
    }
  } catch (error) {
    console.log("Error fetching documents:", error);
    return [];
  }
};

const Signin = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSignIn = async () => {
    try {
      if (!email || !password) {
        Alert.alert("Please enter both email and password");
        return;
      }
      setLoading(true);
      const res = await new Promise((resolve) => {
        setTimeout(() => {
          resolve(signInWithEmailAndPassword(auth, email, password));
        }, 0); // 2 seconds delay
      });
      if (res.user) {
        const userInfo = {
          email: res.user?.email,
          uid: res.user?.uid,
        };
        const res2 = await fetchTodysTodos(userInfo);
        if (res2) {
          await AsyncStorage.setItem("TodoList", JSON.stringify(res2));
        }
        await AsyncStorage.setItem("isLoggedIn", "true");
        await AsyncStorage.setItem("user", JSON.stringify(userInfo));
        dispatch(setTrue());
        dispatch(setUser(userInfo));
        setLoading(false);
      }
    } catch (error) {
      Alert.alert("Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableNativeFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 0}
        style={{ flex: 1 }}
        enabled
      >
        <ScrollView style={styles.container}>
          <View style={styles.Innercontainer}>
            <Text style={styles.ScreenHeading}>Sign In</Text>
            {loading ? (
              <View style={styles.loadingBox}>
                <ActivityIndicator size="large" color="orange" />
                <Text>Signing In</Text>
              </View>
            ) : (
              <View>
                <View style={styles.InputWrapper}>
                  <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                  />
                  <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={styles.input}
                  />

                  <TouchableOpacity
                    onPress={() => navigation.navigate("ForgetPassword")}
                    style={styles.ForgetPassButton}
                  >
                    <Text style={styles.ForgetPassText}>Forget Password</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSignIn}
                    style={styles.SubmitButton}
                  >
                    <Text style={styles.BtnText}>Sign In</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <View style={styles.SignUpScreenBtnWarpper}>
              <Text style={styles.SignUpScreenQuestion}>
                Don't have an Account?{" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                <Text style={styles.SignUpScreenBtnText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableNativeFeedback>
  );
};

export default Signin;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    
  },
  Innercontainer: {
    height: screenHeight,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  ScreenHeading: {
    fontSize: 36,
    textAlign: "center",
    fontWeight: "600",
    color: "#333",
  },
  InputWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: screenWidth - 50,
    height: 50,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    marginVertical: 10,
    color: "#222",
    fontSize: 16,
  },
  SubmitButton: {
    width: screenWidth - 50,
    height: 50,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: "orange",
    fontSize: 20,
  },
  ForgetPassButton: {
    padding: 10,
    alignSelf: "flex-end",
  },
  ForgetPassText: {
    textDecorationLine: "underline",
    color: "orange",
  },
  googleFacebookBtn: {
    width: screenWidth - 50,
    height: 50,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: "green",
  },
  BtnText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "700",
  },

  googleFacebookBtnWrapper: {
    marginTop: 50,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  SignUpScreenBtnWarpper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  SignUpScreenBtnText: {
    color: "orange",
    textDecorationLine: "underline",
    padding: 10,
    fontSize: 16,
    fontWeight: "700",
  },
  SignUpScreenQuestion: {
    fontSize: 16,
    color: "#333",
  },
  loadingBox: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
});
