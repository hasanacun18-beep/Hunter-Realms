// ============================================================
// arayuz-kasaba.js — Kasaba ekranı: iksirci, hurdacı
// ============================================================
G.dukkanHtml = function () {
  return G.DUKKAN.map(function (u) {
    return '<div class="urun"><span class="ik">' + u.ikon + '</span>' +
      '<span class="ad">' + u.ad + ' <small class="soluk">(' + G.o.sarf[u.t] + ')</small><br><small class="soluk">' + u.aciklama + ', ' + u.fiyat + ' altın</small></span>' +
      '<button data-eylem="satinAl" data-t="' + u.t + '" data-n="1">1</button>' +
      '<button data-eylem="satinAl" data-t="' + u.t + '" data-n="10">10</button></div>';
  }).join('');
};

G.cizKasaba = function () {
  G.$('icerik').classList.remove('tek-ekran');
  var o = G.o, b = G.bolgeBul(o.bolge);
  G.$('icerik').innerHTML =
    '<div class="panel">' +
    '<div class="kasaba-sahne"><div class="kasaba-kemer"><h2>' + b.ad + '</h2></div>' +
      '<p>' + b.aciklama + '</p></div>' +
    '<div class="kutu"><h2>' + G.ikon('iksir') + ' İksirci</h2><div class="dukkan-liste">' + G.dukkanHtml() + '</div>' +
      '<p class="soluk kucuk-not">Altının: ' + o.para + '</p></div>' +
    '<div class="kutu"><h2>' + G.ikon('cekic') + ' Hurdacı</h2>' +
      '<p class="soluk kucuk-not">Çantandaki gereksiz eşyaları burada toplu olarak satabilir ya da eritebilirsin. Kilitli, güçlendirilmiş ve set eşyalarına dokunulmaz.</p>' +
      '<div class="ikili"><button class="genis-dugme" data-eylem="topluSat">Sıradan ve iyileri sat</button>' +
      '<button class="genis-dugme" data-eylem="topluErit">Nadirleri erit</button></div></div>' +
    G.logHtml() +
    G.gorevSeritHtml() +
    G.bolgeAltHtml() +
    '</div>';
};
