// ============================================================
// bolum.js — v0.19: Bölümler (referanstaki "XP")
// ============================================================

// Görevin ilerlemesi (hepsi kalıcı sayaçlardan ya da karakterin durumundan)
G.bolumSayi = function (g) {
  var o = G.o, ist = o.istatistik;
  switch (g.t) {
    case 'seviye': return o.lv;
    case 'gp': return G.hesapla(o).cp;
    case 'toplamArti': return Object.keys(o.kusanilan).reduce(function (t, k) { return t + (o.kusanilan[k] ? o.kusanilan[k].arti : 0); }, 0);
    case 'arit': return ist.sayac.arit || 0;
    case 'maden': return ist.sayac.maden || 0;
    case 'oldurId': return ist.oldurId[g.id] || 0;
    case 'boss': return ist.bosslar[g.id] || 0;
    case 'nadir': var n = 0; for (var k in ist.bulunan) if (+k >= g.nadir) n += ist.bulunan[k]; return n;
    case 'beceri': return Object.keys(o.beceriler).length;
    case 'meridyen': return o.meridyen;
    case 'ilahi': return o.ilahi;
  }
  return 0;
};

G.bolumYazi = function (g) {
  switch (g.t) {
    case 'seviye': return 'Seviye ' + g.n + ' ol';
    case 'gp': return 'GP\'ni ' + g.n + '\'e çıkar';
    case 'toplamArti': return 'Kuşanılı eşyalarda toplam +' + g.n + ' güçlendirme';
    case 'arit': return g.n + ' kez arıtma yap';
    case 'maden': return 'Madende ' + g.n + ' ocak kap';
    case 'oldurId':
      var c = G.CANAVARLAR[g.id], b = G.BOLGELER.filter(function (x) { return x.canavarlar && x.canavarlar.indexOf(g.id) >= 0; })[0];
      return (b ? '[' + b.ad + '] ' : '') + g.n + ' ' + c.ad + ' öldür';
    case 'boss': return 'Boss yen: ' + G.CANAVARLAR[g.id].ikon + ' ' + G.CANAVARLAR[g.id].ad + (g.n > 1 ? ' (' + g.n + ' kez)' : '');
    case 'nadir': return (g.n > 1 ? g.n + ' tane ' : 'Bir ') + G.NADIRLIK[g.nadir].ad.toLowerCase() + ' ya da daha iyi eşya bul';
    case 'beceri': return g.n + ' beceri öğren';
    case 'meridyen': return g.n + ' meridyen noktası aç';
    case 'ilahi': return 'İlahi silahı seviye ' + g.n + '\'e çıkar';
  }
  return '';
};

// Bölüm açık mı: ilki hep açık, sonrakiler öncekinin bütün ödülleri alınınca
G.bolumAcikMi = function (i) {
  if (i === 0) return true;
  var onceki = G.BOLUMLER[i - 1];
  return onceki.gorevler.every(function (g) { return G.o.bolum.alinan[g.kid]; });
};

G.bolumAl = function (kid) {
  var o = G.o, g = null, bi = -1;
  G.BOLUMLER.forEach(function (b, i) { b.gorevler.forEach(function (x) { if (x.kid === kid) { g = x; bi = i; } }); });
  if (!g || o.bolum.alinan[kid] || !G.bolumAcikMi(bi) || G.bolumSayi(g) < g.n) return;
  o.bolum.alinan[kid] = true;
  for (var k in g.odul) { if (k === 'para') o.para += g.odul[k]; else o.sarf[k] = (o.sarf[k] || 0) + g.odul[k]; }
  G.bildir('Ödül: ' + G.odulYazi(g.odul));
  var tamam = G.BOLUMLER[bi].gorevler.every(function (x) { return o.bolum.alinan[x.kid]; });
  if (tamam && G.BOLUMLER[bi + 1]) { G.log('📖 ' + G.BOLUMLER[bi].ad + ' tamamlandı! Yeni bölüm açıldı: ' + G.BOLUMLER[bi + 1].ad, 'sistem'); G.bildir('Yeni bölüm açıldı!'); }
  G.kaydet(); G.panelYenile(); G.ustGuncelle();
};

// "Git": görevin yapılacağı yere
G.bolumGit = function (kid) {
  var o = G.o, g = null;
  G.BOLUMLER.forEach(function (b) { b.gorevler.forEach(function (x) { if (x.kid === kid) g = x; }); });
  if (!g) return;
  if (g.t === 'oldurId' || g.t === 'boss') {
    var b = G.BOLGELER.filter(function (x) { return (x.canavarlar && x.canavarlar.indexOf(g.id) >= 0) || x.boss === g.id; })[0];
    if (!b) return;
    if (o.lv < b.minLv) { G.bildir(b.ad + ' için seviye ' + b.minLv + ' gerekiyor.'); return; }
    G.bolgeGit(b.id, true);
    if (g.t === 'boss') G.bildir('BOSS düğmesiyle ' + G.CANAVARLAR[g.id].ad + '\'ı çağır');
  } else if (g.t === 'toplamArti') { G.demirciAlt = 'guclendir'; G.demirciKaynak = 'kusanili'; G.sekmeAc('demirci'); }
  else if (g.t === 'arit') { G.demirciAlt = 'arit'; G.sekmeAc('demirci'); }
  else if (g.t === 'maden') { G.etkinlikGorunum = 'maden'; G.sekmeAc('etkinlik'); }
  else if (g.t === 'beceri' || g.t === 'meridyen' || g.t === 'ilahi') { G.karakterAlt = g.t; G.sekmeAc('karakter'); }
  else G.sekmeAc('savas');
};

// Açık bölümlerdeki toplanabilir ödül sayısı
G.bolumBekleyen = function () {
  var o = G.o, n = 0;
  G.BOLUMLER.forEach(function (b, i) {
    if (!G.bolumAcikMi(i)) return;
    b.gorevler.forEach(function (g) { if (!o.bolum.alinan[g.kid] && G.bolumSayi(g) >= g.n) n++; });
  });
  return n;
};
