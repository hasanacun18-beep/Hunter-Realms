// ============================================================
// esya.js — Eşya üretme, kuşanma, satma, güçlendirme
// ============================================================
G.sablonBul = function (ad) {
  for (var i = 0; i < G.ESYALAR.length; i++) if (G.ESYALAR[i].ad === ad) return i;
  return 0;
};

G.esyaOlustur = function (o, sablon, nadir) {
  var s = G.ESYALAR[sablon];
  if (s.set) nadir = Math.max(nadir, 2);   // set parçaları en az Nadir
  var e = { id: o.sonrakiId++, sablon: sablon, nadir: nadir, arti: 0, ek: G.ekStatUret(s, G.EK_SAYISI[nadir]) };
  e.so = G.suUret(e);   // v0.35: su verme oranları, rastgele ilk cila
  if (e.nadir >= G.RUHDOKUM.nadir) e.ruh = G.ruhYeni();   // v0.42: Efsanevi eşyaya element
  return e;
};

// ---- v0.35: Su verme (veri.js → G.SUVERME) ----
// Kayıtta e.so = { stat: yüzde 0-100 } — her temel statın en fazla su verme bonusuna oranı.
// Eşyanın su verme ile alabileceği en fazla temel stat bonusları: { atk: 12, def: 9 }
G.suMaks = function (e) {
  var s = G.ESYALAR[e.sablon], n = G.NADIRLIK[e.nadir], m = {};
  for (var k in G.STAT_ADLARI) if (s[k]) m[k] = Math.max(1, Math.round(s[k] * n.carpan * G.SUVERME.oran));
  return m;
};
// Yeni eşyanın ilk oranları: her stat için rastgele (çoğunlukla düşük)
G.suUret = function (e) {
  var so = {};
  for (var k in G.suMaks(e)) so[k] = Math.round(Math.pow(Math.random(), G.SUVERME.ilkUs) * 100);
  return so;
};
// Statların şu anki su verme bonusu: { atk: 4, def: 2 }
G.suDeger = function (e) {
  var m = G.suMaks(e), d = {};
  for (var k in m) d[k] = Math.round(m[k] * ((e.so && e.so[k]) || 0) / 100);
  return d;
};
// Cila değeri (%): oranların ortalaması
G.cila = function (e) {
  var m = G.suMaks(e), top = 0, n = 0;
  for (var k in m) { top += (e.so && e.so[k]) || 0; n++; }
  return n ? Math.round(top / n) : 0;
};

// Aynı stat iki kez gelmez. Silahta savunma, zırhta saldırı gibi tuhaflıklar serbest: sürpriz iyidir.
G.ekStatUret = function (s, adet, haric) {
  haric = haric || [];
  var anahtarlar = Object.keys(G.EK_STATLAR).filter(function (k) { return haric.indexOf(k) < 0; }), ek = [];
  while (ek.length < adet && anahtarlar.length) {
    // v0.40: ağırlıklı seçim (agirlik yoksa 1) — "+1 Tüm beceriler" nadir çıkar
    var top = 0, r = 0, j = 0;
    anahtarlar.forEach(function (a) { top += G.EK_STATLAR[a].agirlik || 1; });
    r = Math.random() * top;
    for (j = 0; j < anahtarlar.length - 1; j++) { r -= G.EK_STATLAR[anahtarlar[j]].agirlik || 1; if (r < 0) break; }
    var k = anahtarlar.splice(j, 1)[0];
    var d = G.EK_STATLAR[k];
    var v = G.rastgele(d.min, d.maks) + s.lv * d.lvArtis * (0.6 + Math.random() * 0.4);
    ek.push({ k: k, v: Math.max(1, Math.round(v)) });
  }
  return ek;
};

// Bir setten rastgele parça
G.setParcaUret = function (o, setId, bonus) {
  var adaylar = [];
  G.ESYALAR.forEach(function (s, i) { if (s.set === setId) adaylar.push(i); });
  if (!adaylar.length) return null;
  return G.esyaOlustur(o, adaylar[Math.floor(Math.random() * adaylar.length)], G.nadirlikSec(bonus));
};

G.bonusYazi = function (k, v) {
  return '+' + (G.YUZDE_STATLAR[k] ? '%' : '') + v + ' ' + G.BONUS_ADLARI[k];
};

// Yüksek nadirlikten başlayarak zar at
G.nadirlikSec = function (bonus) {
  for (var i = G.NADIRLIK.length - 1; i > 0; i--) {
    if (Math.random() * 100 < G.NADIRLIK[i].sans * bonus) return i;
  }
  return 0;
};

// Canavar seviyesine uygun rastgele eşya
G.esyaUret = function (o, canLv, bonus) {
  var adaylar = [];
  G.ESYALAR.forEach(function (s, i) {
    if (!s.set && s.lv <= canLv + 1 && s.lv >= canLv - 9) adaylar.push(i);
  });
  if (!adaylar.length) adaylar = [0];
  var idx = adaylar[Math.floor(Math.random() * adaylar.length)];
  return G.esyaOlustur(o, idx, G.nadirlikSec(bonus));
};

G.esyaStat = function (e) {
  var s = G.ESYALAR[e.sablon], n = G.NADIRLIK[e.nadir], st = {}, su = G.suDeger(e);
  for (var k in G.STAT_ADLARI) {
    if (s[k]) st[k] = Math.max(1, Math.round((s[k] * n.carpan + (su[k] || 0)) * (1 + 0.12 * e.arti)));
  }
  return st;
};

// Sınıfa göre ad ve simge (veri.js → G.SINIF_GORUNUM)
G.gorunum = function (sablon) {
  var s = G.ESYALAR[sablon], g = G.SINIF_GORUNUM[s.ad], v = g && G.o && g[G.o.sinif];
  return v ? { ad: v[0], ikon: v[1] } : { ad: s.ad, ikon: s.ikon };
};

G.esyaAd = function (e) {
  return G.gorunum(e.sablon).ad + (e.arti ? ' +' + e.arti : '');
};

G.esyaRenkliAd = function (e) {
  return '<span style="color:' + G.NADIRLIK[e.nadir].renk + '">' + G.esyaAd(e) + '</span>';
};

G.satisDegeri = function (e) {
  var s = G.ESYALAR[e.sablon];
  return Math.round((s.lv * 4 + 6) * (e.nadir + 1) * (1 + e.arti * 0.3) * (s.set ? 2 : 1));
};

G.guclendirSans = function (arti) { return Math.max(G.ZORLUK.guclendirMin, 100 - arti * G.ZORLUK.guclendirDusus); };
G.guclendirMaliyet = function (e) {
  var s = G.ESYALAR[e.sablon];
  return Math.round((s.lv * 5 + 20) * (e.nadir + 1) * (e.arti + 1) * 0.6);
};

// id ile çantada veya üstünde ara
G.esyaBul = function (id) {
  var o = G.o;
  for (var i = 0; i < o.canta.length; i++) if (o.canta[i].id === id) return { e: o.canta[i], yer: 'canta', i: i };
  for (var k in o.kusanilan) if (o.kusanilan[k] && o.kusanilan[k].id === id) return { e: o.kusanilan[k], yer: 'kusanilan', slot: k };
  return null;
};

// ---- v0.11: yuvalar ve çanta kapasitesi ----
G.cantaLimit = function () { return G.o.cantaLimit || G.CANTA.baslangic; };

// Bu eşyanın gideceği yuva: boş olan, yoksa en zayıf eşyanın yuvası
G.hedefYuva = function (e) {
  var o = G.o, tur = G.ESYALAR[e.sablon].slot;
  var yuvalar = G.YUVALAR.filter(function (y) { return y.tur === tur; }).map(function (y) { return y.id; });
  for (var i = 0; i < yuvalar.length; i++) if (!o.kusanilan[yuvalar[i]]) return yuvalar[i];
  return yuvalar.reduce(function (a, b) { return G.esyaGP(o.kusanilan[a]) <= G.esyaGP(o.kusanilan[b]) ? a : b; });
};

G.cantaGenisletFiyat = function () {
  var n = (G.cantaLimit() - G.CANTA.baslangic) / G.CANTA.adim;
  return Math.round(G.CANTA.fiyat * Math.pow(G.CANTA.carpan, n));
};

G.cantaGenislet = function () {
  var o = G.o, fiyat = G.cantaGenisletFiyat();
  if (G.cantaLimit() >= G.CANTA.maks) { G.bildir('Çanta en büyük boyutta.'); return; }
  if (o.para < fiyat) { G.bildir(fiyat + ' altın gerekiyor.'); return; }
  o.para -= fiyat;
  o.cantaLimit = G.cantaLimit() + G.CANTA.adim;
  G.kaydet(); G.modalKapat(); G.panelYenile(); G.ustGuncelle();
  G.bildir('Çanta ' + o.cantaLimit + ' yuvaya genişledi.');
};

G.cantayaEkle = function (e) {
  var o = G.o;
  if (o.canta.length >= G.cantaLimit()) {
    G.log('Çanta dolu! ' + G.esyaRenkliAd(e) + ' yerde kaldı.', 'tehlike');
    return false;
  }
  o.canta.push(e);
  o.istatistik.bulunan[e.nadir] = (o.istatistik.bulunan[e.nadir] || 0) + 1;
  G.log('Eşya düştü: ' + G.esyaRenkliAd(e));
  G.cizCanta();
  return true;
};

G.kusan = function (id) {
  var o = G.o, f = G.esyaBul(id);
  if (!f || f.yer !== 'canta') return;
  var s = G.ESYALAR[f.e.sablon];
  if (o.lv < s.lv) { G.bildir('Bu eşya için seviye ' + s.lv + ' gerekiyor.'); return; }
  var yuva = G.hedefYuva(f.e), eski = o.kusanilan[yuva];
  o.canta.splice(f.i, 1);
  if (eski) o.canta.push(eski);
  o.kusanilan[yuva] = f.e;
  G.statSinirla();
  G.kaydet(); G.modalKapat(); G.cizCanta(); G.ustGuncelle();
  G.bildir(G.esyaAd(f.e) + ' kuşanıldı.');
};

G.cikar = function (slot) {
  var o = G.o, e = o.kusanilan[slot];
  if (!e) return;
  if (o.canta.length >= G.cantaLimit()) { G.bildir('Çanta dolu, önce yer aç.'); return; }
  o.kusanilan[slot] = null;
  o.canta.push(e);
  G.statSinirla();
  G.kaydet(); G.modalKapat(); G.panelYenile(); G.ustGuncelle();
};

// Ekipman çıkınca can/mana tavanı düşebilir
G.statSinirla = function () {
  var r = G.hesapla(G.o);
  G.o.hp = Math.min(G.o.hp, r.hpMax);
  G.o.mp = Math.min(G.o.mp, r.mpMax);
};

G.sat = function (id) {
  var o = G.o, f = G.esyaBul(id);
  if (!f || f.yer !== 'canta') return;
  if (f.e.kilit) { G.bildir('Kilitli eşya satılamaz.'); return; }
  var d = G.satisDegeri(f.e);
  o.canta.splice(f.i, 1);
  o.para += d;
  G.gorevSay('geri');
  G.kaydet(); G.modalKapat(); G.cizCanta(); G.ustGuncelle();
  G.bildir(G.esyaAd(f.e) + ' ' + d + ' altına satıldı.');
};

G.topluSat = function () {
  var o = G.o, toplam = 0, adet = 0;
  o.canta = o.canta.filter(function (e) {
    if (e.nadir <= 1 && e.arti === 0 && !e.kilit && !G.ESYALAR[e.sablon].set) { toplam += G.satisDegeri(e); adet++; return false; }
    return true;
  });
  if (!adet) { G.bildir('Satılacak sıradan veya iyi eşya yok.'); return; }
  o.para += toplam;
  G.gorevSay('geri');
  G.kaydet(); G.cizCanta(); G.ustGuncelle();
  G.bildir(adet + ' eşya ' + toplam + ' altına satıldı.');
};

G.guclendir = function (id) {
  var o = G.o, f = G.esyaBul(id);
  if (!f) return;
  var e = f.e;
  if (e.arti >= G.MAKS_ARTI) { G.bildir('Bu eşya en yüksek seviyede.'); return; }
  var maliyet = G.guclendirMaliyet(e);
  if (o.sarf.tas < 1) { G.bildir('Arıtma Taşı yok. Dükkandan alabilirsin.'); return; }
  if (o.para < maliyet) { G.bildir(maliyet + ' altın gerekiyor.'); return; }
  o.sarf.tas--; o.para -= maliyet;
  // v0.28: sonuç burada hesaplanır ve hemen kaydedilir; ritüel sahnesi sadece gösterir
  var sonuc = { e: e, eski: e.arti, sans: G.guclendirSans(e.arti) };
  if (Math.random() * 100 < sonuc.sans) {
    e.arti++; sonuc.tur = 'basari';
    G.gorevSay('guclendir');
  } else if (e.arti >= G.ZORLUK.guclendirDusmeArti) {
    e.arti--; sonuc.tur = 'dusus';
  } else {
    sonuc.tur = 'bos';
  }
  sonuc.yeni = e.arti;
  G.statSinirla(); G.kaydet(); G.ustGuncelle();
  G.guclendirSahne(sonuc, function () {
    if (G.sekme === 'demirci') { G.cizDemirci(); return; }
    G.esyaModal(id);
    G.panelYenile();
  });
};

G.satinAl = function (t, adet) {
  var o = G.o, u = null;
  G.DUKKAN.forEach(function (x) { if (x.t === t) u = x; });
  if (!u) return;
  if (G.bolgeBul(o.bolge).tur !== 'kasaba') { G.bildir('Alışveriş sadece kasabada yapılır.'); return; }
  var fiyat = u.fiyat * adet;
  if (o.para < fiyat) { G.bildir('Yeterli altının yok.'); return; }
  o.para -= fiyat; o.sarf[t] += adet;
  G.gorevSay('alis');
  G.kaydet(); G.panelYenile(); G.ustGuncelle();
  G.bildir(adet + ' ' + u.ad + ' alındı.');
};
