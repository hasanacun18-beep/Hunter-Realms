// ============================================================
// uzmanlik.js — v0.44: sınıf uzmanlıkları
// Seviye 10'da bir kez seçilir; seçim mevcut kayıtlara ek alan olarak göç eder.
// ============================================================
G.UZMANLIK_SEVIYE = 10;

G.uzmanlikListe = function (sinif) {
  return (G.UZMANLIKLAR && G.UZMANLIKLAR[sinif]) || [];
};

G.uzmanlikBul = function (sinif, id) {
  var liste = G.uzmanlikListe(sinif);
  for (var i = 0; i < liste.length; i++) if (liste[i].id === id) return liste[i];
  return null;
};

G.uzmanlikSecilebilir = function (o) {
  return !!o && !o.uzmanlik && o.lv >= G.UZMANLIK_SEVIYE && G.uzmanlikListe(o.sinif).length > 0;
};

G.uzmanlikHtml = function () {
  var o = G.o, secili = o.uzmanlik && G.uzmanlikBul(o.sinif, o.uzmanlik);
  if (secili) return '<div class="kutu uzmanlik-kutu"><h2>' + secili.ikon + ' Uzmanlık: ' + secili.ad + '</h2>' +
    '<p>' + secili.aciklama + '</p><p class="bilgi">Bonus: ' + G.uzmanlikBonusYazi(secili) + '</p></div>';
  var kilitli = o.lv < G.UZMANLIK_SEVIYE;
  return '<div class="kutu uzmanlik-kutu"><h2>⚔️ Sınıf Uzmanlığı</h2>' +
    '<p>' + (kilitli ? 'Seviye ' + G.UZMANLIK_SEVIYE + ' olduğunda bir uzmanlık yolu seçebilirsin.' : 'Savaş tarzını belirleyecek bir uzmanlık yolu seç.') + '</p>' +
    (kilitli ? '<p class="soluk kucuk-not">Uzmanlık seçimine ' + (G.UZMANLIK_SEVIYE - o.lv) + ' seviye kaldı.</p>' :
      '<button class="genis-dugme" data-eylem="uzmanlikAc">Uzmanlık yollarını gör</button>') + '</div>';
};

G.uzmanlikBonusYazi = function (u) {
  var ad = { defYuzde: 'savunma', hpYuzde: 'can', atkYuzde: 'saldırı', krit: 'kritik', beceri: 'beceri hasarı', mp: 'mana', hiz: 'hız' };
  return Object.keys(u.bonus).map(function (k) { return '+' + u.bonus[k] + (/Yuzde$/.test(k) || k === 'krit' ? '%' : '') + ' ' + (ad[k] || k); }).join(', ');
};

G.uzmanlikAc = function () {
  var o = G.o;
  if (!G.uzmanlikSecilebilir(o)) {
    G.bildir(o.uzmanlik ? 'Zaten bir uzmanlık seçtin.' : 'Uzmanlık seçmek için seviye ' + G.UZMANLIK_SEVIYE + ' olmalısın.');
    return;
  }
  var secenek = G.uzmanlikListe(o.sinif).map(function (u) {
    return '<button class="uzmanlik-sec" data-eylem="uzmanlikSec" data-id="' + u.id + '"><b>' + u.ikon + ' ' + u.ad + '</b><small>' + u.aciklama + '</small><em>' + G.uzmanlikBonusYazi(u) + '</em></button>';
  }).join('');
  G.$('modalIc').innerHTML = '<h3>Sınıf Uzmanlığını Seç</h3><p class="kucuk-not">Bu seçim karakterine kalıcı bir savaş tarzı verir ve daha sonra değiştirilemez.</p><div class="uzmanlik-secimler">' + secenek + '</div><div class="modal-dugmeler"><button data-eylem="modalKapat">Vazgeç</button></div>';
  G.$('modal').classList.remove('gizli');
};

G.uzmanlikSec = function (id) {
  var o = G.o, u = G.uzmanlikBul(o.sinif, id);
  if (!G.uzmanlikSecilebilir(o) || !u) return;
  if (!confirm('"' + u.ad + '" uzmanlığını seçmek istiyor musun? Bu seçim değiştirilemez.')) return;
  o.uzmanlik = u.id;
  G.kaydet();
  G.modalKapat();
  G.cizKarakter();
  G.ustGuncelle();
  G.bildir(u.ad + ' uzmanlığını seçtin.');
};
