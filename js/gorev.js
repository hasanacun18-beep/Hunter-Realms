// ============================================================
// gorev.js — v0.15: Ana görev zinciri
// ============================================================

// Şu anki görev ve ilerlemesi: { g, sayi, hedef, bitti, yazi } ya da null (hepsi bitti)
G.gorevDurum = function () {
  var o = G.o, g = G.ANA_GOREV[o.gorev.i];
  if (!g) return null;
  var sayi = 0, hedef = 1, yazi = '';
  switch (g.t) {
    case 'seviye': sayi = o.lv; hedef = g.n; yazi = 'Seviye ' + g.n + ' ol'; break;
    case 'oldur':  sayi = o.istatistik.oldurme - o.gorev.taban; hedef = g.n; yazi = 'Canavar öldür'; break;
    case 'boss':
      var c = G.CANAVARLAR[g.id];
      sayi = (o.istatistik.bosslar[g.id] || 0) ? 1 : 0; yazi = 'Yen: ' + c.ikon + ' ' + c.ad; break;
    case 'bolge':  sayi = o.gezilen[g.id] ? 1 : 0; yazi = 'Git: ' + G.bolgeBul(g.id).ad; break;
    case 'beceri': sayi = Object.keys(o.beceriler).length; hedef = g.n; yazi = 'Beceri öğren'; break;
    case 'ilahi':  sayi = o.ilahi; hedef = g.n; yazi = 'İlahi silahı yükselt'; break;
  }
  sayi = Math.min(sayi, hedef);
  return { g: g, sayi: sayi, hedef: hedef, bitti: sayi >= hedef, yazi: yazi };
};

G.odulYazi = function (odul) {
  var ad = { para: 'altın', hp: 'Can İksiri', mp: 'Mana İksiri', tas: 'Arıtma Taşı', sayfa: 'Kitap Sayfası', parsomen: 'Dönüş Parşömeni', toz: 'Ruh Tozu', hap: 'Meridyen Hapı' };
  // Listede olmayan anahtar için eşya adını kullan (ör. Rün Özü), "undefined" yazmasın
  return Object.keys(odul).map(function (k) { return odul[k] + ' ' + (ad[k] || (G.SARF[k] && G.SARF[k].ad) || k); }).join(', ');
};

G.gorevAl = function () {
  var o = G.o, d = G.gorevDurum();
  if (!d || !d.bitti) return;
  for (var k in d.g.odul) {
    if (k === 'para') o.para += d.g.odul[k];
    else o.sarf[k] = (o.sarf[k] || 0) + d.g.odul[k];
  }
  G.log('📜 Ana görev tamamlandı: ' + G.odulYazi(d.g.odul), 'kazanc');
  G.bildir('Görev tamamlandı!');
  o.gorev.i++;
  o.gorev.taban = o.istatistik.oldurme;
  G.kaydet(); G.panelYenile(); G.ustGuncelle();
};

// Ana ekrandaki görev şeridi
G.gorevSeritHtml = function () {
  var d = G.gorevDurum();
  var metin = !d
    ? '<span class="gorev-yazi bitti">Tüm ana görevler tamamlandı</span>'
    : '<span class="gorev-yazi' + (d.bitti ? ' bitti' : '') + '"><em>[Ana Görev]</em> ' + d.yazi +
      ' <b>(' + d.sayi + '/' + d.hedef + ')</b></span>' +
      (d.bitti ? '<button class="gorev-al" data-eylem="gorevAl">Al</button>' : '');
  return '<div class="gorev-serit" id="gorevSerit">' +
    '<div class="kisayollar">' +
      '<button data-eylem="madenKisayol" aria-label="Maden">' + G.ikon('kazma') + '</button>' +
      '<button data-eylem="gorevBilgi" aria-label="Görev ödülü">' + G.ikon('sandik') + '</button>' +
      '<button data-eylem="ayarlar" aria-label="Ayarlar">' + G.ikon('carh') + '</button>' +
    '</div>' + metin + '</div>';
};

G.gorevGuncelle = function () {
  var el = G.$('gorevSerit');
  if (el) el.outerHTML = G.gorevSeritHtml();
};

G.gorevBilgiModal = function () {
  var d = G.gorevDurum();
  G.$('modalIc').innerHTML = '<h3>📜 Ana Görev</h3>' +
    (d ? '<p class="bilgi">' + d.yazi + ' (' + d.sayi + '/' + d.hedef + ')</p><p class="bilgi">Ödül: ' + G.odulYazi(d.g.odul) + '</p>' +
         '<p class="bilgi soluk">Görev ' + (G.o.gorev.i + 1) + ' / ' + G.ANA_GOREV.length + '</p>'
       : '<p class="bilgi">Bütün ana görevleri tamamladın.</p>') +
    '<div class="modal-dugmeler">' + (d && d.bitti ? '<button data-eylem="gorevAl">Ödülü al</button>' : '') + '<button data-eylem="modalKapat">Kapat</button></div>';
  G.$('modal').classList.remove('gizli');
};
