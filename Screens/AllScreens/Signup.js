import React, { useState } from "react";
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
} from "react-native";
import { auth } from "../../services/Config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { screenHeight, screenWidth } from "../../Dimentions";
import { useDispatch } from "react-redux";
import { setTrue } from "../../redux/loginSlice";
const Signup = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();

  const handleSignUp = async () => {
    try {
      if (!email) {
        alert("Please Enter Email");
        return;
      }
      if (!password) {
        alert("Please Enter Password");
        return;
      }
      if (!confirmPassword) {
        alert("Please Enter Confirm Password");
        return;
      }
      if (!email && !password && !confirmPassword) {
        alert("Please Enter Email and Password");
        return;
      }
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      if (Array.from(password).length < 6) {
        alert("Password must be atleast 6 character");
        return;
      }
      const res = await createUserWithEmailAndPassword(auth, email, password);

      if (res.user) {
        const userInfo = {
          email: res.user.email,
          uid: res.user.uid,
        };
        dispatch(setTrue());
        dispatch(setUser(userInfo));
        await AsyncStorage.setItem("isLoggedIn", "true");
        await AsyncStorage.setItem("user", JSON.stringify(userInfo));
      }
    } catch (error) {
      if (error.message == "Firebase: Error (auth/email-already-in-use).") {
        alert("Email Already in use. Choose differnt Email.");
      }
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
            <Text style={styles.ScreenHeading}>Sign Up</Text>
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
              <TextInput
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                style={styles.input}
              />
              <TouchableOpacity
                style={styles.SubmitButton}
                onPress={handleSignUp}
              >
                <Text style={styles.BtnText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.SignUpScreenBtnWarpper}>
              <Text style={styles.SignUpScreenQuestion}>
                Already have an Account?{" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Signin")}>
                <Text style={styles.SignUpScreenBtnText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableNativeFeedback>
  );
};

export default Signup;

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
    marginTop: 10,
    backgroundColor: "orange",
    fontSize: 20,
  },
  googleFacebookBtn: {
    width: screenWidth - 50,
    height: 50,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    marginBottom: 10,
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
});
