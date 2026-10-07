// ============================================================
// gunluk.js — v0.18: Günlük ve haftalık görevler, aktiflik sandıkları
// Gün gece yarısı, hafta pazartesi sıfırlanır (telefonun yerel saati)
// ============================================================
G.tarihYazi = function (d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
};
G.bugun = function () { return G.tarihYazi(new Date(Date.now())); };
G.buHafta = function () {
  var d = new Date(Date.now()), gun = (d.getDay() + 6) % 7;   // pazartesi = 0
  d.setDate(d.getDate() - gun);
  return G.tarihYazi(d);
};

G.yeniDonem = function (anahtar) { return { anahtar: anahtar, sayac: {}, alinan: {}, aktiflik: 0, sandik: {} }; };

// Gün/hafta değiştiyse sıfırla. Yeni gün haftalık "giriş" sayacını artırır
G.gunlukKontrol = function () {
  var o = G.o;
  if (!o) return;
  var gun = G.bugun(), hafta = G.buHafta();
  if (!o.haftalik || o.haftalik.anahtar !== hafta) o.haftalik = G.yeniDonem(hafta);
  if (!o.gunluk || o.gunluk.anahtar !== gun) {
    o.gunluk = G.yeniDonem(gun);
    o.haftalik.sayac.giris = (o.haftalik.sayac.giris || 0) + 1;
    G.kaydet();
  }
};

// Oyundaki olaylar buradan sayılır
G.gorevSay = function (sayac, n) {
  var o = G.o;
  if (!o) return;
  G.gunlukKontrol();
  o.istatistik.sayac[sayac] = (o.istatistik.sayac[sayac] || 0) + (n || 1);   // kalıcı (bölümler için)
  [o.gunluk, o.haftalik].forEach(function (d) { d.sayac[sayac] = (d.sayac[sayac] || 0) + (n || 1); });
};

G.gorevListe = function (tur) { return tur === 'haftalik' ? G.HAFTALIK : G.GUNLUK; };
G.gorevDonem = function (tur) { return tur === 'haftalik' ? G.o.haftalik : G.o.gunluk; };

G.gunlukAl = function (tur, id) {
  var d = G.gorevDonem(tur), g = G.gorevListe(tur).filter(function (x) { return x.id === id; })[0];
  if (!g || d.alinan[id] || (d.sayac[g.sayac] || 0) < g.n) return;
  d.alinan[id] = true;
  d.aktiflik = Math.min(100, d.aktiflik + g.akt);
  G.kaydet(); G.panelYenile();
  G.bildir('+' + g.akt + ' aktiflik');
};

// Sandık ödülü: paraLv seviyeyle çarpılır
G.sandikOdul = function (odul) {
  var o = G.o, s = {};
  for (var k in odul) { if (k === 'paraLv') s.para = odul[k] * o.lv; else s[k] = odul[k]; }
  return s;
};

G.sandikAc = function (tur, esik) {
  var o = G.o, d = G.gorevDonem(tur), liste = tur === 'haftalik' ? G.SANDIK_HAFTALIK : G.SANDIK_GUNLUK;
  var s = liste.filter(function (x) { return x.esik === esik; })[0];
  if (!s) return;
  var odul = G.sandikOdul(s.odul);
  if (d.sandik[esik] || d.aktiflik < esik) {
    // Açılamıyorsa sadece içeriğini göster
    G.$('modalIc').innerHTML = '<h3>🎁 ' + esik + ' aktiflik sandığı</h3><p class="bilgi">' + G.odulYazi(odul) + '</p>' +
      '<p class="bilgi soluk">' + (d.sandik[esik] ? 'Bu sandığı zaten açtın.' : 'Açmak için ' + esik + ' aktiflik gerekiyor.') + '</p>' +
      '<div class="modal-dugmeler"><button data-eylem="modalKapat">Kapat</button></div>';
    G.$('modal').classList.remove('gizli');
    return;
  }
  d.sandik[esik] = true;
  for (var k in odul) { if (k === 'para') o.para += odul[k]; else o.sarf[k] = (o.sarf[k] || 0) + odul[k]; }
  G.log('🎁 Aktiflik sandığı: ' + G.odulYazi(odul), 'kazanc');
  G.bildir('Sandık açıldı!');
  G.kaydet(); G.panelYenile(); G.ustGuncelle();
};

// "Git": görevin yapılacağı yere götür
G.gunlukGit = function (yer) {
  var o = G.o;
  if (yer === 'savas') G.sekmeAc('savas');
  else if (yer === 'demirci' || yer === 'guclendir') { G.demirciAlt = yer === 'guclendir' ? 'guclendir' : 'arit'; G.sekmeAc('demirci'); }
  else if (yer === 'maden') { G.etkinlikGorunum = 'maden'; G.sekmeAc('etkinlik'); }
  else if (yer === 'kasaba') G.bolgeGit(o.sonKasaba, true);
  else if (yer === 'canta') G.sekmeAc('canta');
  else if (yer === 'meridyen') { G.karakterAlt = 'meridyen'; G.sekmeAc('karakter'); }
};

// Toplanmamış ödül var mı (etkinlik kartında rozet için)
G.gunlukBekleyen = function () {
  var o = G.o, n = 0;
  G.gunlukKontrol();
  ['gunluk', 'haftalik'].forEach(function (tur) {
    var d = G.gorevDonem(tur);
    G.gorevListe(tur).forEach(function (g) { if (!d.alinan[g.id] && (d.sayac[g.sayac] || 0) >= g.n) n++; });
    (tur === 'haftalik' ? G.SANDIK_HAFTALIK : G.SANDIK_GUNLUK).forEach(function (s) { if (!d.sandik[s.esik] && d.aktiflik >= s.esik) n++; });
  });
  return n;
};

// Sıfırlanmaya kalan süre
G.kalanSure = function (tur) {
  var simdi = new Date(Date.now()), hedef = new Date(simdi);
  hedef.setHours(24, 0, 0, 0);
  if (tur === 'haftalik') { var gun = (simdi.getDay() + 6) % 7; hedef.setDate(hedef.getDate() + (6 - gun)); }
  var sn = Math.max(0, Math.floor((hedef - simdi) / 1000)), g = Math.floor(sn / 86400), s = Math.floor(sn % 86400 / 3600), d = Math.floor(sn % 3600 / 60);
  return (g ? g + ' gün ' : '') + s + ' sa ' + d + ' dk';
};
