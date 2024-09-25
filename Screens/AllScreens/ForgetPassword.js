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
} from "react-native";
import { screenHeight, screenWidth } from "../../Dimentions";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "../../services/Config";

const ForgetPassword = ({ navigation }) => {
  const [email, setEmail] = useState("");

  const handlePasswordReset = async () => {
    try {
      if (!email) {
        Alert.alert("Please enter your email");

        return;
      }
      const res = await sendPasswordResetEmail(auth, email);
      alert("Check Your Email to reset your password");
      navigation.pop();
    } catch (error) {
      console.log(error);
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
            <Text style={styles.ScreenHeading}>Forgat Password</Text>

            <View>
              <View style={styles.InputWrapper}>
                <TextInput
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  style={styles.input}
                />
                <TouchableOpacity
                  onPress={handlePasswordReset}
                  style={styles.SubmitButton}
                >
                  <Text style={styles.BtnText}>Reset Password</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.SignUpScreenBtnWarpper}>
              <Text style={styles.SignUpScreenQuestion}>
                Don't have an Account?
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

export default ForgetPassword;

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
