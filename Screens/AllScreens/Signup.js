
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableNativeFeedback,
  Keyboard,
  Text,
  ScrollView,
  StatusBar
} from "react-native";
import { auth } from "../../services/Config";
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { setTrue, setUser } from "../../redux/loginSlice";
import { theme } from "../../theme";
import Input from "../../components/Input";
import Button from "../../components/Button";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomAlert from "../../components/CustomAlert";

const Signup = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // Alert State
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
    type: "info",
    showCancel: false,
    onConfirm: null
  });

  const showAlert = (title, message, type = 'info', showCancel = false, onConfirm = null) => {
    setAlertConfig({ visible: true, title, message, type, showCancel, onConfirm });
  };

  const closeAlert = () => {
    setAlertConfig(prev => ({ ...prev, visible: false }));
  };

  const handleSignUp = async () => {
    try {
      if (!name || !email || !password || !confirmPassword) {
        showAlert("Missing Fields", "Please fill in all the details to create your account.", "warning");
        return;
      }
      if (password !== confirmPassword) {
        showAlert("Password Mismatch", "The passwords you entered do not match. Please try again.", "warning");
        return;
      }
      if (password.length < 6) {
        showAlert("Weak Password", "Password should be at least 6 characters long.", "warning");
        return;
      }

      setLoading(true);
      const res = await createUserWithEmailAndPassword(auth, email, password);

      if (res.user) {
        // Update user profile
        await updateProfile(res.user, {
          displayName: name
        });

        // Send Verification Email
        await sendEmailVerification(res.user);

        // Notify user and redirect to login
        showAlert(
          "Account Created",
          "We've sent a verification link to your email. Please verify your account before logging in.",
          "success",
          false,
          () => {
            closeAlert();
            navigation.navigate("Signin");
          }
        );
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      let friendlyMsg = "Registration failed. Please try again.";
      if (error.code === 'auth/email-already-in-use') {
        friendlyMsg = "This email is already linked to another account. Try logging in instead.";
      } else if (error.code === 'auth/invalid-email') {
        friendlyMsg = "Please enter a valid email address.";
      } else if (error.code === 'auth/weak-password') {
        friendlyMsg = "Your password is too weak. Try adding numbers or symbols.";
      }

      showAlert("Registration Failed", friendlyMsg, "error");
      setLoading(false);
    }
  };

  return (
    <TouchableNativeFeedback onPress={Keyboard.dismiss}>
      <View style={styles.mainContainer}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.headerSection}>
                <View style={styles.iconWrapper}>
                  <MaterialIcons name="person-add" size={40} color={theme.colors.primary} />
                </View>
                <Text style={styles.welcomeText}>Create Account</Text>
                <Text style={styles.subText}>Join us and organize your life</Text>
              </View>

              <View style={styles.formSection}>
                <Input
                  label="Full Name"
                  placeholder="John Doe"
                  value={name}
                  onChangeText={setName}
                  leftIcon={<MaterialIcons name="person" size={20} color={theme.colors.gray400} />}
                />
                <Input
                  label="Email"
                  placeholder="hello@example.com"
                  value={email}
                  onChangeText={setEmail}
                  leftIcon={<MaterialIcons name="email" size={20} color={theme.colors.gray400} />}
                  keyboardType="email-address"
                />
                <Input
                  label="Password"
                  placeholder="Create a password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  leftIcon={<MaterialIcons name="lock" size={20} color={theme.colors.gray400} />}
                />
                <Input
                  label="Confirm Password"
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  leftIcon={<MaterialIcons name="lock-outline" size={20} color={theme.colors.gray400} />}
                />

                <Button
                  title="Sign Up"
                  onPress={handleSignUp}
                  loading={loading}
                  style={styles.signUpButton}
                />

                <View style={styles.footer}>
                  <Text style={styles.footerText}>Already have an account? </Text>
                  <Button
                    title="Sign In"
                    variant="ghost"
                    size="sm"
                    onPress={() => navigation.navigate("Signin")}
                    style={{ paddingHorizontal: 0 }}
                  />
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>

        <CustomAlert
          visible={alertConfig.visible}
          title={alertConfig.title}
          message={alertConfig.message}
          type={alertConfig.type}
          onClose={closeAlert}
          confirmText={alertConfig.type === 'success' ? "Go to Login" : "OK"}
          onConfirm={alertConfig.onConfirm}
        />
      </View>
    </TouchableNativeFeedback>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.xl,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: theme.spacing['2xl'],
  },
  iconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: theme.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  welcomeText: {
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  subText: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  formSection: {
    width: '100%',
  },
  signUpButton: {
    marginTop: theme.spacing.base,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.md,
    shadowColor: theme.colors.primary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.base,
  },
});

export default Signup;
