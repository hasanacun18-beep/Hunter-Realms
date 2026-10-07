// ============================================================
// meridyen.js — v0.16: Meridyen noktaları (kalıcı stat)
// o.meridyen = açılmış toplam nokta sayısı (0..60)
// ============================================================
G.meridyenToplam = function () { return G.MERIDYEN.dugum * G.MERIDYEN.kademeler.length; };

// n noktanın toplam verdiği statlar
G.meridyenStat = function (n) {
  var M = G.MERIDYEN, st = {};
  for (var k = 0; k < n; k++) {
    var t = Math.floor(k / M.dugum) + 1, tur = M.desen[k % M.dugum];
    st[tur] = (st[tur] || 0) + M.miktar[tur] * t;
  }
  for (var s in st) st[s] = s === 'krit' ? Math.round(st[s] * 10) / 10 : Math.round(st[s]);
  return st;
};

// Sıradaki noktanın maliyeti ve şartı
G.meridyenMaliyet = function (n) {
  var M = G.MERIDYEN, t = Math.floor(n / M.dugum);
  return { kademe: t, hap: (t + 1) * (M.hapCarpan || 1), altin: Math.round(M.altin * Math.pow(n + 1, M.altinUs)), lv: (M.kademeler[t] || {}).minLv };
};

G.meridyenYukselt = function () {
  var o = G.o, n = o.meridyen;
  if (n >= G.meridyenToplam()) { G.bildir('Bütün meridyenler açık.'); return; }
  var m = G.meridyenMaliyet(n);
  if (o.lv < m.lv) { G.bildir('Bu kademe için seviye ' + m.lv + ' gerekiyor.'); return; }
  if (o.sarf.hap < m.hap) { G.bildir('Yeterli Meridyen Hapı yok.'); return; }
  if (o.para < m.altin) { G.bildir(m.altin + ' altın gerekiyor.'); return; }
  o.sarf.hap -= m.hap; o.para -= m.altin;
  o.meridyen++;
  G.gorevSay('meridyen');
  var tamam = o.meridyen % G.MERIDYEN.dugum === 0;
  G.bildir(tamam ? G.MERIDYEN.kademeler[m.kademe].ad + ' kademesi tamamlandı!' : 'Meridyen noktası açıldı');
  G.statSinirla(); G.kaydet(); G.panelYenile(); G.ustGuncelle();
};

// Meridyenin GP'ye katkısı
G.meridyenGP = function () {
  var o = G.o, n = o.meridyen, tam = G.hesapla(o).cp;
  o.meridyen = 0; var bos = G.hesapla(o).cp; o.meridyen = n;
  return tam - bos;
};
