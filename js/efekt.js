// ============================================================
// efekt.js — v0.12: Savaş efektleri (resim yok, sadece SVG ve CSS)
// Her efekt sahaya (#saha) geçici bir öğe ekler ve süresi bitince siler.
// Yeni efekt: G.FX['ad'] = function (b) {...} ve veri.js'te becerinin efekt alanına 'ad' yaz.
// ============================================================
G.fx = {};

// Karenin merkezi (yüzde)
G.fx.merkez = function (h) {
  var p = G.hucreKonum(h.kol, h.sat), yK = 50 / G.IZGARA.sut, yS = 50 / G.IZGARA.sat;
  return { x: p.x + yK, y: p.y + yS };
};

// Sahaya öğe ekle, ms sonra sil
G.fx.ekle = function (html, ms) {
  var saha = G.$('saha');
  if (!saha) return null;
  var kap = document.createElement('div');
  kap.className = 'fx-kap';
  kap.innerHTML = html;
  saha.appendChild(kap);
  setTimeout(function () { kap.remove(); }, ms || 800);
  return kap;
};

G.fx.rnd = function (a, b) { return a + Math.random() * (b - a); };

// Kıvılcımlar: merkezden dışa saçılan küçük parçacıklar
G.fx.kivilcim = function (h, adet, renk) {
  var m = G.fx.merkez(h), s = '';
  for (var i = 0; i < adet; i++) {
    var a = Math.random() * Math.PI * 2, r = G.fx.rnd(18, 42);
    s += '<i class="fx-kivilcim" style="left:' + m.x + '%;top:' + m.y + '%;--dx:' + Math.cos(a) * r + 'px;--dy:' + Math.sin(a) * r +
      'px;background:' + renk + ';box-shadow:0 0 6px ' + renk + ';animation-delay:' + G.fx.rnd(0, 80) + 'ms"></i>';
  }
  G.fx.ekle(s, 700);
};

// Genişleyen çarpma halkası
G.fx.halka = function (h, renk, boyut) {
  var m = G.fx.merkez(h);
  G.fx.ekle('<i class="fx-halka" style="left:' + m.x + '%;top:' + m.y + '%;--renk:' + renk + ';--boy:' + (boyut || 70) + 'px"></i>', 600);
};

// Karelerde yükselen alevler
G.fx.alev = function (hucreler, sure) {
  var s = '';
  hucreler.forEach(function (h, j) {
    var p = G.hucreKonum(h.kol, h.sat);
    for (var i = 0; i < 3; i++) {
      s += '<i class="fx-alev" style="left:' + (p.x + G.fx.rnd(2, 12)) + '%;top:' + (p.y + G.fx.rnd(5, 11)) + '%;animation-delay:' +
        (j * 40 + i * 90) + 'ms;--olcek:' + G.fx.rnd(0.8, 1.3) + '"></i>';
    }
  });
  G.fx.ekle(s, sure || 1000);
};

// Gökten düşen dallanan şimşek
G.fx.yildirim = function (h) {
  var m = G.fx.merkez(h), x = m.x + G.fx.rnd(-8, 8), y = -5, pts = [x + ',' + y];
  var adim = 7;
  for (var i = 1; i < adim; i++) {
    x = m.x + (x - m.x) * 0.6 + G.fx.rnd(-5, 5);
    y = -5 + (m.y + 5) * i / adim;
    pts.push(x.toFixed(1) + ',' + y.toFixed(1));
  }
  pts.push(m.x + ',' + m.y);
  var orta = pts[3].split(','), dal = [pts[3], (+orta[0] + G.fx.rnd(-10, 10)).toFixed(1) + ',' + (+orta[1] + 12).toFixed(1),
    (+orta[0] + G.fx.rnd(-14, 14)).toFixed(1) + ',' + (+orta[1] + 20).toFixed(1)].join(' ');
  var p = pts.join(' ');
  G.fx.ekle('<svg class="fx-simsek" viewBox="0 0 100 100" preserveAspectRatio="none">' +
    '<polyline points="' + p + '" class="d"/><polyline points="' + dal + '" class="d ince"/>' +
    '<polyline points="' + p + '" class="o"/><polyline points="' + p + '" class="c"/></svg><i class="fx-flas"></i>', 420);
  G.fx.halka(h, 'rgba(160,200,255,.95)', 80);
  G.fx.kivilcim(h, 8, '#cfe2ff');
};

// Beceri adı karakterin üstünde süzülür
G.fx.yaziSira = 0;
G.fx.yazi = function (metin, renk) {
  var m = G.fx.merkez(G.oyuncu), sira = G.fx.yaziSira++;
  setTimeout(function () { G.fx.yaziSira = Math.max(0, G.fx.yaziSira - 1); }, 1300);
  G.fx.ekle('<span class="fx-beceri-adi" style="left:' + m.x + '%;top:' + (m.y - 12 - sira * 10) + '%;--renk:' + (renk || '#9ec6ff') + '">' + metin + '</span>', 1300);
};

// Oyuncudan hedefe uçan mermi (ateş küresi, ok, buz)
G.fx.mermi = function (t, tur, sonra) {
  var saha = G.$('saha');
  if (!saha) { if (sonra) sonra(); return; }
  var b = G.fx.merkez(G.oyuncu), s = G.fx.merkez(t);
  var aci = Math.atan2((s.y - b.y), (s.x - b.x)) * 180 / Math.PI;
  var el = document.createElement('i');
  el.className = 'fx-mermi ' + tur;
  el.style.left = b.x + '%'; el.style.top = b.y + '%';
  el.style.setProperty('--aci', aci + 'deg');
  saha.appendChild(el);
  void el.offsetWidth;
  el.style.left = s.x + '%'; el.style.top = s.y + '%';
  setTimeout(function () { el.remove(); if (sonra) sonra(); }, 240);
};

// Kılıç yayı (SVG çizilerek belirir)
G.fx.kesik = function (h, guclu, gecikme) {
  var p = G.hucreKonum(h.kol, h.sat), ters = Math.random() < 0.5;
  var yol = ters ? 'M12 85 Q30 15 92 12' : 'M10 15 Q70 20 88 88';
  G.fx.ekle('<svg class="fx-kesik' + (guclu ? ' guclu' : '') + '" style="left:' + p.x + '%;top:' + p.y + '%;animation-delay:' + (gecikme || 0) + 'ms" viewBox="0 0 100 100">' +
    '<path d="' + yol + '" class="d"/><path d="' + yol + '" class="c"/>' +
    (guclu ? '<path d="' + (ters ? 'M10 15 Q70 20 88 88' : 'M12 85 Q30 15 92 12') + '" class="c"/>' : '') + '</svg>', 600);
};

// Karakterin etrafında aura (şifa / kalkan / güç)
G.fx.aura = function (tur) {
  var p = G.hucreKonum(G.oyuncu.kol, G.oyuncu.sat), s = '<i class="fx-aura ' + tur + '" style="left:' + p.x + '%;top:' + p.y + '%"></i>';
  if (tur === 'sifa') {
    var m = G.fx.merkez(G.oyuncu);
    for (var i = 0; i < 6; i++) s += '<i class="fx-arti" style="left:' + (m.x + G.fx.rnd(-8, 8)) + '%;top:' + (m.y + G.fx.rnd(-2, 8)) + '%;animation-delay:' + (i * 90) + 'ms">+</i>';
  }
  G.fx.ekle(s, 1000);
};

// ---- Beceri efektleri: veri.js'te G.BECERILER[id].efekt ----
G.FX = {
  kesik: function (b) { b.hedefler.forEach(function (h, i) { G.fx.kesik(h, b.beceri, i * 60); }); G.fx.kivilcim(b.hucreler[0] || b.t, 5, '#e8f0ff'); },
  kasirga: function (b) {
    var p = G.hucreKonum(G.oyuncu.kol, G.oyuncu.sat), w = 100 / G.IZGARA.sut, hh = 100 / G.IZGARA.sat;
    G.fx.ekle('<i class="fx-kasirga" style="left:' + (p.x - w) + '%;top:' + (p.y - hh) + '%;width:' + (w * 3) + '%;height:' + (hh * 3) + '%"></i>', 600);
    b.hedefler.forEach(function (h, i) { G.fx.kesik(h, false, 80 + i * 30); });
  },
  ates: function (b) { G.fx.mermi(b.t, 'ates', function () { G.fx.halka(b.t, 'rgba(255,150,50,.95)', 64); G.fx.kivilcim(b.t, 8, '#ffb040'); G.fx.alev([b.t], 700); }); },
  alev: function (b) { G.fx.alev(b.hucreler, 1100); b.hucreler.forEach(function (h, i) { if (i % 2 === 0) G.fx.kivilcim(h, 3, '#ff8a30'); }); },
  meteor: function (b) {
    var m = G.fx.merkez(b.t);
    G.fx.ekle('<i class="fx-meteor" style="--x:' + m.x + '%;--y:' + m.y + '%"></i>', 420);
    setTimeout(function () { G.fx.halka(b.t, 'rgba(255,120,40,.95)', 130); G.fx.alev(b.hucreler, 1100); G.fx.kivilcim(b.t, 12, '#ffcf60'); }, 330);
  },
  buz: function (b) { G.fx.mermi(b.t, 'buz', function () { G.fx.halka(b.t, 'rgba(170,230,255,.95)', 70); G.fx.kivilcim(b.t, 10, '#d8f4ff'); }); },
  ok: function (b) { G.fx.mermi(b.t, 'ok', function () { G.fx.kivilcim(b.t, 5, '#d8ffb0'); }); },
  zehir: function (b) { G.fx.mermi(b.t, 'ok zehirli', function () { G.fx.halka(b.t, 'rgba(120,230,90,.9)', 56); G.fx.kivilcim(b.t, 8, '#8ff07a'); }); },
  okyagmuru: function (b) {
    var s = '';
    b.hucreler.forEach(function (h) {
      var p = G.hucreKonum(h.kol, h.sat);
      for (var i = 0; i < 2; i++) s += '<i class="fx-dusen-ok" style="left:' + (p.x + G.fx.rnd(4, 15)) + '%;top:' + (p.y + G.fx.rnd(4, 12)) + '%;animation-delay:' + G.fx.rnd(0, 220) + 'ms"></i>';
    });
    G.fx.ekle(s, 800);
  },
  cizgi: function (b) {
    var bas = G.fx.merkez(G.oyuncu), son = G.fx.merkez(b.hucreler[b.hucreler.length - 1] || b.t);
    var saha = G.$('saha'), w = saha ? saha.clientWidth : 360, h = saha ? saha.clientHeight : 400;
    var dx = (son.x - bas.x) * w / 100, dy = (son.y - bas.y) * h / 100;
    G.fx.ekle('<i class="fx-isin" style="left:' + bas.x + '%;top:' + bas.y + '%;width:' + Math.sqrt(dx * dx + dy * dy) + 'px;--aci:' + Math.atan2(dy, dx) * 180 / Math.PI + 'deg"></i>', 500);
    b.hedefler.forEach(function (x) { G.fx.kivilcim(x, 5, '#d8ffb0'); });
  },
  yildirim: function (b) { b.hedefler.slice(0, 4).forEach(function (h, i) { setTimeout(function () { G.fx.yildirim(h); }, i * 70); }); if (!b.hedefler.length) G.fx.yildirim(b.t); },
  yildiz: function (b) {
    var m = G.fx.merkez(b.t);
    G.fx.ekle('<i class="fx-meteor yildiz" style="--x:' + m.x + '%;--y:' + m.y + '%"></i>', 420);
    setTimeout(function () { G.fx.halka(b.t, 'rgba(255,240,170,.95)', 110); G.fx.kivilcim(b.t, 12, '#fff2a0'); }, 330);
  },
  ruzgar: function (b) { G.FX.cizgi(b); b.hedefler.forEach(function (h) { G.fx.halka(h, 'rgba(200,255,220,.8)', 50); }); },
  // v0.37 — totemler
  sicrama: function (b) {
    G.fx.halka(b.t, 'rgba(240,190,100,.95)', 140);
    b.hedefler.forEach(function (h, i) { G.fx.kesik(h, true, i * 40); });
    G.fx.kivilcim(b.t, 14, '#ffd890');
  },
  peri: function () {
    G.fx.aura('guc');
    for (var i = 0; i < 6; i++) G.fx.kivilcim(G.oyuncu, 3, '#ffb050');
  },
  anka: function (b) {
    G.fx.aura('kalkan');
    G.fx.halka(G.oyuncu, 'rgba(255,140,40,.95)', 150);
    G.fx.alev(b.hucreler || [], 800);
  },
  sifa: function () { G.fx.aura('sifa'); },
  kalkan: function () { G.fx.aura('kalkan'); },
  guc: function () { G.fx.aura('guc'); }
};

// Sınıfların normal saldırı efekti
G.FX_NORMAL = { savasci: 'kesik', buyucu: 'ates', okcu: 'ok' };

// savas.js çağırır: bir saldırının/becerinin efektini oynat
G.fx.oynat = function (efekt, t, hucreler, beceriMi, ad) {
  if (!G.$('saha')) return;
  if (ad) G.fx.yazi(ad);
  var b = { t: t, hucreler: hucreler || [t], hedefler: (hucreler || [t]).filter(function (h) { return G.canavarAt(h.kol, h.sat) >= 0; }), beceri: beceriMi };
  if (!b.hedefler.length && t) b.hedefler = [t];
  (G.FX[efekt] || G.FX.kesik)(b);
};
