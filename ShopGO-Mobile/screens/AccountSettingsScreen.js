// screens/AccountSettingsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView // Zaten vardı
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const CUSTOM_GREEN_COLOR = '#005800';
const YOUR_YELLOW_COLOR = '#ffe643';
const TEXT_COLOR_DARK = '#333333';
const WHITE_COLOR = '#ffffff';
const BORDER_COLOR = '#e0e0e0';
const PLACEHOLDER_TEXT_COLOR = '#a0a0a0';

export default function AccountSettingsScreen({ route, navigation }) {
  const { currentUserData } = route.params || {};
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPasswordSectionVisible, setIsPasswordSectionVisible] = useState(false);

  useEffect(() => {
    if (currentUserData) {
      setUsername(currentUserData.username || '');
      setEmail(currentUserData.email || '');
    }
    navigation.setOptions({ title: 'Hesap Ayarları' });
  }, [currentUserData, navigation]);

  const handleSaveChanges = async () => {
    const payload = {};
    let changesMade = false;
    let attemptingPasswordChange = !!newPassword;

    if (username.trim() && username.trim() !== (currentUserData?.username || '')) {
      payload.username = username.trim();
      changesMade = true;
    }
    if (email.trim() && email.trim() !== (currentUserData?.email || '')) {
      payload.email = email.trim();
      changesMade = true;
    }
    if (attemptingPasswordChange) {
      if (!currentPassword) {
        Alert.alert('Hata', 'Yeni şifre belirlemek için mevcut şifrenizi girmelisiniz.');
        return;
      }
      if (newPassword.length < 6) {
        Alert.alert('Hata', 'Yeni şifre en az 6 karakter olmalıdır.');
        return;
      }
      if (newPassword !== confirmNewPassword) {
        Alert.alert('Hata', 'Yeni şifreler eşleşmiyor.');
        return;
      }
      payload.currentPassword = currentPassword;
      payload.newPassword = newPassword;
      changesMade = true;
    }
    if (currentPassword && !attemptingPasswordChange && !payload.username && !payload.email) {
        Alert.alert('Bilgi', 'Sadece mevcut şifrenizi girdiniz. Şifrenizi değiştirmek için "Yeni Şifre" alanını da doldurun veya diğer bilgileri güncelleyin.');
        return;
    }
    if (!changesMade) {
      Alert.alert('Bilgi', 'Güncellenecek bir bilgi girmediniz veya girilen bilgiler mevcut bilgilerle aynı.');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert('Yetkilendirme Hatası', 'Devam etmek için lütfen tekrar giriş yapın.');
        setLoading(false);
        navigation.navigate('Login');
        return;
      }
      const response = await fetch('http://192.168.1.11:5000/api/profile', { // KENDİ IP ADRESİNİZİ KULLANIN
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const responseData = await response.json();
      setLoading(false);
      if (response.ok) {
        Alert.alert('Başarılı', responseData.message || 'Profiliniz başarıyla güncellendi.');
        if (responseData.user) {
            const existingUserString = await AsyncStorage.getItem('user');
            let updatedUserForStorage = responseData.user;
            if (existingUserString) {
                const existingUser = JSON.parse(existingUserString);
                updatedUserForStorage = { ...existingUser, ...responseData.user };
            }
            await AsyncStorage.setItem('user', JSON.stringify(updatedUserForStorage));
        }
        navigation.goBack();
      } else {
        Alert.alert('Güncelleme Hatası', responseData.message || 'Profil güncellenirken bir sorun oluştu.');
      }
    } catch (error) {
      setLoading(false);
      console.error("Hesap ayarları - Profil güncelleme API hatası:", error);
      Alert.alert('Ağ Hatası', 'Sunucuya bağlanırken bir sorun oluştu.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.kav}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Kullanıcı Bilgileri</Text>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Kullanıcı Adı</Text>
          <TextInput style={styles.input} value={username} onChangeText={setUsername} placeholder="Kullanıcı adınız" placeholderTextColor={PLACEHOLDER_TEXT_COLOR} autoCapitalize="none"/>
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>E-posta Adresi</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="E-posta adresiniz" placeholderTextColor={PLACEHOLDER_TEXT_COLOR} keyboardType="email-address" autoCapitalize="none"/>
        </View>
        <TouchableOpacity style={styles.passwordToggleTouchable} onPress={() => setIsPasswordSectionVisible(!isPasswordSectionVisible)}>
          <Text style={styles.passwordToggleText}>{isPasswordSectionVisible ? 'Şifre Değişikliğini Gizle' : 'Şifre Değiştir'}</Text>
          <Ionicons name={isPasswordSectionVisible ? "chevron-up-outline" : "chevron-down-outline"} size={22} color={CUSTOM_GREEN_COLOR}/>
        </TouchableOpacity>
        {isPasswordSectionVisible && (
          <View style={styles.passwordSection}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Mevcut Şifreniz</Text>
              <TextInput style={styles.input} value={currentPassword} onChangeText={setCurrentPassword} placeholder="Mevcut şifrenizi girin" placeholderTextColor={PLACEHOLDER_TEXT_COLOR} secureTextEntry/>
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Yeni Şifre</Text>
              <TextInput style={styles.input} value={newPassword} onChangeText={setNewPassword} placeholder="Yeni şifre (en az 6 karakter)" placeholderTextColor={PLACEHOLDER_TEXT_COLOR} secureTextEntry/>
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Yeni Şifre (Tekrar)</Text>
              <TextInput style={styles.input} value={confirmNewPassword} onChangeText={setConfirmNewPassword} placeholder="Yeni şifrenizi tekrar girin" placeholderTextColor={PLACEHOLDER_TEXT_COLOR} secureTextEntry/>
            </View>
          </View>
        )}
        <TouchableOpacity style={[styles.saveButton, loading && styles.saveButtonDisabled]} onPress={handleSaveChanges} disabled={loading}>
          {loading ? (<ActivityIndicator color={WHITE_COLOR} size="small"/>) : (<Text style={styles.saveButtonText}>Değişiklikleri Kaydet</Text>)}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  kav: { flex: 1, backgroundColor: WHITE_COLOR },
  scrollContainer: { flexGrow: 1, paddingHorizontal: 25, paddingVertical: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: TEXT_COLOR_DARK, marginBottom: 20, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: BORDER_COLOR },
  formGroup: { marginBottom: 20 },
  label: { fontSize: 15, color: '#555', marginBottom: 8, fontWeight: '500' },
  input: { borderWidth: 1, borderColor: BORDER_COLOR, borderRadius: 8, paddingHorizontal: 15, paddingVertical: Platform.OS === 'ios' ? 14 : 12, fontSize: 16, backgroundColor: '#fdfdfd', color: TEXT_COLOR_DARK },
  passwordToggleTouchable: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: BORDER_COLOR, marginBottom: 20 },
  passwordToggleText: { fontSize: 16, color: CUSTOM_GREEN_COLOR, fontWeight: '600' },
  passwordSection: { marginTop: 10 },
  saveButton: { backgroundColor: CUSTOM_GREEN_COLOR, paddingVertical: 16, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  saveButtonDisabled: { backgroundColor: '#a5d6a7' },
  saveButtonText: { color: WHITE_COLOR, fontSize: 16, fontWeight: 'bold' },
});