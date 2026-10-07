// ============================================================
// kule.js — v0.20: Kule (süreli bekçi savaşı) ve rünler
// o.kule = { enYuksek, gunluk }  o.runler = [...]  o.runTakili = { tur: runId }
// ============================================================
G.kule = null;   // aktif meydan okuma: { kat, bitis }

G.kuleKonum = function (f) {   // f: 1..katToplam
  return { kademe: Math.ceil(f / G.KULE.katSayi), kat: (f - 1) % G.KULE.katSayi + 1 };
};

G.kuleBekci = function (f) {
  var K = G.KULE, k = G.kuleKonum(f), id = K.bekciler[k.kademe - 1];
  var c = G.canavarOlustur(id);
  var hc = K.bekciHp + (k.kat - 1) * K.bekciHpKat, ac = K.bekciAtk + (k.kat - 1) * K.bekciAtkKat;
  c.hp = c.hpMax = Math.round(c.hpMax * hc);
  c.atk = [Math.round(c.atk[0] * ac), Math.round(c.atk[1] * ac)];
  c.lv = c.lv + k.kat - 1;
  c.ad = c.ad + ' Bekçisi';
  c.boss = true; c.saldirgan = true; c.aktif = true; c.kuleBekci = true;
  return c;
};

G.kuleOdul = function (f) {
  return { para: 150 * f, sayfa: 5 + Math.floor(f / 3), oz: 10 + f * 2 };
};

G.kuleGir = function () {
  var o = G.o, f = o.kule.enYuksek + 1;
  if (f > G.KULE.katToplam) { G.bildir('Kulenin tepesindesin!'); return; }
  o.kuleDonus = G.bolgeBul(o.bolge).tur === 'kule' ? o.sonKasaba : o.bolge;
  G.kule = { kat: f, bitis: Date.now() + G.KULE.sure * 1000 };
  o.bolge = 'kule';
  G.alanDoldur();
  G.modalKapat();
  if (G.sekme !== 'savas') G.sekmeAc('savas'); else G.cizSavas();
  var k = G.kuleKonum(f);
  G.bolgeAfisi('Kule · Kademe ' + k.kademe + ' · Kat ' + k.kat);
};

// Her 100 ms: süre kontrolü ve sayaç
G.kuleTik = function () {
  if (!G.kule || !G.o || G.o.bolge !== 'kule') return;
  var kalan = Math.max(0, Math.ceil((G.kule.bitis - Date.now()) / 1000));
  var el = G.$('kuleSure');
  if (el) { el.textContent = 'Kalan süre ' + Math.floor(kalan / 60) + ':' + String(kalan % 60).padStart(2, '0'); el.classList.toggle('az', kalan <= 20); }
  if (kalan <= 0) G.kuleBitir(false, 'Süre doldu');
};

G.kuleBitir = function (basari, mesaj, odul, run) {
  var o = G.o, f = G.kule ? G.kule.kat : o.kule.enYuksek, k = G.kuleKonum(f);
  G.kule = null;
  var r = G.hesapla(o);
  o.hp = Math.max(o.hp, r.hpMax * 0.5);   // kuleden çıkınca biraz toparlan
  G.bolgeGit(o.kuleDonus || o.sonKasaba, true);
  G.$('modalIc').innerHTML = '<h3>🗼 Kademe ' + k.kademe + ' · Kat ' + k.kat + '</h3>' +
    '<p class="bilgi ' + (basari ? 'fark-arti' : 'fark-eksi') + '">' + mesaj + '</p>' +
    (odul ? '<p class="bilgi">Ödül: ' + G.odulYazi(odul) + '</p>' : '') +
    (run ? '<p class="bilgi">Rün: <b style="color:' + G.NADIRLIK[run.nadir].renk + '">' + G.runAd(run) + '</b></p>' : '') +
    '<div class="modal-dugmeler">' + (basari && o.kule.enYuksek < G.KULE.katToplam ? '<button data-eylem="kuleGir">Sonraki kat</button>' : '') +
    '<button data-eylem="modalKapat">Tamam</button></div>';
  G.$('modal').classList.remove('gizli');
};

// savas.js: bekçi ölünce
G.kuleZafer = function () {
  var o = G.o, f = G.kule.kat, odul = G.kuleOdul(f), run = null;
  o.kule.enYuksek = Math.max(o.kule.enYuksek, f);
  for (var k in odul) { if (k === 'para') o.para += odul[k]; else o.sarf[k] = (o.sarf[k] || 0) + odul[k]; }
  if (f % 3 === 0 || Math.random() < 0.35) run = G.runUret(f);
  G.log('🗼 Kule katı geçildi: ' + G.odulYazi(odul), 'kazanc');
  G.kaydet();
  G.kuleBitir(true, 'Bekçiyi yendin! Kat geçildi.', odul, run);
};

G.kuleGunlukOdul = function () {
  var o = G.o, f = o.kule.enYuksek;
  return f ? { para: 300 * f, oz: 5 * f } : null;
};
G.kuleGunlukAl = function () {
  var o = G.o, od = G.kuleGunlukOdul();
  if (!od) { G.bildir('Önce en az bir kat geç.'); return; }
  if (o.kule.gunluk === G.bugun()) { G.bildir('Bugünün ödülünü aldın. Yarın gel.'); return; }
  o.kule.gunluk = G.bugun();
  for (var k in od) { if (k === 'para') o.para += od[k]; else o.sarf[k] = (o.sarf[k] || 0) + od[k]; }
  G.bildir('Günlük kule ödülü: ' + G.odulYazi(od));
  G.kaydet(); G.panelYenile(); G.ustGuncelle();
};

// ---- Rünler ----
G.runUret = function (f) {
  var o = G.o, turler = Object.keys(G.RUN_TUR);
  var nadir = Math.max(1, Math.min(4, G.nadirlikSec(1 + f / 8)));
  var r = { id: o.sonrakiId++, tur: turler[Math.floor(Math.random() * turler.length)], nadir: nadir, lv: 1 };
  o.runler.push(r);
  return r;
};
G.runAd = function (r) { return G.NADIRLIK[r.nadir].ad + ' ' + G.RUN_TUR[r.tur].ad + ' Rünü' + (r.lv > 1 ? ' +' + (r.lv - 1) : ''); };
G.runDeger = function (r) {
  var v = G.RUN_TUR[r.tur].taban * G.RUN_NADIR[r.nadir] * (1 + 0.15 * (r.lv - 1));
  return Math.round(v * 10) / 10;
};
G.runBul = function (id) { return G.o.runler.filter(function (r) { return r.id === id; })[0]; };
G.runTakiliMi = function (r) { return G.o.runTakili[r.tur] === r.id; };
G.runYukseltMaliyet = function (r) { return 8 * r.lv * r.nadir; };
G.runEritGetiri = function (r) { return 5 * r.nadir * r.lv; };

G.runTak = function (id) {
  var r = G.runBul(id);
  if (!r) return;
  G.o.runTakili[r.tur] = r.id;
  G.statSinirla(); G.kaydet(); G.modalKapat(); G.panelYenile(); G.ustGuncelle();
};
G.runCikar = function (id) {
  var r = G.runBul(id);
  if (!r) return;
  if (G.runTakiliMi(r)) delete G.o.runTakili[r.tur];
  G.statSinirla(); G.kaydet(); G.modalKapat(); G.panelYenile(); G.ustGuncelle();
};
G.runYukselt = function (id) {
  var o = G.o, r = G.runBul(id);
  if (!r) return;
  if (r.lv >= G.RUN_MAKS) { G.bildir('En yüksek seviyede.'); return; }
  var m = G.runYukseltMaliyet(r);
  if (o.sarf.oz < m) { G.bildir(m + ' Rün Özü gerekiyor.'); return; }
  o.sarf.oz -= m; r.lv++;
  G.statSinirla(); G.kaydet(); G.ustGuncelle(); G.runModal(id); G.panelYenile();
};
G.runErit = function (id) {
  var o = G.o, r = G.runBul(id);
  if (!r) return;
  if (G.runTakiliMi(r)) { G.bildir('Takılı rün eritilmez.'); return; }
  o.sarf.oz += G.runEritGetiri(r);
  o.runler = o.runler.filter(function (x) { return x.id !== id; });
  G.bildir('+' + G.runEritGetiri(r) + ' Rün Özü');
  G.kaydet(); G.modalKapat(); G.panelYenile();
};
