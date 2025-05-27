// screens/CompareScreen.js
import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  ActivityIndicator, TouchableOpacity, Linking, Alert, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CompareScreen({ route }) {
  const { cartItems } = route.params;
  const [marketResults, setMarketResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null); // Kullanıcı konumu state'i

  useEffect(() => {
    const fetchLocationAndCompare = async () => {
      try {
        // AsyncStorage'dan kaydedilmiş konumu al
        const storedLocation = await AsyncStorage.getItem('selectedLocation');
        if (!storedLocation) {
          Alert.alert("Konum Hatası", "Geçerli bir başlangıç konumu alınamadı. Lütfen Ana Sayfa'dan konum seçin.");
          setLoading(false);
          return;
        }

        const location = JSON.parse(storedLocation);
        setUserLocation(location); // userLocation state'ini güncelle

        if (!cartItems || cartItems.length === 0) {
          Alert.alert("Sepet Boş", "Karşılaştırılacak ürün bulunmamaktadır.");
          setLoading(false);
          return;
        }

        // API isteği için kullanıcının konumunu kullan
        const response = await fetch('http://192.168.1.15:5000/api/calculate-list-prices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            latitude: location.latitude, // API için doğru konum bilgisi
            longitude: location.longitude, // API için doğru konum bilgisi
            shopping_list: cartItems.map(item => ({
              productId: item.id,
              quantity: item.quantity
            }))
          })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Sunucudan geçerli bir JSON yanıtı alınamadı.' }));
            throw new Error(errorData.message || `Sunucu hatası: ${response.status}`);
        }

        const data = await response.json();
        setMarketResults(data);
      } catch (error) {
        console.error("API hatası (CompareScreen):", error);
        Alert.alert("API Hatası", `Market fiyatları yüklenirken bir sorun oluştu: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchLocationAndCompare();
  }, [cartItems]); // cartItems değiştiğinde useEffect'i tekrar çalıştır

  const openDirectionsInMapApp = async (startLat, startLon, destLat, destLon, marketName) => {
    if (destLat == null || destLon == null) {
        Alert.alert("Market Konum Bilgisi Eksik", "Bu market için harita açılamıyor.");
        return;
    }
    // Başlangıç konumu kontrolü: userLocation state'i üzerinden yapılmalı
    if (!userLocation || userLocation.latitude == null || userLocation.longitude == null) {
        Alert.alert("Başlangıç Konum Bilgisi Eksik", "Yol tarifi için başlangıç konumu alınamadı. Lütfen Ana Sayfa'dan konum seçin.");
        return;
    }

    // Fonksiyon parametrelerinden gelen startLat ve startLon kullanılacak.
    // Bunlar userLocation.latitude ve userLocation.longitude olmalı.
    const origin = `${startLat},${startLon}`;
    const destination = `${destLat},${destLon}`;
    const encodedMarketName = encodeURIComponent(marketName);

    const availableApps = [];

    const appsToCheck = [
      {
        name: 'Google Maps',
        iosScheme: `comgooglemaps://?saddr=${origin}&daddr=${destination}&directionsmode=driving`,
        androidScheme: `google.navigation:q=${destination}&mode=d`,
        checkScheme_iOS: 'comgooglemaps://',
        checkScheme_Android: 'google.navigation:q='
      },
      {
        name: 'Apple Maps (iOS)',
        iosScheme: `maps://?saddr=${origin}&daddr=${destination}&dirflg=d`,
        isIOSOnly: true,
        checkScheme_iOS: 'maps://'
      },
      {
        name: 'Waze',
        genericScheme: `waze://?ll=${destination}&navigate=yes`,
        checkScheme_iOS: 'waze://',
        checkScheme_Android: 'waze://'
      }
    ];

    for (const app of appsToCheck) {
      if (Platform.OS === 'ios' && app.checkScheme_iOS) {
        if (app.isIOSOnly === false && !app.checkScheme_iOS) continue;
        const supported = await Linking.canOpenURL(app.checkScheme_iOS);
        if (supported) {
          availableApps.push({ name: app.name, url: app.iosScheme });
        }
      } else if (Platform.OS === 'android' && app.checkScheme_Android) {
        if (app.isIOSOnly) continue;
        if (app.name === 'Google Maps') {
             availableApps.push({ name: app.name, url: app.androidScheme });
        } else if (app.checkScheme_Android) {
            const supported = await Linking.canOpenURL(app.checkScheme_Android);
            if (supported) {
                availableApps.push({ name: app.name, url: app.genericScheme || app.androidScheme });
            }
        }
      }
    }

    const openUrl = (url) => {
        Linking.openURL(url).catch(err => {
            console.error(`Harita uygulaması (${url.split(':')[0]}) açılamadı:`, err);
            Alert.alert("Hata", `${url.split(':')[0]} uygulaması açılamadı.`);
        });
    };
    
    // Web URL'i için origin (başlangıç noktası) bilgisini de ekleyelim.
    const webUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&query=${encodedMarketName}`;


    if (availableApps.length === 0) {
      Alert.alert(
        "Harita Uygulaması Bulunamadı",
        "Cihazınızda yol tarifi alabileceğiniz bir harita uygulaması bulunamadı. Web'de açmak ister misiniz?",
        [
          { text: "Vazgeç", style: "cancel" },
          { text: "Web'de Aç", onPress: () => openUrl(webUrl) }
        ]
      );
    } else if (availableApps.length === 1) {
      Alert.alert(
        "Yol Tarifi",
        `${availableApps[0].name} ile yol tarifi almak istiyor musunuz?`,
        [
          {text: "Vazgeç", style: "cancel"},
          {text: `Evet, ${availableApps[0].name} Kullan`, onPress: () => openUrl(availableApps[0].url)}
        ]
      )
    } else {
      const alertButtons = availableApps.map(app => ({
        text: app.name,
        onPress: () => openUrl(app.url),
      }));
      alertButtons.push({
        text: "Web'de Aç (Google Maps)",
        onPress: () => openUrl(webUrl),
      });
      alertButtons.push({
        text: "Vazgeç",
        style: "cancel",
      });

      Alert.alert(
        "Harita Uygulaması Seçin",
        "Yol tarifi için bir uygulama seçin:",
        alertButtons,
        { cancelable: true }
      );
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#005800" />
        <Text style={styles.loadingText}>Market fiyatları hesaplanıyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Market Karşılaştırması</Text>
      {marketResults.length > 0 ? (
        <FlatList
          data={marketResults}
          keyExtractor={(item, index) => item.market_id ? item.market_id.toString() : index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.marketName}>{item.market_name || 'Bilinmeyen Market'}</Text>
              <Text style={styles.infoText}>Mesafe: {item.distance != null ? `${item.distance.toFixed(2)} km` : 'N/A'}</Text>
              <Text style={styles.priceText}>Toplam Fiyat: {item.total_list_price != null ? `${item.total_list_price.toFixed(2)} ${item.currency || 'TL'}` : 'N/A'}</Text>
              {item.unavailable_items_count > 0 && (
                <View style={styles.unavailableContainer}>
                  <Text style={styles.unavailableText}>
                    Eksik Ürün Sayısı: {item.unavailable_items_count}
                  </Text>
                  {item.unavailable_item_details && item.unavailable_item_details.length > 0 && (
                     item.unavailable_item_details.map((detail, idx) => (
                        <Text key={idx} style={styles.unavailableDetailText}> - {detail.name || `ID: ${detail.productId}`}</Text>
                    ))
                  )}
                </View>
              )}
              {/* Butonun render koşulunda userLocation'ın varlığını ve içinde latitude/longitude olup olmadığını kontrol et */}
              {(item.latitude != null && item.longitude != null && userLocation && userLocation.latitude != null && userLocation.longitude != null) && (
                <TouchableOpacity
                  style={styles.mapButton}
                  onPress={() => openDirectionsInMapApp( 
                      userLocation.latitude,  // DÜZELTİLDİ: userPickedLocation -> userLocation
                      userLocation.longitude, // DÜZELTİLDİ: userPickedLocation -> userLocation
                      item.latitude,
                      item.longitude,
                      item.market_name
                    )}
                >
                  <Text style={styles.mapButtonText}>Yol Tarifi Al</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <Text style={styles.noResultsText}>
          {(!cartItems || cartItems.length === 0)
            ? "Karşılaştırma yapmak için lütfen sepetinize ürün ekleyin."
            : "Bu konum ve sepet için uygun market bulunamadı veya tüm marketlerde ürünler eksik."}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop:10,
    fontSize: 16,
    color: '#333'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  card: {
    padding: 18,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  marketName: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#005800',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 15,
    color: '#555',
    marginBottom: 5,
  },
  priceText: {
    fontSize: 17,
    color: '#111',
    fontWeight: '700',
    marginBottom: 10,
  },
  unavailableContainer: {
    marginTop: 5,
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#fff0f0',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fdd'
  },
  unavailableText: {
    fontSize: 14,
    color: '#c00',
    fontWeight: '600',
    marginBottom: 5,
  },
  unavailableDetailText: {
    fontSize: 13,
    color: '#500',
    marginLeft: 10,
    fontStyle: 'italic',
  },
  mapButton: {
    backgroundColor: '#005800',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center',
  },
  mapButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#6c757d',
    paddingHorizontal: 20,
  },
});
