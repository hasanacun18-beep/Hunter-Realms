// ============================================================
// savas.js — v0.7: Çoklu savaş. Aktif canavarlar yanındaysa vurur, oyuncu menzildeki hedefine vurur.
// Savaş turu her G.TUR_MS'de bir işler (ana.js'teki zamanlayıcı).
// ============================================================
G.bolgeBul = function (id) {
  for (var i = 0; i < G.BOLGELER.length; i++) if (G.BOLGELER[i].id === id) return G.BOLGELER[i];
  if (id === 'kule') return { id: 'kule', ad: 'Kule', tur: 'kule', minLv: 0 };
  return G.BOLGELER[0];
};

// Canavar statları seviyeye göre büyür (ayarlar: veri.js → G.ZORLUK)
G.canavarOlustur = function (id) {
  var s = G.CANAVARLAR[id], z = G.ZORLUK, L = s.lv - 1;
  // Ek çarpan: ilk bölgelerde yok, z.carpanBasLv'den z.carpanTamLv'ye kadar artarak tam güce ulaşır
  var kk = Math.max(0, Math.min(1, (s.lv - z.carpanBasLv) / (z.carpanTamLv - z.carpanBasLv)));
  var hpC = (1 + L * z.hpArtis) * (s.boss ? z.bossHp : 1) * (1 + (z.hpCarpan - 1) * kk);
  var atkC = (1 + L * z.atkArtis) * (s.boss ? z.bossAtk : 1) * (1 + (z.atkCarpan - 1) * kk);
  // Geç oyun yumuşatması: z.gecLv'den sonra her seviyede can ve saldırı biraz azaltılır
  var gec = Math.max(0, s.lv - (z.gecLv || 999));
  hpC *= Math.max(0.3, 1 - gec * (z.gecHp || 0));
  atkC *= Math.max(0.3, 1 - gec * (z.gecAtk || 0));
  var hp = Math.round(s.hp * hpC);
  return {
    id: id, ad: s.ad, ikon: s.ikon, lv: s.lv, hp: hp, hpMax: hp,
    atk: [Math.round(s.atk[0] * atkC), Math.round(s.atk[1] * atkC)],
    def: Math.round(s.def * (1 + L * z.defArtis)), boss: !!s.boss, olu: false,
    saldirgan: !s.boss && Math.random() * 100 < G.SAHA.saldirganSans,
    aktif: false, t: 0, gezT: 2 + Math.random() * 4
  };
};

G.rastgeleCanavar = function () {
  var b = G.bolgeBul(G.o.bolge);
  if (!b.canavarlar) return null;
  var h = G.rastgeleBosHucre(2);
  if (!h) return null;
  var c = G.canavarOlustur(b.canavarlar[Math.floor(Math.random() * b.canavarlar.length)]);
  c.kol = h.kol; c.sat = h.sat;
  return c;
};

G.alanDoldur = function () {
  G.alan = [];
  G.oyuncu = { kol: 2, sat: 3, t: 0 };
  G.savas = null; G.hedefI = null; G.hedefHucre = null;
  var bolge = G.bolgeBul(G.o.bolge);
  if (bolge.tur === 'kule') {
    // Kule: tek bekçi, oyuncunun karşısında
    if (!G.kule) { G.o.bolge = G.o.sonKasaba; return; }
    var b = G.kuleBekci(G.kule.kat);
    b.kol = 2; b.sat = 1; G.oyuncu = { kol: 2, sat: 3, t: 0 };
    G.alan.push(b); G.hedefI = 0;
    return;
  }
  if (!bolge.canavarlar) return;
  for (var i = 0; i < G.SAHA.canavarSayi; i++) {
    var c = G.rastgeleCanavar();
    if (c) G.alan.push(c);
  }
};

G.kartKey = function (i) { return String(i); };

G.bekleSay = 0;
G.aktifler = function () { return G.alan.filter(function (c) { return c && !c.olu && c.aktif; }); };
// Sana saldıran canavar varsa tehlikedesin: bölge değiştiremez, parşömen okuyamaz, can yenilemezsin
G.tehlikede = function () { return G.avBolgesiMi() && G.aktifler().length > 0; };

// ---- Beceri şekilleri: hangi karelere vurur ----
G.yonBul = function (p, t) {
  var dx = Math.sign(t.kol - p.kol), dy = Math.sign(t.sat - p.sat);
  if (!dx && !dy) dx = 1;
  for (var i = 0; i < 8; i++) if (G.YONLER[i][0] === dx && G.YONLER[i][1] === dy) return i;
  return 0;
};

G.sekilHucreleri = function (sekil, t) {
  var p = G.oyuncu, h = [];
  function ekle(k, s) { if (G.icinde(k, s)) h.push({ kol: k, sat: s }); }
  if (sekil === 'yarimay') {
    var y = G.yonBul(p, t);
    [y, (y + 1) % 8, (y + 7) % 8].forEach(function (d) { ekle(p.kol + G.YONLER[d][0], p.sat + G.YONLER[d][1]); });
  } else if (sekil === 'kasirga') {
    G.YONLER.forEach(function (d) { ekle(p.kol + d[0], p.sat + d[1]); });
  } else if (sekil === 'alan') {
    for (var a = -1; a <= 1; a++) for (var b = -1; b <= 1; b++) ekle(t.kol + a, t.sat + b);
  } else if (sekil === 'cizgi') {
    var yd = G.YONLER[G.yonBul(p, t)];
    for (var n = 1; n <= 4; n++) ekle(p.kol + yd[0] * n, p.sat + yd[1] * n);
  } else {
    ekle(t.kol, t.sat);
  }
  return h;
};

G.hucredekiler = function (hucreler) {
  var liste = [];
  hucreler.forEach(function (h) { var i = G.canavarAt(h.kol, h.sat); if (i >= 0) liste.push(i); });
  return liste;
};

// ---- Ana savaş turu ----
G.savasTik = function () {
  var o = G.o;
  if (!o || !G.avBolgesiMi()) { G.savas = null; return; }
  var p = G.oyuncu, r = G.hesapla(o), menzil = G.menzil();
  var aktifler = G.aktifler();

  // Bize saldıran varken hedefimiz yoksa en yakınına dön
  // Üstümüze gelenler varken yerimizde durup menzile girene vururuz (onlar bize koşar).
  var t = G.hedefI != null ? G.alan[G.hedefI] : null;
  if ((!t || t.olu) && aktifler.length && !G.hedefHucre) {
    var en = null;
    aktifler.forEach(function (c) {
      if (G.cheb(p, c) > menzil) return;
      if (!en || G.cheb(p, c) < G.cheb(p, en)) en = c;
    });
    if (en) { G.hedefI = G.alan.indexOf(en); t = en; G.bekleSay = 0; }
    else if (o.ayar.otoSavas && ++G.bekleSay > 4) {
      // Kimse ulaşamıyorsa (yol kapalı) en yakın saldırana biz gideriz
      aktifler.forEach(function (c) { if (!en || G.cheb(p, c) < G.cheb(p, en)) en = c; });
      G.hedefI = G.alan.indexOf(en); t = en; G.bekleSay = 0;
    }
  }
  var menzilde = t && !t.olu && G.cheb(p, t) <= menzil && !G.hedefHucre;

  if (!aktifler.length && !menzilde) {
    if (G.savas) { G.savas = null; G.iksirBek.hp = 0; G.iksirBek.mp = 0; G.arayuzGuncelle(); }
    return;
  }
  if (!G.savas) G.savas = { istek: null, kalkan: null, guc: null };
  var s = G.savas;

  for (var bid in G.bekleme) if (G.bekleme[bid] > 0) G.bekleme[bid]--;
  if (G.iksirBek.hp > 0) G.iksirBek.hp--;
  if (G.iksirBek.mp > 0) G.iksirBek.mp--;
  // Savaşta mana yavaşça dolar
  if (aktifler.length && o.mp < r.mpMax) o.mp = Math.min(r.mpMax, o.mp + r.mpMax * G.ZORLUK.mpTur);
  if (o.ayar.otoIksir) {
    if (o.hp < r.hpMax * 0.4) G.iksir('hp', true);
    if (o.mp < G.enDusukMana()) G.iksir('mp', true);
  }

  if (menzilde) G.oyuncuSaldir(t, r);

  // Süreli hasar (zehir/yanma) tüm canavarlarda işler
  G.alan.forEach(function (c, i) {
    if (!c || c.olu || !c.dot) return;
    c.hp -= c.dot.h;
    G.hasarGoster(i, c.dot.h, false, 'dot');
    if (--c.dot.tur <= 0) c.dot = null;
  });
  G.alan.forEach(function (c, i) { if (c && !c.olu && c.hp <= 0) G.canavarOldu(i); });

  // --- Yanımızdaki aktif canavarlar vurur ---
  var vuranSayi = 0;
  G.alan.forEach(function (c) {
    if (!c || c.olu || !c.aktif || G.cheb(p, c) > 1 || o.hp <= 0) return;
    if (c.sersem > 0) { c.sersem--; return; }
    vuranSayi++;
    var kacinma = Math.min(30, r.hiz * 0.6);
    if (Math.random() * 100 < kacinma) { G.oyuncuHasar('Kaçındın'); return; }
    var md = G.rastgele(c.atk[0], c.atk[1]);
    if (c.boss && c.hp < c.hpMax * G.ZORLUK.ofkeEsik) {
      if (!c.ofke) { c.ofke = true; G.log(c.ad + ' öfkelendi!', 'tehlike'); }
      md *= G.ZORLUK.ofkeCarpan;
    }
    md -= r.def * 0.6;
    if (s.kalkan) md *= 1 - s.kalkan.oran / 100;
    md = Math.max(1, Math.round(md));
    o.hp -= md;
    G.oyuncuHasar('-' + md);
    G.darbeEfekti(md / r.hpMax);
  });
  if (o.hp <= 0) { G.yenilgi(); return; }
  if (s.kalkan && vuranSayi && --s.kalkan.tur <= 0) s.kalkan = null;
  G.arayuzGuncelle();
};

G.oyuncuSaldir = function (t, r) {
  var o = G.o, s = G.savas;
  var id = s.istek || (o.ayar.otoBeceri ? G.otoBeceriSec(t) : null);
  s.istek = null;
  var b = id ? G.BECERILER[id] : null;
  if (b && (o.mp < b.mp || (G.bekleme[id] || 0) > 0)) b = null;
  var e = b ? G.beceriEtki(id, o.beceriler[id]) : { tip: 'hasar', carpan: 1, vurus: 1, sekil: 'tek' };
  if (b && e.tip === 'hasar' && !G.hucredekiler(G.sekilHucreleri(e.sekil, t)).length) { b = null; e = { tip: 'hasar', carpan: 1, vurus: 1, sekil: 'tek' }; }
  var gucCarpan = 1 + (s.guc ? s.guc.oran / 100 : 0);
  var beceriCarpan = 1 + r.beceriBonus + r.beceri / 100;
  if (b) { o.mp -= b.mp; G.bekleme[id] = b.bekleme; G.ustalikEkle(id, 10); G.log(b.ikon + ' ' + b.ad, 'sistem'); }

  if (e.tip === 'hasar') {
    var hucreler = G.sekilHucreleri(e.sekil, t);
    var hedefler = G.hucredekiler(hucreler), toplam = 0;
    G.fx.oynat(b ? (b.efekt || G.FX_NORMAL[o.sinif]) : G.FX_NORMAL[o.sinif], t, hucreler, !!b, b ? b.ad : null);
    hedefler.forEach(function (i) {
      var c = G.alan[i];
      c.aktif = true;
      for (var v = 0; v < (e.vurus || 1) && c.hp > 0; v++) toplam += G.vur(i, c, r, gucCarpan, b ? e.carpan * beceriCarpan : 1, b ? 'beceri' : '');
      if (e.sersem && c.hp > 0 && !c.boss) c.sersem = e.sersem;
      if (e.dot && c.hp > 0) c.dot = { h: Math.round((r.atkMin + r.atkMax) / 2 * e.dot * beceriCarpan), tur: e.sure };
    });
    // Tetiklenen ek vuruş (pasif becerilerden)
    if (!b && r.ekVurus && t.hp > 0 && Math.random() * 100 < r.ekVurus) toplam += G.vur(G.alan.indexOf(t), t, r, gucCarpan, 0.6);
    if (!b) toplam += G.ilahiTetik(t, r);
    if (r.canCal && toplam) o.hp = Math.min(r.hpMax, o.hp + Math.round(toplam * r.canCal / 100));
  } else if (e.tip === 'iyilesme') {
    G.fx.oynat(b.efekt || 'sifa', t, null, true, b.ad);
    var iy = Math.round(r.hpMax * e.oran / 100);
    o.hp = Math.min(r.hpMax, o.hp + iy);
    G.oyuncuHasar('+' + iy);
  } else if (e.tip === 'kalkan') {
    G.fx.oynat(b.efekt || 'kalkan', t, null, true, b.ad);
    s.kalkan = { oran: e.oran, tur: e.sure };
  } else if (e.tip === 'guc') {
    G.fx.oynat(b.efekt || 'guc', t, null, true, b.ad);
    s.guc = { oran: e.oran, tur: e.sure };
  }
  if (s.guc && e.tip !== 'guc' && --s.guc.tur <= 0) s.guc = null;
};

G.vur = function (i, c, r, gucCarpan, carpan, tur) {
  var h = G.rastgele(r.atkMin, r.atkMax) * gucCarpan;
  var krit = Math.random() * 100 < r.krit;
  if (krit) h *= 1.6 + r.kritHasar / 100;
  h = Math.max(1, Math.round(h * carpan - c.def));
  c.hp -= h;
  G.hasarGoster(i, h, krit, tur);
  return h;
};

// Otomatik beceri: yuva sırasıyla ilk mantıklı ve hazır beceri
G.otoBeceriSec = function (t) {
  var o = G.o, s = G.savas, r = G.hesapla(o);
  var liste = G.aktifBeceriler();
  for (var i = 0; i < liste.length; i++) {
    var id = liste[i];
    if (!G.otoAcikMi(id)) continue;
    var b = G.BECERILER[id], e = G.beceriEtki(id, o.beceriler[id]);
    if (o.mp < b.mp || (G.bekleme[id] || 0) > 0) continue;
    if (e.tip === 'iyilesme' && o.hp > r.hpMax * 0.5) continue;
    if (e.tip === 'kalkan' && (s.kalkan || G.aktifler().length === 0)) continue;
    if (e.tip === 'guc' && s.guc) continue;
    if (e.tip === 'hasar') {
      var sayi = G.hucredekiler(G.sekilHucreleri(e.sekil, t)).length;
      if (!sayi) continue;
      // Alan becerilerini tek hedefe harcama (güçlü olanlar hariç)
      if (e.sekil !== 'tek' && sayi < 2 && e.carpan < 1.5) continue;
      if (e.dot && t.dot && e.sekil === 'tek') continue;
      if (e.sersem && t.boss && !e.dot && e.carpan < 1.5) continue;
    }
    return id;
  }
  return null;
};

G.canavarOldu = function (i) {
  var c = G.alan[i], o = G.o, cs = G.CANAVARLAR[c.id];
  c.olu = true; c.hp = 0; c.aktif = false; c.dot = null;
  if (c.kuleBekci) { G.kaydet(); G.kuleZafer(); return; }
  o.istatistik.oldurme++;
  G.gorevSay('oldur');
  o.istatistik.oldurId[c.id] = (o.istatistik.oldurId[c.id] || 0) + 1;
  if (c.boss) G.gorevSay('boss');
  if (c.boss) o.istatistik.bosslar[c.id] = (o.istatistik.bosslar[c.id] || 0) + 1;
  if (G.hedefI === i) G.hedefI = null;

  var r = G.hesapla(o), b = G.bolgeBul(o.bolge);
  var para = Math.round(G.rastgele(cs.para[0], cs.para[1]) * (1 + r.altin / 100) * G.ZORLUK.altinCarpan);
  var exp = Math.round(cs.exp * (1 + r.tecrube / 100));
  o.para += para;
  G.log(c.ad + ' öldürüldü. +' + exp + ' tecrübe, +' + para + ' altın', 'kazanc');

  var adet = c.boss ? 2 : 1, sans = c.boss ? 100 : G.DUSME.esya;
  for (var k = 0; k < adet; k++) {
    if (Math.random() * 100 < sans) G.cantayaEkle(G.esyaUret(o, c.lv, c.boss ? 4 : 1));
  }
  if (b.set && Math.random() * 100 < (c.boss ? G.SET_DUSME_BOSS : G.SET_DUSME_NORMAL)) {
    var sp = G.setParcaUret(o, b.set, c.boss ? 3 : 1);
    if (sp) { G.log('Set parçası!', 'sistem'); G.cantayaEkle(sp); }
  }
  if (Math.random() * 100 < (c.boss ? G.KITAP_DUSME_BOSS : G.KITAP_DUSME_NORMAL)) G.kitapDus(c.lv);
  var sayfa = c.boss ? G.rastgele(G.DUSME.sayfaBoss[0], G.DUSME.sayfaBoss[1]) : (Math.random() * 100 < G.DUSME.sayfa ? G.rastgele(1, 2) : 0);
  if (sayfa) { o.sarf.sayfa += sayfa; if (c.boss) G.log('+' + sayfa + ' ' + G.SARF.sayfa.ikon + ' Kitap Sayfası'); }
  var hap = c.boss ? G.rastgele(G.DUSME.hapBoss[0], G.DUSME.hapBoss[1]) : (Math.random() * 100 < G.DUSME.hap ? 1 : 0);
  if (hap) { o.sarf.hap += hap; G.log('+' + hap + ' ' + G.SARF.hap.ikon + ' Meridyen Hapı'); }
  G.ogrenilenler('pasif').forEach(function (pid) { G.ustalikEkle(pid, 1); });
  if (c.boss || Math.random() * 100 < G.DUSME.hpIksir) { var n = c.boss ? 5 : 1; o.sarf.hp += n; G.log('+' + n + ' Can İksiri'); }
  if (c.boss || Math.random() * 100 < G.DUSME.mpIksir) { var m = c.boss ? 5 : 1; o.sarf.mp += m; G.log('+' + m + ' Mana İksiri'); }
  if (c.boss || Math.random() * 100 < G.DUSME.tas) { var ts = c.boss ? 3 : 1; o.sarf.tas += ts; G.log('+' + ts + ' Arıtma Taşı'); }

  G.expEkle(exp);
  G.kartYenile(i);
  G.olumEfekti(i);

  if (!c.boss) {
    var bolge = o.bolge, eski = c;
    setTimeout(function () {
      if (G.o.bolge !== bolge || G.alan[i] !== eski) return;
      var yeni = G.rastgeleCanavar();
      if (yeni) { G.alan[i] = yeni; G.kartYenile(i); }
    }, G.SAHA.dogmaMs);
  } else {
    setTimeout(function () { var el = G.$('kart' + i); if (el && G.alan[i] === c) el.remove(); }, 1200);
  }
  G.kaydet();
};

G.yenilgi = function () {
  var o = G.o, r = G.hesapla(o);
  G.savas = null; G.iksirBek.hp = 0; G.iksirBek.mp = 0;
  if (o.bolge === 'kule') { o.hp = r.hpMax; o.mp = r.mpMax; G.kuleBitir(false, 'Bekçi seni yendi. Kulede tecrübe kaybetmezsin.'); return; }
  o.istatistik.olum++;
  var kayip = Math.floor(o.exp * G.ZORLUK.olumExp);
  o.exp -= kayip; o.hp = r.hpMax; o.mp = r.mpMax;
  o.ayar.otoSavas = false;
  G.log('Yenildin! ' + kayip + ' tecrübe kaybettin. ' + G.bolgeBul(o.sonKasaba).ad + ' kasabasında uyandın.', 'tehlike');
  G.bildir('Yenildin!');
  G.bolgeGit(o.sonKasaba, true);
};

// Kaç: tüm canavarlar peşini bırakır, canları dolar. Birkaç saniye saldırganlar fark etmez.
G.kac = function () {
  if (!G.tehlikede()) return;
  G.alan.forEach(function (c) { if (c && !c.olu && c.aktif) { c.aktif = false; c.hp = c.hpMax; c.dot = null; c.sersem = 0; } });
  G.savas = null; G.hedefI = null; G.kacisSure = 5;
  G.iksirBek.hp = 0; G.iksirBek.mp = 0;
  G.o.ayar.otoSavas = false;
  G.log('Savaştan kaçtın.');
  if (G.sekme === 'savas') G.cizSavas();
};

G.bossBaslat = function () {
  var b = G.bolgeBul(G.o.bolge);
  if (!b.boss) { G.bildir('Burada boss yok.'); return; }
  if (G.alan.some(function (c) { return c && c.boss && !c.olu; })) { G.bildir('Boss zaten sahada.'); return; }
  G.alan = G.alan.filter(function (c) { return c && !(c.boss && c.olu); });
  // Oyuncunun yanındaki boş kare (yoksa herhangi bir boş kare)
  var h = null, p = G.oyuncu;
  G.YONLER.forEach(function (d) { var k = p.kol + d[0], s = p.sat + d[1]; if (!h && G.icinde(k, s) && !G.doluMu(k, s)) h = { kol: k, sat: s }; });
  h = h || G.rastgeleBosHucre(0);
  if (!h) { G.bildir('Sahada yer yok.'); return; }
  var c = G.canavarOlustur(b.boss);
  c.kol = h.kol; c.sat = h.sat; c.aktif = true;
  G.alan.push(c);
  G.hedefI = G.alan.length - 1; G.hedefHucre = null;
  G.log(c.ad + ' ortaya çıktı!', 'tehlike');
  G.sesCal('boss');
  if (G.sekme === 'savas') G.cizSavas();
};

// Savaş ekranındaki beceri düğmesine dokununca bir sonraki turda kullanılır
G.beceriKullan = function (id) {
  if (!G.savas) { G.bildir('Önce bir canavara dokun.'); return; }
  if (!id || !G.o.beceriler[id]) return;
  G.savas.istek = id;
  G.aksiyonGuncelle();
};

G.iksirBek = { hp: 0, mp: 0 };   // savaşta iksirler arası bekleme

// Aktif yuvalardaki en ucuz becerinin manası (otomatik mana iksiri için eşik)
G.enDusukMana = function () {
  var o = G.o, min = Infinity;
  G.aktifBeceriler().forEach(function (id) {
    if (G.otoAcikMi(id) && G.BECERILER[id].mp > 0) min = Math.min(min, G.BECERILER[id].mp);
  });
  return min === Infinity ? 0 : min;
};

G.iksir = function (t, oto) {
  var o = G.o, r = G.hesapla(o);
  if (o.sarf[t] <= 0) { if (!oto) G.bildir('İksir kalmadı. Kasabadaki iksirciden alabilirsin.'); return; }
  if (G.tehlikede() && G.iksirBek[t] > 0) { if (!oto) G.bildir('İksir için ' + G.iksirBek[t] + ' tur bekle.'); return; }
  if (t === 'hp') {
    if (o.hp >= r.hpMax) { if (!oto) G.bildir('Canın zaten dolu.'); return; }
    o.hp = Math.min(r.hpMax, o.hp + 60 + o.lv * 8 + Math.round(r.hpMax * G.IKSIR.hpYuzde));
  } else {
    if (o.mp >= r.mpMax) { if (!oto) G.bildir('Manan zaten dolu.'); return; }
    o.mp = Math.min(r.mpMax, o.mp + 40 + o.lv * 5 + Math.round(r.mpMax * G.IKSIR.mpYuzde));
  }
  o.sarf[t]--;
  G.sesCal('iksir');
  G.gorevSay('iksir');
  if (G.tehlikede()) G.iksirBek[t] = G.ZORLUK.iksirBekleme;
  G.arayuzGuncelle();
};

// Bölgeye git (zincirden, haritadan, ölünce veya parşömenle)
G.bolgeGit = function (id, zorla) {
  var o = G.o, b = G.bolgeBul(id);
  if (!zorla) {
    if (o.lv < b.minLv) { G.bildir('Seviye ' + b.minLv + ' gerekiyor.'); return; }
  }
  o.bolge = id;
  o.gezilen[id] = 1;
  if (b.tur === 'kasaba') o.sonKasaba = id;
  G.alanDoldur(); G.kaydet(); G.modalKapat();
  if (G.sekme !== 'savas') G.sekmeAc('savas'); else G.cizSavas();
  G.ustGuncelle();
  G.bolgeAfisi(b.ad);
};

G.parsomenOku = function () {
  var o = G.o;
  if (o.bolge === 'kule') { G.kuleBitir(false, 'Meydan okumadan çekildin.'); return; }
  if (!G.avBolgesiMi()) { G.bildir('Zaten kasabadasın.'); return; }
  if (o.sarf.parsomen <= 0) { G.bildir('Dönüş Parşömenin yok. Kasabadaki iksirciden alabilirsin.'); return; }
  o.sarf.parsomen--;
  G.bolgeGit(o.sonKasaba, true);
};

// Savaş dışında yavaşça can/mana yenile
G.yenilenme = function () {
  if (!G.o || G.tehlikede()) return;
  var o = G.o, r = G.hesapla(o);
  if (o.hp >= r.hpMax && o.mp >= r.mpMax) return;
  o.hp = Math.min(r.hpMax, o.hp + Math.ceil(r.hpMax * 0.04));
  o.mp = Math.min(r.mpMax, o.mp + Math.ceil(r.mpMax * 0.04));
  G.ustGuncelle();
};
