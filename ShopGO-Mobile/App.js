// App.js
import React from 'react';
import { View, TouchableOpacity, Platform, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Ekranlarınızın importları
import LocationPickerScreen from './screens/LocationPickerScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import CartScreen from './screens/CartScreen';
import CompareScreen from './screens/CompareScreen';
import ProfileScreen from './screens/ProfileScreen';
import SignUpScreen from './screens/SignUpScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import AccountSettingsScreen from './screens/AccountSettingsScreen';

const Stack = createNativeStackNavigator();
const NEW_YELLOW_COLOR = '#ffe643';
const HEADER_TEXT_COLOR = '#333333';
const ICON_COLOR = '#333333'; // Bu, X ikonu için de kullanılabilir
const BADGE_BACKGROUND_COLOR = 'red';
const BADGE_TEXT_COLOR = 'white';

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: { backgroundColor: NEW_YELLOW_COLOR },
          headerTintColor: HEADER_TEXT_COLOR,
          headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
          headerBackTitleVisible: false, // iOS için geri buton metnini gizler
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LocationPicker" component={LocationPickerScreen} options={{ title: 'Konum Seç' }} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{ title: 'Kayıt Ol' }} />
        <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} options={{ title: 'Şifremi Unuttum' }}/>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation, route }) => {
            const cartTotalQuantity = route.params?.cartItemsForHeader?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
            return {
              title: 'Shop&GO',
              headerRight: () => ( <View style={styles.headerIconsContainer}>
                  <TouchableOpacity onPress={() => navigation.navigate('Cart', { cartItems: route.params?.cartItemsForHeader || [] })} style={styles.headerIconTouchable} >
                    <Ionicons name="cart-outline" size={Platform.OS === 'ios' ? 28 : 26} color={ICON_COLOR} />
                    {cartTotalQuantity > 0 && (<View style={styles.badgeContainer}><Text style={styles.badgeText}>{cartTotalQuantity}</Text></View>)}
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.headerIconTouchable} >
                    <Ionicons name="person-circle-outline" size={Platform.OS === 'ios' ? 32 : 30} color={ICON_COLOR} />
                  </TouchableOpacity>
                </View>
              ),
            };
          }}
        />
        <Stack.Screen
          name="Cart"
          component={CartScreen}
          options={({ navigation }) => ({ // navigation'ı options'a ekleyin
            headerTitle: 'Alışveriş Listem', // Başlığı "Sepetim" veya "Alışveriş Listem" yapabilirsiniz
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.goBack()} // Geri gitme işlevi
                style={styles.headerCloseButton} // Yeni stil adı
              >
                <Ionicons name="close-outline" size={30} color={ICON_COLOR} />
              </TouchableOpacity>
            ),
            // headerBackVisible: false, // headerLeft tanımlandığında bu genellikle gereksizdir
                                      // ama emin olmak için kalabilir veya kaldırılabilir.
          })}
        />
        <Stack.Screen name="Compare" component={CompareScreen} options={{ title: 'Market Karşılaştırma' }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profilim' }} />
        <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} options={{ title: 'Hesap Ayarları' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerIconsContainer: { flexDirection: 'row', alignItems: 'center', marginRight: Platform.OS === 'ios' ? 0 : 5 },
  headerIconTouchable: { paddingHorizontal: Platform.OS === 'ios' ? 10 : 12, paddingVertical: 5, position: 'relative' },
  badgeContainer: { position: 'absolute', right: 5, top: 2, backgroundColor: BADGE_BACKGROUND_COLOR, borderRadius: 9, width: 18, height: 18, justifyContent: 'center', alignItems: 'center', zIndex: 1 },
  badgeText: { color: BADGE_TEXT_COLOR, fontSize: 10, fontWeight: 'bold' },
  headerCloseButton: { // Çarpı ikonu için stil
    marginLeft: Platform.OS === 'ios' ? 15 : 10, // Sol boşluk
    padding: 5, // Tıklama alanını artırmak için
  }
});