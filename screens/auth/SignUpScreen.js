import React, { useState } from 'react';
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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

const { width, height } = Dimensions.get('window');

// Responsive scaling functions
const scaleWidth = (size) => (width / 375) * size;
const scaleHeight = (size) => (height / 812) * size;
const scaleFont = (size) => size * (width / 375);

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleSignUp = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      Alert.alert(
        'Success!', 
        'Account created successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              console.log('User signed up:', user.email);
            }
          }
        ]
      );
    } catch (error) {
      let errorMessage = 'An error occurred during sign up';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'An account with this email already exists';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password should be at least 6 characters';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection';
          break;
        default:
          errorMessage = error.message;
      }
      
      Alert.alert('Sign Up Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView contentContainerStyle={styles.authContainer}>
        {/* Decorative elements */}
        <View style={[styles.decorativeIcon, { top: scaleHeight(160), left: scaleWidth(130) }]}>
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
        <Text style={styles.authTitle}>Let's get started!</Text>

        {/* Form */}
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#C7C7C7"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />
          
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password (min 6 characters)"
              placeholderTextColor="#C7C7C7"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
            />
          </View>

          <TouchableOpacity 
            style={[styles.signUpButton, loading && styles.disabledButton]} 
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.signUpButtonText}>Sign up</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Social Login */}
        <Text style={styles.orText}>Or sign up with</Text>
        <View style={styles.socialContainer}>
          <TouchableOpacity style={[styles.socialButton, styles.facebookButton]}>
            <Text style={styles.socialButtonText}>f</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.socialButton, styles.googleButton]}>
            <Text style={styles.socialButtonText}>G</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.socialButton, styles.appleButton]}>
            <Icon name="apple" size={scaleFont(20)} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Login Link */}
        <View style={styles.loginLinkContainer}>
          <Text style={styles.loginLinkText}>Already have an account? </Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Login')} 
            disabled={loading}
          >
            <Text style={[styles.loginLink, loading && styles.disabledText]}>
              Log in
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
    backgroundColor: '#FFFFFF',
  },
  authContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: width * 0.085,
    paddingTop: height * 0.074,
    paddingBottom: height * 0.049,
    minHeight: height,
  },
  decorativeIcon: {
    position: 'absolute',
    zIndex: 2,
  },
  decorativeTextSmall: {
    fontSize: scaleFont(16),
    color: '#6C63FF',
    opacity: 0.6,
  },
  smallCircleGray: {
    width: scaleWidth(6),
    height: scaleWidth(6),
    borderRadius: scaleWidth(3),
    backgroundColor: '#E0E0E0',
  },
  authIconContainer: {
    marginTop: height * 0.049,
    marginBottom: height * 0.039,
  },
  authIcon: {
    width: scaleWidth(64),
    height: scaleWidth(64),
    borderRadius: scaleWidth(16),
    backgroundColor: '#6C63FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: scaleHeight(4) },
    shadowOpacity: 0.3,
    shadowRadius: scaleHeight(8),
    elevation: 8,
    marginTop: height * 0.068,
  },
  authTitle: {
    fontSize: scaleFont(24),
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: height * 0.049,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    marginBottom: height * 0.039,
  },
  input: {
    width: '100%',
    height: scaleHeight(56),
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: scaleWidth(12),
    paddingHorizontal: scaleWidth(16),
    fontSize: scaleFont(16),
    color: '#2C2C2C',
    backgroundColor: '#FAFAFA',
    marginBottom: height * 0.02, 
  },
  passwordContainer: {
    width: '100%',
    position: 'relative',
    marginBottom: height * 0.03, 
  },
  passwordInput: {
    width: '100%',
    height: scaleHeight(56),
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: scaleWidth(12),
    paddingHorizontal: scaleWidth(16),
    fontSize: scaleFont(16),
    color: '#2C2C2C',
    backgroundColor: '#FAFAFA',
  },
  signUpButton: {
    width: '100%',
    height: scaleHeight(56),
    backgroundColor: '#6C63FF',
    borderRadius: scaleWidth(12),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: scaleHeight(4) },
    shadowOpacity: 0.3,
    shadowRadius: scaleHeight(8),
    elevation: 8,
  },
  disabledButton: {
    backgroundColor: '#A0A0A0',
    shadowOpacity: 0.1,
  },
  signUpButtonText: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    color: '#FFFFFF',
  },
  orText: {
    fontSize: scaleFont(14),
    color: '#8E8E8E',
    marginBottom: height * 0.03,
  },
  socialContainer: {
    flexDirection: 'row',
    gap: scaleWidth(16),
    marginBottom: height * 0.039,
  },
  socialButton: {
    width: scaleWidth(48),
    height: scaleWidth(48),
    borderRadius: scaleWidth(24),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scaleHeight(2) },
    shadowOpacity: 0.1,
    shadowRadius: scaleHeight(4),
    elevation: 4,
  },
  facebookButton: {
    backgroundColor: '#4267B2',
  },
  googleButton: {
    backgroundColor: '#DB4437',
  },
  appleButton: {
    backgroundColor: '#000000',
  },
  socialButtonText: {
    fontSize: scaleFont(18),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  loginLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: height * 0.02, 
  },
  loginLinkText: {
    fontSize: scaleFont(14),
    color: '#8E8E8E',
  },
  loginLink: {
    fontSize: scaleFont(14),
    color: '#6C63FF',
    fontWeight: '600',
  },
  disabledText: {
    color: '#A0A0A0',
  },
});

export default SignUpScreen;