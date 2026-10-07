// ============================================================
// arayuz-etkinlik.js — v0.10: Etkinlikler listesi ve maden ekranı
// ============================================================
G.etkinlikGorunum = 'liste';
G.madenKatSecili = 0;

G.gunlukSekme = 'gunluk';

G.cizEtkinlik = function () {
  if (G.etkinlikGorunum === 'maden') { G.cizMaden(); return; }
  if (G.etkinlikGorunum === 'gorevler') { G.cizGunluk(); return; }
  if (G.etkinlikGorunum === 'bolumler') { G.cizBolumler(); return; }
  if (G.etkinlikGorunum === 'kule') { G.cizKule(); return; }
  var o = G.o, m = o.maden;
  G.madenIsle(); G.gunlukKontrol();
  var durum = m.kazi
    ? 'Kazı sürüyor: ' + G.MADEN_KATLARI[m.kazi.kat].ad + ', ocak ' + m.kazi.no
    : 'Madenci enerjisi ' + m.enerji + '/' + G.MADEN.enerjiMaks;
  G.$('icerik').innerHTML =
    '<div class="panel">' +
    '<button class="etkinlik-kart" data-eylem="etkinlikAc" data-e="maden">' +
      '<b>' + G.ikon('kazma') + ' Eski Maden</b><span>Ocak kap, arka planda cevher kaz. İlahi silahın buradan güçlenir.</span>' +
      '<small class="' + (m.kazi ? 'fark-arti' : 'soluk') + '">' + durum + '</small></button>' +
    (function () {
      var bi = 0; while (G.BOLUMLER[bi + 1] && G.bolumAcikMi(bi + 1)) bi++;
      var bek = G.bolumBekleyen();
      return '<button class="etkinlik-kart" data-eylem="etkinlikAc" data-e="bolumler"><b>' + G.ikon('cilt') + ' Bölümler</b>' +
        '<span>Bölüm bölüm açılan hedefler. Her görevin kendi ödülü var.</span>' +
        '<small class="' + (bek ? 'fark-arti' : 'soluk') + '">' + (bek ? bek + ' ödül seni bekliyor' : 'Bölüm ' + (bi + 1) + ': ' + G.BOLUMLER[bi].ad) + '</small></button>';
    })() +
    '<button class="etkinlik-kart" data-eylem="etkinlikAc" data-e="gorevler"><b>' + G.ikon('liste') + ' Günlük Görevler</b>' +
      '<span>Her gün ve her hafta yenilenen görevler. Aktiflik topla, sandıkları aç.</span>' +
      '<small class="' + (G.gunlukBekleyen() ? 'fark-arti' : 'soluk') + '">' +
      (G.gunlukBekleyen() ? G.gunlukBekleyen() + ' ödül seni bekliyor' : 'Günlük aktiflik ' + o.gunluk.aktiflik + '/100') + '</small></button>' +
    (function () {
      var e = o.kule.enYuksek, k = G.kuleKonum(Math.max(1, e));
      return '<button class="etkinlik-kart" data-eylem="etkinlikAc" data-e="kule"><b>' + G.ikon('kule') + ' Kule</b>' +
        '<span>Kat kat tırman, bekçileri süre dolmadan yen. Rün ve Rün Özü kazan.</span>' +
        '<small class="soluk">' + (e ? 'En yüksek: Kademe ' + k.kademe + ' · Kat ' + k.kat : 'Henüz tırmanmadın') + '</small></button>';
    })() +
    '<div class="etkinlik-kart kapali"><b>' + G.ikon('kiliclar') + ' Arena</b><span>Diğer oyuncuların karakterleriyle dövüş.</span><small class="soluk">Yakında</small></div>' +
    '</div>';
};

G.cevherSatirHtml = function (liste, id) {
  return '<div class="cevher-satir"' + (id ? ' id="' + id + '"' : '') + '>' + Object.keys(G.CEVHERLER).map(function (k) {
    return '<span title="' + G.CEVHERLER[k].ad + '">' + G.CEVHERLER[k].ikon + ' ' + (liste[k] || 0) + '</span>';
  }).join('') + '</div>';
};

G.cizMaden = function () {
  var o = G.o, m = o.maden, M = G.MADEN;
  G.madenIsle();
  var z = m.kazi, sec = G.MADEN_KATLARI[G.madenKatSecili], kilit = o.lv < sec.minLv;

  var kazi = '';
  if (z) {
    var kk = G.MADEN_KATLARI[z.kat];
    kazi = '<div class="kutu kazi-kutu"><h2>Kazı sürüyor</h2>' +
      '<div class="satir"><span>' + kk.ad + ', ' + kk.alt + '</span><span>Ocak ' + z.no + '</span></div>' +
      '<div class="enerji-satir"><span>Süre: <b id="kaziDakika">' + z.dakika + '</b> dakika</span><span id="kaziSaniye"></span></div>' +
      '<div class="cubuk kazi"><i id="kaziCubuk"></i></div>' +
      '<div class="soluk kucuk-not" style="margin-top:6px">Biriken (kazı bitince hesabına geçer):</div>' +
      G.cevherSatirHtml(z.bekleyen, 'bekleyenSatir') +
      '<button class="genis-dugme" data-eylem="madenBitir">Kazıyı bitir ve topla</button></div>';
  }

  var katlar = G.MADEN_KATLARI.map(function (k, i) {
    return '<button class="zincir-dugum' + (i === G.madenKatSecili ? ' aktif' : '') + '" data-eylem="madenKat" data-k="' + i + '"' + (o.lv < k.minLv ? ' disabled' : '') + '>' +
      k.ad + '<small>' + (o.lv < k.minLv ? 'seviye ' + k.minLv : k.ocak + ' ocak') + '</small></button>';
  }).join('');

  var ocaklar = '';
  if (!kilit) {
    ocaklar = '<div class="ocak-izgara">' + G.ocaklar(G.madenKatSecili).map(function (x) {
      var benim = z && z.kat === G.madenKatSecili && z.no === x.no;
      var sinif = benim ? 'benim' : (x.ad ? 'dolu' : 'bos');
      return '<button class="ocak ' + sinif + '"' + (benim ? '' : ' data-eylem="ocak" data-k="' + G.madenKatSecili + '" data-n="' + x.no + '"') + '>' +
        '<small>' + x.no + '</small>' + (benim ? 'Sen' : (x.ad ? G.kacis(x.ad) : 'Boş')) +
        (x.ad && !benim ? '<i>%' + G.yagmaSans(x.guc) + '</i>' : '') + '</button>';
    }).join('') + '</div>';
  }
  var cevherler = sec.cevher.map(function (c) { return G.CEVHERLER[c[0]].ikon + ' ' + G.CEVHERLER[c[0]].ad + ' %' + c[1]; }).join(', ');
  var log = G.madenLoglar.map(function (l) { return '<div class="' + l.s + '">' + l.h + '</div>'; }).join('');

  G.$('icerik').innerHTML =
    '<div class="panel">' +
    '<button class="geri-dugme" data-eylem="etkinlikGeri">← Etkinlikler</button>' +
    '<div class="kasaba-sahne maden-sahne"><div class="kasaba-kemer"><h2>' + G.ikon('kazma') + ' Eski Maden</h2></div>' +
      '<p>Yüzyıllardır kazılan bu dağın içinde gece yarısı bile kazma sesleri yankılanır. Ocağını kap, derinlere in, ama sırtını kollamayı unutma.</p></div>' +
    '<div class="kutu">' +
      '<div class="enerji-satir"><span>Madenci enerjisi</span><span id="enerjiYazi">' + m.enerji + '/' + M.enerjiMaks + '</span></div>' +
      '<div class="cubuk enerji"><i id="enerjiCubuk" style="width:' + (m.enerji / M.enerjiMaks * 100) + '%"></i></div>' +
      '<div class="cubuk-yazi"><span>Günde ' + Math.round(86400 / M.enerjiSure) + ' enerji dolar</span><span id="enerjiSure"></span></div>' +
      G.cevherSatirHtml(m.cevher) +
      '<button class="genis-dugme cay-dugme" data-eylem="cay">' + G.ikon('cay') + ' Madenci Çayı: +' + M.cayEnerji + ' enerji (' + (M.cayFiyat * o.lv) + ' altın)</button>' +
    '</div>' +
    kazi +
    '<div class="kutu"><h2>Katlar</h2><div class="maden-katlar">' + katlar + '</div>' +
      '<p class="soluk kucuk-not">' + sec.ad + ', ' + sec.alt + ': ' + cevherler + ' (her dakika). ' +
      'Derin katlarda ocak az, rakip çok ama cevher değerli.</p>' + ocaklar +
      (kilit ? '' : '<p class="soluk kucuk-not">Boş ocağa dokun: işgal et. Dolu ocağa dokun: yağmala (yüzde, kazanma şansın). Her deneme ' + M.isgalEnerji + ' enerji.</p>') +
    '</div>' +
    (log ? '<div class="kutu maden-log">' + log + '</div>' : '') +
    '<div class="kutu soluk kucuk-not">Nasıl çalışır: Ocak kapınca kazı arka planda sürer, sen avlanırken de. Her dakika 1 enerji harcanır ve cevher zarlanır. ' +
      'Enerji bitince, sen bitirince ya da bir rakip ocağını yağmalayınca kazı durur ve biriken hesabına geçer. Yağmada birikenin %' + M.kayipOran + '\'ini kaybedersin.</div>' +
    '</div>';
  G.madenSayac();
};

// Her saniye: kazıyı işle, maden ekranındaki sayaçları güncelle
G.madenSayac = function () {
  if (!G.o) return;
  G.gunlukKontrol();
  var degisti = G.madenIsle(), m = G.o.maden;
  if (G.sekme === 'etkinlik' && G.etkinlikGorunum === 'maden') {
    if (degisti) { G.cizMaden(); return; }
    if (!G.$('enerjiYazi')) return;
    G.$('enerjiYazi').textContent = m.enerji + '/' + G.MADEN.enerjiMaks;
    G.$('enerjiCubuk').style.width = (m.enerji / G.MADEN.enerjiMaks * 100) + '%';
    var kalan = G.enerjiKalan();
    G.$('enerjiSure').textContent = kalan ? 'Sonraki: ' + Math.floor(kalan / 60) + ':' + String(kalan % 60).padStart(2, '0') : 'Dolu';
    if (m.kazi && G.$('kaziCubuk')) {
      var gecen = (Date.now() - m.kazi.son) / 1000, top = G.MADEN.dakikaSn;
      G.$('kaziCubuk').style.width = Math.min(100, gecen / top * 100) + '%';
      G.$('kaziSaniye').textContent = 'Sonraki kazı: ' + Math.max(0, Math.ceil(top - gecen)) + ' sn';
    }
  }
};

// ---- v0.18: Günlük / haftalık görevler ----
G.cizGunluk = function () {
  var o = G.o, tur = G.gunlukSekme, d = G.gorevDonem(tur);
  G.gunlukKontrol();
  var kartlar = G.gorevListe(tur).map(function (g) {
    var sayi = Math.min(g.n, d.sayac[g.sayac] || 0), bitti = sayi >= g.n, alindi = d.alinan[g.id];
    var sag = alindi ? '<span class="alindi">Alındı</span>'
      : bitti ? '<button class="gorev-al" data-eylem="gunlukAl" data-tur="' + tur + '" data-id="' + g.id + '">Al</button>'
      : g.git ? '<button class="gelistir-dugme" data-eylem="gunlukGit" data-git="' + g.git + '">Git</button>' : '';
    return '<div class="gg-kart' + (alindi ? ' alindi-kart' : '') + '">' +
      '<div class="gg-ust"><b>' + g.ad + '</b><span class="' + (bitti ? 'fark-arti' : 'fark-eksi') + '">' + sayi + '/' + g.n + '</span></div>' +
      '<div class="gg-alt"><span class="akt-rozet ' + tur + '"><i>✦</i>' + g.akt + '</span>' + sag + '</div></div>';
  }).join('');
  var sandiklar = (tur === 'haftalik' ? G.SANDIK_HAFTALIK : G.SANDIK_GUNLUK).map(function (s) {
    var acik = d.sandik[s.esik], hazir = !acik && d.aktiflik >= s.esik;
    return '<button class="sandik' + (acik ? ' acik' : '') + (hazir ? ' hazir' : '') + '" style="left:' + s.esik + '%" data-eylem="sandikAc" data-tur="' + tur + '" data-esik="' + s.esik + '">' +
      '<span>' + G.ikon(acik ? 'acik_sandik' : 'sandik') + '</span><small>' + s.esik + '</small></button>';
  }).join('');
  G.$('icerik').innerHTML =
    '<div class="panel">' +
    '<button class="geri-dugme" data-eylem="etkinlikGeri">← Etkinlikler</button>' +
    '<div class="gg-sekmeler"><button' + (tur === 'gunluk' ? ' class="aktif"' : '') + ' data-eylem="gunlukSekme" data-tur="gunluk">Günlük</button>' +
      '<button' + (tur === 'haftalik' ? ' class="aktif"' : '') + ' data-eylem="gunlukSekme" data-tur="haftalik">Haftalık</button></div>' +
    '<p class="soluk kucuk-not" style="text-align:center">Yenilenmesine: ' + G.kalanSure(tur) + '</p>' +
    kartlar +
    '<div class="aktiflik-kutu">' +
      '<div class="akt-sayi"><b>' + d.aktiflik + '</b><span>Aktiflik</span></div>' +
      '<div class="akt-cubuk-alan"><div class="akt-cubuk"><i style="width:' + d.aktiflik + '%"></i></div>' + sandiklar + '</div>' +
    '</div>' +
    '</div>';
};

// ---- v0.19: Bölümler ----
G.bolumAcik = null;
G.odulIkon = function (odul) {
  var k = Object.keys(odul)[0], v = odul[k];
  var ikon = k === 'para' ? G.IK_PARA : (G.SARF[k] ? G.SARF[k].ikon : G.ikon('sandik'));
  return '<span class="bl-odul"><i>' + ikon + '</i><b>' + G.kisaSayi(v) + '</b></span>';
};

G.cizBolumler = function () {
  var o = G.o;
  if (G.bolumAcik == null) { var bi = 0; while (G.BOLUMLER[bi + 1] && G.bolumAcikMi(bi + 1)) bi++; G.bolumAcik = bi; }
  var html = G.BOLUMLER.map(function (b, i) {
    var acik = G.bolumAcikMi(i);
    var alinan = b.gorevler.filter(function (g) { return o.bolum.alinan[g.kid]; }).length;
    var afis = '<button class="bl-afis' + (acik ? '' : ' kilitli') + (G.bolumAcik === i ? ' secili' : '') + '" style="--b1:' + b.renk[0] + ';--b2:' + b.renk[1] + '"' +
      (acik ? ' data-eylem="bolumAc" data-i="' + i + '"' : ' disabled') + '>' +
      '<span class="bl-dag"></span><b>Bölüm ' + (i + 1) + '</b><em>' + (acik ? b.ad : '') + '</em>' +
      (acik ? '<small>' + alinan + '/' + b.gorevler.length + '</small>' : '<span class="bl-zincir">' + G.ikon('kilit') + '</span>') + '</button>';
    if (!acik || G.bolumAcik !== i) return afis;
    var gorevler = b.gorevler.map(function (g) {
      var sayi = Math.min(g.n, G.bolumSayi(g)), bitti = sayi >= g.n, alindi = o.bolum.alinan[g.kid];
      var sag = alindi ? '<span class="alindi">Alındı</span>'
        : bitti ? '<button class="gorev-al" data-eylem="bolumAl" data-id="' + g.kid + '">Al</button>'
        : '<button class="gelistir-dugme" data-eylem="bolumGit" data-id="' + g.kid + '">Git</button>';
      return '<div class="bl-gorev' + (alindi ? ' alindi-kart' : '') + '">' + G.odulIkon(g.odul) +
        '<div class="bl-orta"><b>' + G.bolumYazi(g) + '</b><span>İlerleme: <em class="' + (bitti ? 'fark-arti' : 'fark-eksi') + '">' + G.kisaSayi(sayi) + '/' + G.kisaSayi(g.n) + '</em></span></div>' + sag + '</div>';
    }).join('');
    return afis + '<div class="bl-liste">' + gorevler + '</div>';
  }).join('');
  G.$('icerik').innerHTML = '<div class="panel">' +
    '<button class="geri-dugme" data-eylem="etkinlikGeri">← Etkinlikler</button>' +
    '<h2 class="bolum-baslik" style="text-align:center">' + G.ikon('cilt') + ' Bölümler</h2>' + html +
    '<p class="soluk kucuk-not">Bir bölümün bütün ödüllerini alınca sonraki bölümün zinciri kırılır.</p></div>';
};

// ---- v0.20: Kule ekranı ----
G.cizKule = function () {
  var o = G.o, K = G.KULE, e = o.kule.enYuksek, f = Math.min(K.katToplam, e + 1), bitti = e >= K.katToplam;
  var k = G.kuleKonum(f), bek = G.kuleBekci(f), odul = G.kuleOdul(f);
  // Kademenin katları (üstte en yüksek)
  var katlar = '';
  for (var i = K.katSayi; i >= 1; i--) {
    var gf = (k.kademe - 1) * K.katSayi + i, gecti = gf <= e, sira = gf === f && !bitti;
    katlar += '<div class="kule-kat' + (gecti ? ' gecti' : '') + (sira ? ' sira' : '') + '"><span>' + i + '. Kat</span>' + (gecti ? '<i>✓</i>' : '') + '</div>';
  }
  var gun = G.kuleGunlukOdul(), gunAlindi = o.kule.gunluk === G.bugun();
  var runOnizle = Object.keys(G.RUN_TUR).map(function (t) { return '<span title="' + G.RUN_TUR[t].ad + '">' + G.RUN_TUR[t].ikon + '</span>'; }).join('');
  G.$('icerik').innerHTML = '<div class="panel">' +
    '<button class="geri-dugme" data-eylem="etkinlikGeri">← Etkinlikler</button>' +
    '<div class="kule-sahne">' +
      '<div class="kule-sol">' +
        '<div class="kutu kule-bilgi"><h4>Sıradaki bekçi</h4>' +
          (bitti ? '<p>Kulenin tepesine ulaştın!</p>' :
          '<div class="kule-bekci"><span>' + bek.ikon + '</span><div><b>' + bek.ad + '</b><small>Seviye ' + bek.lv + ' · Can ' + G.kisaSayi(bek.hpMax) + '</small></div></div>' +
          '<p class="soluk kucuk-not">Süre: ' + Math.floor(K.sure / 60) + ' dakika</p>') + '</div>' +
        '<div class="kutu kule-bilgi"><h4>Bu kattaki ödüller</h4>' +
          '<div class="kule-odul">' + G.IK_PARA + ' ' + G.kisaSayi(odul.para) + ' · ' + G.SARF.sayfa.ikon + ' ' + odul.sayfa + ' · ' + G.SARF.oz.ikon + ' ' + odul.oz + '</div>' +
          '<div class="kule-odul">Rün şansı: ' + (f % 3 === 0 ? 'kesin' : '%35') + ' <span class="kule-runler">' + runOnizle + '</span></div></div>' +
        '<button class="kule-gunluk" data-eylem="kuleGunluk"' + (gun && !gunAlindi ? '' : ' disabled') + '><span>' + G.ikon('sandik') + '</span>' +
          (gun ? (gunAlindi ? 'Günlük ödül alındı<br><small>Yarın tekrar gel</small>' : 'Günlük ödül<br><small>' + G.odulYazi(gun) + '</small>') : 'Günlük ödül<br><small>En az bir kat geç</small>') + '</button>' +
      '</div>' +
      '<div class="kule-sag"><div class="kule-kademe">' + k.kademe + '. Kademe</div>' + katlar +
        '<button class="sus-dugme kule-dugme" data-eylem="kuleGir"' + (bitti ? ' disabled' : '') + '><span>Meydan Oku</span></button></div>' +
    '</div>' +
    '<p class="soluk kucuk-not">Toplam ' + K.katToplam + ' kat (' + K.bekciler.length + ' kademe x ' + K.katSayi + '). Her katın ödülü ilk geçişte verilir. Rünlerini Karakter → Rünler\'den takarsın.</p>' +
    '</div>';
};
