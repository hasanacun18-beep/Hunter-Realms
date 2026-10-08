// ============================================================
// ruhdokum.js — v0.42: Ruh Dökümü (Warriors and Adventure'daki "Soulcasting")
// Efsanevi eşyaya Beş Renk Taşı ile rastgele ek statlar dökülür; önce önizleme, sonra Kaydet.
// Statlar ancak aynı elementten en az G.RUHDOKUM.esik Efsanevi eşya kuşanılıysa işler.
// Ayarlar: veri.js → G.RUHDOKUM · kayıt: eşyada e.ruh = { el: elementId, st: [{ k, v }] }
// ============================================================

G.ruhOnizleme = null;   // { id, st } — kaydedilmemiş sonuç

G.ruhElement = function (id) {
  return G.RUHDOKUM.elementler.filter(function (x) { return x.id === id; })[0];
};

// Yeni Efsanevi eşyaya rastgele element (esya.js → G.esyaOlustur)
G.ruhYeni = function () {
  var E = G.RUHDOKUM.elementler;
  return { el: E[Math.floor(Math.random() * E.length)].id, st: [] };
};

// Eşyanın stat havuzu, en fazla değerleriyle: [{ k, maks }]
G.ruhHavuz = function (e) {
  var s = G.ESYALAR[e.sablon], H = G.RUHDOKUM.havuz[G.RUHDOKUM.slotHavuz[s.slot]] || [];
  return H.map(function (h) { return { k: h.k, maks: Math.round(h.maks + (h.lvCarpan ? s.lv * h.lvCarpan : 0)) }; });
};

// Yeni statlar: her satır havuzdan eşit şansla, değer en fazlanın %30-100'ü
G.ruhZarla = function (e) {
  var havuz = G.ruhHavuz(e), st = [];
  for (var i = 0; i < G.RUHDOKUM.satir; i++) {
    var h = havuz[Math.floor(Math.random() * havuz.length)];
    st.push({ k: h.k, v: Math.max(1, Math.round(h.maks * (0.3 + Math.random() * 0.7))) });
  }
  return st;
};

// Kuşanılı Efsanevi eşyaların element sayıları: { yesil: 2, ... }
G.ruhSayilari = function (o) {
  var say = {};
  for (var k in o.kusanilan) {
    var e = o.kusanilan[k];
    if (e && e.ruh) say[e.ruh.el] = (say[e.ruh.el] || 0) + 1;
  }
  return say;
};

// Bu eşyanın ruh statları işliyor mu (kuşanılı + aynı elementten yeterli eşya)
G.ruhEtkin = function (e, o) {
  o = o || G.o;
  if (!e || !e.ruh || !e.ruh.st.length) return false;
  var kusanili = false;
  for (var k in o.kusanilan) if (o.kusanilan[k] === e) kusanili = true;
  return kusanili && (G.ruhSayilari(o)[e.ruh.el] || 0) >= G.RUHDOKUM.esik;
};

// Etkin bütün ruh statları (durum.js → G.hesapla ekler)
G.ruhStat = function (o) {
  var top = {}, say = G.ruhSayilari(o);
  for (var k in o.kusanilan) {
    var e = o.kusanilan[k];
    if (!e || !e.ruh || (say[e.ruh.el] || 0) < G.RUHDOKUM.esik) continue;
    e.ruh.st.forEach(function (x) { top[x.k] = (top[x.k] || 0) + x.v; });
  }
  return top;
};

G.ruhDok = function (id) {
  var o = G.o, f = G.esyaBul(id), R = G.RUHDOKUM;
  if (!f || !f.e.ruh) return;
  if (o.sarf.besRenk < R.tas) { G.bildir(R.tas + ' Beş Renk Taşı gerekiyor. Bosslardan ve Efsanevi eşya eritmekten gelir.'); return; }
  o.sarf.besRenk -= R.tas;
  G.ruhOnizleme = { id: id, st: G.ruhZarla(f.e) };
  G.sesCal('cekic');
  G.kaydet(); G.cizDemirci();
};

G.ruhKaydet = function () {
  var a = G.ruhOnizleme, f = a && G.esyaBul(a.id);
  if (!f) return;
  f.e.ruh.st = a.st;
  G.ruhOnizleme = null;
  G.sesCal('basari');
  G.statSinirla(); G.kaydet(); G.ustGuncelle(); G.cizDemirci();
  G.bildir('Ruh dökümü kaydedildi');
};
