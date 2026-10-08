// ============================================================
// unvan.js — v0.34: Unvanlar
// Başarıyla kazanılır, kalıcıdır. Aynı anda tek unvan takılır; takılı unvan stat verir.
// Ayarlar: veri.js → G.UNVANLAR · kayıt: o.unvan { kazanilan: { unvanId: true }, takili: unvanId | null }
// ============================================================

G.unvanBul = function (id) {
  return G.UNVANLAR.filter(function (u) { return u.id === id; })[0];
};
G.unvanKazanildi = function (id) { return !!(G.o.unvan && G.o.unvan.kazanilan[id]); };

// Bir unvanın ilerlemesi: { sayi, hedef, yazi }
G.unvanIlerleme = function (u) {
  var o = G.o, ist = o.istatistik, bosslar = ist.bosslar || {}, sayi = 0, yazi = '';
  switch (u.tur) {
    case 'oldurme': sayi = ist.oldurme; yazi = 'Canavar öldür'; break;
    case 'boss':
      sayi = bosslar[u.id2] || 0;
      yazi = 'Yen: ' + (G.CANAVARLAR[u.id2] ? G.CANAVARLAR[u.id2].ad : u.id2); break;
    case 'bossToplam':
      for (var b in bosslar) sayi += bosslar[b];
      yazi = 'Boss yen (toplam)'; break;
    case 'kule': sayi = o.kule.enYuksek; yazi = 'Sınav Kulesi katı'; break;
    case 'arti':
      var esyalar = o.canta.slice();
      for (var k in o.kusanilan) if (o.kusanilan[k]) esyalar.push(o.kusanilan[k]);
      esyalar.forEach(function (e) { sayi = Math.max(sayi, e.arti || 0); });
      yazi = 'Bir eşyayı +' + u.n + ' yap'; break;
    case 'galeri':
      for (var g in o.galeri) sayi += o.galeri[g];
      yazi = 'Galeri kademesi al'; break;
    case 'mitik': sayi = Object.keys(o.mitik.acik).length; yazi = 'Efsanevi yuva aç'; break;
    case 'seviye': sayi = o.lv; yazi = 'Seviyeye ulaş'; break;
  }
  return { sayi: Math.min(sayi, u.n), hedef: u.n, yazi: yazi };
};

// Yeni kazanılan unvan var mı (durum.js → G.kaydet her kayıtta çağırır)
G.unvanKontrol = function () {
  var o = G.o;
  if (!o || !o.unvan) return;
  G.UNVANLAR.forEach(function (u) {
    if (o.unvan.kazanilan[u.id]) return;
    var p = G.unvanIlerleme(u);
    if (p.sayi < p.hedef) return;
    o.unvan.kazanilan[u.id] = true;
    G.log(G.ikon('unvan') + ' Yeni unvan: <b>' + u.ad + '</b> — Karakter → Statlar\'dan takabilirsin', 'kazanc');
    G.bildir('Yeni unvan: ' + u.ad);
    G.sesCal('seviye');
  });
};

G.unvanTak = function (id) {
  var o = G.o;
  if (!G.unvanBul(id) || !G.unvanKazanildi(id)) return;
  o.unvan.takili = id;
  G.kaydet(); G.ustGuncelle(); G.cizKarakter();
};

G.unvanCikar = function () {
  G.o.unvan.takili = null;
  G.kaydet(); G.ustGuncelle(); G.cizKarakter();
};
