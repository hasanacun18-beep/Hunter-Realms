// ============================================================
// mitik.js — v0.33: Efsanevi set (Warriors and Adventure'daki "Mythical")
// 10 ayrı yuva; parçalar bosslardan düşer, yuva bir kez etkinleştirilir.
// Ayarlar: veri.js → G.MITIK · kayıt: o.mitik { acik: { yuvaId: true }, parca: { yuvaId: adet }, oz }
// ============================================================

G.mitikYuva = function (id) {
  return G.MITIK.yuvalar.filter(function (y) { return y.id === id; })[0];
};
G.mitikAcik = function (id) { return !!(G.o.mitik && G.o.mitik.acik[id]); };
G.mitikParca = function (id) { return (G.o.mitik && G.o.mitik.parca[id]) || 0; };

// Bir yuvanın şu anki seviyedeki statı
G.mitikYuvaStat = function (y, lv) {
  var st = {};
  for (var k in y.stat) st[k] = Math.round(y.stat[k] * (lv + G.MITIK.lvTaban));
  return st;
};

// Açık yuvaların toplam statı (durum.js → G.hesapla ekler)
G.mitikStat = function (o) {
  var top = {};
  G.MITIK.yuvalar.forEach(function (y) {
    if (!o.mitik.acik[y.id]) return;
    var st = G.mitikYuvaStat(y, o.lv);
    for (var k in st) top[k] = (top[k] || 0) + st[k];
  });
  return top;
};

// Boss öldüğünde (savas.js → G.canavarOldu): şansla rastgele bir yuvanın parçası
G.mitikDusur = function (c) {
  var M = G.MITIK;
  if (Math.random() * 100 >= M.dusme + c.lv * M.dusmeLv) return;
  var y = M.yuvalar[Math.floor(Math.random() * M.yuvalar.length)];
  G.o.mitik.parca[y.id] = G.mitikParca(y.id) + 1;
  G.log(G.ikon('tac') + ' Efsanevi parça: ' + y.ad + '!', 'mitik');
  G.bildir('Efsanevi parça: ' + y.ad + '!');
  G.sesCal('basari');
};

// Parçayla yuvayı etkinleştir
G.mitikAc = function (id) {
  var o = G.o, y = G.mitikYuva(id);
  if (!y || G.mitikAcik(id) || G.mitikParca(id) < 1) return;
  o.mitik.parca[id]--;
  o.mitik.acik[id] = true;
  var b = G.MITIK.beceriler[id];
  G.log(G.ikon('tac') + ' ' + y.ad + ' etkinleştirildi' + (b ? ' — ' + b.ad + ' açıldı!' : ''), 'mitik');
  G.sesCal('basari');
  G.kaydet(); G.ustGuncelle(); G.cizKarakter();
};

// Açık yuvanın fazla parçasını sök → Efsane Özü
G.mitikSok = function (id) {
  var o = G.o;
  if (!G.mitikAcik(id) || G.mitikParca(id) < 1) return;
  o.mitik.parca[id]--;
  o.mitik.oz += G.MITIK.sokOz;
  G.bildir('+' + G.MITIK.sokOz + ' Efsane Özü');
  G.kaydet(); G.cizKarakter();
};

// Özle parça al (takas)
G.mitikTakas = function (id) {
  var o = G.o, y = G.mitikYuva(id);
  if (!y || G.mitikAcik(id) || o.mitik.oz < G.MITIK.takasOz) return;
  o.mitik.oz -= G.MITIK.takasOz;
  o.mitik.parca[id] = G.mitikParca(id) + 1;
  G.bildir(y.ad + ' parçası alındı');
  G.kaydet(); G.cizKarakter();
};

// ---- Beceriler ----
// Kan Hırsı: oyuncu hasar verdiğinde (savas.js → G.vur)
G.mitikKanHirsi = function (hasar) {
  var b = G.MITIK.beceriler.kilic, o = G.o, simdi = Date.now();
  if (!G.mitikAcik('kilic') || simdi < (G.kanHirsiZaman || 0) || Math.random() * 100 >= b.sans) return;
  G.kanHirsiZaman = simdi + b.bekleme * 1000;
  var iy = Math.max(1, Math.round(hasar * b.oran / 100)), r = G.hesapla(o);
  o.hp = Math.min(r.hpMax, o.hp + iy);
  G.oyuncuHasar('+' + iy);
  G.log(G.ikon(b.simge) + ' ' + b.ad + ': +' + iy + ' can', 'mitik');
};

// Muhafız Laneti: canavar oyuncuya vurduğunda; vuruşun çarpanını döndürür (savas.js)
G.mitikLanet = function (c) {
  var b = G.MITIK.beceriler.zirh;
  if (c.lanet > 0) { c.lanet--; return 1 - b.azalma / 100; }
  if (!G.mitikAcik('zirh') || Math.random() * 100 >= b.sans) return 1;
  c.lanet = b.sure - 1;
  G.log(G.ikon(b.simge) + ' ' + b.ad + ': ' + c.ad + ' lanetlendi', 'mitik');
  return 1 - b.azalma / 100;
};
