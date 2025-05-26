// screens/CartScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native'; // CommonActions import edildi
import Ionicons from 'react-native-vector-icons/Ionicons'; // İkonlar için

const CUSTOM_GREEN_COLOR = '#005800';
const CART_STORAGE_KEY = 'userShopGoCartItems';
const WHITE_COLOR = '#ffffff';
const TEXT_COLOR_DARK = '#333333'; // Kullanılmıyorsa kaldırılabilir

export default function CartScreen({ route, navigation }) {
  const [currentCartItems, setCurrentCartItems] = useState([]);
  // cartModified state'ine ve beforeRemove listener'ına bu yaklaşımda ihtiyacımız kalmıyor,
  // çünkü HomeScreen her odaklandığında AsyncStorage'dan son sepeti çekecek.

  useEffect(() => {
    const initialItems = (route.params?.cartItems || []).map(item => ({
        ...item,
        quantity: item.quantity || 1
    }));
    setCurrentCartItems(initialItems);
  }, [route.params?.cartItems]);

  useEffect(() => {
    const saveCartToStorage = async () => {
      try {
        if (currentCartItems) {
          console.log('CartScreen - Sepet AsyncStoragea kaydediliyor:', currentCartItems);
          await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(currentCartItems));
        }
      } catch (error) {
        console.error('CartScreen - Sepet AsyncStoragea kaydedilemedi:', error);
      }
    };
    saveCartToStorage();
  }, [currentCartItems]);


  const handleIncreaseQuantity = (itemId) => {
    setCurrentCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: (item.quantity || 0) + 1 } : item
      )
    );
  };

  const handleDecreaseQuantity = (itemId) => {
    setCurrentCartItems(prevItems => {
      const newCart = prevItems.map(item => {
        if (item.id === itemId) {
          return item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : null;
        }
        return item;
      });
      return newCart.filter(Boolean);
    });
  };

  const handleRemoveItem = (itemId) => {
    Alert.alert(
      "Ürünü Sil",
      "Bu ürünü listenizden kaldırmak istediğinizden emin misiniz?",
      [
        { text: "Vazgeç", style: "cancel" },
        {
          text: "Evet, Sil",
          onPress: () => {
            setCurrentCartItems(prevItems =>
              prevItems.filter(item => item.id !== itemId)
            );
          },
          style: "destructive"
        }
      ]
    );
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItemContainer}>
      <Image source={{ uri: item.image_url }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
        <View style={styles.quantityControls}>
          <TouchableOpacity onPress={() => handleDecreaseQuantity(item.id)} style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => handleIncreaseQuantity(item.id)} style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={() => handleRemoveItem(item.id)} style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={24} color="#dc3545" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header başlığı App.js'ten ayarlanacak */}
      {/* <Text style={styles.title}>Alışveriş Listem</Text> */}
      {currentCartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="basket-outline" size={80} color="#cccccc" style={styles.emptyCartIcon} />
          <Text style={styles.emptyCartText}>Sepetiniz şu anda boş.</Text>
          <TouchableOpacity
            style={styles.startShoppingButton} // <-- YENİ BUTON STİLİ
            onPress={() => {
              // Navigasyon yığınını sıfırla ve sadece Home ekranını bırak
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [
                    { name: 'Home' }, // Yığında sadece Home ekranı olacak
                  ],
                })
              );
            }}
          >
            {/* YENİ BUTON METİN STİLİ */}
            <Text style={styles.startShoppingButtonText}>Alışverişe Başla</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={currentCartItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCartItem}
          // contentContainerStyle={{ paddingBottom: currentCartItems.length > 0 ? 80 : 20 }}
          // Footer'ı FlatList'in dışına aldığımız için bu padding'e dikkat edelim.
          // Eğer footer FlatList'in bir parçası değilse (ki değil), bu padding
          // listenin son elemanlarının footer'ın arkasında kalmamasını sağlar.
          // Ancak footer zaten absolute position değilse, FlatList kendi alanında kayacaktır.
          // Şimdilik basit bir padding bırakalım.
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
      {/* "Market Fiyatlarını Göster" butonu sadece sepette ürün varsa görünür */}
      {currentCartItems.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.compareButton}
            onPress={() => {
                navigation.navigate("Compare", { cartItems: currentCartItems });
            }}
          >
            <Text style={styles.compareButtonText}>Market Fiyatlarını Göster</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    // paddingHorizontal: 15, // FlatList ve emptyContainer kendi padding'lerini yönetebilir
    // paddingTop: 20, // Header zaten var
  },
  title: { // Bu stil artık kullanılmıyor, header başlığı App.js'ten geliyor
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: TEXT_COLOR_DARK, // TEXT_COLOR_DARK olarak güncellendi
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20, // İçeriğin kenarlara yapışmaması için
  },
  emptyCartIcon: {
    marginBottom: 20,
  },
  emptyCartText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#6c757d',
    marginBottom: 25,
  },
  startShoppingButton: {
    backgroundColor: CUSTOM_GREEN_COLOR,
    paddingVertical: 14, // Biraz daha dolgun buton
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  startShoppingButtonText: {
    color: WHITE_COLOR,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartItemContainer: {
    flexDirection: 'row',
    backgroundColor: WHITE_COLOR,
    padding: 15,
    marginHorizontal:15, // Kartların kenarlara yapışmaması için
    marginBottom: 15,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08, // Daha hafif gölge
    shadowRadius: 3,     // Daha yumuşak gölge
    elevation: 2,
  },
  itemImage: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    marginRight: 15,
    borderRadius: 5,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center', // Dikeyde ortalamak için
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT_COLOR_DARK, // TEXT_COLOR_DARK olarak güncellendi
    marginBottom: 8, // Miktar kontrolü ile arasında boşluk
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
    borderWidth:1,
    borderColor: '#ced4da'
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#495057',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 15,
    color: TEXT_COLOR_DARK, // TEXT_COLOR_DARK olarak güncellendi
  },
  deleteButton: {
    padding: 10, // Tıklama alanını artır
    marginLeft: 10,
  },
  // deleteButtonText emojisi kullanıldığı için bu stile gerek yok, ikon kullanırsanız lazım olur.
  // deleteButtonText: { fontSize: 22, color: '#dc3545' },
  footer: {
    padding: 15, // Footer'ın kendi iç boşluğu
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: WHITE_COLOR, // Arka planı beyaz yapabiliriz
  },
  compareButton: {
    backgroundColor: CUSTOM_GREEN_COLOR,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compareButtonText: {
    color: WHITE_COLOR,
    fontSize: 16,
    fontWeight: 'bold',
  }
});