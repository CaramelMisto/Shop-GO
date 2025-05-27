// screens/LoginScreen.js
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Image, Alert,
  KeyboardAvoidingView, // Zaten vardı
  ScrollView,         // Zaten vardı
  Platform            // Zaten vardı
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const YOUR_NEW_YELLOW_COLOR = '#ffe643';
const CUSTOM_GREEN_COLOR = '#005800';
const BUTTON_TEXT_COLOR_WHITE = '#FFFFFF';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await fetch('http://192.168.1.15:5000/api/login', { // IP adresinizi kontrol edin
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (res.ok) {
        await AsyncStorage.setItem('accessToken', data.access_token);
        await AsyncStorage.setItem('user', JSON.stringify({
          username: data.username,
          fullName: data.fullName
        }));
        navigation.replace("Home");
      } else {
        Alert.alert("Giriş Hatası", data.message || "Bilgiler yanlış.");
      }
    } catch (e) {
      Alert.alert("Sunucu hatası", e.message || "Bir şeyler ters gitti, lütfen tekrar deneyin.");
    }
  };

  const handleSignUpNavigation = () => {
    navigation.navigate('SignUpScreen');
  };

  const handleForgotPasswordNavigation = () => {
    navigation.navigate('ForgotPasswordScreen');
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.topPanel}>
        <Image source={require('../assets/splash_logo.png')} style={styles.logo} />
      </View>

      <View style={styles.bottomPanelContainer}>
        <ScrollView
          contentContainerStyle={styles.bottomPanelContentContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.formTitle}>Giriş Yap</Text>

          <TextInput
            placeholder="E-posta"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Şifre"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity onPress={handleForgotPasswordNavigation} style={styles.forgotPasswordContainer}>
            <Text style={styles.forgotPasswordText}>Şifremi Unuttum?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>GİRİŞ YAP</Text>
          </TouchableOpacity>

          <View style={styles.signUpContainer}>
            <Text style={styles.noAccountText}>Hesabınız yok mu? </Text>
            <TouchableOpacity onPress={handleSignUpNavigation}>
              <Text style={styles.signUpLink}>Kayıt Ol</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.separator}>VEYA</Text>

          <TouchableOpacity style={styles.googleButton}>
            <Image source={{ uri: 'https://img.icons8.com/color/48/google-logo.png' }} style={styles.googleIcon} />
            <Text style={styles.googleText}>Google ile Devam Et</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff'
  },
  topPanel: {
    flex: 0.4,
    backgroundColor: YOUR_NEW_YELLOW_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  logo: {
    width: 220,
    height: 220,
    resizeMode: 'contain',
  },
  bottomPanelContainer: {
    flex: 0.6,
    backgroundColor: '#fff',
  },
  bottomPanelContentContainer: {
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 20,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#222',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9'
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 15,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: CUSTOM_GREEN_COLOR, // Yeşil olarak güncellenmişti
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: CUSTOM_GREEN_COLOR, // Yeşil olarak güncellenmişti
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2, },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 3,
  },
  loginButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: BUTTON_TEXT_COLOR_WHITE, // Beyaz olarak güncellenmişti
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  noAccountText: {
    fontSize: 14,
    color: '#555',
  },
  signUpLink: {
    fontSize: 14,
    color: CUSTOM_GREEN_COLOR, // Yeşil olarak güncellenmişti
    fontWeight: 'bold',
  },
  separator: {
    textAlign: 'center',
    marginVertical: 15,
    color: '#aaa',
    fontWeight: '500',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#fff'
  },
  googleIcon: {
    width: 22,
    height: 22,
    marginRight: 12,
  },
  googleText: {
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  }
});