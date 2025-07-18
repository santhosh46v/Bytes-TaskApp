import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../../firebaseConfig";

const { width, height } = Dimensions.get("window");

// Responsive scaling functions
const scaleWidth = (size) => (width / 375) * size;
const scaleHeight = (size) => (height / 812) * size;
const scaleFont = (size) => size * (width / 375);

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailValid, setEmailValid] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    setEmailValid(isValid);
    return isValid;
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    validateEmail(text);
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      Alert.alert("Welcome back!", "Logged in successfully!", [
        {
          text: "OK",
          onPress: () => {
            console.log("User logged in:", user.email);
          },
        },
      ]);
    } catch (error) {
      let errorMessage = "An error occurred during login";

      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "No account found with this email address";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password";
          break;
        case "auth/invalid-email":
          errorMessage = "Please enter a valid email address";
          break;
        case "auth/user-disabled":
          errorMessage = "This account has been disabled";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many failed attempts. Please try again later";
          break;
        case "auth/network-request-failed":
          errorMessage = "Network error. Please check your connection";
          break;
        default:
          errorMessage = error.message;
      }

      Alert.alert("Login Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address first");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        "Password Reset",
        "Password reset email sent! Check your inbox and follow the instructions to reset your password."
      );
    } catch (error) {
      let errorMessage = "Failed to send password reset email";

      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "No account found with this email address";
          break;
        case "auth/invalid-email":
          errorMessage = "Please enter a valid email address";
          break;
        default:
          errorMessage = error.message;
      }

      Alert.alert("Password Reset Failed", errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView contentContainerStyle={styles.authContainer}>
        {/* Decorative elements */}
        <View style={[styles.decorativeIcon, { top: scaleHeight(161), left: scaleWidth(130) }]}>
          <Text style={styles.decorativeTextSmall}>✨</Text>
        </View>
        <View style={[styles.decorativeIcon, { top: scaleHeight(120), right: scaleWidth(180) }]}>
          <Text style={styles.decorativeTextSmall}>⭐</Text>
        </View>
        <View style={[styles.decorativeIcon, { top: scaleHeight(160), right: scaleWidth(140) }]}>
          <View style={styles.smallCircleGray} />
        </View>

        {/* Main Icon */}
        <View style={styles.authIconContainer}>
          <View style={styles.authIcon}>
            <Icon name="check" size={scaleFont(40)} color="#FFFFFF" />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.authTitle}>Welcome back!</Text>

        {/* Form */}
        <View style={styles.formContainer}>
          <View style={styles.emailContainer}>
            <TextInput
              style={[
                styles.emailInput,
                emailValid && email.length > 0 && styles.validInput,
              ]}
              placeholder="Email Address"
              placeholderTextColor="#C7C7C7"
              value={email}
              onChangeText={handleEmailChange}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
            {emailValid && email.length > 0 && (
              <Icon
                name="check"
                size={scaleFont(20)}
                color="#4CAF50"
                style={styles.checkIcon}
              />
            )}
          </View>

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              placeholderTextColor="#C7C7C7"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
            />
            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={handleForgotPassword}
              disabled={loading}
            >
              <Text
                style={[
                  styles.forgotPasswordText,
                  loading && styles.disabledText,
                ]}
              >
                Forgot password?
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.disabledButton]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>Log in</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Social Login */}
        <Text style={styles.orText}>Or log in with</Text>
        <View style={styles.socialContainer}>
          <TouchableOpacity
            style={[styles.socialButton, styles.facebookButton]}
          >
            <Text style={styles.socialButtonText}>f</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.socialButton, styles.googleButton]}>
            <Text style={styles.socialButtonText}>G</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.socialButton, styles.appleButton]}>
            <Icon name="apple" size={scaleFont(20)} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Sign Up Link */}
        <View style={styles.signUpLinkContainer}>
          <Text style={styles.signUpLinkText}>Don't have an account? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("SignUp")}
            disabled={loading}
          >
            <Text style={[styles.signUpLink, loading && styles.disabledText]}>
              Get started!
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  authContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: width * 0.085,
    paddingTop: height * 0.074,
    paddingBottom: height * 0.049,
    minHeight: height,
  },
  decorativeIcon: {
    position: "absolute",
    zIndex: 2,
  },
  decorativeTextSmall: {
    fontSize: scaleFont(16),
    color: "#6C63FF",
    opacity: 0.6,
  },
  smallCircleGray: {
    width: scaleWidth(6),
    height: scaleWidth(6),
    borderRadius: scaleWidth(3),
    backgroundColor: "#E0E0E0",
  },
  authIconContainer: {
    marginTop: height * 0.049,
    marginBottom: height * 0.039,
  },
  authIcon: {
    width: scaleWidth(64),
    height: scaleWidth(64),
    borderRadius: scaleWidth(16),
    backgroundColor: "#6C63FF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#6C63FF",
    shadowOffset: { width: 0, height: scaleHeight(4) },
    shadowOpacity: 0.3,
    shadowRadius: scaleHeight(8),
    elevation: 8,
    marginTop: height * 0.068,
  },
  authTitle: {
    fontSize: scaleFont(24),
    fontWeight: "600",
    color: "#2C2C2C",
    marginBottom: height * 0.049,
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
    marginBottom: height * 0.039,
  },
  emailContainer: {
    width: "100%",
    position: "relative",
    marginBottom: height * 0.02,
  },
  emailInput: {
    width: "100%",
    height: scaleHeight(56),
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: scaleWidth(12),
    paddingHorizontal: scaleWidth(16),
    paddingRight: scaleWidth(48),
    fontSize: scaleFont(16),
    color: "#2C2C2C",
    backgroundColor: "#FAFAFA",
  },
  validInput: {
    borderColor: "#4CAF50",
  },
  checkIcon: {
    position: "absolute",
    right: scaleWidth(16),
    top: scaleHeight(18),
  },
  passwordContainer: {
    width: "100%",
    position: "relative",
    marginBottom: height * 0.03,
  },
  passwordInput: {
    width: "100%",
    height: scaleHeight(56),
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: scaleWidth(12),
    paddingHorizontal: scaleWidth(16),
    fontSize: scaleFont(16),
    color: "#2C2C2C",
    backgroundColor: "#FAFAFA",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: scaleHeight(8),
  },
  forgotPasswordText: {
    fontSize: scaleFont(14),
    color: "#6C63FF",
    fontWeight: "500",
  },
  loginButton: {
    width: "100%",
    height: scaleHeight(56),
    backgroundColor: "#6C63FF",
    borderRadius: scaleWidth(12),
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#6C63FF",
    shadowOffset: { width: 0, height: scaleHeight(4) },
    shadowOpacity: 0.3,
    shadowRadius: scaleHeight(8),
    elevation: 8,
  },
  disabledButton: {
    backgroundColor: "#A0A0A0",
    shadowOpacity: 0.1,
  },
  loginButtonText: {
    fontSize: scaleFont(16),
    fontWeight: "600",
    color: "#FFFFFF",
  },
  orText: {
    fontSize: scaleFont(14),
    color: "#8E8E8E",
    marginBottom: height * 0.03,
  },
  socialContainer: {
    flexDirection: "row",
    gap: scaleWidth(16),
    marginBottom: height * 0.039, 
  },
  socialButton: {
    width: scaleWidth(48),
    height: scaleWidth(48),
    borderRadius: scaleWidth(24),
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: scaleHeight(2) },
    shadowOpacity: 0.1,
    shadowRadius: scaleHeight(4),
    elevation: 4,
  },
  facebookButton: {
    backgroundColor: "#4267B2",
  },
  googleButton: {
    backgroundColor: "#DB4437",
  },
  appleButton: {
    backgroundColor: "#000000",
  },
  socialButtonText: {
    fontSize: scaleFont(18),
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  signUpLinkContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: height * 0.02,
  },
  signUpLinkText: {
    fontSize: scaleFont(14),
    color: "#8E8E8E",
  },
  signUpLink: {
    fontSize: scaleFont(14),
    color: "#6C63FF",
    fontWeight: "600",
  },
  disabledText: {
    color: "#A0A0A0",
  },
});

export default LoginScreen;