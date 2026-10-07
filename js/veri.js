// ============================================================
// veri.js — OYUNUN TÜM SAYILARI BURADA
// Denge ayarı yapmak için sadece bu dosyayı değiştirmen yeterli.
// ============================================================
window.G = window.G || {};

G.TUR_MS = 800;        // Bir savaş turu kaç milisaniye
G.CANTA_LIMIT = 40;    // Çanta kapasitesi
G.MAKS_ARTI = 15;      // En yüksek güçlendirme seviyesi

// ---- Sınıflar ----
// taban: 1. seviyedeki değerler, artis: her seviyede eklenen
G.SINIFLAR = {
  savasci: {
    ad: 'Savaşçı', ikon: '⚔️', simge: 'kiliclar', aciklama: 'Yüksek can ve savunma. Yakın dövüşün ustası.',
    taban: { hp: 130, mp: 30, atkMin: 7, atkMax: 12, def: 6, hiz: 8, krit: 5 },
    artis: { hp: 20, mp: 3, atk: 3, def: 2 },
    beceri: { ad: 'Yarma Darbesi', mp: 10, carpan: 1.9, vurus: 1 }
  },
  buyucu: {
    ad: 'Büyücü', ikon: '🔮', simge: 'asa', aciklama: 'Düşük can, çok yüksek büyü hasarı.',
    taban: { hp: 85, mp: 90, atkMin: 9, atkMax: 16, def: 3, hiz: 9, krit: 5 },
    artis: { hp: 12, mp: 9, atk: 4, def: 1 },
    beceri: { ad: 'Ateş Topu', mp: 16, carpan: 2.6, vurus: 1 }
  },
  okcu: {
    ad: 'Okçu', ikon: '🏹', simge: 'yay', aciklama: 'Hızlı ve sık kritik vurur. Dengeli sınıf.',
    taban: { hp: 100, mp: 50, atkMin: 8, atkMax: 14, def: 4, hiz: 14, krit: 12 },
    artis: { hp: 15, mp: 5, atk: 3, def: 1 },
    beceri: { ad: 'Çift Atış', mp: 12, carpan: 1.35, vurus: 2 }
  }
};

// ---- Stat puanları (her seviyede 5 puan) ----
G.STATLAR = {
  guc:  { ad: 'Güç',          aciklama: '+1 saldırı' },
  day:  { ad: 'Dayanıklılık', aciklama: '+12 can, +1 savunma' },
  zeka: { ad: 'Zeka',         aciklama: '+8 mana, +%1 beceri hasarı' },
  cev:  { ad: 'Çeviklik',     aciklama: '+1 hız, +%0.5 kritik' }
};

// ---- Canavarlar ----
// atk: [min, maks], para: [min, maks]
G.CANAVARLAR = {
  kurt:        { ad: 'Kurt',          simge: 'kurt', lv: 1,  hp: 40,   atk: [4, 7],     def: 1,  exp: 12,   para: [2, 6] },
  domuz:       { ad: 'Yaban Domuzu',  simge: 'domuz', lv: 2,  hp: 60,   atk: [5, 9],     def: 2,  exp: 18,   para: [3, 8] },
  orumcek:     { ad: 'Dev Örümcek',   simge: 'orumcek', lv: 3,  hp: 55,   atk: [7, 11],    def: 1,  exp: 22,   para: [4, 9] },
  kurt_kral:   { ad: 'Kurt Kralı',    simge: 'kurt_kral', lv: 5,  hp: 450,  atk: [14, 20],   def: 5,  exp: 160,  para: [60, 100], boss: true },

  engerek:     { ad: 'Engerek',       simge: 'engerek', lv: 5,  hp: 120,  atk: [12, 18],   def: 4,  exp: 40,   para: [8, 15] },
  sahin:       { ad: 'Kara Şahin',    simge: 'sahin', lv: 6,  hp: 110,  atk: [14, 20],   def: 3,  exp: 48,   para: [9, 16] },
  kaplan_yilan:{ ad: 'Kaplan Yılan',  simge: 'kaplan_yilan', lv: 8,  hp: 200,  atk: [18, 26],   def: 7,  exp: 70,   para: [12, 22] },
  dev_bocek:   { ad: 'Kara Kınkanatlı', simge: 'dev_bocek', lv: 10, hp: 1600, atk: [34, 46],   def: 12, exp: 650,  para: [200, 320], boss: true },

  iskelet:     { ad: 'İskelet',       simge: 'iskelet', lv: 10, hp: 300,  atk: [28, 38],   def: 10, exp: 110,  para: [18, 30] },
  yarasa:      { ad: 'Vampir Yarasa', simge: 'yarasa', lv: 11, hp: 260,  atk: [30, 40],   def: 8,  exp: 120,  para: [20, 32] },
  zombi:       { ad: 'Zombi',         simge: 'zombi', lv: 12, hp: 420,  atk: [32, 44],   def: 12, exp: 145,  para: [22, 36] },
  zincirli_iblis:{ ad: 'Zincirli İblis', simge: 'zincirli_iblis', lv: 16, hp: 4200, atk: [70, 90], def: 25, exp: 1900, para: [600, 900], boss: true },

  kan_buyucusu:{ ad: 'Kan Büyücüsü',  simge: 'kan_buyucusu', lv: 16, hp: 700,  atk: [55, 70],   def: 18, exp: 280,  para: [35, 55] },
  gargoyl:     { ad: 'Gargoyl',       simge: 'gargoyl', lv: 18, hp: 900,  atk: [60, 80],   def: 24, exp: 340,  para: [40, 62] },
  cehennem_tazisi:{ ad: 'Cehennem Tazısı', simge: 'cehennem_tazisi', lv: 20, hp: 1100, atk: [70, 95], def: 22, exp: 420, para: [48, 75] },
  kara_ejder:  { ad: 'Kara Ejder',    simge: 'kara_ejder', lv: 22, hp: 12000, atk: [115, 145], def: 40, exp: 6000, para: [2000, 3000], boss: true }
};

// ---- Bölgeler ----
G.BOLGELER = [];  // v0.6: aşağıda, dünya haritasıyla birlikte tanımlanıyor

// ---- Nadirlik (düşme şansı % olarak, yüksekten aşağı kontrol edilir) ----
G.NADIRLIK = [
  { ad: 'Sıradan',  renk: '#bfb6a4', carpan: 1.00, sans: 100 },
  { ad: 'İyi',      renk: '#5fbf5f', carpan: 1.25, sans: 25 },
  { ad: 'Nadir',    renk: '#4f8fe0', carpan: 1.55, sans: 10 },
  { ad: 'Destansı', renk: '#b060e0', carpan: 2.00, sans: 3 },
  { ad: 'Efsanevi', renk: '#e8902a', carpan: 2.60, sans: 0.5 }
];

G.SLOTLAR = [
  { id: 'silah', ad: 'Silah',  ikon: '🗡️' },
  { id: 'kask',  ad: 'Kask',   ikon: '🪖' },
  { id: 'zirh',  ad: 'Zırh',   ikon: '🥋' },
  { id: 'kolye', ad: 'Kolye',  ikon: '📿' },
  { id: 'yuzuk', ad: 'Yüzük',  ikon: '💍' },
  { id: 'kemer', ad: 'Kemer',  ikon: '🎗️' },
  { id: 'cizme', ad: 'Çizme',  ikon: '👢' }
];

G.STAT_ADLARI = { atk: 'Saldırı', def: 'Savunma', hp: 'Can', mp: 'Mana', hiz: 'Hız' };

// ---- Eşya şablonları ----
// Kayıtta sadece şablonun SIRA NUMARASI tutulur. Yeni eşyayı hep EN SONA ekle,
// araya eklersen eski kayıtlardaki eşyalar değişir.
G.ESYALAR = [
  { ad: 'Paslı Kılıç',          slot: 'silah', lv: 1,  ikon: '🗡️', atk: 4 },
  { ad: 'Demir Balta',          slot: 'silah', lv: 5,  ikon: '🪓', atk: 10 },
  { ad: 'Asura',                slot: 'silah', lv: 10, ikon: '🪓', atk: 18 },
  { ad: 'İblis Avcısı',         slot: 'silah', lv: 16, ikon: '⚔️', atk: 30 },
  { ad: 'Ejder Dişi',           slot: 'silah', lv: 22, ikon: '🗡️', atk: 45 },

  { ad: 'Deri Başlık',          slot: 'kask',  lv: 1,  ikon: '🪖', def: 2, hp: 10 },
  { ad: 'Demir Miğfer',         slot: 'kask',  lv: 6,  ikon: '🪖', def: 4, hp: 30 },
  { ad: 'Büyü Miğferi',         slot: 'kask',  lv: 12, ikon: '⛑️', def: 7, hp: 60 },
  { ad: 'Taoist Maskesi',       slot: 'kask',  lv: 18, ikon: '🎭', def: 11, hp: 100 },

  { ad: 'Kumaş Zırh',           slot: 'zirh',  lv: 1,  ikon: '👕', def: 3, hp: 15 },
  { ad: 'Hafif Zırh',           slot: 'zirh',  lv: 5,  ikon: '🥋', def: 7, hp: 30 },
  { ad: 'Orta Zırh',            slot: 'zirh',  lv: 11, ikon: '🛡️', def: 12, hp: 60 },
  { ad: 'Kara Zırh',            slot: 'zirh',  lv: 17, ikon: '🛡️', def: 18, hp: 110 },

  { ad: 'Bakır Kolye',          slot: 'kolye', lv: 1,  ikon: '📿', atk: 1, mp: 10 },
  { ad: 'Altın Kolye',          slot: 'kolye', lv: 7,  ikon: '📿', atk: 3, mp: 25 },
  { ad: 'Şeytan Kolyesi',       slot: 'kolye', lv: 13, ikon: '🧿', atk: 6, mp: 45 },

  { ad: 'Bakır Yüzük',          slot: 'yuzuk', lv: 1,  ikon: '💍', atk: 1, def: 1 },
  { ad: 'Öküz Boynuzu Yüzük',   slot: 'yuzuk', lv: 7,  ikon: '💍', atk: 3, def: 2 },
  { ad: 'Kafatası Yüzüğü',      slot: 'yuzuk', lv: 13, ikon: '💀', atk: 6, def: 3 },

  { ad: 'Kumaş Kemer',          slot: 'kemer', lv: 1,  ikon: '🎗️', hp: 15 },
  { ad: 'Yaban Derisi Kemer',   slot: 'kemer', lv: 6,  ikon: '🎗️', hp: 35, def: 1 },
  { ad: 'Canavar Derisi Kemer', slot: 'kemer', lv: 12, ikon: '🎗️', hp: 70, def: 3 },

  { ad: 'Kumaş Çizme',          slot: 'cizme', lv: 1,  ikon: '👢', def: 1, hiz: 1 },
  { ad: 'Bronz Çizme',          slot: 'cizme', lv: 6,  ikon: '👢', def: 2, hiz: 2 },
  { ad: 'Canavar Derisi Çizme', slot: 'cizme', lv: 12, ikon: '🥾', def: 4, hiz: 4 }
];

// ---- Dükkan ----
G.DUKKAN = [
  { t: 'hp',  ad: 'Can İksiri',   ikon: '🧪', aciklama: 'Canını yeniler', fiyat: 12 },
  { t: 'mp',  ad: 'Mana İksiri',  ikon: '💧', aciklama: 'Manani yeniler', fiyat: 12 },
  { t: 'tas', ad: 'Arıtma Taşı',  ikon: '💎', aciklama: 'Eşya güçlendirmede kullanılır', fiyat: 60 }
];

// ============================================================
// v0.2 — EK STATLAR ve SETLER
// ============================================================

// Rastgele ek statlar. Değer = min..maks arası + (eşya seviyesi x lvArtis)
G.EK_STATLAR = {
  atk:       { min: 1, maks: 3,  lvArtis: 0.6 },
  def:       { min: 1, maks: 2,  lvArtis: 0.4 },
  hp:        { min: 5, maks: 15, lvArtis: 4 },
  mp:        { min: 4, maks: 10, lvArtis: 2.5 },
  hiz:       { min: 1, maks: 2,  lvArtis: 0.12 },
  krit:      { min: 1, maks: 3,  lvArtis: 0.15 },
  kritHasar: { min: 5, maks: 12, lvArtis: 0.6 },
  canCal:    { min: 1, maks: 2,  lvArtis: 0.08 },
  altin:     { min: 3, maks: 8,  lvArtis: 0.4 },
  tecrube:   { min: 2, maks: 6,  lvArtis: 0.3 }
};
// Nadirliğe göre kaç ek stat gelir: Sıradan, İyi, Nadir, Destansı, Efsanevi
G.EK_SAYISI = [0, 1, 2, 3, 4];

// Tüm bonusların ekranda görünen adları
G.BONUS_ADLARI = {
  atk: 'Saldırı', def: 'Savunma', hp: 'Can', mp: 'Mana', hiz: 'Hız',
  krit: 'Kritik şansı', kritHasar: 'Kritik hasarı', canCal: 'Can çalma',
  altin: 'Altın bulma', tecrube: 'Tecrübe kazancı',
  atkYuzde: 'Saldırı', hpYuzde: 'Can', defYuzde: 'Savunma'
};
G.YUZDE_STATLAR = { krit: 1, kritHasar: 1, canCal: 1, altin: 1, tecrube: 1, atkYuzde: 1, hpYuzde: 1, defYuzde: 1 };

// Setler: kaç parça giyilirse hangi bonus açılır
G.SETLER = {
  kurt:    { ad: 'Kurt Postu Takımı',     bonus: { 2: { hp: 40 },                   4: { krit: 5, atkYuzde: 8 } } },
  engerek: { ad: 'Engerek Takımı',        bonus: { 2: { canCal: 3 }, 3: { hiz: 6 }, 5: { kritHasar: 30, atkYuzde: 10 } } },
  iblis:   { ad: 'Zincirli İblis Takımı', bonus: { 2: { atkYuzde: 8 }, 4: { canCal: 5, hpYuzde: 10 }, 6: { atkYuzde: 15, kritHasar: 40 } } },
  ejder:   { ad: 'Kara Ejder Takımı',     bonus: { 2: { defYuzde: 10, hpYuzde: 10 }, 4: { krit: 8, kritHasar: 30 }, 6: { atkYuzde: 25, canCal: 6 } } }
};
G.SET_DUSME_BOSS = 60;     // Boss öldürünce set parçası düşme şansı (%)
G.SET_DUSME_NORMAL = 1.5;  // Normal canavardan (%)

// Set parçaları. ESYALAR listesinin SONUNA eklenir, eski kayıtlar bozulmaz.
G.ESYALAR.push(
  { ad: 'Kurt Postu Başlık',   slot: 'kask',  lv: 4,  ikon: '🪖', def: 3, hp: 20, set: 'kurt' },
  { ad: 'Kurt Postu Zırh',     slot: 'zirh',  lv: 4,  ikon: '🥋', def: 5, hp: 25, set: 'kurt' },
  { ad: 'Kurt Dişi Kolye',     slot: 'kolye', lv: 4,  ikon: '📿', atk: 3, mp: 10, set: 'kurt' },
  { ad: 'Kurt Postu Çizme',    slot: 'cizme', lv: 4,  ikon: '👢', def: 2, hiz: 2, set: 'kurt' },

  { ad: 'Zehirli Kama',        slot: 'silah', lv: 9,  ikon: '🗡️', atk: 14, set: 'engerek' },
  { ad: 'Engerek Miğferi',     slot: 'kask',  lv: 9,  ikon: '🪖', def: 5, hp: 35, set: 'engerek' },
  { ad: 'Engerek Pulu Zırh',   slot: 'zirh',  lv: 9,  ikon: '🥋', def: 9, hp: 45, set: 'engerek' },
  { ad: 'Engerek Yüzüğü',      slot: 'yuzuk', lv: 9,  ikon: '💍', atk: 4, def: 2, set: 'engerek' },
  { ad: 'Engerek Kemeri',      slot: 'kemer', lv: 9,  ikon: '🎗️', hp: 45, def: 2, set: 'engerek' },

  { ad: 'İblis Kılıcı',        slot: 'silah', lv: 15, ikon: '⚔️', atk: 27, set: 'iblis' },
  { ad: 'İblis Miğferi',       slot: 'kask',  lv: 15, ikon: '⛑️', def: 9, hp: 75, set: 'iblis' },
  { ad: 'İblis Zırhı',         slot: 'zirh',  lv: 15, ikon: '🛡️', def: 15, hp: 90, set: 'iblis' },
  { ad: 'İblis Kolyesi',       slot: 'kolye', lv: 15, ikon: '🧿', atk: 7, mp: 50, set: 'iblis' },
  { ad: 'İblis Yüzüğü',        slot: 'yuzuk', lv: 15, ikon: '💍', atk: 7, def: 3, set: 'iblis' },
  { ad: 'İblis Çizmesi',       slot: 'cizme', lv: 15, ikon: '🥾', def: 5, hiz: 5, set: 'iblis' },

  { ad: 'Ejder Pençesi',       slot: 'silah', lv: 21, ikon: '🗡️', atk: 42, set: 'ejder' },
  { ad: 'Ejder Miğferi',       slot: 'kask',  lv: 21, ikon: '⛑️', def: 13, hp: 120, set: 'ejder' },
  { ad: 'Ejder Pulu Zırh',     slot: 'zirh',  lv: 21, ikon: '🛡️', def: 21, hp: 140, set: 'ejder' },
  { ad: 'Ejder Kalbi Kolye',   slot: 'kolye', lv: 21, ikon: '🧿', atk: 10, mp: 70, set: 'ejder' },
  { ad: 'Ejder Gözü Yüzük',    slot: 'yuzuk', lv: 21, ikon: '💍', atk: 10, def: 5, set: 'ejder' },
  { ad: 'Ejder Derisi Kemer',  slot: 'kemer', lv: 21, ikon: '🎗️', hp: 110, def: 5, set: 'ejder' },
  { ad: 'Ejder Çizmesi',       slot: 'cizme', lv: 21, ikon: '🥾', def: 7, hiz: 6, set: 'ejder' }
);

// ============================================================
// v0.4 — BECERİLER ve YETENEK KİTAPLARI
// ============================================================
G.YUVA_ACILIS = { aktif: [1, 6, 12], pasif: [4, 10] };  // yuvaların açıldığı seviyeler
G.BECERI_MAKS = 5;               // bir becerinin en yüksek seviyesi
G.KITAP_DUSME_NORMAL = 1.2;      // normal canavardan kitap düşme şansı (%)
G.KITAP_DUSME_BOSS = 35;         // bosstan (%)
// Seviye atlamak için gereken kitap = mevcut seviye (2 için 1, 3 için 2, 4 için 3, 5 için 4)
G.KITAP_FAZLA_TOZ = 15;          // en üst seviyedeki becerinin kitabı Ruh Tozu'na dönüşür

G.SINIFLAR.savasci.baslangic = 'yarma';
G.SINIFLAR.buyucu.baslangic = 'ates_topu';
G.SINIFLAR.okcu.baslangic = 'cift_atis';

// sinif: null ise her sınıf öğrenebilir. minLv: kitabın düşmeye başladığı canavar seviyesi
// AKTİF etki tipleri: hasar (carpan, vurus, sersem, dot, sure), iyilesme (oran), kalkan (oran, sure), guc (oran, sure)
// artis: her beceri seviyesinde etkiye eklenen miktar
// PASİF: bonus x beceri seviyesi kadar stat verir
G.BECERILER = {
  // ---- Savaşçı ----
  yarma:          { ad: 'Yarma Darbesi',  sinif: 'savasci', tur: 'aktif', ikon: '🪓', minLv: 1,  mp: 10, bekleme: 1, etki: { tip: 'hasar', carpan: 1.9, vurus: 1 }, artis: { carpan: 0.15 } },
  kalkan_darbesi: { ad: 'Kalkan Darbesi', sinif: 'savasci', tur: 'aktif', ikon: '🛡️', minLv: 3,  mp: 12, bekleme: 5, etki: { tip: 'hasar', carpan: 1.2, vurus: 1, sersem: 1 }, artis: { carpan: 0.1 } },
  savas_cigligi:  { ad: 'Savaş Çığlığı',  sinif: 'savasci', tur: 'aktif', ikon: '📯', minLv: 6,  mp: 15, bekleme: 8, etki: { tip: 'guc', oran: 25, sure: 4 }, artis: { oran: 5 } },
  demir_irade:    { ad: 'Demir İrade',    sinif: 'savasci', tur: 'aktif', ikon: '🧱', minLv: 10, mp: 14, bekleme: 7, etki: { tip: 'kalkan', oran: 40, sure: 3 }, artis: { oran: 5 } },
  demir_deri:     { ad: 'Demir Deri',     sinif: 'savasci', tur: 'pasif', ikon: '🪨', minLv: 4,  bonus: { defYuzde: 6 } },
  ofke:           { ad: 'Öfke',           sinif: 'savasci', tur: 'pasif', ikon: '💢', minLv: 8,  bonus: { atkYuzde: 3, krit: 1 } },

  // ---- Büyücü ----
  ates_topu:      { ad: 'Ateş Topu',      sinif: 'buyucu', tur: 'aktif', ikon: '🔥', minLv: 1,  mp: 16, bekleme: 1, etki: { tip: 'hasar', carpan: 2.6, vurus: 1 }, artis: { carpan: 0.2 } },
  buz_mizragi:    { ad: 'Buz Mızrağı',    sinif: 'buyucu', tur: 'aktif', ikon: '🧊', minLv: 3,  mp: 18, bekleme: 5, etki: { tip: 'hasar', carpan: 1.6, vurus: 1, sersem: 1 }, artis: { carpan: 0.15 } },
  alev_dalgasi:   { ad: 'Alev Dalgası',   sinif: 'buyucu', tur: 'aktif', ikon: '🌋', minLv: 6,  mp: 20, bekleme: 6, etki: { tip: 'hasar', carpan: 0.8, vurus: 1, dot: 0.6, sure: 4 }, artis: { dot: 0.1 } },
  mana_kalkani:   { ad: 'Mana Kalkanı',   sinif: 'buyucu', tur: 'aktif', ikon: '🔮', minLv: 10, mp: 22, bekleme: 7, etki: { tip: 'kalkan', oran: 45, sure: 3 }, artis: { oran: 5 } },
  bilgelik:       { ad: 'Bilgelik',       sinif: 'buyucu', tur: 'pasif', ikon: '📘', minLv: 4,  bonus: { mp: 25, beceri: 3 } },
  buyu_ustaligi:  { ad: 'Büyü Ustalığı',  sinif: 'buyucu', tur: 'pasif', ikon: '✴️', minLv: 8,  bonus: { beceri: 8 } },

  // ---- Okçu ----
  cift_atis:      { ad: 'Çift Atış',      sinif: 'okcu', tur: 'aktif', ikon: '🏹', minLv: 1,  mp: 12, bekleme: 1, etki: { tip: 'hasar', carpan: 1.35, vurus: 2 }, artis: { carpan: 0.1 } },
  zehirli_ok:     { ad: 'Zehirli Ok',     sinif: 'okcu', tur: 'aktif', ikon: '🐍', minLv: 3,  mp: 14, bekleme: 5, etki: { tip: 'hasar', carpan: 1.0, vurus: 1, dot: 0.5, sure: 5 }, artis: { dot: 0.08 } },
  ok_yagmuru:     { ad: 'Ok Yağmuru',     sinif: 'okcu', tur: 'aktif', ikon: '🌧️', minLv: 6,  mp: 22, bekleme: 6, etki: { tip: 'hasar', carpan: 0.75, vurus: 4 }, artis: { carpan: 0.08 } },
  golge_adim:     { ad: 'Gölge Adım',     sinif: 'okcu', tur: 'aktif', ikon: '💨', minLv: 10, mp: 15, bekleme: 7, etki: { tip: 'kalkan', oran: 55, sure: 2 }, artis: { oran: 5 } },
  keskin_goz:     { ad: 'Keskin Göz',     sinif: 'okcu', tur: 'pasif', ikon: '🎯', minLv: 4,  bonus: { krit: 2 } },
  avci_icgudusu:  { ad: 'Avcı İçgüdüsü',  sinif: 'okcu', tur: 'pasif', ikon: '🐾', minLv: 8,  bonus: { kritHasar: 10 } },

  // ---- Genel (her sınıf) ----
  ilk_yardim:     { ad: 'İlk Yardım',     sinif: null, tur: 'aktif', ikon: '💚', minLv: 2,  mp: 12, bekleme: 8, etki: { tip: 'iyilesme', oran: 25 }, artis: { oran: 5 } },
  hazine_avcisi:  { ad: 'Hazine Avcısı',  sinif: null, tur: 'pasif', ikon: '💰', minLv: 3,  bonus: { altin: 6 } },
  bilge:          { ad: 'Bilge',          sinif: null, tur: 'pasif', ikon: '📜', minLv: 3,  bonus: { tecrube: 5 } },
  kan_emici:      { ad: 'Kan Emici',      sinif: null, tur: 'pasif', ikon: '🩸', minLv: 5,  bonus: { canCal: 1 } },
  cevik:          { ad: 'Çevik',          sinif: null, tur: 'pasif', ikon: '🍃', minLv: 6,  bonus: { hiz: 2 } }
};

G.BONUS_ADLARI.beceri = 'Beceri hasarı';
G.YUZDE_STATLAR.beceri = 1;

// ============================================================
// v0.5 — ZORLUK AYARLARI (denge için önce buraya bak)
// ============================================================
G.ZORLUK = {
  hpArtis: 0.08,     // canavar canı her seviyede %12 artar (seviye 22: x3.5)
  atkArtis: 0.05,    // canavar saldırısı her seviyede %7 artar
  defArtis: 0.05,    // canavar savunması her seviyede %5 artar
  bossHp: 2.0,       // bosslar ayrıca x2 can
  bossAtk: 1.3,      // ve x1.3 saldırı
  ofkeEsik: 0.3,     // boss canı %30'un altına düşünce öfkelenir
  ofkeCarpan: 1.5,   // öfkeli boss x1.5 vurur
  iksirBekleme: 3,   // iksirler arası tur (her tur iksir içilemez)
  expCarpan: 60,     // seviye için gereken tecrübe = expCarpan x seviye^expUs
  expUs: 2.75
};
G.DUSME = { hpIksir: 10, mpIksir: 8, tas: 8 };  // normal canavardan düşme şansı (%)

// Başlangıç becerileri her tur kullanılamasın
G.BECERILER.yarma.bekleme = 2;
G.BECERILER.ates_topu.bekleme = 2;
G.BECERILER.cift_atis.bekleme = 2;

// v0.5 sınıf dengesi
G.BECERILER.ates_topu.etki.carpan = 2.1;  G.BECERILER.ates_topu.mp = 18;
G.BECERILER.buz_mizragi.etki.carpan = 1.4;
G.BECERILER.alev_dalgasi.etki.dot = 0.5;
G.BECERILER.yarma.etki.carpan = 2.1;

// ============================================================
// v0.6 — DÜNYA: bölge zinciri, kasabalar, yeni bölgeler, saha
// ============================================================
// Zincir sırası = listedeki sıra. tur: 'kasaba' (güvenli) veya 'av'.
// harita: büyük haritadaki konum (x: 0-100, y: 0-150, aşağıdan yukarı ilerler)
G.BOLGELER = [
  { id: 'koy', ad: 'Taşlıca Köyü', tur: 'kasaba', minLv: 1, harita: { x: 50, y: 140 },
    aciklama: 'Yolculuğun başladığı küçük köy. Taş duvarların ardında iksirci ve hurdacı seni bekler.' },
  { id: 'orman', ad: 'Sisli Orman', tur: 'av', minLv: 1, harita: { x: 28, y: 126 },
    aciklama: 'Sabahları sisin hiç kalkmadığı sık orman.', canavarlar: ['kurt', 'domuz', 'orumcek'], boss: 'kurt_kral', set: 'kurt' },
  { id: 'vadi', ad: 'Engerek Vadisi', tur: 'av', minLv: 5, harita: { x: 64, y: 112 },
    aciklama: 'Kayalıkların arasında yılanların yuva kurduğu dar vadi.', canavarlar: ['engerek', 'sahin', 'kaplan_yilan'], boss: 'dev_bocek', set: 'engerek' },
  { id: 'kervansaray', ad: 'Eski Kervansaray', tur: 'kasaba', minLv: 5, harita: { x: 80, y: 97 },
    aciklama: 'Yol üstündeki yorgun tüccarların ve maceracıların durağı.' },
  { id: 'harabe', ad: 'Kül Harabeleri', tur: 'av', minLv: 10, harita: { x: 52, y: 85 },
    aciklama: 'Bir zamanlar parlak bir şehirdi. Şimdi ölüler dolaşıyor.', canavarlar: ['iskelet', 'yarasa', 'zombi'], boss: 'zincirli_iblis', set: 'iblis' },
  { id: 'kale', ad: 'Kan Kalesi', tur: 'av', minLv: 16, harita: { x: 22, y: 73 },
    aciklama: 'Kara büyücülerin kalesi. Duvarlarından kan sızar.', canavarlar: ['kan_buyucusu', 'gargoyl', 'cehennem_tazisi'], boss: 'kara_ejder', set: 'ejder' },
  { id: 'demirkapi', ad: 'Demirkapı', tur: 'kasaba', minLv: 16, harita: { x: 38, y: 60 },
    aciklama: 'Dağ geçidini tutan sur şehri. Kuzeye giden son güvenli yer.' },
  { id: 'bataklik', ad: 'Zehir Bataklığı', tur: 'av', minLv: 22, harita: { x: 70, y: 51 },
    aciklama: 'Nefes almanın bile acıttığı çürük sular.', canavarlar: ['kurbaga', 'suluk', 'curuk_ent'], boss: 'bataklik_timsahi' },
  { id: 'buzul', ad: 'Buzul Geçidi', tur: 'av', minLv: 27, harita: { x: 84, y: 36 },
    aciklama: 'Rüzgarın kemikleri dondurduğu karlı geçit.', canavarlar: ['buz_kurdu', 'kar_trolu', 'buz_ruhu'], boss: 'ayaz_devi' },
  { id: 'karakol', ad: 'Son Karakol', tur: 'kasaba', minLv: 27, harita: { x: 58, y: 27 },
    aciklama: 'Dünyanın kenarındaki son nöbet yeri.' },
  { id: 'volkan', ad: 'Kor Dağı', tur: 'av', minLv: 32, harita: { x: 28, y: 19 },
    aciklama: 'Lavın nehir gibi aktığı yanık dağ.', canavarlar: ['magma_bocegi', 'kor_semender', 'ates_elementali'], boss: 'kor_titani' },
  { id: 'ucurum', ad: 'Hiçlik Uçurumu', tur: 'av', minLv: 37, harita: { x: 52, y: 7 },
    aciklama: 'Işığın bile geri dönmediği uçurum. Buradan ötesi yok.', canavarlar: ['hiclik_gozcusu', 'golge_sovalye', 'bosluk_canavari'], boss: 'hiclik_efendisi' }
];

// Yeni canavarlar (statlar ayrıca G.ZORLUK ile seviyeye göre büyür)
Object.assign(G.CANAVARLAR, {
  kurbaga:          { ad: 'Zehir Kurbağası',  simge: 'kurbaga', lv: 22, hp: 1250, atk: [78, 98],   def: 28, exp: 520,  para: [55, 85] },
  suluk:            { ad: 'Sülük Yığını',     simge: 'suluk', lv: 23, hp: 1400, atk: [76, 96],   def: 30, exp: 560,  para: [58, 90] },
  curuk_ent:        { ad: 'Çürük Ağaç',       simge: 'curuk_ent', lv: 25, hp: 1750, atk: [88, 112],  def: 36, exp: 650,  para: [65, 100] },
  bataklik_timsahi: { ad: 'Bataklık Timsahı', simge: 'bataklik_timsahi', lv: 27, hp: 15000, atk: [150, 185], def: 50, exp: 9000, para: [3000, 4500], boss: true },

  buz_kurdu:        { ad: 'Buz Kurdu',        simge: 'kurt', lv: 27, hp: 1950, atk: [98, 122],  def: 40, exp: 780,  para: [75, 110] },
  kar_trolu:        { ad: 'Kar Trolü',        simge: 'kar_trolu', lv: 28, hp: 2500, atk: [102, 130], def: 46, exp: 880,  para: [80, 120] },
  buz_ruhu:         { ad: 'Buz Ruhu',         simge: 'buz_ruhu', lv: 30, hp: 2050, atk: [120, 150], def: 38, exp: 950,  para: [85, 125] },
  ayaz_devi:        { ad: 'Ayaz Devi',        simge: 'ayaz_devi', lv: 32, hp: 21000, atk: [185, 225], def: 62, exp: 14000, para: [4500, 6500], boss: true },

  magma_bocegi:     { ad: 'Magma Böceği',     simge: 'magma_bocegi', lv: 32, hp: 2800, atk: [135, 165], def: 50, exp: 1150, para: [95, 140] },
  kor_semender:     { ad: 'Kor Semenderi',    simge: 'kor_semender', lv: 33, hp: 3100, atk: [140, 175], def: 54, exp: 1250, para: [100, 150] },
  ates_elementali:  { ad: 'Ateş Ruhu',        simge: 'ates_elementali', lv: 35, hp: 3500, atk: [160, 195], def: 58, exp: 1400, para: [110, 160] },
  kor_titani:       { ad: 'Kor Titanı',       simge: 'kor_titani', lv: 37, hp: 29000, atk: [230, 280], def: 75, exp: 20000, para: [6500, 9000], boss: true },

  hiclik_gozcusu:   { ad: 'Hiçlik Gözcüsü',   simge: 'hiclik_gozcusu', lv: 37, hp: 3900, atk: [175, 210], def: 64, exp: 1650, para: [120, 175] },
  golge_sovalye:    { ad: 'Gölge Şövalyesi',  simge: 'golge_sovalye', lv: 38, hp: 4500, atk: [185, 225], def: 70, exp: 1800, para: [130, 185] },
  bosluk_canavari:  { ad: 'Boşluk Canavarı',  simge: 'bosluk_canavari', lv: 40, hp: 5100, atk: [205, 250], def: 76, exp: 2050, para: [140, 200] },
  hiclik_efendisi:  { ad: 'Hiçlik Efendisi',  simge: 'hiclik_efendisi', lv: 42, hp: 40000, atk: [280, 340], def: 90, exp: 30000, para: [9000, 13000], boss: true }
});

// Yeni eşyalar (listenin SONUNA)
G.ESYALAR.push(
  { ad: 'Buz Kesen',            slot: 'silah', lv: 27, ikon: '🗡️', atk: 58 },
  { ad: 'Kor Balta',            slot: 'silah', lv: 32, ikon: '🪓', atk: 74 },
  { ad: 'Hiçlik Kılıcı',        slot: 'silah', lv: 37, ikon: '⚔️', atk: 94 },
  { ad: 'Bataklık Miğferi',     slot: 'kask',  lv: 24, ikon: '🪖', def: 15, hp: 140 },
  { ad: 'Ayaz Miğferi',         slot: 'kask',  lv: 30, ikon: '⛑️', def: 19, hp: 190 },
  { ad: 'Boşluk Maskesi',       slot: 'kask',  lv: 36, ikon: '🎭', def: 24, hp: 250 },
  { ad: 'Pullu Zırh',           slot: 'zirh',  lv: 23, ikon: '🥋', def: 25, hp: 170 },
  { ad: 'Kürklü Zırh',          slot: 'zirh',  lv: 29, ikon: '🛡️', def: 32, hp: 230 },
  { ad: 'Obsidyen Zırh',        slot: 'zirh',  lv: 35, ikon: '🛡️', def: 40, hp: 300 },
  { ad: 'Buz Kristali Kolye',   slot: 'kolye', lv: 25, ikon: '📿', atk: 13, mp: 90 },
  { ad: 'Kor Kalbi Kolye',      slot: 'kolye', lv: 33, ikon: '🧿', atk: 17, mp: 120 },
  { ad: 'Donmuş Yüzük',         slot: 'yuzuk', lv: 25, ikon: '💍', atk: 13, def: 6 },
  { ad: 'Obsidyen Yüzük',       slot: 'yuzuk', lv: 33, ikon: '💍', atk: 17, def: 8 },
  { ad: 'Trol Derisi Kemer',    slot: 'kemer', lv: 24, ikon: '🎗️', hp: 140, def: 6 },
  { ad: 'Semender Kemeri',      slot: 'kemer', lv: 32, ikon: '🎗️', hp: 190, def: 8 },
  { ad: 'Kar Çizmesi',          slot: 'cizme', lv: 24, ikon: '🥾', def: 9, hiz: 7 },
  { ad: 'Kor Çizmesi',          slot: 'cizme', lv: 32, ikon: '🥾', def: 12, hiz: 9 }
);

// Dönüş parşömeni: son kasabaya ışınlanır
G.DUKKAN.push({ t: 'parsomen', ad: 'Dönüş Parşömeni', ikon: '📜', aciklama: 'Seni son uğradığın kasabaya götürür', fiyat: 40 });

// Saha ayarları (koordinatlar 0-100 arası)
G.SAHA = {
  canavarSayi: 5,     // sahadaki canavar sayısı
  yakin: 21,          // bu mesafede savaş başlar (kart genişliği kadar)
  agro: 30,           // saldırgan canavarın seni fark ettiği mesafe
  oyuncuHiz: 32,      // birim/saniye
  gezHiz: 5,          // canavarların gezinme hızı
  kovalaHiz: 13,      // saldırgan canavarın kovalama hızı
  saldirganSans: 35   // canavarın saldırgan doğma şansı (%)
};

// v0.6 sınıf dengesi (simülasyonla ayarlandı)
G.BECERILER.yarma.etki.carpan = 2.4;
G.SINIFLAR.savasci.taban.atkMin = 9;
G.SINIFLAR.savasci.taban.atkMax = 14;
G.SINIFLAR.savasci.artis.atk = 4;

// ============================================================
// v0.7 — IZGARA SAVAŞI: menzil, beceri şekilleri, yeni beceriler
// ============================================================
G.IZGARA = { sut: 5, sat: 5 };     // görünmez ızgara: 5 sütun x 5 satır
G.SAHA = {
  canavarSayi: 5,       // sahadaki canavar sayısı
  agro: 2,              // saldırgan canavarın seni fark ettiği mesafe (kare)
  oyuncuAdim: 0.3,      // oyuncunun bir kare yürüme süresi (sn)
  kovalaAdim: 0.7,      // saldıran canavarın bir kare yürüme süresi
  saldirganSans: 35     // canavarın saldırgan doğma şansı (%)
};
// Menzil: kaç kare uzaktan vurabilir (1 = sadece yanındakine)
G.SINIFLAR.savasci.menzil = 1;
G.SINIFLAR.buyucu.menzil = 3;
G.SINIFLAR.okcu.menzil = 3;

// Beceri şekilleri: tek, yarimay (öndeki 3 kare), kasirga (etraftaki 8 kare),
// alan (hedef ve çevresi 3x3), cizgi (bir yönde 4 kare)
G.BECERILER.alev_dalgasi.etki = { tip: 'hasar', sekil: 'alan', carpan: 0.7, vurus: 1, dot: 0.4, sure: 4 };
G.BECERILER.alev_dalgasi.artis = { carpan: 0.06, dot: 0.06 };
G.BECERILER.ok_yagmuru.etki = { tip: 'hasar', sekil: 'alan', carpan: 0.9, vurus: 1 };
G.BECERILER.ok_yagmuru.artis = { carpan: 0.08 };

Object.assign(G.BECERILER, {
  hilal_kesik:  { ad: 'Hilal Kesiği', sinif: 'savasci', tur: 'aktif', ikon: '🌙', minLv: 2, mp: 0, bekleme: 3,
                  etki: { tip: 'hasar', sekil: 'yarimay', carpan: 1.1, vurus: 1 }, artis: { carpan: 0.1 } },
  kasirga:      { ad: 'Kasırga', sinif: 'savasci', tur: 'aktif', ikon: '🌀', minLv: 8, mp: 18, bekleme: 6,
                  etki: { tip: 'hasar', sekil: 'kasirga', carpan: 1.4, vurus: 1 }, artis: { carpan: 0.12 } },
  gokatasi:     { ad: 'Göktaşı', sinif: 'buyucu', tur: 'aktif', ikon: '☄️', minLv: 12, mp: 35, bekleme: 8,
                  etki: { tip: 'hasar', sekil: 'alan', carpan: 1.8, vurus: 1 }, artis: { carpan: 0.15 } },
  delici_ok:    { ad: 'Delici Ok', sinif: 'okcu', tur: 'aktif', ikon: '➶', minLv: 2, mp: 8, bekleme: 3,
                  etki: { tip: 'hasar', sekil: 'cizgi', carpan: 1.4, vurus: 1 }, artis: { carpan: 0.1 } },
  // Tetiklenen: normal saldırıda şansla ek vuruş (%60 hasar)
  cifte_darbe:  { ad: 'Çifte Darbe', sinif: null, tur: 'pasif', ikon: '⚡', minLv: 7, bonus: { ekVurus: 4 } }
});
G.BONUS_ADLARI.ekVurus = 'Ek vuruş şansı';
G.YUZDE_STATLAR.ekVurus = 1;

// v0.7 savaşçı: kuşatılmaya dayanıklı olsun
G.SINIFLAR.savasci.taban.hp = 160;
G.SINIFLAR.savasci.artis.hp = 28;
G.SINIFLAR.savasci.artis.def = 3;
G.SINIFLAR.okcu.artis.hp = 18;
G.SINIFLAR.okcu.artis.def = 2;
G.SINIFLAR.buyucu.artis.hp = 16;
G.SINIFLAR.buyucu.artis.def = 2;
G.BECERILER.ates_topu.etki.carpan = 2.4;
G.SINIFLAR.okcu.artis.hp = 20;

// ============================================================
// v0.8 — SINIFA ÖZEL GÖRÜNÜM (sadece ad ve simge; statlar aynı)
// Anahtar: eşyanın asıl adı (veri.js'deki). Yazılmayan sınıf asıl adı kullanır.
// ============================================================
G.SINIF_GORUNUM = {
  // Silahlar: savaşçı kılıç/balta, büyücü asa, okçu yay
  'Paslı Kılıç':    { buyucu: ['Çürük Asa', '🪄'],         okcu: ['Eğri Yay', '🏹'] },
  'Demir Balta':    { buyucu: ['Meşe Asa', '🪄'],          okcu: ['Avcı Yayı', '🏹'] },
  'Asura':          { buyucu: ['Kızıl Asa', '🪄'],         okcu: ['Kemik Yay', '🏹'] },
  'İblis Avcısı':   { buyucu: ['Ruh Asası', '🔱'],         okcu: ['Gölge Yayı', '🏹'] },
  'Ejder Dişi':     { buyucu: ['Ejder Asası', '🔱'],       okcu: ['Ejder Kanadı Yay', '🏹'] },
  'Zehirli Kama':   { buyucu: ['Zehirli Asa', '🪄'],       okcu: ['Engerek Yayı', '🏹'] },
  'İblis Kılıcı':   { buyucu: ['İblis Asası', '🔱'],       okcu: ['İblis Yayı', '🏹'] },
  'Ejder Pençesi':  { buyucu: ['Ejder Gözü Asa', '🔱'],    okcu: ['Ejder Pençesi Yay', '🏹'] },
  'Buz Kesen':      { buyucu: ['Buz Asası', '❄️'],          okcu: ['Ayaz Yayı', '🏹'] },
  'Kor Balta':      { buyucu: ['Kor Asası', '🔥'],          okcu: ['Kor Yayı', '🏹'] },
  'Hiçlik Kılıcı':  { buyucu: ['Hiçlik Asası', '🔱'],      okcu: ['Hiçlik Yayı', '🏹'] },
  // Kasklar: büyücü başlık/taç, okçu kukuleta
  'Deri Başlık':    { buyucu: ['Keten Başlık', '🎩'],      okcu: ['Deri Kukuleta', '🪶'] },
  'Demir Miğfer':   { savasci: ['Demir Miğfer', '🪖'], buyucu: ['Bilge Başlığı', '🎩'], okcu: ['Avcı Kukuletası', '🪶'] },
  'Büyü Miğferi':   { savasci: ['Tunç Miğfer', '⛑️'],     buyucu: ['Büyücü Tacı', '👑'],   okcu: ['Kartal Kukuletası', '🪶'] },
  'Taoist Maskesi': { savasci: ['Savaş Maskesi', '🎭'],    buyucu: ['Kahin Maskesi', '🎭'], okcu: ['Gölge Maskesi', '🎭'] },
  'Kurt Postu Başlık': { buyucu: ['Kurt Postu Başlık', '🎩'], okcu: ['Kurt Postu Kukuleta', '🪶'] },
  'Engerek Miğferi':   { buyucu: ['Engerek Tacı', '👑'],   okcu: ['Engerek Kukuletası', '🪶'] },
  'İblis Miğferi':     { buyucu: ['İblis Tacı', '👑'],     okcu: ['İblis Kukuletası', '🪶'] },
  'Ejder Miğferi':     { buyucu: ['Ejder Tacı', '👑'],     okcu: ['Ejder Kukuletası', '🪶'] },
  'Bataklık Miğferi':  { buyucu: ['Bataklık Başlığı', '🎩'], okcu: ['Bataklık Kukuletası', '🪶'] },
  'Ayaz Miğferi':      { buyucu: ['Ayaz Tacı', '👑'],      okcu: ['Ayaz Kukuletası', '🪶'] },
  'Boşluk Maskesi':    { buyucu: ['Boşluk Tacı', '👑'],    okcu: ['Boşluk Maskesi', '🎭'] },
  // Zırhlar: büyücü cübbe, okçu deri zırh
  'Kumaş Zırh':     { buyucu: ['Keten Cübbe', '👘'],       okcu: ['Deri Yelek', '🧥'] },
  'Hafif Zırh':     { buyucu: ['Çırak Cübbesi', '👘'],     okcu: ['Avcı Zırhı', '🧥'] },
  'Orta Zırh':      { buyucu: ['Bilge Cübbesi', '👘'],     okcu: ['İzci Zırhı', '🧥'] },
  'Kara Zırh':      { buyucu: ['Kara Cübbe', '👘'],        okcu: ['Kara Deri Zırh', '🧥'] },
  'Kurt Postu Zırh':   { buyucu: ['Kurt Postu Cübbe', '👘'], okcu: ['Kurt Postu Yelek', '🧥'] },
  'Engerek Pulu Zırh': { buyucu: ['Engerek Cübbesi', '👘'],  okcu: ['Engerek Derisi Zırh', '🧥'] },
  'İblis Zırhı':       { buyucu: ['İblis Cübbesi', '👘'],    okcu: ['İblis Derisi Zırh', '🧥'] },
  'Ejder Pulu Zırh':   { buyucu: ['Ejder Cübbesi', '👘'],    okcu: ['Ejder Derisi Zırh', '🧥'] },
  'Pullu Zırh':        { buyucu: ['Yosunlu Cübbe', '👘'],    okcu: ['Pullu Deri Zırh', '🧥'] },
  'Kürklü Zırh':       { buyucu: ['Kürklü Cübbe', '👘'],     okcu: ['Kürklü Yelek', '🧥'] },
  'Obsidyen Zırh':     { buyucu: ['Obsidyen Cübbe', '👘'],   okcu: ['Obsidyen Deri Zırh', '🧥'] }
};

// ============================================================
// v0.8 — MADENCİLİK
// ============================================================
G.CEVHERLER = {
  bakir:  { ad: 'Bakır',        ikon: '🟤' },
  gumus:  { ad: 'Gümüş',        ikon: '⚪' },
  altin:  { ad: 'Altın Cevher', ikon: '🟡' },
  demir:  { ad: 'Kara Demir',   ikon: '⚫' },
  kristal:{ ad: 'İlahi Kristal', ikon: '💠' }
};

// ============================================================
// v0.8 — İLAHİ SİLAH (sınıfa özel, madenle yükselir)
// ============================================================
G.ILAHI = {
  maks: 30,
  minLv: 8,            // seviye L'ye çıkmak için oyuncu seviyesi = minLv + L
  // Her seviye: +atk, +can, +mana
  statArtis: { atk: 1.6, hp: 15, mp: 6 },
  // Aşamalar (her 10 seviye): ana ve yan cevher
  asama: [ { ana: 'bakir', yan: 'gumus' }, { ana: 'gumus', yan: 'altin' }, { ana: 'demir', yan: 'kristal' } ],
  // Özel beceri: bu seviyelerde açılır ve güçlenir (tetiklenme şansı %)
  beceriSeviye: [5, 15, 25], beceriSans: [8, 12, 16],
  sinif: {
    savasci: { ad: 'Gök Gürültüsü Kılıcı', ikon: '⚡', beceri: 'Yıldırım', aciklama: 'hedefin çevresindeki 9 kareye %100 hasar', sekil: 'alan', carpan: 1.0 },
    buyucu:  { ad: 'Yıldız Asası',         ikon: '🌟', beceri: 'Yıldız Düşüşü', aciklama: 'hedefe %220 hasar', sekil: 'tek', carpan: 2.2 },
    okcu:    { ad: 'Rüzgar Yayı',          ikon: '🌪️', beceri: 'Rüzgar Oku', aciklama: 'bir yönde 4 kareyi delerek %130 hasar', sekil: 'cizgi', carpan: 1.3 }
  }
};
G.BONUS_ADLARI.ilahi = 'İlahi silah';

// v0.8 ilahi silah altın maliyeti (simülasyonla ayarlandı)
G.ILAHI.altinCarpan = 600;
G.ILAHI.altinUs = 1.7;

// v0.9 canavarlar sana koşar: çoğu saldırgan ve sahanın her yerinden fark eder
G.SAHA.saldirganSans = 70;
G.SAHA.agro = 4;

// ============================================================
// v0.10 — MADEN ETKİNLİĞİ (arka planda çalışır, Etkinlik sekmesinden girilir)
// ============================================================
G.MADEN = {
  enerjiMaks: 1000,
  enerjiSure: 180,     // 1 enerji kaç saniyede dolar (günde 480). Oyun kapalıyken de dolar
  isgalEnerji: 10,     // ocak işgali veya yağma denemesi, başarılı olsun olmasın
  dakikaSn: 60,        // kaç saniyede bir kazı turu (1 enerji harcar, cevher verir)
  cayEnerji: 100,      // Madenci Çayı
  cayFiyat: 60,        // fiyat = cayFiyat x seviye
  kayipOran: 30        // ocağın yağmalanırsa biriken cevherden kaybedilen (%)
};
// ocak: kattaki ocak sayısı (derinde az). doluluk: rakip madencilerin tuttuğu oran (%)
// guc: rakiplerin ortalama gücü (GP). yagma: her dakika ocağına saldırı şansı (%)
// cevher: her dakika ayrı ayrı zarlanır [tür, şans %, min, maks]
G.MADEN_KATLARI = [
  { ad: '1. Kat', alt: 'Bakır Damarları',  minLv: 8,  ocak: 24, doluluk: 30, guc: 250,  yagma: 0.5,
    cevher: [['bakir', 70, 1, 2], ['gumus', 25, 1, 1], ['altin', 4, 1, 1]] },
  { ad: '2. Kat', alt: 'Gümüş Galerileri', minLv: 16, ocak: 18, doluluk: 45, guc: 900,  yagma: 1,
    cevher: [['gumus', 60, 1, 2], ['altin', 30, 1, 1], ['bakir', 25, 1, 2]] },
  { ad: '3. Kat', alt: 'Kara Derinlik',    minLv: 22, ocak: 12, doluluk: 60, guc: 1600, yagma: 1.5,
    cevher: [['demir', 55, 1, 2], ['altin', 30, 1, 1], ['kristal', 2, 1, 1]] },
  { ad: '4. Kat', alt: 'Kristal Mağarası', minLv: 30, ocak: 6,  doluluk: 70, guc: 2400, yagma: 2,
    cevher: [['demir', 65, 1, 2], ['kristal', 6, 1, 1], ['altin', 20, 1, 1]] }
];
G.MADENCI_ADLARI = ['KaraBora', 'Yılkı', 'Toprak', 'Sarıkız', 'Bozkurt', 'Ayaz', 'Kıvılcım', 'Tunç', 'Kaya', 'Ceren',
  'Oğuz', 'Alp', 'Ece', 'Deniz', 'Sessiz', 'Gölge', 'Kartal', 'Demirel', 'Çakır', 'Tolga', 'Nazlı', 'Pars', 'Duman', 'Efe'];

// v0.10: bütün canavarlar saldırgan ve sana koşar
G.SAHA.saldirganSans = 100;
G.SAHA.agro = 99;
G.SAHA.dogmaMs = 5000;   // ölen canavarın yerine yenisi (ms)
// v0.10: sürüye karşı büyücü daha dayanıklı
G.SINIFLAR.buyucu.taban.hp = 110;
G.SINIFLAR.buyucu.artis.hp = 21;
G.SINIFLAR.buyucu.artis.def = 2.5;

// ============================================================
// v0.11 — KARAKTER BEBEĞİ: 10 yuva (2 yüzük, 2 bileklik), çanta genişletme
// ============================================================
G.SLOTLAR.push({ id: 'bileklik', ad: 'Bileklik', ikon: '⭕' });

// Karakter ekranındaki yuvalar. tur: bu yuvaya giyilen eşya türü. taraf: sol / sag sütun
G.YUVALAR = [
  { id: 'silah',     tur: 'silah',    taraf: 'sol' },
  { id: 'zirh',      tur: 'zirh',     taraf: 'sol' },
  { id: 'bileklik1', tur: 'bileklik', taraf: 'sol' },
  { id: 'yuzuk',     tur: 'yuzuk',    taraf: 'sol' },
  { id: 'kemer',     tur: 'kemer',    taraf: 'sol' },
  { id: 'kask',      tur: 'kask',     taraf: 'sag' },
  { id: 'kolye',     tur: 'kolye',    taraf: 'sag' },
  { id: 'bileklik2', tur: 'bileklik', taraf: 'sag' },
  { id: 'yuzuk2',    tur: 'yuzuk',    taraf: 'sag' },
  { id: 'cizme',     tur: 'cizme',    taraf: 'sag' }
];

// Bileklikler (listenin SONUNA)
G.ESYALAR.push(
  { ad: 'Bakır Bileklik',     slot: 'bileklik', lv: 1,  ikon: '⭕', atk: 1, def: 1 },
  { ad: 'Altın Bileklik',     slot: 'bileklik', lv: 6,  ikon: '⭕', atk: 3, def: 1 },
  { ad: 'Demir Bileklik',     slot: 'bileklik', lv: 12, ikon: '⭕', atk: 5, def: 2 },
  { ad: 'Büyülü Bileklik',    slot: 'bileklik', lv: 18, ikon: '⭕', atk: 7, def: 3 },
  { ad: 'Kor Bileklik',       slot: 'bileklik', lv: 24, ikon: '⭕', atk: 10, def: 4 },
  { ad: 'Obsidyen Bileklik',  slot: 'bileklik', lv: 32, ikon: '⭕', atk: 13, def: 5 }
);

// Çanta: başlangıç kapasitesi ve altınla genişletme
G.CANTA = { baslangic: 40, adim: 5, maks: 80, fiyat: 2000, carpan: 1.5 };

// Sarf malzemeleri (çantada yığın olarak görünür)
G.SARF = {
  hp:       { ad: 'Can İksiri',      simge: 'iksir', renk: '#c0503a', aciklama: 'Canını seviyene göre yeniler. Savaşta iki iksir arası bekleme var.' },
  mp:       { ad: 'Mana İksiri',     simge: 'iksir', renk: '#3d6fb4', aciklama: 'Manani seviyene göre yeniler.' },
  parsomen: { ad: 'Dönüş Parşömeni', simge: 'parsomen', renk: '#8a7a3a', aciklama: 'Seni son uğradığın kasabaya götürür. Saldırı altındayken de okunur.' },
  tas:      { ad: 'Arıtma Taşı',     simge: 'tas', renk: '#4f8fe0', aciklama: 'Eşya güçlendirmede kullanılır.' },
  toz:      { ad: 'Ruh Tozu',        simge: 'toz', renk: '#b060e0', aciklama: 'Eşya eritince çıkar. Ek statları yeniden zarlamada kullanılır.' }
};

// ============================================================
// v0.12 — BECERİ EFEKTLERİ (efekt.js → G.FX içindeki adlar)
// ============================================================
(function () {
  var e = {
    yarma: 'kesik', kalkan_darbesi: 'kesik', hilal_kesik: 'kesik', kasirga: 'kasirga', savas_cigligi: 'guc', demir_irade: 'kalkan',
    ates_topu: 'ates', buz_mizragi: 'buz', alev_dalgasi: 'alev', gokatasi: 'meteor', mana_kalkani: 'kalkan',
    cift_atis: 'ok', zehirli_ok: 'zehir', ok_yagmuru: 'okyagmuru', delici_ok: 'cizgi', golge_adim: 'kalkan',
    ilk_yardim: 'sifa'
  };
  for (var k in e) if (G.BECERILER[k]) G.BECERILER[k].efekt = e[k];
})();
G.ILAHI.sinif.savasci.efekt = 'yildirim';
G.ILAHI.sinif.buyucu.efekt = 'yildiz';
G.ILAHI.sinif.okcu.efekt = 'ruzgar';

// ============================================================
// v0.13 — GİRİŞ EKRANLARI: sınıf hikayeleri, rastgele adlar, duyurular
// ============================================================
G.SINIFLAR.savasci.hikaye = 'Hunter Realms\'ın surlarını bin yıl boyunca savaşçılar tuttu. Güçlerini kaslarından değil, düşmeyi reddeden yüreklerinden alırlar. Kalabalığın ortasında dururlar ve kuşatıldıkça daha çok parlarlar.';
G.SINIFLAR.buyucu.hikaye = 'Kül Harabeleri\'nin kütüphanelerinden kaçırılan kitaplarla yetişen büyücüler, ateşi ve buzu aynı nefeste çağırır. Bedenleri kırılgandır ama bir dokunuşla dokuz kareyi alevlere boğarlar.';
G.SINIFLAR.okcu.hikaye = 'Sisli Orman\'ın izcileri rüzgarı okur, düşmanı daha yaklaşmadan vurur. Kuşatılmadan önce geri çekilmeyi, uzaktan öldürmeyi bilirler.';

G.AD_PARCALARI = {
  bas: ['Kara', 'Ak', 'Demir', 'Kor', 'Ay', 'Gök', 'Tuğ', 'Bora', 'Alp', 'Yağız', 'Tolun', 'Arslan', 'Buz', 'Ateş', 'Kıl', 'Sis', 'Yıldız', 'Kurt'],
  son: ['han', 'tay', 'bey', 'doğan', 'kılıç', 'ay', 'er', 'can', 'tekin', 'bars', 'kaya', 'tuğ', 'yürek', 'pençe', 'göz']
};

// Karşılama ekranındaki "Duyurular" (en yeni üstte)
G.DUYURULAR = [
  ['v0.13', 'Yeni giriş ekranları: karşılama, karakter seçimi ve oluşturma. Aynı cihazda 3 karakter.'],
  ['v0.12', 'Savaş efektleri: şimşek, alev, göktaşı, kılıç yayları. Yeni hasar sayıları.'],
  ['v0.11', 'Çanta ekranında karakter bebeği, 10 ekipman yuvası, bileklikler, çanta genişletme.'],
  ['v0.10', 'Maden etkinliği: ocak kap, arka planda kaz, rakip madencileri yağmala.'],
  ['v0.8', 'İlahi silah ve sınıfa özel ekipman görünümü.'],
  ['v0.7', 'Izgara savaşı: kuşatma, menzil, beceri şekilleri.'],
  ['v0.6', 'Dünya haritası, kasabalar ve seviye 42\'ye kadar bölgeler.']
];

// ============================================================
// v0.14 — BECERİ GELİŞTİRME (referanstaki gibi: kitap + sayfa + ustalık + altın)
// ============================================================
G.BECERI_MAKS = 8;
// Seviye lv'den lv+1'e geçmek için gereken ustalık. Aktif beceri her kullanımda +10,
// pasif beceri her öldürmede +1 ustalık kazanır.
G.USTALIK_GEREK = [0, 50, 120, 240, 400, 620, 900, 1250];
G.SARF.sayfa = { ad: 'Kitap Sayfası', simge: 'sayfa', renk: '#c9a86a', aciklama: 'Becerileri geliştirmede kullanılır. Canavarlardan sık düşer.' };
G.DUSME.sayfa = 18;          // normal canavardan kitap sayfası düşme şansı (%), 1-2 adet
G.DUSME.sayfaBoss = [8, 15]; // bosstan
G.KITAP_DUSME_NORMAL = 1.5;
// v0.14 denge: geliştirme pahalı olsun, hangi beceriyi yükselteceğini seçesin (simülasyonla ayarlandı)
G.USTALIK_GEREK = [0, 150, 400, 800, 1400, 2200, 3200, 4500];
G.SAYFA_CARPAN = 15;     // sayfa = 15 x seviye²  (1→2: 15, 4→5: 240, 7→8: 735)
G.ALTIN_CARPAN = 800;    // altın = 800 x seviye²
G.BECERILER.bilge.bonus = { tecrube: 3 };
G.BECERILER.hazine_avcisi.bonus = { altin: 4 };
G.DUSME.sayfa = 10;
G.ZORLUK.hpArtis = 0.095;
G.ZORLUK.expUs = 2.9;
G.BECERILER.alev_dalgasi.etki.carpan = 0.55; G.BECERILER.alev_dalgasi.etki.dot = 0.3;
G.BECERILER.gokatasi.etki.carpan = 1.5;

// ============================================================
// v0.15 — ANA GÖREV ZİNCİRİ (ana ekrandaki görev şeridi)
// t: seviye (n), oldur (n canavar, görev başladıktan sonra), boss (id), bolge (id), beceri (n öğren), ilahi (n)
// odul: para, hp, mp, tas, sayfa, parsomen, toz
// ============================================================
G.ANA_GOREV = [
  { t: 'seviye', n: 3,  odul: { para: 100, hp: 5 } },
  { t: 'oldur',  n: 30, odul: { para: 200, mp: 5 } },
  { t: 'boss',   id: 'kurt_kral', odul: { para: 500, tas: 3 } },
  { t: 'seviye', n: 6,  odul: { para: 500, sayfa: 20 } },
  { t: 'bolge',  id: 'kervansaray', odul: { para: 300, parsomen: 2 } },
  { t: 'beceri', n: 3,  odul: { sayfa: 30 } },
  { t: 'seviye', n: 10, odul: { para: 1500, tas: 5 } },
  { t: 'boss',   id: 'dev_bocek', odul: { para: 2000, tas: 5, sayfa: 40 } },
  { t: 'ilahi',  n: 1,  odul: { para: 2000 } },
  { t: 'seviye', n: 14, odul: { hp: 20, sayfa: 50 } },
  { t: 'bolge',  id: 'kale', odul: { para: 4000 } },
  { t: 'boss',   id: 'zincirli_iblis', odul: { para: 6000, tas: 8, sayfa: 80 } },
  { t: 'seviye', n: 20, odul: { para: 8000, sayfa: 80 } },
  { t: 'boss',   id: 'kara_ejder', odul: { para: 12000, tas: 10, sayfa: 120 } },
  { t: 'seviye', n: 25, odul: { para: 15000, sayfa: 120 } },
  { t: 'boss',   id: 'bataklik_timsahi', odul: { para: 18000, tas: 12, sayfa: 150 } },
  { t: 'seviye', n: 30, odul: { para: 22000, sayfa: 160 } },
  { t: 'boss',   id: 'ayaz_devi', odul: { para: 26000, tas: 14, sayfa: 180 } },
  { t: 'seviye', n: 35, odul: { para: 30000, sayfa: 200 } },
  { t: 'boss',   id: 'kor_titani', odul: { para: 35000, tas: 16, sayfa: 220 } },
  { t: 'seviye', n: 40, odul: { para: 40000, sayfa: 250 } },
  { t: 'boss',   id: 'hiclik_efendisi', odul: { para: 60000, tas: 20, sayfa: 300 } }
];

// ============================================================
// v0.16 — MERİDYEN (Karakter → Meridyen)
// 6 kademe x 10 nokta. Her nokta kalıcı stat verir; kademe numarası kadar güçlenir.
// ============================================================
G.MERIDYEN = {
  dugum: 10,
  kademeler: [
    { ad: 'Taş',    minLv: 5 },
    { ad: 'Tunç',   minLv: 12 },
    { ad: 'Demir',  minLv: 20 },
    { ad: 'Gümüş',  minLv: 27 },
    { ad: 'Altın',  minLv: 34 },
    { ad: 'Yıldız', minLv: 40 }
  ],
  // Her kademede noktaların sırayla verdiği stat ve miktarı (x kademe no)
  desen: ['hp', 'atk', 'def', 'hp', 'mp', 'atk', 'def', 'hp', 'atk', 'krit'],
  miktar: { hp: 14, atk: 2, def: 1.5, mp: 8, krit: 0.4 },
  altin: 400, altinUs: 1.35,     // nokta n'nin altını = altin x (n+1)^altinUs
  // Noktaların silüet üstündeki yerleri (yüzde): başın tepesinden ayaklara zikzak
  noktalar: [[50, 9], [40, 19], [60, 21], [53, 31], [38, 38], [58, 45], [44, 54], [62, 63], [41, 73], [58, 84]]
};
G.SARF.hap = { ad: 'Meridyen Hapı', simge: 'hap', renk: '#8a7ac0', aciklama: 'Meridyen noktalarını açmakta kullanılır. Canavarlardan, bosslardan ve ana görevlerden gelir.' };
G.DUSME.hap = 3;            // normal canavardan (%)
G.DUSME.hapBoss = [2, 4];   // bosstan
// Ana görevlerin 7.'sinden itibaren ödüllere hap ekle
G.ANA_GOREV.forEach(function (g, i) { if (i >= 6) g.odul.hap = 2 + Math.floor(i / 4); });
G.DUSME.hap = 1.2;   // v0.16 denge: hap çok birikiyordu

// ============================================================
// v0.18 — GÜNLÜK / HAFTALIK GÖREVLER ve AKTİFLİK SANDIKLARI
// sayac: oyunda sayılan olay. akt: görev alınınca verdiği aktiflik puanı
// git: "Git" düğmesinin götürdüğü yer
// ============================================================
G.GUNLUK = [
  { id: 'g_oldur',  ad: '200 canavar öldür',             sayac: 'oldur',     n: 200, akt: 20, git: 'savas' },
  { id: 'g_boss',   ad: '1 boss yen',                    sayac: 'boss',      n: 1,   akt: 20, git: 'savas' },
  { id: 'g_arit',   ad: '3 kez arıtma yap',              sayac: 'arit',      n: 3,   akt: 10, git: 'demirci' },
  { id: 'g_gucl',   ad: '1 kez başarıyla güçlendir',     sayac: 'guclendir', n: 1,   akt: 10, git: 'guclendir' },
  { id: 'g_maden',  ad: 'Madende 1 ocak kap',            sayac: 'maden',     n: 1,   akt: 10, git: 'maden' },
  { id: 'g_alis',   ad: 'Kasabadan 2 alışveriş yap',     sayac: 'alis',      n: 2,   akt: 10, git: 'kasaba' },
  { id: 'g_geri',   ad: '1 kez eşya sat ya da erit',     sayac: 'geri',      n: 1,   akt: 10, git: 'canta' },
  { id: 'g_iksir',  ad: '5 iksir iç',                    sayac: 'iksir',     n: 5,   akt: 10, git: 'savas' }
];
G.HAFTALIK = [
  { id: 'h_giris',  ad: '3 gün oyuna gir',               sayac: 'giris',     n: 3,    akt: 10, git: null },
  { id: 'h_oldur',  ad: '2000 canavar öldür',            sayac: 'oldur',     n: 2000, akt: 20, git: 'savas' },
  { id: 'h_boss',   ad: '10 boss yen',                   sayac: 'boss',      n: 10,   akt: 15, git: 'savas' },
  { id: 'h_arit',   ad: '10 kez arıtma yap',             sayac: 'arit',      n: 10,   akt: 15, git: 'demirci' },
  { id: 'h_maden',  ad: 'Madende 5 ocak kap',            sayac: 'maden',     n: 5,    akt: 15, git: 'maden' },
  { id: 'h_gucl',   ad: '10 kez başarıyla güçlendir',    sayac: 'guclendir', n: 10,   akt: 10, git: 'guclendir' },
  { id: 'h_mer',    ad: '2 meridyen noktası aç',         sayac: 'meridyen',  n: 2,    akt: 15, git: 'meridyen' }
];
// Sandıklar: aktiflik eşiği ve ödül. para ve sayfa seviyeyle çarpılır (x seviye)
G.SANDIK_GUNLUK = [
  { esik: 25,  odul: { paraLv: 60,  hp: 5 } },
  { esik: 50,  odul: { paraLv: 90,  tas: 2, sayfa: 10 } },
  { esik: 75,  odul: { paraLv: 120, toz: 20, hap: 1 } },
  { esik: 100, odul: { paraLv: 200, tas: 3, sayfa: 25, hap: 2 } }
];
G.SANDIK_HAFTALIK = [
  { esik: 25,  odul: { paraLv: 300, sayfa: 30 } },
  { esik: 50,  odul: { paraLv: 500, tas: 5, hap: 2 } },
  { esik: 75,  odul: { paraLv: 700, toz: 60, sayfa: 50 } },
  { esik: 100, odul: { paraLv: 1200, tas: 10, sayfa: 100, hap: 5 } }
];

// ============================================================
// v0.19 — BÖLÜMLER (Etkinlik → Bölümler). Görevler aynı anda ilerler.
// t: seviye, gp, toplamArti (kuşanılı eşyaların toplam +'sı), arit, maden, oldurId (id, n),
//    boss (id, n), nadir (en az bu nadirlikte n eşya bul), beceri, meridyen, ilahi
// Bir bölümün bütün ödülleri alınınca sonraki bölüm açılır.
// ============================================================
G.BOLUMLER = [
  { ad: 'Sisli Başlangıç', renk: ['#3a4030', '#15170f'], gorevler: [
    { t: 'seviye', n: 10, odul: { hp: 30 } },
    { t: 'gp', n: 400, odul: { para: 2000 } },
    { t: 'toplamArti', n: 3, odul: { tas: 5 } },
    { t: 'beceri', n: 2, odul: { sayfa: 10 } },
    { t: 'oldurId', id: 'kurt', n: 15, odul: { sayfa: 10 } },
    { t: 'oldurId', id: 'domuz', n: 15, odul: { sayfa: 10 } },
    { t: 'nadir', nadir: 2, n: 1, odul: { tas: 5 } },
    { t: 'boss', id: 'kurt_kral', n: 1, odul: { sayfa: 20, hap: 1 } }
  ] },
  { ad: 'Engerek Toprakları', renk: ['#40382a', '#17130d'], gorevler: [
    { t: 'seviye', n: 18, odul: { hp: 50 } },
    { t: 'gp', n: 1000, odul: { para: 6000 } },
    { t: 'toplamArti', n: 12, odul: { tas: 8 } },
    { t: 'arit', n: 10, odul: { toz: 40 } },
    { t: 'oldurId', id: 'engerek', n: 50, odul: { sayfa: 15 } },
    { t: 'oldurId', id: 'iskelet', n: 50, odul: { sayfa: 15 } },
    { t: 'nadir', nadir: 3, n: 1, odul: { tas: 8 } },
    { t: 'boss', id: 'dev_bocek', n: 1, odul: { sayfa: 30, hap: 2 } }
  ] },
  { ad: 'Kül ve Kan', renk: ['#42282a', '#170d0d'], gorevler: [
    { t: 'seviye', n: 25, odul: { hp: 80 } },
    { t: 'gp', n: 1800, odul: { para: 15000 } },
    { t: 'toplamArti', n: 25, odul: { tas: 12 } },
    { t: 'arit', n: 50, odul: { toz: 80 } },
    { t: 'maden', n: 5, odul: { hap: 3 } },
    { t: 'oldurId', id: 'zombi', n: 100, odul: { sayfa: 25 } },
    { t: 'nadir', nadir: 3, n: 3, odul: { tas: 12 } },
    { t: 'meridyen', n: 10, odul: { hap: 4 } },
    { t: 'boss', id: 'zincirli_iblis', n: 1, odul: { sayfa: 50, hap: 3 } }
  ] },
  { ad: 'Donmuş Sınır', renk: ['#2a3442', '#0d1117'], gorevler: [
    { t: 'seviye', n: 32, odul: { hp: 120 } },
    { t: 'gp', n: 2600, odul: { para: 30000 } },
    { t: 'toplamArti', n: 40, odul: { tas: 16 } },
    { t: 'arit', n: 120, odul: { toz: 150 } },
    { t: 'oldurId', id: 'buz_kurdu', n: 300, odul: { sayfa: 40 } },
    { t: 'ilahi', n: 15, odul: { para: 30000 } },
    { t: 'nadir', nadir: 4, n: 1, odul: { tas: 20 } },
    { t: 'boss', id: 'kara_ejder', n: 3, odul: { sayfa: 80, hap: 5 } }
  ] },
  { ad: 'Hiçliğin Eşiği', renk: ['#2e2638', '#0d0b12'], gorevler: [
    { t: 'seviye', n: 40, odul: { hp: 200 } },
    { t: 'gp', n: 3400, odul: { para: 60000 } },
    { t: 'toplamArti', n: 60, odul: { tas: 25 } },
    { t: 'arit', n: 250, odul: { toz: 250 } },
    { t: 'oldurId', id: 'golge_sovalye', n: 500, odul: { sayfa: 60 } },
    { t: 'meridyen', n: 40, odul: { hap: 8 } },
    { t: 'boss', id: 'kor_titani', n: 5, odul: { sayfa: 120, hap: 6 } },
    { t: 'boss', id: 'hiclik_efendisi', n: 1, odul: { para: 100000, sayfa: 200, hap: 10 } }
  ] }
];
// Her göreve sabit bir kimlik (kid) ver: kayıtta hangi ödülün alındığı bununla tutulur. (id = canavar kimliği)
G.BOLUMLER.forEach(function (b, i) { b.gorevler.forEach(function (g, j) { g.kid = 'b' + (i + 1) + '_' + (j + 1); }); });

// ============================================================
// v0.20 — KULE ve RÜNLER
// ============================================================
G.KULE = {
  katSayi: 6,                 // her kademede kat
  sure: 120,                  // saniye
  // Kademe başına bekçi şablonu (canavar kimliği)
  bekciler: ['orumcek', 'kaplan_yilan', 'zombi', 'gargoyl', 'curuk_ent', 'kar_trolu', 'ates_elementali', 'bosluk_canavari'],
  bekciHp: 10, bekciHpKat: 2,       // can çarpanı = bekciHp + (kat-1) x bekciHpKat
  bekciAtk: 1.3, bekciAtkKat: 0.05  // saldırı çarpanı
};
G.KULE.katToplam = G.KULE.bekciler.length * G.KULE.katSayi;

G.SARF.oz = { ad: 'Rün Özü', simge: 'run', renk: '#e8902a', aciklama: 'Rünleri yükseltmekte kullanılır. Kuleden ve rün eritmekten gelir.' };

// Rün tipleri: hangi statı verir, taban değer (Yeşil, Sv.1)
G.RUN_TUR = {
  saldiri:    { ad: 'Saldırı',    ikon: '🗡️', stat: 'atkYuzde',  taban: 2 },
  koruma:     { ad: 'Koruma',     ikon: '🛡️', stat: 'defYuzde',  taban: 3 },
  patlama:    { ad: 'Patlama',    ikon: '💥', stat: 'kritHasar', taban: 6 },
  siginak:    { ad: 'Sığınak',    ikon: '🏰', stat: 'hpYuzde',   taban: 3 },
  katliam:    { ad: 'Katliam',    ikon: '☠️', stat: 'krit',      taban: 1.2 },
  bagisiklik: { ad: 'Bağışıklık', ikon: '🩸', stat: 'canCal',    taban: 0.8 }
};
G.RUN_NADIR = { 1: 1, 2: 1.6, 3: 2.4, 4: 3.5 };   // İyi, Nadir, Destansı, Efsanevi
G.RUN_MAKS = 10;

// ============================================================
// v0.20.1 DENGE — gerçek bir oyuncu bütün eşyalarını güçlendirip set topluyor.
// Denge bu oyuncuya göre yeniden ayarlandı (simülasyondaki sanal oyuncu da artık güçlendiriyor).
// ============================================================
G.ZORLUK.hpCarpan = 1.8;          // canavar canı ek çarpanı (tam güçte)
G.ZORLUK.atkCarpan = 1.3;         // canavar saldırısı ek çarpanı (tam güçte)
G.ZORLUK.carpanBasLv = 6;         // bu seviyenin altındaki canavarlarda ek çarpan yok
G.ZORLUK.carpanTamLv = 14;        // bu seviyeden itibaren tam güç
G.ZORLUK.guclendirDusus = 10;     // her + seviyede başarı şansı bu kadar düşer (%)
G.ZORLUK.guclendirMin = 10;       // en düşük başarı şansı (%)
G.ZORLUK.guclendirDusmeArti = 5;  // bu + seviyeden itibaren başarısızlık seviye düşürür
G.DUSME.tas = 3;                  // Arıtma Taşı düşme şansı (%), önce 8
G.ZORLUK.expCarpan = 48;          // canavarlar güçlendi, savaşlar uzadı: seviye için gereken tecrübe azaldı (önce 60)

// ============================================================
// v0.21 DENGE — geç oyun duvarı, ekonomi, iksir ve ölüm cezası
// (Sınıf artışlarına dokunulmadı: okçu/büyücü zaten yükseltilmiş.)
// ============================================================
G.ZORLUK.gecLv = 24;              // bu seviyeden sonraki canavarlar yumuşatılır
G.ZORLUK.gecHp = 0.022;           // seviye başına can azalması (sv37: x0.71)
G.ZORLUK.gecAtk = 0.015;          // seviye başına saldırı azalması (sv37: x0.81)
G.ZORLUK.olumExp = 0.05;          // ölünce giden tecrübe oranı (önce 0.10)
G.ZORLUK.atkCarpan = 1.5;         // vuruşlar hissedilsin (önce 1.3)
G.ZORLUK.hpCarpan = 1.55;         // savaşlar uzamasın (önce 1.8)
G.ZORLUK.mpTur = 0.008;           // savaşta her tur en yüksek mananın bu kadarı dolar
G.IKSIR = { hpYuzde: 0.12, mpYuzde: 0.10 };  // iksirler sabit değere ek olarak en yüksek can/mananın bu kadarını doldurur
G.DUSME.esya = 6;                 // normal canavardan eşya düşme şansı (%), önce 28
G.NADIRLIK[1].sans = 20;          // İyi (önce 25)
G.NADIRLIK[2].sans = 6;           // Nadir (önce 10)
G.NADIRLIK[3].sans = 1.2;         // Destansı (önce 3)
G.NADIRLIK[4].sans = 0.15;        // Efsanevi (önce 0.5)
G.ZORLUK.altinCarpan = 1.3;       // canavardan düşen altın çarpanı
G.BOLUM_ACMA = 0.75;              // sonraki bölüm, öncekinin bu oranı alınınca açılır
G.MERIDYEN.hapCarpan = 2;         // meridyen hap bedeli = (kademe no) x bu
G.DUSME.hap = 0.7;                // Meridyen Hapı düşme şansı (%), önce 1.2
