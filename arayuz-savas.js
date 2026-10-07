// ============================================================
// arayuz-savas.js — Ana ekran: saha (av bölgesi) veya kasaba, bölge zinciri, savaş düğmeleri
// ============================================================

// Bölgelere göre saha zemini (koyu, iki ton)
G.ZEMIN = {
  orman: ['#1f261a', '#11140d'], vadi: ['#2a2419', '#15120c'], harabe: ['#26231f', '#121110'],
  kale: ['#2b1a18', '#150d0c'], bataklik: ['#1c2419', '#0e130c'], buzul: ['#20262b', '#0f1316'],
  volkan: ['#2e1c14', '#170d09'], ucurum: ['#1c1a24', '#0c0b11']
};

// Karenin sol üst köşesi (yüzde). Kart karenin içine küçük bir boşlukla oturur.
G.hucreKonum = function (k, s) {
  return { x: k * 100 / G.IZGARA.sut, y: s * 100 / G.IZGARA.sat };
};

// Çubuk içindeki sayı: 1022/1022, büyükse 133.9B/651B
G.canYazi = function (a, b) {
  a = Math.max(0, Math.round(a));
  return b >= 100000 ? G.kisaSayi(a) + '/' + G.kisaSayi(b) : a + '/' + b;
};

G.kartHtml = function (c, i) {
  var hedef = G.hedefI === i;
  var yuzde = Math.max(0, c.hp / c.hpMax * 100), p = G.hucreKonum(c.kol, c.sat);
  return '<button class="kart saha-kart' + (c.boss ? ' boss' : '') + (c.olu ? ' olu' : '') + (hedef ? ' hedef' : '') + (c.aktif ? ' aktif' : '') + '" id="kart' + i + '"' +
    ' style="left:' + p.x + '%;top:' + p.y + '%"' +
    ' data-eylem="saldir" data-i="' + i + '"' + (c.olu ? ' disabled' : '') + ' aria-label="' + c.ad + '">' +
    '<span class="kseviye">' + c.lv + '</span>' +
    '<span class="kikon">' + c.ikon + '</span>' +
    '<span class="kad' + (c.ad.length > 9 ? ' uzun' : '') + '">' + c.ad + '</span>' +
    '<span class="kcubuk"><i id="kh' + i + '" style="width:' + yuzde + '%"></i><b id="kt' + i + '">' + G.canYazi(c.hp, c.hpMax) + '</b></span></button>';
};

G.oyuncuKartHtml = function () {
  var o = G.o, p = G.hucreKonum(G.oyuncu.kol, G.oyuncu.sat);
  return '<div class="kart saha-kart oyuncu-kart" id="oyuncuKart" style="left:' + p.x + '%;top:' + p.y + '%">' +
    '<span class="kseviye">' + o.lv + '</span><span class="kikon">' + G.SINIFLAR[o.sinif].ikon + '</span>' +
    '<span class="kad' + (o.ad.length > 9 ? ' uzun' : '') + '">' + G.kacis(o.ad) + '</span>' +
    '<span class="kcubuk yesil"><i id="okHp"></i><b id="okHpY"></b></span><span class="kcubuk mavi"><i id="okMp"></i><b id="okMpY"></b></span></div>';
};

G.logHtml = function () {
  return '<div class="kutu" id="log">' + G.loglar.map(function (l) { return '<div class="' + l.s + '">' + l.h + '</div>'; }).join('') + '</div>';
};

// Bölge için önerilen güç (GP): canavar seviyesine göre kaba tahmin
G.onerilenGP = function (b) { return b.tur === 'kasaba' ? 0 : Math.round(68 * Math.pow(b.minLv + 1, 1.12)); };

// Zincir düğümleri: sonraki üstte, şu anki ortada, önceki altta
G.zincirDugumHtml = function () {
  var o = G.o, liste = G.BOLGELER, idx = 0;
  liste.forEach(function (b, i) { if (b.id === o.bolge) idx = i; });
  function dugum(x, aktif) {
    if (!x) return '<div class="zincir-dugum bos"></div>';
    var kilit = o.lv < x.minLv;
    return '<button class="zincir-dugum' + (aktif ? ' aktif' : '') + '"' + (aktif ? '' : ' data-eylem="git" data-b="' + x.id + '"') + (kilit ? ' disabled' : '') + '>' +
      x.ad + (kilit ? ' <small>seviye ' + x.minLv + '</small>' : '') + '</button>';
  }
  return '<div class="zincir">' + dugum(liste[idx + 1]) + '<i class="zincir-cizgi"></i>' + dugum(liste[idx], true) + '<i class="zincir-cizgi"></i>' + dugum(liste[idx - 1]) + '</div>';
};

// Alt panel: solda küçük bölge haritası, sağda zincir (referans düzeni)
G.bolgeAltHtml = function () {
  var o = G.o, b = G.bolgeBul(o.bolge), z = G.ZEMIN[b.id] || (b.tur === 'kasaba' ? ['#3a3226', '#1a150f'] : ['#24201a', '#12100c']);
  var gp = G.onerilenGP(b), cp = G.hesapla(o).cp;
  return '<div class="bolge-alt">' +
    '<div class="mini-harita" style="--z1:' + z[0] + ';--z2:' + z[1] + '">' +
      '<b>' + b.ad + '</b>' +
      '<span class="mh-arazi"></span>' +
      '<span class="mh-oneri">' + (gp ? 'Önerilen GP: <em class="' + (cp >= gp ? 'fark-arti' : 'fark-eksi') + '">' + gp + '+</em>' : 'Güvenli bölge') + '</span>' +
      '<span class="mh-dugmeler"><button data-eylem="ayarlar">⚙️ Ayarlar</button><button data-eylem="bolgeBilgi" data-b="' + b.id + '">📋 Bilgi</button></span>' +
    '</div>' + G.zincirDugumHtml() + '</div>';
};

// Kasaba ekranı gibi başka yerler eski adı kullanıyorsa
G.zincirHtml = G.bolgeAltHtml;

G.cizSavas = function () {
  var o = G.o, b = G.bolgeBul(o.bolge);
  if (b.tur === 'kasaba') { G.cizKasaba(); return; }
  var kuleMi = b.tur === 'kule';
  var boss = G.CANAVARLAR[b.boss] || { ikon: '👹' };
  var z = G.ZEMIN[b.id] || (kuleMi ? ['#2a2033', '#0e0b12'] : ['#24201a', '#12100c']);
  var bossVar = G.alan.some(function (c) { return c && c.boss && !c.olu; });
  G.$('icerik').classList.add('tek-ekran');   // her şey tek ekrana sığar, kaydırma yok

  G.$('icerik').innerHTML =
    '<div class="panel savas-panel">' +
    '<div class="saha" id="saha" style="--z1:' + z[0] + ';--z2:' + z[1] + '">' +
      '<div class="boss-plaka gizli" id="bossPlaka"></div>' +
      (kuleMi ? '<div class="kule-sure" id="kuleSure"></div>' : '') +
      '<span id="hedefIsaret" class="hedef-isaret gizli">✦</span>' +
      G.alan.map(function (c, i) { return c ? G.kartHtml(c, i) : ''; }).join('') +
      G.oyuncuKartHtml() +
    '</div>' +
    '<div class="sarf-cubugu">' +
      '<i class="susleme sol"></i>' +
      '<div class="sarf-yuvalar">' +
        '<button class="sarf-yuva" id="dHp" data-eylem="iksir" data-t="hp"><span class="say" id="sHp"></span><span class="ik">🧪</span><small>Can</small><span class="bekleme" id="bkHp"></span></button>' +
        '<button class="sarf-yuva" id="dMp" data-eylem="iksir" data-t="mp"><span class="say" id="sMp"></span><span class="ik">💧</span><small>Mana</small><span class="bekleme" id="bkMp"></span></button>' +
        '<button class="sarf-yuva" id="dParsomen" data-eylem="parsomen"><span class="say">' + o.sarf.parsomen + '</span><span class="ik">📜</span><small>Dönüş</small></button>' +
        '<button class="sarf-yuva" id="dKac" data-eylem="kac"><span class="ik">🏃</span><small>Kaç</small></button>' +
      '</div>' +
      '<i class="susleme sag"></i>' +
      '<div class="yuvarlaklar">' +
        '<button class="yuvarlak oto' + (o.ayar.otoSavas ? ' acik' : '') + '" data-eylem="otoSavasDegis"><span>' + (o.ayar.otoSavas ? '⚔️' : '✋') + '</span><small>' + (o.ayar.otoSavas ? 'Otomatik' : 'Elle') + '</small></button>' +
        '<button class="yuvarlak" id="dBoss" data-eylem="boss"' + (bossVar || kuleMi ? ' disabled' : '') + '><span>' + boss.ikon + '</span><small>BOSS</small></button>' +
      '</div>' +
    '</div>' +
    G.logHtml() +
    G.gorevSeritHtml() +
    (kuleMi ? G.kuleAltHtml() : G.bolgeAltHtml()) +
    '</div>';
  G.aksiyonGuncelle();
  G.sahaGuncelle();
  G.bossPlakaGuncelle();
};

// Sahada boss varken üstte ad, seviye ve büyük can çubuğu
G.bossPlakaGuncelle = function () {
  var el = G.$('bossPlaka');
  if (!el) return;
  var c = G.alan.filter(function (x) { return x && x.boss && !x.olu; })[0];
  if (!c) { el.classList.add('gizli'); return; }
  el.classList.remove('gizli');
  el.innerHTML = '<span class="bp-ikon">' + c.ikon + '</span><div class="bp-orta"><div class="bp-ust"><b>' + c.ad + ' (Sv. ' + c.lv + ')</b>' +
    (c.ofke ? '<span class="bp-ofke">ÖFKELİ</span>' : '') + '</div>' +
    '<div class="bp-cubuk"><i style="width:' + Math.max(0, c.hp / c.hpMax * 100) + '%"></i><span>' + Math.max(0, c.hp) + ' / ' + c.hpMax + '</span></div></div>';
};

// Ayarlar penceresi (referanstaki gibi otomatik seçenekler burada)
G.ayarlarModal = function () {
  var o = G.o;
  G.$('modalIc').innerHTML = '<h3>⚙️ Ayarlar</h3>' +
    '<label class="ayar-satir"><input type="checkbox" id="otoSavas"' + (o.ayar.otoSavas ? ' checked' : '') + '><span>Otomatik savaş<small>En yakın canavara kendin yürür, saldırır</small></span></label>' +
    '<label class="ayar-satir"><input type="checkbox" id="otoIksir"' + (o.ayar.otoIksir ? ' checked' : '') + '><span>Otomatik iksir<small>Can %40 altına inince, mana yetmeyince içer</small></span></label>' +
    '<label class="ayar-satir"><input type="checkbox" id="otoBeceri"' + (o.ayar.otoBeceri ? ' checked' : '') + '><span>Otomatik beceri<small>"Otomatik" işaretli becerileri sırayla kullanır</small></span></label>' +
    '<div class="modal-dugmeler"><button data-eylem="duyurular">📜 Duyurular</button><button data-eylem="secimeDon">↩ Karakter seçimi</button><button data-eylem="modalKapat">Kapat</button></div>';
  G.$('modal').classList.remove('gizli');
};

// Konumları, hedef işaretini ve oyuncu kartını günceller (her 100 ms)
G.sahaGuncelle = function () {
  if (!G.$('saha')) return;
  var o = G.o, r = G.hesapla(o), pk = G.hucreKonum(G.oyuncu.kol, G.oyuncu.sat);
  var ok = G.$('oyuncuKart');
  if (ok) { ok.style.left = pk.x + '%'; ok.style.top = pk.y + '%'; }
  G.$('okHp').style.width = Math.max(0, o.hp / r.hpMax * 100) + '%';
  G.$('okMp').style.width = Math.max(0, o.mp / r.mpMax * 100) + '%';
  G.$('okHpY').textContent = G.canYazi(o.hp, r.hpMax);
  G.$('okMpY').textContent = G.canYazi(o.mp, r.mpMax);
  G.alan.forEach(function (c, i) {
    var el = G.$('kart' + i);
    if (!el || !c) return;
    var p = G.hucreKonum(c.kol, c.sat);
    el.style.left = p.x + '%'; el.style.top = p.y + '%';
    el.classList.toggle('aktif', !!c.aktif && !c.olu);
    el.classList.toggle('hedef', G.hedefI === i);
  });
  var hi = G.$('hedefIsaret');
  if (G.hedefHucre) {
    var hk = G.hucreKonum(G.hedefHucre.kol, G.hedefHucre.sat);
    hi.classList.remove('gizli'); hi.style.left = hk.x + '%'; hi.style.top = hk.y + '%';
  } else hi.classList.add('gizli');
};

G.kartlariGuncelle = function () {
  G.alan.forEach(function (c, i) {
    var el = G.$('kart' + i);
    if (!el || !c) return;
    G.$('kh' + i).style.width = Math.max(0, c.hp / c.hpMax * 100) + '%';
    G.$('kt' + i).textContent = G.canYazi(c.hp, c.hpMax);
    el.classList.toggle('hedef', G.hedefI === i);
    el.classList.toggle('aktif', !!c.aktif && !c.olu);
    el.classList.toggle('yaniyor', !!c.dot && !c.olu);
  });
};

G.kartlariGuncelle2 = G.kartlariGuncelle;
G.kartlariGuncelle = function () { G.kartlariGuncelle2(); G.bossPlakaGuncelle(); };

G.kartYenile = function (i) {
  var el = G.$('kart' + i), c = G.alan[i];
  if (!c) return;
  if (el) el.outerHTML = G.kartHtml(c, i);
  else if (G.$('saha')) G.$('saha').insertAdjacentHTML('beforeend', G.kartHtml(c, i));
};

// Alan becerisinin vurduğu kareleri kısa süre göster (ızgara sadece bu anda görünür)
G.efektGoster = function (hucreler, sekil) {
  var saha = G.$('saha');
  if (!saha) return;
  hucreler.forEach(function (h) {
    var p = G.hucreKonum(h.kol, h.sat), el = document.createElement('span');
    el.className = 'efekt ' + sekil;
    el.style.left = p.x + '%'; el.style.top = p.y + '%';
    saha.appendChild(el);
    setTimeout(function () { el.remove(); }, 850);
  });
};

G.bolgeAfisi = function (ad) {
  var a = G.$('afis');
  if (!a) { a = document.createElement('div'); a.id = 'afis'; G.$('uygulama').appendChild(a); }
  a.textContent = ad;
  a.className = 'afis goster';
  clearTimeout(G._afisT);
  G._afisT = setTimeout(function () { a.className = 'afis'; }, 1600);
};

// Öğrenilen bütün aktif beceriler küçük düğmeler olarak (dokununca bir sonraki turda kullanılır)
G.beceriSirasiHtml = function () {
  var liste = G.ogrenilenler('aktif');
  if (!liste.length) return '<p class="soluk kucuk-not">Henüz aktif becerin yok. Canavarlardan kitap düştükçe öğrenirsin.</p>';
  return '<div class="beceri-sirasi">' + liste.map(function (id) {
    var b = G.BECERILER[id];
    return '<button class="beceri-dugme' + (G.otoAcikMi(id) ? ' oto' : '') + '" id="dB_' + id + '" data-eylem="beceri" data-b="' + id + '" aria-label="' + b.ad + '">' +
      '<span class="ik">' + b.ikon + '</span><span class="ad">' + b.ad + '</span><span class="bekleme" id="bk_' + id + '"></span></button>';
  }).join('') + '</div>';
};

G.aksiyonGuncelle = function () {
  var o = G.o, s = G.savas;
  if (!G.$('dKac')) return;
  G.$('sHp').textContent = o.sarf.hp;
  G.$('sMp').textContent = o.sarf.mp;
  G.$('bkHp').textContent = G.tehlikede() && G.iksirBek.hp > 0 ? G.iksirBek.hp : '';
  G.$('bkMp').textContent = G.tehlikede() && G.iksirBek.mp > 0 ? G.iksirBek.mp : '';
  G.ogrenilenler('aktif').forEach(function (id) {
    var el = G.$('dB_' + id);
    if (!el) return;
    var b = G.BECERILER[id], kalan = G.bekleme[id] || 0;
    el.disabled = !s || o.mp < b.mp || kalan > 0;
    el.classList.toggle('hazir', !!(s && s.istek === id));
    G.$('bk_' + id).textContent = kalan > 0 ? kalan : '';
  });
  var tehlike = G.tehlikede();
  G.$('dKac').disabled = !tehlike;
  if (G.$('dBoss')) G.$('dBoss').disabled = G.o.bolge === 'kule' || G.alan.some(function (c) { return c && c.boss && !c.olu; });
};

G.hasarGoster = function (i, h, krit, tur) {
  var el = G.$('kart' + G.kartKey(i));
  if (!el) return;
  el.classList.remove('vurus'); void el.offsetWidth; el.classList.add('vurus');
  var sp = document.createElement('span');
  sp.className = 'hasar' + (krit ? ' krit' : '') + (tur ? ' ' + tur : '');
  sp.style.marginLeft = Math.round(G.fx.rnd(-14, 14)) + 'px';
  sp.textContent = '-' + h;
  el.appendChild(sp);
  setTimeout(function () { sp.remove(); }, 1000);
};

// Oyuncunun aldığı hasar: sahadaysa kartının üstünde, değilse üst barda
G.oyuncuHasar = function (yazi) {
  var el = G.$('oyuncuKart');
  if (!el) return;
  var sp = document.createElement('span');
  sp.className = 'hasar oyuncu';
  sp.textContent = yazi;
  el.appendChild(sp);
  setTimeout(function () { sp.remove(); }, 900);
};

// Sana vurulunca kartın kırmızı yanıp söner
G.darbeEfekti = function () {
  var el = G.$('oyuncuKart');
  if (!el) return;
  el.classList.remove('darbe'); void el.offsetWidth; el.classList.add('darbe');
};

// ---- v0.20: Kuledeyken alt panel ----
G.kuleAltHtml = function () {
  var k = G.kuleKonum(G.kule ? G.kule.kat : 1);
  return '<div class="kule-alt"><div><b>🗼 Kule</b><span>Kademe ' + k.kademe + ' · Kat ' + k.kat + '</span>' +
    '<small>Bekçiyi süre bitmeden yen. Kulede ölmek tecrübe kaybettirmez.</small></div>' +
    '<button class="genis-dugme" data-eylem="parsomen">🏳️ Pes et</button></div>';
};
