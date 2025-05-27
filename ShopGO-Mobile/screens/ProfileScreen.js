// screens/ProfileScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Platform, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

const CUSTOM_GREEN_COLOR = '#005800';
const TEXT_COLOR_DARK = '#333333';
const TEXT_COLOR_LIGHT = '#777777';
const BORDER_COLOR = '#e0e0e0';
const DESTRUCTIVE_COLOR = '#d32f2f';

const LOCATION_STORAGE_KEY = 'selectedLocation';
const USER_STORAGE_KEY = 'user';
const TOKEN_STORAGE_KEY = 'accessToken';

export default function ProfileScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [displayAddress, setDisplayAddress] = useState('Yükleniyor...');
  const [loadingData, setLoadingData] = useState(true);

  // Bu fetchData fonksiyonu async ve useCallback ile sarmalanmış haliyle kalacak
  const fetchData = useCallback(async () => {
    console.log("ProfileScreen: fetchData çağrıldı."); // Kontrol için log
    setLoadingData(true);
    let fetchedUserData = null;
    let fetchedAddress = 'Henüz bir adres seçilmedi';

    try {
      const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
      if (!token) {
        console.log("ProfileScreen: Token bulunamadı.");
        const userString = await AsyncStorage.getItem(USER_STORAGE_KEY);
        if (userString) fetchedUserData = JSON.parse(userString);
      } else {
        const response = await fetch('http://192.168.1.15:5000/api/profile', { // KENDİ IP ADRESİNİZİ KULLANIN
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
        if (response.ok) {
          const apiUserData = await response.json();
          const updatedUserDataForState = {
              username: apiUserData.username,
              email: apiUserData.email,
              fullName: apiUserData.fullName || apiUserData.username,
          };
          fetchedUserData = updatedUserDataForState;
          await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUserDataForState));
        } else {
          console.error("ProfileScreen: API'dan profil verisi çekilemedi, status:", response.status);
          if (response.status === 401 || response.status === 422) {
            Alert.alert("Oturum Hatası", "Oturumunuz geçersiz. Lütfen tekrar giriş yapın.");
            await AsyncStorage.clear();
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
            setLoadingData(false); return; // Fonksiyondan erken çık
          }
          const userString = await AsyncStorage.getItem(USER_STORAGE_KEY);
          if (userString) fetchedUserData = JSON.parse(userString);
        }
      }
    } catch (e) {
      console.error("ProfileScreen: API'dan profil verisi çekilirken hata:", e);
      try {
        const userString = await AsyncStorage.getItem(USER_STORAGE_KEY);
        if (userString) fetchedUserData = JSON.parse(userString);
      } catch (asyncError) { console.error("ProfileScreen: Fallback AsyncStorage okuma hatası:", asyncError); }
      if (!fetchedUserData) Alert.alert("Hata", "Profil bilgileri yüklenirken bir sorun oluştu.");
    }
    setUserData(fetchedUserData);

    try {
      const savedLocationString = await AsyncStorage.getItem(LOCATION_STORAGE_KEY);
      if (savedLocationString) {
        const savedLocation = JSON.parse(savedLocationString);
        fetchedAddress = savedLocation.address || 'Adres ayarlanmamış';
      }
    } catch (e) {
      console.error("ProfileScreen: AsyncStorage'dan adres okunurken hata:", e);
      fetchedAddress = 'Adres yüklenemedi';
    }
    setDisplayAddress(fetchedAddress);
    setLoadingData(false);
  }, [navigation]); // navigation bağımlılığı burada kalabilir (reset için)

  // useFocusEffect'in doğru kullanımı
  useFocusEffect(
    useCallback(() => {
      // fetchData fonksiyonunu burada çağırıyoruz.
      fetchData();

      // İsteğe bağlı: Bir cleanup fonksiyonu döndürebilirsiniz.
      // Bu fonksiyon, ekran odaktan çıktığında çalışır.
      // return () => {
      //   console.log("ProfileScreen odaktan çıktı.");
      // };
    }, [fetchData]) // fetchData fonksiyonu useCallback ile sarmalandığı için,
                   // fetchData'nın kendisi bağımlılık dizisine eklenebilir.
                   // Bu, fetchData'nın referansı değişirse (ki navigation değişirse değişir)
                   // useFocusEffect'in callback'inin yeniden oluşturulmasını sağlar.
  );

  // ... (handleLogout ve MenuItem component'i aynı kalacak)
  // ... (return JSX kısmı ve stiller aynı kalacak, bir önceki mesajdaki gibi)

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkış yapmak istediğinizden emin misiniz?',
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Evet, Çıkış Yap',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert('Başarılı!', 'Başarıyla çıkış yaptınız.');
              navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
            } catch (e) {
              console.error("Çıkış yapılırken AsyncStorage temizleme hatası:", e);
              Alert.alert("Hata", "Çıkış yapılırken bir sorun oluştu.");
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const MenuItem = ({ iconName, text, subText, onPress, isLastItem = false, isDestructive = false, isLoading = false }) => (
    <TouchableOpacity
      style={[styles.menuItem, isLastItem && styles.menuItemNoBorder]}
      onPress={isLoading ? null : onPress}
      activeOpacity={isLoading ? 1 : 0.6}
    >
      <Ionicons name={iconName} size={23} color={isDestructive ? DESTRUCTIVE_COLOR : CUSTOM_GREEN_COLOR} style={styles.menuIcon} />
      <View style={styles.menuTextContainer}>
        <Text style={[styles.menuText, isDestructive && styles.destructiveText]}>{text}</Text>
        {isLoading && subText === 'Yükleniyor...' ? (
            <ActivityIndicator size="small" color={TEXT_COLOR_LIGHT} style={{alignSelf: 'flex-start', marginTop: 4}}/>
        ) : (
            subText && <Text style={styles.menuSubText}>{subText}</Text>
        )}
      </View>
      {!isDestructive && !isLoading && <Ionicons name="chevron-forward-outline" size={20} color="#cccccc" />}
    </TouchableOpacity>
  );

  if (loadingData && !userData) {
    return (
      <View style={styles.fullPageLoadingContainer}>
        <ActivityIndicator size="large" color={CUSTOM_GREEN_COLOR} />
        <Text style={styles.loadingText}>Profil bilgileri yükleniyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContentContainer}>
      <View style={styles.greetingCard}>
        <Ionicons name="person-circle" size={64} color={CUSTOM_GREEN_COLOR} style={styles.profileAvatar} />
        <Text style={styles.greetingText}>
          Merhaba, {userData?.fullName || userData?.username || 'Kullanıcı'}!
        </Text>
        {userData?.email && <Text style={styles.emailText}>{userData.email}</Text>}
      </View>

      <View style={styles.menuGroup}>
        <MenuItem iconName="person-outline" text="Kullanıcı Adı" subText={userData?.username || (loadingData ? 'Yükleniyor...' : 'N/A')} isLoading={loadingData && !userData?.username} />
        <MenuItem iconName="mail-outline" text="E-posta Adresi" subText={userData?.email || (loadingData ? 'Yükleniyor...' : 'N/A')} isLoading={loadingData && !userData?.email} />
        <MenuItem iconName="location-outline" text="Adresim" subText={displayAddress} onPress={() => navigation.navigate('LocationPicker')} isLoading={displayAddress === 'Yükleniyor...'} />
        <MenuItem iconName="settings-outline" text="Hesap Bilgilerini Düzenle" onPress={() => { if (userData) { navigation.navigate('AccountSettings', { currentUserData: userData }); } else { Alert.alert("Hata", "Kullanıcı bilgileri henüz yüklenmedi."); }}} isLastItem={false} />
        <MenuItem iconName="pricetag-outline" text="İndirim Kuponlarım" subText="Kuponlarımı Gör" onPress={() => Alert.alert("İndirim Kuponlarım", "Bu özellik yakında eklenecektir.")} isLastItem={true} />
      </View>

      <View style={styles.menuGroup}>
        <MenuItem iconName="log-out-outline" text="Çıkış Yap" onPress={handleLogout} isDestructive isLastItem={true} />
      </View>
    </ScrollView>
  );
}

// Stiller aynı kalacak (bir önceki mesajdaki gibi)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  scrollContentContainer: { paddingBottom: 30 },
  fullPageLoadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f2f5' },
  loadingText: { marginTop: 10, fontSize: 16, color: TEXT_COLOR_DARK },
  greetingCard: { backgroundColor: '#ffffff', paddingVertical: 25, paddingHorizontal: 20, alignItems: 'center', marginBottom: 12, borderBottomWidth: 1, borderBottomColor: BORDER_COLOR },
  profileAvatar: { marginBottom: 12 },
  greetingText: { fontSize: 21, fontWeight: '600', color: TEXT_COLOR_DARK, marginBottom: 4 },
  emailText: { fontSize: 15, color: '#555555' },
  menuGroup: { backgroundColor: '#ffffff', marginBottom: 12, borderRadius: 8, overflow: 'hidden', marginHorizontal: 10, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: Platform.OS === 'ios' ? 15 : 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: BORDER_COLOR },
  menuItemNoBorder: { borderBottomWidth: 0 },
  menuIcon: { marginRight: 20 },
  menuTextContainer: { flex: 1 },
  menuText: { fontSize: 16, color: TEXT_COLOR_DARK, fontWeight: '500' },
  menuSubText: { fontSize: 13, color: TEXT_COLOR_LIGHT, marginTop: 2 },
  destructiveText: { color: DESTRUCTIVE_COLOR, fontWeight: '500' },
});