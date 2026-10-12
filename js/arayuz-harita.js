// ============================================================
// arayuz-harita.js — Dallanan dünya haritası. Seviyen yetmeyen bölgeler sisli.
// ============================================================
G.haritaBagliMi = function (a, b) {
  if (!a || !b || a === b) return false;
  return (G.HARITA_YOLLARI || []).some(function (y) { return (y[0] === a && y[1] === b) || (y[0] === b && y[1] === a); });
};

G.cizHarita = function () {
  var o = G.o;
  var sis = '', dugumler = '';
  var yollar = (G.HARITA_YOLLARI || []).map(function (y) {
    var a = G.bolgeBul(y[0]), b = G.bolgeBul(y[1]);
    var acik = G.haritaBagliMi(o.bolge, y[0]) || G.haritaBagliMi(o.bolge, y[1]);
    var kilitli = o.lv < a.minLv || o.lv < b.minLv;
    return '<line class="harita-yol-cizgi ' + (acik ? 'aktif ' : '') + (kilitli ? 'kilitli' : '') + '" x1="' + a.harita.x + '" y1="' + a.harita.y + '" x2="' + b.harita.x + '" y2="' + b.harita.y + '"/>';
  }).join('');
  G.BOLGELER.forEach(function (b) {
    var kilit = o.lv < b.minLv, sol = b.harita.x + '%', ust = (b.harita.y / 150 * 100) + '%';
    var komsu = G.haritaBagliMi(o.bolge, b.id);
    if (kilit) sis += '<div class="sis" style="left:' + sol + ';top:' + ust + '"></div>';
    dugumler += '<button class="harita-dugum ' + b.tur + (kilit ? ' sisli' : '') + (komsu ? ' komsu' : '') + (b.id === o.bolge ? ' burada' : '') + '"' +
      ' style="left:' + sol + ';top:' + ust + '" data-eylem="bolgeBilgi" data-b="' + b.id + '">' +
      '<span class="hd-ad">' + (b.tur === 'kasaba' ? G.ikon('koy') + ' ' : '') + (kilit ? '???' : b.ad) + '</span>' +
      '<span class="hd-lv">' + (b.tur === 'kasaba' ? 'Kasaba' : 'Seviye ' + b.minLv + '+') + '</span></button>';
  });
  G.$('icerik').innerHTML =
    '<div class="panel harita-panel">' +
    '<div class="harita-baslik"><div><span class="harita-eylem">DÜNYA HARİTASI</span><h2>Karanlık Diyarlar</h2></div><span class="harita-pusula">✦</span></div>' +
    '<div class="harita">' +
      '<svg class="harita-yol" viewBox="0 0 100 150" preserveAspectRatio="none" aria-hidden="true">' +
        yollar + '</svg>' +
      sis + dugumler +
    '</div>' +
    '<div class="harita-efsane"><span><i class="nokta aktif"></i> Yolun açık</span><span><i class="nokta"></i> Bölge</span><span><i class="nokta sis"></i> Kilitli</span></div>' +
    '<p class="soluk kucuk-not">Yollar dallanır. Bir bölgeye gitmek için haritada bulunduğun yere bağlı bir komşu seçmelisin; seviyen yetmeyen yerler sisle kaplı.</p>' +
    '</div>';
};

G.bolgeModal = function (id) {
  var o = G.o, b = G.bolgeBul(id), kilit = o.lv < b.minLv, yol = G.haritaBagliMi(o.bolge, b.id);
  var icerik = '';
  if (kilit) {
    icerik = '<p class="bilgi">Bu bölge sisle kaplı. Seviye ' + b.minLv + ' olunca açılır.</p>';
  } else {
    icerik = '<p class="bilgi">' + b.aciklama + '</p>';
    if (b.canavarlar) {
      // v0.27: her canavarın altında kısa açıklaması
      icerik += '<div class="bolge-canavar-liste">' + b.canavarlar.map(function (cid) {
        var c = G.CANAVARLAR[cid];
        return '<div class="bc-satir"><span class="bc-ikon">' + c.ikon + '</span><div><b>' + c.ad + ' <small class="soluk">seviye ' + c.lv + '</small></b>' +
          (c.aciklama ? '<i>' + c.aciklama + '</i>' : '') + '</div></div>';
      }).join('') + '</div>';
      var bs = G.CANAVARLAR[b.boss];
      icerik += '<p class="bilgi">Boss: ' + bs.ikon + ' ' + bs.ad + ' (seviye ' + bs.lv + ')' +
        (bs.aciklama ? '<br><i class="soluk">' + bs.aciklama + '</i>' : '') +
        (b.set ? '<br>Set: ' + G.SETLER[b.set].ad : '') + '</p>';
    }
  }
  var gidilir = !kilit && yol && b.id !== o.bolge && !G.savas;
  if (!kilit && b.id !== o.bolge && !yol) icerik += '<p class="uyari">Buraya bulunduğun bölgeden doğrudan yol yok. Haritada bağlı bir komşu bölge seç.</p>';
  G.$('modalIc').innerHTML =
    '<h3>' + (kilit ? '???' : b.ad) + '</h3>' +
    '<div class="alt-baslik">' + (b.tur === 'kasaba' ? 'Kasaba, güvenli bölge' : 'Av bölgesi, seviye ' + b.minLv + '+') +
      (b.id === o.bolge ? ', buradasın' : '') + '</div>' + icerik +
    '<div class="modal-dugmeler">' +
      (gidilir ? '<button data-eylem="git" data-b="' + b.id + '">Buraya git</button>' : '') +
      '<button data-eylem="modalKapat">Kapat</button></div>';
  G.$('modal').classList.remove('gizli');
};
