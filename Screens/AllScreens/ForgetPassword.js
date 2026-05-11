
import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../services/Config";
import { theme } from "../../theme";
import CustomHeader from "../../components/CustomHeader";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomAlert from "../../components/CustomAlert";

const ForgetPassword = ({ navigation }) => {
    const [email, setEmail] = useState("");
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

    const handleResetPassword = async () => {
        if (!email) {
            showAlert("Required Field", "Please enter your email address.", "warning");
            return;
        }

        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            showAlert(
                "Email Sent",
                "Password reset link has been sent to your inbox.",
                "success",
                false,
                () => {
                    closeAlert();
                    navigation.goBack();
                }
            );
        } catch (error) {
            console.log(error);
            let errorMessage = "Something went wrong.";
            if (error.code === 'auth/user-not-found') {
                errorMessage = "No user found with this email.";
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "Invalid email format.";
            }
            showAlert("Error", errorMessage, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.mainContainer}>
            <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
                <CustomHeader
                    title="Forgot Password"
                    showBack
                    onBackPress={() => navigation.goBack()}
                />

                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.title}>Reset Password</Text>
                            <Text style={styles.subtitle}>
                                Enter your email address and we'll send you a link to reset your password.
                            </Text>
                        </View>

                        <View style={styles.formContainer}>
                            <Input
                                placeholder="Email Address"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                icon="email"
                            />

                            <Button
                                title="Send Reset Link"
                                onPress={handleResetPassword}
                                loading={loading}
                                style={styles.submitBtn}
                            />
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>

            <CustomAlert
                visible={alertConfig.visible}
                title={alertConfig.title}
                message={alertConfig.message}
                type={alertConfig.type}
                showCancel={alertConfig.showCancel}
                onClose={closeAlert}
                onConfirm={alertConfig.onConfirm}
                confirmText={alertConfig.type === 'success' ? "Back to Login" : "OK"}
            />
        </View>
    );
};

export default ForgetPassword;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    safeArea: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: theme.spacing.xl,
    },
    headerTextContainer: {
        marginTop: theme.spacing.xl,
        marginBottom: theme.spacing['2xl'],
    },
    title: {
        fontSize: theme.typography.sizes['3xl'],
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.sm,
    },
    subtitle: {
        fontSize: theme.typography.sizes.base,
        color: theme.colors.textSecondary,
        lineHeight: 22,
    },
    formContainer: {
        gap: theme.spacing.lg,
    },
    submitBtn: {
        marginTop: theme.spacing.sm,
    }
});
