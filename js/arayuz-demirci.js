// ============================================================
// arayuz-demirci.js — v0.17: Demirci bölümü (referanstaki "Cast")
// Alt menü: Dön · Arıtma · Güçlendirme · Eritme
// Solda eşya listesi (Kuşanılı / Çanta), sağda seçili eşya ve işlem
// ============================================================
G.demirciAlt = 'arit';
G.demirciKaynak = 'kusanili';
G.demirciSecili = null;
G.DEMIRCI_ALT = [['arit', G.ikon('pirilti'), 'Arıtma'], ['guclendir', G.ikon('cekic'), 'Güçlendirme'], ['suverme', G.ikon('suverme'), 'Su Verme'], ['erit', G.ikon('alev'), 'Eritme']];

// Eşya penceresinden "Arıt" ile gel
G.demirciAc = function (id) {
  var f = G.esyaBul(id);
  G.modalKapat();
  G.demirciAlt = 'arit'; G.aritma = null; G.suSecimSifirla();
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
  else if (G.demirciAlt === 'suverme') sag = G.suvermeHtml(f.e);
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
      (e.ek.length > 1 ? '' : ' disabled') + '>' + G.ikon(kl ? 'kilit' : 'kilit_acik') + '</button>' + G.bonusYazi(x.k, x.v) + '</div>';
  }).join('');
  var a = G.aritma && G.aritma.id === e.id ? G.aritma : null, onizleme = '', gpSag = '';
  if (a) {
    onizleme = a.ek.map(function (x) { return '<div class="dm-stat yeni">' + G.bonusYazi(x.k, x.v) + '</div>'; }).join('');
    var yeniGp = G.esyaGP({ sablon: e.sablon, nadir: e.nadir, arti: e.arti, ek: a.ek, so: e.so }), eskiGp = G.esyaGP(e);
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
    '<p class="soluk kucuk-not">Arıt yeni statları önizler, eşyan değişmez. Beğenirsen Kaydet. ' + G.ikon('kilit') + ' kilitli statlar değişmez, her kilit bedeli artırır.</p>';
};

// ---- Güçlendirme ----
G.guclendirHtml = function (e) {
  var o = G.o, st = G.esyaStat(e), sonraki = G.esyaStat({ sablon: e.sablon, nadir: e.nadir, arti: e.arti + 1, so: e.so });
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

// ============================================================
// v0.28 — GÜÇLENDİRME RİTÜELİ (sadece gösterim; sonuç esya.js → G.guclendir'de zaten hesaplandı ve kaydedildi)
// Çekiç 3 kez iner, kısa bekleyiş, sonra sonuç. +7 ve üstünde bekleyiş uzar, aura kızarır.
// Her an dokununca sonuca atlar; sonuç görünürken dokununca kapanır.
// ============================================================
G.RITUEL = { vurus: 3, aralik: 380, bekle: 450, bekleYuksek: 1100, yuksekArti: 7 };

G.guclendirSahne = function (s, bitince) {
  var R = G.RITUEL, hedef = s.eski + 1, yuksek = hedef >= R.yuksekArti;
  var eski = G.$('rituel');
  if (eski) eski.remove();
  var el = document.createElement('div');
  el.id = 'rituel';
  el.className = 'rituel' + (yuksek ? ' yuksek' : '');
  el.setAttribute('data-eylem', 'rituelDokun');
  el.innerHTML =
    '<div class="rt-sahne">' +
      // Başlık eski seviyeyle: sonuç (zaten kaydedildi) sahne bitmeden belli olmasın
      '<div class="rt-baslik" style="color:' + G.NADIRLIK[s.e.nadir].renk + '">' + G.gorunum(s.e.sablon).ad + (s.eski ? ' +' + s.eski : '') + '</div>' +
      '<div class="rt-ors"><span class="rt-esya">' + G.gorunum(s.e.sablon).ikon + '</span>' +
        '<span class="rt-cekic">' + G.ikon('cekic') + '</span>' + G.ikon('ors_duz', 'rt-ors-ikon') + '<span class="rt-kivilcim" id="rtKivilcim"></span></div>' +
      '<div class="rt-arti"><b>+' + s.eski + '</b> → <b>+' + hedef + '</b></div>' +
      '<div class="rt-sans">Başarı şansı %' + s.sans + '</div>' +
      '<div class="rt-sonuc" id="rtSonuc"></div>' +
      '<div class="rt-ipucu" id="rtIpucu">Atlamak için dokun</div>' +
    '</div>';
  G.$('uygulama').appendChild(el);
  G.rituel = { s: s, el: el, bitince: bitince, zaman: [], bitti: false };
  for (var i = 0; i < R.vurus; i++) G.rituel.zaman.push(setTimeout(G.rituelVur, i * R.aralik));
  G.rituel.zaman.push(setTimeout(G.rituelSonuc, (R.vurus - 1) * R.aralik + (yuksek ? R.bekleYuksek : R.bekle)));
};

// Çekiç iner: sarsıntı, kıvılcım, metal sesi
G.rituelVur = function () {
  var r = G.rituel;
  if (!r || r.bitti) return;
  G.sinifTekrar(r.el.querySelector('.rt-ors'), 'vur');
  var k = G.$('rtKivilcim'), h = '';
  for (var i = 0; i < 9; i++) {
    var a = -Math.PI * (0.1 + Math.random() * 0.8), d = 30 + Math.random() * 45;
    h += '<i class="fx-kivilcim" style="left:50%;top:0;--dx:' + Math.round(Math.cos(a) * d) + 'px;--dy:' + Math.round(Math.sin(a) * d) + 'px;background:#ffc860"></i>';
  }
  if (k) k.innerHTML = h;
  G.sesCal('cekic');
};

G.rituelSonuc = function () {
  var r = G.rituel;
  if (!r || r.bitti) return;
  r.bitti = true;
  r.zaman.forEach(clearTimeout);
  var s = r.s, yazi = { basari: 'BAŞARILI', bos: 'BAŞARISIZ', dusus: 'KIRILDI' }[s.tur];
  var alt = s.tur === 'basari' ? G.esyaAd(s.e) + ' oldu!'
    : s.tur === 'dusus' ? 'Eşya +' + s.yeni + ' seviyesine düştü.' : 'Taş ve altın gitti, eşya aynı kaldı.';
  r.el.classList.add('sonuc', s.tur);
  G.$('rtSonuc').innerHTML = '<b>' + yazi + '</b><span>' + alt + '</span>';
  G.$('rtIpucu').textContent = 'Devam etmek için dokun';
  G.sesCal(s.tur === 'basari' ? 'basari' : s.tur === 'dusus' ? 'kirilma' : 'bos');
  // +7 ve üstü başarılar günlüğe düşer (KO'daki "+8 bastı" anı)
  if (s.tur === 'basari' && s.yeni >= G.RITUEL.yuksekArti) G.log(G.ikon('cekic') + ' ' + G.esyaAd(s.e) + ' oldu!', 'kazanc');
};

// Dokunuş: animasyon sürüyorsa sonuca atlar, sonuç görünüyorsa kapatır
G.rituelDokun = function () {
  var r = G.rituel;
  if (!r) return;
  if (!r.bitti) { G.rituelSonuc(); return; }
  r.el.remove();
  G.rituel = null;
  if (r.bitince) r.bitince();
};

// ---- v0.35: Su verme (referanstaki Quench) · v0.36: cila taşları ----
G.suvermeHtml = function (e) {
  var o = G.o, S = G.SUVERME, m = G.suMaks(e), c = G.cila(e), adaylar = G.suTeklifler(e), sec = G.suSecim;
  var a = G.suOnizleme && G.suOnizleme.id === e.id ? G.suOnizleme : null;
  var teklif = adaylar.map(function (x) {
    return '<div class="dm-kutu su-teklif' + (x.id === sec.teklif ? ' secili' : '') + '">' + G.esyaKutuHtml(x, 'suTeklif') +
      '<small>Cila %' + G.cila(x) + '</small></div>';
  }).join('') || '<p class="soluk kucuk-not">Çantanda aynı ad ve nadirlikte, cilası %' + c + ' üstünde bir eşya yok.</p>';
  // Stat satırı: bonus değeri / en fazla
  function satir(so, k) {
    var v = Math.round(m[k] * ((so && so[k]) || 0) / 100);
    return '<span>' + G.STAT_ADLARI[k] + ': <b>+' + v + '</b> <small>/ ' + m[k] + '</small></span>';
  }
  var mevcut = Object.keys(m).map(function (k) {
    var kl = !!sec.kilit[k];
    return '<div class="dm-stat"><button class="dm-kilit' + (kl ? ' kilitli' : '') + '" data-eylem="suKilit" data-k="' + k + '">' +
      G.ikon(kl ? 'kilit' : 'kilit_acik') + '</button>' + satir(e.so, k) + '</div>';
  }).join('');
  var onizleme = '', gpSag = '';
  if (a) {
    onizleme = Object.keys(m).map(function (k) {
      var fark = a.so[k] - ((e.so && e.so[k]) || 0);
      return '<div class="dm-stat ' + (fark > 0 ? 'yeni' : fark < 0 ? 'dusuk' : '') + '">' + satir(a.so, k) + '</div>';
    }).join('');
    var kopya = { sablon: e.sablon, nadir: e.nadir, arti: e.arti, ek: e.ek, so: a.so }, yeniGp = G.esyaGP(kopya), eskiGp = G.esyaGP(e);
    gpSag = 'Cila: <b class="' + (G.cila(kopya) >= c ? 'fark-arti' : 'fark-eksi') + '">%' + G.cila(kopya) + '</b> · GP <b class="' + (yeniGp >= eskiGp ? 'fark-arti' : 'fark-eksi') + '">' + yeniGp + '</b>';
  }
  var normal = G.suMaliyet(e, 'normal'), gel = G.suMaliyet(e, 'gelismis'), sif = G.suMaliyet(e, 'sifirla'), kilitSay = Object.keys(sec.kilit).length;
  function para(n) { return '<span class="' + (o.para >= n ? 'fark-arti' : 'fark-eksi') + '">' + G.IK_PARA + ' ' + n + '</span>'; }
  // Cila taşları
  var taslar = G.CILA_TASLARI.map(function (t) {
    var n = o.sarf[t.id] || 0;
    return '<button class="cila-tas" style="border-color:' + t.renk + '" data-eylem="cilala" data-id="' + e.id + '" data-t="' + t.id + '"' +
      (n && c < 100 ? '' : ' disabled') + '>' + G.SARF[t.id].ikon + '<b>+' + t.arti + '</b><small>x' + n + '</small></button>';
  }).join('');
  return G.dmBaslikHtml(e) +
    '<div class="dm-tablo su-cila"><h4>Cilala <small>(cila taşı cilayı doğrudan yükseltir · şu an %' + c + ')</small></h4><div class="cila-taslar">' + taslar + '</div></div>' +
    '<div class="dm-tablo su-kurban"><h4>Kurban edilecek eşya <small>(aynı ad ve nadirlik, cilası daha yüksek)</small></h4><div class="su-teklifler">' + teklif + '</div></div>' +
    '<div class="dm-karsilastir">' +
      '<div class="dm-kolon"><h4>Mevcut su verme</h4>' + mevcut + '</div><div class="dm-ok">➤</div>' +
      '<div class="dm-kolon"><h4>Sonuç</h4>' + (onizleme || '<p class="soluk kucuk-not">Kurban seç ve Su Ver\'e bas, sonuç burada görünür.</p>') + '</div>' +
    '</div>' +
    '<div class="dm-gpler"><span>Cila: <b>%' + c + '</b> · GP ' + G.esyaGP(e) + '</span><span>' + gpSag + '</span></div>' +
    '<div class="dm-maliyet">Su Ver: ' + para(normal) + ' · Gelişmiş: ' + para(gel) + '</div>' +
    '<div class="dm-dugmeler su-dugmeler">' +
      '<button class="sus-dugme" data-eylem="suVer" data-id="' + e.id + '"' + (sec.teklif != null && !a ? '' : ' disabled') + '><span>Su Ver</span></button>' +
      '<button class="sus-dugme" data-eylem="suGelismis" data-id="' + e.id + '"' + (sec.teklif != null && kilitSay && !a ? '' : ' disabled') + '><span>Gelişmiş</span></button>' +
      '<button class="sus-dugme" data-eylem="suKaydet"' + (a ? '' : ' disabled') + '><span>Kaydet</span></button>' +
    '</div>' +
    '<button class="genis-dugme su-sifirla" data-eylem="suSifirla" data-id="' + e.id + '"' + (c > 0 ? '' : ' disabled') + '>Cilayı sıfırla (' + G.IK_PARA + ' ' + sif + ')</button>' +
    '<p class="soluk kucuk-not"><b>Su Ver:</b> cilası daha yüksek aynı eşya kurban edilir, bütün statlar yeniden zarlanır; cila farkı büyüdükçe artış büyür, bazen bir stat düşebilir. ' +
      '<b>Gelişmiş:</b> sadece ' + G.ikon('kilit') + ' kilitli 1-2 stat değişir ve yalnız artış kalır. ' +
      'Kurban edilen eşya her durumda gider; sonucu beğenirsen Kaydet. <b>Sıfırla:</b> cila %0 olur, böylece daha çok eşya kurban edilebilir.</p>';
};
