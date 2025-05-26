# 📱Shop-GO Mobil Uygulaması

Bu dosya, Shop-GO projesinin mobil uygulamasının mevcut durumunu, kalan işleri ve nasıl çalıştırılacağını açıklamaktadır.

## 📝 Genel Bakış
Shop-GO, kullanıcıların alışveriş listelerine göre en uygun fiyatlı ve en yakın marketi seçmelerine yardımcı olan yenilikçi bir alışveriş planlama uygulamasıdır. Web versiyonunun ardından mobil uygulama geliştirme süreci başlamış ve temel işlevler başarıyla mobil tarafa taşınmıştır.
---

## ✅ Yapılanlar

* **Kullanıcı Arayüzü (UI) Tasarımı:**
    * [ ] Ürün listeleme sayfası tamamlandı.
  
* **Temel Fonksiyonlar:**

    * [ ] Ürünleri listeleme (API'den veri çekme işlemi yapıldı).
  
* **Backend Entegrasyonu:**
    * [ ] Giriş API entegrasyonu yapıldı.
    * [ ] Ürün listeleme API'si bağlandı.
  
* **Diğer:**
    
---

## 🚧 Yapılacaklar / Kalan İşler

* **Kullanıcı Arayüzü (UI) Geliştirmeleri:**
    * [ ] Profil sayfası tasarımı ve geliştirmesi.
    * [ ] Siparişlerim sayfası.
    * [ ] Kullanıcı arayüzü iyileştirmeleri ve animasyonlar.
    * [ ] Sayfa tasarımları
    * [ ]  Ürün detay sayfası 
* **Fonksiyonellik:**
    * [ ] Sepet yönetimi (ürün silme, adet güncelleme).
    * [ ] Ödeme sistemi entegrasyonu.
    * [ ] Kullanıcı yorumları ve puanlama sistemi.
    * [ ] Bildirim sistemi (Push notifications).
    * [ ] Ürün arama fonksiyonu 
* **Backend Entegrasyonu:**
    * [ ] Sipariş oluşturma API entegrasyonu.
    * [ ] Adres yönetimi API'leri.
* **Testler:**
    * [ ] Birim testleri yazılacak.
    * [ ] Entegrasyon testleri yapılacak.
    * [ ] Kullanıcı kabul testleri planlanacak.
* **Diğer:**
    * [ ] Performans optimizasyonları.
    * [ ] Hata takip ve loglama mekanizması.
    * [ ] Çoklu dil desteği (isteğe bağlı).

## 📷 Demo Fotoğraflar
![giriş](https://github.com/user-attachments/assets/a86a4b42-f360-41dc-aaef-4e69703c9a7d)
![şifre unuttum](https://github.com/user-attachments/assets/79c6db49-cd9d-4b9e-a005-0fdfac33bc34)
![kayıtol](https://github.com/user-attachments/assets/b3cfed1d-e473-4d25-b421-dc1d157ed7d6)
![ürünler](https://github.com/user-attachments/assets/4b8e531e-18d2-425b-a0ac-4ff0b06a4347)
![hesap,](https://github.com/user-attachments/assets/d19a0f21-c583-4ed0-af58-048d38eed863)
![konum](https://github.com/user-attachments/assets/c9058cab-9c3d-4ae0-b4d0-cb16af49f388)
![boş sepet](https://github.com/user-attachments/assets/f42d79d5-8465-4643-9b0e-89d633d2d6fd)
![sepet](https://github.com/user-attachments/assets/93339035-fa1c-4038-a31e-b034bbca64bf)
![yol tarifi](https://github.com/user-attachments/assets/1564e33a-7cc1-4490-8410-d8b6aed073f2)
![yol](https://github.com/user-attachments/assets/4c79a8fc-40c8-4b83-8147-dc19487ab3f8)




✅ Geliştirme Planı
| Aşama | Açıklama                                         | Durum               |
| ----- | ------------------------------------------------ | ------------------- |
| 1     | Web login ekranının UI yapısını mobilde oluştur  | 🔜 Şimdi başlıyoruz |
| 2     | Renkler, yazı tipleri, buton görünümü birebir    | 🔜 Sonra            |
| 3     | Google login butonunu görsel olarak web'e benzet | 🔜                  |
| 4     | Layout'u responsive yap                          | 🔜                  |
| 5     | Giriş başarılıysa HomeScreen yönlendirmesi       | ✅ Hazır             |
| 6     | AsyncStorage üzerinden login kontrolü            | ✅ Hazır             |
| 7     | Logout ve session kontrolü                       | 🔜 Sonradan         |



## 📄 Notlar
*DOLDURULACAK*

## 📱 MOBİL UYGULAMA NASIL ÇALIŞTIRILIR! 
| Adımlar                          | Açıklama                               |
| -------------------------------- | -------------------------------------- |
| VSCode ya da CMD aç              | Flask projenin olduğu klasörde         |
| `cd` ile `Backend` klasörüne git | Flask `app.py` burada olmalı           |
| Virtualenv'i aktif et            | `venv\Scripts\activate`                |
| Flask başlat                     | `flask run --host=0.0.0.0 --port=5000` |
| Expo Go dan başlat               | npm start                              |
IP ADRESI FARKLI ISE:
💡	ipconfig ile bak
🧠 React Native IP'yi güncelle	fetch("http://YENİ-IP:5000/...")!!
