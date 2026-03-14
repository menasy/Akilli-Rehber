// ================================================================
// nlpConstants.ts
// Sesli rehber uygulaması — Çok Dilli NLP Sabitleri
// Türkçe, Kürtçe (Kurmancî) ve Arapça tam kapsamlı listeler
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
 * KÜRTÇE STOP WORD LİSTESİ (Kurmancî)
 * 
 * Örnekler:
 * - "Wahapko bi gara" → "bi gara" kaldırılır
 * - "ji kerema xwe Dîlanê bang bike" → "ji kerema xwe", "bang bike" kaldırılır
 */
export const KU_STOP_WORDS = new Set<string>([
  // ── Temel "ara" fiilleri ──
  'bi gara',
  'bigara',
  'gara',
  'bang bike',
  'bangbike',
  'bang',
  'bike',
  'telefon bike',
  'telefonbike',
  'têkilî bike',
  'têkilîbike',
  'têkilî',
  'lê bike',
  'pê bike',
  'lêbike',
  'pêbike',
  'bide',
  'bidê',
  'bang lê bike',
  'bang pê bike',
  'xeber bide',
  'xeberbide',
  'biaxive',
  'axive',
  'biaxivim',
  'axivim',
  'pê re biaxive',
  'pêrebiaxive',

  // ── Nezaket ifadeleri ──
  'ji kerema xwe',
  'jikeremaxwe',
  'kerem ke',
  'keremke',
  'ji kerema',
  'jikerema',
  'xwedêro',
  'xwedê',
  'bila',
  'lê',
  'ka',
  'rabe',
  'here',
  'bê',
  'werin',
  'herin',
  'rêk bixin',
  'dixwazim',
  'dixwazim ku',
  'daxwaz dikim',
  'daxwaz',
  'dikim',
  'ez dixwazim',
  'min dixwaze',
  'min jê re',
  'ji min re',
  'jî',

  // ── Şahıs zamirleri ──
  'ez',
  'tu',
  'ew',
  'em',
  'hûn',
  'hun',
  'hin',

  // ── Oblique hâl zamirleri ──
  'min',
  'te',
  'wî',
  'wi',
  'wê',
  'we',
  'me',
  'wan',

  // ── Edat/ilgeç ──
  'ji',
  'bo',
  'ji bo',
  'jibo',
  'li',
  'bi',
  'ra',
  're',
  've',
  'de',
  'da',
  'ser',
  'bin',
  'pêş',
  'pes',
  'paş',
  'pas',
  'nav',
  'nava',
  'navbera',
  'tevî',
  'tevi',
  'hertî',
  'herî',
  'heri',
  'para',
  'berî',
  'beri',
  'piştî',
  'pisti',
  'dema',
  'dema ku',
  'çawa ku',
  'cawa ku',
  'ku',

  // ── Bağlaçlar ──
  'û',
  'u',
  'an',
  'yan',
  'lê',
  'le',
  'belê',
  'bele',
  'ne',
  'ne... ne jî',
  'hem',
  'jî',
  'ji',
  'jixwe',
  'lewre',
  'ji ber',
  'jiber',
  'çimkî',
  'cimki',
  'eger',
  'heke',
  'gava',
  'dema',

  // ── Soru kelimeleri ──
  'kî',
  'ki',
  'çi',
  'ci',
  'kû',
  'ku',
  'kengê',
  'kenge',
  'çawa',
  'cawa',
  'çiqas',
  'ciqas',
  'çend',
  'cend',

  // ── Zaman zarfları ──
  'niha',
  'naha',
  'nûha',
  'êdî',
  'edi',
  'hema',
  'heman',
  'zû',
  'zu',
  'dereng',
  'piçek',
  'piçekî',
  'carekê',
  'cara',
  'îcar',
  'icar',
  'îcarê',
  'paşê',
  'pase',
  'dûre',
  'dure',
  'berê',
  'bere',

  // ── Onay/ret ──
  'erê',
  'ere',
  'belê',
  'bele',
  'baş e',
  'basê',
  'bas',
  'baş',
  'xweşe',
  'xwes',
  'na',
  'nake',
  'nabin',

  // ── Selamlama ──
  'nasai',
  'sayid',
  'ka',
  'silaw',
  'merheba',
  'xêr be',
  'xer be',
  'rojbaş',
  'robas',
  'hey',
  'alo',
  'halo',
  'eywallah',
  'destxweş',

  // ── Çeşitli fiil kökleri ──
  'bêje',
  'beje',
  'bide zanîn',
  'bidezanin',
  'rabe',
  'here',
  'bê',
  'were',
  'bigire',
  'biparêze',
  'bixwaze',
  'bixwazim',
  'bixwazin',
  'berde',
  'bihêle',
  'bihele',
  'bimîne',
  'bimine',
]);

/**
 * KÜRTÇE SELAMLAMA KELİMELERİ
 */
export const KU_GREETING_WORDS = new Set<string>([
  'silaw',
  'merheba',
  'xêr be',
  'xer be',
  'rojbaş',
  'robas',
  'eyvallah',
  'destxweş',
  'baş e',
  'xweş e',
  'choni',
  'çawanî',
  'çoni',
  'nasai',
  'sayid',
]);

/**
 * KÜRTÇE REGEX KOMUT KALIPLARI
 * 
 * Örnekler:
 * - "Wahap bi gara" → grup: "Wahap"
 * - "Li Dîlanê bang bike" → grup: "Dîlanê"
 */
export const KU_COMMAND_PATTERNS: RegExp[] = [
  // "Li X bi gara"
  /^li\s+(.+?)\s+bi\s*gara/i,
  // "X bi gara"
  /^(.+?)\s+bi\s*gara/i,
  // "X bang bike"
  /^(.+?)\s+bang\s+bike/i,
  // "Li X bang bike"
  /^li\s+(.+?)\s+bang\s+bike/i,
  // "X telefon bike"
  /^(.+?)\s+telefon\s+bike/i,
  // "ji bo min li X bi gara"
  /ji\s+bo\s+min\s+li\s+(.+?)\s+bi\s*gara/i,
  // "X re bang bike"
  /(.+?)\s+re\s+bang\s+bike/i,
  // "X ko bi gara" / "Xko bi gara"
  /^(.+?)(?:ko|o|a|ê|î)?\s+bi\s*gara/i,
  // "X lê bike"
  /^(.+?)\s+lê\s+bike/i,
  // "X pê bike"
  /^(.+?)\s+pê\s+bike/i,
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
// DİL ALGILAMA İŞARETLEYİCİLERİ
// ────────────────────────────────────────────────────────────────

/**
 * NOT: React Voice zaten dil bilgisi sağlıyorsa bu işaretleyiciler
 * gereksiz olabilir. Ancak fallback veya güvenlik kontrolü için tutulabilir.
 */

export const TR_LANGUAGE_MARKERS = new Set<string>([
  'ara',
  'arar',
  'ararmısın',
  'ararmisin',
  'lütfen',
  'lutfen',
  'istiyorum',
  'senden',
  'benden',
  'zahmet',
  'çağır',
  'telefon et',
  'telefon',
  'mısın',
  'misin',
  'tamam',
  'acaba',
  'bana',
  'beni',
  'şunu',
  'bunu',
  'onu',
]);

export const KU_LANGUAGE_MARKERS = new Set<string>([
  'bi gara',
  'bigara',
  'bang bike',
  'bang',
  'bike',
  'ji kerema xwe',
  'kerem ke',
  'dixwazim',
  'ji',
  'bo',
  'li',
  'bi',
  'û',
  'gara',
  'lê',
  'pê',
  'erê',
  'silaw',
  'merheba',
  'belê',
  'niha',
  'hema',
]);

export const AR_LANGUAGE_MARKERS = new Set<string>([
  'اتصل',
  'نادي',
  'ابحث',
  'من فضلك',
  'لو سمحت',
  'أريد',
  'بدي',
  'عايز',
  'ب',
  'في',
  'من',
  'إلى',
  'على',
  'الهاتف',
  'هاتف',
  'مرحبا',
  'أهلا',
]);

// ────────────────────────────────────────────────────────────────
// DİL-SPESIFIK SABITLERE KOLAY ERİŞİM
// ────────────────────────────────────────────────────────────────

/**
 * Dil bazında sabitleri toplu olarak almak için yardımcı fonksiyon
 */
export interface LanguageConstants {
  suffixes: Array<[RegExp, string]>;
  stopWords: Set<string>;
  greetingWords: Set<string>;
  commandPatterns: RegExp[];
  languageMarkers: Set<string>;
}

export function getLanguageConstants(lang: SupportedLanguage): LanguageConstants {
  switch (lang) {
    case 'tr':
      return {
        suffixes: TR_SUFFIXES,
        stopWords: TR_STOP_WORDS,
        greetingWords: TR_GREETING_WORDS,
        commandPatterns: TR_COMMAND_PATTERNS,
        languageMarkers: TR_LANGUAGE_MARKERS,
      };
    case 'ku':
      return {
        suffixes: KU_SUFFIXES,
        stopWords: KU_STOP_WORDS,
        greetingWords: KU_GREETING_WORDS,
        commandPatterns: KU_COMMAND_PATTERNS,
        languageMarkers: KU_LANGUAGE_MARKERS,
      };
    case 'ar':
      return {
        suffixes: AR_SUFFIXES,
        stopWords: AR_STOP_WORDS,
        greetingWords: AR_GREETING_WORDS,
        commandPatterns: AR_COMMAND_PATTERNS,
        languageMarkers: AR_LANGUAGE_MARKERS,
      };
    default:
      // Fallback to Turkish
      return {
        suffixes: TR_SUFFIXES,
        stopWords: TR_STOP_WORDS,
        greetingWords: TR_GREETING_WORDS,
        commandPatterns: TR_COMMAND_PATTERNS,
        languageMarkers: TR_LANGUAGE_MARKERS,
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