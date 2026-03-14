# NasAi - Akıllı Sesli Rehber Uygulaması

Türkçe ve Kürtçe (Kurmancî) destekli, yapay zeka tabanlı sesli kişi arama uygulaması. Kullanıcı sesli komutla rehberdeki kişileri arayabilir. NLP motoru Türkçe/Kürtçe dillerini otomatik tespit eder, fonetik normalizasyonla Kürtçe söylenmiş isimleri Türkçe rehber kayıtlarıyla eşleştirir.

---

## Teknoloji Yığını

| Katman | Teknoloji | Açıklama |
|--------|-----------|----------|
| Framework | Expo SDK 54 + React Native 0.81 | Cross-platform mobil uygulama |
| Dil | TypeScript (strict mode) | Tip güvenli geliştirme |
| Navigasyon | expo-router v6 (file-based tabs) | Dosya tabanlı sayfa yönlendirme |
| State Yönetimi | Zustand v5 + MMKV persist | RAM state + disk kalıcılık |
| Fuzzy Arama | Fuse.js v7 | Bulanık metin eşleştirme |
| Ses Kaydı | expo-av v16 | Mikrofon erişimi ve kayıt |
| STT (Speech-to-Text) | whisper.rn (whisper.cpp wrapper) | Offline sesten metne dönüşüm (cihaz üzerinde) |
| NLP Motoru | Özel Türkçe/Kürtçe intent parser | Dil tespiti, stop word/ek temizleme |
| Fonetik Motor | Özel karakter/pattern normalizer | Kürtçe→Türkçe isim dönüşümü |
| Tema | Light/Dark (otomatik + manuel) | Tam karanlık mod desteği |
| i18n | Türkçe / Kürtçe | İki dilde arayüz |
| Responsive | PixelRatio tabanlı ölçekleme | Her ekran boyutunda uyumlu |

---

## Proje Yapısı

```
src/
├── ai/                         # NLP motor katmanı
│   ├── nlpConstants.ts         # Tüm fonetik haritalar, stop word'ler, regex pattern'ler, sabitler
│   ├── phoneticNormalizer.ts   # Fonetik dönüşüm fonksiyonları (charMap + patternMap)
│   ├── intentParser.ts         # Dil tespiti, selamlama/stop word/ek temizleme, komut çıkarma
│   ├── matchingService.ts      # Fuse.js tabanlı çoklu strateji fuzzy kişi eşleştirme
│   └── whisperService.ts       # Whisper.cpp offline STT servisi (singleton context yönetimi)
├── components/
│   ├── VoiceSearchModal.tsx    # Sesli arama UI bileşeni (5 durum + pulse animasyon)
│   ├── ContactCard.tsx         # Kişi kartı bileşeni (3 boyut: small/medium/large)
│   ├── ContactGrid.tsx         # Kişi listesi (FlatList)
│   ├── SearchBar.tsx           # Metin arama çubuğu
│   ├── BottomTabBar.tsx        # Alt navigasyon çubuğu
│   ├── SelectedMenu.tsx        # Tab butonu bileşeni
│   ├── FavoriteButton.tsx      # Favori kalp butonu
│   ├── ThemeSwitch.tsx         # Tema değiştirme anahtarı
│   └── Settings*.tsx           # Ayarlar sayfası bileşenleri
├── hooks/
│   ├── useVoiceSearch.ts       # Sesli arama hook'u (kayıt + NLP pipeline orchestration)
│   ├── useWhisper.ts           # Whisper STT hook'u (model lazy-load + transcribe)
│   ├── useContacts.ts          # Rehber kişileri hook'u (bootstrap kontrolü)
│   ├── useSearch.ts            # Metin arama hook'u
│   ├── useFavorites.ts         # Favoriler hook'u
│   └── useTheme.ts             # Tema hook'u (light/dark palette döndürür)
├── i18n/
│   ├── index.ts                # useI18n hook'u (t() fonksiyonu ve language)
│   └── locales/
│       ├── tr.json             # Türkçe çeviriler (50+ key)
│       └── ku.json             # Kürtçe (Kurmancî) çeviriler (50+ key)
├── services/
│   ├── callService.ts          # Telefon arama servisi (tel:// / telprompt://)
│   ├── contactsService.ts      # Rehber çekme + normalizedName/phoneticName hesaplama
│   └── searchService.ts        # Metin tabanlı filtre arama servisi
├── storage/
│   └── mmkv.ts                 # MMKV storage adaptörü (Zustand persist middleware için)
├── store/
│   ├── contactsStore.ts        # Rehber state (contacts[], loading, loadContacts)
│   ├── favoritesStore.ts       # Favoriler state (favoriteIds[], toggleFavorite)
│   └── settingsStore.ts        # Ayarlar state (tema, dil, boyut, varsayılan ekran)
├── theme/
│   ├── colors.ts               # Light/Dark renk paletleri (20+ renk tokeni)
│   └── responsive.ts           # PixelRatio tabanlı scale/verticalScale/moderateScale
└── types/
    ├── index.ts                # Tüm TypeScript tip tanımları
    └── whisper-rn.d.ts         # whisper.rn modül tip tanımları

app/(tabs)/
├── _layout.tsx                 # Tab layout (Tabs + header + BottomTabBar)
├── index.tsx                   # Ana sayfa (kişi listesi + metin arama)
├── favorites.tsx               # Favoriler sayfası
├── voice.tsx                   # Sesli arama sayfası
└── settings.tsx                # Ayarlar sayfası
```

---

## Tam Sistem Akışı — "Mehmet Nasım Yılmaz" Örneği

Aşağıda kullanıcının sesli komutla bir kişiyi aramasının A'dan Z'ye tüm adımları anlatılmaktadır.

### Senaryo

Rehberde **"Mehmet Nasım Yılmaz"** adlı bir kişi kayıtlıdır. Kullanıcı sesli arama sekmesine geçip mikrofon butonuna basarak şunu söyler:

> "Merhaba, Mehmet Nasım Yılmaz'ı ara"

---

### Adım 0: Rehber Yükleme (Uygulama Başlangıcı)

Uygulama ilk açıldığında `useContacts` hook'u devreye girer:

```
useContacts → contactsBootstrapped === false?
  ├── EVET → loadContacts() çağır
  │   ├── expo-contacts ile cihaz rehberini oku
  │   ├── Her kişi için:
  │   │   ├── name: "Mehmet Nasım Yılmaz"
  │   │   ├── normalizedName: "mehmet nasım yılmaz"  (toLowerCase + trim)
  │   │   └── phoneticName: "mehmet nasım yılmaz"    (phoneticNormalize)
  │   ├── Telefon numarası olmayanları filtrele
  │   └── Zustand store'a kaydet → MMKV'ye persist et
  └── HAYIR → Zaten yüklü, cache'den oku
```

**Önemli**: `normalizedName` ve `phoneticName` alanları rehber çekilirken bir kez hesaplanır ve MMKV'de saklanır. Her aramada yeniden hesaplanmaz.

---

### Adım 1: Ses Kaydı (`useVoiceSearch.ts`)

```
┌─────────────────────────────────────────────────────┐
│  Kullanıcı Etkileşimi                               │
│                                                      │
│  [Mikrofon butonuna BASAR] ─→ startListening()      │
│     │                                                │
│     ├─ state.status = "listening"                    │
│     ├─ Audio.requestPermissionsAsync()               │
│     │   └─ İzin reddedildi? → error: "Mikrofon      │
│     │                          izni reddedildi"      │
│     ├─ Audio.setAudioModeAsync({                     │
│     │     allowsRecordingIOS: true,                  │
│     │     playsInSilentModeIOS: true                 │
│     │   })                                           │
│     └─ Audio.Recording.createAsync(HIGH_QUALITY)     │
│        └─ recording başlar                           │
│                                                      │
│  [Butonu BIRAKIR] ─→ stopListening()                │
│     │                                                │
│     ├─ state.status = "processing"                   │
│     ├─ recording.stopAndUnloadAsync()                │
│     ├─ recording.getURI() → "/path/to/audio.m4a"    │
│     └─ Audio.setAudioModeAsync({                     │
│          allowsRecordingIOS: false                    │
│        })                                            │
└─────────────────────────────────────────────────────┘
```

**UI Görünümü**: Kullanıcı basılı tuttuğu sürece kırmızı arka planlı mikrofon butonu ve etrafında nabız efekti gösteren animasyonlu halkalar görünür. `PulseRing` component'ı 3 adet iç içe `Animated.View` ile oluşturulur. Her halka farklı gecikmeyle (0ms, 500ms, 1000ms) genişler ve solarak kaybolur.

---

### Adım 2: Speech-to-Text — Whisper STT

```
Ses dosyası → transcribeAudio("/path/to/audio.wav")
           → { text: "merhaba mehmet nasım yılmaz'ı ara", language: "tr" }
```

**Whisper Pipeline** (offline, cihaz üzerinde):
1. `useWhisper.loadModel()` → ggml-tiny.bin modeli lazy-load edilir (ilk kullanımda)
2. 16kHz mono WAV dosyası whisper.cpp'ye gönderilir
3. 4 thread ile inference çalışır (background)
4. Transcript + dil tahmini döner (auto-detect)

**Not**: Geliştirme aşamasında `useVoiceSearch.ts` stub fonksiyon kullanır (sabit test metni döndürür). Gerçek Whisper aktivasyonu için ggml-tiny.bin model dosyasının cihaza yerleştirilmesi ve `useWhisper` hook'una geçilmesi gerekir.

---

### Adım 3: Intent Parsing (`intentParser.ts` → `parseVoiceCommand()`)

Bu, tüm NLP adımlarını orchestrate eden ana fonksiyondur. Ham metni alır, içinden kişi adını çıkarır.

#### 3.1 Selamlama Temizleme (`removeGreetings`)

```
Girdi:  "merhaba mehmet nasım yılmaz'ı ara"

Algoritma:
  words = ["merhaba", "mehmet", "nasım", "yılmaz'ı", "ara"]
  words[0] = "merhaba" → GREETING_WORDS setinde VAR → atla
  words[1] = "mehmet"  → GREETING_WORDS setinde YOK → dur

Çıktı:  "mehmet nasım yılmaz'ı ara"
```

`GREETING_WORDS` seti hem Türkçe hem Kürtçe selamlamaları içerir:
- Türkçe: "merhaba", "selam", "hey", "alo", "günaydın", "iyi günler", "nasılsın", "naber"...
- Kürtçe: "silaw", "merheba", "xêr be", "rojbaş", "eyvallah", "destxweş"...

Çift kelimelik selamlamalar da desteklenir (ör: "iyi günler", "xêr be").

#### 3.2 Dil Tespiti (`detectLanguage`)

```
Metin:    "mehmet nasım yılmaz'ı ara"
langHint: "tr" (Whisper'dan gelen ipucu)

Kelime bazlı analiz:
  "mehmet"  → TR marker? HAYIR  | KU marker? HAYIR
  "nasım"   → TR marker? HAYIR  | KU marker? HAYIR
  "yılmaz'ı"→ TR marker? HAYIR  | KU marker? HAYIR
  "ara"     → TR marker? EVET ✓ | KU marker? HAYIR

Skor: trCount=1, kuCount=0
langHint="tr" ve trCount >= 1 → SONUÇ: "tr"
```

**Dil Tespit Algoritması** (öncelik sırasıyla):
1. `langHint` + 1 marker yeterli → o dili döndür
2. Marker sayısı >= 2 ve rakipten büyük → o dili döndür
3. Eşitlik → Türkçe önce kontrol edilir
4. Hiçbir koşul sağlanmaz → langHint varsa onu kullan, yoksa "unknown"

#### 3.3 Komut Pattern Eşleştirme (`extractFromPatterns`) — HIZLI YOL

```
Girdi:    "mehmet nasım yılmaz'ı ara"
Dil:      "tr"
Pattern'ler: TR_COMMAND_PATTERNS dizisi (8 regex)

Pattern 1: /^(.+?)[''']?[ıiuü]?\s+ara(?:r\s*m[iı]s[iı]n)?$/i

Eşleşme testi:
  "mehmet nasım yılmaz'ı ara"
  ^(.+?)              = "mehmet nasım yılmaz"  ✓
  [''']?              = "'"                     ✓
  [ıiuü]?             = "ı"                    ✓
  \s+                 = " "                     ✓
  ara                 = "ara"                   ✓
  $                   = EOL                     ✓

EŞLEŞME BULUNDU! capture group 1 = "mehmet nasım yılmaz"
```

Bu "hızlı yol" başarılı olursa stop word temizliğine gerek kalmaz. Pattern, cümledeki yapıyı doğrudan tanıyıp ismi çıkarır.

**TR_COMMAND_PATTERNS** (8 pattern):
1. `X'ı ara` / `X'i ara` / `X'ı ararmısın`
2. `X'ı çağır`
3. `lütfen X'ı ara`
4. `X'a bağlan`
5. `senden X'ı aramanı istiyorum`
6. `X'i arayabilir misin`
7. `X ile görüş`
8. `beni X ile bağla`

**KU_COMMAND_PATTERNS** (8 pattern):
1. `li X bi gara`
2. `X bi gara`
3. `X bang bike`
4. `li X bang bike`
5. `X telefon bike`
6. `ji bo min li X bi gara`
7. `X re bang bike`
8. `Xko bi gara` (hitap ekli)

#### 3.4 Ek Temizleme (`removeSuffixes`) — Pattern Sonrası

```
Girdi:    "mehmet nasım yılmaz"
Dil:      "tr"
Son kelime: "yılmaz"

TR_SUFFIXES'dan kontrol:
  /nüncü$/i  → eşleşmez
  /ndeki$/i   → eşleşmez
  ...
  /ı$/i       → eşleşmez ("yılmaz" ı ile bitmiyor)
  → HİÇBİR EK EŞLEŞME YOK

Çıktı:    "mehmet nasım yılmaz" (değişmedi)
```

**Not**: Eğer girdi "mehmet nasım yılmaz'ı" olsaydı (pattern eşleşmeseydi), son kelime "yılmaz'ı" olurdu ve `/'ı$/i` eki uygulanırdı → "mehmet nasım yılmaz".

#### 3.5 Fonetik Normalizasyon (`phoneticNormalize`)

```
Girdi: "mehmet nasım yılmaz"

Adım 1 — applyPatternMap:
  PHONETIC_PATTERN_MAP'te 100+ regex denenir
  /\bmehemed\b/gi → eşleşmez (farklı yazılış)
  /\bmihemed\b/gi → eşleşmez
  ... (hiçbiri eşleşmez, zaten Türkçe isim)
  Sonuç: "mehmet nasım yılmaz"

Adım 2 — applyCharMap:
  PHONETIC_CHAR_MAP: w→v, q→k, x→h, ê→e, î→i, û→u
  "m" → haritada yok → "m"
  "e" → haritada yok → "e"
  ... (hiçbir karakter eşleşmez, zaten Latin Türkçe)
  Sonuç: "mehmet nasım yılmaz"

Final: "mehmet nasım yılmaz"
```

**Kürtçe senaryosu** (karşılaştırma için):

```
Girdi: "xasan husên ebdullah"

Adım 1 — applyPatternMap:
  /\bhusên\b/gi → "hüseyin"  →  "xasan hüseyin ebdullah"
  /\bebdullah\b/gi → "abdullah"  →  "xasan hüseyin abdullah"

Adım 2 — applyCharMap:
  "x" → "h"  →  "hasan hüseyin abdullah"

Final: "hasan hüseyin abdullah"
```

#### 3.6 ParsedIntent Sonucu

```typescript
{
  rawText: "merhaba mehmet nasım yılmaz'ı ara",
  detectedLanguage: "tr",
  candidateNames: ["mehmet nasım yılmaz"],
  normalizedCandidates: ["mehmet nasım yılmaz"]
}
```

---

### Adım 4: Kişi Eşleştirme (`matchingService.ts` → `findMatches()`)

#### 4.1 Fuse.js Konfigürasyonu

```typescript
const FUSE_OPTIONS = {
  keys: [
    { name: "name", weight: 0.5 },           // Orijinal isim (ağırlık: %50)
    { name: "normalizedName", weight: 0.3 },  // Lowercase (ağırlık: %30)
    { name: "phoneticName", weight: 0.2 }     // Fonetik (ağırlık: %20)
  ],
  threshold: 0.45,          // Fuzzy tolerans (0=tam, 1=herşey, 0.45=orta)
  includeScore: true,        // Skor bilgisini döndür
  distance: 100,             // Karakter mesafesi toleransı
  minMatchCharLength: 2      // Minimum eşleşme uzunluğu
}
```

**Neden 3 farklı key?**
- `name`: Kullanıcının söylediği ile rehberdeki orijinal yazılışı karşılaştırır
- `normalizedName`: Büyük/küçük harf farklarını tolere eder
- `phoneticName`: Kürtçe yazılışla Türkçe karşılığı eşleştirir

#### 4.2 Çoklu Strateji Araması

```
candidateNames[0] = "mehmet nasım yılmaz"
normalizedCandidates[0] = "mehmet nasım yılmaz" (aynı)

─── Strateji 1: Tam metin araması ───
  Fuse.search("mehmet nasım yılmaz")
  Sonuç: [
    { item: "Mehmet Nasım Yılmaz", score: 0.0 }  ← Tam eşleşme!
  ]
  → MatchResult: { contact: ..., score: 1.0, confidence: "high" }

─── Strateji 2: Normalize araması ───
  normalizedCandidates[0] = "mehmet nasım yılmaz"
  candidateNames[0] ile AYNI → Strateji 2 atlanır

─── Strateji 3: Kelime bazlı arama ───
  words = ["mehmet", "nasım", "yılmaz"] (birden fazla kelime)

  Fuse.search("mehmet") → [
    { item: "Mehmet Nasım Yılmaz", score: 0.001 },
    { item: "Mehmet Can", score: 0.001 },
    ...
  ]

  Fuse.search("nasım") → [
    { item: "Mehmet Nasım Yılmaz", score: 0.0 }
  ]

  Fuse.search("yılmaz") → [
    { item: "Mehmet Nasım Yılmaz", score: 0.001 },
    { item: "Ahmet Yılmaz", score: 0.001 },
    ...
  ]
```

#### 4.3 Sonuç Birleştirme (`mergeResults`)

```
"Mehmet Nasım Yılmaz" sonuçları:
  - Strateji 1: score = 1.0
  - Strateji 3 "mehmet": score = 0.999
  - Strateji 3 "nasım": score = 1.0
  - Strateji 3 "yılmaz": score = 0.999

Ortalama: (1.0 + 0.999 + 1.0 + 0.999) / 4 = 0.9995
Hit sayısı: 4
Bonus: 0.9995 × (1 + (4-1) × 0.2) = 0.9995 × 1.6 = 1.599
Sonuç: min(1, 1.599) = 1.0  ← Maksimuma sabitlendi

"Mehmet Can" sonuçları:
  - Strateji 3 "mehmet": score = 0.999
  Hit sayısı: 1
  Bonus yok: 0.999 × 1.0 = 0.999

"Ahmet Yılmaz" sonuçları:
  - Strateji 3 "yılmaz": score = 0.999
  Hit sayısı: 1
  Bonus yok: 0.999 × 1.0 = 0.999
```

#### 4.4 Güven Seviyesi Ataması

```typescript
CONFIDENCE = { HIGH: 0.7, MEDIUM: 0.4, LOW: 0.0 }

"Mehmet Nasım Yılmaz" → score: 1.0  → 1.0 >= 0.7 → "high"   ✓
"Mehmet Can"           → score: 0.999 → 0.999 >= 0.7 → "high"
"Ahmet Yılmaz"         → score: 0.999 → 0.999 >= 0.7 → "high"
```

#### 4.5 Çoklu Aday Kontrolü

```
Sıralama (score desc):
  1. "Mehmet Nasım Yılmaz" → score: 1.0
  2. "Mehmet Can"           → score: 0.999
  3. "Ahmet Yılmaz"         → score: 0.999

MULTI_CANDIDATE_DIFF = 0.1

Fark kontrolü:
  1.0 - 0.999 = 0.001 < 0.1 → "Mehmet Can" da aday! ✓
  1.0 - 0.999 = 0.001 < 0.1 → "Ahmet Yılmaz" da aday! ✓

MAX_CANDIDATES = 3 → 3 aday döndürülür
```

**Not**: Bu senaryoda en iyi sonuçların skorları çok yakın çıkıyor çünkü Fuse.js kelime bazlı aramada birçok kişiyi eşleştiriyor. Gerçek kullanımda tam metin araması sonucunun skoru belirleyici olur.

#### 4.6 Final MatchResult[]

```typescript
[
  {
    contact: { name: "Mehmet Nasım Yılmaz", phone: "+905...", ... },
    score: 1.0,
    confidence: "high"
  },
  {
    contact: { name: "Mehmet Can", phone: "+905...", ... },
    score: 0.999,
    confidence: "high"
  },
  {
    contact: { name: "Ahmet Yılmaz", phone: "+905...", ... },
    score: 0.999,
    confidence: "high"
  }
]
```

---

### Adım 5: UI Gösterimi (`VoiceSearchModal.tsx`)

Pipeline sonucuna göre VoiceSearchModal 5 farklı durumda render edilir:

```
┌──────────────────────────────────────────────────────────────┐
│                     DURUM MAKİNESİ                           │
│                                                              │
│  idle ──→ modelLoading ──→ listening ──→ processing ──→ result│
│    ↑         │                │              │           │   │
│    │         │                │              │           │   │
│    └─────────┴────────────────┴──────────────┴───────────┘   │
│                (error durumunda da idle'a dön)                │
│                                                              │
│  idle ──→ modelLoading ──→ error                             │
│  idle ──→ modelLoading ──→ listening ──→ processing ──→ error│
│    ↑                                                    │    │
│    └────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

| Durum | Tetikleyici | UI Bileşenleri |
|-------|-------------|----------------|
| `idle` | Sayfa açılış / reset() | Mikrofon ikonu hint + yeşil mikrofon butonu + "Aramak istediğiniz kişinin adını söyleyin" |
| `modelLoading` | İlk startListening() (model yüklü değilse) | `ActivityIndicator` spinner + "AI modeli yükleniyor..." |
| `listening` | Model yüklendi / onPressIn | Kırmızı mikrofon + 3 animasyonlu `PulseRing` + "Dinleniyor..." + "Bırakmak için parmağını kaldır" |
| `processing` | onPressOut | `ActivityIndicator` spinner + "İşleniyor..." |
| `result` — tek eşleşme (high/medium) | findMatches() 1 sonuç | Transcript badge + büyük avatar (veya initials dairesi) + isim + telefon + yeşil ARA butonu + Tekrar Dene |
| `result` — çoklu aday | findMatches() 2-3 sonuç | Transcript + "Birden fazla kişi bulundu" + `CandidateCard` listesi (her kart: avatar + isim + telefon + arama ikonu) + Tekrar Dene |
| `result` — bulunamadı/low | boş veya düşük güven | Arama ikonu + transcript + "Kişi bulunamadı, tekrar deneyin" + Tekrar Dene |
| `error` | catch bloğu | Uyarı ikonu (kırmızı arka plan) + hata mesajı + Tekrar Dene |

#### PulseRing Animasyonu

```
Listening durumunda 3 adet PulseRing oluşturulur:
  Ring 1: delay=0ms,   döngü süresi=1500ms
  Ring 2: delay=500ms,  döngü süresi=1500ms
  Ring 3: delay=1000ms, döngü süresi=1500ms

Her ring:
  scale: 0.8 → 1.3 (genişleme)
  opacity: 0.6 → 0.3 → 0 (solma)
  Easing: Easing.out(Easing.ease)

Sonuç: Nabız gibi atan 3 iç içe halka efekti
```

---

## Fonetik Normalizasyon Sistemi — Detaylı

### Problem

Türkçe ve Kürtçe (Kurmancî) arasında isim yazılışları önemli ölçüde farklıdır. Rehberdeki kişi Türkçe kayıtlıyken kullanıcı Kürtçe telaffuzla söyleyebilir:

| Kürtçe Söyleyiş | Türkçe Rehber Kaydı | Dönüşüm Türü |
|------------------|---------------------|---------------|
| Xasan | Hasan | Karakter (x→h) |
| Wahap | Vahap | Karakter (w→v) |
| Qemal | Kemal | Karakter (q→k) |
| Husên | Hüseyin | Pattern (tam isim) |
| Ehmed | Ahmet | Pattern (tam isim) |
| Exmed | Ahmet | Pattern (tam isim) |
| Mehemed | Mehmet | Pattern (tam isim) |
| Ebdullah | Abdullah | Pattern (tam isim) |
| Dawûd | Davut | Pattern (tam isim) |
| Mistefa | Mustafa | Pattern (tam isim) |
| Silêman | Süleyman | Pattern (tam isim) |
| Berîvan | Berivan | Karakter (î→i) |
| Rûken | Rüken | Karakter (û→u) |
| Sîpan | Sipan | Karakter (î→i) |

### İki Aşamalı Normalizasyon

```
                    ┌──────────────┐
    Girdi metni ──→ │ applyPattern │ ──→ Bilinen isim kalıpları değişti
                    │    Map()     │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │ applyChar    │ ──→ Kalan Kürtçe harfler Türkçeye çevrildi
                    │    Map()     │
                    └──────┬───────┘
                           │
                    Normalize metin
```

**Sıralama kritik**: Önce pattern (tam isim), sonra karakter dönüşümü uygulanır. Çünkü pattern map tam kelimeyi değiştirir (ör: "husên" → "hüseyin"), sonra char map kalan harfleri temizler.

### Karakter Dönüşüm Haritası (`PHONETIC_CHAR_MAP`)

```
w → v     Wahap → Vahap, Welat → Velat
q → k     Qemal → Kemal, Qamişlo → Kamişlo
x → h     Xasan → Hasan, Xelîl → Halil
ê → e     Bêrîvan → Berivan, Hêvî → Hevi
î → i     Sîpan → Sipan, Pelîn → Pelin
û → u     Nûdem → Nudem, Rûken → Ruken
' → ""    Ma'sum → Masum (apostrof kaldır)
' → ""    Sağ tek tırnak kaldır
' → ""    Sol tek tırnak kaldır
ʼ → ""    Modifier letter apostrophe kaldır
```

### Pattern Dönüşüm Listesi (`PHONETIC_PATTERN_MAP`)

100+ regex kalıbı, yaygın Kürtçe isim yazılışlarını Türkçe karşılıklarına dönüştürür:

```
/\bmehemed\b/gi  → "mehmet"
/\bmihemed\b/gi  → "mehmet"
/\behmad\b/gi    → "ahmet"
/\behmed\b/gi    → "ahmet"
/\bexmed\b/gi    → "ahmet"
/\belî\b/gi      → "ali"
/\bhesen\b/gi    → "hasan"
/\bhusên\b/gi    → "hüseyin"
/\bxelîl\b/gi    → "halil"
/\bebdullah\b/gi → "abdullah"
/\bîbrahîm\b/gi → "ibrahim"
/\bdawûd\b/gi    → "davut"
/\byûsif\b/gi    → "yusuf"
/\bmistefa\b/gi  → "mustafa"
/\bsilêman\b/gi  → "süleyman"
/\bnewroz\b/gi   → "nevruz"
... (ve 90+ daha)
```

---

## Stop Word Sistemi — Detaylı

### Türkçe Stop Word'ler (`TR_STOP_WORDS` — 200+ kelime)

| Kategori | Örnekler |
|----------|----------|
| Fiiller | ara, arar, arıyorum, çağır, bul, bağlan, ulaş |
| Telefon | telefon, numara, hat, görüntülü, sesli, whatsapp, mesaj |
| Nezaket | lütfen, rica ederim, zahmet, eğer, mümkünse, acaba |
| İstek | istiyorum, lazım, gerek, gerekiyor |
| Yardımcı fiil | ediyorum, eder misin, edebilir |
| Zamirler | ben, sen, biz, bana, seni, onu, şunu |
| Bağlaçlar | bir, bu, şu, de, da, ile, ve, için, ama |
| Soru ekleri | mı, mi, mu, mü, mısın, misin |
| Selamlama | merhaba, selam, hey, alo, tamam, peki |
| Zarflar | hemen, şimdi, biraz, şu an, acilen |
| Çeşitli | yap, söyle, ver, getir, konuş, bağla |

### Kürtçe Stop Word'ler (`KU_STOP_WORDS` — 200+ kelime)

| Kategori | Örnekler |
|----------|----------|
| Fiiller | bi gara, bang bike, telefon bike, têkilî bike |
| Nezaket | ji kerema xwe, kerem ke, dixwazim |
| Zamirler | ez, tu, ew, em, hûn, min, te, wî, wê |
| Edatlar | ji, bo, li, bi, ra, re, ser, bin, nav |
| Bağlaçlar | û, an, yan, lê, belê, ne, jî |
| Soru | kî, çi, ku, kengê, çawa, çiqas, çend |
| Zaman | niha, naha, êdî, hema, zû, dereng |
| Onay/Ret | erê, belê, baş e, na, nake |
| Selamlama | silaw, merheba, xêr be, rojbaş, alo |

### Temizleme Algoritması

```
1. Çok kelimeli stop word'leri tespit et (uzundan kısaya sıralı)
2. Regex ile kelime sınırı kontrollü değiştir → boşluk
3. Kalan kelimeleri tek tek filtrele
4. stop set'te olan kelimeleri at
5. Kalan kelimeleri birleştir
```

---

## Ek Temizleme Sistemi

### Türkçe Ekler (`TR_SUFFIXES` — 30+ ek)

Uzundan kısaya sıralı, sadece **son kelimeye** uygulanır:

| Ek | Tür | Örnek |
|----|------|-------|
| /ndeki$/i | bulunma | Ahmet'teki |
| /daki$/i | bulunma | Ahmet'taki |
| /ndan$/i | ayrılma | Hasan'dan |
| /nden$/i | ayrılma | Mehmet'ten |
| /ları$/i | çoğul+belirtme | çocukları |
| /leri$/i | çoğul+belirtme | arkadaşları |
| /nın$/i | iyelik | Ahmet'in |
| /yla$/i | birliktelik | Hasan'la |
| /yı$/i | belirtme | Vahap'ı |
| /lar$/i | çoğul | Ahmetler |
| /ın$/i | iyelik | Vahap'ın |
| /ya$/i | yönelme | Fatma'ya |
| /ı$/i | belirtme | Mehmet'i |
| /a$/i | yönelme | Vahap'a |

### Kürtçe Ekler (`KU_SUFFIXES`)

| Ek | Tür | Örnek |
|----|------|-------|
| /ko$/i | hitap | Wahapko → Wahap |
| /kê$/i | hitap varyant | |
| /bo$/i | hitap | Wahapbo → Wahap |
| /êvan$/i | çoğul tanımlık | |
| /ên$/i | çoğul eril | |
| /an$/i | çoğul mutlak | |
| /ê$/i | tekil tanımlık | |
| /î$/i | iyelik | |
| /a$/i | dişil yalın | Berîvana → Berîvan |
| /o$/i | hitap | Wahabo → Wahap |

**Güvenlik kontrolü**: Ek sonrası kalan kelime `MIN_NAME_LENGTH` (2 karakter) altına düşerse ek uygulanmaz.

---

## State Mimarisi

```
                       ┌──────────────────┐
                       │   MMKV Storage   │  ← Disk (senkron, 30x hızlı)
                       └────────┬─────────┘
                                │ persist middleware
           ┌────────────────────┼────────────────────┐
           │                    │                    │
   ┌───────▼──────┐    ┌───────▼──────┐    ┌───────▼──────┐
   │ contactsStore │    │favoritesStore│    │settingsStore │
   ├──────────────┤    ├──────────────┤    ├──────────────┤
   │ contacts[]   │    │ favoriteIds[]│    │ theme        │
   │ loading      │    │              │    │ language     │
   │ loadContacts │    │ toggleFavorit│    │ contactSize  │
   └──────────────┘    └──────────────┘    │ defaultScreen│
                                           │ contactsBootstrapped │
                                           └──────────────┘
```

**MMKV vs AsyncStorage**: MMKV (C++ tabanlı) senkron çalışır ve AsyncStorage'a göre ~30x daha hızlıdır. Zustand persist middleware'ı MMKV adaptörü (`mmkv.ts`) üzerinden veriye kalıcılık sağlar.

---

## Tema Sistemi

20+ renk tokeni, iki tema (light/dark):

```typescript
// colors.ts'den
lightColors = {
  background: "#FFFFFF",     darkColors.background: "#1C1C1E"
  card: "#F5F5F5",           darkColors.card: "#2C2C2E"
  textPrimary: "#1A1A1A",    darkColors.textPrimary: "#FFFFFF"
  textSecondary: "#424242",  darkColors.textSecondary: "#E0E0E0"
  primary: "#2E7D32",        darkColors.primary: "#4CAF50"
  favoriteActive: "#E53935", darkColors.favoriteActive: "#EF5350"
  border: "#E0E0E0",         darkColors.border: "#3A3A3C"
  ...
}
```

`useTheme()` hook'u mevcut temaya göre doğru palette'i döndürür. Tüm bileşenler bu hook'u kullanarak renk değerlerini alır.

---

## Responsive Tasarım

Baz ekran: **375 x 812** (iPhone X). Tüm boyutlar bu referansa oranlanır.

```typescript
// responsive.ts
scale(size)           → size × (ekranGenişliği / 375)    // Yatay ölçekleme
verticalScale(size)   → size × (ekranYüksekliği / 812)   // Dikey ölçekleme
moderateScale(size)   → size + (scale - size) × 0.5      // Dengeli ölçekleme
fontScale(size)       → size × (ekranGenişliği / 375)    // Font ölçekleme
```

`PixelRatio.roundToNearestPixel()` ile piksel sınırlarına yuvarlanır. Bu sayede farklı ekran boyutlarında net ve tutarlı görünüm sağlanır.

---

## i18n Sistemi

```typescript
// Kullanım
const { t, language } = useI18n()

t("voice.pressToTalk")  // "Aramak istediğiniz kişinin adını söyleyin"
t("voice.listening")     // "Dinleniyor..."
t("voice.notFound")      // "Kişi bulunamadı, tekrar deneyin"
```

Çeviri dosyaları (`tr.json`, `ku.json`) noktalı gösterimle erişilir. Tüm UI string'leri i18n üzerinden gelir — hardcoded string kullanılmaz.

---

## Kurulum ve Çalıştırma

```bash
# Bağımlılıkları kur
npm install

# Geliştirme sunucusunu başlat
npx expo start

# Android'de çalıştır (dev client ile)
npx expo start --dev-client --android

# Android native build
npx expo run:android

# iOS'te çalıştır
npx expo run:ios
```

### Gerekli İzinler (app.json)

| İzin | Amaç |
|------|-------|
| `READ_CONTACTS` | Rehber okuma |
| `WRITE_CONTACTS` | Rehber yazma |
| `CALL_PHONE` | Telefon arama başlatma |
| `RECORD_AUDIO` | Mikrofon erişimi (sesli arama) |

### Expo Plugins (app.json)

```json
[
  ["expo-contacts", { "contactsPermission": "Rehberinize erişmek için izin gerekiyor." }],
  ["expo-av", { "microphonePermission": "Sesli arama için mikrofon erişimi gerekiyor." }],
  "expo-font"
]
```

---

## Whisper Offline STT Entegrasyonu

Proje, cihaz üzerinde tamamen offline çalışan **whisper.cpp** tabanlı konuşma tanıma sistemi kullanır. İnternet bağlantısı gerekmez.

### Mimari

```
┌──────────────────────────────────────────────────────────────┐
│  whisperService.ts (Singleton)                               │
│                                                              │
│  loadWhisperModel(path) ─→ initWhisper() ─→ WhisperContext  │
│  transcribeAudio(audioPath, modelPath)                       │
│  isModelLoaded() / releaseWhisperModel() / releaseAll()     │
│                                                              │
│  Tek instance: Uygulama boyunca tek WhisperContext paylaşılır│
└──────────────────────────┬───────────────────────────────────┘
                           │
┌──────────────────────────▼───────────────────────────────────┐
│  useWhisper.ts (Hook)                                        │
│                                                              │
│  loadModel() ─→ model dosyası kontrol + lazy load            │
│  transcribe(audioPath) ─→ WhisperResult { text, language? }  │
│  release() ─→ bellek temizleme                               │
│                                                              │
│  State: isModelLoading, isTranscribing, error                │
│  Model: document/models/ggml-tiny.bin                        │
└──────────────────────────────────────────────────────────────┘
```

### Model Dosyası

| Model | Boyut | Doğruluk | Önerilen |
|-------|-------|----------|----------|
| ggml-tiny.bin | ~75MB | Orta | Varsayılan |
| ggml-base.bin | ~140MB | İyi | Daha iyi sonuç |

Model dosyası cihazın `documentDirectory/models/` klasörüne yerleştirilmelidir.

### Ses Kaydı Formatı (Whisper Gereksinimi)

```typescript
// useVoiceSearch.ts'den
const WHISPER_RECORDING_OPTIONS = {
  android: {
    extension: ".wav",
    sampleRate: 16000,      // 16kHz — Whisper standardı
    numberOfChannels: 1,     // Mono
    bitRate: 16000,
  },
  ios: {
    extension: ".wav",
    sampleRate: 16000,
    numberOfChannels: 1,
    bitRate: 16000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  }
}
```

### Whisper Ayarları

```typescript
// whisperService.ts'den
{
  language: "auto",     // Otomatik dil tespiti
  maxThreads: 4,        // CPU thread sayısı (performans/pil dengesi)
  translate: false,      // Çevirme, orijinal dilde döndür
}
```

### Performans

- **Lazy load**: Model ilk sesli arama kullanımında yüklenir (soğuk başlatma ~2-3 saniye)
- **Singleton**: Tek context, tekrar yükleme yok
- **Background thread**: Inference UI thread'i bloklamaz
- **Bellek**: ggml-tiny ~75MB RAM kullanır, uygulama kapandığında otomatik serbest bırakılır

### Aktifleştirme

Şu an `useVoiceSearch.ts` stub fonksiyon kullanıyor (geliştirme aşaması). Gerçek Whisper'ı aktifleştirmek için:

1. `ggml-tiny.bin` dosyasını cihaza kopyalayın (documentDirectory/models/)
2. `useVoiceSearch.ts`'de stub yerine `useWhisper` hook'unu import edin
3. `npx expo prebuild` çalıştırın (native modül gerektirir)
4. `npx expo run:android` ile native build yapın

**Pipeline'ın stub ile test edilebilirliği**: Stub fonksiyon değiştirilerek farklı senaryolar test edilebilir:
```typescript
// Türkçe test
return { text: "mehmet nasım yılmaz'ı ara", language: "tr" }

// Kürtçe test
return { text: "li xasan husên bi gara", language: "ku" }

// Belirsiz dil test
return { text: "ahmet yılmaz", language: undefined }
```

---

## Lisans

Bu proje özel kullanım içindir.
