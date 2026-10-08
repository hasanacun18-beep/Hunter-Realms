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

// ---- v0.35: Su verme (referanstaki Quench) — ayarlar veri.js → G.SUVERME ----
// Aynı ad + aynı nadirlikte, cilası daha yüksek bir çanta eşyası kurban edilir; ana eşyanın temel statları artar.
// Önce önizleme, beğenirsen Kaydet. Kurban edilen eşya her durumda gider. Bedel sadece altın.
// v0.36: oranlar yüzde (e.so); cila taşları cilayı doğrudan yükseltir (G.cilala)
G.suSecim = { teklif: null, kilit: {} };   // ekrandaki seçim (kayda girmez)
G.suOnizleme = null;                       // { id, so } — kaydedilmemiş sonuç

G.suSecimSifirla = function () { G.suSecim = { teklif: null, kilit: {} }; G.suOnizleme = null; };

// Kurban edilebilecek eşyalar: çantada, aynı şablon ve nadirlik, kilitsiz, cilası ana eşyadan yüksek
G.suTeklifler = function (e) {
  var c = G.cila(e);
  return G.o.canta.filter(function (x) {
    return x.id !== e.id && x.sablon === e.sablon && x.nadir === e.nadir && !x.kilit && G.cila(x) > c;
  });
};

// Altın bedeli: tur = 'normal' | 'gelismis' | 'sifirla'
G.suMaliyet = function (e, tur) {
  var s = G.ESYALAR[e.sablon], S = G.SUVERME;
  var taban = (s.lv * 5 + 20) * (e.nadir + 1) * S.altin;
  return Math.round(taban * (tur === 'gelismis' ? S.gelismisCarpan : tur === 'sifirla' ? S.sifirlaCarpan : 1));
};

G.suKilitDegistir = function (k) {
  var kl = G.suSecim.kilit;
  if (kl[k]) delete kl[k];
  else if (Object.keys(kl).length >= 2) { G.bildir('En fazla 2 stat kilitlenir.'); return; }
  else kl[k] = true;
  G.suOnizleme = null;
  G.cizDemirci();
};

G.suVer = function (id, gelismis) {
  var o = G.o, S = G.SUVERME, f = G.esyaBul(id);
  if (!f) return;
  var e = f.e, adaylar = G.suTeklifler(e);
  var t = adaylar.filter(function (x) { return x.id === G.suSecim.teklif; })[0];
  if (!t) { G.bildir(adaylar.length ? 'Önce kurban edilecek eşyayı seç.' : 'Aynı ad ve nadirlikte, cilası daha yüksek bir eşya gerekiyor.'); return; }
  var m = G.suMaks(e), kilitler = Object.keys(G.suSecim.kilit).filter(function (k) { return m[k]; });
  if (gelismis && !kilitler.length) { G.bildir('Gelişmiş su verme için 1-2 stat kilitle.'); return; }
  var altin = G.suMaliyet(e, gelismis ? 'gelismis' : 'normal');
  if (o.para < altin) { G.bildir(altin + ' altın gerekiyor.'); return; }
  o.para -= altin;
  var tc = G.cila(t), fark = tc - G.cila(e), so = {};
  for (var k in m) {
    var eski = (e.so && e.so[k]) || 0;
    if (gelismis) {
      // yalnız kilitli statlar değişir, sadece iyileşme kalır
      so[k] = kilitler.indexOf(k) >= 0 ? Math.min(100, Math.round(eski + fark * Math.random())) : eski;
    } else {
      var r = S.normalAlt + Math.random() * (1 - S.normalAlt);
      so[k] = Math.max(0, Math.min(100, Math.round(eski + fark * r)));
    }
  }
  o.canta.splice(o.canta.indexOf(t), 1);
  G.suSecim.teklif = null;
  G.suOnizleme = { id: id, so: so };
  G.log(G.ikon('suverme') + ' Su verildi: ' + G.esyaRenkliAd(e) + ' (kurban: cila %' + tc + ')', 'sistem');
  G.sesCal('cekic');
  G.kaydet(); G.ustGuncelle(); G.cizDemirci();
};

G.suKaydet = function () {
  var a = G.suOnizleme, f = a && G.esyaBul(a.id);
  if (!f) return;
  f.e.so = a.so;
  G.suOnizleme = null;
  G.sesCal('basari');
  G.statSinirla(); G.kaydet(); G.ustGuncelle(); G.cizDemirci();
  G.bildir('Su verme kaydedildi — cila %' + G.cila(f.e));
};

// Cilayı sıfırla: bütün su verme bonusu gider (daha çok eşya kurban edilebilir hale gelir)
G.suSifirla = function (id) {
  var o = G.o, f = G.esyaBul(id);
  if (!f) return;
  var altin = G.suMaliyet(f.e, 'sifirla');
  if (o.para < altin) { G.bildir(altin + ' altın gerekiyor.'); return; }
  if (!confirm('Bu eşyanın su verme bonusu tamamen silinecek (cila %0). Emin misin?')) return;
  o.para -= altin;
  var so = {};
  for (var k in G.suMaks(f.e)) so[k] = 0;
  f.e.so = so;
  G.suSecimSifirla();
  G.statSinirla(); G.kaydet(); G.ustGuncelle(); G.cizDemirci();
  G.bildir('Cila sıfırlandı');
};

// ---- v0.36: Cila taşları — cilayı doğrudan yükseltir (veri.js → G.CILA_TASLARI) ----
G.cilaTasiBul = function (id) { return G.CILA_TASLARI.filter(function (t) { return t.id === id; })[0]; };

// Düşen taşın kademesi: alan = 'agirlikElit' | 'agirlikBoss'
G.cilaTasiSec = function (alan) {
  var top = 0, r;
  G.CILA_TASLARI.forEach(function (t) { top += t[alan]; });
  r = Math.random() * top;
  for (var i = 0; i < G.CILA_TASLARI.length; i++) {
    r -= G.CILA_TASLARI[i][alan];
    if (r < 0) return G.CILA_TASLARI[i];
  }
  return G.CILA_TASLARI[0];
};

// Her statın oranı taşın gücü kadar artar (en fazla %100) → cila da o kadar artar
G.cilala = function (id, tasId) {
  var o = G.o, f = G.esyaBul(id), t = G.cilaTasiBul(tasId);
  if (!f || !t) return;
  if (o.sarf[tasId] < 1) { G.bildir(t.ad + ' yok.'); return; }
  var e = f.e, m = G.suMaks(e);
  if (G.cila(e) >= 100) { G.bildir('Cila zaten tam.'); return; }
  o.sarf[tasId]--;
  var so = {};
  for (var k in m) so[k] = Math.min(100, ((e.so && e.so[k]) || 0) + t.arti);
  e.so = so;
  G.suOnizleme = null;
  G.sesCal('cekic');
  G.statSinirla(); G.kaydet(); G.ustGuncelle(); G.cizDemirci();
  G.bildir(t.ad + ': cila %' + G.cila(e));
};
