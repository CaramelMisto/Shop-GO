// screens/SignUpScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  KeyboardAvoidingView, // Eklendi
  Platform            // Eklendi
} from 'react-native';

const YOUR_APP_COLOR = '#ffe643';
const LOGIN_LINK_GREEN_COLOR = '#005800';

export default function SignUpScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor.');
      return;
    }
    try {
      // API_ENDPOINT'teki boşluk kaldırıldı ve IP adresi korundu.
      const API_ENDPOINT = 'http://192.168.1.15:5000/api/register';
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: fullName,
          email: email,
          password: password,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Başarılı', data.message || 'Kayıt işlemi başarıyla tamamlandı!');
        navigation.navigate('Login');
      } else {
        Alert.alert('Kayıt Hatası', data.message || 'Kayıt sırasında bir hata oluştu.');
      }
    } catch (error) {
      console.error("Kayıt sırasında ağ veya başka bir hata:", error);
      Alert.alert('Ağ Hatası', 'Sunucuya bağlanırken bir sorun oluştu.');
    }
  };

  const handleGoogleSignUp = () => {
    Alert.alert(
      'Google ile Kayıt Ol',
      'Google ile kayıt olma özelliği henüz entegre edilmemiştir.'
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingContainer} // En dış sarmalayıcı
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContentContainer} // ScrollView içeriği için stil
        keyboardShouldPersistTaps="handled" // Klavye açıkken tıklamaları yönetir
        showsVerticalScrollIndicator={false} // Kaydırma çubuğunu gizler
      >
        {/* Form elemanlarını içeren ana View */}
        <View style={styles.formInnerContainer}>
          <Text style={styles.title}>Hesap Oluştur</Text>

          <TextInput
            style={styles.input}
            placeholder="Ad Soyad (Kullanıcı Adınız Olacak)"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />
          <TextInput
            style={styles.input}
            placeholder="E-posta Adresi"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Şifre"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Şifre Tekrarı"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
            <Text style={styles.signUpButtonText}>KAYIT OL</Text>
          </TouchableOpacity>

          <Text style={styles.separator}>VEYA</Text>

          <TouchableOpacity style={styles.googleSignUpButton} onPress={handleGoogleSignUp}>
            <Image
              source={{ uri: 'https://img.icons8.com/color/48/google-logo.png' }}
              style={styles.googleIcon}
            />
            <Text style={styles.googleSignUpButtonText}>Google ile Kayıt Ol</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginLinkContainer} onPress={() => navigation.goBack()}>
            <Text style={styles.loginLinkText}>Zaten hesabınız var mı? Giriş Yap</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // KeyboardAvoidingView için stil
  keyboardAvoidingContainer: {
    flex: 1,
    backgroundColor: '#fff', // Ekranın ana arka plan rengi
  },
  // ScrollView'in contentContainerStyle'ı için
  scrollContentContainer: {
    flexGrow: 1, // İçeriğin ScrollView'in tüm alanını kullanmasını sağlar (özellikle içerik kısaysa)
    justifyContent: 'center', // İçeriği dikeyde ortalar (içerik ekrandan kısaysa)
    paddingVertical: 20, // Üst ve altta genel bir boşluk
  },
  // Form elemanlarını içeren iç View için stil (eski styles.container'ın bazı özellikleri)
  formInnerContainer: {
    alignItems: 'center', // İçeriği yatayda ortalar
    paddingHorizontal: 30, // Yanlardan boşluk
    // backgroundColor: '#fff', // keyboardAvoidingContainer'dan geliyor
    // flex: 1, // scrollContentContainer'daki flexGrow:1 ile bu gereksiz
    // justifyContent: 'center', // scrollContentContainer'daki justifyContent ile bu gereksiz
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 25,
    textAlign: 'center',
  },
  input: {
    width: '100%', // formInnerContainer'ın padding'ine göre ayarlanır
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 18,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  signUpButton: {
    width: '100%',
    backgroundColor: YOUR_APP_COLOR,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 3,
  },
  signUpButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  separator: {
    textAlign: 'center',
    marginVertical: 20,
    color: '#aaa',
    fontWeight: '500',
    width: '100%',
  },
  googleSignUpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#fff',
    width: '100%',
    marginBottom: 20,
  },
  googleIcon: {
    width: 22,
    height: 22,
    marginRight: 12,
  },
  googleSignUpButtonText: {
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
  loginLinkContainer: {
    marginTop: 5,
  },
  loginLinkText: {
    fontSize: 14,
    color: LOGIN_LINK_GREEN_COLOR,
    fontWeight: 'bold',
  },
});