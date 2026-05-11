
import React, { useEffect, useState } from "react";
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
import { setUser, setTrue } from "../../redux/loginSlice";
import { signInWithEmailAndPassword, sendEmailVerification, signOut } from "firebase/auth";
import { auth, db } from "../../services/Config";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, getDocs, query, where } from "firebase/firestore";
import { theme } from "../../theme";
import Input from "../../components/Input";
import Button from "../../components/Button";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomAlert from "../../components/CustomAlert";

const fetchTodysTodos = async (userInfo) => {
  try {
    const q = query(
      collection(db, "todos"),
      where("userId", "==", userInfo.uid)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const fetchedData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        docId: doc.id,
      }));
      return fetchedData;
    } else {
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

  const handleSignIn = async () => {
    try {
      if (!email || !password) {
        showAlert("Missing Fields", "Please enter both your email and password to continue.", "warning");
        return;
      }
      setLoading(true);

      const res = await signInWithEmailAndPassword(auth, email, password);

      if (res.user) {
        // Enforce Email Verification
        if (!res.user.emailVerified) {
          showAlert(
            "Email Not Verified",
            "Please verify your email address before logging in. Check your inbox for the verification link.",
            "warning",
            true, // Show optional "Resend" type action effectively
            async () => {
              // On Confirm (Resend)
              closeAlert();
              try {
                await sendEmailVerification(res.user);
                setTimeout(() => showAlert("Email Sent", "Verification email resent successfully.", "success"), 500);
              } catch (e) {
                // Likely 'auth/too-many-requests' or similar
                console.log(e);
              }
            }
          );
          // Sign out immediately so they aren't 'logged in' in Firebase internal state
          await signOut(auth);
          setLoading(false);
          return;
        }

        // Proceed if verified
        const userInfo = {
          email: res.user?.email,
          uid: res.user?.uid,
          fullName: res.user?.displayName || "User",
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
      console.log(error);
      let friendlyMsg = "Something went wrong. Please try again.";
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        friendlyMsg = "Incorrect email or password. Please check your credentials.";
      } else if (error.code === 'auth/invalid-email') {
        friendlyMsg = "The email address is not valid.";
      } else if (error.code === 'auth/too-many-requests') {
        friendlyMsg = "Too many failed attempts. Please try again later.";
      }

      showAlert("Login Failed", friendlyMsg, "error");
    } finally {
      if (!alertConfig.visible) setLoading(false);
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
                  <MaterialIcons name="fact-check" size={48} color={theme.colors.primary} />
                </View>
                <Text style={styles.welcomeText}>Welcome Back</Text>
                <Text style={styles.subText}>Sign in to continue managing your tasks</Text>
              </View>

              <View style={styles.formSection}>
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
                  placeholder="Your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  leftIcon={<MaterialIcons name="lock" size={20} color={theme.colors.gray400} />}
                />

                <View style={styles.forgotPasswordContainer}>
                  <Button
                    title="Forgot Password?"
                    variant="ghost"
                    size="sm"
                    onPress={() => navigation.navigate("ForgetPassword")}
                    textStyle={styles.forgotPasswordText}
                  />
                </View>

                <Button
                  title="Sign In"
                  onPress={handleSignIn}
                  loading={loading}
                  style={styles.signInButton}
                />

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.dividerLine} />
                </View>

                <View style={styles.footer}>
                  <Text style={styles.footerText}>Don't have an account? </Text>
                  <Button
                    title="Sign Up"
                    variant="ghost"
                    size="sm"
                    onPress={() => navigation.navigate("Signup")}
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
          confirmText={alertConfig.visible && alertConfig.message.includes('not verified') ? "Resend Email" : "OK"}
          showCancel={alertConfig.showCancel}
          onConfirm={alertConfig.onConfirm}
        />
      </View>
    </TouchableNativeFeedback>
  );
};

export default Signin;

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
    marginBottom: theme.spacing['3xl'],
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: theme.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  welcomeText: {
    fontSize: theme.typography.sizes['3xl'],
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
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: theme.spacing.lg,
  },
  forgotPasswordText: {
    color: theme.colors.primary,
  },
  signInButton: {
    marginBottom: theme.spacing.xl,
    ...theme.shadows.md,
    shadowColor: theme.colors.primary, // Glow effect
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  dividerText: {
    paddingHorizontal: theme.spacing.md,
    color: theme.colors.textTertiary,
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
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
