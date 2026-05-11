
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator
} from "react-native";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFalse } from "../../redux/loginSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { theme } from "../../theme";
import CustomHeader from "../../components/CustomHeader";
import { SafeAreaView } from 'react-native-safe-area-context';
import { sendPasswordResetEmail, deleteUser, signOut } from "firebase/auth";
import { collection, query, where, getDocs, writeBatch, doc } from "firebase/firestore";
import { auth, db } from "../../services/Config";
import CustomAlert from "../../components/CustomAlert";

const Settings = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.loginstatus.user);
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

  const handleLogout = () => {
    showAlert(
      "Logout",
      "Are you sure you want to log out of your account?",
      "warning",
      true, // Show cancel
      async () => {
        closeAlert();
        try {
          await signOut(auth);
          await AsyncStorage.removeItem("isLoggedIn");
          await AsyncStorage.removeItem("user");
          await AsyncStorage.removeItem("TodoList");
          dispatch(setFalse());
        } catch (e) {
          console.error(e);
        }
      }
    );
  };

  const handlePasswordReset = async () => {
    showAlert(
      "Change Password",
      `We will send a password reset link to ${user?.email}. Continue?`,
      "info",
      true,
      async () => {
        closeAlert();
        try {
          if (user?.email) {
            await sendPasswordResetEmail(auth, user.email);
            setTimeout(() => {
              showAlert("Success", "Reset email sent! Please check your inbox.", "success");
            }, 500);
          }
        } catch (e) {
          setTimeout(() => {
            showAlert("Error", e.message, "error");
          }, 500);
        }
      }
    );
  };

  const handleDeleteAccount = async () => {
    showAlert(
      "Delete Account",
      "Are you sure you want to PERMANENTLY delete your account? All your tasks and data will be lost forever. This cannot be undone.",
      "error", // Using error type for red emphasis
      true,
      async () => {
        closeAlert();
        setLoading(true);
        try {
          const currentUser = auth.currentUser;
          if (!currentUser) throw new Error("No user found");

          // 1. Delete all user data from Firestore
          const q = query(
            collection(db, "todos"),
            where("userId", "==", user.uid)
          );
          const snapshot = await getDocs(q);

          const batch = writeBatch(db);
          snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
          });
          await batch.commit();

          // 2. Delete User from Auth
          await deleteUser(currentUser);

          // 3. Clear Local Storage & State
          await AsyncStorage.clear();
          dispatch(setFalse());

        } catch (error) {
          console.error(error);
          setLoading(false);
          if (error.code === 'auth/requires-recent-login') {
            setTimeout(() => {
              showAlert("Security Check", "Please log out and log in again to verify your identity before deleting your account.", "warning");
            }, 500);
          } else {
            setTimeout(() => {
              showAlert("Error", "Failed to delete account. " + error.message, "error");
            }, 500);
          }
        }
      }
    );
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <CustomHeader title="Settings" />

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Loading Overlay */}
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={theme.colors.error} />
              <Text style={{ marginTop: 10, color: theme.colors.textSecondary }}>Deleting Account...</Text>
            </View>
          )}

          {/* Centered Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{user?.fullName ? user.fullName[0].toUpperCase() : (user?.email ? user.email[0].toUpperCase() : "U")}</Text>
              </View>
              <View style={styles.badge}>
                <MaterialIcons name="edit" size={14} color="white" />
              </View>
            </View>

            <Text style={styles.userName}>{user?.fullName || user?.email?.split('@')[0] || "User"}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>

          {/* Settings List */}
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem} onPress={handlePasswordReset}>
              <View style={[styles.iconBox, { backgroundColor: theme.colors.primarySoft }]}>
                <MaterialIcons name="lock-reset" size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>Change Password</Text>
                <Text style={styles.menuSubtitle}>Update your security credentials</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={theme.colors.gray300} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <View style={[styles.iconBox, { backgroundColor: theme.colors.gray100 }]}>
                <MaterialIcons name="logout" size={24} color={theme.colors.textSecondary} />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>Log Out</Text>
                <Text style={styles.menuSubtitle}>Sign out of this device</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Danger Zone */}
          <View style={styles.dangerZoneContainer}>
            <Text style={styles.dangerZoneTitle}>DANGER ZONE</Text>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount} disabled={loading}>
              <MaterialIcons name="delete-forever" size={24} color="white" />
              <Text style={styles.deleteButtonText}>Delete Account</Text>
            </TouchableOpacity>
            <Text style={styles.dangerZoneDesc}>
              Permanently remove your account and all associated data.
            </Text>
          </View>

        </ScrollView>
      </SafeAreaView>

      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        showCancel={alertConfig.showCancel}
        onClose={closeAlert}
        onConfirm={alertConfig.onConfirm}
        confirmText={alertConfig.type === 'error' ? "DELETE" : "Confirm"}
        cancelText="Cancel"
      />
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.8)',
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: theme.spacing['2xl'],
    marginTop: theme.spacing.lg,
  },
  avatarContainer: {
    marginBottom: theme.spacing.md,
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'white',
    ...theme.shadows.md,
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 4,
    backgroundColor: theme.colors.textPrimary,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
  },
  userName: {
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.textSecondary,
  },
  menuContainer: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.md,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
    marginBottom: theme.spacing.xl,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.borderLight,
    marginVertical: theme.spacing.xs,
    marginLeft: 64,
  },
  dangerZoneContainer: {
    width: '100%',
    backgroundColor: '#FEF2F2', // Light red background
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#FCA5A5', // Red border
    alignItems: 'center',
  },
  dangerZoneTitle: {
    color: theme.colors.error,
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 1,
    marginBottom: theme.spacing.md,
  },
  deleteButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.error,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    gap: 8,
    width: '100%',
    justifyContent: 'center',
    ...theme.shadows.sm,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: theme.typography.sizes.base,
  },
  dangerZoneDesc: {
    marginTop: theme.spacing.md,
    fontSize: 12,
    color: '#7F1D1D', // Dark red
    textAlign: 'center',
  }
});
