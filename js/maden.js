// ============================================================
// maden.js — v0.10: Maden etkinliği ve ilahi silah
// Kazı arka planda sürer: her dakika 1 enerji harcanır, cevher zarlanır.
// Oyun kapalıyken geçen süre de açılışta işlenir.
// ============================================================

// Gerçek zamanla enerji dolumu
G.enerjiGuncelle = function () {
  var m = G.o.maden, M = G.MADEN, simdi = Date.now();
  if (m.enerji >= M.enerjiMaks) { m.son = simdi; return; }
  var adet = Math.floor((simdi - m.son) / (M.enerjiSure * 1000));
  if (adet > 0) {
    m.enerji = Math.min(M.enerjiMaks, m.enerji + adet);
    m.son = m.enerji >= M.enerjiMaks ? simdi : m.son + adet * M.enerjiSure * 1000;
  }
};

G.enerjiKalan = function () {
  var m = G.o.maden;
  if (m.enerji >= G.MADEN.enerjiMaks) return 0;
  return Math.max(0, Math.ceil(G.MADEN.enerjiSure - (Date.now() - m.son) / 1000));
};

G.enerjiHarca = function (n) {
  var m = G.o.maden;
  if (m.enerji >= G.MADEN.enerjiMaks) m.son = Date.now();   // dolum sayacı şimdi başlar
  m.enerji = Math.max(0, m.enerji - n);
};

// ---- Ocaklar: rakip madenciler 10 dakikada bir yer değiştirir ----
G._ocaklar = {};
G.ocaklar = function (katI) {
  var k = G.MADEN_KATLARI[katI], kayit = G._ocaklar[katI], simdi = Date.now();
  if (kayit && simdi - kayit.t < 600000) return kayit.liste;
  var liste = [];
  for (var i = 0; i < k.ocak; i++) {
    var dolu = Math.random() * 100 < k.doluluk;
    liste.push({
      no: (katI + 1) * 1000 + i + 1,
      ad: dolu ? G.MADENCI_ADLARI[Math.floor(Math.random() * G.MADENCI_ADLARI.length)] : null,
      guc: Math.round(k.guc * (0.7 + Math.random() * 0.7))
    });
  }
  G._ocaklar[katI] = { t: simdi, liste: liste };
  return liste;
};

// Güç farkına göre kazanma şansı (%10 - %90)
G.yagmaSans = function (rakipGuc) {
  var cp = G.hesapla(G.o).cp;
  return Math.max(10, Math.min(90, Math.round(50 + (cp - rakipGuc) / rakipGuc * 100)));
};

// Ocağa dokununca: boşsa işgal et, doluysa yağmala
G.ocakSec = function (katI, no) {
  var o = G.o, m = o.maden, k = G.MADEN_KATLARI[katI];
  G.madenIsle();
  if (o.lv < k.minLv) { G.bildir('Bu kat için seviye ' + k.minLv + ' gerekiyor.'); return; }
  if (m.kazi) { G.bildir('Zaten kazıyorsun. Önce mevcut kazıyı bitir.'); return; }
  if (m.enerji < G.MADEN.isgalEnerji + 1) { G.bildir('Enerjin yetmiyor. Madenci Çayı içebilir ya da bekleyebilirsin.'); return; }
  var ocak = G.ocaklar(katI).filter(function (x) { return x.no === no; })[0];
  if (!ocak) return;
  G.enerjiHarca(G.MADEN.isgalEnerji);

  if (ocak.ad) {
    var sans = G.yagmaSans(ocak.guc);
    if (Math.random() * 100 >= sans) {
      var r = G.hesapla(o);
      o.hp = Math.max(1, o.hp - Math.round(r.hpMax * 0.15));
      G.madenLog(ocak.ad + ' ocağını savundu. Yağma başarısız (şansın %' + sans + ' idi).', 'tehlike');
      G.kaydet(); G.panelYenile(); G.ustGuncelle();
      return;
    }
    // Kazandık: rakibin biriktirdiği birazını da alırız
    var ana = k.cevher[0][0], ganimet = G.rastgele(3, 6);
    m.cevher[ana] = (m.cevher[ana] || 0) + ganimet;
    G.madenLog(ocak.ad + ' ocağından kovuldu! +' + ganimet + ' ' + G.CEVHERLER[ana].ikon + ' ' + G.CEVHERLER[ana].ad, 'sistem');
    ocak.ad = null;
  }
  ocak.sen = true;
  m.kazi = { kat: katI, no: no, son: Date.now(), dakika: 0, bekleyen: {} };
  G.madenLog('Ocak ' + no + ' senin. Kazı başladı.', 'kazanc');
  G.gorevSay('maden');
  G.kaydet(); G.panelYenile();
};

// Geçen her tam dakikayı işle (her saniye ve açılışta çağrılır)
G.madenIsle = function () {
  var o = G.o;
  if (!o) return false;
  G.enerjiGuncelle();
  var m = o.maden, z = m.kazi, degisti = false;
  if (!z) return false;
  var k = G.MADEN_KATLARI[z.kat], adim = G.MADEN.dakikaSn * 1000, sinir = 2000;
  while (m.kazi && Date.now() - z.son >= adim && sinir-- > 0) {
    z.son += adim;
    if (m.enerji < 1) { G.madenBitir('Enerjin bitti'); return true; }
    G.enerjiHarca(1);
    z.dakika++; degisti = true;
    k.cevher.forEach(function (c) {
      if (Math.random() * 100 < c[1]) z.bekleyen[c[0]] = (z.bekleyen[c[0]] || 0) + G.rastgele(c[2], c[3]);
    });
    // Rakip bir madenci ocağına saldırabilir
    if (Math.random() * 100 < k.yagma) {
      var rakip = G.MADENCI_ADLARI[Math.floor(Math.random() * G.MADENCI_ADLARI.length)];
      var guc = Math.round(k.guc * (0.8 + Math.random() * 0.6));
      if (Math.random() * 100 < G.yagmaSans(guc)) {
        var ana = k.cevher[0][0];
        z.bekleyen[ana] = (z.bekleyen[ana] || 0) + 3;
        G.madenLog(rakip + ' ocağına saldırdı ama püskürttün. +3 ' + G.CEVHERLER[ana].ikon, 'sistem');
      } else {
        for (var c in z.bekleyen) z.bekleyen[c] = Math.floor(z.bekleyen[c] * (100 - G.MADEN.kayipOran) / 100);
        G.madenLog(rakip + ' ocağını yağmaladı! Birikenin %' + G.MADEN.kayipOran + '\'i gitti.', 'tehlike');
        G.madenBitir('Ocağın yağmalandı');
        return true;
      }
    }
  }
  if (degisti) G.kaydet();
  return degisti;
};

// Kazıyı bitir: biriken cevher hesaba geçer
G.madenBitir = function (sebep) {
  var o = G.o, m = o.maden, z = m.kazi;
  if (!z) return;
  var yazi = [];
  for (var c in z.bekleyen) {
    if (!z.bekleyen[c]) continue;
    m.cevher[c] = (m.cevher[c] || 0) + z.bekleyen[c];
    yazi.push('+' + z.bekleyen[c] + ' ' + G.CEVHERLER[c].ikon + ' ' + G.CEVHERLER[c].ad);
  }
  var ocak = (G._ocaklar[z.kat] || { liste: [] }).liste.filter(function (x) { return x.no === z.no; })[0];
  if (ocak) ocak.sen = false;
  m.kazi = null;
  var mesaj = (sebep ? sebep + '. ' : '') + z.dakika + ' dakikalık kazı bitti' + (yazi.length ? ': ' + yazi.join(', ') : ', cevher çıkmadı.');
  G.madenLog(mesaj, 'kazanc');
  G.log(G.ikon('kazma') + ' ' + mesaj, 'kazanc');
  G.bildir('Kazı bitti');
  G.kaydet();
  if (G.sekme === 'etkinlik' || G.sekme === 'karakter' || G.sekme === 'canta') G.panelYenile();
};

G.madenLoglar = [];
G.madenLog = function (h, s) {
  G.madenLoglar.unshift({ h: h, s: s || '' });
  if (G.madenLoglar.length > 10) G.madenLoglar.pop();
};

G.cayIc = function () {
  var o = G.o, fiyat = G.MADEN.cayFiyat * o.lv;
  G.enerjiGuncelle();
  if (o.maden.enerji >= G.MADEN.enerjiMaks) { G.bildir('Enerjin zaten dolu.'); return; }
  if (o.para < fiyat) { G.bildir(fiyat + ' altın gerekiyor.'); return; }
  o.para -= fiyat;
  o.maden.enerji = Math.min(G.MADEN.enerjiMaks, o.maden.enerji + G.MADEN.cayEnerji);
  G.kaydet(); G.panelYenile(); G.ustGuncelle();
  G.bildir('Madenci Çayı içtin: +' + G.MADEN.cayEnerji + ' enerji');
};

// ---- İlahi silah ----
G.ilahiMaliyet = function (L) {
  var I = G.ILAHI, a = I.asama[Math.min(2, Math.floor(L / 10))], d = L % 10, m = {};
  m[a.ana] = 10 + d * 3;
  m[a.yan] = a.yan === 'kristal' ? 1 + Math.floor(d / 4) : 2 + Math.floor(d / 2);
  return { cevher: m, altin: Math.round(G.ILAHI.altinCarpan * Math.pow(L + 1, G.ILAHI.altinUs)), lv: I.minLv + L };
};

G.ilahiStat = function (L) {
  var s = G.ILAHI.statArtis;
  return { atk: Math.round(L * s.atk), hp: L * s.hp, mp: L * s.mp };
};

// Özel becerinin kademesi (0 = kapalı, 1-3)
G.ilahiKademe = function (L) {
  var k = 0;
  G.ILAHI.beceriSeviye.forEach(function (sv) { if (L >= sv) k++; });
  return k;
};

G.ilahiYukselt = function () {
  var o = G.o, L = o.ilahi;
  if (L >= G.ILAHI.maks) { G.bildir('İlahi silah en yüksek seviyede.'); return; }
  var m = G.ilahiMaliyet(L);
  if (o.lv < m.lv) { G.bildir('Seviye ' + m.lv + ' gerekiyor.'); return; }
  for (var c in m.cevher) if ((o.maden.cevher[c] || 0) < m.cevher[c]) { G.bildir('Yeterli ' + G.CEVHERLER[c].ad + ' yok.'); return; }
  if (o.para < m.altin) { G.bildir(m.altin + ' altın gerekiyor.'); return; }
  for (var c2 in m.cevher) o.maden.cevher[c2] -= m.cevher[c2];
  o.para -= m.altin;
  o.ilahi++;
  var kd = G.ilahiKademe(o.ilahi);
  G.bildir(G.ILAHI.sinif[o.sinif].ad + ' seviye ' + o.ilahi + (G.ILAHI.beceriSeviye.indexOf(o.ilahi) >= 0 ? ', ' + G.ILAHI.sinif[o.sinif].beceri + ' ' + kd + '. kademe!' : ''));
  G.kaydet(); G.panelYenile(); G.ustGuncelle();
};

// Normal saldırıdan sonra şansla tetiklenir (savas.js çağırır)
G.ilahiTetik = function (t, r) {
  var o = G.o, kd = G.ilahiKademe(o.ilahi);
  if (!kd || !t || t.olu || Math.random() * 100 >= G.ILAHI.beceriSans[kd - 1]) return 0;
  var bil = G.ILAHI.sinif[o.sinif], hucreler = G.sekilHucreleri(bil.sekil, t), toplam = 0;
  G.fx.oynat(bil.efekt, t, hucreler, true, bil.beceri);
  G.log(bil.ikon + ' ' + bil.beceri + '!', 'sistem');
  G.hucredekiler(hucreler).forEach(function (i) {
    var c = G.alan[i];
    c.aktif = true;
    toplam += G.vur(i, c, r, 1, bil.carpan, 'beceri');
  });
  return toplam;
};
