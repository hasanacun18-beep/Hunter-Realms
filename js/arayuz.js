// ============================================================
// arayuz.js — Ortak arayüz: yardımcılar, giriş, üst bar, sekmeler, eşya kutusu
// Paneller ayrı dosyalarda: arayuz-savas, arayuz-karakter, arayuz-canta, arayuz-dukkan
// ============================================================
G.$ = function (id) { return document.getElementById(id); };
G.sekme = 'savas';

G.kacis = function (s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
};

G.bildir = function (msg) {
  var b = G.$('bildirim');
  if (!b) return;
  b.textContent = msg;
  b.classList.remove('gizli');
  clearTimeout(G._bildirT);
  G._bildirT = setTimeout(function () { b.classList.add('gizli'); }, 1900);
};

G.log = function (html, sinif) {
  G.loglar.unshift({ h: html, s: sinif || '' });
  if (G.loglar.length > 40) G.loglar.pop();
  var el = G.$('log');
  if (el) {
    var d = document.createElement('div');
    d.className = sinif || '';
    d.innerHTML = html;
    el.insertBefore(d, el.firstChild);
    while (el.children.length > 40) el.removeChild(el.lastChild);
  }
};

// ---------- Giriş ekranı ----------
// Tam ekranlar: baslik (karşılama), secim, olustur, oyun
G.EKRANLAR = ['baslik', 'secim', 'olustur', 'oyun'];
G.ekranGoster = function (id) {
  G.EKRANLAR.forEach(function (e) { G.$(e).classList.toggle('gizli', e !== id); });
  window.scrollTo(0, 0);
};

G.ekranOyun = function () {
  G.ekranGoster('oyun');
  G.sekmeAc('savas');
};

// ---------- Sekmeler ----------
G.sekmeAc = function (s) {
  G.sekme = s;
  // Karakter bölümünde alt menü değişir (referanstaki gibi)
  G.$('altnav').classList.toggle('gizli', s === 'karakter' || s === 'demirci');
  G.$('karakterNav').classList.toggle('gizli', s !== 'karakter');
  G.$('demirciNav').classList.toggle('gizli', s !== 'demirci');
  document.querySelectorAll('#altnav button').forEach(function (b) {
    b.classList.toggle('aktif', b.dataset.s === s);
  });
  G.panelYenile();
  G.ustGuncelle();
  window.scrollTo(0, 0);
};

// Açık olan paneli yeniden çiz
G.panelYenile = function () {
  G.$('icerik').classList.remove('tek-ekran');
  if (G.sekme === 'savas') G.cizSavas();
  else if (G.sekme === 'karakter') G.cizKarakter();
  else if (G.sekme === 'canta') G.cizCantaEkrani();
  else if (G.sekme === 'harita') G.cizHarita();
  else if (G.sekme === 'demirci') G.cizDemirci();
  else if (G.sekme === 'etkinlik') G.cizEtkinlik();
};

// ---------- Üst bar ----------
// 12450 → 12.4B, 1250000 → 1.2M
G.kisaSayi = function (n) {
  if (n >= 1e6) return (n / 1e6).toFixed(n >= 1e7 ? 0 : 1) + 'M';
  if (n >= 1e4) return (n / 1e3).toFixed(n >= 1e5 ? 0 : 1) + 'B';
  return String(n);
};
G.ustGuncelle = function () {
  var o = G.o;
  if (!o) return;
  var r = G.hesapla(o), s = G.SINIFLAR[o.sinif], gerek = G.expGerekli(o.lv);
  G.$('uRozet').innerHTML = s.ikon;
  var un = o.unvan && o.unvan.takili && G.unvanBul(o.unvan.takili);   // v0.34: takılı unvan adın yanında
  G.$('uAd').innerHTML = G.kacis(o.ad) + (un ? ' <small class="ust-unvan">' + un.ad + '</small>' : '');
  G.$('uCp').textContent = 'GP ' + r.cp;
  G.$('uSinif').textContent = 'Sv. ' + o.lv;
  G.$('uPara').innerHTML = G.IK_PARA + ' ' + G.kisaSayi(o.para);
  G.$('uExp').style.width = (o.exp / gerek * 100) + '%';
  G.$('uExpY').textContent = o.exp + ' / ' + gerek;
  // Alt menüdeki küre: sol yarı can, sağ yarı mana
  G.$('kureHp').style.height = Math.max(0, Math.min(100, o.hp / r.hpMax * 100)) + '%';
  G.$('kureMp').style.height = Math.max(0, Math.min(100, o.mp / r.mpMax * 100)) + '%';
};

G.arayuzGuncelle = function () {
  G.ustGuncelle();
  if (G.sekme === 'savas') { G.kartlariGuncelle(); G.aksiyonGuncelle(); G.gorevGuncelle(); }
};

// ---------- Eşya kutusu (çanta ve ekipman ortak) ----------
// yukseltme: true ise köşede yeşil ▲ (kuşanınca GP artar)
G.esyaKutuHtml = function (e, eylem, bosSlot, yukseltme) {
  if (!e) {
    return '<button class="esya-kutu bos" data-eylem="bosSlot"><span class="ik">' + bosSlot.ikon + '</span>' + bosSlot.ad + '</button>';
  }
  var s = G.ESYALAR[e.sablon], n = G.NADIRLIK[e.nadir];
  return '<button class="esya-kutu" style="border-color:' + n.renk + '" data-eylem="' + eylem + '" data-id="' + e.id + '">' +
    (e.arti ? '<span class="arti">+' + e.arti + '</span>' : '') +
    (e.kilit ? '<span class="kilit-rozet">' + G.ikon('kilit') + '</span>' : '') +
    (s.set ? '<span class="set-rozet">SET</span>' : '') +
    (yukseltme ? '<span class="yukselt-rozet">▲</span>' : '') +
    '<span class="ik">' + G.gorunum(e.sablon).ikon + '</span><span style="color:' + n.renk + '">' + G.gorunum(e.sablon).ad + '</span></button>';
};

// Set detayı: parçalar ve bonus basamakları
G.setDetayHtml = function (setId) {
  var o = G.o, set = G.SETLER[setId], sayi = G.setSayilari(o)[setId] || 0;
  var kusanili = {};
  for (var k in o.kusanilan) if (o.kusanilan[k]) kusanili[o.kusanilan[k].sablon] = true;
  var parcalar = '';
  G.ESYALAR.forEach(function (x, i) {
    if (x.set === setId) parcalar += '<div class="' + (kusanili[i] ? 'aktif-bonus' : 'pasif') + '">' + (kusanili[i] ? '✓ ' : '○ ') + G.gorunum(i).ad + '</div>';
  });
  var basamak = '';
  for (var esik in set.bonus) {
    var yazi = Object.keys(set.bonus[esik]).map(function (bk) { return G.bonusYazi(bk, set.bonus[esik][bk]); }).join(', ');
    basamak += '<div class="' + (sayi >= +esik ? 'aktif-bonus' : 'pasif') + '">' + esik + ' parça: ' + yazi + '</div>';
  }
  return '<div class="set-kutu"><div class="set-baslik">' + set.ad + ' (' + sayi + ' kuşanılı)</div>' +
    (set.aciklama ? '<div class="set-hikaye">' + set.aciklama + '</div>' : '') + parcalar + '<div class="set-ayrac"></div>' + basamak + '</div>';
};

// v0.27: eşyanın geldiği yer — seviyesine denk gelen en yüksek av bölgesinin köken cümlesi (veri.js → esyaKoken)
G.esyaKoken = function (s) {
  var koken = '';
  G.BOLGELER.forEach(function (b) { if (b.esyaKoken && b.minLv <= s.lv) koken = b.esyaKoken; });
  return koken;
};

G.modalKapat = function () { G.$('modal').classList.add('gizli'); };
