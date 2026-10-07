// ============================================================
// arayuz-harita.js — Büyük dünya haritası. Seviyen yetmeyen bölgeler sisli.
// ============================================================
G.cizHarita = function () {
  var o = G.o;
  var noktalar = G.BOLGELER.map(function (b) { return b.harita.x + ',' + b.harita.y; }).join(' ');
  var sis = '', dugumler = '';
  G.BOLGELER.forEach(function (b) {
    var kilit = o.lv < b.minLv, sol = b.harita.x + '%', ust = (b.harita.y / 150 * 100) + '%';
    if (kilit) sis += '<div class="sis" style="left:' + sol + ';top:' + ust + '"></div>';
    dugumler += '<button class="harita-dugum ' + b.tur + (kilit ? ' sisli' : '') + (b.id === o.bolge ? ' burada' : '') + '"' +
      ' style="left:' + sol + ';top:' + ust + '" data-eylem="bolgeBilgi" data-b="' + b.id + '">' +
      '<span class="hd-ad">' + (b.tur === 'kasaba' ? G.ikon('koy') + ' ' : '') + (kilit ? '???' : b.ad) + '</span>' +
      '<span class="hd-lv">' + (b.tur === 'kasaba' ? 'Kasaba' : 'Seviye ' + b.minLv + '+') + '</span></button>';
  });
  G.$('icerik').innerHTML =
    '<div class="panel">' +
    '<div class="harita">' +
      '<svg class="harita-yol" viewBox="0 0 100 150" preserveAspectRatio="none" aria-hidden="true">' +
        '<polyline points="' + noktalar + '" vector-effect="non-scaling-stroke"/></svg>' +
      sis + dugumler +
    '</div>' +
    '<p class="soluk kucuk-not">Bir bölgeye dokunarak bilgilerini görebilir, açık bölgelere doğrudan gidebilirsin. Seviyen yetmeyen yerler sisle kaplı.</p>' +
    '</div>';
};

G.bolgeModal = function (id) {
  var o = G.o, b = G.bolgeBul(id), kilit = o.lv < b.minLv;
  var icerik = '';
  if (kilit) {
    icerik = '<p class="bilgi">Bu bölge sisle kaplı. Seviye ' + b.minLv + ' olunca açılır.</p>';
  } else {
    icerik = '<p class="bilgi">' + b.aciklama + '</p>';
    if (b.canavarlar) {
      icerik += '<div class="bolge-canavarlar">' + b.canavarlar.map(function (cid) {
        var c = G.CANAVARLAR[cid];
        return '<span>' + c.ikon + ' ' + c.ad + ' <small class="soluk">' + c.lv + '</small></span>';
      }).join('') + '</div>';
      var bs = G.CANAVARLAR[b.boss];
      icerik += '<p class="bilgi">Boss: ' + bs.ikon + ' ' + bs.ad + ' (seviye ' + bs.lv + ')' +
        (b.set ? '<br>Set: ' + G.SETLER[b.set].ad : '') + '</p>';
    }
  }
  var gidilir = !kilit && b.id !== o.bolge && !G.savas;
  G.$('modalIc').innerHTML =
    '<h3>' + (kilit ? '???' : b.ad) + '</h3>' +
    '<div class="alt-baslik">' + (b.tur === 'kasaba' ? 'Kasaba, güvenli bölge' : 'Av bölgesi, seviye ' + b.minLv + '+') +
      (b.id === o.bolge ? ', buradasın' : '') + '</div>' + icerik +
    '<div class="modal-dugmeler">' +
      (gidilir ? '<button data-eylem="git" data-b="' + b.id + '">Buraya git</button>' : '') +
      '<button data-eylem="modalKapat">Kapat</button></div>';
  G.$('modal').classList.remove('gizli');
};
