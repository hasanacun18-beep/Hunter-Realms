// ============================================================
// galeri.js — v0.32: Galeri (canavar ansiklopedisi)
// Her canavarın 5 kademesi var. Öldürme hedefi tamamlanınca "Al" ile altın + kalıcı stat alınır.
// Ayarlar: veri.js → G.GALERI · kayıt: o.galeri { canavarId: alınan kademe }
// ============================================================

// Galerideki canavarlar, bölge sırasıyla: { id, bolge, boss, statlar: ['atk'] ya da ['atk','hp'] }
G.galeriListe = function () {
  var liste = [];
  G.BOLGELER.forEach(function (b) {
    if (!b.canavarlar) return;
    b.canavarlar.forEach(function (id, i) {
      liste.push({ id: id, bolge: b, boss: false, statlar: [G.GALERI.sira[i % G.GALERI.sira.length]] });
    });
    if (b.boss) liste.push({ id: b.boss, bolge: b, boss: true, statlar: ['atk', 'hp'] });
  });
  return liste;
};

G.galeriBul = function (id) {
  return G.galeriListe().filter(function (x) { return x.id === id; })[0];
};

// Bir kademenin ödülü: { altin, stat: { atk: 0.9, ... } } — stat kesirli olabilir, toplamda yuvarlanır
G.galeriOdul = function (g, kademe) {
  var c = G.CANAVARLAR[g.id], K = G.GALERI, kat = g.boss ? K.bossKatsayi : K.katsayi, stat = {};
  g.statlar.forEach(function (s) { stat[s] = kat[s] * (c.lv + K.lvTaban); });
  return { altin: Math.round(c.para[1] * (g.boss ? K.altin.boss : K.altin.normal) * kademe), stat: stat };
};

G.galeriHedefler = function (g) { return g.boss ? G.GALERI.hedef.boss : G.GALERI.hedef.normal; };
G.galeriSayi = function (id) { return (G.o.istatistik.oldurId || {})[id] || 0; };
G.galeriKademe = function (id) { return (G.o.galeri || {})[id] || 0; };

// Alınabilir kademe var mı (hedef tamamlanmış ama ödül alınmamış)
G.galeriHazir = function (g) {
  var k = G.galeriKademe(g.id), h = G.galeriHedefler(g);
  return k < h.length && G.galeriSayi(g.id) >= h[k];
};

// Alınan kademelerin toplam kalıcı statı (durum.js → G.hesapla ekler)
G.galeriStat = function (galeri) {
  var top = {};
  for (var id in galeri) {
    var g = G.galeriBul(id);
    if (!g) continue;
    var tek = G.galeriOdul(g, 1).stat;
    for (var s in tek) top[s] = (top[s] || 0) + tek[s] * galeri[id];
  }
  for (var t in top) top[t] = Math.round(top[t]);
  return top;
};
// Ekranda gösterilen stat: 1'den küçükse tek ondalık
G.galeriSayiYazi = function (v) {
  return v >= 1 ? String(Math.round(v)) : String(Math.round(v * 10) / 10).replace('.', ',');
};

G.galeriAl = function (id) {
  var o = G.o, g = G.galeriBul(id);
  if (!g || !G.galeriHazir(g)) return;
  var k = G.galeriKademe(id) + 1, od = G.galeriOdul(g, k);
  o.galeri[id] = k;
  o.para += od.altin;
  var statYazi = Object.keys(od.stat).map(function (s) { return '+' + G.galeriSayiYazi(od.stat[s]) + ' ' + G.STAT_ADLARI[s]; }).join(', ');
  G.log(G.ikon('galeri') + ' Galeri: ' + G.CANAVARLAR[id].ad + ' ' + k + '. kademe — +' + od.altin + ' altın, ' + statYazi, 'kazanc');
  G.bildir(G.CANAVARLAR[id].ad + ' ' + k + '. kademe: ' + statYazi);
  G.sesCal('seviye');
  G.kaydet(); G.ustGuncelle(); G.cizEtkinlik();
};
