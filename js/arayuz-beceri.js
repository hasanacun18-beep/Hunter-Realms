// ============================================================
// arayuz-beceri.js — v0.14: Beceri listesi (referanstaki gibi)
// Her beceri: seviye, önizleme (tüm seviyeler), ustalık, kitap, sayfa, geliştir, otomatik
// ============================================================
G.onizleAcik = null;

G.TUR_ADI = { aktif: 'Aktif', pasif: 'Pasif' };

G.beceriKartHtml = function (id) {
  var o = G.o, b = G.BECERILER[id], lv = o.beceriler[id] || 0, ogrenildi = lv > 0;
  var gosterLv = Math.max(1, lv), aktif = b.tur === 'aktif';
  var meta = [];
  if (aktif) meta.push(b.mp ? b.mp + ' mana' : 'Mana harcamaz', b.bekleme + ' tur bekleme');
  if (ogrenildi && lv < G.BECERI_MAKS) meta.push('Ustalık ' + (o.ustalik[id] || 0) + '/' + G.ustalikGerek(lv));

  var sag;
  if (!ogrenildi) {
    sag = '<span class="etkin-degil">Etkin değil</span><small class="soluk">' + (b.totem ? 'Seviye ' + b.minLv + '\'te kendiliğinden açılır' : 'Seviye ' + b.minLv + '+ canavarlardan kitabı düşer') + '</small>';
  } else if (lv >= G.BECERI_MAKS) {
    sag = '<span class="en-ust">En üst seviye</span>';
  } else {
    var kitap = o.kitaplar[id] || 0, kg = G.kitapGerek(lv), sg = G.sayfaGerek(lv), ag = G.altinGerek(lv), ug = G.ustalikGerek(lv);
    var eksik = G.gelistirEksik(id).length > 0;
    sag = '<div class="gereksinim">' +
        '<span class="' + (kitap >= kg ? 'fark-arti' : 'fark-eksi') + '">' + G.ikon('beceri_kitabi') + ' ' + kitap + '/' + kg + '</span>' +
        '<span class="' + (o.sarf.sayfa >= sg ? 'fark-arti' : 'fark-eksi') + '">' + G.SARF.sayfa.ikon + ' ' + o.sarf.sayfa + '/' + sg + '</span>' +
        '<span class="' + (o.para >= ag ? 'fark-arti' : 'fark-eksi') + '">' + ag + ' altın</span>' +
        '<span class="' + ((o.ustalik[id] || 0) >= ug ? 'fark-arti' : 'fark-eksi') + '">Ustalık</span>' +
      '</div>' +
      '<button class="gelistir-dugme" data-eylem="gelistir" data-b="' + id + '"' + (eksik ? ' disabled' : '') + '>Geliştir</button>';
  }
  if (ogrenildi && aktif) {
    sag += '<button class="oto-kutu' + (G.otoAcikMi(id) ? ' acik' : '') + '" data-eylem="otoAc" data-b="' + id + '">' + (G.otoAcikMi(id) ? '✓' : '') + '</button><small>Otomatik</small>';
  }

  var onizle = '';
  if (G.onizleAcik === id) {
    onizle = '<div class="onizleme">';
    for (var l = 1; l <= G.BECERI_MAKS; l++) {
      onizle += '<div class="onizle-satir' + (l === lv ? ' simdiki' : '') + (l < lv ? ' gecti' : '') + '"><b>Sv. ' + l + '</b><span>' + G.beceriAciklama(id, l) + '</span></div>';
    }
    onizle += '</div>';
  }

  return '<div class="beceri-satir' + (ogrenildi ? '' : ' ogrenilmedi') + '">' +
    '<div class="beceri-ust">' +
      '<span class="beceri-simge ' + b.tur + '">' + b.ikon + '</span>' +
      '<div class="beceri-orta">' +
        '<div class="beceri-baslik"><b>' + b.ad + '</b>' + (b.totem ? '<span class="totem-rozet">TOTEM</span>' : '') + '<span class="lv">Sv. ' + lv + '</span>' +
          '<button class="onizle-link" data-eylem="onizle" data-b="' + id + '">' + (G.onizleAcik === id ? 'Kapat' : 'Önizle') + '</button></div>' +
        '<div class="beceri-tur">' + G.TUR_ADI[b.tur] + (b.sinif ? '' : ', her sınıf') + '</div>' +
        '<div class="beceri-acik">' + G.beceriAciklama(id, gosterLv) + '</div>' +
        (meta.length ? '<div class="beceri-meta">' + meta.join(' · ') + '</div>' : '') +
      '</div>' +
      '<div class="beceri-sag">' + sag + '</div>' +
    '</div>' + onizle + '</div>';
};

G.cizBeceri = function () {
  var o = G.o, tum = G.sinifBecerileri(o.sinif);
  var sira = function (a, b) {
    var oa = o.beceriler[a] ? 0 : 1, ob = o.beceriler[b] ? 0 : 1;
    return (oa - ob) || (G.BECERILER[a].minLv - G.BECERILER[b].minLv);
  };
  var aktifler = tum.filter(function (id) { return G.BECERILER[id].tur === 'aktif'; }).sort(sira);
  var pasifler = tum.filter(function (id) { return G.BECERILER[id].tur === 'pasif'; }).sort(sira);
  G.$('icerik').innerHTML =
    '<div class="panel">' +
    '<div class="kutu beceri-ozet"><span>' + G.SARF.sayfa.ikon + ' Kitap Sayfası: <b>' + o.sarf.sayfa + '</b></span><span>Altın: <b>' + o.para + '</b></span></div>' +
    '<p class="soluk kucuk-not">Öğrendiğin her beceri etkindir. Aktif beceriler kullandıkça, pasifler canavar öldürdükçe ustalık kazanır. ' +
      'Ustalık dolunca o becerinin kitabı, kitap sayfası ve altınla geliştirirsin (en fazla seviye ' + G.BECERI_MAKS + ').</p>' +
    '<h2 class="bolum-baslik">Aktif beceriler</h2>' + aktifler.map(G.beceriKartHtml).join('') +
    '<h2 class="bolum-baslik">Pasif beceriler</h2>' + pasifler.map(G.beceriKartHtml).join('') +
    '</div>';
};
