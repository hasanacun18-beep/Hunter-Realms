// ============================================================
// saha.js — v0.7: Görünmez ızgara (5x5), hareket, yol bulma, canavar davranışı
// Ekranda çizgi yok; kartlar karelerin içinde durur, kareden kareye yürür.
// ============================================================
G.oyuncu = { kol: 2, sat: 3, t: 0 };
G.hedefI = null;       // hedef canavar (alan dizisindeki sıra)
G.hedefHucre = null;   // dokunulan boş kare
G.kacisSure = 0;       // kaçtıktan sonra saldırganlar kısa süre fark etmez
G.YONLER = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];

G.icinde = function (k, s) { return k >= 0 && s >= 0 && k < G.IZGARA.sut && s < G.IZGARA.sat; };
G.cheb = function (a, b) { return Math.max(Math.abs(a.kol - b.kol), Math.abs(a.sat - b.sat)); };
G.canavarAt = function (k, s) {
  for (var i = 0; i < G.alan.length; i++) { var c = G.alan[i]; if (c && !c.olu && c.kol === k && c.sat === s) return i; }
  return -1;
};
G.doluMu = function (k, s) {
  return (G.oyuncu.kol === k && G.oyuncu.sat === s) || G.canavarAt(k, s) >= 0;
};

G.rastgeleBosHucre = function (minUzak) {
  var bos = [];
  for (var k = 0; k < G.IZGARA.sut; k++) for (var s = 0; s < G.IZGARA.sat; s++) {
    if (!G.doluMu(k, s) && G.cheb({ kol: k, sat: s }, G.oyuncu) >= (minUzak || 0)) bos.push({ kol: k, sat: s });
  }
  if (!bos.length) return null;
  return bos[Math.floor(Math.random() * bos.length)];
};

// Genişlik öncelikli arama: başlangıçtan, hedefMi(k,s) doğru olan en yakın kareye giden ilk adım
G.ilkAdim = function (bas, hedefMi) {
  if (hedefMi(bas.kol, bas.sat)) return null;
  var kuyruk = [[bas.kol, bas.sat]], onceki = {}, anahtar = function (k, s) { return k + ',' + s; };
  onceki[anahtar(bas.kol, bas.sat)] = null;
  while (kuyruk.length) {
    var h = kuyruk.shift();
    for (var d = 0; d < 8; d++) {
      var k = h[0] + G.YONLER[d][0], s = h[1] + G.YONLER[d][1], a = anahtar(k, s);
      if (!G.icinde(k, s) || a in onceki || G.doluMu(k, s)) continue;
      onceki[a] = h;
      if (hedefMi(k, s)) {
        var yol = [k, s];
        while (onceki[anahtar(yol[0], yol[1])] && onceki[anahtar(yol[0], yol[1])][0] + ',' + onceki[anahtar(yol[0], yol[1])][1] !== anahtar(bas.kol, bas.sat)) {
          yol = onceki[anahtar(yol[0], yol[1])];
        }
        return { kol: yol[0], sat: yol[1] };
      }
      kuyruk.push([k, s]);
    }
  }
  return null;
};

G.menzil = function () { return G.SINIFLAR[G.o.sinif].menzil; };
G.avBolgesiMi = function () { var t = G.bolgeBul(G.o.bolge).tur; return t === 'av' || t === 'kule'; };

// Canavara dokununca: menzile kadar yürü, sonra savaş turları saldırır
G.hedefSec = function (i) {
  var c = G.alan[i];
  if (!c || c.olu) return;
  G.hedefI = i; G.hedefHucre = null;
  G.kartlariGuncelle();
};

// Boş yere dokununca: o kareye yürü (savaşta da yürüyebilirsin, kuşatmadan kaçmak için)
G.sahaDokun = function (e) {
  var saha = G.$('saha');
  if (!saha) return;
  var r = saha.getBoundingClientRect();
  var k = Math.floor((e.clientX - r.left) / r.width * G.IZGARA.sut);
  var s = Math.floor((e.clientY - r.top) / r.height * G.IZGARA.sat);
  if (!G.icinde(k, s)) return;
  var ci = G.canavarAt(k, s);
  if (ci >= 0) { G.hedefSec(ci); return; }
  G.hedefHucre = { kol: k, sat: s };
  G.hedefI = null;
};

// Otomatik savaş: saldıran yoksa en yakın canavarı hedefle
// Üstümüze gelen varken yürümeyiz
G.otoDevam = function () {
  if (!G.o.ayar.otoSavas || G.hedefI != null || G.hedefHucre || !G.avBolgesiMi()) return;
  if (G.aktifler().length) return;
  var en = -1, enD = Infinity;
  G.alan.forEach(function (c, i) {
    if (!c || c.olu) return;
    var d = G.cheb(G.oyuncu, c);
    if (d < enD) { enD = d; en = i; }
  });
  if (en >= 0) G.hedefI = en;
};

// Yanımızdaki saldıran sayısı en aza inen komşu kare (hedef menzilde kalmalı)
G.kiteAdimi = function (p, menzil) {
  var akt = G.aktifler();
  function yanindaki(k, s) { return akt.filter(function (c) { return G.cheb({ kol: k, sat: s }, c) <= 1; }).length; }
  var simdi = yanindaki(p.kol, p.sat);
  if (!simdi) return null;
  var hedef = G.hedefI != null ? G.alan[G.hedefI] : null, en = null, enSayi = simdi;
  G.YONLER.forEach(function (d) {
    var k = p.kol + d[0], s = p.sat + d[1];
    if (!G.icinde(k, s) || G.doluMu(k, s)) return;
    if (hedef && !hedef.olu && G.cheb({ kol: k, sat: s }, hedef) > menzil) return;
    var n = yanindaki(k, s);
    if (n < enSayi) { enSayi = n; en = { kol: k, sat: s }; }
  });
  return en;
};

// Her 100 ms: hareket ve fark etme
G.hareketTik = function (dt) {
  if (!G.o || !G.avBolgesiMi()) return;
  G.kuleTik();
  var p = G.oyuncu, S = G.SAHA, menzil = G.menzil();
  if (G.kacisSure > 0) G.kacisSure -= dt;
  G.otoDevam();

  // --- Oyuncu ---
  p.t += dt;
  if (p.t >= S.oyuncuAdim) {
    p.t = 0;
    var adim = null;
    if (G.hedefI != null) {
      var hc = G.alan[G.hedefI];
      if (!hc || hc.olu) G.hedefI = null;
      else if (G.cheb(p, hc) > menzil) adim = G.ilkAdim(p, function (k, s) { return G.cheb({ kol: k, sat: s }, hc) <= menzil; });
    } else if (G.hedefHucre) {
      var hh = G.hedefHucre;
      if (p.kol === hh.kol && p.sat === hh.sat) G.hedefHucre = null;
      else {
        adim = G.ilkAdim(p, function (k, s) { return k === hh.kol && s === hh.sat; });
        if (!adim) G.hedefHucre = null;   // ulaşılamıyor
      }
    }
    // Uzak menzilli ve otomatik: yanına gelen varsa daha az kuşatılacağı kareye geri adım at (kite)
    if (!adim && menzil > 1 && G.o.ayar.otoSavas && !G.hedefHucre) adim = G.kiteAdimi(p, menzil);
    if (adim) { p.kol = adim.kol; p.sat = adim.sat; }
  }

  // --- Canavarlar ---
  G.alan.forEach(function (c) {
    if (!c || c.olu) return;
    var d = G.cheb(p, c);
    // Yanındaki her canavar saldırır; saldırganlar (!) seni daha uzaktan fark eder
    if (!c.aktif && G.kacisSure <= 0 && (d <= 1 || (c.saldirgan && d <= S.agro))) { c.aktif = true; }
    c.t = (c.t || 0) + dt;
    if (c.aktif) {
      if (d <= 1 || c.t < S.kovalaAdim) return;
      c.t = 0;
      // Oyuncunun yanındaki boş bir kareye yürü. Yer yoksa bekler (duvara yaslanma taktiği)
      var a = G.ilkAdim(c, function (k, s) { return G.cheb({ kol: k, sat: s }, p) <= 1; });
      // Yanında yer yoksa bekleme, olabildiğince yaklaşıp sıraya gir
      if (!a) a = G.ilkAdim(c, function (k, s) { return G.cheb({ kol: k, sat: s }, p) < d; });
      if (a) { c.kol = a.kol; c.sat = a.sat; }
    } else if (c.t >= c.gezT) {
      c.t = 0; c.gezT = 2 + Math.random() * 4;
      var yon = G.YONLER[Math.floor(Math.random() * 8)], k = c.kol + yon[0], s = c.sat + yon[1];
      // Pasif canavar gezinirken oyuncunun yanına girmez
      if (G.icinde(k, s) && !G.doluMu(k, s) && G.cheb({ kol: k, sat: s }, p) > 1) { c.kol = k; c.sat = s; }
    }
  });

  G.sahaGuncelle();
};
