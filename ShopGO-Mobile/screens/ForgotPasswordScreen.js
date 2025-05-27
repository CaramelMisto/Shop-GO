// screens/ForgotPasswordScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';

const YOUR_NEW_YELLOW_COLOR = '#ffe643'; // LoginScreen'den renk

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      Alert.alert('Hata', 'Lütfen e-posta adresinizi girin.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://192.168.1.15:5000/api/forgot-password', { // Kendi IP adresinizi kontrol edin
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      setLoading(false);
      // Backend her durumda aynı mesajı dönüyor gibi (başarılı veya e-posta bulunamadı)
      // Bu mesajı direkt gösterebiliriz.
      Alert.alert("Bilgi", data.message || "Bir sorun oluştu, lütfen tekrar deneyin.");
      if (res.ok) {
        // Opsiyonel: Başarılı istek sonrası kullanıcıyı login'e yönlendirebilir veya burada bırakabilirsiniz.
        // navigation.goBack();
      }

    } catch (e) {
      setLoading(false);
      Alert.alert("Ağ Hatası", e.message || "Sunucuya bağlanırken bir sorun oluştu.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Şifremi Unuttum</Text>
        <Text style={styles.subtitle}>
          Kayıtlı e-posta adresinizi girin. Şifre sıfırlama talimatları (eğer e-posta kayıtlıysa) gönderilecektir.
        </Text>
        <TextInput
          placeholder="E-posta Adresiniz"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Gönderiliyor...' : 'ŞİFRE SIFIRLAMA LİNKİ GÖNDER'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Giriş Ekranına Dön</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 30,
    color: '#555',
    paddingHorizontal: 10,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 25,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  submitButton: {
    width: '100%',
    backgroundColor: YOUR_NEW_YELLOW_COLOR,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  submitButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  backButton: {
    marginTop: 20,
  },
  backButtonText: {
    fontSize: 14,
    color: YOUR_NEW_YELLOW_COLOR,
    fontWeight: '600',
  }
});