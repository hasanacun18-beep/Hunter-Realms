// ============================================================
// arayuz-canta.js — Çanta paneli (sıralama, filtre) ve eşya penceresi
// ============================================================
G.SIRALAMALAR = { yeni: 'En yeni', gp: 'Eşya gücü', nadir: 'Nadirlik', yuva: 'Yuva' };
G.FILTRELER = { hepsi: 'Tümü', yukseltme: 'GP artıranlar', kusanilabilir: 'Kuşanabildiklerim', set: 'Setler', kilitli: 'Kilitliler' };

// Çanta sekmesi açıksa yenile (bebek + çanta)
G.cizCanta = function () { if (G.sekme === 'canta') G.cizCantaEkrani(); };

G.cantaSekme = 'tumu';   // tumu | esya | ekipman

// Sarf malzemesi kutusu (yığın sayısıyla)
G.sarfKutuHtml = function (t) {
  var x = G.SARF[t];
  return '<button class="esya-kutu sarf-kutu" style="border-color:' + x.renk + '" data-eylem="sarfAc" data-t="' + t + '">' +
    '<span class="yigin">' + G.o.sarf[t] + '</span><span class="ik">' + x.ikon + '</span><span>' + x.ad + '</span></button>';
};

G.cantaHtml = function () {
  var o = G.o, ay = o.ayar.canta, taban = G.hesapla(o).cp;
  var slotSira = {};
  G.SLOTLAR.forEach(function (sl, i) { slotSira[sl.id] = i; });

  // Her eşyanın GP farkını bir kez hesapla
  var liste = o.canta.map(function (e) {
    var s = G.ESYALAR[e.sablon];
    return { e: e, s: s, fark: s.lv <= o.lv ? G.gpFarki(e, taban) : 0, gp: G.esyaGP(e) };
  });
  liste = liste.filter(function (x) {
    switch (ay.filtre) {
      case 'yukseltme':     return x.fark > 0;
      case 'kusanilabilir': return x.s.lv <= o.lv;
      case 'set':           return !!x.s.set;
      case 'kilitli':       return !!x.e.kilit;
      default:              return true;
    }
  });
  liste.sort(function (a, b) {
    switch (ay.sira) {
      case 'gp':    return b.gp - a.gp;
      case 'nadir': return (b.e.nadir - a.e.nadir) || (b.e.arti - a.e.arti) || (b.gp - a.gp);
      case 'yuva':  return (slotSira[a.s.slot] - slotSira[b.s.slot]) || (b.gp - a.gp);
      default:      return b.e.id - a.e.id;
    }
  });

  function secim(id, tablo, secili) {
    return '<select id="' + id + '" class="girdi">' + Object.keys(tablo).map(function (k) {
      return '<option value="' + k + '"' + (k === secili ? ' selected' : '') + '>' + tablo[k] + '</option>';
    }).join('') + '</select>';
  }

  var sarflar = G.cantaSekme !== 'ekipman'
    ? Object.keys(G.SARF).filter(function (t) { return o.sarf[t] > 0; }).map(G.sarfKutuHtml).join('') : '';
  var esyalar = G.cantaSekme !== 'esya'
    ? liste.map(function (x) { return G.esyaKutuHtml(x.e, 'esyaAc', null, x.fark > 0); }).join('') : '';
  var bosluk = '';
  if (G.cantaSekme !== 'esya') for (var i = o.canta.length; i < G.cantaLimit(); i++) bosluk += '<span class="esya-kutu bos-yuva"></span>';

  var sekmeler = [['tumu', 'Tümü'], ['esya', 'Eşya'], ['ekipman', 'Ekipman']].map(function (x) {
    return '<button class="' + (G.cantaSekme === x[0] ? 'aktif' : '') + '" data-eylem="cantaSekme" data-s="' + x[0] + '">' + x[1] + '</button>';
  }).join('');
  var dolu = G.cantaLimit() <= o.canta.length;

  return '<div class="canta-baslik"><div class="canta-sekmeler">' + sekmeler + '</div>' +
      '<span class="canta-sayi' + (dolu ? ' fark-eksi' : '') + '">' + o.canta.length + '/' + G.cantaLimit() + '</span>' +
      (G.cantaLimit() < G.CANTA.maks ? '<button class="canta-arti" data-eylem="cantaArti" aria-label="Çantayı genişlet">+</button>' : '') + '</div>' +
    (G.cantaSekme !== 'esya' ? '<div class="canta-kontrol">' + secim('cantaSira', G.SIRALAMALAR, ay.sira) + secim('cantaFiltre', G.FILTRELER, ay.filtre) + '</div>' : '') +
    '<div class="canta-izgara">' + sarflar + esyalar + bosluk + '</div>' +
    '<div class="canta-eylemler">' +
      '<button data-eylem="topluSat">' + G.IK_PARA + ' Toplu sat</button>' +
      '<button data-eylem="topluErit">' + G.ikon('alev') + ' Toplu erit</button>' +
    '</div>' +
    '<p class="soluk kucuk-not">Toplu sat: sıradan ve iyi eşyalar. Toplu erit: nadir eşyalar. Kilitli, güçlendirilmiş ve set eşyalarına dokunulmaz. ▲ kuşanınca GP\'ni artırır.</p>';
};

// Sarf malzemesine dokununca
G.sarfModal = function (t) {
  var x = G.SARF[t], o = G.o, kullan = t === 'hp' || t === 'mp' || t === 'parsomen';
  G.$('modalIc').innerHTML =
    '<h3>' + x.ikon + ' ' + x.ad + '</h3>' +
    '<div class="alt-baslik">Elinde: ' + o.sarf[t] + '</div>' +
    '<p class="bilgi">' + x.aciklama + '</p>' +
    '<div class="modal-dugmeler">' +
      (kullan ? '<button data-eylem="sarfKullan" data-t="' + t + '"' + (o.sarf[t] > 0 ? '' : ' disabled') + '>Kullan</button>' : '') +
      '<button data-eylem="modalKapat">Kapat</button></div>';
  G.$('modal').classList.remove('gizli');
};

G.cantaArtiModal = function () {
  var fiyat = G.cantaGenisletFiyat();
  G.$('modalIc').innerHTML =
    '<h3>' + G.ikon('canta') + ' Çantayı genişlet</h3>' +
    '<p class="bilgi">' + G.cantaLimit() + ' yuvadan ' + (G.cantaLimit() + G.CANTA.adim) + ' yuvaya çıkar. En fazla ' + G.CANTA.maks + '.</p>' +
    '<p class="bilgi">Bedeli: <b>' + fiyat + ' altın</b> (altının: ' + G.o.para + ')</p>' +
    '<div class="modal-dugmeler"><button data-eylem="cantaGenislet"' + (G.o.para >= fiyat ? '' : ' disabled') + '>Genişlet</button>' +
    '<button data-eylem="modalKapat">Vazgeç</button></div>';
  G.$('modal').classList.remove('gizli');
};

// ---------- Eşya penceresi ----------
G.esyaModal = function (id) {
  var f = G.esyaBul(id);
  if (!f) { G.modalKapat(); return; }
  var o = G.o, e = f.e, s = G.ESYALAR[e.sablon], n = G.NADIRLIK[e.nadir], st = G.esyaStat(e);
  var cantada = f.yer === 'canta';
  var karsi = cantada ? o.kusanilan[G.hedefYuva(e)] : null;
  var kst = karsi ? G.esyaStat(karsi) : {};
  var slotAd = G.SLOTLAR.filter(function (x) { return x.id === s.slot; })[0].ad;

  // Temel statlar (üstündekiyle fark)
  var satirlar = '';
  for (var k in G.STAT_ADLARI) {
    if (!st[k] && !kst[k]) continue;
    var fark = (st[k] || 0) - (kst[k] || 0), fh = '';
    if (cantada && fark) fh = ' <span class="' + (fark > 0 ? 'fark-arti' : 'fark-eksi') + '">(' + (fark > 0 ? '+' : '') + fark + ')</span>';
    satirlar += '<div class="satir"><span>' + G.STAT_ADLARI[k] + '</span><span>' + (st[k] || 0) + fh + '</span></div>';
  }
  // v0.42: ruh dökümü elementi ve statları
  if (e.ruh) {
    var rel = G.ruhElement(e.ruh.el), retk = G.ruhEtkin(e);
    satirlar += '<div class="satir"><span>Element</span><span style="color:' + rel.renk + '">' + rel.ad + '</span></div>';
    e.ruh.st.forEach(function (x) { satirlar += '<div class="satir"><span class="' + (retk ? '' : 'soluk') + '">Ruh: ' + G.bonusYazi(x.k, x.v) + '</span><span class="' + (retk ? 'fark-arti' : 'soluk') + '">' + (retk ? 'etkin' : 'etkisiz') + '</span></div>'; });
  }
  // v0.35: su verme cilası
  if (Object.keys(G.suMaks(e)).length) satirlar += '<div class="satir"><span>Cila (su verme)</span><span class="cila-yazi">%' + G.cila(e) + '</span></div>';

  // Ek statlar ve zar kilitleri
  var ek = e.ek || [], kilitli = G.kilitliStatlar(e), ekHtml = '';
  if (ek.length) {
    ekHtml = '<div class="ek-liste">' + ek.map(function (x) {
      var kl = kilitli.indexOf(x.k) >= 0;
      var dugme = ek.length > 1
        ? '<button class="zar-kilit' + (kl ? ' acik' : '') + '" data-eylem="zarKilit" data-id="' + e.id + '" data-k="' + x.k + '" aria-label="Zarlamada koru">' + G.ikon(kl ? 'kilit' : 'kilit_acik') + '</button>'
        : '';
      return '<div class="ek-satir"><span class="ek-stat">' + G.bonusYazi(x.k, x.v) + '</span>' + dugme + '</div>';
    }).join('') + '</div>';
  }

  var gpHtml = '<div class="gp-satir soluk">Eşya gücü ' + G.esyaGP(e);
  if (cantada) {
    var gpFark = G.gpFarki(e);
    gpHtml += '<span class="' + (gpFark >= 0 ? 'fark-arti' : 'fark-eksi') + '">Kuşanırsan GP ' + (gpFark >= 0 ? '+' : '') + gpFark + '</span>';
  }
  gpHtml += '</div>';

  var setHtml = s.set ? G.setDetayHtml(s.set) : '';

  // Bilgi satırları
  var bilgi = [];
  bilgi.push(e.arti < G.MAKS_ARTI
    ? 'Güçlendir +' + e.arti + ' → +' + (e.arti + 1) + ': %' + G.guclendirSans(e.arti) + ' başarı, ' + G.guclendirMaliyet(e) + ' altın, 1 Arıtma Taşı.' +
      (e.arti >= G.ZORLUK.guclendirDusmeArti ? ' Başarısız olursa seviye düşer.' : '')
    : 'En yüksek güçlendirme seviyesinde.');
  if (ek.length) {
    var zm = G.zarMaliyet(e);
    bilgi.push('Zarla: ' + zm.toz + ' Ruh Tozu, ' + zm.altin + ' altın.' + (ek.length > 1 ? ' ' + G.ikon('kilit') + ' ile koruduğun statlar değişmez, her kilit maliyeti artırır.' : ''));
  }
  if (cantada && e.nadir >= 2) {
    var g = G.eritmeGetiri(e);
    bilgi.push('Eritirsen: ' + g.toz + ' Ruh Tozu' + (g.tas ? ', ' + g.tas + ' Arıtma Taşı' : '') + '.');
  }
  bilgi.push('Elinde: ' + o.sarf.tas + ' Arıtma Taşı, ' + o.sarf.toz + ' Ruh Tozu.');

  // Düğmeler
  var d = '';
  d += cantada
    ? '<button data-eylem="kusan" data-id="' + e.id + '"' + (o.lv < s.lv ? ' disabled' : '') + '>Kuşan</button>'
    : '<button data-eylem="cikar" data-slot="' + f.slot + '">Çıkar</button>';
  d += '<button data-eylem="guclendir" data-id="' + e.id + '"' + (e.arti >= G.MAKS_ARTI ? ' disabled' : '') + '>Güçlendir</button>';
  if (ek.length) d += '<button data-eylem="demirciAc" data-id="' + e.id + '">' + G.ikon('pirilti') + ' Arıt</button>';
  if (cantada) d += '<button data-eylem="sat" data-id="' + e.id + '"' + (e.kilit ? ' disabled' : '') + '>Sat (' + G.satisDegeri(e) + ')</button>';
  if (cantada && e.nadir >= 2) d += '<button data-eylem="erit" data-id="' + e.id + '"' + (e.kilit ? ' disabled' : '') + '>Erit</button>';
  d += '<button data-eylem="kilit" data-id="' + e.id + '">' + (e.kilit ? 'Kilidi aç' : 'Kilitle') + '</button>';
  d += '<button data-eylem="modalKapat">Kapat</button>';

  G.$('modalIc').innerHTML =
    '<h3 style="color:' + n.renk + '">' + G.gorunum(e.sablon).ikon + ' ' + G.esyaAd(e) + (e.kilit ? ' ' + G.ikon('kilit') : '') + '</h3>' +
    '<div class="alt-baslik">' + n.ad + ' ' + slotAd.toLowerCase() + ', seviye ' + s.lv + ' gerekir' +
      (o.lv < s.lv ? ' <span class="fark-eksi">(seviyen yetmiyor)</span>' : '') + '</div>' +
    (G.esyaKoken(s) ? '<p class="esya-koken">' + G.esyaKoken(s) + '</p>' : '') +
    satirlar + ekHtml + gpHtml + setHtml +
    '<div class="bilgi">' + bilgi.join('<br>') + '</div>' +
    '<div class="modal-dugmeler">' + d + '</div>';
  G.$('modal').classList.remove('gizli');
};
