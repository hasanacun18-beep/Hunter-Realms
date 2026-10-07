// ============================================================
// arayuz-demirci.js — v0.17: Demirci bölümü (referanstaki "Cast")
// Alt menü: Dön · Arıtma · Güçlendirme · Eritme
// Solda eşya listesi (Kuşanılı / Çanta), sağda seçili eşya ve işlem
// ============================================================
G.demirciAlt = 'arit';
G.demirciKaynak = 'kusanili';
G.demirciSecili = null;
G.DEMIRCI_ALT = [['arit', G.ikon('pirilti'), 'Arıtma'], ['guclendir', G.ikon('cekic'), 'Güçlendirme'], ['erit', G.ikon('alev'), 'Eritme']];

// Eşya penceresinden "Arıt" ile gel
G.demirciAc = function (id) {
  var f = G.esyaBul(id);
  G.modalKapat();
  G.demirciAlt = 'arit'; G.aritma = null;
  if (f) { G.demirciKaynak = f.yer === 'canta' ? 'canta' : 'kusanili'; G.demirciSecili = id; }
  G.sekmeAc('demirci');
};

G.demirciNavCiz = function () {
  G.$('demirciNav').innerHTML = '<button data-eylem="sekme" data-s="savas" class="kn-don"><span>↩</span>Dön</button>' +
    G.DEMIRCI_ALT.map(function (x) {
      return '<button data-eylem="demirciAlt" data-s="' + x[0] + '"' + (G.demirciAlt === x[0] ? ' class="aktif"' : '') + '><span>' + x[1] + '</span>' + x[2] + '</button>';
    }).join('');
};

// Listede gösterilecek eşyalar
G.demirciListe = function () {
  var o = G.o, liste;
  if (G.demirciKaynak === 'kusanili') {
    liste = G.YUVALAR.map(function (y) { return o.kusanilan[y.id]; }).filter(Boolean);
  } else liste = o.canta.slice();
  if (G.demirciAlt === 'arit') liste = liste.filter(function (e) { return e.ek && e.ek.length; });
  if (G.demirciAlt === 'erit') liste = G.demirciKaynak === 'canta' ? liste.filter(function (e) { return e.nadir >= 2; }) : [];
  return liste;
};

G.cizDemirci = function () {
  var o = G.o;
  G.demirciNavCiz();
  var liste = G.demirciListe();
  if (!liste.some(function (e) { return e.id === G.demirciSecili; })) G.demirciSecili = liste.length ? liste[0].id : null;
  var sol = liste.map(function (e) {
    return '<div class="dm-kutu' + (e.id === G.demirciSecili ? ' secili' : '') + '">' +
      G.esyaKutuHtml(e, 'demirciSec') + '</div>';
  }).join('') || '<p class="soluk kucuk-not">' + (G.demirciAlt === 'erit' && G.demirciKaynak === 'kusanili' ? 'Kuşanılı eşya eritilmez.' : 'Uygun eşya yok.') + '</p>';
  var kaynak = '<div class="dm-kaynak"><button' + (G.demirciKaynak === 'kusanili' ? ' class="aktif"' : '') + ' data-eylem="demirciKaynak" data-k="kusanili">Kuşanılı</button>' +
    '<button' + (G.demirciKaynak === 'canta' ? ' class="aktif"' : '') + ' data-eylem="demirciKaynak" data-k="canta">Çanta</button></div>';

  var f = G.demirciSecili != null ? G.esyaBul(G.demirciSecili) : null, sag;
  if (!f) sag = '<p class="soluk dm-bos">Soldan bir eşya seç.</p>';
  else if (G.demirciAlt === 'arit') sag = G.aritHtml(f.e);
  else if (G.demirciAlt === 'guclendir') sag = G.guclendirHtml(f.e);
  else sag = G.eritHtml(f.e);

  G.$('icerik').innerHTML = '<div class="demirci">' +
    '<div class="dm-sol"><div class="dm-liste">' + sol + '</div>' + kaynak + '</div>' +
    '<div class="dm-sag">' + sag + '</div></div>';
};

// Seçili eşyanın başlığı: kutu + bilgiler
G.dmBaslikHtml = function (e) {
  var s = G.ESYALAR[e.sablon], n = G.NADIRLIK[e.nadir];
  var slotAd = G.SLOTLAR.filter(function (x) { return x.id === s.slot; })[0].ad;
  return '<div class="dm-baslik"><div class="dm-buyuk">' + G.esyaKutuHtml(e, 'esyaAc') + '<span class="dm-gp">GP: ' + G.esyaGP(e) + '</span></div>' +
    '<div class="dm-bilgi"><b style="color:' + n.renk + '">' + G.esyaAd(e) + '</b>' +
    '<span>Tür: ' + slotAd + '</span><span>Seviye: <em class="fark-arti">' + s.lv + '</em></span>' +
    '<span>Kalite: <em style="color:' + n.renk + '">' + n.ad + '</em></span></div></div>';
};

// ---- Arıtma ----
G.aritHtml = function (e) {
  var o = G.o, s = G.ESYALAR[e.sablon], kilitli = G.kilitliStatlar(e), m = G.zarMaliyet(e);
  // Arıtılabilir statlar ve bu eşya seviyesinde en fazla değerleri
  var tablo = Object.keys(G.EK_STATLAR).map(function (k) {
    var d = G.EK_STATLAR[k], maks = Math.round(d.maks + s.lv * d.lvArtis);
    return '<div><span>' + G.BONUS_ADLARI[k] + '</span><b>' + (G.YUZDE_STATLAR[k] ? '%' : '') + maks + '</b></div>';
  }).join('');
  var mevcut = e.ek.map(function (x) {
    var kl = kilitli.indexOf(x.k) >= 0;
    return '<div class="dm-stat"><button class="dm-kilit' + (kl ? ' kilitli' : '') + '" data-eylem="zarKilit" data-id="' + e.id + '" data-k="' + x.k + '"' +
      (e.ek.length > 1 ? '' : ' disabled') + '>' + (kl ? '🔒' : '🔓') + '</button>' + G.bonusYazi(x.k, x.v) + '</div>';
  }).join('');
  var a = G.aritma && G.aritma.id === e.id ? G.aritma : null, onizleme = '', gpSag = '';
  if (a) {
    onizleme = a.ek.map(function (x) { return '<div class="dm-stat yeni">' + G.bonusYazi(x.k, x.v) + '</div>'; }).join('');
    var yeniGp = G.esyaGP({ sablon: e.sablon, nadir: e.nadir, arti: e.arti, ek: a.ek }), eskiGp = G.esyaGP(e);
    gpSag = 'Arıtma GP: <b class="' + (yeniGp >= eskiGp ? 'fark-arti' : 'fark-eksi') + '">' + yeniGp + '</b>';
  }
  return G.dmBaslikHtml(e) +
    '<div class="dm-tablo"><h4>Arıtılabilir statlar <small>(en fazla)</small></h4>' + tablo + '</div>' +
    '<div class="dm-karsilastir">' +
      '<div class="dm-kolon"><h4>Mevcut statlar</h4>' + mevcut + '</div><div class="dm-ok">➤</div>' +
      '<div class="dm-kolon"><h4>Arıtılmış statlar</h4>' + (onizleme || '<p class="soluk kucuk-not">Arıt\'a bas, yeni statlar burada görünür.</p>') + '</div>' +
    '</div>' +
    '<div class="dm-gpler"><span>Mevcut GP: ' + G.esyaGP(e) + '</span><span>' + gpSag + '</span></div>' +
    '<div class="dm-maliyet">Bedel: <span class="' + (o.para >= m.altin ? 'fark-arti' : 'fark-eksi') + '">' + G.IK_PARA + ' ' + m.altin + '</span> ' +
      '<span class="' + (o.sarf.toz >= m.toz ? 'fark-arti' : 'fark-eksi') + '">' + G.SARF.toz.ikon + ' ' + o.sarf.toz + '/' + m.toz + '</span></div>' +
    '<div class="dm-dugmeler"><button class="sus-dugme" data-eylem="arit" data-id="' + e.id + '"><span>Arıt</span></button>' +
      '<button class="sus-dugme" data-eylem="aritKaydet"' + (a ? '' : ' disabled') + '><span>Kaydet</span></button></div>' +
    '<p class="soluk kucuk-not">Arıt yeni statları önizler, eşyan değişmez. Beğenirsen Kaydet. 🔒 kilitli statlar değişmez, her kilit bedeli artırır.</p>';
};

// ---- Güçlendirme ----
G.guclendirHtml = function (e) {
  var o = G.o, st = G.esyaStat(e), sonraki = G.esyaStat({ sablon: e.sablon, nadir: e.nadir, arti: e.arti + 1 });
  var satir = Object.keys(st).map(function (k) {
    return '<div class="dm-stat">' + G.STAT_ADLARI[k] + ': ' + st[k] + (e.arti < G.MAKS_ARTI ? ' <span class="fark-arti">→ ' + sonraki[k] + '</span>' : '') + '</div>';
  }).join('');
  var alt;
  if (e.arti >= G.MAKS_ARTI) alt = '<p class="mer-bitti">En yüksek güçlendirme seviyesinde.</p>';
  else {
    var ml = G.guclendirMaliyet(e);
    alt = '<div class="dm-maliyet">Başarı: <b>%' + G.guclendirSans(e.arti) + '</b>' + (e.arti >= G.ZORLUK.guclendirDusmeArti ? ' <span class="fark-eksi">(başarısızlıkta seviye düşer)</span>' : '') + '</div>' +
      '<div class="dm-maliyet">Bedel: <span class="' + (o.para >= ml ? 'fark-arti' : 'fark-eksi') + '">' + G.IK_PARA + ' ' + ml + '</span> ' +
      '<span class="' + (o.sarf.tas >= 1 ? 'fark-arti' : 'fark-eksi') + '">' + G.SARF.tas.ikon + ' ' + o.sarf.tas + '/1</span></div>' +
      '<div class="dm-dugmeler"><button class="sus-dugme" data-eylem="guclendir" data-id="' + e.id + '"><span>Güçlendir +' + (e.arti + 1) + '</span></button></div>';
  }
  return G.dmBaslikHtml(e) + '<div class="dm-kolon tek"><h4>Temel statlar +' + e.arti + '</h4>' + satir + '</div>' + alt;
};

// ---- Eritme ----
G.eritHtml = function (e) {
  var g = G.eritmeGetiri(e);
  return G.dmBaslikHtml(e) +
    '<div class="dm-kolon tek"><h4>Eritirsen</h4><div class="dm-stat">' + G.SARF.toz.ikon + ' ' + g.toz + ' Ruh Tozu</div>' + (g.tas ? '<div class="dm-stat">' + G.SARF.tas.ikon + ' ' + g.tas + ' Arıtma Taşı</div>' : '') + '</div>' +
    '<div class="dm-dugmeler"><button class="sus-dugme" data-eylem="erit" data-id="' + e.id + '"' + (e.kilit ? ' disabled' : '') + '><span>Erit</span></button>' +
      '<button class="sus-dugme" data-eylem="topluErit"><span>Nadirleri erit</span></button></div>' +
    (e.kilit ? '<p class="fark-eksi kucuk-not">Kilitli eşya eritilmez.</p>' : '') +
    '<p class="soluk kucuk-not">Ruh Tozu arıtmada kullanılır. Toplu erit: kilitsiz, güçlendirilmemiş, set olmayan Nadir eşyalar.</p>';
};
