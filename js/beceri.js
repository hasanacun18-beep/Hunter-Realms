// ============================================================
// beceri.js — v0.14: Beceriler (yuva yok, öğrenilen her beceri etkin)
// ============================================================
G.bekleme = {};   // becerilerin kalan bekleme turları (kaydedilmez)

// Becerinin verilen seviyedeki etkisi
G.beceriEtki = function (id, lv) {
  var b = G.BECERILER[id], e = {};
  for (var k in b.etki) e[k] = b.etki[k];
  for (var a in (b.artis || {})) e[a] = Math.round((e[a] + b.artis[a] * (lv - 1)) * 100) / 100;
  if (e.tip === 'hasar' && !e.sekil) e.sekil = 'tek';
  // v0.40: yüksek seviyelerde üst sınırlar (veri.js → G.BECERI_SINIR)
  var S = G.BECERI_SINIR;
  if (e.tip === 'kalkan' && !b.totem) e.oran = Math.min(e.oran, S.kalkan);
  if (e.tip === 'iyilesme') e.oran = Math.min(e.oran, S.iyilesme);
  ['isaret', 'deler', 'can', 'saldiri'].forEach(function (k) { if (e[k] != null) e[k] = Math.min(e[k], S[k]); });
  return e;
};

G.beceriAciklama = function (id, lv) {
  var b = G.BECERILER[id];
  if (b.tur === 'pasif') {
    return Object.keys(b.bonus).map(function (k) { return G.bonusYazi(k, Math.round(b.bonus[k] * G.pasifSeviye(lv) * 10) / 10); }).join(', ');
  }
  var e = G.beceriEtki(id, lv), p = [];
  if (e.tip === 'hasar') {
    var sekil = { yarimay: 'öndeki 3 kareye ', kasirga: 'etrafındaki 8 kareye ', alan: 'hedef ve çevresindeki 9 kareye ', cizgi: 'bir yönde 4 kareyi delerek ', coklu: 'en fazla ' + Math.floor(e.adet || 5) + ' canavara ' }[e.sekil] || '';
    p.push(sekil + '%' + Math.round(e.carpan * 100) + ' hasar' + (e.vurus > 1 ? ', ' + e.vurus + ' vuruş' : ''));
    if (e.sersem) p.push(e.sersem + ' tur sersemletir (bosslar dirençli)');
    if (e.dot) p.push(e.sure + ' tur boyunca her tur %' + Math.round(e.dot * 100) + ' ek hasar (' + (e.sekil === 'yarimay' ? 'kanama' : 'süreli') + '), savunmayı deler');
    if (e.sicrama) p.push(e.sicrama + ' kareye kadar uzaktaki hedefin yanına sıçrar');
    if (e.anaEk) p.push('Ana hedef %' + e.anaEk + ' fazla hasar alır');
    if (e.bomba) p.push(e.bombaSure + ' tur sonra hedefte patlar: %' + Math.round(e.bomba * 100) + ' hasar, ardından ' + e.yavas + ' tur yavaşlatır');
    if (e.deler) p.push('Hedefin savunmasının %' + e.deler + ' kadarını yok sayar');
  } else if (e.tip === 'iyilesme') p.push('Canının %' + e.oran + ' kadarını yeniler');
  else if (e.tip === 'kalkan' && e.oran >= 100) {
    p.push((e.patlama ? 'Etrafındaki 8 kareye %' + Math.round(e.patlama * 100) + ' hasar' : '') +
      (e.patlama ? ', ardından ' : '') + 'saldırıya uğradığın ' + e.sure + ' tur boyunca hasara karşı bağışık olursun');
  }
  else if (e.tip === 'kalkan') {
    p.push(e.sure + ' tur alınan hasar %' + e.oran + ' azalır');
    if (e.iyilesme) p.push('Anında canının %' + e.iyilesme + ' kadarını yeniler');
    if (e.isaret) p.push('En yakın ' + e.isaretAdet + ' canavarı işaretler: ' + e.isaretSure + ' tur savunmaları %' + e.isaret + ' düşer');
  }
  else if (e.tip === 'cagir') {
    var yt = G.YARATIKLAR.filter(function (y) { return lv >= y.lv; }).pop();
    p.push(yt.ad + ' çağırır: canı, senin canının %' + e.can + ' kadarı; her tur senin hasarının %' + e.saldiri + ' kadarıyla vurur');
    p.push('Canavar vuruşlarının %' + e.kalkanSans + ' kadarını o üstlenir. Bölge değişince kaybolur');
  }
  else if (e.tip === 'mayin') {
    p.push('Hedef ve çevresindeki 9 kareye ' + e.sure + ' tur kalan mayın döşer');
    p.push('Basan canavar %' + Math.round(e.carpan * 100) + ' hasar alır ve kusur kazanır; ' + Math.max(1, Math.round(e.kusur)) + ' kusurda 2 tur sersemler (bosslar hariç)');
  }
    else if (e.tip === 'peri') p.push(e.sure + ' tur boyunca her tur ' + e.adet + ' peri rastgele canavarlara %' + Math.round(e.carpan * 100) + ' hasar verir');
  else if (e.tip === 'guc') p.push(e.sure + ' tur saldırın %' + e.oran + ' artar');
  return p.join('. ') + '.';
};

// Bu sınıfın öğrenebileceği tüm beceriler
G.sinifBecerileri = function (sinif) {
  return Object.keys(G.BECERILER).filter(function (id) {
    var b = G.BECERILER[id];
    return !b.sinif || b.sinif === sinif;
  });
};

// Öğrenilmiş beceriler (sınıf listesi sırasıyla). tur: 'aktif' veya 'pasif'
G.ogrenilenler = function (tur) {
  var o = G.o;
  return G.sinifBecerileri(o.sinif).filter(function (id) { return o.beceriler[id] && (!tur || G.BECERILER[id].tur === tur); });
};

// Otomatik kullanım sırası: uzun beklemeli (güçlü) beceriler önce, sık olanlar arayı doldurur
G.aktifBeceriler = function () {
  return G.ogrenilenler('aktif').sort(function (a, b) { return G.BECERILER[b].bekleme - G.BECERILER[a].bekleme; });
};

G.otoAcikMi = function (id) { return !(G.o.otoKapali || {})[id]; };
G.otoDegistir = function (id) {
  var o = G.o;
  o.otoKapali = o.otoKapali || {};
  if (o.otoKapali[id]) delete o.otoKapali[id]; else o.otoKapali[id] = true;
  G.kaydet(); G.panelYenile();
};

// ---- Geliştirme şartları (seviye lv'den lv+1'e) ----
G.ustalikGerek = function (lv) { return G.USTALIK_GEREK[lv] || 9999; };
G.kitapGerek = function (lv) { return lv; };
G.sayfaGerek = function (lv) { return G.SAYFA_CARPAN * lv * lv; };
G.altinGerek = function (lv) { return G.ALTIN_CARPAN * lv * lv; };

G.ustalikEkle = function (id, n) {
  var o = G.o, lv = o.beceriler[id];
  if (!lv || lv >= G.beceriSayfaMaks(id)) return;
  o.ustalik[id] = Math.min(G.ustalikGerek(lv), (o.ustalik[id] || 0) + n);
};

// Hangi şartlar eksik? Boş liste = geliştirilebilir
G.gelistirEksik = function (id) {
  var o = G.o, lv = o.beceriler[id], eksik = [];
  if (!lv) return ['Önce kitabını bulmalısın'];
  if (lv >= G.beceriSayfaMaks(id)) return ['En yüksek seviyede'];
  if ((o.ustalik[id] || 0) < G.ustalikGerek(lv)) eksik.push('ustalık');
  if ((o.kitaplar[id] || 0) < G.kitapGerek(lv)) eksik.push('kitap');
  if (o.sarf.sayfa < G.sayfaGerek(lv)) eksik.push('sayfa');
  if (o.para < G.altinGerek(lv)) eksik.push('altın');
  return eksik;
};

G.beceriGelistir = function (id) {
  var o = G.o, b = G.BECERILER[id], lv = o.beceriler[id], eksik = G.gelistirEksik(id);
  if (eksik.length) { G.bildir('Eksik: ' + eksik.join(', ')); return false; }
  o.kitaplar[id] -= G.kitapGerek(lv);
  o.sarf.sayfa -= G.sayfaGerek(lv);
  o.para -= G.altinGerek(lv);
  o.ustalik[id] = 0;
  o.beceriler[id] = lv + 1;
  G.log(G.ikon('kitap') + ' ' + b.ad + ' seviye ' + (lv + 1) + '!', 'sistem');
  G.bildir(b.ad + ' seviye ' + (lv + 1));
  G.kaydet(); G.panelYenile(); G.ustGuncelle();
  return true;
};

// Canavar seviyesine uygun rastgele kitap
G.kitapDus = function (canLv) {
  var o = G.o, adaylar = G.sinifBecerileri(o.sinif).filter(function (id) {
    var b = G.BECERILER[id];
    return b.minLv <= canLv + 2 && (!b.totem || o.beceriler[id]);   // totem kitabı ancak açıldıktan sonra düşer
  });
  if (!adaylar.length) return;
  G.kitapOgren(adaylar[Math.floor(Math.random() * adaylar.length)]);
};

// Kitap düştü: ilk kitap beceriyi açar, sonrakiler geliştirme için birikir
G.kitapOgren = function (id) {
  var o = G.o, b = G.BECERILER[id], mevcut = o.beceriler[id] || 0;
  if (!mevcut) {
    o.beceriler[id] = 1;
    G.log(G.ikon('kitap') + ' Yeni beceri: ' + b.ad + '!', 'sistem');
    G.bildir('Yeni beceri: ' + b.ad);
  } else if (mevcut >= G.beceriSayfaMaks(id)) {
    o.sarf.toz += G.KITAP_FAZLA_TOZ;
    G.log(G.ikon('kitap') + ' ' + b.ad + ' kitabı (en üst seviyede): +' + G.KITAP_FAZLA_TOZ + ' Ruh Tozu');
  } else {
    o.kitaplar[id] = (o.kitaplar[id] || 0) + 1;
    G.log(G.ikon('beceri_kitabi') + ' ' + b.ad + ' kitabı bulundu (' + o.kitaplar[id] + ')');
  }
  G.kaydet();
  if (G.sekme === 'karakter' || G.sekme === 'savas') G.panelYenile();
};

// ---- v0.37: Totem becerileri — seviye yetince kendiliğinden açılır ----
// sessiz: kayıt yüklenirken (G.gocEt) günlüğe yazmadan aç
G.totemKontrol = function (o, sessiz) {
  G.sinifBecerileri(o.sinif).forEach(function (id) {
    var b = G.BECERILER[id];
    if (!b.totem || o.beceriler[id] || o.lv < b.minLv) return;
    o.beceriler[id] = 1;
    if (sessiz) return;
    G.log(b.ikon + ' Totem becerisi açıldı: <b>' + b.ad + '</b>!', 'sistem');
    G.bildir('Totem açıldı: ' + b.ad);
    G.sesCal('basari');
  });
};

// ---- v0.40: Beceri seviye sınırı ve ekipmandan "+1 Tüm beceriler" ----
// Beceri sayfasından çıkılabilecek en yüksek seviye
G.beceriSayfaMaks = function (id) { return G.BECERILER[id].totem ? G.TOTEM_MAKS : G.BECERI_MAKS; };

// Kuşanılan eşyalardaki "+Tüm beceriler" toplamı
G.ekipmanBeceri = function (o) {
  var t = 0;
  for (var k in o.kusanilan) {
    var e = o.kusanilan[k];
    if (e) (e.ek || []).forEach(function (x) { if (x.k === 'tumBeceri') t += x.v; });
  }
  return t;
};

// Becerinin savaşta kullanılan (etkin) seviyesi: sayfa seviyesi + ekipman, en fazla BECERI_TOPLAM_MAKS
G.beceriSeviye = function (id, o) {
  o = o || G.o;
  var lv = o.beceriler[id] || 0;
  if (!lv || G.BECERILER[id].totem) return lv;
  return Math.min(G.BECERI_TOPLAM_MAKS, lv + G.ekipmanBeceri(o));
};

// Pasif bonus çarpanı: sayfa sınırının üstündeki seviyeler yarım sayılır
G.pasifSeviye = function (lv) {
  return Math.min(lv, G.BECERI_MAKS) + Math.max(0, lv - G.BECERI_MAKS) * G.PASIF_UST_CARPAN;
};
