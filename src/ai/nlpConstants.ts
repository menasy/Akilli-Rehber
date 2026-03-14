// ================================================================
// nlpConstants.ts
// Sesli rehber uygulaması — NLP sabitleri
// Türkçe & Kürtçe (Kurmancî) tam kapsamlı listeler
// ================================================================

// ────────────────────────────────────────────────────────────────
// 1. FONETİK KARAKTER DÖNÜŞÜM HARİTASI
//    Kürtçe Latin alfabesindeki karakterleri Türkçe karşılıklarına
//    dönüştürür. Rehberde Türkçe kayıtlı isimlerle eşleştirmek için.
// ────────────────────────────────────────────────────────────────

export const PHONETIC_CHAR_MAP: Record<string, string> = {
  // ── Temel harf dönüşümleri ──
  w: "v", // Wahap → Vahap, Welat → Velat
  q: "k", // Qemal → Kemal, Qamişlo → Kamişlo
  x: "h", // Xasan → Hasan, Xelîl → Halil

  // ── Uzun ünlüler (Kürtçe'de uzunluk fonemik, Türkçe'de yok) ──
  ê: "e", // Bêrîvan → Berivan, Hêvî → Hevi
  î: "i", // Sîpan → Sipan, Pelîn → Pelin
  û: "u", // Nûdem → Nudem, Rûken → Ruken

  // ── Özel/diyakritik karakterler ──
  "'": "", // Ayin işareti kaldır  (Ma'sum → Masum)
  "\u2019": "", // Sağ tek tırnak kaldır
  "\u2018": "", // Sol tek tırnak kaldır
  "\u02bc": "", // Modifier letter apostrophe kaldır
};

// ────────────────────────────────────────────────────────────────
// 2. FONETİK KALIP (HECE/KELİME) DÖNÜŞÜM LİSTESİ
//    Sıra kritik: uzun kalıplar önce gelir.
//    [regex, yerine_koy]
// ────────────────────────────────────────────────────────────────

export const PHONETIC_PATTERN_MAP: Array<[RegExp, string]> = [
  // ── Yaygın Kürtçe isim → Türkçe karşılıkları ──
  [/\bmehemed\b/gi, "mehmet"],
  [/\bmihemed\b/gi, "mehmet"],
  [/\bmuhemed\b/gi, "muhammed"],
  [/\behmad\b/gi, "ahmet"],
  [/\behmed\b/gi, "ahmet"],
  [/\bexmed\b/gi, "ahmet"],
  [/\belî\b/gi, "ali"],
  [/\beli\b/gi, "ali"],
  [/\bhesen\b/gi, "hasan"],
  [/\bhesên\b/gi, "hasan"],
  [/\bhusên\b/gi, "hüseyin"],
  [/\bhusein\b/gi, "hüseyin"],
  [/\bhiseyn\b/gi, "hüseyin"],
  [/\bxelîl\b/gi, "halil"],
  [/\bxelil\b/gi, "halil"],
  [/\bxalid\b/gi, "halid"],
  [/\bxeyrî\b/gi, "hayri"],
  [/\bxeyri\b/gi, "hayri"],
  [/\bebdullah\b/gi, "abdullah"],
  [/\bebdulrehman\b/gi, "abdurrahman"],
  [/\bebdulrexman\b/gi, "abdurrahman"],
  [/\bebdulqadir\b/gi, "abdülkadir"],
  [/\bebdulkadir\b/gi, "abdülkadir"],
  [/\bîbrahîm\b/gi, "ibrahim"],
  [/\bibrahîm\b/gi, "ibrahim"],
  [/\bîbrahim\b/gi, "ibrahim"],
  [/\bîsmaîl\b/gi, "ismail"],
  [/\bismaîl\b/gi, "ismail"],
  [/\bîsmail\b/gi, "ismail"],
  [/\bdawud\b/gi, "davut"],
  [/\bdawûd\b/gi, "davut"],
  [/\bdavud\b/gi, "davut"],
  [/\byûsif\b/gi, "yusuf"],
  [/\byusif\b/gi, "yusuf"],
  [/\byûsuf\b/gi, "yusuf"],
  [/\bmistefa\b/gi, "mustafa"],
  [/\bmistafa\b/gi, "mustafa"],
  [/\bsilêman\b/gi, "süleyman"],
  [/\bsileman\b/gi, "süleyman"],
  [/\bsuleyman\b/gi, "süleyman"],
  [/\bomer\b/gi, "ömer"],
  [/\bomerê\b/gi, "ömer"],
  [/\bxezal\b/gi, "hezal"],
  [/\bxatûn\b/gi, "hatun"],
  [/\bxatun\b/gi, "hatun"],
  [/\bgulistan\b/gi, "gülistan"],
  [/\bnewroz\b/gi, "nevruz"],
  [/\bdîlan\b/gi, "dilan"],
  [/\bdilan\b/gi, "dilan"],
  [/\bsînem\b/gi, "sinem"],
  [/\bsinem\b/gi, "sinem"],
  [/\bpelîn\b/gi, "pelin"],
  [/\bpelin\b/gi, "pelin"],
  [/\brûken\b/gi, "rüken"],
  [/\bruken\b/gi, "rüken"],
  [/\bberîvan\b/gi, "berivan"],
  [/\bberivan\b/gi, "berivan"],
  [/\bzîlan\b/gi, "zilan"],
  [/\bzilan\b/gi, "zilan"],
  [/\bşêrko\b/gi, "şerko"],
  [/\bserko\b/gi, "şerko"],
  [/\bhogir\b/gi, "höger"],
  [/\bjiyan\b/gi, "jihan"],
  [/\barjîn\b/gi, "arjin"],
  [/\bdêrsim\b/gi, "dersim"],
  [/\bfirat\b/gi, "fırat"],
  [/\bzagros\b/gi, "zagros"],

  // ── Genel ses dönüşüm kalıpları ──
  [/wh/gi, "v"], // wh- → v (Whatsapp tarzı telaffuzlar)
  [/([bcçdfgğhjklmnprsştvyz])h/gi, "$1"], // ortadaki gereksiz h
];

// ────────────────────────────────────────────────────────────────
// 3. TÜRKÇE EK LİSTESİ
//    İsmin sonundaki çekim eklerini temizlemek için.
//    SIRALAMA KRİTİK: uzun ekler önce gelir.
//    Yalnızca SON KELİMEYE uygulanır.
//    Sonuç 2 karakterden kısa olursa ek uygulanmaz.
// ────────────────────────────────────────────────────────────────

export const TR_SUFFIXES: Array<[RegExp, string]> = [
  // ── 5+ karakter ekler ──
  [/nüncü$/i, ""], // üçüncü kişi iyelik + -ncü
  [/ndeki$/i, ""], // -ndaki/-ndeki
  [/daki$/i, ""], // Ahmet'taki
  [/deki$/i, ""], // Ahmet'teki

  // ── 4 karakter ekler ──
  [/yını$/i, ""], // -yını (belirtme + iyelik karışık)
  [/yine$/i, ""], // yönelme kaynaştırmalı
  [/yını$/i, ""],
  [/ndan$/i, ""], // ayrılma, sesli bitişli
  [/nden$/i, ""], // ayrılma, sesli bitişli
  [/ları$/i, ""], // çoğul + belirtme
  [/leri$/i, ""], // çoğul + belirtme

  // ── 3 karakter ekler ──
  [/dan$/i, ""], // Ahmet'ten → Ahmet (ayrılma)
  [/den$/i, ""], // Mehmet'ten
  [/tan$/i, ""], // Murat'tan
  [/ten$/i, ""], // Mehmet'ten
  [/nın$/i, ""], // Ahmet'in → Ahmet (iyelik, sesli sonu)
  [/nin$/i, ""],
  [/nun$/i, ""],
  [/nün$/i, ""],
  [/yla$/i, ""], // birliktelik, sesli sonu
  [/yle$/i, ""],
  [/yla$/i, ""],
  [/yle$/i, ""],
  [/yı$/i, ""], // belirtme kaynaştırmalı
  [/yi$/i, ""],
  [/yu$/i, ""],
  [/yü$/i, ""],
  [/lar$/i, ""], // çoğul
  [/ler$/i, ""],

  // ── 2 karakter ekler ──
  [/ın$/i, ""], // iyelik (Vahap'ın)
  [/in$/i, ""],
  [/un$/i, ""],
  [/ün$/i, ""],
  [/la$/i, ""], // birliktelik
  [/le$/i, ""],
  [/ya$/i, ""], // yönelme kaynaştırmalı (Fatma'ya)
  [/ye$/i, ""],

  // ── 1 karakter ekler (en dikkatli bunlar) ──
  [/ı$/i, ""], // belirtme (Vahap'ı)
  [/i$/i, ""], // belirtme (Mehmet'i)
  [/u$/i, ""], // belirtme (Murat'u) -- 'u' ile biten isimlere dikkat
  [/ü$/i, ""], // belirtme (Ümit'ü)
  [/a$/i, ""], // yönelme (Vahap'a) -- 'a' ile biten isimlere dikkat
  [/e$/i, ""], // yönelme (Mehmet'e) -- 'e' ile biten isimlere dikkat
];

// ────────────────────────────────────────────────────────────────
// 4. KÜRTÇE EK LİSTESİ (Kurmancî)
//    İsmin sonundaki Kürtçe çekim/hitap eklerini temizler.
//    SIRALAMA KRİTİK: uzun ekler önce gelir.
//    Yalnızca SON KELİMEYE uygulanır.
// ────────────────────────────────────────────────────────────────

export const KU_SUFFIXES: Array<[RegExp, string]> = [
  // ── Hitap/seslenme ekleri (en yaygın sesli komutlarda) ──
  [/ko$/i, ""], // Wahapko → Wahap (sevgi hitabı)
  [/kê$/i, ""], // varyant
  [/bo$/i, ""], // Wahapbo → Wahap (bazı diyalektler)

  // ── Tanımlık ekler ──
  [/êvan$/i, ""], // çoğul tanımlık
  [/evan$/i, ""],
  [/ên$/i, ""], // çoğul tanımlık eril
  [/an$/i, ""], // çoğul mutlak
  [/ê$/i, ""], // tekil tanımlık eril / yönelme
  [/î$/i, ""], // tanımlık / iyelik belirteci
  [/iyê$/i, ""], // -iyê bileşik
  [/iya$/i, ""], // dişil bileşik

  // ── Yalın hâl dişil ──
  [/a$/i, ""], // Berîvana → Berîvan (dikkatli: isim 'a' ile bitebilir)

  // ── Hitap 'o' ──
  [/o$/i, ""], // Wahabo → Wahap (dikkatli: minimum 4 kar kalsın)
];

// ────────────────────────────────────────────────────────────────
// 5. TÜRKÇE STOP WORD LİSTESİ
//    "Arama" komutlarında geçen anlamsız/yardımcı kelimeler.
//    Set kullanılır → O(1) arama.
// ────────────────────────────────────────────────────────────────

export const TR_STOP_WORDS = new Set<string>([
  // ── Temel fiiller ──
  "ara",
  "arar",
  "arıyor",
  "arıyorum",
  "ararsın",
  "araması",
  "aramak",
  "arama",
  "araman",
  "aramanı",
  "armani",
  "armanı",
  "arıyabilir",
  "arayabilir",
  "arayabilirsin",
  "arayabilirmisin",
  "ararmisin",
  "ararmısın",
  "arar mısın",
  "arar misin",
  "ararsın",
  "arasın",
  "arasana",
  "çağır",
  "çağırır",
  "çağırıyor",
  "çağırıyorum",
  "çağırabilir",
  "çağırabilirsin",
  "çağırabilirmisin",
  "çağırır mısın",
  "çağırır misin",
  "çağırırmısın",
  "çağırırsın",
  "çağırsın",
  "çağırsana",
  "bul",
  "bulur",
  "buluyor",
  "buluyorum",
  "bulabilir",
  "bağlan",
  "bağlat",
  "bağlantı",
  "ulaş",
  "ulaşır",
  "ulaşabilir",
  "ulaşabilirsin",

  // ── Telefon kelimeleri ──
  "telefon",
  "telefonla",
  "telefonu",
  "telefonda",
  "tel",
  "numara",
  "numarayı",
  "numarası",
  "numarasını",
  "hat",
  "hat",
  "görüntülü",
  "görüntülü ara",
  "sesli",
  "sesli ara",
  "whatsapp",
  "watsupp",
  "watsap",
  "mesaj",
  "mesaj at",

  // ── Nezaket / kibarlık ifadeleri ──
  "lütfen",
  "lutfen",
  "rica",
  "ricaederim",
  "rica ederim",
  "rica ediyorum",
  "ricaediyorum",
  "zahmet",
  "bi zahmet",
  "bir zahmet",
  "bizahmet",
  "birzahmet",
  "zahmetolmasa",
  "zahmet olmasa",
  "zahmet olmazsa",
  "eğer",
  "eger",
  "mümkünse",
  "mumkunse",
  "olursa",
  "olur mu",
  "olurmu",
  "acaba",
  "bakalım",
  "bakar mısın",
  "bakar misin",
  "bakabilir misin",
  "haydi",
  "hadi",
  "hemen",
  "çabuk",
  "cabuk",
  "şimdi",
  "simdi",
  "artık",
  "artik",
  "biraz",
  "birazdan",
  "az önce",
  "şu an",
  "şuan",

  // ── İstek / talep fiilleri ──
  "istiyorum",
  "istiyorm",
  "istiyom",
  "istiyor",
  "istiyoruz",
  "ister",
  "ister misin",
  "istermisin",
  "istiyorum ki",
  "istiyorum da",
  "istiyorum ama",
  "istiyorum senden",
  "istedim",
  "istesem",
  "istesene",
  "lazım",
  "lazim",
  "gerek",
  "gerekiyor",
  "gerekli",
  "lazım ki",
  "lazım da",

  // ── Edilgen/yardımcı fiil ekleri ──
  "ediyorum",
  "ediyorm",
  "ediyom",
  "eder",
  "eder misin",
  "edermisin",
  "edin",
  "edelim",
  "edebilir",
  "edebilirsin",
  "edebilirmisin",
  "ediyor",
  "edebilir misin",
  "etmek",
  "etmeli",
  "etmeni",
  "etmeni istiyorum",
  "et",

  // ── Şahıs zamirleri ──
  "ben",
  "sen",
  "biz",
  "siz",
  "bana",
  "sana",
  "beni",
  "seni",
  "benden",
  "senden",
  "bizden",
  "sizden",
  "bize",
  "size",

  // ── Nesne zamirleri ──
  "onu",
  "şunu",
  "bunu",
  "onları",
  "şunları",
  "bunları",
  "ondan",
  "şundan",
  "bundan",
  "ona",
  "şuna",
  "buna",

  // ── Determiners / bağlaçlar ──
  "bir",
  "bu",
  "şu",
  "o",
  "bir",
  "de",
  "da",
  "ile",
  "ve",
  "için",
  "ama",
  "fakat",
  "lakin",
  "ki",
  "yani",
  "şöyle",
  "böyle",
  "öyle",
  "hem",
  "ya",
  "ya da",

  // ── Soru ekleri / parçacıklar ──
  "mı",
  "mi",
  "mu",
  "mü",
  "mısın",
  "misin",
  "musun",
  "müsün",
  "mısınız",
  "misiniz",

  // ── Selamlama / giriş kelimeleri ──
  "merhaba",
  "selam",
  "hey",
  "alo",
  "bi dakika",
  "bir dakika",
  "dur",
  "tamam",
  "peki",
  "iyi",
  "güzel",
  "oldu",
  "olsun",

  // ── Yön / zaman zarfları ──
  "hemen",
  "şimdi",
  "biraz",
  "şu an",
  "en kısa sürede",
  "acilen",
  "buradan",
  "oradan",
  "ileri",
  "geri",

  // ── Çeşitli filler / yardımcılar ──
  "yap",
  "yapabilir",
  "yapabilirsin",
  "yapabilir misin",
  "yapıver",
  "yapıverin",
  "söyle",
  "söyler misin",
  "söylesene",
  "ver",
  "verir misin",
  "veribilir misin",
  "getir",
  "getir misin",
  "getiribilir misin",
  "konuş",
  "bağla",
  "bağlayabilir misin",
  "açabilir misin",

  // ── Vurgu / tamamlayıcı ──
  "ne olur",
  "ne olurda",
  "iyi mi",
  "değil mi",
  "hem de",
  "zaten",
  "bile",
  "dahi",
  "sadece",
  "yalnızca",
  "hep",
  "hiç",
  "çok",
  "az",
  "daha",
  "en",
  "kadar",
  "gibi",
  "sanki",
]);

// ────────────────────────────────────────────────────────────────
// 6. KÜRTÇE STOP WORD LİSTESİ (Kurmancî)
// ────────────────────────────────────────────────────────────────

export const KU_STOP_WORDS = new Set<string>([
  // ── Temel "ara" fiilleri ──
  "bi gara",
  "bigara",
  "gara",
  "bang bike",
  "bangbike",
  "bang",
  "bike",
  "telefon bike",
  "telefonbike",
  "têkilî bike",
  "têkilîbike",
  "têkilî",
  "lê bike",
  "pê bike",
  "lêbike",
  "pêbike",
  "bide",
  "bidê",
  "bang lê bike",
  "bang pê bike",
  "xeber bide",
  "xeberbide",
  "biaxive",
  "axive",
  "biaxivim",
  "axivim",
  "pê re biaxive",
  "pêrebiaxive",

  // ── Nezaket ifadeleri ──
  "ji kerema xwe",
  "jikeremaxwe",
  "kerem ke",
  "keremke",
  "ji kerema",
  "jikerema",
  "xwedêro",
  "xwedê",
  "bila",
  "lê",
  "ka",
  "rabe",
  "here",
  "bê",
  "werin",
  "herin",
  "rêk bixin",
  "dixwazim",
  "dixwazim ku",
  "daxwaz dikim",
  "daxwaz",
  "dikim",
  "ez dixwazim",
  "min dixwaze",
  "min jê re",
  "ji min re",
  "jî",

  // ── Şahıs zamirleri ──
  "ez",
  "tu",
  "ew",
  "em",
  "hûn",
  "hun",
  "hin",

  // ── Oblique hâl zamirleri ──
  "min",
  "te",
  "wî",
  "wi",
  "wê",
  "we",
  "me",
  "wan",

  // ── Edat / ilgeç ──
  "ji",
  "bo",
  "ji bo",
  "jibo",
  "li",
  "bi",
  "ra",
  "re",
  "ve",
  "de",
  "da",
  "ser",
  "bin",
  "pêş",
  "pes",
  "paş",
  "pas",
  "nav",
  "nava",
  "navbera",
  "tevî",
  "tevi",
  "hertî",
  "herî",
  "heri",
  "para",
  "berî",
  "beri",
  "piştî",
  "pisti",
  "dema",
  "dema ku",
  "çawa ku",
  "cawa ku",
  "ku",

  // ── Bağlaçlar ──
  "û",
  "u",
  "an",
  "yan",
  "lê",
  "le",
  "belê",
  "bele",
  "ne",
  "ne... ne jî",
  "hem",
  "jî",
  "ji",
  "jixwe",
  "lewre",
  "ji ber",
  "jiber",
  "çimkî",
  "cimki",
  "eger",
  "heke",
  "gava",
  "dema",

  // ── Soru kelimeleri ──
  "kî",
  "ki",
  "çi",
  "ci",
  "kû",
  "ku",
  "kengê",
  "kenge",
  "çawa",
  "cawa",
  "çiqas",
  "ciqas",
  "çend",
  "cend",

  // ── Zaman zarfları ──
  "niha",
  "naha",
  "nûha",
  "êdî",
  "edi",
  "hema",
  "heman",
  "zû",
  "zu",
  "dereng",
  "piçek",
  "piçekî",
  "carekê",
  "cara",
  "îcar",
  "icar",
  "îcarê",
  "paşê",
  "pase",
  "dûre",
  "dure",
  "berê",
  "bere",

  // ── Onay / ret ──
  "erê",
  "ere",
  "belê",
  "bele",
  "baş e",
  "basê",
  "bas",
  "baş",
  "xweşe",
  "xwes",
  "na",
  "nake",
  "nabin",

  // ── Selamlama ──
  "nasai",  
  "sayid",
  "ka",
  "silaw",
  "merheba",
  "xêr be",
  "xer be",
  "rojbaş",
  "robas",
  "hey",
  "alo",
  "halo",
  "eywallah",
  "destxweş",

  // ── Çeşitli fiil kökleri ──
  "bêje",
  "beje",
  "bide zanîn",
  "bidezanin",
  "rabe",
  "here",
  "bê",
  "were",
  "bigire",
  "biparêze",
  "bixwaze",
  "bixwazim",
  "bixwazin",
  "berde",
  "bihêle",
  "bihele",
  "bimîne",
  "bimine",
]);

// ────────────────────────────────────────────────────────────────
// 7. DİL TESPİT İŞARETLEYİCİLERİ
//    Bu kelimeler metinde görünüyorsa o dil tespit edilir.
//    Türkçe: 2+ eşleşme → Türkçe
//    Kürtçe: 2+ eşleşme → Kürtçe
// ────────────────────────────────────────────────────────────────

export const TR_LANGUAGE_MARKERS = new Set<string>([
  "ara",
  "arar",
  "ararmısın",
  "ararmisin",
  "lütfen",
  "lutfen",
  "istiyorum",
  "senden",
  "benden",
  "zahmet",
  "çağır",
  "telefon et",
  "telefon",
  "mısın",
  "misin",
  "tamam",
  "acaba",
  "bana",
  "beni",
  "şunu",
  "bunu",
  "onu",
]);

export const KU_LANGUAGE_MARKERS = new Set<string>([
  "bi gara",
  "bigara",
  "bang bike",
  "bang",
  "bike",
  "ji kerema xwe",
  "kerem ke",
  "dixwazim",
  "ji",
  "bo",
  "li",
  "bi",
  "û",
  "gara",
  "lê",
  "pê",
  "erê",
  "silaw",
  "merheba",
  "belê",
  "niha",
  "hema",
]);

// ────────────────────────────────────────────────────────────────
// 8. SELAMLAMA KELİMELERİ
//    Cümlenin başındaki selamlamaları kaldırmak için.
// ────────────────────────────────────────────────────────────────

export const GREETING_WORDS = new Set<string>([
  // Türkçe
  "merhaba",
  "selam",
  "hey",
  "alo",
  "günaydın",
  "iyi günler",
  "iyi akşamlar",
  "nasılsın",
  "naber",
  "efendim",
  "beyefendi",
  "hanımefendi",

  // Kürtçe
  "silaw",
  "merheba",
  "xêr be",
  "xer be",
  "rojbaş",
  "eyvallah",
  "destxweş",
  "baş e",
  "xweş e",
  "choni",
  "çawanî",
  "çoni",
]);

// ────────────────────────────────────────────────────────────────
// 9. TÜRKÇE REGEX KOMUT KALIPLARI
//    Bu kalıplar eşleşirse içindeki yakalama grubu isimdir.
//    Sıra önemli: daha spesifik kalıplar önce gelir.
// ────────────────────────────────────────────────────────────────

export const TR_COMMAND_PATTERNS: RegExp[] = [
  // "X'ı ara" / "X'i ara" varyantları
  /^(.+?)[''']?[ıiuü]?\s+ara(?:r\s*m[iı]s[iı]n)?$/i,
  // "X'ı çağır"
  /^(.+?)[''']?[ıiuü]?\s+çağır/i,
  // "lütfen X'ı ara"
  /^lütfen\s+(.+?)[''']?[ıiuü]?\s+ara/i,
  // "X'a bağlan"
  /^(.+?)[''']?[ae]?\s+bağlan/i,
  // "senden X'ı armanı istiyorum"
  /senden\s+(.+?)[''']?[ıiuü]?\s+arman[ıi]/i,
  // "X'i arayabilir misin"
  /^(.+?)[''']?[ıiuü]?\s+arayabilir\s+misin/i,
  // "X ile görüş" / "X'le görüş"
  /^(.+?)[''']?[ıiuü]?(?:le|la|yle|yla)?\s+görüş/i,
  // "beni X ile bağla"
  /beni\s+(.+?)[''']?\s+(?:ile\s+)?bağla/i,
];

// ────────────────────────────────────────────────────────────────
// 10. KÜRTÇE REGEX KOMUT KALIPLARI
// ────────────────────────────────────────────────────────────────

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
];

// ────────────────────────────────────────────────────────────────
// 11. YARDIMCI SABITLER
// ────────────────────────────────────────────────────────────────

/** Fuzzy arama eşiği — düşüldükçe daha katı eşleşme */
export const FUSE_THRESHOLD = 0.45;

/** Güven skoru sınırları */
export const CONFIDENCE = {
  HIGH: 0.7,   // direkt ara
  MEDIUM: 0.4, // onay sor
  LOW: 0.0,    // bulunamadı
} as const;

/** Çoklu aday için maksimum fark */
export const MULTI_CANDIDATE_DIFF = 0.1;

/** Maksimum gösterilecek aday sayısı */
export const MAX_CANDIDATES = 3;

/** Minimum geçerli isim uzunluğu (karakter sayısı) */
export const MIN_NAME_LENGTH = 2;