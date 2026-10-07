// ============================================================
// arayuz-giris.js — v0.13: Karşılama, karakter seçimi, karakter oluşturma
// ============================================================
G.secimSlot = 0;
G.olusturSlot = 0;
G.secilenSinif = 'savasci';

// ---- Karşılama ekranı ----
G.cizBaslik = function () {
  var korlar = '';
  for (var i = 0; i < 18; i++) {
    korlar += '<i class="kor" style="left:' + Math.round(Math.random() * 100) + '%;animation-delay:' + (Math.random() * 6).toFixed(2) +
      's;animation-duration:' + (5 + Math.random() * 5).toFixed(2) + 's"></i>';
  }
  G.$('baslik').innerHTML =
    '<div class="baslik-sahne">' +
      '<div class="baslik-gok"></div>' +
      '<svg class="baslik-daglar" viewBox="0 0 400 220" preserveAspectRatio="none" aria-hidden="true">' +
        '<path class="d1" d="M0 130 L40 90 L70 110 L120 50 L160 95 L200 70 L240 105 L290 40 L330 90 L370 70 L400 95 L400 220 L0 220 Z"/>' +
        '<path class="d2" d="M0 170 L50 135 L90 155 L140 115 L190 150 L230 125 L280 160 L330 120 L370 150 L400 135 L400 220 L0 220 Z"/>' +
      '</svg>' +
      '<div class="sis s1"></div><div class="sis s2"></div>' +
      '<div class="korlar">' + korlar + '</div>' +
      '<button class="duyuru-dugme" data-eylem="duyurular"><span>📜</span>Duyurular</button>' +
      '<div class="baslik-yazi"><h1>HUNTER REALMS</h1><p>Karanlık topraklarda bir efsane</p></div>' +
      '<div class="baslik-alt">' +
        '<button class="sus-dugme" data-eylem="baslikBasla"><span>Oyuna Başla</span></button>' +
        '<p class="baslik-not">Kayıtların bu cihazda saklanır.</p>' +
      '</div>' +
    '</div>';
  G.ekranGoster('baslik');
};

G.duyuruModal = function () {
  G.$('modalIc').innerHTML = '<h3>📜 Duyurular</h3>' +
    G.DUYURULAR.map(function (d) { return '<div class="duyuru"><b>' + d[0] + '</b><span>' + d[1] + '</span></div>'; }).join('') +
    '<div class="modal-dugmeler"><button data-eylem="modalKapat">Anladım</button></div>';
  G.$('modal').classList.remove('gizli');
};

// ---- Karakter seçimi: 3 kemerli kapı ----
G.cizSecim = function () {
  var slotlar = [];
  for (var i = 0; i < G.SLOT_SAYI; i++) slotlar.push(G.slotYukle(i));
  if (!slotlar[G.secimSlot]) {
    var ilk = slotlar.findIndex(function (x) { return !!x; });
    if (ilk >= 0) G.secimSlot = ilk;
  }
  var sec = slotlar[G.secimSlot];
  var kapilar = slotlar.map(function (k, i) {
    var secili = i === G.secimSlot && k;
    return '<button class="kapi' + (secili ? ' secili' : '') + (k ? '' : ' bos') + '" data-eylem="secimSlot" data-i="' + i + '">' +
      '<span class="kapi-ic">' + (k ? G.siluetSvg(k.sinif) : '<span class="olustur-yazi">Oluşturmak<br>için dokun</span>') + '</span>' +
      (secili ? '<i class="mesale sol"></i><i class="mesale sag"></i>' : '') +
      '</button>';
  }).join('');
  var bilgi = sec
    ? '<div class="secim-bilgi"><div><span>Ad</span><b class="altin">' + G.kacis(sec.ad) + '</b></div>' +
        '<div><span>Seviye</span><b>' + sec.lv + '</b></div>' +
        '<div><span>Sınıf</span><b>' + G.SINIFLAR[sec.sinif].ad + '</b></div></div>' +
      '<div class="secim-dugmeler"><button class="sus-dugme" data-eylem="oyunaGir"><span>Oyuna Gir</span></button>' +
      '<button class="sil-dugme" data-eylem="karakterSil" data-i="' + G.secimSlot + '">Sil</button></div>' +
      '<button class="geri-dugme yedek-ortali" data-eylem="disaAktar" data-i="' + G.secimSlot + '">📤 Dışa Aktar (Yedekle)</button>'
    : '<p class="secim-bos">Henüz karakterin yok. Bir kapıya dokunarak oluştur.</p>' +
      '<button class="geri-dugme yedek-ortali" data-eylem="iceAktarModal" data-i="' + G.secimSlot + '">📥 İçe Aktar (Yedekten yükle)</button>';
  G.$('secim').innerHTML =
    '<div class="giris-sahne">' +
      '<h2 class="suslu-baslik">Karakter Seç</h2>' +
      '<div class="kapilar">' + kapilar + '</div>' +
      '<div class="kaide-cizgi"></div>' + bilgi +
      '<button class="geri-dugme" data-eylem="baslikDon">← Karşılama</button>' +
    '</div>';
  G.ekranGoster('secim');
};

G.secimSlotSec = function (i) {
  if (!G.slotYukle(i)) { G.olusturSlot = i; G.cizOlustur(); return; }
  G.secimSlot = i;
  G.cizSecim();
};

G.oyunaGir = function () {
  var k = G.slotYukle(G.secimSlot);
  if (!k) return;
  G.aktifSlot = G.secimSlot;
  try { localStorage.setItem('karadiyar_aktif', String(G.aktifSlot)); } catch (e) {}
  G.o = k;
  G.oyunBaslat();
};

// ---- Karakter oluşturma ----
G.cizOlustur = function () {
  var s = G.SINIFLAR[G.secilenSinif];
  var siniflar = Object.keys(G.SINIFLAR).map(function (k) {
    return '<button class="sinif-yuvarlak' + (k === G.secilenSinif ? ' secili' : '') + '" data-eylem="olusturSinif" data-s="' + k + '">' +
      '<span class="ik">' + G.SINIFLAR[k].ikon + '</span><b>' + G.SINIFLAR[k].ad + '</b></button>';
  }).join('');
  var eskiAd = G.$('olusturAd') ? G.$('olusturAd').value : '';
  G.$('olustur').innerHTML =
    '<div class="giris-sahne">' +
      '<h2 class="suslu-baslik">Karakter Oluştur</h2>' +
      '<div class="kaide"><div class="kaide-figur">' + G.siluetSvg(G.secilenSinif) + '</div>' +
        '<i class="mesale sol"></i><i class="mesale sag"></i><div class="kaide-tas"></div></div>' +
      '<div class="sinif-hikaye"><b>' + s.ad + '</b> · Menzil ' + s.menzil + ' kare<br>' + s.hikaye + '</div>' +
      '<div class="sinif-yuvarlaklar">' + siniflar + '</div>' +
      '<div class="ad-satir"><input id="olusturAd" class="girdi" maxlength="14" placeholder="Karakter adı" autocomplete="off" value="' + G.kacis(eskiAd) + '">' +
        '<button class="zar" data-eylem="zar" aria-label="Rastgele ad">🎲</button></div>' +
      '<div class="secim-dugmeler"><button class="geri-dugme" data-eylem="secimDon">← Geri</button>' +
        '<button class="sus-dugme" data-eylem="olusturOnay"><span>Oyuna Gir</span></button></div>' +
      '<button class="geri-dugme yedek-ortali" data-eylem="iceAktarModal" data-i="' + G.olusturSlot + '">📥 Zaten bir yedeğin mi var? İçe Aktar</button>' +
    '</div>';
  G.ekranGoster('olustur');
};

G.rastgeleAd = function () {
  var P = G.AD_PARCALARI;
  var ad = P.bas[Math.floor(Math.random() * P.bas.length)] + P.son[Math.floor(Math.random() * P.son.length)];
  G.$('olusturAd').value = ad;
};

G.olusturOnay = function () {
  var ad = G.$('olusturAd').value.trim();
  if (ad.length < 2) { G.bildir('Ad en az 2 harf olmalı.'); return; }
  G.o = G.yeniOyuncu(ad, G.secilenSinif);
  G.aktifSlot = G.olusturSlot; G.secimSlot = G.olusturSlot;
  try { localStorage.setItem('karadiyar_aktif', String(G.aktifSlot)); } catch (e) {}
  G.kaydet();
  G.oyunBaslat();
};
