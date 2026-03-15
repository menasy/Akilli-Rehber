// ================================================================
// nlpConstants.ts
// Sesli rehber uygulaması — Çok Dilli NLP Sabitleri
// Türkçe, Kürtçe (Kurmancî) ve Arapça tam kapsamlı listeler
// 
// NOT: React Voice kullanarak, her dil için BAĞIMSIZ işleme yapılır.
// Artık Kürtçe → Türkçe normalleştirme YOK!
// Her dil kendi rehber kayıtlarıyla eşleşir.
// ================================================================

// ────────────────────────────────────────────────────────────────
// DİL TİPİ TANIMLARI
// ────────────────────────────────────────────────────────────────

export type SupportedLanguage = 'tr' | 'ku' | 'ar';

// ────────────────────────────────────────────────────────────────
// TÜRKÇE SABITLERI
// ────────────────────────────────────────────────────────────────

/**
 * TÜRKÇE EK LİSTESİ
 * İsmin sonundaki çekim eklerini temizlemek için.
 * 
 * SIRALAMA KRİTİK: Uzun ekler önce gelir.
 * Sadece SON KELİMEYE uygulanır.
 * Sonuç 2 karakterden kısa olursa ek uygulanmaz.
 * 
 * Örnekler:
 * - "Mehmeti" → "Mehmet" (belirtme hali)
 * - "Ayşe'nin" → "Ayşe" (iyelik hali)
 * - "Ahmet'e" → "Ahmet" (yönelme hali)
 */
export const TR_SUFFIXES: Array<[RegExp, string]> = [
  // ── 5+ karakter ekler ──
  [/nüncü$/i, ''],     // üçüncü kişi iyelik + sıra sayı
  [/ndeki$/i, ''],     // -ndaki/-ndeki (bulunma + iyelik)
  [/daki$/i, ''],      // Ahmet'taki
  [/deki$/i, ''],      // Ahmet'teki

  // ── 4 karakter ekler ──
  [/yını$/i, ''],      // -yını (belirtme + iyelik karışık)
  [/yine$/i, ''],      // yönelme kaynaştırmalı
  [/ndan$/i, ''],      // ayrılma, sesli bitişli
  [/nden$/i, ''],      // ayrılma, sesli bitişli
  [/ları$/i, ''],      // çoğul + belirtme
  [/leri$/i, ''],      // çoğul + belirtme
  [/sını$/i, ''],      // belirtme + iyelik
  [/sini$/i, ''],      // belirtme + iyelik
  [/sunu$/i, ''],      // belirtme + iyelik
  [/sünü$/i, ''],      // belirtme + iyelik

  // ── 3 karakter ekler ──
  [/dan$/i, ''],       // Ahmet'ten → Ahmet (ayrılma)
  [/den$/i, ''],       // Mehmet'ten
  [/tan$/i, ''],       // Murat'tan
  [/ten$/i, ''],       // Mehmet'ten
  [/nın$/i, ''],       // Ahmet'in → Ahmet (iyelik, sesli sonu)
  [/nin$/i, ''],       // iyelik
  [/nun$/i, ''],       // iyelik
  [/nün$/i, ''],       // iyelik
  [/yla$/i, ''],       // birliktelik, sesli sonu
  [/yle$/i, ''],       // birliktelik
  [/yı$/i, ''],        // belirtme kaynaştırmalı
  [/yi$/i, ''],        // belirtme kaynaştırmalı
  [/yu$/i, ''],        // belirtme kaynaştırmalı
  [/yü$/i, ''],        // belirtme kaynaştırmalı
  [/lar$/i, ''],       // çoğul
  [/ler$/i, ''],       // çoğul
  [/sın$/i, ''],       // belirtme + iyelik (kısa)
  [/sin$/i, ''],       // belirtme + iyelik
  [/sun$/i, ''],       // belirtme + iyelik
  [/sün$/i, ''],       // belirtme + iyelik

  // ── 2 karakter ekler ──
  [/ın$/i, ''],        // iyelik (Vahap'ın)
  [/in$/i, ''],        // iyelik
  [/un$/i, ''],        // iyelik
  [/ün$/i, ''],        // iyelik
  [/la$/i, ''],        // birliktelik
  [/le$/i, ''],        // birliktelik
  [/ya$/i, ''],        // yönelme kaynaştırmalı (Fatma'ya)
  [/ye$/i, ''],        // yönelme
  [/sı$/i, ''],        // iyelik 3. tekil
  [/si$/i, ''],        // iyelik 3. tekil
  [/su$/i, ''],        // iyelik 3. tekil
  [/sü$/i, ''],        // iyelik 3. tekil

  // ── 1 karakter ekler (en dikkatli - isim sonu ile karışabilir) ──
  [/ı$/i, ''],         // belirtme (Vahap'ı)
  [/i$/i, ''],         // belirtme (Mehmet'i)
  [/u$/i, ''],         // belirtme (Murat'u)
  [/ü$/i, ''],         // belirtme (Ümit'ü)
  [/a$/i, ''],         // yönelme (Vahap'a) - DİKKAT: 'a' ile biten isimlere
  [/e$/i, ''],         // yönelme (Mehmet'e) - DİKKAT: 'e' ile biten isimlere
];

/**
 * TÜRKÇE STOP WORD LİSTESİ
 * Arama komutlarında geçen anlamsız/yardımcı kelimeler.
 * Set kullanılır → O(1) arama hızı.
 * 
 * Örnekler:
 * - "Mehmeti aramanı istiyorum" → "aramanı", "istiyorum" kaldırılır
 * - "Lütfen Ayşe'yi ara" → "lütfen", "ara" kaldırılır
 */
export const TR_STOP_WORDS = new Set<string>([
  // ── Temel arama fiilleri ──
  'ara',
  'arar',
  'arıyor',
  'arıyorum',
  'ararsın',
  'araması',
  'aramak',
  'arama',
  'araman',
  'aramanı',
  'armani',
  'armanı',
  'arıyabilir',
  'arayabilir',
  'arayabilirsin',
  'arayabilirmisin',
  'ararmisin',
  'ararmısın',
  'arar mısın',
  'arar misin',
  'ararsın',
  'arasın',
  'arasana',
  
  // ── Çağırma fiilleri ──
  'çağır',
  'çağırır',
  'çağırıyor',
  'çağırıyorum',
  'çağırabilir',
  'çağırabilirsin',
  'çağırabilirmisin',
  'çağırır mısın',
  'çağırır misin',
  'çağırırmısın',
  'çağırırsın',
  'çağırsın',
  'çağırsana',
  
  // ── Bulma/bağlanma fiilleri ──
  'bul',
  'bulur',
  'buluyor',
  'buluyorum',
  'bulabilir',
  'bağlan',
  'bağlat',
  'bağlantı',
  'bağla',
  'bağlayabilir',
  'ulaş',
  'ulaşır',
  'ulaşabilir',
  'ulaşabilirsin',
  'görüş',
  'görüşmek',
  'konuş',
  'konuşmak',

  // ── Telefon kelimeleri ──
  'telefon',
  'telefonla',
  'telefonu',
  'telefonda',
  'telefondan',
  'tel',
  'numara',
  'numarayı',
  'numarası',
  'numarasını',
  'numarasına',
  'hat',
  'hattı',
  'görüntülü',
  'görüntülü ara',
  'sesli',
  'sesli ara',
  'whatsapp',
  'watsupp',
  'watsap',
  'mesaj',
  'mesaj at',
  'mesajla',

  // ── Nezaket/kibarlık ifadeleri ──
  'lütfen',
  'lutfen',
  'rica',
  'rica ederim',
  'rica ediyorum',
  'ricaederim',
  'ricaediyorum',
  'zahmet',
  'bi zahmet',
  'bir zahmet',
  'bizahmet',
  'birzahmet',
  'zahmet olmasa',
  'zahmet olmazsa',
  'zahmetolmasa',
  'eğer',
  'eger',
  'mümkünse',
  'mumkunse',
  'olursa',
  'olur mu',
  'olurmu',
  'acaba',
  'bakalım',
  'bakar mısın',
  'bakar misin',
  'bakabilir misin',
  'haydi',
  'hadi',
  'hemen',
  'çabuk',
  'cabuk',
  'şimdi',
  'simdi',
  'artık',
  'artik',
  'biraz',
  'birazdan',
  'az önce',
  'şu an',
  'şuan',

  // ── İstek/talep fiilleri ──
  'istiyorum',
  'istiyorm',
  'istiyom',
  'istiyor',
  'istiyoruz',
  'ister',
  'ister misin',
  'istermisin',
  'istiyorum ki',
  'istiyorum da',
  'istiyorum ama',
  'istiyorum senden',
  'istedim',
  'istesem',
  'istesene',
  'lazım',
  'lazim',
  'gerek',
  'gerekiyor',
  'gerekli',
  'lazım ki',
  'lazım da',

  // ── Edilgen/yardımcı fiil ekleri ──
  'ediyorum',
  'ediyorm',
  'ediyom',
  'eder',
  'eder misin',
  'edermisin',
  'edin',
  'edelim',
  'edebilir',
  'edebilirsin',
  'edebilirmisin',
  'ediyor',
  'edebilir misin',
  'etmek',
  'etmeli',
  'etmeni',
  'etmeni istiyorum',
  'et',

  // ── Şahıs zamirleri ──
  'ben',
  'sen',
  'biz',
  'siz',
  'bana',
  'sana',
  'beni',
  'seni',
  'benden',
  'senden',
  'bizden',
  'sizden',
  'bize',
  'size',

  // ── Nesne zamirleri ──
  'onu',
  'şunu',
  'bunu',
  'onları',
  'şunları',
  'bunları',
  'ondan',
  'şundan',
  'bundan',
  'ona',
  'şuna',
  'buna',

  // ── Belirteçler/bağlaçlar ──
  'bir',
  'bu',
  'şu',
  'o',
  'de',
  'da',
  'ile',
  've',
  'için',
  'ama',
  'fakat',
  'lakin',
  'ki',
  'yani',
  'şöyle',
  'böyle',
  'öyle',
  'hem',
  'ya',
  'ya da',

  // ── Soru ekleri/parçacıkları ──
  'mı',
  'mi',
  'mu',
  'mü',
  'mısın',
  'misin',
  'musun',
  'müsün',
  'mısınız',
  'misiniz',

  // ── Selamlama/giriş kelimeleri ──
  'merhaba',
  'selam',
  'hey',
  'alo',
  'bi dakika',
  'bir dakika',
  'dur',
  'tamam',
  'peki',
  'iyi',
  'güzel',
  'oldu',
  'olsun',

  // ── Çeşitli fiiller/yardımcılar ──
  'yap',
  'yapabilir',
  'yapabilirsin',
  'yapabilir misin',
  'yapıver',
  'yapıverin',
  'söyle',
  'söyler misin',
  'söylesene',
  'ver',
  'verir misin',
  'veribilir misin',
  'getir',
  'getir misin',
  'getiribilir misin',
  'aç',
  'açabilir misin',

  // ── Vurgu/tamamlayıcı ──
  'ne olur',
  'ne olurda',
  'iyi mi',
  'değil mi',
  'hem de',
  'zaten',
  'bile',
  'dahi',
  'sadece',
  'yalnızca',
  'hep',
  'hiç',
  'çok',
  'az',
  'daha',
  'en',
  'kadar',
  'gibi',
  'sanki',
]);

/**
 * TÜRKÇE SELAMLAMA KELİMELERİ
 * Cümlenin başındaki selamlamaları kaldırmak için.
 */
export const TR_GREETING_WORDS = new Set<string>([
  'merhaba',
  'selam',
  'hey',
  'alo',
  'günaydın',
  'iyi günler',
  'iyi akşamlar',
  'nasılsın',
  'naber',
  'efendim',
  'beyefendi',
  'hanımefendi',
  'nasıl',
  'nasılsınız',
]);

/**
 * TÜRKÇE REGEX KOMUT KALIPLARI
 * Bu kalıplar eşleşirse içindeki yakalama grubu isimdir.
 * Sıra önemli: daha spesifik kalıplar önce gelir.
 * 
 * Örnekler:
 * - "Mehmeti ara" → grup: "Mehmet"
 * - "Ayşe'yi çağır" → grup: "Ayşe"
 * - "lütfen Fatma'yı ara" → grup: "Fatma"
 */
export const TR_COMMAND_PATTERNS: RegExp[] = [
  // "X'ı ara" / "X'i ara" varyantları
  /^(.+?)[''']?[ıiuüaeAEIİOÖUÜ]?\s+ara(?:r\s*m[iı]s[iı]n)?$/i,
  // "X'ı çağır"
  /^(.+?)[''']?[ıiuüaeAEIİOÖUÜ]?\s+çağır/i,
  // "lütfen X'ı ara"
  /^lütfen\s+(.+?)[''']?[ıiuüaeAEIİOÖUÜ]?\s+ara/i,
  // "X'a bağlan"
  /^(.+?)[''']?[aeAE]?\s+bağlan/i,
  // "senden X'ı armanı istiyorum"
  /senden\s+(.+?)[''']?[ıiuüIİUÜ]?\s+arman[ıiİI]/i,
  // "X'i arayabilir misin"
  /^(.+?)[''']?[ıiuüIİUÜ]?\s+arayabilir\s+misin/i,
  // "X ile görüş" / "X'le görüş"
  /^(.+?)[''']?[ıiuüIİUÜ]?(?:le|la|yle|yla)?\s+görüş/i,
  // "beni X ile bağla"
  /beni\s+(.+?)[''']?\s+(?:ile\s+)?bağla/i,
  // "X'ı bul"
  /^(.+?)[''']?[ıiuüIİUÜ]?\s+bul/i,
];

// ────────────────────────────────────────────────────────────────
// KÜRTÇE (KURMANCÎ) SABITLERI
// ────────────────────────────────────────────────────────────────

/**
 * KÜRTÇE YANLIŞ ALGILAMA DÜZELTMELERİ
 * 
 * Türkçe STT Kürtçe desteklemediği için yanlış algılar.
 * Bu map ile düzeltme yapılır.
 * 
 * Kullanım: Transcript geldiğinde önce bu map ile düzelt, sonra parse et.
 * 
 * Örnekler:
 * - "mikail sigara" → "mikail bi gara"
 * - "vahap bank bike" → "wahap bang bike"
 * - "dilan le bike" → "dilan lê bike"
 */
export const KU_MISHEARD_CORRECTIONS: Record<string, string> = {
  // ── "bi gara" yanlış algılamaları ──
  'sigara': 'bi gara',
  'bi kara': 'bi gara',
  'bikara': 'bi gara',
  'bi ara': 'bi gara',
  'biara': 'bi gara',
  'bi ağra': 'bi gara',
  'bi gaza': 'bi gara',
  'si gara': 'bi gara',
  'bigara': 'bi gara',
  
  // ── "bang bike" yanlış algılamaları ──
  'bank bike': 'bang bike',
  'banka bike': 'bang bike',
  'bank bayık': 'bang bike',
  'bang bayık': 'bang bike',
  'bank pike': 'bang bike',
  'bang pike': 'bang bike',
  'ban bike': 'bang bike',
  'banbike': 'bang bike',
  'bang bayk': 'bang bike',
  'bank bayk': 'bang bike',
  
  // ── "lê bike" yanlış algılamaları ──
  'le bike': 'lê bike',
  'lebike': 'lê bike',
  'le bayık': 'lê bike',
  'le pike': 'lê bike',
  'le bayk': 'lê bike',
  
  // ── "pê bike" yanlış algılamaları ──
  'pe bike': 'pê bike',
  'pebike': 'pê bike',
  'pe bayık': 'pê bike',
  'pe pike': 'pê bike',
  'pe bayk': 'pê bike',
  
  // ── "telefon bike" yanlış algılamaları ──
  'telefon bayık': 'telefon bike',
  'telefon pike': 'telefon bike',
  'telefon bayk': 'telefon bike',
  
  // ── "ji kerema xwe" yanlış algılamaları ──
  'ci kerema şve': 'ji kerema xwe',
  'ji kerema şve': 'ji kerema xwe',
  'ci kerema hve': 'ji kerema xwe',
  'ji kerema hve': 'ji kerema xwe',
  'cikerema': 'ji kerema',
  
  // ── "dixwazim" yanlış algılamaları ──
  'dihvazim': 'dixwazim',
  'dihazim': 'dixwazim',
  'dikvazim': 'dixwazim',
  
  // ── Edatlar ──
  'ci': 'ji',
  'bi': 'bi',  // zaten doğru ama ekledik
  'bo': 'bo',  // zaten doğru
  
  // ── İsimler için düzeltmeler ──
  'vahap': 'wahap',
  'vahab': 'wahap',
  'vehap': 'wahap',
  'velat': 'welat',
  'velatê': 'welatê',
  
  // ── Selamlama düzeltmeleri ──
  'silav': 'silaw',
  'silaf': 'silaw',
  'rojbaş': 'rojbaş',  // zaten doğru
  'robash': 'rojbaş',
  
  // ── Diğer yaygın yanlış algılamalar ──
  'xeber bide': 'xeber bide',  // doğru
  'heber bide': 'xeber bide',
  'biaxive': 'biaxive',  // doğru
  'biahive': 'biaxive',
  'biaksive': 'biaxive',
};

/**
 * KÜRTÇE EK LİSTESİ (Kurmancî)
 * İsmin sonundaki Kürtçe çekim/hitap eklerini temizler.
 * 
 * NOT: Artık Türkçe'ye normalleştirme YOK!
 * Kürtçe isimler Kürtçe olarak aranır.
 * 
 * SIRALAMA KRİTİK: Uzun ekler önce gelir.
 * Sadece SON KELİMEYE uygulanır.
 * 
 * Örnekler:
 * - "Wahapko" → "Wahap" (sevgi hitabı)
 * - "Berîvana" → "Berîvan" (dişil yalın hâl)
 */
export const KU_SUFFIXES: Array<[RegExp, string]> = [
  // ── Hitap/seslenme ekleri (en yaygın sesli komutlarda) ──
  [/ko$/i, ''],        // Wahapko → Wahap (sevgi hitabı)
  [/kê$/i, ''],        // varyant
  [/bo$/i, ''],        // Wahapbo → Wahap (bazı diyalektler)

  // ── Tanımlık ekler ──
  [/êvan$/i, ''],      // çoğul tanımlık
  [/evan$/i, ''],      // varyant
  [/ên$/i, ''],        // çoğul tanımlık eril
  [/an$/i, ''],        // çoğul mutlak
  [/ê$/i, ''],         // tekil tanımlık eril / yönelme
  [/î$/i, ''],         // tanımlık / iyelik belirteci
  [/iyê$/i, ''],       // -iyê bileşik
  [/iya$/i, ''],       // dişil bileşik

  // ── Yalın hâl dişil ──
  [/a$/i, ''],         // Berîvana → Berîvan (DİKKAT: 'a' ile biten isimlere)

  // ── Hitap 'o' ──
  [/o$/i, ''],         // Wahabo → Wahap (DİKKAT: minimum 4 karakter kalsın)
];

/**
 * KÜRTÇE STOP WORD LİSTESİ (Kurmancî) — GENİŞLETİLMİŞ SÜRÜM
 *
 * ═══════════════════════════════════════════════════════════════
 * FONETİK YANLIŞ ALGILAMA HARİTASI (Türkçe STT → Kürtçe)
 * ═══════════════════════════════════════════════════════════════
 *
 * Kürtçede olan ama Türkçede OLMAYAN sesler:
 *
 *  x  (velar frikativ)  → h, k, ş, s, z, f, g, ğ, kh, ch
 *  xw (labio-velar)     → hv, şv, fv, kv, zv, f, v, hu, şu
 *  ê  (uzun e)          → e, i, a, ı, ye, ya
 *  î  (uzun i)          → i, ı, yi, yı
 *  û  (uzun u)          → u, ü, w, v
 *  w  (labio-velar)     → v, b, u, ü, f
 *  q  (uvular stop)     → k, g, ğ
 *  ç  (ts afrikat)      → c, s, ş, j, ts
 *  j  (voiced frikativ) → y, c, z, j
 *  '  (gırtlak sesi)    → sessiz, a, h
 *  r  (titreşimli r)    → r, rr
 *
 * Ek Türkçe STT eğilimleri:
 *  - Sözcük başı "b" bazen "p", "v", "d" → "b"
 *  - Sözcük sonu sessizler yutulabilir
 *  - İki sessiz yan yana gelince araya ünlü eklenebilir
 *  - Uzun ünlüler kısaltılabilir veya ikileşebilir
 *  - Vurgu kayması farklı hecede algılamaya yol açabilir
 */

export const KU_STOP_WORDS = new Set<string>([

  // ════════════════════════════════════════════════════════
  // BÖLÜM 1: "bi gara" — ARA / CALL
  // Kurmancî'de "ara" anlamına gelen temel komut
  // ════════════════════════════════════════════════════════

  // ── Doğru formlar ──
  'bi gara',
  'bigara',
  'bi ara',        // kısa varyant

  // ── b → p, v, d dönüşümü ──
  'pi gara',
  'pigara',
  'vi gara',
  'vigara',
  'di gara',
  'digara',
  'fi gara',
  'figara',

  // ── g → k, ğ, c dönüşümü ──
  'bi kara',
  'bikara',
  'bi ğara',
  'biğara',
  'bi cara',
  'bicara',
  'bi çara',
  'biçara',
  'bi hara',
  'bihara',

  // ── "bi" → "si", "ci", "zi", "gi", "hi", "yi" ──
  'si gara',
  'sigara',        // en yaygın yanlış algılama
  'ci gara',
  'cigara',
  'zi gara',
  'zigara',
  'gi gara',
  'gigara',
  'hi gara',
  'higara',

  // ── "gara" → "ğara", "ara", "ağra", "azra", "acra" ──
  'bi ağra',
  'biağra',
  'bi azra',
  'biazra',
  'bi acra',
  'biacra',
  'bi agra',
  'biagra',
  'bi ağra',
  'biağra',
  'bi ağara',
  'biağara',

  // ── "bi" → "bu", "bo" + "gara" dönüşümleri ──
  'bu gara',
  'bugara',
  'bu kara',
  'bukara',
  'bo gara',
  'bogara',

  // ── "gara" → "gazra", "gavra", "gabra" ──
  'bi gazra',
  'bigazra',
  'bi gavra',
  'bigavra',
  'bi gabra',
  'bigabra',

  // ── Türkçe STT "bi gara"yı tek kelime gibi algılama ──
  'bigara',
  'bugara',
  'buğara',
  'bugara',
  'buğara',
  'bugaran',
  'bugaral',
  'bugural',
  'bulgur al',
  'bugün ara',
  'bugün al',

  // ── Diğer tek-kelime varyantlar ──
  'gara',
  'kara',
  'cara',
  'bara',
  'para',
  'tara',
  'sara',
  'zara',
  'vara',
  'dara',

  // ════════════════════════════════════════════════════════
  // BÖLÜM 2: "bang bike" — ONA / ONA TELEFON ET
  // ════════════════════════════════════════════════════════

  // ── Doğru formlar ──
  'bang bike',
  'bangbike',
  'bang bike',

  // ── "bang" → "bank", "ban", "bam", "pan", "pang", "beng", "bong" ──
  'bank bike',
  'banka bike',
  'bankbike',
  'ban bike',
  'banbike',
  'bam bike',
  'bambike',
  'pan bike',
  'panbike',
  'pang bike',
  'pangbike',
  'beng bike',
  'bengbike',
  'bong bike',
  'bongbike',
  'dang bike',
  'dangbike',
  'gang bike',
  'gangbike',
  'fang bike',
  'fangbike',
  'hang bike',
  'hangbike',
  'rang bike',
  'rangbike',
  'sang bike',
  'sangbike',
  'vang bike',
  'vangbike',
  'zang bike',
  'zangbike',

  // ── "bike" → "bayık", "pike", "bayk", "bıke", "bice", "vike", "dike" ──
  'bang bayık',
  'bang pike',
  'bang bayk',
  'bang bıke',
  'bang bice',
  'bang vike',
  'bang dike',
  'bang fike',
  'bang gike',
  'bang hike',
  'bang kike',
  'bang like',
  'bang mike',
  'bang nike',
  'bang rike',
  'bang sike',
  'bang tike',
  'bang vice',
  'bang yike',
  'bang zike',

  // ── "bank" + "bike" varyantları ──
  'bank bayık',
  'bank pike',
  'bank bayk',
  'bank bıke',
  'bank bice',
  'bank vike',
  'bank dike',

  // ── "ban" + varyantlar ──
  'ban bayık',
  'ban pike',
  'ban bayk',
  'ban bice',
  'ban vike',

  // ── Tek kelime yanlış algılamalar ──
  'bayık',
  'pike',
  'bayk',
  'bıke',
  'bike',
  'bice',

  // ════════════════════════════════════════════════════════
  // BÖLÜM 3: "telefon bike" — TELEFON ET
  // ════════════════════════════════════════════════════════

  // ── Doğru formlar ──
  'telefon bike',
  'telefonbike',

  // ── "bike" yanlış algılamaları (tümü) ──
  'telefon bayık',
  'telefon pike',
  'telefon bayk',
  'telefon bıke',
  'telefon bice',
  'telefon vike',
  'telefon dike',
  'telefon fike',
  'telefon gike',
  'telefon hike',
  'telefon kike',
  'telefon sike',
  'telefon tike',
  'telefon zike',

  // ── "telefon" yanlış algılamaları ──
  'talefon bike',
  'tilefon bike',
  'telfon bike',
  'talafon bike',
  'telifon bike',
  'telefon bik',
  'telefon bika',
  'telefon biki',

  // ── "telefon" → "tilefon", "talefon" + "bike" varyantları ──
  'talefon bayık',
  'talefon pike',
  'tilefon bayık',
  'tilefon pike',

  // ════════════════════════════════════════════════════════
  // BÖLÜM 4: "lê bike" — ONA YAP / ONA ARA
  // ════════════════════════════════════════════════════════

  // ── Doğru formlar ──
  'lê bike',
  'lêbike',
  'le bike',
  'lebike',

  // ── "lê/le" → "li", "la", "lı", "ley", "ley" ──
  'li bike',
  'libike',
  'la bike',
  'labike',
  'lı bike',
  'lıbike',

  // ── "bike" tüm varyantlarıyla ──
  'lê bayık',
  'lê pike',
  'lê bayk',
  'lê bıke',
  'lê bice',
  'lê vike',
  'lê dike',
  'le bayık',
  'le pike',
  'le bayk',
  'le bıke',
  'le bice',
  'le vike',
  'le dike',
  'li bayık',
  'li pike',
  'li bayk',
  'li bice',
  'li vike',

  // ════════════════════════════════════════════════════════
  // BÖLÜM 5: "pê bike" / "pê re bike" — ONUNLA YAP
  // ════════════════════════════════════════════════════════

  // ── Doğru formlar ──
  'pê bike',
  'pêbike',
  'pe bike',
  'pebike',

  // ── "pê/pe" → "be", "bi", "pi", "de", "ve" ──
  'be bike',
  'bebike',
  'pi bike',
  'pibike',
  'de bike',
  'debike',
  've bike',
  'vebike',

  // ── "bike" tüm varyantlarıyla ──
  'pê bayık',
  'pê pike',
  'pê bayk',
  'pê bıke',
  'pê bice',
  'pê vike',
  'pe bayık',
  'pe pike',
  'pe bayk',
  'pe bıke',
  'pe bice',
  'pe vike',
  'be bayık',
  'be pike',
  'be bayk',
  'be bice',
  'be vike',

  // ── "pê re bike" formları ──
  'pê re bike',
  'pe re bike',
  'pê re bayık',
  'pe re bayık',
  'pê re pike',
  'pe re pike',
  'be re bike',
  'be re bayık',

  // ════════════════════════════════════════════════════════
  // BÖLÜM 6: "bang lê/pê bike" — ONA BAĞIR / ARA
  // ════════════════════════════════════════════════════════

  // ── Doğru formlar ──
  'bang lê bike',
  'bang pê bike',
  'bang le bike',
  'bang pe bike',

  // ── Kombinasyonlar ──
  'bang li bike',
  'bang la bike',
  'bang le bayık',
  'bang li bayık',
  'bang la bayık',
  'bang le pike',
  'bang li pike',
  'bang pê bayık',
  'bang pe bayık',
  'bang pe pike',
  'bang pê pike',

  // ── "bank" versiyonları ──
  'bank lê bike',
  'bank le bike',
  'bank li bike',
  'bank pê bike',
  'bank pe bike',
  'bank le bayık',
  'bank pe bayık',

  // ════════════════════════════════════════════════════════
  // BÖLÜM 7: "xeber bide" — HABER VER
  // x → h, k, ş, s, z, f dönüşümü
  // ════════════════════════════════════════════════════════

  // ── Doğru formlar ──
  'xeber bide',
  'xeberbide',

  // ── "xeber" → "heber", "keber", "şeber", "seber", "zeber", "feber", "geber", "çeber" ──
  'heber bide',
  'keberbide',
  'keber bide',
  'şeber bide',
  'şeberbide',
  'seber bide',
  'seberbide',
  'zeber bide',
  'zeberbide',
  'feber bide',
  'feberbide',
  'geber bide',
  'geberbide',
  'çeber bide',
  'çeberbide',
  'ceber bide',
  'ceberbide',

  // ── "bide" → "vide", "dide", "pide", "tide", "bide", "biyde" ──
  'xeber vide',
  'heber vide',
  'xeber dide',
  'heber dide',
  'xeber pide',
  'heber pide',
  'xeber tide',
  'heber tide',

  // ── "xeber lê bide" formları ──
  'xeber lê bide',
  'xeber le bide',
  'heber lê bide',
  'heber le bide',
  'keber le bide',
  'şeber le bide',
  'seber le bide',

  // ════════════════════════════════════════════════════════
  // BÖLÜM 8: "biaxive" — ONUNLA KONUŞ
  // ════════════════════════════════════════════════════════

  // ── Doğru formlar ──
  'biaxive',
  'axive',
  'biaxivim',
  'axivim',

  // ── "x" → "h", "k", "ş", "s", "z", "f" ──
  'biahive',
  'ahive',
  'biakhive',
  'biakşive',
  'biaşive',
  'aşive',
  'biasive',
  'asive',
  'biazive',
  'azive',
  'biafive',
  'afive',
  'biaksive',
  'aksive',
  'biacive',
  'acive',

  // ── "bi" öneki → "pi", "vi", "di" ──
  'piaxive',
  'piahive',
  'piaşive',
  'viaxive',
  'viahive',
  'viaşive',
  'diaxive',
  'diahive',
  'diasive',

  // ── "biaxivim" varyantları ──
  'biahivim',
  'biaşivim',
  'biasivim',
  'biazivim',

  // ════════════════════════════════════════════════════════
  // BÖLÜM 9: "pê re biaxive" — ONUNLA KONUŞ
  // ════════════════════════════════════════════════════════

  // ── Doğru formlar ──
  'pê re biaxive',
  'pêrebiaxive',
  'pe re biaxive',

  // ── Tüm kombinasyonlar ──
  'pê re biahive',
  'pe re biahive',
  'pê re biaşive',
  'pe re biaşive',
  'pê re biasive',
  'pe re biasive',
  'pê re biazive',
  'pe re biazive',
  'be re biaxive',
  'be re biahive',
  'be re biaşive',
  'be re biasive',
  'pi re biaxive',
  'pi re biahive',
  'di re biaxive',
  'di re biahive',
  've re biaxive',
  've re biahive',

  // ════════════════════════════════════════════════════════
  // BÖLÜM 10: "ji kerema xwe" — LÜTFEN
  // ji → ci, zi, gi, hi, yi, si
  // xwe → şve, hve, fve, kve, zve, ve, fe
  // ════════════════════════════════════════════════════════

  // ── Doğru formlar ──
  'ji kerema xwe',
  'jikeremaxwe',

  // ── "ji" → "ci", "zi", "gi", "hi", "yi", "si", "di" ──
  'ci kerema xwe',
  'zi kerema xwe',
  'gi kerema xwe',
  'hi kerema xwe',
  'yi kerema xwe',
  'si kerema xwe',
  'di kerema xwe',

  // ── "xwe" → "şve", "hve", "fve", "kve", "zve", "ve", "fe", "he", "ße" ──
  'ji kerema şve',
  'ji kerema hve',
  'ji kerema fve',
  'ji kerema kve',
  'ji kerema zve',
  'ji kerema ve',
  'ji kerema fe',
  'ji kerema he',
  'ji kerema hfe',
  'ji kerema şfe',
  'ji kerema hvê',
  'ji kerema şvê',
  'ji kerema fvê',

  // ── "ci" + "xwe" varyantları ──
  'ci kerema şve',
  'ci kerema hve',
  'ci kerema fve',
  'ci kerema kve',
  'ci kerema ve',
  'ci kerema he',

  // ── "zi" + "xwe" varyantları ──
  'zi kerema şve',
  'zi kerema hve',
  'zi kerema ve',

  // ── "gi" + "xwe" varyantları ──
  'gi kerema şve',
  'gi kerema hve',
  'gi kerema ve',

  // ── "kerema" → "kerama", "kerema", "kırema", "krama" ──
  'ji kerama xwe',
  'ji kerama şve',
  'ji kerama hve',
  'ci kerama xwe',
  'ci kerama şve',
  'ci kerama hve',
  'ji kırema xwe',
  'ji kırema şve',
  'ci kırema şve',
  'ji kerem şve',
  'ci kerem şve',
  'ji kerem hve',

  // ── Kısa formlar ──
  'ji kerema',
  'jikerema',
  'ci kerema',
  'cikerema',
  'zi kerema',
  'gi kerema',

  // ── "kerem ke" ──
  'kerem ke',
  'keremke',
  'kerem ge',
  'kerem ce',
  'kerem he',

  // ════════════════════════════════════════════════════════
  // BÖLÜM 11: "xwedê" / "xwedêro" — TANRI / YEMİN
  // ════════════════════════════════════════════════════════

  // ── Doğru formlar ──
  'xwedê',
  'xwedêro',
  'xwedêje',

  // ── "xw" → "hv", "şv", "fv", "kv", "zv", "f", "v", "h", "ş" ──
  'hvede',
  'şvede',
  'fvede',
  'kvede',
  'zvede',
  'fede',
  'vede',
  'hede',
  'şede',
  'hvedê',
  'şvedê',
  'fvedê',
  'vedê',
  'hedê',

  // ── "xwedêro" varyantları ──
  'hvedero',
  'şvedero',
  'fvedero',
  'vedero',
  'hedero',
  'hvedêro',
  'şvedêro',
  'fvedêro',
  'hvederou',

  // ════════════════════════════════════════════════════════
  // BÖLÜM 12: "dixwazim" — İSTİYORUM
  // dixwazim: di + xwaz + im
  // ════════════════════════════════════════════════════════

  // ── Doğru formlar ──
  'dixwazim',
  'dixwazim ku',
  'ez dixwazim',

  // ── "xw" → "hv", "şv", "fv", "kv", "h", "ş" ──
  'dihvazim',
  'dişvazim',
  'difvazim',
  'dikvazim',
  'dihazim',
  'dişazim',
  'difazim',
  'dikwazim',
  'divazim',
  'diuvazim',

  // ── "di" → "ti", "gi", "bi", "ni", "li" ──
  'tihvazim',
  'tişvazim',
  'tifvazim',
  'tihazim',
  'gihvazim',
  'gişvazim',
  'bihvazim',
  'bişvazim',
  'nihvazim',
  'nişvazim',
  'lihvazim',

  // ── Kısa formlar ──
  'dihvazim ku',
  'dişvazim ku',
  'difvazim ku',
  'dihazim ku',

  // ════════════════════════════════════════════════════════
  // BÖLÜM 13: "daxwaz dikim" — TALEP EDİYORUM
  // ════════════════════════════════════════════════════════

  // ── Doğru formlar ──
  'daxwaz dikim',
  'daxwaz',
  'dikim',

  // ── "xw" → "hv", "şv", "fv" dönüşümleri ──
  'dahvaz dikim',
  'dişvaz dikim',
  'difvaz dikim',
  'dahvaz',
  'dişvaz',
  'difvaz',
  'dakwaz',
  'davaz',

  // ── "dikim" → "diğim", "dicem", "dicem", "dikin" ──
  'daxwaz diğim',
  'daxwaz dicem',
  'daxwaz dikin',
  'dahvaz diğim',
  'dahvaz dicem',

  // ════════════════════════════════════════════════════════
  // BÖLÜM 14: "bide zanîn" — BİLDİR / HABER VER
  // ════════════════════════════════════════════════════════

  // ── Doğru formlar ──
  'bide zanîn',
  'bide zanin',
  'bidezanîn',
  'bidezanin',

  // ── "bide" → "vide", "dide", "pide", "gide" ──
  'vide zanîn',
  'vide zanin',
  'dide zanîn',
  'dide zanin',
  'pide zanîn',
  'pide zanin',
  'gide zanîn',
  'gide zanin',

  // ── "zanîn" → "zanin", "sanin", "janin", "xanin", "yanin", "hanin", "zanın" ──
  'bide sanîn',
  'bide sanin',
  'bide janîn',
  'bide janin',
  'bide xanin',
  'bide hanin',
  'bide yanin',
  'bide zanın',
  'bide zanen',
  'bide zane',

  // ── Kombinasyonlar ──
  'vide sanin',
  'vide hanin',
  'dide sanin',
  'pide sanin',

  // ════════════════════════════════════════════════════════
  // BÖLÜM 15: "têkilî bike" — İLETİŞİME GEÇ
  // ════════════════════════════════════════════════════════

  // ── Doğru formlar ──
  'têkilî bike',
  'têkilîbike',
  'tekili bike',
  'tekilî bike',

  // ── "ê" → "e", "a", "i" ──
  'tekilî bike',
  'takilî bike',
  'tikilî bike',
  'tekili bike',
  'takili bike',
  'tikili bike',

  // ── "bike" tüm varyantlarıyla ──
  'têkilî bayık',
  'tekili bayık',
  'têkilî pike',
  'tekili pike',
  'têkilî bayk',
  'tekili bayk',
  'têkilî bice',
  'tekili bice',
  'têkilî vike',
  'tekili vike',

  // ── "têkilî" → "dekili", "tekoli", "tekıli", "dıkılı" ──
  'dekili bike',
  'dekili bayık',
  'tekoli bike',
  'tekıli bike',
  'dıkılı bike',
  'takıla bike',
  'takılı bike',

  // ── Tek kelime ──
  'têkilî',
  'tekili',
  'takilî',
  'dekili',

  // ════════════════════════════════════════════════════════
  // BÖLÜM 16: ŞAHıS ZAMİRLERİ
  // ════════════════════════════════════════════════════════

  // ── Yalın hâl (Nominatif) ──
  'ez',          // ben
  'es',          // yanlış algılama
  'tu',          // sen
  'du',          // yanlış
  'tü',          // yanlış
  'ew',          // o
  'ev',          // yanlış / aynı zamanda "bu"
  'ef',          // yanlış
  'ep',          // yanlış
  'em',          // biz
  'hem',         // yanlış
  'am',          // yanlış
  'hûn',         // siz
  'hun',         // kısa
  'hin',         // yanlış
  'hün',         // yanlış
  'ün',          // yanlış (çok kısa algılama)
  'ew',          // onlar (bağlamsal)

  // ── Oblik hâl (Oblique) ──
  'min',         // beni/benim
  'men',         // yanlış
  'bin',         // yanlış (önemli çünkü anlamlı kelime)
  'mın',         // yanlış
  'te',          // seni/senin
  'de',          // yanlış
  'tı',          // yanlış
  'wî',          // onu (eril)
  'wi',
  'vi',          // yanlış
  'bi',          // yanlış
  'fi',          // yanlış
  'gi',          // yanlış
  'wê',          // onu (dişil)
  'we',
  've',          // yanlış
  'be',          // yanlış
  'fe',          // yanlış
  'me',          // bizi/bizim
  'wan',         // onları/onların
  'van',         // yanlış
  'ban',         // yanlış
  'fan',         // yanlış
  'man',         // yanlış
  'zan',         // yanlış

  // ════════════════════════════════════════════════════════
  // BÖLÜM 17: EDATLAR / İLGEÇLER
  // ════════════════════════════════════════════════════════

  // ── "ji" (dan/den/için) ──
  'ji',
  'ci',          // yanlış (EN YAYGIN)
  'zi',          // yanlış
  'gi',          // yanlış
  'hi',          // yanlış
  'yi',          // yanlış
  'si',          // yanlış
  'di',          // yanlış (aynı zamanda geçerli edat)

  // ── "ji bo" (için) ──
  'ji bo',
  'jibo',
  'ci bo',
  'cibo',
  'zi bo',
  'zibo',
  'gi bo',
  'gibo',
  'hi bo',
  'hibo',

  // ── "li" (de/da/te) ──
  'li',
  'ri',          // yanlış
  'ni',          // yanlış
  'di',          // (geçerli edat, bu yüzden dikkatli)

  // ── "bi" (ile/tarafından) ──
  'bi',
  'pi',          // yanlış
  'vi',          // yanlış (tekrar)

  // ── Diğer edatlar ──
  'ra',
  've',
  'de',
  'da',
  're',
  'ser',
  'bin',
  'nav',
  'nava',
  'navbera',
  'navbara',     // yanlış

  // ── "pêş" (önünde) ──
  'pêş',
  'pes',
  'peş',
  'piş',
  'pış',
  'beş',         // yanlış

  // ── "paş" (arkasında) ──
  'paş',
  'pas',
  'baş',         // yanlış (aynı zamanda "iyi" anlamında)
  'bas',         // yanlış

  // ── "berî" (önce) ──
  'berî',
  'beri',
  'veri',        // yanlış
  'peri',        // yanlış
  'feri',        // yanlış

  // ── "piştî" (sonra) ──
  'piştî',
  'pişti',
  'pisti',
  'bişti',       // yanlış
  'vişti',       // yanlış

  // ── "tevî" (beraber) ──
  'tevî',
  'tevi',
  'devi',        // yanlış
  'bevi',        // yanlış

  // ── "hertî/herî" (her zaman/en) ──
  'hertî',
  'herti',
  'herî',
  'heri',
  'heri',

  // ════════════════════════════════════════════════════════
  // BÖLÜM 18: BAĞLAÇLAR
  // ════════════════════════════════════════════════════════

  // ── "û" (ve) ──
  'û',
  'u',
  'ü',
  'v',           // yanlış (çok kısa)
  'w',           // yanlış

  // ── "an/yan" (veya) ──
  'an',
  'yan',
  'an ku',
  'yan ku',

  // ── "lê" (ama) ──
  'lê',
  'le',
  'li',          // (tekrar)
  'lê ku',
  'le ku',

  // ── "belê" (evet/ama) ──
  'belê',
  'bele',
  'belê ku',
  'bele ku',
  'vele',        // yanlış
  'delê',        // yanlış

  // ── "jî" (da/de/aynı zamanda) ──
  'jî',
  'ji',          // (tekrar)
  'ci',          // (tekrar)
  'zi',          // (tekrar)
  'yi',          // (tekrar)

  // ── "lewre" (bu yüzden) ──
  'lewre',
  'levre',       // yanlış
  'leure',       // yanlış
  'levre',
  'lefre',       // yanlış
  'lebre',       // yanlış

  // ── "ji ber" / "ji ber ku" (çünkü) ──
  'ji ber',
  'jiber',
  'ci ber',
  'ciber',
  'zi ber',
  'gi ber',
  'ji ber ku',
  'ci ber ku',
  'zi ber ku',

  // ── "çimkî" (çünkü) ──
  'çimkî',
  'cimki',
  'cimkî',
  'simki',       // yanlış
  'simkî',       // yanlış
  'şimki',       // yanlış
  'jimki',       // yanlış
  'timki',       // yanlış
  'zimki',       // yanlış

  // ── "jixwe" (zaten) ──
  'jixwe',
  'cihve',       // yanlış
  'cişve',       // yanlış
  'cifve',       // yanlış
  'cikve',       // yanlış
  'jihve',       // yanlış
  'jişve',       // yanlış
  'jifve',       // yanlış

  // ── "gava/dema ku" (ne zaman) ──
  'gava',
  'kava',        // yanlış
  'bava',        // yanlış
  'dema',
  'dema ku',
  'gava ku',

  // ── "eger/heke" (eğer) ──
  'eger',
  'eğer',        // Türkçe ile çakışma
  'heke',
  'heke ku',
  'eke',         // yanlış
  'geke',        // yanlış

  // ── "ku" (ki/ne zaman/nerede) ──
  'ku',
  'gu',          // yanlış
  'bu',          // yanlış
  'du',          // yanlış
  'mu',          // yanlış

  // ════════════════════════════════════════════════════════
  // BÖLÜM 19: SORU KELİMELERİ
  // ════════════════════════════════════════════════════════

  // ── "kî" (kim) ──
  'kî',
  'ki',
  'gi',          // yanlış
  'ci',          // yanlış
  'zi',          // yanlış
  'si',          // yanlış
  'ji',          // yanlış

  // ── "çi" (ne) ──
  'çi',
  'ci',          // yanlış (EN YAYGIN)
  'si',          // yanlış
  'şi',          // yanlış
  'ti',          // yanlış
  'ji',          // yanlış

  // ── "kû/ku" (nerede) ──
  'kû',
  'ku',
  'gu',
  'bu',

  // ── "kengê" (ne zaman) ──
  'kengê',
  'kenge',
  'genge',       // yanlış
  'henge',       // yanlış
  'senge',       // yanlış
  'denge',       // yanlış (aynı zamanda anlamlı Türkçe kelime)
  'tenge',       // yanlış
  'benge',       // yanlış
  'renge',       // yanlış
  'lenge',       // yanlış
  'menge',       // yanlış
  'yenge',       // yanlış

  // ── "çawa" (nasıl) ──
  'çawa',
  'cawa',
  'sawa',        // yanlış
  'şawa',        // yanlış
  'tawa',        // yanlış
  'java',        // yanlış
  'çava',        // yanlış
  'sava',        // yanlış (EN YAYGIN)
  'zava',        // yanlış
  'hawa',        // yanlış
  'bawa',        // yanlış
  'dawa',        // yanlış
  'fawa',        // yanlış
  'gawa',        // yanlış

  // ── "çawa ku" ──
  'çawa ku',
  'cawa ku',
  'sawa ku',
  'sava ku',
  'şawa ku',

  // ── "çiqas" (ne kadar) ──
  'çiqas',
  'ciqas',
  'siqas',       // yanlış
  'şiqas',       // yanlış
  'tiqas',       // yanlış
  'cikas',       // yanlış
  'sikas',       // yanlış
  'şikas',       // yanlış
  'cıkas',       // yanlış
  'sıkaş',       // yanlış
  'çikaş',       // yanlış
  'çiqaş',       // yanlış

  // ── "çend" (kaç/ne kadar) ──
  'çend',
  'cend',
  'send',        // yanlış
  'şend',        // yanlış
  'tend',        // yanlış
  'zend',        // yanlış
  'bend',        // yanlış
  'gend',        // yanlış
  'hend',        // yanlış
  'jend',        // yanlış

  // ════════════════════════════════════════════════════════
  // BÖLÜM 20: ZAMAN ZARFLARI
  // ════════════════════════════════════════════════════════

  // ── "niha/naha" (şimdi) ──
  'niha',
  'naha',
  'nûha',
  'nuha',
  'nihe',
  'nahe',
  'nuhe',
  'nıha',        // yanlış
  'mıha',        // yanlış
  'liha',        // yanlış
  'biha',        // yanlış
  'diha',        // yanlış

  // ── "êdî" (artık/şimdi) ──
  'êdî',
  'edi',
  'idi',
  'yedi',        // yanlış (Türkçe'de "7" anlamında)
  'ede',
  'idi',
  'adî',
  'adi',

  // ── "hema" (hemen/neredeyse) ──
  'hema',
  'heman',
  'bema',        // yanlış
  'gema',        // yanlış
  'rema',        // yanlış
  'sema',        // yanlış
  'tema',        // yanlış

  // ── "zû" (erken/çabuk) ──
  'zû',
  'zu',
  'su',          // yanlış
  'yu',          // yanlış
  'ju',          // yanlış
  'vu',          // yanlış
  'bu',          // yanlış
  'du',          // yanlış

  // ── "dereng" (geç) ──
  'dereng',
  'dıreng',
  'direng',
  'deren',
  'dreng',
  'derink',

  // ── "piçek/piçekî" (biraz) ──
  'piçek',
  'piçekî',
  'picek',
  'pişek',       // yanlış
  'pişekî',      // yanlış
  'bisek',       // yanlış
  'bizek',       // yanlış
  'misek',       // yanlış
  'visek',       // yanlış
  'disek',       // yanlış
  'ficek',       // yanlış
  'gicek',       // yanlış

  // ── "carekê" (bir kez) ──
  'carekê',
  'carek',
  'cara',
  'careke',
  'careki',
  'jarekê',      // yanlış
  'zarekê',      // yanlış

  // ── "îcar/îcarê" (bu sefer) ──
  'îcar',
  'icar',
  'îcarê',
  'icare',
  'yicar',       // yanlış
  'hicar',       // yanlış

  // ── "paşê" (sonra) ──
  'paşê',
  'pase',
  'paşe',
  'basse',       // yanlış
  'dase',        // yanlış
  'fase',        // yanlış
  'gase',        // yanlış
  'kase',        // yanlış
  'mase',        // yanlış
  'vase',        // yanlış
  'zase',        // yanlış

  // ── "dûre" (sonra/uzak) ──
  'dûre',
  'dure',
  'düre',        // yanlış
  'tûre',        // yanlış
  'ture',        // yanlış
  'bure',        // yanlış
  'gure',        // yanlış
  'kure',        // yanlış

  // ── "berê" (önce/daha önce) ──
  'berê',
  'bere',
  'vere',        // yanlış
  'pere',        // yanlış
  'dere',        // yanlış
  'fere',        // yanlış
  'gere',        // yanlış
  'here',        // "here" aynı zamanda "git" anlamında!
  'sere',        // yanlış
  'zere',        // yanlış

  // ════════════════════════════════════════════════════════
  // BÖLÜM 21: ONAY / RET
  // ════════════════════════════════════════════════════════

  // ── "erê" (evet) ──
  'erê',
  'ere',
  'ire',         // yanlış
  'are',         // yanlış
  'ure',         // yanlış
  'ırê',         // yanlış

  // ── "belê" (evet) ──
  'belê',
  'bele',
  'vele',        // yanlış
  'delê',        // yanlış
  'belê ku',

  // ── "baş e" (tamam/iyi) ──
  'baş e',
  'baş',
  'basê',
  'bas',
  'baş',
  'başe',
  'baste',       // yanlış
  'vaste',       // yanlış

  // ── "xweş e" (iyi/güzel) ──
  'xweşe',
  'xweş',
  'xwes',
  'hveşe',       // yanlış (x → h)
  'şveşe',       // yanlış (x → ş)
  'fveşe',       // yanlış
  'kveşe',       // yanlış
  'hveş',        // yanlış
  'şveş',        // yanlış
  'fveş',        // yanlış
  'heşe',        // yanlış (xw → h, tek ses)
  'şeşe',        // yanlış
  'feşe',        // yanlış

  // ── "na" (hayır) ──
  'na',
  'nake',
  'nabin',
  'nabe',
  'nabe ku',

  // ════════════════════════════════════════════════════════
  // BÖLÜM 22: SELAMLAŞMALAR (GENİŞLETİLMİŞ)
  // ════════════════════════════════════════════════════════

  // ── "silaw" (merhaba) ──
  'silaw',
  'silav',       // yanlış (w → v, EN YAYGIN)
  'silaf',       // yanlış (w → f)
  'silam',       // yanlış (w → m)
  'silah',       // yanlış (w → h)
  'silab',       // yanlış (w → b)
  'silap',       // yanlış (w → p)
  'silay',       // yanlış (w → y)
  'sılaw',       // yanlış (i → ı)
  'sılab',       // yanlış
  'sılaf',       // yanlış
  'cilaw',       // yanlış (s → c)
  'cilav',       // yanlış
  'zilav',       // yanlış (s → z)
  'gilaw',       // yanlış (s → g)
  'gilab',       // yanlış
  'hilaw',       // yanlış (s → h)
  'hilav',       // yanlış
  'yilaw',       // yanlış (s → y)
  'şilaw',       // yanlış (s → ş)
  'şilav',       // yanlış
  'dilaw',       // yanlış
  'dilav',       // yanlış

  // ── "merheba" (merhaba) ──
  'merheba',
  'merhava',     // yanlış (e → a)
  'merheva',     // yanlış (b → v)
  'merhela',     // yanlış (b → l)
  'merbeba',     // yanlış (h → b)
  'mereheba',    // yanlış (ek ünlü)
  'merheba',
  'merhabe',     // yanlış (son a → e)
  'merhabi',     // yanlış
  'merbeva',     // yanlış

  // ── "rojbaş" (günaydın/iyi günler) ──
  'rojbaş',
  'robas',
  'robash',      // yanlış (ş → sh)
  'rocbaş',      // yanlış (j → c)
  'rozbaş',      // yanlış (j → z)
  'rocbas',      // yanlış
  'rocbash',     // yanlış
  'rozbas',      // yanlış
  'rozbash',     // yanlış
  'roşbaş',      // yanlış (j → ş)
  'roşbas',      // yanlış
  'roshbas',     // yanlış
  'rojbas',      // yanlış (ş → s)
  'roçbaş',      // yanlış (j → ç)
  'roçbas',      // yanlış
  'rohbaş',      // yanlış (j → h)
  'rohbas',      // yanlış
  'roybas',      // yanlış (j → y)

  // ── "xêr be" (allahaismarladık/esenlikler) ──
  'xêr be',
  'xer be',
  'her be',      // yanlış (x → h)
  'şer be',      // yanlış (x → ş)
  'ker be',      // yanlış (x → k)
  'zer be',      // yanlış (x → z)
  'fer be',      // yanlış (x → f)
  'ger be',      // yanlış (x → g)
  'yer be',      // yanlış (x → y)
  'çer be',      // yanlış (x → ç)
  'ser be',      // yanlış (x → s)
  'der be',      // yanlış (x → d)
  'ber be',      // yanlış (x → b)
  'ter be',      // yanlış (x → t)
  'mer be',      // yanlış (x → m)
  'ner be',      // yanlış (x → n)
  'ver be',      // yanlış (x → v)

  // ── "eywallah/eyvallah" (teşekkür/allahaismarladık) ──
  'eywallah',
  'eyvallah',    // yanlış (w → v)
  'eyballah',    // yanlış (w → b)
  'eyballa',     // yanlış
  'eyvalla',     // yanlış
  'eywalla',     // yanlış
  'eyuallah',    // yanlış
  'eyualla',     // yanlış
  'eyballah',    // yanlış
  'eyvala',      // yanlış (kısaltma)
  'eyvale',      // yanlış

  // ── "destxweş" (aferin/bravo) ──
  'destxweş',
  'desthveş',    // yanlış (xw → hv)
  'destşveş',    // yanlış (xw → şv)
  'destfveş',    // yanlış (xw → fv)
  'destkveş',    // yanlış (xw → kv)
  'destzveş',    // yanlış (xw → zv)
  'desthfeş',    // yanlış
  'desthveş',
  'destheş',     // yanlış (xw → h, tek ses)
  'destşeş',     // yanlış
  'destfeş',     // yanlış
  'destgeş',     // yanlış

  // ── "çawanî" (nasılsın) ──
  'çawanî',
  'cawani',
  'savani',      // yanlış (ç → s)
  'şawanî',      // yanlış (ç → ş)
  'tawani',      // yanlış (ç → t)
  'zawani',      // yanlış (ç → z)
  'hawani',      // yanlış (ç → h)
  'javani',      // yanlış (w → v)
  'cavani',      // yanlış
  'savane',      // yanlış
  'savani',

  // ── "çonî/çoni" (nasılsın, kısa form) ──
  'çonî',
  'çoni',
  'coni',
  'soni',        // yanlış
  'şoni',        // yanlış
  'toni',        // yanlış
  'joni',        // yanlış
  'zoni',        // yanlış

  // ── Diğer selamlamalar ──
  'hey',
  'alo',
  'halo',        // yanlış
  'sayid',       // (çeşitli yazılışlar)
  'sayıt',       // yanlış
  'sayt',        // yanlış
  'sayd',        // yanlış

  // ════════════════════════════════════════════════════════
  // BÖLÜM 23: FİİL KÖKLERİ VE EMRE FİİLLER
  // ════════════════════════════════════════════════════════

  // ── "bêje" (söyle) ──
  'bêje',
  'beje',
  'bice',        // yanlış (ê → i, j → c)
  'bise',        // yanlış
  'bize',        // yanlış
  'bige',        // yanlış
  'bile',        // yanlış
  'bire',        // yanlış
  'bive',        // yanlış
  'bide',        // dikkat: "bide" = "ver" anlamında da var!
  'biye',        // yanlış
  'bıce',        // yanlış
  'bıje',        // yanlış
  'bıze',        // yanlış

  // ── "bide" (ver) ──
  'bide',
  'bidê',
  'vide',        // yanlış (b → v)
  'dide',        // yanlış (b → d)
  'pide',        // yanlış (b → p)
  'gide',        // yanlış (b → g)
  'hide',        // yanlış (b → h)
  'tidi',        // yanlış
  'bidi',        // yanlış
  'bide',

  // ── "rabe" (kalk/haydi) ──
  'rabe',
  'rape',        // yanlış (b → p)
  'rave',        // yanlış (b → v)
  'rade',        // yanlış (b → d)
  'race',        // yanlış
  'rafe',        // yanlış (b → f)
  'rage',        // yanlış (b → g)
  'rare',        // yanlış
  'rame',        // yanlış
  'rate',        // yanlış

  // ── "here" (git) ──
  'here',
  'here',
  'heri',        // yanlış (e → i)
  'herê',        // uzun form
  'hare',        // yanlış (e → a)
  'hire',        // yanlış (e → i, farklı yazım)

  // ── "bê/were" (gel) ──
  'bê',
  'be',          // yanlış
  'bi',          // yanlış
  'pê',          // yanlış
  'pe',          // yanlış
  'vê',          // yanlış
  've',          // yanlış
  'were',
  'vere',        // yanlış (w → v)
  'bere',        // yanlış (w → b)
  'dere',        // yanlış (w → d)
  'gere',        // yanlış (w → g)
  'fere',        // yanlış (w → f)
  'kere',        // yanlış (w → k)
  'sere',        // yanlış (w → s)
  'zere',        // yanlış (w → z)
  'yere',        // yanlış (w → y)
  'nere',        // yanlış (w → n)

  // ── "werin" (gelin, çoğul) ──
  'werin',
  'verin',       // yanlış (w → v)
  'berin',       // yanlış
  'derin',       // yanlış
  'gerin',       // yanlış
  'ferin',       // yanlış
  'kerin',       // yanlış
  'serin',       // yanlış
  'zerin',       // yanlış
  'yerin',       // yanlış
  'nerin',       // yanlış

  // ── "herin" (gidin, çoğul) ──
  'herin',
  'erin',        // yanlış (h düşmesi)
  'gerin',       // yanlış (h → g)
  'ferin',       // yanlış (h → f)
  'kerin',       // yanlış (h → k)
  'serin',       // yanlış (h → s)
  'zerin',       // yanlış (h → z)

  // ── "rêk bixin" (düzenleyin) ──
  'rêk bixin',
  'rek bixin',
  'rek bikin',   // yanlış
  'reyk bixin',  // yanlış
  'rek bıçin',   // yanlış
  'rek biçin',   // yanlış
  'rek bışın',   // yanlış
  'rek bışin',   // yanlış

  // ── "bila" (bırak/olsun) ──
  'bila',
  'bıla',        // yanlış
  'bila',
  'pila',        // yanlış (b → p)
  'vila',        // yanlış (b → v)
  'dila',        // yanlış (b → d)
  'hila',        // yanlış (b → h)
  'gila',        // yanlış (b → g)
  'mila',        // yanlış (b → m)

  // ── "bigire" (tut/al) ──
  'bigire',
  'bikire',      // yanlış (g → k)
  'bigira',      // yanlış (e → a)
  'bigiri',      // yanlış (e → i)
  'vigire',      // yanlış (b → v)
  'vikire',      // yanlış
  'pigire',      // yanlış (b → p)
  'digire',      // yanlış (b → d)

  // ── "biparêze" (koru) ──
  'biparêze',
  'bipareze',
  'biparese',    // yanlış (ê → e, z → s)
  'biparöze',    // yanlış
  'bipareze',
  'biparöse',    // yanlış
  'vipareze',    // yanlış (b → v)
  'pipareze',    // yanlış (b → p)

  // ── "bixwaze" (istesin) ──
  'bixwaze',
  'bihvaze',     // yanlış (xw → hv)
  'bişvaze',     // yanlış (xw → şv)
  'bifvaze',     // yanlış (xw → fv)
  'bikvaze',     // yanlış (xw → kv)
  'bihaze',      // yanlış (xw → h)
  'bişaze',      // yanlış (xw → ş)

  // ── "bixwazim" (isteyeyim) ──
  'bixwazim',
  'bihvazim',
  'bişvazim',
  'bifvazim',
  'bikvazim',
  'bihazim',
  'bişazim',

  // ── "bixwazin" (istesinler) ──
  'bixwazin',
  'bihvazin',
  'bişvazin',
  'bifvazin',
  'bikvazin',
  'bihazin',
  'bişazin',

  // ── "berde" (bırak) ──
  'berde',
  'verde',       // yanlış (b → v)
  'perde',       // yanlış (b → p)
  'derde',       // yanlış (b → d)
  'berda',       // yanlış (e → a)
  'berdi',       // yanlış (e → i)

  // ── "bihêle" (bırak/izin ver) ──
  'bihêle',
  'bihele',
  'bihale',      // yanlış (ê → a)
  'bihıle',      // yanlış (ê → ı)
  'vihele',      // yanlış (b → v)
  'pihele',      // yanlış (b → p)
  'gihele',      // yanlış (b → g)
  'sihele',      // yanlış (b → s)
  'zihele',      // yanlış (b → z)
  'nihele',      // yanlış (b → n)
  'dihele',      // yanlış (b → d)

  // ── "bimîne" (kal) ──
  'bimîne',
  'bimine',
  'bimina',      // yanlış (e → a)
  'bimini',      // yanlış (e → i)
  'vimîne',      // yanlış (b → v)
  'vimine',      // yanlış
  'pimîne',      // yanlış (b → p)
  'pimine',      // yanlış
  'dimîne',      // yanlış (b → d)

  // ════════════════════════════════════════════════════════
  // BÖLÜM 24: EK KALIPLAR VE BAĞLAM İFADELERİ
  // ════════════════════════════════════════════════════════

  // ── "min jê re" (ona benim için) ──
  'min jê re',
  'min je re',
  'min ci re',   // yanlış (j → c)
  'min zi re',   // yanlış (j → z)
  'min ye re',   // yanlış (j → y)

  // ── "ji min re" (benim için) ──
  'ji min re',
  'ci min re',   // yanlış (j → c)
  'zi min re',   // yanlış
  'gi min re',   // yanlış

  // ── "min dixwaze" (o benden istiyor / benim istediğim) ──
  'min dixwaze',
  'min dihvaze',
  'min dişvaze',
  'min difvaze',
  'min dihaze',

  // ── "ez dixwazim ku" ──
  'ez dixwazim ku',
  'ez dihvazim ku',
  'ez dişvazim ku',
  'es dixwazim ku',  // yanlış (ez → es)
  'es dihvazim ku',

  // ── "ka" (haydi/bakalım) ──
  'ka',
  'ga',          // yanlış
  'ha',          // yanlış
  'da',          // yanlış
  'ba',          // yanlış
  'pa',          // yanlış

  // ── "lê" (ama / ona) ──
  'lê',
  'le',          // yanlış
  'li',          // yanlış

  // ── "jî" (da/de) ──
  'jî',
  'ji',
  'ci',          // yanlış

  // ── "ne" (değil) ──
  'ne',
  'ni',          // yanlış (bağlamsal)
  'na',          // yanlış

  // ── "hem" (hem) ──
  'hem',
  'hım',         // yanlış
  'am',          // yanlış

  // ── "werin" tekrar ──
  'werin',
  'verin',

  // ── Türkçe kelimelerin Kürtçe komut yerine algılanması ──
  'Güler\'e',    // "bi gara" → "Güler'e" (özel isim yanlış algılaması)
  'sigara',      // "bi gara" → "sigara" (EN YAYGIN)
  'denge',       // "kengê" → "denge" (Türkçe kelime)
  'yendi',       // "êdî" → "yendi" yanlış
  'eğer',        // "eger" ile Türkçe çakışması
  'bende',       // "berde" → "bende" yanlış
  'buna',        // "bida" yanlış
  'bunu',        // yanlış algılama
  'bana',        // "bide" → "bana" yanlış
  'sana',        // yanlış algılama
]);

// ════════════════════════════════════════════════════════
// KÜRTÇE SELAMLAMA KELİMELERİ (GENİŞLETİLMİŞ)
// ════════════════════════════════════════════════════════

export const KU_GREETING_WORDS = new Set<string>([
  // Doğru telaffuzlar
  'silaw',
  'merheba',
  'xêr be',
  'xer be',
  'rojbaş',
  'robas',
  'eywallah',
  'destxweş',
  'baş e',
  'xweş e',
  'choni',
  'çawanî',
  'çoni',
  'hey',
  'sayid',
  'ka',

  // ── "silaw" yanlış algılamaları ──
  'silav',
  'silaf',
  'silam',
  'silah',
  'silab',
  'silap',
  'silay',
  'sılaw',
  'cilaw',
  'cilav',
  'zilav',
  'gilaw',
  'hilaw',
  'yilaw',
  'şilaw',
  'şilav',
  'dilaw',
  'dilav',

  // ── "rojbaş" yanlış algılamaları ──
  'robash',
  'rocbaş',
  'rozbaş',
  'rocbas',
  'rocbash',
  'rozbas',
  'rozbash',
  'roşbaş',
  'roşbas',
  'roshbas',
  'rojbas',
  'roçbaş',
  'rohbaş',
  'roybas',

  // ── "xêr be" yanlış algılamaları ──
  'her be',
  'şer be',
  'ker be',
  'zer be',
  'fer be',
  'ger be',
  'yer be',
  'ser be',
  'der be',
  'ber be',
  'ter be',
  'ver be',

  // ── "eywallah" yanlış algılamaları ──
  'eyvallah',
  'eyballah',
  'eyballa',
  'eyvalla',
  'eywalla',
  'eyuallah',
  'eyualla',
  'eyvala',
  'eyvale',

  // ── "destxweş" yanlış algılamaları ──
  'desthveş',
  'destşveş',
  'destfveş',
  'destkveş',
  'destzveş',
  'desthfeş',
  'destheş',
  'destşeş',
  'destfeş',
  'destgeş',

  // ── Kısa / yaygın formlar ──
  'baş',
  'bas',
  'xweş',
  'hveş e',
  'şveş e',
  'hveş',
  'şveş',

  // ── "çawanî" yanlış algılamaları ──
  'savani',
  'şawanî',
  'tawani',
  'zawani',
  'hawani',
  'javani',
  'cavani',
  'savane',
  'cawani',

  // ── "çoni/çonî" yanlış algılamaları ──
  'coni',
  'soni',
  'şoni',
  'toni',
  'joni',
  'zoni',

  // ── "merheba" yanlış algılamaları ──
  'merhava',
  'merheva',
  'merhela',
  'merbeba',
  'mereheba',
  'merhabe',
  'merhabi',
  'merbeva',
]);

// ════════════════════════════════════════════════════════
// KÜRTÇE REGEX KOMUT KALIPLARI (GENİŞLETİLMİŞ)
// ════════════════════════════════════════════════════════

export const KU_COMMAND_PATTERNS: RegExp[] = [

  // ══════════════════════════════════════
  // "bi gara" VE TÜM YANLIŞ ALGILAMALARI
  // ══════════════════════════════════════

  // Doğru formlar
  /^(?:li\s+)?(.+?)\s+bi\s*gara/i,
  /^(.+?)\s+bi\s*gara/i,

  // "sigara" (EN YAYGIN: "bi gara" → "sigara")
  /^(.+?)\s+sigara/i,
  /^(?:li\s+)?(.+?)\s+sigara/i,

  // b → p, v, d, f
  /^(.+?)\s+pi\s*gara/i,
  /^(.+?)\s+vi\s*gara/i,
  /^(.+?)\s+di\s*gara/i,
  /^(.+?)\s+fi\s*gara/i,

  // g → k, c, h, ğ, ç
  /^(.+?)\s+bi\s*kara/i,
  /^(.+?)\s+bi\s*cara/i,
  /^(.+?)\s+bi\s*hara/i,
  /^(.+?)\s+bi\s*ğara/i,
  /^(.+?)\s+bi\s*çara/i,

  // "bi" → "si", "ci", "zi", "gi"
  /^(.+?)\s+si\s*gara/i,
  /^(.+?)\s+ci\s*gara/i,
  /^(.+?)\s+zi\s*gara/i,
  /^(.+?)\s+gi\s*gara/i,

  // "gara" → "ağra", "azra", "agra"
  /^(.+?)\s+bi\s*ağra/i,
  /^(.+?)\s+bi\s*azra/i,
  /^(.+?)\s+bi\s*agra/i,
  /^(.+?)\s+bi\s*gazra/i,
  /^(.+?)\s+bi\s*gavra/i,
  /^(.+?)\s+bi\s*gaza/i,

  // Tek kelime "gara" varyantları sonda
  /^(.+?)\s+(?:kara|cara|bara|para|tara|sara|zara|vara|dara)$/i,

  // ══════════════════════════════════════
  // "bang bike" VE TÜM YANLIŞ ALGILAMALARI
  // ══════════════════════════════════════

  // Doğru
  /^(?:li\s+)?(.+?)\s+bang\s+bike/i,
  /^(.+?)\s+bang\s+bike/i,

  // "bang" → "bank", "ban", "bam", "pan", "pang", "beng", "bong", "dang", vb.
  /^(.+?)\s+bank\s+bike/i,
  /^(.+?)\s+banka\s+bike/i,
  /^(.+?)\s+ban\s+bike/i,
  /^(.+?)\s+pang\s+bike/i,
  /^(.+?)\s+pan\s+bike/i,
  /^(.+?)\s+beng\s+bike/i,
  /^(.+?)\s+bong\s+bike/i,
  /^(.+?)\s+dang\s+bike/i,
  /^(.+?)\s+gang\s+bike/i,
  /^(.+?)\s+hang\s+bike/i,
  /^(.+?)\s+rang\s+bike/i,
  /^(.+?)\s+sang\s+bike/i,
  /^(.+?)\s+vang\s+bike/i,
  /^(.+?)\s+zang\s+bike/i,
  /^(.+?)\s+fang\s+bike/i,

  // "bike" → "bayık", "pike", "bayk", "bıke", "bice", "vike", "dike"
  /^(.+?)\s+bang\s+(?:bayık|pike|bayk|bıke|bice|vike|dike|fike|sike|tike|zike)/i,
  /^(.+?)\s+bank\s+(?:bayık|pike|bayk|bıke|bice|vike|dike|fike)/i,
  /^(.+?)\s+ban\s+(?:bayık|pike|bayk|bice|vike)/i,
  /^(.+?)\s+beng\s+(?:bayık|pike|bayk|bice)/i,
  /^(.+?)\s+pang\s+(?:bayık|pike|bayk|bice)/i,

  // ══════════════════════════════════════
  // "telefon bike" VE YANLIŞ ALGILAMALARI
  // ══════════════════════════════════════

  /^(.+?)\s+telefon\s+bike/i,
  /^(.+?)\s+telefon\s+(?:bayık|pike|bayk|bıke|bice|vike|dike|fike|sike|tike|zike)/i,
  /^(.+?)\s+(?:talefon|tilefon|telfon)\s+bike/i,
  /^(.+?)\s+(?:talefon|tilefon|telfon)\s+(?:bayık|pike|bayk|bice)/i,

  // ══════════════════════════════════════
  // "lê bike" / "le bike" VE YANLIŞ ALGILAMALARI
  // ══════════════════════════════════════

  /^(.+?)\s+lê\s+bike/i,
  /^(.+?)\s+le\s+bike/i,
  /^(.+?)\s+li\s+bike/i,
  /^(.+?)\s+la\s+bike/i,
  /^(.+?)\s+lê\s+(?:bayık|pike|bayk|bıke|bice|vike)/i,
  /^(.+?)\s+le\s+(?:bayık|pike|bayk|bıke|bice|vike)/i,
  /^(.+?)\s+li\s+(?:bayık|pike|bayk|bice|vike)/i,

  // ══════════════════════════════════════
  // "pê bike" / "pe bike" VE YANLIŞ ALGILAMALARI
  // ══════════════════════════════════════

  /^(.+?)\s+pê\s+bike/i,
  /^(.+?)\s+pe\s+bike/i,
  /^(.+?)\s+be\s+bike/i,
  /^(.+?)\s+pê\s+(?:bayık|pike|bayk|bıke|bice|vike)/i,
  /^(.+?)\s+pe\s+(?:bayık|pike|bayk|bıke|bice|vike)/i,
  /^(.+?)\s+be\s+(?:bayık|pike|bayk|bice|vike)/i,

  // ══════════════════════════════════════
  // "bang lê/pê bike" KOMBİNASYONLARI
  // ══════════════════════════════════════

  /^(.+?)\s+bang\s+(?:lê|le|li|pê|pe|be)\s+bike/i,
  /^(.+?)\s+bang\s+(?:lê|le|li|pê|pe|be)\s+(?:bayık|pike|bayk|bice)/i,
  /^(.+?)\s+bank\s+(?:lê|le|li|pê|pe|be)\s+bike/i,
  /^(.+?)\s+bank\s+(?:lê|le|li|pê|pe|be)\s+(?:bayık|pike|bayk|bice)/i,

  // ══════════════════════════════════════
  // "xeber bide" VE YANLIŞ ALGILAMALARI
  // ══════════════════════════════════════

  /^(.+?)\s+xeber\s+bide/i,
  /^(.+?)\s+(?:heber|keber|şeber|seber|zeber|feber|geber|çeber|ceber)\s+bide/i,
  /^(.+?)\s+xeber\s+(?:vide|dide|pide|tide)/i,
  /^(.+?)\s+(?:heber|keber|şeber|seber)\s+(?:vide|dide|pide)/i,

  // xeber lê bide
  /^(.+?)\s+xeber\s+(?:lê|le|li)\s+bide/i,
  /^(.+?)\s+(?:heber|keber|şeber|seber)\s+(?:lê|le|li)\s+bide/i,

  // ══════════════════════════════════════
  // "biaxive" VE YANLIŞ ALGILAMALARI
  // ══════════════════════════════════════

  /^(?:pê|pe|be|pi|vi|di)\s+re\s+biaxive\s+(.+)/i,
  /^(?:pê|pe|be|pi|vi|di)\s+re\s+bi(?:a|ah|aş|as|az|af|ak)(?:x|h|ş|s|z|f|k)ive\s+(.+)/i,

  // ══════════════════════════════════════
  // "bide zanîn" VE YANLIŞ ALGILAMALARI
  // ══════════════════════════════════════

  /^(.+?)\s+bide\s+zanîn/i,
  /^(.+?)\s+bide\s+zanin/i,
  /^(.+?)\s+bide\s+(?:sanin|janin|hanin|yanin|zanın)/i,
  /^(.+?)\s+vide\s+(?:zanîn|zanin|sanin|janin)/i,

  // ══════════════════════════════════════
  // "têkilî bike" VE YANLIŞ ALGILAMALARI
  // ══════════════════════════════════════

  /^(.+?)\s+têkilî\s+bike/i,
  /^(.+?)\s+tekili\s+bike/i,
  /^(.+?)\s+(?:takilî|tikilî|takili|tikili|dekili|tekoli)\s+bike/i,
  /^(.+?)\s+têkilî\s+(?:bayık|pike|bayk|bice|vike)/i,
  /^(.+?)\s+tekili\s+(?:bayık|pike|bayk|bice|vike)/i,

  // ══════════════════════════════════════
  // DOLAYILI KOMUTLAR (ji bo min / ez dixwazim)
  // ══════════════════════════════════════

  // "ji bo min li X bi gara"
  /(?:ji|ci|zi|gi)\s+bo\s+min\s+li\s+(.+?)\s+bi\s*gara/i,
  /(?:ji|ci|zi|gi)\s+bo\s+min\s+li\s+(.+?)\s+sigara/i,
  /(?:ji|ci|zi|gi)\s+bo\s+min\s+li\s+(.+?)\s+bi\s*kara/i,

  // "ez dixwazim / dihvazim ku X bi gara"
  /ez\s+di(?:x|hv|şv|fv|h|ş)waz(?:im)?\s+ku\s+(.+?)\s+bi\s*gara/i,
  /ez\s+di(?:x|hv|şv|fv|h|ş)waz(?:im)?\s+ku\s+(.+?)\s+(?:sigara|bang\s+bike|bank\s+bike)/i,

  // ══════════════════════════════════════
  // İSİM SONEKI KALIPLARI
  // Kürtçe isimler ezafe/vakayla gelir: Ahmedê, Dîlanê, Wahabo, vb.
  // ══════════════════════════════════════

  // "-ê/-î/-a/-an/-o" son eki + komut
  /^(.+?)(?:ê|î|a|an|o|e)\s+bi\s*gara/i,
  /^(.+?)(?:ê|î|a|an|o|e)\s+sigara/i,
  /^(.+?)(?:ê|î|a|an|o|e)\s+bang\s+bike/i,
  /^(.+?)(?:ê|î|a|an|o|e)\s+bank\s+bike/i,
  /^(.+?)(?:ê|î|a|an|o|e)\s+telefon\s+bike/i,

  // "re" bağlacı ile: "X re bang bike"
  /(.+?)\s+re\s+bang\s+bike/i,
  /(.+?)\s+re\s+bank\s+bike/i,
  /(.+?)\s+re\s+bi\s*gara/i,
  /(.+?)\s+re\s+sigara/i,
  /(.+?)\s+re\s+telefon\s+bike/i,
];
// ────────────────────────────────────────────────────────────────
// ARAPÇA SABITLERI
// ────────────────────────────────────────────────────────────────

/**
 * ARAPÇA EK LİSTESİ
 * Arapça'da eklentiler (ضمائر متصلة - attached pronouns) ve tanecek harfler.
 * 
 * SIRALAMA KRİTİK: Uzun ekler önce gelir.
 * 
 * Örnekler:
 * - "محمدها" → "محمد" (onun Muhammed'i - dişil iyelik)
 * - "الاتصال" → "اتصال" (tanecek harf "ال")
 * - "بمحمد" → "محمد" (edatla birlikte - "ب")
 */
export const AR_SUFFIXES: Array<[RegExp, string]> = [
  // ── Çoğul zamirler (uzun) ──
  [/هما$/i, ''],       // onların ikisi (dual)
  [/كما$/i, ''],       // sizin ikiniz
  [/هم$/i, ''],        // onlar (eril çoğul)
  [/هن$/i, ''],        // onlar (dişil çoğul)
  [/كم$/i, ''],        // siz (çoğul)
  [/نا$/i, ''],        // biz

  // ── Tekil zamirler ──
  [/ها$/i, ''],        // onu (dişil) / onun
  [/ه$/i, ''],         // onu (eril) / onun
  [/ك$/i, ''],         // seni / senin
  [/ي$/i, ''],         // beni / benim (dikkat: bazı isimler 'ي' ile biter)

  // ── Tanecek harf "ال" (the) ──
  [/^ال/i, ''],        // "ال" öneki - "الرجل" → "رجل"
  
  // ── Edatlar (harfler) - ismin başında ──
  [/^ب/i, ''],         // "ب" (ile/tarafından) - "بمحمد" → "محمد"
  [/^ل/i, ''],         // "ل" (için) - "لمحمد" → "محمد"
  [/^ك/i, ''],         // "ك" (gibi) - "كمحمد" → "محمد"
  [/^ف/i, ''],         // "ف" (öyleyse/ve)
  [/^و/i, ''],         // "و" (ve)
  [/^في/i, ''],        // "في" (içinde)
  [/^من/i, ''],        // "من" (-dan/-den)
  [/^إلى/i, ''],       // "إلى" (-e/-a)
  [/^على/i, ''],       // "على" (üzerinde)
  [/^عن/i, ''],        // "عن" (hakkında)
];

/**
 * ARAPÇA STOP WORD LİSTESİ
 * 
 * Örnekler:
 * - "اتصل بمحمد" → "اتصل" (bağlan), "ب" (ile) kaldırılır
 * - "ابحث عن أحمد" → "ابحث" (ara), "عن" (hakkında) kaldırılır
 */
export const AR_STOP_WORDS = new Set<string>([
  // ── Temel arama/çağırma fiilleri ──
  'اتصل',              // ittasil (bağlan/ara)
  'اتصال',             // ittisaal (arama/bağlantı)
  'اتصلب',             // ittasil bi (ile bağlan)
  'ابحث',              // ibhas (ara/bul)
  'البحث',             // el-bahs (arama)
  'بحث',               // bahs (arama)
  'نادي',              // naadi (çağır)
  'نادي على',          // naadi 'ala (çağır)
  'اطلب',              // utlub (iste)
  'الطلب',             // et-talab (istek)
  'اتصل',              // ittasil (ara)
  'تواصل',             // tawaasul (iletişim kur)
  'كلم',               // kallim (konuş)
  'كلامي',             // kalaami (konuş - emir)
  'اتصل مع',           // ittasil ma'a (ile ara)
  'اتصل علي',          // ittasil 'ala (üzerine ara)

  // ── Telefon kelimeleri ──
  'الهاتف',            // el-haatif (telefon)
  'هاتف',              // haatif (telefon)
  'تليفون',            // tilifoon (telefon)
  'رقم',               // raqam (numara)
  'الرقم',             // er-raqam (numara)
  'مكالمة',            // mukaalam (arama)
  'المكالمة',          // el-mukaalama (arama)
  'واتساب',            // whatsapp
  'واتس',              // whats
  'رسالة',             // risaala (mesaj)
  'الرسالة',           // er-risaala (mesaj)

  // ── Edatlar/ilgeçler ──
  'ب',                 // bi (ile)
  'في',                // fii (içinde)
  'من',                // min (dan/den)
  'إلى',               // ilaa (e/a)
  'على',               // 'alaa (üzerinde)
  'عن',                // 'an (hakkında)
  'مع',                // ma'a (ile)
  'ل',                 // li (için)
  'لـ',                // li- (için)
  'إلي',               // ilayy (bana)
  'معي',               // ma'ii (benimle)
  'عند',               // 'ind (yanında)
  'لدى',               // ladaa (nezdinde)
  'بين',               // bayna (arasında)
  'قبل',               // qabla (önce)
  'بعد',               // ba'da (sonra)

  // ── Nezaket ifadeleri ──
  'من فضلك',           // min fadlik (lütfen)
  'لو سمحت',           // law samaht (izin verirsen)
  'رجاء',              // rajaa' (rica)
  'الرجاء',            // er-rajaa' (rica)
  'أرجو',              // arjuu (rica ederim)
  'أرجوك',             // arjuuk (senden rica ederim)
  'ممكن',              // mumkin (mümkün)
  'هل ممكن',           // hal mumkin (mümkün mü)
  'إذا ممكن',          // izaa mumkin (eğer mümkünse)
  'ياريت',             // yaariit (keşke)
  'لطفا',              // lutfan (lütfen)
  'بالله',             // billah (Allah rızası için)
  'بالله عليك',        // billah 'alayk (Allah aşkına)
  'تكرم',              // takraam (nazik ol)
  'تكرما',             // takarruman (nazikçe)
  'تفضل',              // tafaddal (buyur)

  // ── İstek fiilleri ──
  'أريد',              // uriid (istiyorum)
  'أريد أن',           // uriid an (istiyorum ki)
  'أرغب',              // arghab (arzuluyorum)
  'أحتاج',             // ahtaaj (ihtiyacım var)
  'محتاج',             // muhtaaj (ihtiyacım var)
  'بدي',               // biddi (istiyorum - lehçe)
  'عايز',              // 'aayiz (istiyorum - Mısır)
  'ودي',               // widdi (istiyorum - Körfez)
  'أبغى',              // abghaa (istiyorum - Körfez)

  // ── Şahıs zamirleri ──
  'أنا',               // anaa (ben)
  'أنت',               // anta (sen - eril)
  'أنتي',              // anti (sen - dişil)
  'أنتِ',              // anti (sen - dişil)
  'هو',                // huwa (o - eril)
  'هي',                // hiya (o - dişil)
  'نحن',               // nahnu (biz)
  'أنتم',              // antum (siz)
  'هم',                // hum (onlar - eril)
  'هن',                // hunna (onlar - dişil)

  // ── İşaret zamirleri ──
  'هذا',               // haazaa (bu - eril)
  'هذه',               // haazihi (bu - dişil)
  'ذلك',               // zaalika (şu - eril)
  'تلك',               // tilka (şu - dişil)
  'هؤلاء',             // haa'ulaa' (bunlar)
  'أولئك',             // ulaa'ika (şunlar)

  // ── Bağlaçlar ──
  'و',                 // wa (ve)
  'أو',                // aw (veya)
  'لكن',               // laakin (ama)
  'لكن',               // laakin (fakat)
  'أما',               // ammaa (ama)
  'إما',               // immaa (ya...ya)
  'ثم',                // summa (sonra)
  'ف',                 // fa (öyleyse)
  'إذا',               // izaa (eğer)
  'إذن',               // izan (öyleyse)
  'لأن',               // li'anna (çünkü)
  'لذلك',              // lizaalika (bu yüzden)

  // ── Soru kelimeleri ──
  'من',                // man (kim) - dikkat: edat ile aynı yazılış
  'ما',                // maa (ne)
  'ماذا',              // maazaa (ne)
  'متى',               // mataa (ne zaman)
  'أين',               // ayna (nerede)
  'كيف',               // kayfa (nasıl)
  'لماذا',             // limaazaa (neden)
  'كم',                // kam (kaç)
  'أي',                // ayy (hangi)
  'هل',                // hal (soru edatı)

  // ── Zaman zarfları ──
  'الآن',              // el-aan (şimdi)
  'حالا',              // haalan (hemen)
  'فورا',              // fawran (hemen)
  'بسرعة',             // bisur'a (hızlıca)
  'اليوم',             // el-yawm (bugün)
  'غدا',               // ghadan (yarın)
  'أمس',               // ams (dün)
  'بعد قليل',          // ba'da qaliil (birazdan)
  'قبل قليل',          // qabla qaliil (biraz önce)

  // ── Onay/ret ──
  'نعم',               // na'am (evet)
  'أيوة',              // aywa (evet - lehçe)
  'آه',                // aah (evet)
  'لا',                // laa (hayır)
  'أبدا',              // abadan (asla)
  'طبعا',              // tab'an (tabii)
  'حسنا',              // hasanan (tamam)
  'تمام',              // tamaam (tamam)
  'ماشي',              // maashii (oldu)
  'موافق',             // muwaafiq (anlaştık)

  // ── Selamlama ──
  'السلام عليكم',      // es-salaam 'alaykum (selamün aleyküm)
  'مرحبا',             // marhaban (merhaba)
  'أهلا',              // ahlan (merhaba)
  'صباح الخير',        // sabaah el-khayr (günaydın)
  'مساء الخير',        // masaa' el-khayr (iyi akşamlar)
  'كيف حالك',          // kayfa haaluka (nasılsın)
  'شلونك',             // shlonak (nasılsın - Irak)
  'كيفك',              // keefak (nasılsın - Şam)
  'إزيك',              // izzayyak (nasılsın - Mısır)
  'ألو',               // alo (alo)

  // ── Çeşitli fiiller ──
  'افعل',              // if'al (yap)
  'قل',                // qul (söyle)
  'أعطي',              // a'tii (ver)
  'خذ',                // khuz (al)
  'تعال',              // ta'aal (gel)
  'اذهب',              // izhab (git)
  'انتظر',             // intazir (bekle)
  'استمع',             // istami' (dinle)
  'اسمع',              // isma' (dinle/duy)
  'انظر',              // unzur (bak)
  'شوف',               // shuuf (bak - lehçe)
]);

/**
 * ARAPÇA SELAMLAMA KELİMELERİ
 */
export const AR_GREETING_WORDS = new Set<string>([
  'السلام عليكم',
  'مرحبا',
  'أهلا',
  'صباح الخير',
  'مساء الخير',
  'كيف حالك',
  'شلونك',
  'كيفك',
  'إزيك',
  'ألو',
  'هلا',
  'مساء النور',
  'صباح النور',
]);

/**
 * ARAPÇA REGEX KOMUT KALIPLARI
 * 
 * Örnekler:
 * - "اتصل بمحمد" → grup: "محمد"
 * - "نادي على أحمد" → grup: "أحمد"
 * - "ابحث عن فاطمة" → grup: "فاطمة"
 */
export const AR_COMMAND_PATTERNS: RegExp[] = [
  // "اتصل بـX" / "اتصل X"
  /اتصل\s+ب?(.+)/i,
  // "نادي على X" / "نادي X"
  /نادي\s+(?:على\s+)?(.+)/i,
  // "ابحث عن X"
  /ابحث\s+عن\s+(.+)/i,
  // "كلم X"
  /كلم\s+(.+)/i,
  // "تواصل مع X"
  /تواصل\s+مع\s+(.+)/i,
  // "اطلب X"
  /اطلب\s+(.+)/i,
  // "X اتصل" (reverse order - less common)
  /(.+)\s+اتصل/i,
];

// ────────────────────────────────────────────────────────────────
// DİL-SPESIFIK SABITLERE KOLAY ERİŞİM
// ────────────────────────────────────────────────────────────────

export interface LanguageConstants {
  suffixes: Array<[RegExp, string]>;
  stopWords: Set<string>;
  greetingWords: Set<string>;
  commandPatterns: RegExp[];
  misheardCorrections?: Record<string, string>;
}

export function getLanguageConstants(lang: SupportedLanguage): LanguageConstants {
  switch (lang) {
    case 'tr':
      return {
        suffixes: TR_SUFFIXES,
        stopWords: TR_STOP_WORDS,
        greetingWords: TR_GREETING_WORDS,
        commandPatterns: TR_COMMAND_PATTERNS,
      };
    case 'ku':
      return {
        suffixes: KU_SUFFIXES,
        stopWords: KU_STOP_WORDS,
        greetingWords: KU_GREETING_WORDS,
        commandPatterns: KU_COMMAND_PATTERNS,
        misheardCorrections: KU_MISHEARD_CORRECTIONS,
      };
    case 'ar':
      return {
        suffixes: AR_SUFFIXES,
        stopWords: AR_STOP_WORDS,
        greetingWords: AR_GREETING_WORDS,
        commandPatterns: AR_COMMAND_PATTERNS,
      };
    default:
      return {
        suffixes: TR_SUFFIXES,
        stopWords: TR_STOP_WORDS,
        greetingWords: TR_GREETING_WORDS,
        commandPatterns: TR_COMMAND_PATTERNS,
      };
  }
}

// ────────────────────────────────────────────────────────────────
// YARDIMCI SABITLER
// ────────────────────────────────────────────────────────────────

/** Fuzzy arama eşiği — düşüldükçe daha katı eşleşme */
export const FUSE_THRESHOLD = 0.45;

/** Güven skoru sınırları */
export const CONFIDENCE = {
  HIGH: 0.7,    // direkt ara
  MEDIUM: 0.4,  // onay sor
  LOW: 0.0,     // bulunamadı
} as const;

/** Çoklu aday için maksimum fark */
export const MULTI_CANDIDATE_DIFF = 0.1;

/** Maksimum gösterilecek aday sayısı */
export const MAX_CANDIDATES = 3;

/** Minimum geçerli isim uzunluğu (karakter sayısı) */
export const MIN_NAME_LENGTH = 2;

// ────────────────────────────────────────────────────────────────
// YARDIMCI FONKSİYONLAR
// ────────────────────────────────────────────────────────────────

/**
 * Kürtçe transcript'i düzeltir (yanlış algılamalar için)
 * 
 * Türkçe STT Kürtçe desteklemediği için yanlış algılar.
 * Bu fonksiyon "mikail sigara" → "mikail bi gara" gibi düzeltmeler yapar.
 * 
 * @param transcript - Ham transcript (STT'den gelen)
 * @returns Düzeltilmiş transcript
 * 
 * @example
 * correctKurdishMisheard("mikail sigara")
 * // Returns: "mikail bi gara"
 * 
 * correctKurdishMisheard("dilan bank bike")
 * // Returns: "dilan bang bike"
 */
export function correctKurdishMisheard(transcript: string): string {
  let corrected = transcript.toLowerCase();
  
  // Kelime bazında düzeltme yap
  for (const [wrong, correct] of Object.entries(KU_MISHEARD_CORRECTIONS)) {
    // Tam kelime eşleşmesi (word boundary ile)
    const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
    corrected = corrected.replace(regex, correct);
  }
  
  return corrected;
}