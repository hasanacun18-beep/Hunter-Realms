// ============================================================
// durum.js — Oyuncu verisi, stat hesabı, kayıt/yükleme
// ============================================================
G.KAYIT_ANAHTARI = 'karadiyar_kayit_v1';   // v0.13 öncesi tek kayıt (1. yuvaya taşınır)
G.SLOT_SAYI = 3;
G.aktifSlot = 0;
G.slotAnahtar = function (i) { return 'karadiyar_slot_' + i; };
G.o = null;        // oyuncu
G.alan = [];       // ekrandaki 6 canavar
G.savas = null;    // aktif savaş
G.loglar = [];

G.rastgele = function (a, b) { return a + Math.floor(Math.random() * (b - a + 1)); };

G.yeniOyuncu = function (ad, sinif) {
  var o = {
    surum: 1, ad: ad, sinif: sinif, lv: 1, exp: 0, para: 50, puan: 0,
    stat: { guc: 0, day: 0, zeka: 0, cev: 0 },
    hp: null, mp: null,
    kusanilan: { silah: null, kask: null, zirh: null, kolye: null, yuzuk: null, kemer: null, cizme: null },
    canta: [], sarf: { hp: 5, mp: 3, tas: 2 },
    bolge: 'koy', sonrakiId: 1,
    ayar: { otoIksir: true, otoSavas: false, ses: true },
    istatistik: { oldurme: 0, olum: 0 }
  };
  G.gocEt(o);
  o.kusanilan.silah = G.esyaOlustur(o, G.sablonBul('Paslı Kılıç'), 0);
  o.kusanilan.zirh = G.esyaOlustur(o, G.sablonBul('Kumaş Zırh'), 0);
  return o;
};

// Eski kayıtlara yeni sürümlerin alanlarını ekler. Yeni alan eklersen buraya da yaz.
G.gocEt = function (o) {
  if (o.sarf.toz == null) o.sarf.toz = 0;
  if (!o.ayar.canta) o.ayar.canta = { sira: 'yeni', filtre: 'hepsi' };
  // v0.4 beceriler
  if (!o.beceriler) {
    var bas = G.SINIFLAR[o.sinif].baslangic;
    o.beceriler = {}; o.beceriler[bas] = 1;
    o.aktifYuva = [bas, null, null];
    o.pasifYuva = [null, null];
  }
  if (o.uzmanlik == null) o.uzmanlik = null; // v0.44: seviye 10 sınıf uzmanlığı
  if (o.ayar.otoBeceri == null) o.ayar.otoBeceri = true;
  if (o.ayar.ses == null) o.ayar.ses = true;   // v0.24
  if (!o.bossZaman) o.bossZaman = {};          // v0.30: { bossId: yeniden doğacağı zaman (ms) }
  if (!o.galeri) o.galeri = {};                // v0.32: { canavarId: alınan galeri kademesi }
  if (!o.mitik) o.mitik = { acik: {}, parca: {}, oz: 0 };   // v0.33: efsanevi set
  if (!o.unvan) o.unvan = { kazanilan: {}, takili: null };   // v0.34: unvanlar
  if (o.beceriler) G.totemKontrol(o, true);   // v0.37: seviyesi yeten eski karakterlere totem
  // v0.40: totemler en fazla G.TOTEM_MAKS seviyede
  for (var tid in o.beceriler || {}) if (G.BECERILER[tid] && G.BECERILER[tid].totem && o.beceriler[tid] > G.TOTEM_MAKS) o.beceriler[tid] = G.TOTEM_MAKS;
  if (!o.kitapSayfa) o.kitapSayfa = {};
  // v0.14 beceri geliştirme
  if (!o.kitaplar) o.kitaplar = JSON.parse(JSON.stringify(o.kitapSayfa));
  if (!o.ustalik) o.ustalik = {};
  if (!o.otoKapali) o.otoKapali = {};
  if (o.sarf.sayfa == null) o.sarf.sayfa = 0;
  // v0.15 ana görev
  if (!o.gorev) o.gorev = { i: 0, taban: o.istatistik.oldurme };
  if (!o.istatistik.bosslar) o.istatistik.bosslar = {};
  // v0.20 kule ve rünler
  if (!o.kule) o.kule = { enYuksek: 0, gunluk: '' };
  if (!o.runler) o.runler = [];
  if (!o.runTakili) o.runTakili = {};
  if (o.sarf.oz == null) o.sarf.oz = 0;
  if (o.bolge === 'kule') o.bolge = o.sonKasaba || 'koy';   // kulede kapatıldıysa
  // v0.19 bölümler ve kalıcı sayaçlar
  if (!o.bolum) o.bolum = { alinan: {} };
  if (!o.istatistik.sayac) o.istatistik.sayac = {};
  if (!o.istatistik.oldurId) o.istatistik.oldurId = {};
  if (!o.istatistik.bulunan) o.istatistik.bulunan = {};
  // v0.16 meridyen
  if (o.meridyen == null) o.meridyen = 0;
  if (o.sarf.hap == null) o.sarf.hap = 0;
  if (!o.gezilen) { o.gezilen = {}; o.gezilen[o.bolge] = 1; o.gezilen[o.sonKasaba] = 1; }
  // v0.6 dünya
  if (!o.sonKasaba) o.sonKasaba = 'koy';
  if (o.sarf.parsomen == null) o.sarf.parsomen = 1;
  // v0.8 maden ve ilahi silah
  if (!o.maden) o.maden = { enerji: G.MADEN.enerjiMaks, son: Date.now(), cevher: {}, kazi: null, v: 2 };
  if (o.ilahi == null) o.ilahi = 0;
  // v0.10 maden etkinliği: enerji 1000 üzerinden
  if (o.maden.v !== 2) { o.maden.enerji = Math.min(1000, o.maden.enerji * 10); o.maden.kazi = null; o.maden.v = 2; }
  if (typeof o.bolge === 'string' && o.bolge.indexOf('maden') === 0) o.bolge = o.sonKasaba;
  // v0.11: yeni yuvalar ve çanta kapasitesi
  G.YUVALAR.forEach(function (y) { if (!(y.id in o.kusanilan)) o.kusanilan[y.id] = null; });
  if (!o.cantaLimit) o.cantaLimit = G.CANTA.baslangic;
  // v0.35: su verme — eski eşyalar da rastgele bir ilk cila alır
  // v0.36: e.su (stat değeri) → e.so (yüzde oran); Su Verme Taşı → cila taşı
  G.CILA_TASLARI.forEach(function (t) { if (o.sarf[t.id] == null) o.sarf[t.id] = 0; });
  if (o.sarf.besRenk == null) o.sarf.besRenk = 0;   // v0.42
  if (o.sarf.suTasi) o.sarf[G.SUVERME.eskiTas] += o.sarf.suTasi;
  delete o.sarf.suTasi;
  o.canta.concat(Object.keys(o.kusanilan).map(function (k) { return o.kusanilan[k]; })).forEach(function (e) {
    if (e && e.nadir >= G.RUHDOKUM.nadir && !e.ruh) e.ruh = G.ruhYeni();   // v0.42: eski Efsanevi eşyalara element
    if (!e || e.so) return;
    if (e.su) {
      var m = G.suMaks(e); e.so = {};
      for (var k in m) e.so[k] = Math.round(Math.min(1, (e.su[k] || 0) / m[k]) * 100);
      delete e.su;
    } else e.so = G.suUret(e);
  });
  return o;
};

G.expGerekli = function (lv) { return Math.floor(G.ZORLUK.expCarpan * Math.pow(lv, G.ZORLUK.expUs)); };

// Tüm stat hesabı tek yerde: seviye + stat puanı + ekipman + ek statlar + setler
G.hesapla = function (o) {
  var s = G.SINIFLAR[o.sinif], b = s.taban, a = s.artis, L = o.lv - 1;
  var r = {
    hpMax: b.hp + a.hp * L + o.stat.day * 12,
    mpMax: b.mp + a.mp * L + o.stat.zeka * 8,
    atkMin: b.atkMin + a.atk * L + o.stat.guc,
    atkMax: b.atkMax + a.atk * L + o.stat.guc,
    def: b.def + a.def * L + o.stat.day,
    hiz: b.hiz + o.stat.cev,
    krit: b.krit + o.stat.cev * 0.5,
    beceriBonus: o.stat.zeka * 0.01,
    kritHasar: 0, canCal: 0, altin: 0, tecrube: 0, beceri: 0, ekVurus: 0,
    atkYuzde: 0, hpYuzde: 0, defYuzde: 0,
    setler: []
  };
  function ekle(k, v) {
    switch (k) {
      case 'atk': r.atkMin += v; r.atkMax += v; break;
      case 'def': r.def += v; break;
      case 'hp':  r.hpMax += v; break;
      case 'mp':  r.mpMax += v; break;
      default:    r[k] = (r[k] || 0) + v;
    }
  }
  for (var k in o.kusanilan) {
    var e = o.kusanilan[k];
    if (!e) continue;
    var st = G.esyaStat(e);
    for (var sk in st) ekle(sk, st[sk]);
    (e.ek || []).forEach(function (x) { ekle(x.k, x.v); });
  }
  // Takılı rünler
  if (o.runTakili) for (var rt in o.runTakili) { var rn = (o.runler || []).filter(function (x) { return x.id === o.runTakili[rt]; })[0]; if (rn) ekle(G.RUN_TUR[rn.tur].stat, G.runDeger(rn)); }
  // Meridyen
  if (o.meridyen) { var ms = G.meridyenStat(o.meridyen); for (var mk in ms) ekle(mk, ms[mk]); }
  // İlahi silah
  if (o.ilahi) { var il = G.ilahiStat(o.ilahi); ekle('atk', il.atk); ekle('hp', il.hp); ekle('mp', il.mp); }
  if (o.galeri) { var gs = G.galeriStat(o.galeri); for (var gk in gs) ekle(gk, gs[gk]); }   // v0.32
  if (o.mitik) { var ms2 = G.mitikStat(o); for (var mk2 in ms2) ekle(mk2, ms2[mk2]); }   // v0.33
  var un = o.unvan && o.unvan.takili && G.unvanBul(o.unvan.takili);   // v0.34: takılı unvan
  if (un) for (var uk in un.stat) ekle(uk, un.stat[uk]);
  var ruh = G.ruhStat(o);   // v0.42: ruh dökümü (sabit savunma doğrudan savunmaya)
  for (var rk in ruh) ekle(rk === 'sabitDef' ? 'def' : rk, ruh[rk]);
  // v0.44: seçilen sınıf uzmanlığının kalıcı bonusları
  if (o.uzmanlik && G.uzmanlikBul) {
    var uz = G.uzmanlikBul(o.sinif, o.uzmanlik);
    if (uz) for (var uk2 in uz.bonus) ekle(uk2, uz.bonus[uk2]);
  }
  // Pasif beceriler (sadece açık yuvalardakiler)
  // Öğrenilen bütün pasif beceriler etkin
  Object.keys(o.beceriler || {}).forEach(function (id) {
    var bc = G.BECERILER[id], blv = G.beceriSeviye(id, o);   // v0.40: ekipman dahil etkin seviye
    if (!bc || bc.tur !== 'pasif' || (bc.sinif && bc.sinif !== o.sinif)) return;
    if (!bc || !blv) return;
    for (var bk in bc.bonus) ekle(bk, bc.bonus[bk] * G.pasifSeviye(blv));
  });
  // Set bonusları
  var sayilar = G.setSayilari(o);
  for (var sid in sayilar) {
    var set = G.SETLER[sid], adet = sayilar[sid];
    r.setler.push({ id: sid, adet: adet });
    for (var esik in set.bonus) {
      if (adet >= +esik) for (var bk in set.bonus[esik]) ekle(bk, set.bonus[esik][bk]);
    }
  }
  // Yüzdelik bonuslar en sonda uygulanır
  r.atkMin = Math.round(r.atkMin * (1 + r.atkYuzde / 100));
  r.atkMax = Math.round(r.atkMax * (1 + r.atkYuzde / 100));
  r.hpMax = Math.round(r.hpMax * (1 + r.hpYuzde / 100));
  r.def = Math.round(r.def * (1 + r.defYuzde / 100));
  r.krit = Math.min(75, r.krit);
  r.canCal = Math.min(20, r.canCal);
  r.cp = Math.round(r.atkMin + r.atkMax + r.def * 3 + r.hpMax / 5 + r.mpMax / 10 + r.hiz * 2 +
    r.krit * 4 + r.kritHasar + r.canCal * 6 + r.beceri + (r.tekrar || 0) * 2 + (r.tumBeceri || 0) * 20 +
    (r.hasarAzalt || 0) * 8 + (r.hasarArtir || 0) * 8 + (r.kacinma || 0) * 4 + (r.blitz || 0) * 3 + (r.direnc || 0) * 3 + (r.sabitHasar || 0) * 2);
  r.krit = Math.round(r.krit * 10) / 10;
  return r;
};

// Hangi setten kaç parça kuşanılı
G.setSayilari = function (o) {
  var say = {};
  for (var k in o.kusanilan) {
    var e = o.kusanilan[k];
    if (!e) continue;
    var set = G.ESYALAR[e.sablon].set;
    if (set) say[set] = (say[set] || 0) + 1;
  }
  return say;
};

G.expEkle = function (miktar) {
  var o = G.o;
  o.exp += miktar;
  var atladi = false;
  while (o.exp >= G.expGerekli(o.lv)) {
    o.exp -= G.expGerekli(o.lv);
    o.lv++; o.puan += 5; atladi = true;
  }
  if (atladi) {
    var r = G.hesapla(o);
    o.hp = r.hpMax; o.mp = r.mpMax;
    G.log('Seviye atladın! Artık seviye ' + o.lv + '. 5 stat puanın var.', 'sistem');
    G.bildir('Seviye ' + o.lv + '!');
    G.sesCal('seviye');
    G.totemKontrol(o);   // v0.37
    if (G.sekme === 'karakter') G.cizKarakter();
  }
};

G.statArtir = function (k) {
  var o = G.o;
  if (o.puan <= 0 || !(k in o.stat)) return;
  o.stat[k]++; o.puan--;
  G.kaydet(); G.cizKarakter(); G.ustGuncelle();
};

// ---- v0.13: 3 karakter yuvası ----
G.kaydet = function () {
  if (!G.o) return;
  if (G.unvanKontrol) G.unvanKontrol();   // v0.34: yeni kazanılan unvan var mı
  try { localStorage.setItem(G.slotAnahtar(G.aktifSlot), JSON.stringify(G.o)); }
  catch (e) { console.warn('Kayıt başarısız:', e); }
};

G.slotYukle = function (i) {
  try {
    var s = localStorage.getItem(G.slotAnahtar(i));
    return s ? JSON.parse(s) : null;
  } catch (e) { console.warn('Kayıt okunamadı:', e); return null; }
};

// Eski tek kaydı 1. yuvaya taşı (bir kez)
G.eskiKayitTasi = function () {
  try {
    var eski = localStorage.getItem(G.KAYIT_ANAHTARI);
    if (eski && !localStorage.getItem(G.slotAnahtar(0))) localStorage.setItem(G.slotAnahtar(0), eski);
    if (eski) localStorage.removeItem(G.KAYIT_ANAHTARI);
    var a = +localStorage.getItem('karadiyar_aktif');
    G.aktifSlot = a >= 0 && a < G.SLOT_SAYI ? a : 0;
  } catch (e) {}
};

G.karakterSil = function (i) {
  var k = G.slotYukle(i);
  if (!k) return;
  if (!confirm(k.ad + ' (seviye ' + k.lv + ') tamamen silinecek. Geri alınamaz. Emin misin?')) return;
  try { localStorage.removeItem(G.slotAnahtar(i)); } catch (e) {}
  G.cizSecim();
};

// Oyundan karakter seçimine dön (sayfa yenilenir, zamanlayıcılar temiz başlar)
G.secimeDon = function () {
  G.kaydet();
  location.hash = 'secim';
  location.reload();
};
