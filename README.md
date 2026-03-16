<table>
  <tr>
    <td valign="middle">
      <h1>Akıllı Rehber</h1>
      <p><strong>Erişilebilirlik odaklı, sesli arama destekli mobil rehber uygulaması.</strong></p>
      <p>
        Akıllı Rehber; yaşlı bireyler, görme güçlüğü çeken kişiler, okuma-yazma seviyesi düşük kullanıcılar ve
        teknolojiye uzak bireyler için tasarlanmış bir telefon rehberi uygulamasıdır. Standart rehber
        uygulamalarındaki küçük yazılar, karmaşık menüler ve metin tabanlı arama gibi zorlukları ortadan
        kaldırarak <strong>sesle arama</strong>, <strong>büyük arayüz elemanları</strong> ve
        <strong>çok dilli destek</strong> sunar.
      </p>
    </td>
    <td align="right" valign="middle" width="320">
      <img src="./assets/akilli-rehber.png" alt="Akıllı Rehber" width="280" />
    </td>
  </tr>
</table>

---

## 🎯 Proje Amacı

Günümüzde akıllı telefonlar güçlü iletişim araçları sunsa da, standart rehber uygulamaları herkes için kolay kullanılabilir değildir. Özellikle:

- **Yaşlı kullanıcılar** — küçük butonlar ve yoğun arayüzlerle zorlanır
- **Görme bozukluğu yaşayanlar** — metin tabanlı aramalar ve ince detaylar erişimi kısıtlar
- **Okuma-yazma seviyesi düşük kullanıcılar** — klavye ile arama yapmak güç olabilir
- **Teknolojiye alışkın olmayanlar** — çok katmanlı menüler kafa karıştırıcıdır

Akıllı Rehber, bu kullanıcı gruplarının bir kişiyi bulup aramasını **tek bir sesli komutla** mümkün kılar. Arayüz tasarımından etkileşim modellerine kadar her detay **basitlik ve erişilebilirlik** ilkesiyle şekillendirilmiştir.

---

## ✨ Özellikler

### 🎙️ Sesli Arama
- Mikrofona basıp kişi adını söyleyerek arama başlatma
- Türkçe, Kürtçe (Kurmancî) ve Arapça doğal dil desteği
- Yüksek güvenilirlikte eşleşmede otomatik arama başlatma
- Birden fazla eşleşmede kullanıcıya seçenek sunma

### 👥 Kişi Yönetimi
- Cihaz rehberinden kişileri okuma ve listeleme
- Bulanık metin araması (fuzzy search) ile hızlı kişi bulma
- Kişi adı ve fotoğrafını uygulama içinden güncelleme
- Üç farklı kart boyutu: küçük, orta, büyük
- Tek dokunuşla arama başlatma

### ❤️ Favoriler
- Kişileri favori olarak işaretleme
- Ayrı favoriler sekmesinden hızlı erişim

### 🌍 Çok Dilli Arayüz
- Türkçe, Kürtçe (Kurmancî) ve Arapça tam arayüz çevirisi

### 🎨 Tema Desteği
- Açık ve koyu tema
- Sistem temasına göre otomatik algılama

### ⚙️ Ayarlar
- Dil seçimi
- Kişi kartı boyutu ayarı
- Varsayılan başlangıç ekranı seçimi (Ana Sayfa / Favoriler / Sesli Arama)
- Rehber senkronizasyonu

---

## 🏗️ Mimari

### Genel Yapı

```
app/                        # Expo Router — Dosya tabanlı navigasyon
  (tabs)/
    index.tsx               # Ana sayfa (kişi listesi + arama)
    favorites.tsx           # Favoriler ekranı
    voice.tsx               # Sesli arama ekranı
    settings.tsx            # Ayarlar ekranı
  edit-contact.tsx          # Kişi adı ve fotoğrafı düzenleme ekranı

src/
  components/               # Yeniden kullanılabilir UI bileşenleri
  hooks/                    # Özel React hook'ları
  services/                 # İş mantığı servisleri
  store/                    # Zustand durum yönetimi
  storage/                  # MMKV kalıcı depolama adaptörü
  i18n/                     # Çoklu dil sistemi ve çeviriler
  theme/                    # Renk paletleri ve responsive ölçekleme
  voice/                    # NLP motoru ve ses işleme pipeline'ı
  types/                    # TypeScript tip tanımları
```

### Durum Yönetimi

Uygulama **Zustand** ile yönetilen beş bağımsız store kullanır:

| Store | Sorumluluk | Kalıcı |
|-------|-----------|--------|
| `contactsStore` | Kişi listesi ve yükleme durumu | ✅ |
| `contactEditsStore` | Kişi adı ve fotoğraf düzenleme verileri | ✅ |
| `favoritesStore` | Favori kişi ID'leri | ✅ |
| `settingsStore` | Tema, dil, boyut, varsayılan ekran | ✅ |
| `voiceStore` | Sesli arama geçici durumu | ❌ |

Kalıcı store'lar **MMKV** üzerinden persist edilir; bellek verimliliği için avatar verileri depolamadan çıkarılır.

### Sesli Arama Pipeline'ı

```
Ses Girişi → Konuşma Tanıma → NLP İşleme → Kişi Eşleme → Sonuç
    │              │                │              │            │
    │         expo-speech-     Niyet çözümleme   Fuse.js     Otomatik
    │         recognition      + suffix strip    fuzzy +     arama veya
    │         (tr/ku/ar)       + stop word       direkt      seçenek
    └──────────────┴──────────────┴──────────────┴────────────┘
```

**NLP İşleme Adımları:**
1. Yanlış tanınan kelimelerin düzeltilmesi (özellikle Kürtçe için)
2. Selamlama ifadelerinin temizlenmesi
3. Regex tabanlı komut kalıbı eşleme (*"[isim]'i ara"*, *"call [name]"*)
4. Durak kelimelerin (stop words) çıkarılması
5. Türkçe morfolojik ek sıyırma (hal ekleri: -i, -e, -de, -den vb. — 96 regex deseni)
6. Güvenilirlik skoru hesaplama ve eşik değer kontrolü

---

## 🛠️ Teknoloji Yığını

| Katman | Teknoloji | Sürüm |
|--------|-----------|-------|
| Framework | React Native | 0.81 |
| Platform | Expo SDK | 54 |
| Navigasyon | expo-router | 6.x |
| Dil | TypeScript (strict) | 5.9 |
| Durum Yönetimi | Zustand | 5.x |
| Kalıcı Depolama | react-native-mmkv | 4.x |
| Bulanık Arama | Fuse.js | 7.x |
| Konuşma Tanıma | expo-speech-recognition | 3.x |
| Kişi Erişimi | expo-contacts | 15.x |
| İkonlar | @expo/vector-icons (Ionicons) | 15.x |

---

## 🚀 Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npx expo start

# Android'de çalıştır
npx expo run:android

# iOS'te çalıştır
npx expo run:ios
```

### Gerekli İzinler

| İzin | Açıklama |
|------|----------|
| `READ_CONTACTS` | Cihaz rehberine erişim |
| `CALL_PHONE` | Arama başlatma |
| `RECORD_AUDIO` | Sesli arama için mikrofon erişimi |

---

## 📄 Lisans

Bu proje lisans dosyasında belirtilen koşullar altında lisanslanmıştır. Detaylar için [LICENSE](./LICENSE) dosyasına bakınız.
