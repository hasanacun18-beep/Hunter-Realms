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
  return '<button class="kart saha-kart' + (c.boss ? ' boss' : '') + (c.elit ? ' elit' : '') + (c.olu ? ' olu' : '') + (hedef ? ' hedef' : '') + (c.aktif ? ' aktif' : '') + '" id="kart' + i + '"' +
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
      '<span class="mh-dugmeler"><button data-eylem="ayarlar">' + G.ikon('carh') + ' Ayarlar</button><button data-eylem="bolgeBilgi" data-b="' + b.id + '">' + G.ikon('kitap') + ' Bilgi</button></span>' +
    '</div>' + G.zincirDugumHtml() + '</div>';
};

// Kasaba ekranı gibi başka yerler eski adı kullanıyorsa
G.zincirHtml = G.bolgeAltHtml;

G.cizSavas = function () {
  var o = G.o, b = G.bolgeBul(o.bolge);
  if (b.tur === 'kasaba') { G.cizKasaba(); return; }
  var kuleMi = b.tur === 'kule';
  var boss = G.CANAVARLAR[b.boss] || { ikon: G.ikon('iskelet') };
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
        '<button class="sarf-yuva" id="dHp" data-eylem="iksir" data-t="hp"><span class="say" id="sHp"></span><span class="ik can">' + G.ikon('iksir') + '</span><small>Can</small><span class="bekleme" id="bkHp"></span></button>' +
        '<button class="sarf-yuva" id="dMp" data-eylem="iksir" data-t="mp"><span class="say" id="sMp"></span><span class="ik mana">' + G.ikon('iksir') + '</span><small>Mana</small><span class="bekleme" id="bkMp"></span></button>' +
        '<button class="sarf-yuva" id="dParsomen" data-eylem="parsomen"><span class="say">' + o.sarf.parsomen + '</span><span class="ik">' + G.ikon('parsomen') + '</span><small>Dönüş</small></button>' +
        '<button class="sarf-yuva" id="dKac" data-eylem="kac"><span class="ik">' + G.ikon('kapi') + '</span><small>Kaç</small></button>' +
      '</div>' +
      '<i class="susleme sag"></i>' +
      '<div class="yuvarlaklar">' +
        '<button class="yuvarlak oto' + (o.ayar.otoSavas ? ' acik' : '') + '" data-eylem="otoSavasDegis"><span>' + G.ikon(o.ayar.otoSavas ? 'kiliclar' : 'eldiven') + '</span><small>' + (o.ayar.otoSavas ? 'Otomatik' : 'Elle') + '</small></button>' +
        '<button class="yuvarlak" id="dBoss" data-eylem="boss"' + (kuleMi ? ' disabled' : '') + '><span>' + boss.ikon + '</span><small id="dBossYazi">BOSS</small></button>' +
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
    '<small class="bp-sahip">Sahibi: ' + G.kacis(G.o.ad) + '</small>' +
    (c.ofke ? '<span class="bp-ofke">ÖFKELİ</span>' : '') + '</div>' +
    '<div class="bp-cubuk"><i style="width:' + Math.max(0, c.hp / c.hpMax * 100) + '%"></i><span>' + Math.max(0, c.hp) + ' / ' + c.hpMax + '</span></div></div>';
};

// Ayarlar penceresi (referanstaki gibi otomatik seçenekler burada)
G.ayarlarModal = function () {
  var o = G.o;
  G.$('modalIc').innerHTML = '<h3>' + G.ikon('carh') + ' Ayarlar</h3>' +
    '<label class="ayar-satir"><input type="checkbox" id="otoSavas"' + (o.ayar.otoSavas ? ' checked' : '') + '><span>Otomatik savaş<small>En yakın canavara kendin yürür, saldırır</small></span></label>' +
    '<label class="ayar-satir"><input type="checkbox" id="otoIksir"' + (o.ayar.otoIksir ? ' checked' : '') + '><span>Otomatik iksir<small>Can %40 altına inince, mana yetmeyince içer</small></span></label>' +
    '<label class="ayar-satir"><input type="checkbox" id="otoBeceri"' + (o.ayar.otoBeceri ? ' checked' : '') + '><span>Otomatik beceri<small>"Otomatik" işaretli becerileri sırayla kullanır</small></span></label>' +
    '<label class="ayar-satir"><input type="checkbox" id="ses"' + (o.ayar.ses !== false ? ' checked' : '') + '><span>Ses<small>Vuruş, kritik, ölüm, iksir ve seviye sesleri</small></span></label>' +
    '<div class="modal-dugmeler"><button data-eylem="duyurular">' + G.ikon('parsomen') + ' Duyurular</button><button data-eylem="secimeDon">↩ Karakter seçimi</button><button data-eylem="modalKapat">Kapat</button></div>';
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
  G.$('saha').classList.toggle('kritik-can', o.hp > 0 && o.hp < r.hpMax * 0.3);  // v0.22: düşük can uyarısı
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
  if (G.$('dBoss')) G.$('dBoss').disabled = G.o.bolge === 'kule';
};

G.hasarGoster = function (i, h, krit, tur) {
  var el = G.$('kart' + G.kartKey(i));
  if (!el) return;
  el.classList.remove('vurus'); void el.offsetWidth; el.classList.add('vurus');
  var sp = document.createElement('span');
  sp.className = 'hasar' + (krit ? ' krit' : '') + (tur ? ' ' + tur : '');
  sp.style.marginLeft = Math.round(G.fx.rnd(-14, 14)) + 'px';
  sp.innerHTML = (krit ? '<small>KRİTİK</small>' : '') + '-' + h;
  el.appendChild(sp);
  // v0.22: kritikte kart parlar, saha hafifçe sarsılır
  if (krit) { G.sinifTekrar(el, 'krit-flas'); G.sahaSars('hafif'); }
  if (tur !== 'dot') G.sesCal(krit ? 'krit' : tur === 'beceri' ? 'beceri' : 'vurus');
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
G.darbeEfekti = function (oran) {
  var el = G.$('oyuncuKart');
  if (!el) return;
  G.sinifTekrar(el, 'darbe');
  G.sesCal('darbe', oran);
  // v0.22: canının %12'sinden fazlasını götüren darbe: sert sarsıntı + kırmızı kenar
  if (oran >= 0.12) { G.sahaSars('sert'); G.sinifTekrar(G.$('saha'), 'tehlike-flas'); }
};

// ---- v0.26: boss replikleri (veri.js → G.BOSS_REPLIK) ----
// Günlüğe yazar ve boss plakasının altında birkaç saniye gösterir. Kule bekçilerinde çıkmaz.
G.bossReplik = function (c, an) {
  var r = !c.kuleBekci && G.BOSS_REPLIK[c.id], metin = r && r[an];
  if (!metin) return;
  G.log('<i>' + metin + '</i>', 'replik');
  var saha = G.$('saha');
  if (!saha) return;
  var eski = saha.querySelector('.boss-soz');
  if (eski) eski.remove();
  var el = document.createElement('div');
  el.className = 'boss-soz';
  el.innerHTML = '<span class="bs-ikon">' + c.ikon + '</span><span>' + metin + '</span>';
  saha.appendChild(el);
  setTimeout(function () { el.remove(); }, 5200);
};

// ---- v0.22: vuruş hissi ----
// Bir CSS animasyon sınıfını baştan oynatır
G.sinifTekrar = function (el, sinif) {
  if (!el) return;
  el.classList.remove(sinif); void el.offsetWidth; el.classList.add(sinif);
};
G.sahaSars = function (guc) {
  var saha = G.$('saha');
  if (!saha) return;
  // Sert sarsıntı sürerken hafif olanı başlatma (sert olan yarıda kesilmesin)
  if (guc === 'hafif' && Date.now() - (G.sertSarsZaman || 0) < 320) return;
  if (guc === 'sert') G.sertSarsZaman = Date.now();
  saha.classList.remove('sars-hafif', 'sars-sert'); void saha.offsetWidth; saha.classList.add('sars-' + guc);
};
// Canavar ölünce kart kızıl parlayıp küçülerek solar (sadece o anda; sonradan çizilen ölü kartlar oynatmaz)
G.olumEfekti = function (i) {
  var el = G.$('kart' + i);
  if (el) el.classList.add('oluyor');
  G.sesCal('olum');
};

// ---- v0.20: Kuledeyken alt panel ----
G.kuleAltHtml = function () {
  var k = G.kuleKonum(G.kule ? G.kule.kat : 1);
  return '<div class="kule-alt"><div><b>' + G.ikon('kule') + ' Kule</b><span>Kademe ' + k.kademe + ' · Kat ' + k.kat + '</span>' +
    '<small>Bekçiyi süre bitmeden yen. Kulede ölmek tecrübe kaybettirmez.</small></div>' +
    '<button class="genis-dugme" data-eylem="parsomen">' + G.ikon('kapi') + ' Pes et</button></div>';
};

// ============================================================
// v0.30 — BOSS PANELİ (BOSS düğmesi): bütün bosslar, durum / geri sayım, önerilen GP, Çağır / Işınlan
// ============================================================
G.bossListeModal = function () {
  var o = G.o, cp = G.hesapla(o).cp;
  var satirlar = G.BOLGELER.filter(function (b) { return b.boss; }).map(function (b) {
    var c = G.CANAVARLAR[b.boss], kilit = o.lv < b.minLv, gp = G.onerilenGP(b), burada = o.bolge === b.id;
    // v0.31: bulunduğun bölgenin bossu kendiliğinden doğar ("Burada"); başka bölgeye "Işınlan"
    var dugme = kilit ? '<button disabled>Sv. ' + b.minLv + '</button>'
      : burada ? '<button disabled>Burada</button>'
      : '<button data-eylem="bossIsinlan" data-id="' + b.boss + '" class="bl-dugme" data-boss="' + b.boss + '">Işınlan</button>';
    return '<div class="bl-satir' + (kilit ? ' kilitli' : '') + (burada ? ' burada' : '') + '">' +
      '<span class="bl-ikon">' + c.ikon + '</span>' +
      '<div class="bl-orta"><b>' + c.ad + ' <small>Sv. ' + c.lv + '</small></b><small>' + b.ad + '</small></div>' +
      '<div class="bl-durum"><span class="bl-sure" data-boss="' + b.boss + '"></span>' +
        '<small>GP <em class="' + (cp >= gp ? 'fark-arti' : 'fark-eksi') + '">' + gp + '</em></small></div>' +
      dugme + '</div>';
  }).join('');
  G.$('modalIc').innerHTML = '<h3>' + G.ikon('kiliclar') + ' Bosslar</h3>' +
    '<div class="boss-liste" id="bossListe">' + satirlar + '</div>' +
    '<p class="bilgi soluk">Süresi dolan boss, sen bölgesindeyken sahada kendiliğinden belirir. Yenilince süre yeniden başlar; oyun kapalıyken de işler.</p>' +
    '<div class="modal-dugmeler"><button data-eylem="modalKapat">Kapat</button></div>';
  G.$('modal').classList.remove('gizli');
  G.bossSayac();
};

// Her saniye: paneldeki durumlar ve sahadaki BOSS düğmesinin geri sayımı
G.bossSayac = function () {
  if (!G.o) return;
  var liste = G.$('bossListe');
  if (liste && !G.$('modal').classList.contains('gizli')) {
    liste.querySelectorAll('.bl-sure').forEach(function (el) {
      var k = G.bossKalan(el.getAttribute('data-boss'));
      el.textContent = k ? G.sureYazi(k) : 'Hazır';
      el.className = 'bl-sure ' + (k ? 'bekliyor' : 'hazir');
    });
    liste.querySelectorAll('.bl-dugme').forEach(function (el) {
      el.disabled = !!G.bossKalan(el.getAttribute('data-boss'));
    });
  }
  var yazi = G.$('dBossYazi'), b = G.bolgeBul(G.o.bolge);
  if (yazi && b && b.boss) {
    var k = G.bossKalan(b.boss);
    yazi.textContent = k ? G.sureYazi(k) : 'BOSS';
    G.$('dBoss').classList.toggle('bekliyor', !!k);
  }
};
