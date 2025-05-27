import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CUSTOM_GREEN_COLOR = '#005800';
const CART_STORAGE_KEY = 'userShopGoCartItems';
const WHITE_COLOR = '#ffffff';
const TEXT_COLOR_DARK = '#333333';

export default function CartScreen({ route, navigation }) {
  const [currentCartItems, setCurrentCartItems] = useState([]);

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
      {currentCartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="basket-outline" size={80} color="#cccccc" style={styles.emptyCartIcon} />
          <Text style={styles.emptyCartText}>Sepetiniz şu anda boş.</Text>
          <TouchableOpacity
            style={styles.startShoppingButton}
            onPress={() => {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [
                    { name: 'Home' },
                  ],
                })
              );
            }}
          >
            <Text style={styles.startShoppingButtonText}>Alışverişe Başla</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={currentCartItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCartItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: TEXT_COLOR_DARK,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
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
    paddingVertical: 14,
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
    marginHorizontal:15,
    marginBottom: 15,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
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
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT_COLOR_DARK,
    marginBottom: 8,
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
    color: TEXT_COLOR_DARK,
  },
  deleteButton: {
    padding: 10,
    marginLeft: 10,
  },
  footer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: WHITE_COLOR,
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
