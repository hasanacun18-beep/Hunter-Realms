// ============================================================
// arayuz-karakter.js — Karakter ekranı (Statlar, İlahi silah) ve çanta ekranındaki bebek
// Çanta sekmesi: üstte karakter bebeği, altta çanta (referans oyundaki gibi)
// ============================================================
G.karakterAlt = 'beceri';

// Sınıfa göre sade bir silüet (kendi çizimimiz)
G.siluetSvg = function (sinif) {
  var silah = {
    savasci: '<path d="M92 118 L116 22" stroke-width="5"/><path d="M84 104 L104 110" stroke-width="5"/><circle cx="88" cy="112" r="4"/>',
    buyucu:  '<path d="M100 196 L100 30" stroke-width="4"/><circle cx="100" cy="24" r="9" class="kure"/><path d="M92 36 L108 36" stroke-width="3"/>',
    okcu:    '<path d="M24 50 Q2 108 24 166" stroke-width="4" fill="none"/><path d="M24 50 L24 166" stroke-width="1.2"/>'
  }[sinif];
  return '<svg class="siluet" viewBox="0 0 130 210" aria-hidden="true">' +
    '<g class="siluet-govde">' +
      '<path d="M65 20 C54 20 47 29 47 40 C47 52 55 60 65 60 C75 60 83 52 83 40 C83 29 76 20 65 20 Z"/>' +
      '<path d="M44 38 C42 20 58 8 70 10 C84 12 90 28 86 40 C84 30 76 22 65 22 C54 22 46 30 44 38 Z" class="kapuson"/>' +
      '<path d="M65 60 C44 62 34 74 30 96 L20 204 L110 204 L100 96 C96 74 86 62 65 60 Z"/>' +
      '<path d="M40 80 L26 132 L36 134 L48 92 Z"/><path d="M90 80 L102 130 L92 133 L82 92 Z"/>' +
    '</g><g class="siluet-silah">' + silah + '</g></svg>';
};

G.bebekHtml = function () {
  var o = G.o, r = G.hesapla(o), I = G.ILAHI.sinif[o.sinif];
  function sutun(taraf) {
    return G.YUVALAR.filter(function (y) { return y.taraf === taraf; }).map(function (y) {
      var sl = G.SLOTLAR.filter(function (x) { return x.id === y.tur; })[0];
      return G.esyaKutuHtml(o.kusanilan[y.id], 'esyaAc', sl);
    }).join('');
  }
  return '<div class="bebek">' +
    '<div class="bebek-sutun">' + sutun('sol') + '</div>' +
    '<div class="bebek-orta">' +
      '<div class="bebek-ust"><b>' + G.kacis(o.ad) + '</b><span>' + G.SINIFLAR[o.sinif].ad + ', seviye ' + o.lv + '</span><span class="bebek-gp">GP ' + r.cp + '</span></div>' +
      G.siluetSvg(o.sinif) +
      '<button class="ilahi-rozet" data-eylem="ilahiAc">' + I.ikon + '<span>' + I.ad + '<br>Seviye ' + o.ilahi + '</span></button>' +
    '</div>' +
    '<div class="bebek-sutun">' + sutun('sag') + '</div>' +
  '</div>';
};

// ---- Karakter bölümü (referans düzeni): alt menü Dön · Beceri · Meridyen · İlahi Silah · Statlar ----
G.KARAKTER_ALT = [['beceri', G.ikon('kitap'), 'Beceri'], ['meridyen', G.ikon('meditasyon'), 'Meridyen'], ['ilahi', G.ikon('simsek'), 'İlahi'], ['runler', G.ikon('run'), 'Rünler'], ['efsanevi', G.ikon('tac'), 'Efsanevi'], ['statlar', G.ikon('grafik'), 'Statlar']];

G.karakterNavCiz = function () {
  var o = G.o;
  G.$('karakterNav').innerHTML = '<button data-eylem="sekme" data-s="savas" class="kn-don"><span>↩</span>Dön</button>' +
    G.KARAKTER_ALT.map(function (x) {
      var ikon = x[1];
      var rozet = x[0] === 'statlar' && o.puan > 0 ? '<i class="nokta">' + o.puan + '</i>' : '';
      return '<button data-eylem="karakterAlt" data-s="' + x[0] + '"' + (G.karakterAlt === x[0] ? ' class="aktif"' : '') + '><span>' + ikon + '</span>' + x[2] + rozet + '</button>';
    }).join('');
};

G.cizKarakter = function () {
  if (!G.KARAKTER_ALT.some(function (x) { return x[0] === G.karakterAlt; })) G.karakterAlt = 'beceri';
  G.karakterNavCiz();
  if (G.karakterAlt === 'beceri') { G.cizBeceri(); return; }
  var govde = G.karakterAlt === 'meridyen' ? G.meridyenHtml() : G.karakterAlt === 'ilahi' ? G.ilahiSayfaHtml() :
    G.karakterAlt === 'runler' ? G.runSayfaHtml() : G.karakterAlt === 'efsanevi' ? G.mitikSayfaHtml() : G.statSayfaHtml();
  G.$('icerik').innerHTML = '<div class="panel">' + govde + '</div>';
};

// ---- Meridyen ----
G.meridyenHtml = function () {
  var o = G.o, M = G.MERIDYEN, toplam = G.meridyenToplam(), n = o.meridyen;
  var t = Math.min(M.kademeler.length - 1, Math.floor(n / M.dugum));
  var yanik = Math.min(M.dugum, n - t * M.dugum);          // bu kademede açık nokta sayısı
  var P = M.noktalar;
  var cizgiler = '';
  for (var i = 0; i < P.length - 1; i++) {
    var acik = i + 1 < yanik;
    cizgiler += '<line x1="' + P[i][0] + '" y1="' + P[i][1] + '" x2="' + P[i + 1][0] + '" y2="' + P[i + 1][1] + '" class="' + (acik ? 'acik' : '') + '"/>';
  }
  var noktalar = P.map(function (p, i) {
    var cls = i < yanik ? 'acik' : (i === yanik && n < toplam ? 'sonraki' : '');
    return '<i class="mer-nokta ' + cls + '" style="left:' + p[0] + '%;top:' + p[1] + '%"></i>';
  }).join('');

  var simdi = G.meridyenStat(n), sonra = G.meridyenStat(Math.min(toplam, n + 1));
  var adlar = { hp: 'Can', atk: 'Saldırı', def: 'Savunma', mp: 'Mana', krit: 'Kritik %' };
  var turler = Object.keys(adlar).filter(function (k) { return simdi[k] || sonra[k]; });
  var sol = turler.map(function (k) { return '<div>' + adlar[k] + ': ' + (simdi[k] || 0) + '</div>'; }).join('') || '<div class="soluk">Henüz nokta açılmadı</div>';
  var sag = turler.map(function (k) { return '<div class="' + ((sonra[k] || 0) > (simdi[k] || 0) ? 'artan' : '') + '">' + adlar[k] + ': ' + (sonra[k] || 0) + '</div>'; }).join('');

  var alt;
  if (n >= toplam) alt = '<p class="mer-bitti">Bütün meridyenler açık.</p>';
  else {
    var m = G.meridyenMaliyet(n), lvTamam = o.lv >= m.lv, yeter = lvTamam && o.sarf.hap >= m.hap && o.para >= m.altin;
    alt = '<div class="mer-maliyet">Bedel: <span class="' + (o.sarf.hap >= m.hap ? 'fark-arti' : 'fark-eksi') + '">' + G.SARF.hap.ikon + ' ' + o.sarf.hap + '/' + m.hap + '</span>' +
      ' <span class="' + (o.para >= m.altin ? 'fark-arti' : 'fark-eksi') + '">' + G.IK_PARA + ' ' + m.altin + '</span>' +
      (lvTamam ? '' : ' <span class="fark-eksi">Seviye ' + m.lv + '</span>') + '</div>' +
      '<button class="sus-dugme mer-dugme" data-eylem="meridyenYukselt"' + (yeter ? '' : ' disabled') + '><span>Yükselt</span></button>';
  }

  return '<div class="mer-sahne">' +
      '<div class="kademe-plaka"><b>' + (t + 1) + '</b><span>Kademe</span><em>' + M.kademeler[t].ad + '</em></div>' +
      '<div class="mer-govde">' + G.siluetSvg(o.sinif) +
        '<svg class="mer-cizgi" viewBox="0 0 100 100" preserveAspectRatio="none">' + cizgiler + '</svg>' + noktalar + '</div>' +
    '</div>' +
    '<div class="mer-gp"><span>GP: ' + G.meridyenGP() + '</span></div>' +
    '<div class="mer-kutu"><div class="mer-sutun"><h4>Şu anki</h4>' + sol + '</div><div class="mer-ok">➤</div>' +
      '<div class="mer-sutun sonraki"><h4>Sonraki nokta</h4>' + sag + '</div></div>' +
    alt +
    '<p class="soluk kucuk-not">' + M.kademeler.length + ' kademe, her birinde ' + M.dugum + ' nokta. Açık nokta: ' + n + '/' + toplam +
      '. Meridyen Hapı canavarlardan, bosslardan ve ana görevlerden gelir.</p>';
};

// ---- İlahi silah sayfası: büyük amblem + mevcut kart ----
G.ilahiSayfaHtml = function () {
  var o = G.o, I = G.ILAHI.sinif[o.sinif];
  return '<div class="ilahi-sahne"><div class="ilahi-amblem"><span>' + I.ikon + '</span></div>' +
    '<div class="ilahi-baslik"><b>' + I.ad + '</b><span>Seviye ' + o.ilahi + ' / ' + G.ILAHI.maks + '</span></div></div>' + G.ilahiHtml();
};

// ---- Statlar: − / + ile dağıt, Kaydet ile onayla (referanstaki gibi) ----
G.statBekleyen = { guc: 0, day: 0, zeka: 0, cev: 0 };
G.bekleyenToplam = function () { var b = G.statBekleyen; return b.guc + b.day + b.zeka + b.cev; };
G.statDegis = function (k, d) {
  var b = G.statBekleyen;
  if (d > 0 && G.bekleyenToplam() >= G.o.puan) return;
  if (d < 0 && b[k] <= 0) return;
  b[k] += d; G.cizKarakter();
};
G.statKaydet = function () {
  var o = G.o, b = G.statBekleyen;
  if (!G.bekleyenToplam()) return;
  for (var k in b) { o.stat[k] += b[k]; o.puan -= b[k]; b[k] = 0; }
  G.kaydet(); G.cizKarakter(); G.ustGuncelle();
  G.bildir('Stat puanları kaydedildi');
};
G.statSifirla = function () { G.statBekleyen = { guc: 0, day: 0, zeka: 0, cev: 0 }; G.cizKarakter(); };

G.statSayfaHtml = function () {
  var o = G.o, r = G.hesapla(o), s = G.SINIFLAR[o.sinif], b = G.statBekleyen;
  // Bekleyen puanlarla sonuç
  var kopya = JSON.parse(JSON.stringify(o));
  for (var k in b) kopya.stat[k] += b[k];
  var y = G.hesapla(kopya);
  function fark(a, c) { return c !== a ? ' <span class="fark-arti">→ ' + c + '</span>' : ''; }
  var satirlar = Object.keys(G.STATLAR).map(function (k) {
    return '<div class="stat-dagit"><span class="sd-ad">' + G.STATLAR[k].ad + '<small>' + G.STATLAR[k].aciklama + '</small></span>' +
      '<b>' + (o.stat[k] + b[k]) + '</b>' +
      '<button data-eylem="statEksi" data-k="' + k + '"' + (b[k] ? '' : ' disabled') + '>−</button>' +
      '<button data-eylem="statArti" data-k="' + k + '"' + (G.bekleyenToplam() < o.puan ? '' : ' disabled') + '>+</button></div>';
  }).join('');
  var kalan = o.puan - G.bekleyenToplam();
  return '<div class="kutu"><h2>' + s.ikon + ' Karakter Statları</h2>' +
      '<div class="stat-ekran"><div class="stat-sol">' + satirlar +
        '<p class="' + (kalan ? 'fark-arti' : 'soluk') + ' kucuk-not">Dağıtılmamış puan: ' + kalan + '</p></div>' +
      '<div class="stat-sag">' +
        '<div>Can: ' + r.hpMax + fark(r.hpMax, y.hpMax) + '</div><div>Mana: ' + r.mpMax + fark(r.mpMax, y.mpMax) + '</div>' +
        '<div>Saldırı: ' + r.atkMin + '-' + r.atkMax + fark(r.atkMax, y.atkMax) + '</div><div>Savunma: ' + r.def + fark(r.def, y.def) + '</div>' +
        '<div>Hız: ' + r.hiz + fark(r.hiz, y.hiz) + '</div><div>Kritik: %' + r.krit + fark(r.krit, y.krit) + '</div>' +
      '</div></div>' +
      '<div class="stat-dugmeler"><button class="gelistir-dugme" data-eylem="statKaydet"' + (G.bekleyenToplam() ? '' : ' disabled') + '>Kaydet</button>' +
        '<button class="gelistir-dugme" data-eylem="statSifirla"' + (G.bekleyenToplam() ? '' : ' disabled') + '>Sıfırla</button></div></div>' +
    '<div class="kutu"><h2>Tüm statlar</h2>' +
      '<div class="satir"><span>Menzil</span><span>' + s.menzil + ' kare</span></div>' +
      '<div class="satir"><span>Kritik hasarı</span><span>%' + (160 + r.kritHasar) + '</span></div>' +
      '<div class="satir"><span>Beceri hasarı</span><span>+%' + Math.round(r.beceriBonus * 100 + r.beceri) + '</span></div>' +
      '<div class="satir"><span>Can çalma</span><span>%' + r.canCal + '</span></div>' +
      '<div class="satir"><span>Altın bulma</span><span>+%' + r.altin + '</span></div>' +
      '<div class="satir"><span>Tecrübe kazancı</span><span>+%' + r.tecrube + '</span></div>' +
    '</div>' +
    G.setKutusuHtml(r) +
    G.unvanHtml() +
    '<div class="kutu soluk">Öldürülen canavar: ' + o.istatistik.oldurme + '<br>Yenilgi: ' + o.istatistik.olum + '</div>' +
    '<button class="genis-dugme" data-eylem="secimeDon">↩ Karakter seçimine dön</button>';
};

// v0.34 — Unvanlar: kazanılan / kilitli liste; takılı olan stat verir
G.unvanHtml = function () {
  var o = G.o, n = Object.keys(o.unvan.kazanilan).length;
  var satirlar = G.UNVANLAR.map(function (u) {
    var kaz = G.unvanKazanildi(u.id), tak = o.unvan.takili === u.id, p = G.unvanIlerleme(u);
    var stat = Object.keys(u.stat).map(function (k) { return G.bonusYazi(k, u.stat[k]); }).join(', ');
    var sag = tak ? '<button class="sus-dugme gl-al" data-eylem="unvanCikar"><span>Çıkar</span></button>' :
      kaz ? '<button class="sus-dugme gl-al" data-eylem="unvanTak" data-id="' + u.id + '"><span>Tak</span></button>' :
      '<span class="un-ilerleme">' + p.sayi + '/' + p.hedef + '</span>';
    return '<div class="unvan-satir' + (tak ? ' takili' : kaz ? ' kazanildi' : ' kilitli') + '">' +
      G.ikon(kaz ? 'unvan' : 'kilit', 'un-ikon') +
      '<span class="un-ad"><b>' + u.ad + '</b><small>' + p.yazi + ' · <span class="un-stat">' + stat + '</span></small></span>' +
      sag + '</div>';
  }).join('');
  return '<div class="kutu"><h2>' + G.ikon('unvan') + ' Unvanlar <small class="soluk">' + n + '/' + G.UNVANLAR.length + '</small></h2>' +
    '<p class="bilgi soluk">Unvanlar başarılarla kazanılır. Aynı anda bir unvan takılır, yalnız takılı unvanın gücü işler.</p>' +
    satirlar + '</div>';
};

G.setKutusuHtml = function (r) {
  if (!r.setler.length) return '';
  return '<div class="kutu"><h2>Setler</h2>' + r.setler.map(function (x) { return G.setDetayHtml(x.id); }).join('') + '</div>';
};

// ---- v0.8: İlahi silah ----
G.ilahiHtml = function () {
  var o = G.o, I = G.ILAHI, bil = I.sinif[o.sinif], L = o.ilahi, st = G.ilahiStat(L), kd = G.ilahiKademe(L);
  var beceri = kd
    ? bil.beceri + ' ' + kd + '. kademe: normal saldırıda %' + I.beceriSans[kd - 1] + ' şansla ' + bil.aciklama + '.'
    : bil.beceri + ' seviye ' + I.beceriSeviye[0] + '\'te açılır: ' + bil.aciklama + '.';
  var alt = '';
  if (L < I.maks) {
    var m = G.ilahiMaliyet(L), yeter = o.lv >= m.lv && o.para >= m.altin;
    var ihtiyac = Object.keys(m.cevher).map(function (c) {
      var var_ = o.maden.cevher[c] || 0, tamam = var_ >= m.cevher[c];
      if (!tamam) yeter = false;
      return '<span class="' + (tamam ? 'fark-arti' : 'fark-eksi') + '">' + G.CEVHERLER[c].ikon + ' ' + var_ + '/' + m.cevher[c] + '</span>';
    }).join(' ');
    var sonraki = G.ilahiStat(L + 1);
    alt = '<div class="bilgi">Sonraki seviye: +' + (sonraki.atk - st.atk) + ' saldırı, +' + (sonraki.hp - st.hp) + ' can, +' + (sonraki.mp - st.mp) + ' mana' +
      (I.beceriSeviye.indexOf(L + 1) >= 0 ? ', <b>beceri kademesi!</b>' : '') + '</div>' +
      '<div class="ilahi-maliyet">' + ihtiyac + ' <span class="' + (o.para >= m.altin ? 'fark-arti' : 'fark-eksi') + '">' + m.altin + ' altın</span>' +
      ' <span class="' + (o.lv >= m.lv ? 'fark-arti' : 'fark-eksi') + '">seviye ' + m.lv + '</span></div>' +
      '<button class="genis-dugme ilahi-dugme" data-eylem="ilahi"' + (yeter ? '' : ' disabled') + '>Yükselt</button>';
  } else alt = '<div class="bilgi">En yüksek seviyede.</div>';
  return '<div class="kutu ilahi-kutu"><h2>' + bil.ikon + ' ' + bil.ad + ' <span class="soluk">' + L + '/' + I.maks + '</span></h2>' +
    '<div class="satir"><span>Verdiği güç</span><span>+' + st.atk + ' saldırı, +' + st.hp + ' can, +' + st.mp + ' mana</span></div>' +
    '<div class="bilgi">' + beceri + '</div>' + alt +
    (o.maden.kazi ? '<p class="kucuk-not fark-arti">Madende kazın sürüyor. Biriken cevherler kazıyı bitirince hesabına geçer (Etkinlik → Eski Maden).</p>' : '') +
    '<p class="soluk kucuk-not">Cevherleri Etkinlik sekmesindeki madenden çıkarırsın.</p></div>';
};

// ---- Çanta sekmesi: bebek + çanta ----
G.cizCantaEkrani = function () {
  G.$('icerik').innerHTML = '<div class="panel">' + G.bebekHtml() + '<div class="kutu canta-kutu">' + G.cantaHtml() + '</div></div>';
};

// ---- v0.20: Rünler ----
G.runKutuHtml = function (r, eylem) {
  var t = G.RUN_TUR[r.tur], n = G.NADIRLIK[r.nadir];
  return '<button class="run-kutu" style="border-color:' + n.renk + '" data-eylem="' + eylem + '" data-id="' + r.id + '">' +
    (r.lv > 1 ? '<span class="arti">+' + (r.lv - 1) + '</span>' : '') + (G.runTakiliMi(r) ? '<span class="takili">✓</span>' : '') +
    '<span class="ik">' + t.ikon + '</span><small style="color:' + n.renk + '">' + t.ad + '</small></button>';
};

G.runSayfaHtml = function () {
  var o = G.o;
  var yuvalar = Object.keys(G.RUN_TUR).map(function (tur) {
    var t = G.RUN_TUR[tur], r = o.runTakili[tur] != null ? G.runBul(o.runTakili[tur]) : null;
    return '<button class="run-yuva' + (r ? ' dolu' : '') + '"' + (r ? ' style="--r:' + G.NADIRLIK[r.nadir].renk + '"' : '') + ' data-eylem="runYuva" data-tur="' + tur + '">' +
      '<span class="ik">' + t.ikon + '</span><b>' + t.ad + '</b>' +
      '<small>' + (r ? G.bonusYazi(t.stat, G.runDeger(r)) + (r.lv > 1 ? ' · +' + (r.lv - 1) : '') : 'Boş') + '</small></button>';
  }).join('');
  var canta = o.runler.slice().sort(function (a, b) { return (b.nadir - a.nadir) || (b.lv - a.lv); })
    .map(function (r) { return G.runKutuHtml(r, 'runAc'); }).join('') || '<p class="soluk kucuk-not">Henüz rünün yok. Kuleden kazanırsın.</p>';
  return '<div class="kutu"><h2>' + G.ikon('run') + ' Rünler</h2><div class="run-yuvalar">' + yuvalar + '</div>' +
      '<p class="soluk kucuk-not">Her tipten bir rün takılır. Yuvaya dokun, çantandaki o tipten rünleri gör.</p></div>' +
    '<div class="kutu"><h2>Rün çantası <small class="soluk">' + G.SARF.oz.ikon + ' ' + o.sarf.oz + ' Rün Özü</small></h2><div class="run-canta">' + canta + '</div></div>';
};

G.runModal = function (id) {
  var o = G.o, r = G.runBul(id);
  if (!r) { G.modalKapat(); return; }
  var t = G.RUN_TUR[r.tur], takili = G.runTakiliMi(r), m = G.runYukseltMaliyet(r);
  var sonraki = r.lv < G.RUN_MAKS ? G.runDeger({ tur: r.tur, nadir: r.nadir, lv: r.lv + 1 }) : null;
  G.$('modalIc').innerHTML = '<h3 style="color:' + G.NADIRLIK[r.nadir].renk + '">' + t.ikon + ' ' + G.runAd(r) + '</h3>' +
    '<div class="alt-baslik">Seviye ' + r.lv + '/' + G.RUN_MAKS + (takili ? ' · takılı' : '') + '</div>' +
    '<div class="satir"><span>Etkisi</span><span>' + G.bonusYazi(t.stat, G.runDeger(r)) + (sonraki != null ? ' <span class="fark-arti">→ ' + sonraki + '</span>' : '') + '</span></div>' +
    (r.lv < G.RUN_MAKS ? '<p class="bilgi">Yükseltme: ' + G.SARF.oz.ikon + ' ' + m + ' Rün Özü (sende ' + o.sarf.oz + ')</p>' : '<p class="bilgi">En yüksek seviyede.</p>') +
    '<p class="bilgi">Eritirsen: ' + G.SARF.oz.ikon + ' ' + G.runEritGetiri(r) + ' Rün Özü</p>' +
    '<div class="modal-dugmeler">' +
      (takili ? '<button data-eylem="runCikar" data-id="' + r.id + '">Çıkar</button>' : '<button data-eylem="runTak" data-id="' + r.id + '">Tak</button>') +
      '<button data-eylem="runYukselt" data-id="' + r.id + '"' + (r.lv < G.RUN_MAKS && o.sarf.oz >= m ? '' : ' disabled') + '>Yükselt</button>' +
      '<button data-eylem="runErit" data-id="' + r.id + '"' + (takili ? ' disabled' : '') + '>Erit</button>' +
      '<button data-eylem="modalKapat">Kapat</button></div>';
  G.$('modal').classList.remove('gizli');
};

// Yuvaya dokununca: o tipteki rünler
G.runYuvaModal = function (tur) {
  var o = G.o, t = G.RUN_TUR[tur];
  var liste = o.runler.filter(function (r) { return r.tur === tur; }).sort(function (a, b) { return G.runDeger(b) - G.runDeger(a); });
  G.$('modalIc').innerHTML = '<h3>' + t.ikon + ' ' + t.ad + ' yuvası</h3>' +
    '<div class="alt-baslik">' + G.BONUS_ADLARI[t.stat] + ' verir</div>' +
    (liste.length ? '<div class="run-canta">' + liste.map(function (r) { return G.runKutuHtml(r, 'runAc'); }).join('') + '</div>'
      : '<p class="bilgi">Bu tipte rünün yok. Kuleden kazanırsın.</p>') +
    '<div class="modal-dugmeler"><button data-eylem="modalKapat">Kapat</button></div>';
  G.$('modal').classList.remove('gizli');
};

// ============================================================
// v0.33 — EFSANEVİ SET sayfası (mitik.js): beceriler, 10 yuva, seçili yuvanın detayı
// ============================================================
G.mitikSayfaHtml = function () {
  var o = G.o, M = G.MITIK;
  if (!G.mitikYuva(G.mitikSecili)) G.mitikSecili = 'kilic';
  var beceriler = Object.keys(M.beceriler).map(function (yid) {
    var b = M.beceriler[yid], acik = G.mitikAcik(yid);
    return '<div class="mt-beceri' + (acik ? ' acik' : '') + '"><span class="mt-b-ikon">' + G.ikon(b.simge) + '</span>' +
      '<div><b>' + b.ad + '</b><small>' + (acik ? b.aciklama : G.mitikYuva(yid).ad + ' ile açılır') + '</small></div></div>';
  }).join('');
  var yuvalar = M.yuvalar.map(function (y) {
    var acik = G.mitikAcik(y.id), p = G.mitikParca(y.id);
    var durum = acik ? 'Açık' : p ? 'Parça hazır' : 'Kilitli';
    return '<button class="mt-yuva' + (acik ? ' acik' : '') + (p && !acik ? ' hazir' : '') + (y.id === G.mitikSecili ? ' secili' : '') + '" data-eylem="mitikSec" data-id="' + y.id + '">' +
      '<span class="mt-ikon">' + G.ikon(y.simge) + '</span><div><b>' + y.ad + '</b><small>' + durum + (p ? ' · ' + p + ' parça' : '') + '</small></div></button>';
  }).join('');
  var y = G.mitikYuva(G.mitikSecili), acik = G.mitikAcik(y.id), p = G.mitikParca(y.id), st = G.mitikYuvaStat(y, o.lv);
  var statYazi = Object.keys(st).map(function (k) { return G.STAT_ADLARI[k] + ' +' + st[k]; }).join(' · ');
  var b = M.beceriler[y.id], dugmeler = '';
  if (!acik && p) dugmeler += '<button class="sus-dugme mt-dugme" data-eylem="mitikAc" data-id="' + y.id + '"><span>Etkinleştir</span></button>';
  if (!acik && !p) dugmeler += '<button class="genis-dugme" data-eylem="mitikTakas" data-id="' + y.id + '"' + (o.mitik.oz >= M.takasOz ? '' : ' disabled') + '>' + M.takasOz + ' Efsane Özü ile parça al</button>';
  if (acik && p) dugmeler += '<button class="genis-dugme" data-eylem="mitikSok" data-id="' + y.id + '">Fazla parçayı sök (+' + M.sokOz + ' Efsane Özü)</button>';
  return '<div class="kutu"><h2>' + G.ikon('tac') + ' Efsanevi Set <small class="soluk">Efsane Özü: ' + o.mitik.oz + '</small></h2>' +
      '<div class="mt-beceriler">' + beceriler + '</div>' +
      '<div class="mt-izgara">' + yuvalar + '</div></div>' +
    '<div class="kutu mt-detay"><div class="mt-d-baslik"><span class="mt-ikon buyuk' + (acik ? ' acik' : '') + '">' + G.ikon(y.simge) + '</span>' +
      '<div><b>' + y.ad + '</b><small>' + (acik ? 'Etkin' : 'Etkin değil') + ' · Parça: ' + p + '</small></div></div>' +
      '<p class="bilgi">' + (acik ? 'Verdiği güç' : 'Etkinleşince verir') + ' (seviye ' + o.lv + '): <b class="fark-arti">' + statYazi + '</b><br><small class="soluk">Seviyen arttıkça güçlenir.</small></p>' +
      (b ? '<p class="bilgi">Beceri: <b>' + b.ad + '</b> — ' + b.aciklama + '</p>' : '') +
      dugmeler +
      '<p class="bilgi soluk">Efsanevi parçalar bosslardan nadiren düşer. Açık yuvanın fazla parçası Efsane Özü\'ne dönüştürülebilir.</p>' +
    '</div>';
};
