// ============================================================
// demirci.js — v0.3: Eritme, yeniden zarlama, kilit, eşya gücü
// ============================================================

// Eşyanın tek başına gücü (sıralama için). Ağırlıklar GP formülüyle aynı.
G.GP_AGIRLIK = { atk: 2, def: 3, hp: 0.2, mp: 0.1, hiz: 2, krit: 4, kritHasar: 1, canCal: 6, altin: 0.5, tecrube: 0.5 };
G.esyaGP = function (e) {
  var t = 0, st = G.esyaStat(e);
  for (var k in st) t += st[k] * (G.GP_AGIRLIK[k] || 0);
  (e.ek || []).forEach(function (x) { t += x.v * (G.GP_AGIRLIK[x.k] || 0); });
  return Math.round(t);
};

// Kuşanırsa toplam GP ne kadar değişir (geçici takıp geri çıkarır)
G.gpFarki = function (e, taban) {
  var o = G.o, slot = G.hedefYuva(e), eski = o.kusanilan[slot];
  if (taban == null) taban = G.hesapla(o).cp;
  o.kusanilan[slot] = e;
  var yeni = G.hesapla(o).cp;
  o.kusanilan[slot] = eski;
  return yeni - taban;
};

// ---- Kilit ----
G.kilitDegistir = function (id) {
  var f = G.esyaBul(id);
  if (!f) return;
  f.e.kilit = !f.e.kilit;
  G.kaydet(); G.esyaModal(id); G.panelYenile();
  G.bildir(f.e.kilit ? 'Kilitlendi. Satılamaz ve eritilemez.' : 'Kilit açıldı.');
};

// ---- Eritme ----
G.eritmeGetiri = function (e) {
  var s = G.ESYALAR[e.sablon];
  return {
    toz: Math.round((2 + s.lv * 0.3) * e.nadir * 1.5 * (s.set ? 2 : 1)) + e.arti * 2,
    tas: (e.nadir >= 3 ? 1 : 0) + (e.nadir >= 4 ? 1 : 0) + Math.floor(e.arti / 3)
  };
};

G.erit = function (id) {
  var o = G.o, f = G.esyaBul(id);
  if (!f || f.yer !== 'canta') return;
  if (f.e.kilit) { G.bildir('Kilitli eşya eritilemez.'); return; }
  if (f.e.nadir < 2) { G.bildir('Sadece Nadir ve üstü eşyalar eritilir.'); return; }
  var g = G.eritmeGetiri(f.e);
  o.canta.splice(f.i, 1);
  o.sarf.toz += g.toz; o.sarf.tas += g.tas;
  G.gorevSay('geri');
  G.kaydet(); G.modalKapat(); G.panelYenile();
  G.bildir(G.esyaAd(f.e) + ' eritildi: +' + g.toz + ' Ruh Tozu' + (g.tas ? ', +' + g.tas + ' Arıtma Taşı' : ''));
};

// Kilitsiz, güçlendirilmemiş, set olmayan Nadir eşyaları toplu erit
G.topluErit = function () {
  var o = G.o, toz = 0, tas = 0, adet = 0;
  o.canta = o.canta.filter(function (e) {
    if (e.nadir === 2 && e.arti === 0 && !e.kilit && !G.ESYALAR[e.sablon].set) {
      var g = G.eritmeGetiri(e); toz += g.toz; tas += g.tas; adet++; return false;
    }
    return true;
  });
  if (!adet) { G.bildir('Eritilecek Nadir eşya yok.'); return; }
  o.sarf.toz += toz; o.sarf.tas += tas;
  G.gorevSay('geri');
  G.kaydet(); G.panelYenile();
  G.bildir(adet + ' eşya eritildi: +' + toz + ' Ruh Tozu');
};

// ---- Yeniden zarlama ----
G.kilitliStatlar = function (e) {
  var zk = e.zk || [];
  return (e.ek || []).filter(function (x) { return zk.indexOf(x.k) >= 0; }).map(function (x) { return x.k; });
};

G.zarMaliyet = function (e) {
  var s = G.ESYALAR[e.sablon], kilit = G.kilitliStatlar(e).length;
  return {
    toz: Math.round((3 + s.lv * 0.4) * Math.max(1, e.nadir) * (1 + kilit * 1.5)),
    altin: s.lv * 8 + 20
  };
};

G.zarKilitDegistir = function (id, k) {
  var f = G.esyaBul(id);
  if (!f) return;
  var e = f.e, kilitli = G.kilitliStatlar(e);
  if (kilitli.indexOf(k) >= 0) {
    e.zk = kilitli.filter(function (x) { return x !== k; });
  } else {
    if (kilitli.length >= e.ek.length - 1) { G.bildir('En az bir stat açık kalmalı.'); return; }
    e.zk = kilitli.concat([k]);
  }
  G.aritma = null;   // kilit değişince önizleme geçersiz
  G.kaydet();
  if (G.sekme === 'demirci') G.cizDemirci(); else G.esyaModal(id);
};

G.zarla = function (id) {
  var o = G.o, f = G.esyaBul(id);
  if (!f) return;
  var e = f.e, s = G.ESYALAR[e.sablon];
  if (!e.ek || !e.ek.length) { G.bildir('Bu eşyanın ek statı yok.'); return; }
  var m = G.zarMaliyet(e);
  if (o.sarf.toz < m.toz) { G.bildir(m.toz + ' Ruh Tozu gerekiyor. Nadir eşyaları eriterek kazanırsın.'); return; }
  if (o.para < m.altin) { G.bildir(m.altin + ' altın gerekiyor.'); return; }
  o.sarf.toz -= m.toz; o.para -= m.altin;
  var kilitli = G.kilitliStatlar(e);
  var yeni = G.ekStatUret(s, e.ek.length - kilitli.length, kilitli);
  var j = 0;
  e.ek = e.ek.map(function (x) { return kilitli.indexOf(x.k) >= 0 ? x : yeni[j++]; });
  G.statSinirla(); G.kaydet(); G.ustGuncelle();
  G.esyaModal(id); G.panelYenile();
  G.bildir('Statlar yeniden zarlandı.');
};

// ---- v0.17: Arıtma (referanstaki Refine): önce önizleme, beğenirsen Kaydet ----
G.aritma = null;   // { id, ek } — kaydedilmemiş yeni statlar

G.aritOnizle = function (id) {
  var o = G.o, f = G.esyaBul(id);
  if (!f) return;
  var e = f.e, s = G.ESYALAR[e.sablon];
  if (!e.ek || !e.ek.length) { G.bildir('Bu eşyanın arıtılacak ek statı yok.'); return; }
  var m = G.zarMaliyet(e);
  if (o.sarf.toz < m.toz) { G.bildir(m.toz + ' Ruh Tozu gerekiyor. Eşya eriterek kazanırsın.'); return; }
  if (o.para < m.altin) { G.bildir(m.altin + ' altın gerekiyor.'); return; }
  o.sarf.toz -= m.toz; o.para -= m.altin;
  var kilitli = G.kilitliStatlar(e);
  var yeni = G.ekStatUret(s, e.ek.length - kilitli.length, kilitli), j = 0;
  G.gorevSay('arit');
  G.aritma = { id: id, ek: e.ek.map(function (x) { return kilitli.indexOf(x.k) >= 0 ? { k: x.k, v: x.v } : yeni[j++]; }) };
  G.kaydet(); G.ustGuncelle(); G.cizDemirci();
};

G.aritKaydet = function () {
  var a = G.aritma, f = a && G.esyaBul(a.id);
  if (!f) return;
  f.e.ek = a.ek;
  G.aritma = null;
  G.statSinirla(); G.kaydet(); G.ustGuncelle(); G.cizDemirci();
  G.bildir('Yeni statlar kaydedildi');
};
